import { TaskDTO } from "../types/TaskDTO";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const ActivityList = (activities: TaskDTO[]) => {
  const [selectedActivities, setSelectedActivities] = useState<boolean[]>(
    new Array(activities.length).fill(true),
  );

  function toggleSelected(index: number) {
    const updatedActivities = [...selectedActivities];
    updatedActivities[index] = !updatedActivities[index];
    setSelectedActivities(updatedActivities);
  }

  function findSelected(): TaskDTO[] {
    return activities.filter((_activity, index) => selectedActivities[index]);
  }

  return (
    <ScrollView style={styles.activityView}>
      {activities.map((activity, index) => {
        return ActivityEntry(
          activity,
          index,
          toggleSelected,
          selectedActivities,
        );
      })}
    </ScrollView>
  );
};

const ActivityEntry = (
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
    <TouchableOpacity onPress={() => toggleCallback(index)}>
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
  activityView: {
    padding: 5,
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
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
