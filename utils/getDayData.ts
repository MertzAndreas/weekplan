import { TaskDTO } from "../types/TaskDTO";

const today = new Date();
const mockData: TaskDTO[] = [
  {
    name: "Show Up",
    description: "You will Show up",
    startTime: today,
    endTime: today,
    imageUrl: "https://picsum.photos/200/300",
  },
];

const data = new Map<string, TaskDTO[]>();
data.set(
  [today.getDate(), today.getMonth(), today.getFullYear()].toString(),
  mockData
);

export function getDayData(date: Date) {
  const key = [date.getDate(), date.getMonth(), date.getFullYear()].toString();
  const taskData = data.get(key);
  return taskData ?? [];
}
