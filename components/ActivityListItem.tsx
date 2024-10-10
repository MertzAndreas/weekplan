import { TaskDTO } from "../types/TaskDTO";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

export const ActivityEntry = (
  activity: TaskDTO,
  index: number,
  toggleCallback: (index: number) => void,
  selectedActivities: boolean[],
) => {
  function formatTime(date: Date) {
    return date.toLocaleTimeString("da-DK", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const activityName = activity.name
    ? activity.name.length <= 27
      ? activity.name
      : activity.name.substring(0, 25).concat("...")
    : "";
  const startTime = formatTime(activity.startTime);
  const endTime = formatTime(activity.endTime);

  return (
    <TouchableOpacity
      onPress={() => toggleCallback(index)}
      key={index.toString()}
    >
      <View
        style={[
          styles.activityEntry,
          { borderLeftWidth: selectedActivities[index] ? 1 : 0 },
        ]}
        key={index.toString()}
      >
        <Text style={{ width: "70%" }}>{activityName}</Text>
        <Text style={{ width: "30%", textAlign: "center" }}>
          {startTime + "\n" + endTime}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  activityEntry: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 2,
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 0,
    borderLeftWidth: 1,
    borderColor: "blue",
    paddingLeft: 5,
  },
});
