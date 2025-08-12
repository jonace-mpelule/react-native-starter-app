import { useAuthStore } from "@/stores/auth.store";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import {  useAuth } from "@/context/auth.context"


export default function RootLayout() {
    const router = useRouter()
    const segments = useSegments()
    const [firstLoad, setFirstLoad] = useState(true)

    const {authState} = useAuth()

    useEffect(() => {
        const inAuthenticatedGroup = segments[0] === "(authenticated)";
        const isAuthenticated = authState?.authenticated;

        if (firstLoad && isAuthenticated) {

        }

        // Check if it's the first load
        if (firstLoad && !isAuthenticated) {
            setFirstLoad(false);

            router.replace("/(landing)/notifications")
        }

        // Attempt to load the home screen
        if (isAuthenticated && !inAuthenticatedGroup) {
            router.dismissTo("/(authenticated)/(tabs)/home");
        }

        // Redirect to login if not authenticated
        else if (!isAuthenticated && inAuthenticatedGroup) {
            router.dismissTo("/auth/login");
        }

        // If app first loads an no segment group, redirect based on auth state
        else if (!segments.length) {
            if (isAuthenticated) {
                router.dismissTo("/(authenticated)/(tabs)/home");
            } else {
                router.dismissTo("/auth/login");
            }
        }
    }, [segments, authState?.authenticated, router]);

    return (
        <View className="h-screen flex">
            <View className="flex-1">
                <Stack> 
                    <StatusBar style="auto" />
                    <Stack.Screen name="index" options={{headerShown: false}} />
                </Stack>
            </View>
        </View>
    )
}