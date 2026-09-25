import { Text, View, StyleSheet } from "react-native";

export default function Tracking() {
  return (
    <View style={styles.container}>
      <Text>Tracking page will be displayed here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
