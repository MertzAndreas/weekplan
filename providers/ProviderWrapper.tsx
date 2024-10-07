import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DateProvider from "./DateProvider";

type CustomLayoutProps = {
  children: React.ReactNode;
};

const ProviderWrapper = ({ children }: CustomLayoutProps) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <DateProvider>{children}</DateProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default ProviderWrapper;
