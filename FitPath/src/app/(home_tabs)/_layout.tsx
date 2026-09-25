import { Tabs } from "expo-router";

export default function TabsLayout() {
  return(
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "Home"}}/>
      <Tabs.Screen name="local_food" options={{ title: "Local Food"}}/>
      <Tabs.Screen name="tracking" options={{ title: "Tracking"}}/>
      <Tabs.Screen name="exercises" options={{ title: "Exercises"}}/>
      <Tabs.Screen name="account" options={{ title: "Account"}}/>
    </Tabs>
  );
}