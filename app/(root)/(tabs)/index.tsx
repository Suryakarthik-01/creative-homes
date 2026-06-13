import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/expo";
import { useFocusEffect, useRouter } from "expo-router";
import { supabase } from "@/lib/superbase";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);

    const { data: featuredData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    const { data: recommendedData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", false)
      .order("created_at", { ascending: false });

    setFeatured(featuredData ?? []);
    setRecommended(recommendedData ?? []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className="flex-row items-center justify-between ps-5 pt-4 pb-5">
              <Image
                source={require("../../../assets/images/kribb.png")}
                style={{ width: 90, height: 36 }}
                resizeMode="contain"
              />

              <View className="items-end px-3">
                <Text>Good Morning 👋</Text>
                <Text className="text-gray-900 text-base font-bold">
                  {user?.firstName ?? "User"}
                </Text>
              </View>
            </View>

            {/* Search Bar */}
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/search")}
              className="mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3 gap-3"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Ionicons name="search-outline" size={18} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm flex-1">
                Search properties, cities...
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(tabs)/search?openFilters=true")
                }
                className="w-8 h-8 bg-blue-600 rounded-xl items-center justify-center"
              >
                <Ionicons name="options-outline" size={15} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* featured section */}
            <View className="mb-6">
              <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
                Featured
              </Text>

              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                  className="py-10"
                />
              ) : (
                <FlatList
                  data={featured}
                  keyExtractor={(items) => items.id}
                  renderItem={({ item }) => <Text>{item.title}</Text>}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                />
              )}
            </View>

            {/* Recommended Header */}
            <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
              Recommended
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-5">
            <Text>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-400">No properties found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
