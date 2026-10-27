import { useAuth } from "./auth_provider";

const colors = {
  admin: "#1c1a3c",
  principal: "#7a4b00",
  teacher: "#1f6f43",
};

export default function RoleBadge() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <span
      style={{
        background: colors[user.role],
        color: "#fff",
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}
    >
      {user.role}
    </span>
  );
}
