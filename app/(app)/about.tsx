import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView edges={["left", "right", "top"]}>
      <Text>About</Text>
    </SafeAreaView>
  );
}
