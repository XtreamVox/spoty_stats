// app/dashboard/layout.jsx
import DashboardProvider from "./DashboardContext";

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
}
