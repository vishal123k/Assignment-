import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import API from "../api/axios";

export default function OtpScreen({ route, navigation }: any) {

    const { email } = route.params;
    const [otp, setOtp] = useState("");

    const verifyOtp = async () => {

        await API.post("/auth/verify-email", { email, otp });

        navigation.replace("Auth");
    };

    return (
        <View className="flex-1 justify-center px-6">

            <Text className="text-2xl font-bold mb-4">
                Verify Email
            </Text>

            <TextInput
                placeholder="Enter OTP"
                keyboardType="number-pad"
                className="border p-4 rounded-xl mb-4"
                onChangeText={setOtp}
            />

            <TouchableOpacity
                className="bg-black p-4 rounded-xl bg-indigo-500"
                onPress={verifyOtp}
            >
                <Text className="text-white text-center ">
                    Verify
                </Text>
            </TouchableOpacity>

        </View>
    )
}
