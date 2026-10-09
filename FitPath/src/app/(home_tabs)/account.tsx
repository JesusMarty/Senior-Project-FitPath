import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

type User = {
  name: string;
  email: string;
  goal: string;
  activityLevel: string;
  gymAccess: boolean;
};

// Replace with real data from your auth/profile state
const user: User = {
  name: "User's Name",
  email: "User's Email",
  goal: "User's Goal",
  activityLevel: "User's Activity",
  gymAccess: true,
};

type RowProps = {
  label: string;
  value: string;
  onPress?: () => void;
};

function Row({ label, value, onPress }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value} ›</Text>
    </Pressable>
  );
}

export default function Account() {
  const handleLogout = () => {
    // TODO: sign the user out
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>Account Details</Text>
      <Text style={styles.subtitle}>Manage your profile and preferences</Text>

      <View style={styles.profile}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.list}>
        <Row label="Personal information" value="Edit" />
        <Row label="Current goal" value={user.goal} />
        <Row label="Activity level" value={user.activityLevel} />
        <Row label="Gym access" value={user.gymAccess ? "Yes" : "No"} />
        <Row label="Settings" value="Notifications, units" />
      </View>

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.rowPressed,
        ]}
      >
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
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
});