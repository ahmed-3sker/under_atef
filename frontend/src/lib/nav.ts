import type { Role } from "../components/auth_provider";

export const LINKS: { to: string; label: string; description: string; roles: Role[] }[] = [
  { to: "/dashboard", label: "Dashboard", description: "Today at a glance", roles: ["admin", "principal"] },
  { to: "/attendance", label: "Attendance", description: "Take attendance for a class", roles: ["admin", "teacher"] },
  { to: "/students", label: "Students", description: "Browse students and their history", roles: ["admin", "principal", "teacher"] },
  { to: "/reports", label: "Reports", description: "Daily attendance reports", roles: ["admin", "principal"] },
  { to: "/users", label: "Users", description: "Manage staff accounts", roles: ["admin"] },
];
