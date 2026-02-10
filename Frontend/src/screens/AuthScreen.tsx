import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/axios";

export default function AuthScreen({ navigation }: any) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email");
      return false;
    }

    if (!password) {
      setError("Password is required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    setError("");
    return true;
  };

  const handleAuth = async () => {

    if (!validate()) return;

    setLoading(true);

    try {

      if (isLogin) {
        const res = await API.post("/auth/sign-in", {
          email,
          password
        });

        await AsyncStorage.setItem("token", res.data.token);

        navigation.replace("ProfileSetup");

      } else {
        await API.post("/auth/sign-up", {
          email,
          password
        });

        navigation.replace("Otp", { email });

      }

    } catch (error: any) {

      const message =
        error?.response?.data?.message ||
        "Something went wrong";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}

    >

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"

      >

        <View className="flex-1 bg-[#F7F8FA] justify-center px-6">

          <Text className="text-5xl font-extrabold text-center text-gray-900">
            PawMatch
          </Text>

          <Text className="text-center text-gray-500 mt-2 mb-10">
            Find the perfect match for your pet
          </Text>

          <View className="bg-white p-6 rounded-[28px] shadow-sm">

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className="border border-gray-200 p-4 rounded-xl mb-4"
            />

            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              className="border border-gray-200 p-4 rounded-xl"
            />

            {error ? (<Text className="text-red-500 mt-2">
              {error} </Text>
            ) : null}

            <TouchableOpacity
              onPress={handleAuth}
              disabled={loading}
              className={`p-4 rounded-xl mt-6 ${loading ? "bg-gray-400" : "bg-indigo-500"
                }`}

            >

              {loading
                ? <ActivityIndicator color="white" />
                : (<Text className="text-white text-center font-bold text-lg">
                  {isLogin ? "Login" : "Create Account"} </Text>
                )}

            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsLogin(!isLogin)}
              className="mt-5"

            >

              <Text className="text-center text-indigo-500 font-semibold">
                {isLogin
                  ? "New here? Create account"
                  : "Already have an account?"}
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
