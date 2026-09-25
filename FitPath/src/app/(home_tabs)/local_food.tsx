import { Text, View, StyleSheet } from "react-native";

export default function Local_Food() {
  return (
    <View style={styles.container}>
      <Text>Local Foods will be displayed here</Text>
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
