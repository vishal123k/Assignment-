import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
    Image
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import API from "../api/axios";

export default function ProfileSetup({ navigation }: any) {

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [interests, setInterests] = useState("");
    const [contact, setContact] = useState("");
    const [image, setImage] = useState<string | null>(null);


    const [loading, setLoading] = useState(false);

    //fetch existing user data
    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {

            const res = await API.get("/user");

            if (res.data) {

                setName(res.data.name || "");
                setBio(res.data.bio || "");

                //convert interests array to commaseparated string
                setInterests(
                    res.data.interests?.join(",") || ""
                );

                setContact(res.data.contactInfo || "");
                setImage(res.data.profileImage || null);
            }

        } catch { }
    };


    const pickImage = async () => {

        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Permission required");
            return;
        }

        const result =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.7
            });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };


    const saveProfile = async () => {

        if (!name.trim())
            return Alert.alert("Name required");

        if (!bio.trim())
            return Alert.alert("Bio required");

        setLoading(true);

        try {

            const formData = new FormData();

            formData.append("name", name);
            formData.append("bio", bio);
            formData.append("contactInfo", contact);

            //convert interests string into array
            formData.append(
                "interests",
                JSON.stringify(
                    interests
                        .split(",")
                        .map(i => i.trim())
                        .filter(Boolean)
                )
            );

            if (image && !image.startsWith("http")) {
                formData.append("profileImage", {
                    uri: image,
                    name: "profile.jpg",
                    type: "image/jpeg"
                } as any);
            }

            await API.put("/user", formData);

            navigation.replace("PetSetup");

        } catch (error: any) {

            Alert.alert(
                "Error",
                error?.response?.data?.message ||
                "Profile save failed"
            );

        } finally {
            setLoading(false);
        }
    };



    return (


        <KeyboardAvoidingView
            className="flex-1 bg-[#F7F8FA]"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >

            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
            >

                <View className="px-6 pt-20">


                    <Text className="text-4xl font-extrabold text-center text-gray-900">
                        Your Profile
                    </Text>


                    <Text className="text-gray-500 text-center mt-2 mb-10">
                        Tell us about yourself
                    </Text>


                    <TouchableOpacity
                        onPress={pickImage}
                        className="self-center mb-6"
                    >

                        <Image
                            source={{
                                uri:
                                    image ||
                                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }}
                            className="w-32 h-32 rounded-full"
                        />

                        <Text className="text-center text-indigo-600 mt-2 font-semibold">
                            Change Photo
                        </Text>

                    </TouchableOpacity>




                    <View className="bg-white p-6 rounded-[30px] shadow-sm">

                        <TextInput
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                            className="border border-gray-200 p-4 rounded-xl mb-4"
                        />

                        <TextInput
                            placeholder="Bio"
                            value={bio}
                            onChangeText={setBio}
                            className="border border-gray-200 p-4 rounded-xl mb-4"
                        />

                        <TextInput
                            placeholder="Interests (comma separated)"
                            value={interests}
                            onChangeText={setInterests}
                            className="border border-gray-200 p-4 rounded-xl mb-4"
                        />

                        <TextInput
                            placeholder="Contact Info"
                            value={contact}
                            onChangeText={setContact}
                            className="border border-gray-200 p-4 rounded-xl"
                        />

                    </View>




                    <TouchableOpacity
                        disabled={loading}
                        className={`p-5 rounded-xl mt-10 ${loading
                            ? "bg-gray-400"
                            : "bg-indigo-500"
                            }`}
                        onPress={saveProfile}
                    >

                        {loading
                            ? <ActivityIndicator color="white" />
                            : (
                                <Text className="text-white text-center font-bold text-lg">
                                    Save Profile
                                </Text>
                            )}

                    </TouchableOpacity>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
