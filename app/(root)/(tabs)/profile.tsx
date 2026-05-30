import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuth } from "@clerk/expo";

export default function Profile() {
  const { signOut } = useAuth();
    const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in")
    } catch (error) {
      console.log("error signing out", error);

    }
  }
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handleSignOut}>
        <Text>djfnjsdf</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}