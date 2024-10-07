import {
  Button,
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useCallback, useRef, useState } from "react";
import { TaskDTO } from "../types/TaskDTO";

type CopyDayDataModalProps = {
  destinationDate?: Date;
  sourceDate?: Date;
  
};

type DayData = {
    sourceDate : Date, 
    sourceDateData: TaskDTO[]
    destinationDate : Date
} 

const nextDay = () => new Date(new Date().setDate(new Date().getDate() + 1));

export const CopyDayDataModal = ({sourceDate = new Date(), destinationDate = nextDay()}: CopyDayDataModalProps) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dates, setDates] = useState<DayData>({
    sourceDate : sourceDate ,
    sourceDateData : [],
    destinationDate : destinationDate
  })

  const datePickerRef = useRef<"source" | "destination">("destination");

  const handleDateChange = useCallback((selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (!selectedDate) return;
    if (datePickerRef.current === "source") {
      setDates({...dates, sourceDate: selectedDate});
    } else {
      setDates({...dates, destinationDate: selectedDate});
    }
  }, [dates]);

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
            date={dates.sourceDate}
            onPress={() => {
              datePickerRef.current = "source";
              setShowDatePicker(true);
            }}
          />
          <DatePickerButton
            label="Kopier til"
            date={dates.destinationDate}
            onPress={() => {
              datePickerRef.current = "destination";
              setShowDatePicker(true);
            }}
          />
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
        <RNDateTimePicker
          value={
            datePickerRef.current === "destination"
              ? dates.destinationDate ?? new Date()
              : dates.sourceDate ?? new Date()
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
