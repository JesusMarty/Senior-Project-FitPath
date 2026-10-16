import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

export default function RecommendedPlan() {
  return (
    <View style={styles.container}>

      {/* Top section */}
      <View style={styles.topRow}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.step}>Step 6 of 6</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
      </View>

      {/* Title */}
      <Text style={styles.title}>
        Your recommended plan
      </Text>

      <Text style={styles.subtitle}>
        Built from your goal, activity, and preferences.
      </Text>

      {/* Plan Card */}
      <View style={styles.card}>

        <Text style={styles.planTitle}>
          Steady Start
        </Text>

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>
            Weekly schedule
          </Text>

          <Text style={styles.dataValue}>
            4 workouts
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>
            Calorie target
          </Text>

          <Text style={styles.dataValue}>
            2,050 kcal
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>
            Protein
          </Text>

          <Text style={styles.dataValue}>
            145 g
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>
            Carbs
          </Text>

          <Text style={styles.dataValue}>
            220 g
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>
            Fat
          </Text>

          <Text style={styles.dataValue}>
            65 g
          </Text>
        </View>

      </View>

      {/* Workout Days */}
      <Text style={styles.scheduleTitle}>
        Workout days
      </Text>

      <View style={styles.daysRow}>

        <View style={styles.activeDay}>
          <Text style={styles.activeDayText}>M</Text>
        </View>

        <View style={styles.inactiveDay}>
          <Text style={styles.inactiveDayText}>T</Text>
        </View>

        <View style={styles.activeDay}>
          <Text style={styles.activeDayText}>W</Text>
        </View>

        <View style={styles.inactiveDay}>
          <Text style={styles.inactiveDayText}>T</Text>
        </View>

        <View style={styles.activeDay}>
          <Text style={styles.activeDayText}>F</Text>
        </View>

        <View style={styles.activeDay}>
          <Text style={styles.activeDayText}>S</Text>
        </View>

        <View style={styles.inactiveDay}>
          <Text style={styles.inactiveDayText}>S</Text>
        </View>

      </View>

      {/* Finish */}
      <Pressable
        style={styles.button}
        onPress={() =>
          router.replace("/(home_tabs)/home")
        }
      >
        <Text style={styles.buttonText}>
          Continue to FitPath
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  backText: {
    fontSize: 14,
    fontWeight: "500",
  },

  step: {
    fontSize: 14,
    color: "#555",
  },

  progressContainer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 20,
    marginBottom: 30,
  },

  progressActive: {
    flex: 1,
    height: 3,
    backgroundColor: "#292929",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },

  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 18,
    marginBottom: 22,
  },

  planTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },

  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  dataLabel: {
    fontSize: 14,
    color: "#666",
  },

  dataValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#ddd",
  },

  scheduleTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },

  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  activeDay: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  activeDayText: {
    color: "#fff",
    fontWeight: "600",
  },

  inactiveDay: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },

  inactiveDayText: {
    color: "#292929",
  },

  button: {
    height: 50,
    backgroundColor: "#292929",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});