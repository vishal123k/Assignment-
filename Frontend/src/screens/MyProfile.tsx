import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/axios";

export default function MyProfile({ navigation }: any) {

  //state to store user profile data
  const [user, setUser] = useState<any>(null);

  //state to store user pets list
  const [pets, setPets] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);


  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );


  //Fetch user and pet data from backend
  const loadData = async () => {
    try {

      const u = await API.get("/user"); // get user details
      const p = await API.get("/pet");  // get pets list

      setUser(u.data);
      setPets(p.data);

    } catch {
      console.log("Profile load error");
    } finally {
      setLoading(false);
    }
  };


  //Delete pet with confirmation alert
  const deletePet = (id: string) => {

    Alert.alert(
      "Delete Pet",
      "Are you sure you want to delete this pet?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await API.delete(`/pet/${id}`);
              loadData(); //refresh list after delete
            } catch {
              Alert.alert("Error", "Delete failed");
            }
          }
        }
      ]
    );
  };


  //clear token
  const logout = async () => {
    await AsyncStorage.removeItem("token");

    delete API.defaults.headers.Authorization;

    navigation.replace("Auth");
  };


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (

    <ScrollView
      style={{ flex: 1, backgroundColor: "#F7F8FA" }}
      contentContainerStyle={{
        padding: 20,
        paddingTop: 60,
        paddingBottom: 100
      }}
      showsVerticalScrollIndicator={false}
    >

      <View className="flex-row items-center mb-6">

        <TouchableOpacity
          onPress={() => navigation.navigate("PetSetup")}
          className="mr-2"
        >
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <Text className="text-3xl font-bold">
          My Profile
        </Text>

      </View>

      <View
        className="bg-white p-6 rounded-3xl mb-8"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 4
        }}
      >

        <View className="items-center mb-4">

          {user?.profileImage ? (

            <Image
              source={{ uri: user.profileImage }}
              className="w-28 h-28 rounded-full"
            />

          ) : (

            <View className="w-28 h-28 rounded-full bg-indigo-500 justify-center items-center">
              <Text className="text-white text-3xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </Text>
            </View>

          )}

          <Text className="text-xl font-bold mt-4">
            {user?.name}
          </Text>

        </View>

        <Text className="text-gray-700 text-center mb-2">
          {user?.bio}
        </Text>

        <Text className="text-gray-500 text-center">
          {user?.interests?.join(" • ")}
        </Text>

      </View>


      <View className="flex-row justify-between items-center mb-5">

        <Text className="text-2xl font-bold">
          Your Pets
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("PetSetup")}
          className="bg-indigo-500 px-4 py-1.5 rounded-full"
        >
          <Text className="text-white font-semibold text-sm">
            + Add
          </Text>
        </TouchableOpacity>

      </View>


      {pets.length === 0 ? (

        <View className="bg-white p-6 rounded-2xl items-center">
          <Text>No pets added yet</Text>
        </View>

      ) : (

        pets.map((pet) => (

          <View
            key={pet._id}
            className="bg-white p-4 rounded-3xl mb-5"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 10,
              elevation: 3
            }}
          >

            <View className="flex-row">

              {pet.image ? (

                <Image
                  source={{ uri: pet.image }}
                  style={{
                    width: 75,
                    height: 75,
                    borderRadius: 20,
                    marginRight: 15
                  }}
                />

              ) : (

                <View className="w-20 h-20 rounded-2xl bg-indigo-500 justify-center items-center mr-4">
                  <Text className="text-white text-2xl font-bold">
                    {pet.petName?.charAt(0)}
                  </Text>
                </View>

              )}

              <View style={{ flex: 1 }}>

                <Text className="text-xl font-bold">
                  {pet.petName}
                </Text>

                <Text className="text-gray-500 mt-1">
                  {pet.breed}
                </Text>

                <Text className="text-gray-500 text-xs mt-2">
                  {pet.age} yrs • {pet.weight} kg
                </Text>

                <Text className="text-gray-500 text-xs mt-1">
                  {pet.gender} • {pet.vaccinated ? "Vaccinated" : "Not vaccinated"}
                </Text>

              </View>

            </View>


            <View className="flex-row mt-4">

              <TouchableOpacity
                onPress={() => navigation.navigate("PetSetup", { pet })}
                className="flex-1 bg-indigo-500 py-2 rounded-full mr-2"
              >
                <Text className="text-white text-center font-semibold text-sm">
                  Edit
                </Text>
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() => deletePet(pet._id)}
                className="flex-1 bg-red-500 py-2 rounded-full"
              >
                <Text className="text-white text-center font-semibold text-sm">
                  Delete
                </Text>
              </TouchableOpacity>

            </View>

          </View>

        ))
      )}


      <TouchableOpacity
        className="border border-red-500 py-3 rounded-full mt-6"
        onPress={logout}
      >
        <Text className="text-red-500 text-center font-bold">
          Logout
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
