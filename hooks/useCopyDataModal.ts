import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { TaskDTO } from '../types/TaskDTO';
import { formattedDate } from '../utils/formattedDate';
import { dateToQueryKey } from './useActivity';

type CopyDayDataModalProps = {
  destinationDate: Date;
  sourceDate: Date;
};

type DayData = {
  sourceDate: Date;
  sourceDateData: TaskDTO[];
  destinationDate: Date;
};

const useCopyDataModal = ({
  destinationDate,
  sourceDate,
}: CopyDayDataModalProps) => {
  const [error, setError] = useState<string>();
  const [dates, setDates] = useState<DayData>({
    sourceDate: sourceDate,
    sourceDateData: [],
    destinationDate: destinationDate,
  });
  const queryClient = useQueryClient();

  const getSourceDateData = useCallback(() => {
    const key = dateToQueryKey(dates.sourceDate);
    const sourceDataActivities = queryClient.getQueryData<TaskDTO[]>(key);

    if (!sourceDataActivities) {
      setError(
        `Ingen aktiviteter fundet for ${formattedDate(dates.sourceDate)}`
      );
      setDates((prevData) => ({
        ...prevData,
        sourceDateData: [],
      }));
      return;
    }

    setDates((prevData) => ({
      ...prevData,
      sourceDateData: sourceDataActivities,
    }));
    setError('');
  }, [dates.sourceDate, queryClient]);

  useEffect(() => {
    getSourceDateData();
  }, [getSourceDateData]);

  const handleDateChange = useCallback(
    (selectedDate: Date | undefined, type: 'source' | 'destination') => {
      if (!selectedDate) return;
      if (type === 'source') {
        setDates((prev) => ({ ...prev, sourceDate: selectedDate }));
      } else {
        setDates((prev) => ({ ...prev, destinationDate: selectedDate }));
      }
    },
    []
  );

  return {
    handleDateChange,
    error,
    dates,
  };
};

export default useCopyDataModal;
