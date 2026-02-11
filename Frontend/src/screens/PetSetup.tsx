import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import API from "../api/axios";

export default function PetSetup({ navigation, route }: any) {

  const pet = route?.params?.pet ?? null;
  const isEdit = !!pet;

  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [vaccinated, setVaccinated] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pet) {
      setPetName(pet.petName);
      setBreed(pet.breed);
      setGender(pet.gender);
      setAge(pet.age?.toString() || "");
      setWeight(pet.weight?.toString() || "");
      setVaccinated(pet.vaccinated);
      setImage(pet.image);
    }
  }, []);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePet = async () => {

    if (!petName || !breed)
      return Alert.alert("Fill all fields");

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("petName", petName);
      formData.append("breed", breed);
      formData.append("gender", gender);
      formData.append("age", age);
      formData.append("weight", weight);
      formData.append("vaccinated", vaccinated.toString());

      if (image && !image.startsWith("http")) {
        formData.append("image", {
          uri: image,
          name: "pet.jpg",
          type: "image/jpeg"
        } as any);
      }

      if (isEdit) {
        await API.put(`/pet/${pet._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/pet", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigation.navigate("MyProfile");

    } catch {
      Alert.alert("Operation failed");
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>

      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingBottom: 40
        }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View className="flex-row justify-between items-center mb-6 mt-4">
          <Text className="text-3xl font-bold">
            {isEdit ? "Edit Pet" : "Create Pet"}
          </Text>

          {!isEdit && (
            <TouchableOpacity
              onPress={() => navigation.replace("MyProfile")}
              className="border border-indigo-500 px-3 py-1 rounded-full"
            >
              <Text className="text-indigo-500 font-semibold">
                Skip
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Image Upload */}
        <TouchableOpacity
          onPress={pickImage}
          className="h-44 bg-gray-100 rounded-3xl justify-center items-center mb-6 overflow-hidden"
        >
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-full h-full"
            />
          ) : (
            <Text className="text-gray-400">
              Tap to upload image
            </Text>
          )}
        </TouchableOpacity>

        {/* Form Card */}
        <View className="bg-white p-5 rounded-3xl">

          <TextInput
            placeholder="Pet Name"
            placeholderTextColor="#6B7280"
            value={petName}
            onChangeText={setPetName}
            className="border border-gray-200 p-4 rounded-2xl mb-3 text-black"
          />

          <TextInput
            placeholder="Breed"
            placeholderTextColor="#6B7280"
            value={breed}
            onChangeText={setBreed}
            className="border border-gray-200 p-4 rounded-2xl mb-3 text-black"
          />

          <Text className="font-semibold mb-2">
            Gender
          </Text>

          <View className="flex-row mb-4">

            <TouchableOpacity
              className={`flex-1 p-4 rounded-2xl mr-2 ${
                gender === "Male"
                  ? "bg-indigo-500"
                  : "bg-gray-200"
              }`}
              onPress={() => setGender("Male")}
            >
              <Text className={`text-center ${
                gender === "Male"
                  ? "text-white"
                  : "text-black"
              }`}>
                Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 p-4 rounded-2xl ${
                gender === "Female"
                  ? "bg-indigo-500"
                  : "bg-gray-200"
              }`}
              onPress={() => setGender("Female")}
            >
              <Text className={`text-center ${
                gender === "Female"
                  ? "text-white"
                  : "text-black"
              }`}>
                Female
              </Text>
            </TouchableOpacity>

          </View>

          <TextInput
            placeholder="Age"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
            className="border border-gray-200 p-4 rounded-2xl mb-3 text-black"
          />

          <TextInput
            placeholder="Weight"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            className="border border-gray-200 p-4 rounded-2xl mb-3 text-black"
          />

          <View className="flex-row justify-between items-center mt-2">
            <Text className="font-semibold">
              Vaccinated
            </Text>

            <Switch
              value={vaccinated}
              onValueChange={setVaccinated}
            />
          </View>

        </View>

        {/* Button */}
        <TouchableOpacity
          disabled={loading}
          onPress={handlePet}
          style={{
            height: 56,
            justifyContent: "center",
            borderRadius: 16,
            marginTop: 24,
            backgroundColor: loading ? "#9CA3AF" : "#6366F1"
          }}
        >
          {loading
            ? <ActivityIndicator color="white" />
            : (
              <Text className="text-white text-center font-bold text-lg">
                {isEdit ? "Update Pet" : "Create Pet"}
              </Text>
            )}
        </TouchableOpacity>

      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
