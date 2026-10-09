import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

export default function Login() {
  const handleSignIn = () => {
    router.replace("/(home_tabs)/home");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

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

      <Pressable
        style={styles.button}
        onPress={handleSignIn}
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>

      <View style={styles.signupRow}>
        <Text style={styles.signupText}>
          Don't have an account?
        </Text>

        <Pressable onPress={handleSignUp}>
          <Text style={styles.signupLink}>Sign up</Text>
        </Pressable>
      </View>
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
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 42,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 22,
  },

  button: {
    height: 50,
    backgroundColor: "#292929",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 4,
  },

  signupText: {
    fontSize: 14,
  },

  signupLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});