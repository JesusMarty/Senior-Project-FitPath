import { Text, View, StyleSheet } from "react-native";

export default function Account() {
  return (
    <View style={styles.container}>
      <Text>Account Details will be displayed here</Text>
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
