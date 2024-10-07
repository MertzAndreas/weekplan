import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import useActivity, { dateToQueryKey } from "../hooks/useActivity";
import { Activity } from "../hooks/useActivity";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
      gcTime: Infinity,
    },
    mutations: {
      retry: false,
      gcTime: Infinity,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

jest.mock("../apis/activityAPI", () => ({
  fetchRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve([
      { id: 1, isCompleted: false },
      { id: 2, isCompleted: false },
    ]);
  }),
  deleteRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
  updateRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
  toggleActivityStatusRequest: jest.fn().mockImplementation((id: number) => {
    return Promise.resolve({ id, isCompleted: true });
  }),
  createActivityRequest: jest.fn().mockImplementation((activity: Activity) => {
    return Promise.resolve({ ...activity });
  }),
}));

beforeEach(async () => {
  await act(async () => {
    queryClient.clear();
    await queryClient.cancelQueries();
  });
});

afterEach(async () => {
  await act(async () => {
    queryClient.clear();
    await queryClient.cancelQueries();
  });
});

test("query key is correct", () => {
  const date = new Date("2024-10-01");
  const key = dateToQueryKey(date);
  expect(key).toEqual(["activity", "2024-10-01"]);
});

test("invalid date throws an error", () => {
  const date = "2024-10-01";
  expect(() => dateToQueryKey(date as any)).toThrow();
});

test("invalid date throws on error when used in useActivity", async () => {
  //Needed to not log the error
  const consoleErrorMock = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});
  const date = "2024-10-01";
  try {
    renderHook(() => useActivity({ date: date as any }), { wrapper });
  } catch (error) {
    expect(error).toEqual(new Error("Invalid date"));
  }

  consoleErrorMock.mockRestore();
});

test("deleteActivity removes the activity from the list", async () => {
  const date = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  const key = dateToQueryKey(date);

  await act(async () => {
    queryClient.setQueryData<Activity[]>(key, [
      { id: 1, isCompleted: false },
      { id: 2, isCompleted: false },
    ]);
    await result.current.deleteActivity.mutateAsync(1);
  });

  await waitFor(() => {
    expect(queryClient.getQueryData<Activity[]>(key)).toEqual([
      { id: 2, isCompleted: false },
    ]);
  });
});

test("updateActivity updates the activity in the list", async () => {
  const date = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  const key = dateToQueryKey(date);

  await act(async () => {
    queryClient.setQueryData<Activity[]>(key, [
      { id: 1, isCompleted: false },
      { id: 2, isCompleted: false },
    ]);
    await result.current.updateActivity.mutateAsync({
      id: 1,
      data: { id: 1, isCompleted: true },
    });
  });

  await waitFor(() => {
    expect(queryClient.getQueryData<Activity[]>(key)).toEqual([
      { id: 1, isCompleted: true },
      { id: 2, isCompleted: false },
    ]);
  });
});

test("fetchActivities retrieves and sets activities", async () => {
  const date = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  await waitFor(() =>
    expect(result.current.fetchActivities.isSuccess).toBe(true)
  );

  expect(result.current.fetchActivities.data).toEqual([
    { id: 1, isCompleted: false },
    { id: 2, isCompleted: false },
  ]);
});

test("createActivity adds a new activity to the list", async () => {
  const date = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  const key = dateToQueryKey(date);

  await act(async () => {
    queryClient.setQueryData<Activity[]>(key, [
      { id: 1, isCompleted: false },
      { id: 2, isCompleted: false },
    ]);
  });

  await act(async () => {
    await result.current.createActivity.mutateAsync({
      data: { id: 3, isCompleted: false },
    });
  });

  await waitFor(() => {
    expect(queryClient.getQueryData<Activity[]>(key)).toEqual([
      { id: 1, isCompleted: false },
      { id: 2, isCompleted: false },
      { id: 3, isCompleted: false },
    ]);
  });
});

test("toggleActivityStatus toggles the status of the activity", async () => {
  const date = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  const key = dateToQueryKey(date);

  await act(async () => {
    queryClient.setQueryData<Activity[]>(key, [
      { id: 1, isCompleted: false },
      { id: 2, isCompleted: false },
    ]);
  });

  await act(async () => {
    await result.current.toggleActivityStatus.mutateAsync(1);
  });

  const updatedData = queryClient.getQueryData<Activity[]>(key);
  const activityWithId1 = updatedData?.find((activity) => activity.id === 1);

  await waitFor(() => {
    expect(activityWithId1).toEqual(
      expect.objectContaining({ isCompleted: true })
    );
  });
});

test("toggleActivityStatus does not update the list if the activity is not found", async () => {
  const date = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  const key = dateToQueryKey(date);

  await act(async () => {
    queryClient.setQueryData<Activity[]>(key, [
      { id: 1, isCompleted: false },
      { id: 2, isCompleted: false },
    ]);
  });

  await act(async () => {
    await result.current.toggleActivityStatus.mutateAsync(3);
  });

  await waitFor(() => {
    const updatedData = queryClient.getQueryData<Activity[]>(key);
    expect(updatedData).toEqual([
      { id: 1, isCompleted: false },
      { id: 2, isCompleted: false },
    ]);
  });
});

//THESE ARE THE FUCKERS
//ONE OR ALL OF THESE FAILS
test("toggleActivityStatus does not update data if the key differs from initial", async () => {
  const initialDate = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date: initialDate }), {
    wrapper,
  });

  const differentKey = dateToQueryKey(new Date("2024-10-02"));

  await act(async () => {
    queryClient.setQueryData<Activity[]>(differentKey, [
      { id: 1, isCompleted: false },
    ]);
    await result.current.toggleActivityStatus.mutateAsync(1);
  });

  await waitFor(() => {
    const differentKeyData = queryClient.getQueryData<Activity[]>(differentKey);
    expect(differentKeyData).toEqual([{ id: 1, isCompleted: false }]);
  });
});

test("deleteActivity does not remove data if the key differs from initial", async () => {
  const initialDate = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date: initialDate }), {
    wrapper,
  });

  const differentKey = dateToQueryKey(new Date("2024-10-02"));

  await act(async () => {
    queryClient.setQueryData<Activity[]>(differentKey, [
      { id: 1, isCompleted: false },
    ]);
    await result.current.deleteActivity.mutateAsync(1);
  });

  await waitFor(() => {
    const differentKeyData = queryClient.getQueryData<Activity[]>(differentKey);
    expect(differentKeyData).toEqual([{ id: 1, isCompleted: false }]);
  });
});