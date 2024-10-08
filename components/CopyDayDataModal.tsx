import {
  Button,
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import useCopyDataModal from "../hooks/useCopyDataModal";
import React, { useState, useEffect } from "react";
import { TaskDTO } from "../types/TaskDTO";

type CopyDayDataModalProps = {
  destinationDate?: Date;
  sourceDate?: Date;
};

const nextDay = () => new Date(new Date().setDate(new Date().getDate() + 1));

export const CopyDayDataModal = ({
  sourceDate = new Date(),
  destinationDate = nextDay(),
}: CopyDayDataModalProps) => {
  const [modalVisible, setModalVisible] = useState(true);
  const { handleDateChange, error, dates } = useCopyDataModal({
    destinationDate,
    sourceDate,
  });

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <TouchableOpacity
        style={styles.modalBackground}
        onPress={() => {
          setModalVisible(false);
        }}
      >
        <View
          style={styles.modalContainer}
          onStartShouldSetResponder={() => true}
        >
          <Text style={styles.header}>Kopier Aktiviteter</Text>
          <DateTimePicker
            value={dates.sourceDate ?? new Date()}
            is24Hour={true}
            mode="date"
            onChange={(_event, date) => {
              handleDateChange(date, "source");
            }}
          />
          {error && <Text>{error}</Text>}
          {dates.sourceDateData.map((activity) => (
            <View key={activity.id}>
              <Text>{activity.name}</Text>
            </View>
          ))}
          <Text style={styles.header}>Til Dato</Text>
          <DateTimePicker
            value={dates.destinationDate ?? nextDay()}
            is24Hour={true}
            mode="date"
            onChange={(_event, date) => {
              handleDateChange(date, "destination");
            }}
          />
          <Button
            title="Kopier Aktiviteter"
            onPress={() => {
              setModalVisible(false);
            }}
            disabled={!!error}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const ActivityList = (activities: TaskDTO[]) => {
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

  useEffect(() => {
    setSelectedActivities(new Array(activities.length).fill(true));
    console.log("Updated activities");
  }, [activities]);

  return (
    <ScrollView style={styles.activityView}>
      {activities.map((activity, index) => {
        const activityName = activity.name
          ? activity.name.length <= 27
            ? activity.name
            : activity.name.substring(0, 25).concat("...")
          : "";
        const startTime = activity.startTime.toLocaleTimeString("da-DK", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTime = activity.endTime.toLocaleTimeString("da-DK", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <TouchableOpacity onPress={() => toggleSelected(index)}>
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
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderColor: "gray",
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    height: "80%",
    padding: 30,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    gap: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
});
