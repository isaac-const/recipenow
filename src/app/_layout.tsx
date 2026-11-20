"use client"

import { useCallback } from "react"
import { View, StyleSheet } from "react-native"
import { Stack } from "expo-router"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"

// Impedir que a tela de splash seja ocultada automaticamente
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Você pode adicionar fontes personalizadas aqui se desejar
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0f1013",
          },
          headerTintColor: "#c6f25a", headerShown: false,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: { backgroundColor: "#0f1013" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="recipes/[id]"
          options={{ headerShown: false }}
        />
      </Stack>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
