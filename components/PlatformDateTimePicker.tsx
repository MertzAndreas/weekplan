import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React from "react";
import { TouchableOpacity, View, Text } from "react-native"; // Added Text import
import { formattedDate } from "../utils/formattedDate";

type PlatformDateTimePickerProps = {
  platform: "ios" | "android" | "windows" | "macos" | "web";
  startDate: Date;
  callback: (event: DateTimePickerEvent, date: Date | undefined) => any;
};

export const PlatformDateTimePicker = (props: PlatformDateTimePickerProps) => {
  const [DTPVisible, setDTPVisible] = React.useState(false); // For Android picker visibility
  const [selectedDate, setDate] = React.useState<Date>(
    props.startDate ?? new Date(),
  );

  const handleDateChange = (
    event: DateTimePickerEvent,
    date: Date | undefined,
  ) => {
    setDTPVisible(false); // Close the picker (mainly for Android)
    if (date) {
      setDate(date); // Update the selected date
      props.callback(event, date); // Pass the newly selected date
    }
  };

  if (props.platform === "android") {
    return (
      <View>
        <TouchableOpacity onPress={() => setDTPVisible(true)}>
          <Text>{formattedDate(selectedDate)}</Text>
        </TouchableOpacity>
        {DTPVisible && (
          <DateTimePicker
            value={selectedDate} // Use the selected date for consistency
            is24Hour={true}
            mode="date"
            display="default" // Optional: Choose display style for Android
            onChange={handleDateChange}
          />
        )}
      </View>
    );
  } else {
    return (
      <DateTimePicker
        value={selectedDate} // Use the selected date
        is24Hour={true}
        mode="date"
        display="spinner" // Optional: You can change this for iOS or other platforms
        onChange={handleDateChange}
      />
    );
  }
};
