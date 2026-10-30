
import { useCallback, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { router, useFocusEffect } from "expo-router";
import { supabase } from "../../lib/supabase";

type UserProfile = {
  name: string;
  email: string;
  goal: string;
  activityLevel: string;
  gymAccess: boolean | null;
  currentWeight: number | null;
  goalWeight: number | null;
  height: string | null;
  age: number | null;
  workoutDays: string[];
};

type RowProps = {
  label: string;
  value: string;
  onPress?: () => void;
};

function Row({ label, value, onPress }: RowProps) {
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && styles.rowPressed,
      ]}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>
        {value}{onPress ? " ›" : ""}
      </Text>
    </Pressable>
  );
}

export default function Account() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadAccount = async () => {
        setLoading(true);
        setError("");

        try {
          const {
            data: { user: authUser },
            error: authError,
          } = await supabase.auth.getUser();

          if (!active) return;

          if (authError) throw authError;

          if (!authUser) {
            setUser(null);
            router.replace("/login");
            return;
          }

          const { data: profile, error: profileError } =
            await supabase
              .from("profiles")
              .select(
                "full_name, current_weight, goal_weight, height, age, activity_level, gym_access, fitness_goal, workout_days"
              )
              .eq("id", authUser.id)
              .maybeSingle();

          if (!active) return;

          if (profileError) throw profileError;

          const metadata = authUser.user_metadata ?? {};

          setUser({
            name:
              profile?.full_name ||
              metadata.full_name ||
              "FitPath User",

            email: authUser.email ?? "No email available",

            goal: profile?.fitness_goal || "Not set",

            activityLevel:
              profile?.activity_level || "Not set",

            gymAccess: profile?.gym_access ?? null,

            currentWeight: profile?.current_weight ?? null,

            goalWeight: profile?.goal_weight ?? null,

            height: profile?.height ?? null,

            age: profile?.age ?? null,

            workoutDays: Array.isArray(profile?.workout_days)
              ? profile.workout_days
              : [],
          });
        } catch (err) {
          if (active) {
            console.error("Account loading error:", err);
            setError(
              err instanceof Error
                ? err.message
                : "Unable to load account information."
            );
          }
        } finally {
          if (active) setLoading(false);
        }
      };

      loadAccount();

      return () => {
        active = false;
      };
    }, [])
  );

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      const { error: signOutError } =
        await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      setUser(null);
      router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setError("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#292929" />
        <Text style={styles.loadingText}>
          Loading account details...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>Account Details</Text>

      <Text style={styles.subtitle}>
        Manage your profile and preferences
      </Text>

      {error !== "" && (
        <Text style={styles.error}>{error}</Text>
      )}

      {user ? (
        <>
          <View style={styles.profile}>
            <View style={styles.avatar} />

            <View style={styles.profileText}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>

          
<View style={styles.list}>
  <Row
  label="Personal information"
  value="Edit"
  onPress={() =>
    router.push({
      pathname: "/personal-info",
      params: { mode: "edit" },
    })
  }
/>
  <Row
    label="Current weight"
    value={
      user.currentWeight !== null
        ? `${user.currentWeight} lb`
        : "Not set"
    }
    onPress={() =>
      router.push({
        pathname: "/personal-info",
        params: { mode: "edit" },
      })
    }
  />

  <Row
    label="Goal weight"
    value={
      user.goalWeight !== null
        ? `${user.goalWeight} lb`
        : "Not set"
    }
    onPress={() =>
      router.push({
        pathname: "/personal-info",
        params: { mode: "edit" },
      })
    }
  />

  <Row
    label="Height"
    value={user.height || "Not set"}
    onPress={() =>
  router.push({
    pathname: "/personal-info",
    params: { mode: "edit" },
  })
}
  />

  <Row
    label="Age"
    value={
      user.age !== null ? `${user.age}` : "Not set"
    }
    onPress={() =>
      router.push({
        pathname: "/personal-info",
        params: { mode: "edit" },
      })
    }
  />

  <Row
    label="Current goal"
    value={user.goal}
    onPress={() => router.push({
  pathname: "/fitness-goal",
  params: { mode: "edit" },
})}
  />

  <Row
    label="Activity level"
    value={user.activityLevel}
    onPress={() =>
  router.push({
    pathname: "/personal-info",
    params: { mode: "edit" },
  })
}
  />

  <Row
    label="Gym access"
    value={
      user.gymAccess === null
        ? "Not set"
        : user.gymAccess
        ? "Yes"
        : "No"
    }
    onPress={() =>
  router.push({
    pathname: "/exercise-setup",
    params: { mode: "edit" },
  })
}
  />

  <Row
    label="Workout days"
    value={
      user.workoutDays.length > 0
        ? user.workoutDays.join(", ")
        : "Not set"
    }
    onPress={() => router.push({
  pathname: "/recommended-plan",
  params: { mode: "edit" },
})}
  />

  <Row
    label="Settings"
    value="Coming soon"
  />
</View>


          <Pressable
            disabled={loggingOut}
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.rowPressed,
            ]}
          >
            {loggingOut ? (
              <ActivityIndicator color="#111" />
            ) : (
              <Text style={styles.logoutText}>
                Log out
              </Text>
            )}
          </Pressable>
        </>
      ) : (
        <Pressable
          style={styles.logoutButton}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.logoutText}>
            Return to Sign In
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  container: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    fontSize: 15,
    color: "#6b6b6b",
    marginTop: 4,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#eeeeee",
    marginRight: 12,
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },
  email: {
    fontSize: 13,
    color: "#6b6b6b",
    marginTop: 2,
  },
  list: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d9d9d9",
    gap: 12,
  },
  rowPressed: {
    opacity: 0.6,
  },
  rowLabel: {
    fontSize: 15,
    color: "#6b6b6b",
  },
  rowValue: {
    fontSize: 15,
    color: "#111",
    flexShrink: 1,
    textAlign: "right",
  },
  logoutButton: {
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#111",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },
  error: {
    color: "#b42318",
    marginTop: 16,
    fontSize: 14,
  },
});
