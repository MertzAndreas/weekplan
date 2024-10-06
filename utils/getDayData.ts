import { TaskDTO } from "../types/TaskDTO";

const today = new Date();
const mockData:TaskDTO[] = [{name: "Show Up", description: "You will Show up", startTime: today.toDateString(), endTime: today.toDateString()}]

const data = new Map<[number, number, number], TaskDTO[]>();
data.set([today.getDate(), today.getMonth(), today.getFullYear()].toString(), mockData);

export function getDayData(date: Date) {
    const key = [date.getDate(), date.getMonth(), date.getFullYear()].toString();
    const taskData = data.get(key);

    console.log(Array.from(data.keys()) + " | " + key + " : " + taskData);
    return taskData ?? [];
}
