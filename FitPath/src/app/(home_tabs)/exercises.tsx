import { Text, View, StyleSheet } from "react-native";

export default function Exercises() {
  return (
    <View style={styles.container}>
      <Text>Exercises will be displayed here</Text>
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
