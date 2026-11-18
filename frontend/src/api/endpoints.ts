import api from "./base";
import type {
  ClassItem, ReportItem, Status, StudentDay, StudentItem, UserItem,
} from "./types";
import type { Role } from "../components/auth_provider";

export const getClasses = () =>
  api.get<{ classes: ClassItem[] }>("/classes").then((r) => r.data.classes);

export const getStudents = (classId?: string) =>
  api
    .get<{ students: StudentItem[] }>("/students", { params: classId ? { class: classId } : {} })
    .then((r) => r.data.students);

export const getStudent = (id: string) =>
  api.get<{ student: StudentItem }>(`/students/${id}`).then((r) => r.data.student);

export const addStudent = (body: { name: string; studentId: string; classId: string }) =>
  api.post("/students", body);

export const addStudentsBulk = (classId: string, students: { name: string; studentId: string }[]) =>
  api.post<{ created: number }>("/students/bulk", { classId, students }).then((r) => r.data);

export const deactivateStudent = (id: string) => api.delete(`/students/${id}`);

export const getClassReport = (classId: string, date: string, session: number) =>
  api
    .get<{ report: ReportItem | null }>(`/reports/class/${classId}`, { params: { date, session } })
    .then((r) => r.data.report);

export const submitReport = (body: {
  classId: string;
  date: string;
  session: number;
  records: { studentId: string; status: Status }[];
}) => api.post<{ report: ReportItem }>("/reports", body).then((r) => r.data.report);

export const getReportDates = () =>
  api.get<{ dates: string[] }>("/reports/dates").then((r) => r.data.dates);

export const getReportsForDate = (date: string) =>
  api.get<{ reports: ReportItem[] }>("/reports", { params: { date } }).then((r) => r.data.reports);

export const getStudentHistory = (id: string) =>
  api.get<{ days: StudentDay[] }>(`/reports/student/${id}`).then((r) => r.data.days);

export const getUsers = () => api.get<{ users: UserItem[] }>("/users").then((r) => r.data.users);

export const createUser = (body: { name: string; email: string; password: string; role: Role }) =>
  api.post("/users", body);

export const updateUser = (id: string, body: Partial<{ isActive: boolean; role: Role }>) =>
  api.patch(`/users/${id}`, body);
