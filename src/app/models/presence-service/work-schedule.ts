export interface WorkSchedule {
      id?: number;
  startTime: string;      // ISO time string (ex: "08:30:00")
  endTime: string;        // ISO time string
  toleranceMinutes?: number;
  active?: boolean;
}
