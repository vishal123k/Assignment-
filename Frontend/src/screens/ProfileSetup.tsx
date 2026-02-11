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

import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import API from "../api/axios";

export default function ProfileSetup({ navigation }: any) {

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [interests, setInterests] = useState("");
    const [contact, setContact] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await API.get("/user");

            if (res.data) {
                setName(res.data.name || "");
                setBio(res.data.bio || "");
                setInterests(res.data.interests?.join(",") || "");
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

            await API.put("/user", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

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

        <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >

                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingBottom: 40
                    }}
                >

                    <View style={{ marginTop: 40 }}>

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

                        <View className="bg-white p-6 rounded-[30px]">

                            <TextInput
                                placeholder="Full Name"
                                placeholderTextColor="#6B7280"
                                value={name}
                                onChangeText={setName}
                                className="border border-gray-200 p-4 rounded-xl mb-4 text-black"
                            />

                            <TextInput
                                placeholder="Bio"
                                placeholderTextColor="#6B7280"
                                value={bio}
                                onChangeText={setBio}
                                className="border border-gray-200 p-4 rounded-xl mb-4 text-black"
                            />

                            <TextInput
                                placeholder="Interests (comma separated)"
                                placeholderTextColor="#6B7280"
                                value={interests}
                                onChangeText={setInterests}
                                className="border border-gray-200 p-4 rounded-xl mb-4 text-black"
                            />

                            <TextInput
                                placeholder="Contact Info"
                                placeholderTextColor="#6B7280"
                                value={contact}
                                onChangeText={setContact}
                                className="border border-gray-200 p-4 rounded-xl text-black"
                            />

                        </View>

                        <TouchableOpacity
                            disabled={loading}
                            onPress={saveProfile}
                            style={{
                                height: 58,
                                justifyContent: "center",
                                borderRadius: 14,
                                marginTop: 30,
                                backgroundColor: loading ? "#9CA3AF" : "#6366F1"
                            }}
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

        </SafeAreaView>
    );
}
