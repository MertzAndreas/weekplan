import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DateProvider from './DateProvider';
import {dateToQueryKey} from '../hooks/useActivity';
import {TaskDTO} from '../types/TaskDTO';

type CustomLayoutProps = {
    children: React.ReactNode;
};

const queryClient = new QueryClient();

const ProviderWrapper = ({children}: CustomLayoutProps) => {

    const mockDataToday: TaskDTO[] = [
        {
            id: 0,
            name: "Today 1",
            startTime: (() => {
                const date = new Date();
                date.setHours(6, 0, 0, 0); // Set to 6:00 AM
                return date;
            })(),
            endTime: (() => {
                const date = new Date();
                date.setHours(7, 0, 0, 0); // Set to 7:00 AM
                return date;
            })(),
        },
        {
            id: 1,
            name: "Today 2",
            startTime: (() => {
                const date = new Date();
                date.setHours(7, 0, 0, 0); // Set to 7:00 AM
                return date;
            })(),
            endTime: (() => {
                const date = new Date();
                date.setHours(8, 0, 0, 0); // Set to 8:00 AM
                return date;
            })(),
        },
    ];

    const mockDataTomorrow: TaskDTO[] = [
        {
            id: 0,
            name: "Tomorrow 1",
            startTime: (() => {
                const date = new Date();
                date.setDate(date.getDate() + 1);
                date.setHours(6, 0, 0, 0); // Set to 6:00 AM
                return date;
            })(),
            endTime: (() => {
                const date = new Date();
                date.setDate(date.getDate() + 1);
                date.setHours(7, 0, 0, 0); // Set to 7:00 AM
                return date;
            })(),
        },
        {
            id: 1,
            name: "Tomorrow 2",
            startTime: (() => {
                const date = new Date();
                date.setDate(date.getDate() + 1);
                date.setHours(7, 0, 0, 0); // Set to 7:00 AM
                return date;
            })(),
            endTime: (() => {
                const date = new Date();
                date.setDate(date.getDate() + 1);
                date.setHours(8, 0, 0, 0); // Set to 8:00 AM
                return date;
            })(),
        },
    ];

    const sourceDate = new Date();
    const key = dateToQueryKey(sourceDate);
    const key2 = dateToQueryKey(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );

    queryClient.setQueryData(key, mockDataToday);
    queryClient.setQueryData(key2, mockDataTomorrow);

    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView>
                <DateProvider>{children}</DateProvider>
            </GestureHandlerRootView>
        </QueryClientProvider>
    );
};

export default ProviderWrapper;
