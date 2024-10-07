import {
  Button,
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useCallback, useEffect, useRef, useState } from "react";
import { TaskDTO } from "../types/TaskDTO";
import { getDayData } from "../utils/getDayData";

type CopyDayDataModalProps = {
  destinationDate: Date;
  destinationData?: TaskDTO[];
  sourceDate: Date;
  sourceData?: TaskDTO[];
  visible: boolean;
};

type DayData = {
  date: Date;
  data: TaskDTO[];
};

export const CopyDayDataModal = (props: CopyDayDataModalProps) => {
  const [alertText, setAlertText] = useState("");
  const [modalVisible, setModalVisible] = useState(props.visible);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [dayData, setDayData] = useState<{
    source: DayData;
    destination: DayData;
  }>({
    source: {
      date: props.sourceDate,
      data: props.sourceData ?? getDayData(props.sourceDate),
    },
    destination: {
      date: props.destinationDate,
      data: props.destinationData ?? getDayData(props.destinationDate),
    },
  });

  const datePickerRef = useRef<"source" | "destination">("destination");

  const handleDateChange = useCallback((selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (!selectedDate) return;

    setDayData((prevState) => {
      const key = datePickerRef.current;
      return {
        ...prevState,
        [key]: {
          date: selectedDate,
          data: getDayData(selectedDate),
        },
      };
    });
  }, []);

  const updateAlertText = useCallback(() => {
    if (dayData.source.data.length === 0) {
      setAlertText("Der er ingen tasks gemt for den valgte dag.");
    } else if (dayData.destination.data.length > 0) {
      setAlertText(
        "Der er allerede aktiviteter for den dag du vil kopiere til. Disse bliver slettet, hvis du fortsætter"
      );
    } else {
      setAlertText("");
    }
  }, [dayData]);

  useEffect(() => {
    updateAlertText();
  }, [updateAlertText]);

  const isSubmitable = dayData.source.data.length === 0 || dayData.destination.data.length > 0;

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowDatePicker(false)}
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
            date={dayData.source.date}
            onPress={() => {
              datePickerRef.current = "source";
              setShowDatePicker(true);
            }}
          />
          <DatePickerButton
            label="Kopier til"
            date={dayData.destination.date}
            onPress={() => {
              datePickerRef.current = "destination";
              setShowDatePicker(true);
            }}
          />
          {alertText.length > 0 && (
            <Text style={{ textAlign: "center" }}>{alertText}</Text>
          )}
          <Button
            title={"Kopier Aktiviteter"}
            disabled={isSubmitable}
            onPress={() => {
              setShowDatePicker(false);
              setModalVisible(false);
            }}
          />
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <RNDateTimePicker
          value={
            datePickerRef.current === "destination"
              ? dayData.destination.date
              : dayData.source.date
          }
          is24Hour={true}
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
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.header}>
      {`${label}: ${date.toLocaleDateString("da-DK", {
        day: "numeric",
        month: "short",
        weekday: "short",
      })}`}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    gap: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: "#333",
  },
});
