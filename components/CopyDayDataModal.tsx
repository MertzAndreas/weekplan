import {
  Button,
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import useCopyDataModal from "../hooks/useCopyDataModal";
import React, { useState } from "react";
import { ActivityList } from "./ActivityList";
import { PlatformDateTimePicker } from "./PlatformDateTimePicker";

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
          <PlatformDateTimePicker
            platform={Platform.OS}
            startDate={sourceDate}
            callback={(_event, date) => {
              handleDateChange(date, "source");
            }}
          />
          {ActivityList(dates.sourceDateData)}
          {error && <Text>{error}</Text>}
          <Text style={styles.header}>Til Dato</Text>
          <PlatformDateTimePicker
            platform={Platform.OS}
            startDate={sourceDate}
            callback={(_event, date) => {
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

const styles = StyleSheet.create({
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  header: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
});
