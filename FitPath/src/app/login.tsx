import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>

      <Text style={styles.subtitle}>
        Sign in to continue to FitPath.
      </Text>

      <Text style={styles.label}>Email</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
      />

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>

      <Text style={styles.signupText}>
        Don't have an account?{" "}
        <Text style={styles.signupLink}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 80,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 32,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#292929",
    height: 52,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  signupText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#555",
  },

  signupLink: {
    color: "#222",
    fontWeight: "600",
  },
});