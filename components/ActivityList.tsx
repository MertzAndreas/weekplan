import { TaskDTO } from "../types/TaskDTO";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {ActivityEntry} from "./ActivityListItem";

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

const styles = StyleSheet.create({
  activityView: {
    padding: 5,
    width: "100%",
    height: "100%",
    borderRadius: 15,
  }
});
