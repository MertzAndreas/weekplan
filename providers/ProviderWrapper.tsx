import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DateProvider from "./DateProvider";
import { dateToQueryKey } from "../hooks/useActivity";
import { TaskDTO } from "../types/TaskDTO";

type CustomLayoutProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

const ProviderWrapper = ({ children }: CustomLayoutProps) => {
  const mockData: TaskDTO[] = [
    {
      id: 1,
      name: "Mock Task 1",
      startTime: new Date(),
      endTime: new Date(),
    },
    {
      id: 2,
      name: "Mock Task 2",
      startTime: new Date(),
      endTime: new Date(),
    },
  ];

  const sourceDate = new Date();
  const key = dateToQueryKey(sourceDate);
  const key2 = dateToQueryKey(
    new Date(new Date().setDate(new Date().getDate() + 1)),
  );

  queryClient.setQueryData(key, mockData);
  queryClient.setQueryData(key2, mockData);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <DateProvider>{children}</DateProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default ProviderWrapper;
