import { StyleSheet, View } from "react-native";
import { Pressable } from "expo-router/build/views/Pressable";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface AddButtonProps {
  pathname: `./${string}` | `../${string}` | `${string}:${string}`;
}

const AddButton: React.FC<AddButtonProps> = ({ pathname }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(pathname);
  };

  return (
    <Pressable style={styles.button} onPress={handlePress}>
      <View>
        <Ionicons name={"calendar-outline"} size={30} />
        <Ionicons name={"add-outline"} size={25} style={styles.addIcon} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: "#B0BEC5",
    borderRadius: 30,
    bottom: 20,
    right: 24,
    position: "absolute",
  },
  text: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    padding: 10,
    color: "#263238",
  },
  addIcon: {
    bottom: -9.8,
    right: -9.8,
    position: "absolute",
    backgroundColor: "#B0BEC5",
    borderRadius: 20,
    overflow: "hidden",
  },
});

export default AddButton;
