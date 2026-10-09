import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

// Builds the icon for a tab: filled when selected, outline when not
const tabIcon =
  (active: IconName, inactive: IconName) =>
  ({size, focused }: { size: number; focused: boolean }) =>
    <Ionicons name={focused ? active : inactive} size={size} />;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#111" }}>
      <Tabs.Screen
        name="home"
        options={{ title: "Home", tabBarIcon: tabIcon("home", "home-outline") }}
      />
      <Tabs.Screen
        name="local_food"
        options={{
          title: "Local Food",
          tabBarIcon: tabIcon("location", "location-outline"),
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{ title: "Tracking", tabBarIcon: tabIcon("add", "add-outline") }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: "Exercises",
          tabBarIcon: tabIcon("barbell", "barbell-outline"),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: tabIcon("person", "person-outline"),
        }}
      />
    </Tabs>
  );
}