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

export const CopyDayDataModal = (props: CopyDayDataModalProps) => {
  const [canSubmit, setCanSubmit] = useState(false);

  const [alertText, setAlertText] = useState("");
  const [modalVisible, setModalVisible] = useState(props.visible);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<"source" | "destination">("destination");

  const [destinationDate, setDestinationDate] = useState<Date>(
    props.destinationDate
  );
  const [destinationData, setDestinationData] = useState<TaskDTO[]>(
    props.destinationData ?? getDayData(destinationDate)
  );
  const [sourceDate, setSourceDate] = useState<Date>(props.sourceDate);
  const [sourceData, setSourceData] = useState<TaskDTO[]>(
    props.sourceData ?? getDayData(sourceDate)
  );

  const handleDateChange = useCallback((selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (!selectedDate) return;

    if (datePickerRef.current === "source") {
      setSourceDate(selectedDate);
      setSourceData(getDayData(selectedDate));
    } else {
      setDestinationDate(selectedDate);
      setDestinationData(getDayData(selectedDate));
    }
  }, []);

  const updateAlertText = useCallback(() => {
    if (sourceData.length === 0) {
      setAlertText("Der er ingen tasks gemt for den valgte dag.");
      setCanSubmit(false);
    } else if (destinationData.length > 0) {
      setAlertText(
        "Der er allerede tasks for den dag du vil kopiere til. Disse bliver slettet, hvis du fortsætter"
      );
      setCanSubmit(true);
    } else {
      setAlertText("");
      setCanSubmit(true);
    }
  }, [destinationData, sourceData]);

  useEffect(() => {
    updateAlertText();
  }, [updateAlertText]);

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
            date={sourceDate}
            onPress={() => {
              datePickerRef.current = "source";
              setShowDatePicker(true);
            }}
          />
          <DatePickerButton
            label="Kopier til"
            date={destinationDate}
            onPress={() => {
              datePickerRef.current = "destination";
              setShowDatePicker(true);
            }}
          />
          {alertText.length > 0 && (
            <Text style={{ textAlign: "center" }}>{alertText}</Text>
          )}
          <Button
            title={"Kopier Tasks"}
            disabled={!canSubmit}
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
              ? destinationDate
              : sourceDate
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
