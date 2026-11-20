import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#c6f25a",
        tabBarInactiveTintColor: "#737a8a",
        tabBarShowLabel: true,
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 16,
          height: 68,
          paddingBottom: 8,
          paddingTop: 8,
          borderRadius: 26,
          backgroundColor: "#181a20",
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "#262a33",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.45,
          shadowRadius: 24,
          elevation: 12,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}

    >
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Receitas",
          headerTitle: "RecipeNow",
          tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          headerTitle: "Favoritos",
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "Sobre",
          headerTitle: "Sobre",
          tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
