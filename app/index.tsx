import { Link } from "expo-router";
import { Text, View } from "react-native";

const HomePage = () => {
  return (
    <View>
      <Text>Home Page</Text>
      <Link href="/weekplanscreen">
        <Text>Go to Week Plan</Text>
      </Link>
    </View>
  );
};

export default HomePage;
