import { Stack } from "expo-router";
import { app_name, colorPrimary } from "../../src/utils";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        title: app_name,
        headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: colorPrimary,
        },
        headerBackTitleVisible: false,
      }}
    />
  );
}
