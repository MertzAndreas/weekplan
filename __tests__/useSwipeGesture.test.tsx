import React from "react";
import {
  FlingGesture,
  GestureDetector,
  GestureHandlerRootView,
  State,
} from "react-native-gesture-handler";

import { Text } from "react-native";
import { render, waitFor } from "@testing-library/react-native";
import useSwipeGesture from "../hooks/useSwipeGesture";
import {
  fireGestureHandler,
  getByGestureTestId,
} from "react-native-gesture-handler/jest-utils";

function SwipeGestureTestComponent({
  goToPreviousWeek,
  goToNextWeek,
}: {
  goToPreviousWeek: jest.Mock;
  goToNextWeek: jest.Mock;
}) {
  const { swipeGesture } = useSwipeGesture(goToPreviousWeek, goToNextWeek);
  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={swipeGesture}>
        <Text>v2 API test</Text>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

describe("useSwipeGesture", () => {
  let goToPreviousWeek: jest.Mock, goToNextWeek: jest.Mock;

  beforeEach(() => {
    goToPreviousWeek = jest.fn();
    goToNextWeek = jest.fn();
  });

  it("should call goToNextWeek on left swipe", async () => {
    render(
      <SwipeGestureTestComponent
        goToPreviousWeek={goToPreviousWeek}
        goToNextWeek={goToNextWeek}
      />
    );

    fireGestureHandler<FlingGesture>(getByGestureTestId("testDetector"), [
      { state: State.BEGAN, x: 0 },
      { state: State.ACTIVE, x: -200 }, // Gesture becomes active (move left)
      { state: State.END, x: -200 },
    ]);

    await waitFor(() => {
      expect(goToNextWeek).toHaveBeenCalled();
      expect(goToPreviousWeek).not.toHaveBeenCalled();
    });
  });

  it("should call goToPreviousWeek on right swipe", async () => {
    render(
      <SwipeGestureTestComponent
        goToPreviousWeek={goToPreviousWeek}
        goToNextWeek={goToNextWeek}
      />
    );

    fireGestureHandler<FlingGesture>(getByGestureTestId("testDetector"), [
      { state: State.BEGAN, x: 0 },
      { state: State.ACTIVE, x: 200 }, // Gesture becomes active (move left)
      { state: State.END, x: 200 },
    ]);

    await waitFor(() => {
      expect(goToPreviousWeek).toHaveBeenCalled();
      expect(goToNextWeek).not.toHaveBeenCalled();
    });
  });

  it("should not call any function if swipe is not enough", async () => {
    render(
      <SwipeGestureTestComponent
        goToPreviousWeek={goToPreviousWeek}
        goToNextWeek={goToNextWeek}
      />
    );

    fireGestureHandler<FlingGesture>(getByGestureTestId("testDetector"), [
      { state: State.BEGAN, x: 0 },
      { state: State.ACTIVE, x: 30 }, // Gesture becomes active (move left)
      { state: State.END, x: 30 },
    ]);

    await waitFor(() => {
      expect(goToPreviousWeek).not.toHaveBeenCalled();
      expect(goToNextWeek).not.toHaveBeenCalled();
    });

    fireGestureHandler<FlingGesture>(getByGestureTestId("testDetector"), [
      { state: State.BEGAN, x: 0 },
      { state: State.ACTIVE, x: -30 }, // Gesture becomes active (move left)
      { state: State.END, x: -30 },
    ]);

    await waitFor(() => {
      expect(goToPreviousWeek).not.toHaveBeenCalled();
      expect(goToNextWeek).not.toHaveBeenCalled();
    });
  });
});
