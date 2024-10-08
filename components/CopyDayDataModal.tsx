import {
  Button,
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCallback, useEffect, useRef, useState } from "react";
import { TaskDTO } from "../types/TaskDTO";
import { useQueryClient } from "@tanstack/react-query";
import { dateToQueryKey } from "../hooks/useActivity";
import { formattedDate } from "../utils/formattedDate";

type CopyDayDataModalProps = {
  destinationDate?: Date;
  sourceDate?: Date;
};

type DayData = {
  sourceDate: Date;
  sourceDateData: TaskDTO[];
  destinationDate: Date;
};

const nextDay = () => new Date(new Date().setDate(new Date().getDate() + 1));

export const CopyDayDataModal = ({
  sourceDate = new Date(),
  destinationDate = nextDay(),
}: CopyDayDataModalProps) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<"source" | "destination">("destination");
  const [error, setError] = useState<string>();
  const [dates, setDates] = useState<DayData>({
    sourceDate: sourceDate,
    sourceDateData: [],
    destinationDate: destinationDate,
  });
  const queryClient = useQueryClient();

  const getSourceDateData = useCallback(() => {
    const key = dateToQueryKey(dates.sourceDate);
    const sourceDataActivities = queryClient.getQueryData<TaskDTO[]>(key);

    if (!sourceDataActivities) {
      setError(
        `Ingen aktiviteter fundet for ${formattedDate(dates.sourceDate)}`,
      );
      setDates((prevData) => ({
        ...prevData,
        sourceDateData: [],
      }));
      return;
    }

    setDates((prevData) => ({
      ...prevData,
      sourceDateData: sourceDataActivities,
    }));
    setError("");
  }, [dates.sourceDate, queryClient]);

  useEffect(() => {
    getSourceDateData();
  }, [getSourceDateData]);

  const handleDateChange = useCallback((selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (!selectedDate) return;
    if (datePickerRef.current === "source") {
      setDates((prev) => ({ ...prev, sourceDate: selectedDate }));
    } else {
      setDates((prev) => ({ ...prev, destinationDate: selectedDate }));
    }
  }, []);

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalBackground}
        onPress={() => {
          setShowDatePicker(false);
          setModalVisible(false);
        }}
      >
        <View
          style={styles.modalContainer}
          onStartShouldSetResponder={() => true}
        >
          <DatePickerButton
            label="Kopier fra"
            date={dates.sourceDate}
            onPress={() => {
              datePickerRef.current = "source";
              setShowDatePicker(true);
            }}
          />
          {error && <Text>{String(error)}</Text>}
          <DatePickerButton
            label="Kopier til"
            date={dates.destinationDate}
            onPress={() => {
              datePickerRef.current = "destination";
              setShowDatePicker(true);
            }}
          />
          {ActivityList(dates.sourceDateData)}
          <Button
            title={"Kopier Aktiviteter"}
            onPress={() => {
              setShowDatePicker(false);
              setModalVisible(false);
            }}
          />
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={
            datePickerRef.current === "destination"
              ? (dates.destinationDate ?? new Date())
              : (dates.sourceDate ?? new Date())
          }
          is24Hour={true}
          mode={"date"}
          onChange={(_event, date) => handleDateChange(date)}
        />
      )}
    </Modal>
  );
};

const DatePickerButton = ({
  label,
  date,
  onPress,
}: {
  label: string;
  date: Date;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress}>
    <Text style={styles.header}>{`${label}: ${formattedDate(date)}`}</Text>
  </Pressable>
);

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
