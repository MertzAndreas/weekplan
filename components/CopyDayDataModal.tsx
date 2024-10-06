import {Button, Modal, Text, TextInput, View, StyleSheet, TouchableOpacity} from "react-native";
import RNDateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {useCallback, useEffect, useState} from "react";
import {TaskDTO} from "../types/TaskDTO";
import {TouchableNativeFeedback} from "react-native-gesture-handler";
import {getDayData} from "../utils/getDayData";

type CopyDayDataModalProps = {
    destinationDate: Date,
    destinationData?: TaskDTO[],
    sourceDate: Date,
    sourceData?: TaskDTO[],
    visible: boolean
}

export const CopyDayDataModal = (props: CopyDayDataModalProps) => {
    const [canSubmit, setCanSubmit] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [modalVisible, setModalVisible] = useState(props.visible);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerMode, setDatePickerMode] = useState<"source" | "destination">("destination");

    const [destinationData, setDestinationData] = useState<TaskDTO[]>(props.destinationData ?? []);
    const [destinationDate, setDestinationDate] = useState<Date>(props.destinationDate);

    const [sourceData, setSourceData] = useState<TaskDTO[]>(props.sourceData ?? []);
    const [sourceDate, setSourceDate] = useState<Date>(props.sourceDate);

    const handleSourceChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        setShowDatePicker(false);
        if (!selectedDate) return;
        setSourceDate(selectedDate);
        setSourceData(getDayData(selectedDate));

        updateAlertText();
    }
    const handleDestinationChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        setShowDatePicker(false);
        if (!selectedDate) return;
        setDestinationDate(selectedDate);
        setDestinationData(getDayData(selectedDate));

        updateAlertText();
    }

    const updateAlertText = () => {
        console.log(
            `SourceData ${sourceDate.toDateString()}:
            ${sourceData.map((entry) => {
                return `${entry.name}: ${entry.startTime}-${entry.endTime}`
            })}\nDestinationData ${destinationDate.toDateString()}:
            ${destinationData.map((entry) => {
                return `${entry.name}: ${entry.startTime}-${entry.endTime}`
            })}
        ------         
        `
        );

        if (sourceData.length === 0) {
            setAlertText("Der er ingen tasks gemt for den valgte dag.");
            setCanSubmit(false);
            return;
        } else if (destinationData.length < 0) {
            setAlertText(
                "Der er allerede tasks for den dag du vil kopiere til. \n" +
                "Disse bliver slettet, hvis du fortsætter"
            );
            setCanSubmit(true)
            return;
        } else {
            setAlertText("");
            setCanSubmit(true);
            return;
        }
    };

    const handleSubmit = () => {
        //Copy Data
        setModalVisible(false);
    };

    useEffect(() => {
        setSourceData(getDayData(sourceDate));
        setDestinationData(getDayData(destinationDate));
        updateAlertText();
    }, []);

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible(false)}>
                {/* Can't get the View to not trigger the onPress() of the Touchable. Requesting Assistance */}
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => {
                        setDatePickerMode("source");
                        setShowDatePicker(true);
                    }}>
                        <Text style={styles.header}>{
                            "Kopier fra: " + sourceDate.toLocaleDateString("da-DK", {
                                day: "numeric",
                                month: "short",
                                weekday: "short"
                            })}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setDatePickerMode("destination");
                        setShowDatePicker(true);
                    }}>
                        <Text style={styles.header}>{
                            "Kopier til: " + destinationDate.toLocaleDateString("da-DK", {
                                day: "numeric",
                                month: "short",
                                weekday: "short"
                            })}
                        </Text>
                    </TouchableOpacity>
                    <Text>{alertText}</Text>

                    <Button
                        title={"Kopier Tasks"}
                        disabled={!canSubmit}
                        onPress={handleSubmit}
                    />
                </View>
            </TouchableOpacity>
            {showDatePicker && (
                <RNDateTimePicker
                    value={datePickerMode === "destination" ? destinationDate : sourceDate}
                    is24Hour={true}
                    onChange={datePickerMode === "destination" ? handleDestinationChange : handleSourceChange}
                />
            )}
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Semi-transparent background
    },
    modalContainer: {
        width: '80%',  // 80% of the screen width
        padding: 20,
        backgroundColor: 'white',  // Main modal background
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 16,
        fontWeight:
            "500",
        marginBottom:
            10,
        color:
            "#333",
    },
})
