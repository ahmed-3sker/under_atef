import type { Role } from "../components/auth_provider";

export type Status = "present" | "absent" | "excused";

export interface ClassItem {
  _id: string;
  name: string;
  grade: number;
  letter: string;
}

export interface StudentItem {
  _id: string;
  name: string;
  studentId: string;
  class: { _id: string; name: string } | string;
  isActive: boolean;
}

export interface ReportRecord {
  student: string;
  studentName: string;
  studentCode: string;
  status: Status;
}

export interface ReportItem {
  _id: string;
  class: string;
  className: string;
  date: string;
  session: number;
  records: ReportRecord[];
}

export interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface StudentDay {
  date: string;
  sessions: Record<string, Status>;
}
