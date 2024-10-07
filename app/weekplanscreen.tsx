import { View, StyleSheet } from "react-native";
import AddButton from "../components/AddButton";
import TaskItemHeader from "../components/TaskItemHeader";
import WeekSelection from "../components/WeekSelection";
import DaysContainer from "../components/DaysContainer";

const WeekPlanScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <WeekSelection />
        <DaysContainer />
      </View>
      <TaskItemHeader />
      <AddButton pathname={"./additem"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 10,
    backgroundColor: "#F2F5FA",
  },
});

export default WeekPlanScreen;
