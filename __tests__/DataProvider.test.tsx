import { renderHook, act, render } from "@testing-library/react-native";
import DateProvider, { useDate } from "../providers/DateProvider";
import { View, Text } from "react-native";

describe("DateProvider and useDate", () => {
  it("should update selectedDate when setSelectedDate is called", () => {
    const { result } = renderHook(() => useDate(), {
      wrapper: DateProvider,
    });

    const newDate = new Date("2024-02-01");
    act(() => {
      result.current.setSelectedDate(newDate);
    });

    expect(result.current.selectedDate).toBe(newDate);
  });

  it("should throw an error if useDate is used outside DateProvider", () => {
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    try {
      renderHook(() => useDate());
    } catch (error) {
      expect(error).toEqual(
        new Error("useDate must be used within a DateProvider")
      );
    }
    consoleErrorMock.mockRestore();
  });

  it("should render children components correctly within DateProvider", () => {
    const { getByText } = render(
      <DateProvider>
        <View>
          <Text>Child Component</Text>
        </View>
      </DateProvider>
    );

    expect(getByText("Child Component")).toBeTruthy();
  });
});
