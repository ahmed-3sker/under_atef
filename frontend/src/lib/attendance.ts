import type { ReportItem, Status } from "../api/types";

export const STATUSES: Status[] = ["present", "absent", "excused"];
export const SESSIONS = [1, 2, 3, 4, 5];

export const LABEL: Record<Status, string> = {
  present: "Present",
  absent: "Absent",
  excused: "Excused",
};

export const badge: Record<Status, string> = {
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
  excused: "bg-blue-100 text-blue-800",
};

export const tile: Record<Status, string> = {
  present: "bg-green-50 text-green-700",
  absent: "bg-red-50 text-red-700",
  excused: "bg-blue-50 text-blue-700",
};

export const dot: Record<Status, string> = {
  present: "bg-green-500",
  absent: "bg-red-500",
  excused: "bg-blue-500",
};

export function buttonStyle(status: Status, selected: boolean) {
  const styles: Record<Status, [string, string]> = {
    present: ["bg-green-600 text-white", "border border-green-200 text-green-700 hover:bg-green-50"],
    absent: ["bg-red-600 text-white", "border border-red-200 text-red-700 hover:bg-red-50"],
    excused: ["bg-blue-600 text-white", "border border-blue-200 text-blue-700 hover:bg-blue-50"],
  };
  return styles[status][selected ? 0 : 1];
}

// YYYY-MM-DD in Cairo time, same as the backend, so "today" matches on both sides
export function todayISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" });
}

export function percent(part: number, total: number) {
  return total === 0 ? "-" : `${Math.round((part / total) * 100)}%`;
}

// Absent beats excused beats present
export function dayStatus(statuses: Status[]): Status | null {
  if (statuses.length === 0) return null;
  if (statuses.includes("absent")) return "absent";
  if (statuses.includes("excused")) return "excused";
  return "present";
}

export type StudentLine = {
  studentId: string; // database id, used for links
  code: string;
  name: string;
  className: string;
  sessions: Record<number, Status>;
};

export function buildLines(reports: ReportItem[], classFilter = "all"): StudentLine[] {
  const map = new Map<string, StudentLine>();
  for (const report of reports) {
    if (classFilter !== "all" && report.className !== classFilter) continue;
    for (const r of report.records) {
      const key = `${report.className}-${r.studentCode}`;
      if (!map.has(key)) {
        map.set(key, {
          studentId: r.student,
          code: r.studentCode,
          name: r.studentName,
          className: report.className,
          sessions: {},
        });
      }
      map.get(key)!.sessions[report.session] = r.status;
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => a.className.localeCompare(b.className) || a.code.localeCompare(b.code),
  );
}

export function lineStatus(line: StudentLine, upTo: number): Status | null {
  return dayStatus(SESSIONS.filter((n) => n <= upTo).map((n) => line.sessions[n]).filter(Boolean));
}

export function countLines(lines: StudentLine[], upTo: number) {
  const counts: Record<Status, number> = { present: 0, absent: 0, excused: 0 };
  let total = 0;
  for (const line of lines) {
    const status = lineStatus(line, upTo);
    if (status) {
      counts[status] += 1;
      total += 1;
    }
  }
  return { counts, total, totalAbsent: counts.absent + counts.excused };
}
