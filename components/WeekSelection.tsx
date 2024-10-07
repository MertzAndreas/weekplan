import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Modal,
  Button,
} from "react-native";
import getWeekNumber from "../utils/getWeekNumber";
import getNumberOfWeeksInYear from "../utils/getNumberOfWeeksInYear";
import PickerColumn from "./pickerColumn";
import { useDate } from "../providers/DateProvider";

type WeekSelectionProps = {};

const getWeeks = (year: number) => {
  const weeks = [];
  for (let i = 1; i <= getNumberOfWeeksInYear(year); i++) {
    weeks.push(i);
  }
  return weeks;
};

const getYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 1; i <= currentYear + 1; i++) {
    years.push(i);
  }
  return years;
};

const WeekSelection: React.FC<WeekSelectionProps> = () => {
  const currentDate = new Date();
  const { setWeekAndYear, weekNumber } = useDate();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(getWeekNumber(currentDate));
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const weeks = getWeeks(selectedYear);
  const years = getYears();

  const handleWeekSelection = () => {
    setWeekAndYear(selectedWeek, selectedYear);
    setModalVisible(false);
  };

  return (
    <View style={styles.weekSelection}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.weekText}>{`Uge ${weekNumber}`}</Text>
      </TouchableOpacity>

      {/* Modal for Week/Year Picker */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <PickerColumn
              title="Vælg år:"
              weeksOrYear={years}
              selectedValue={selectedYear}
              setSelectedValue={setSelectedYear}
            />
            <PickerColumn
              title="Vælg uge:"
              weeksOrYear={weeks}
              selectedValue={selectedWeek}
              setSelectedValue={setSelectedWeek}
            />
            <View style={styles.button}>
              <Button title="Færdig" onPress={handleWeekSelection} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  weekSelection: {
    alignItems: "center",
    padding: 10,
  },
  weekText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    marginLeft: 100,
    marginRight: 100,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 100,
    borderRadius: 10,
    justifyContent: "center",
  },
  button: {
    padding: 10,
    width: 100,
    alignSelf: "center",
    position: "absolute",
    bottom: 5,
  },
});

export default WeekSelection;
