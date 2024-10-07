import { createContext, useContext } from "react";
import useWeek from "../hooks/useWeek";

type DataProviderValues = {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  weekDates: Date[];
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  weekNumber: number;
  setWeekAndYear: (week: number, year: number) => void;
};
const DateContext = createContext<DataProviderValues | undefined>(undefined);

const DateProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    weekDates,
    currentDate: selectedDate,
    setCurrentDate: setSelectedDate,
    goToPreviousWeek,
    goToNextWeek,
    weekNumber,
    setWeekAndYear,
  } = useWeek();

  return (
    <DateContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        weekDates,
        goToPreviousWeek,
        goToNextWeek,
        weekNumber,
        setWeekAndYear,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};

export default DateProvider;
