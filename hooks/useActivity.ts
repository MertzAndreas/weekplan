import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createActivityRequest,
  deleteRequest,
  fetchRequest,
  toggleActivityStatusRequest,
  updateRequest,
} from '../apis/activityAPI';

const MINUTE = 1000 * 60;

export const dateToQueryKey = (date: Date) => {
  if (!(date instanceof Date)) {
    throw new Error('Invalid date');
  }
  return ['activity', date.toISOString().split('T')[0]];
};

export type Activity = {
  activityId: number;
  citizenId: number;
  date: string;
  description: string;
  endTime: string;
  name: string;
  startTime: string;
  isCompleted: boolean;
};

export default function useActivity({ date }: { date: Date }) {
  const queryKey = dateToQueryKey(date);
  const queryClient = useQueryClient();

  const useFetchActivities = (id: number) => {
    return useQuery<Activity[]>({
      queryFn: () => fetchRequest(id, date),
      queryKey: queryKey,
      staleTime: MINUTE * 10,
    });
  };

  const deleteActivity = useMutation({
    mutationFn: deleteRequest,
    onMutate: async (activityId: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previousActivities = queryClient.getQueryData<Activity[]>(queryKey);

      queryClient.setQueryData<Activity[]>(
        queryKey,
        (oldData) =>
          oldData?.filter((activity) => activity.activityId !== activityId) ||
          []
      );

      return { previousActivities };
    },

    onError: (error, variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData<Activity[]>(
          queryKey,
          context.previousActivities
        );
      }
    },
  });

  const updateActivity = useMutation({
    mutationFn: (variables: { id: number; data: Partial<Activity> }) =>
      updateRequest(variables),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousActivities = queryClient.getQueryData<Activity[]>(queryKey);

      queryClient.setQueryData<Activity[]>(
        queryKey,
        (oldData) =>
          oldData?.map((activity) =>
            activity.activityId === variables.id
              ? { ...activity, ...variables.data }
              : activity
          ) || []
      );

      return { previousActivities };
    },

    onError: (error, variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData<Activity[]>(
          queryKey,
          context.previousActivities
        );
      }
    },
  });

  const createActivity = useMutation({
    mutationFn: (variables: { data: Activity }) =>
      createActivityRequest(variables),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousActivities = queryClient.getQueryData<Activity[]>(queryKey);

      queryClient.setQueryData<Activity[]>(queryKey, (oldData) => [
        ...(oldData || []),
        variables.data,
      ]);

      return { previousActivities };
    },

    onError: (error, variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData<Activity[]>(
          queryKey,
          context.previousActivities
        );
      }
    },
  });

  const toggleActivityStatus = useMutation({
    mutationFn: toggleActivityStatusRequest,

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previousActivities = queryClient.getQueryData<Activity[]>(queryKey);

      queryClient.setQueryData<Activity[]>(
        queryKey,
        (oldData) =>
          oldData?.map((activity) =>
            activity.activityId === id
              ? { ...activity, isCompleted: !activity.isCompleted }
              : activity
          ) || []
      );

      return { previousActivities };
    },

    onError: (error, variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData<Activity[]>(
          queryKey,
          context.previousActivities
        );
      }
    },
  });

  return {
    useFetchActivities,
    deleteActivity,
    updateActivity,
    toggleActivityStatus,
    createActivity,
  };
}
