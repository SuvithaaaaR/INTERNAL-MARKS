import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Title,
  Text,
  Button,
  Menu,
  Badge,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDashboard,
  IconUsers,
  IconClipboardCheck,
  IconReportAnalytics,
  IconLogout,
  IconUser,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { useThemeContext } from "./context/ThemeContext";
import "./App.css";

import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import StudentDetails from "./components/StudentDetails";
import Reports from "./components/Reports";
import StaffEvaluation from "./components/StaffEvaluation";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const [opened, { toggle }] = useDisclosure();
  const { user, logout, isFaculty } = useAuth();
  const { colorScheme, toggleColorScheme } = useThemeContext();

  // Different navigation items based on role
  const facultyNavItems = [
    { label: "Dashboard", path: "/", icon: IconDashboard },
    { label: "Students", path: "/students", icon: IconUsers },
    {
      label: "Staff Evaluation",
      path: "/staff-evaluation",
      icon: IconClipboardCheck,
    },
    { label: "Reports", path: "/reports", icon: IconReportAnalytics },
  ];

  const studentNavItems = [
    { label: "My Dashboard", path: "/", icon: IconDashboard },
    { label: "My Profile", path: "/students", icon: IconUsers },
    { label: "My Reports", path: "/reports", icon: IconReportAnalytics },
  ];

  // Use appropriate navigation based on role
  const navItems = isFaculty() ? facultyNavItems : studentNavItems;

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <AppShell
                header={{ height: 70 }}
                navbar={{
                  width: 280,
                  breakpoint: "sm",
                  collapsed: { mobile: !opened },
                }}
                padding="md"
              >
                <AppShell.Header>
                  <Group h="100%" px="md" justify="space-between">
                    <Group>
                      <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                      />
                      {isFaculty() ? (
                        <Title order={3} c="blue">
                          📊 Internal Marks Calculator
                        </Title>
                      ) : (
                        <div>
                          <Title order={3} c="blue" style={{ marginBottom: 0 }}>
                            Welcome, {user?.full_name || user?.username}
                          </Title>
                          <Text size="xs" c="dimmed">
                            Student Portal
                          </Text>
                        </div>
                      )}
                    </Group>
                    <Group>
                      <Tooltip
                        label={
                          colorScheme === "dark" ? "Light mode" : "Dark mode"
                        }
                      >
                        <ActionIcon
                          variant="default"
                          size="lg"
                          onClick={toggleColorScheme}
                        >
                          {colorScheme === "dark" ? (
                            <IconSun size={18} />
                          ) : (
                            <IconMoon size={18} />
                          )}
                        </ActionIcon>
                      </Tooltip>
                      <Badge
                        color={user?.role === "faculty" ? "blue" : "green"}
                        variant="light"
                      >
                        {user?.role === "faculty" ? "Faculty" : "Student"}
                      </Badge>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <Button
                            variant="subtle"
                            leftSection={<IconUser size={18} />}
                          >
                            {user?.full_name || user?.username}
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Label>Account</Menu.Label>
                          <Menu.Item
                            leftSection={<IconLogout size={16} />}
                            color="red"
                            onClick={handleLogout}
                          >
                            Logout
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Group>
                </AppShell.Header>

                <AppShell.Navbar p="md">
                  <Text size="xs" fw={700} c="dimmed" mb="md" tt="uppercase">
                    Navigation
                  </Text>
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      label={item.label}
                      leftSection={<item.icon size={20} stroke={1.5} />}
                      component="a"
                      href={item.path}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = item.path;
                        toggle();
                      }}
                      mb="xs"
                    />
                  ))}
                </AppShell.Navbar>

                <AppShell.Main>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/students/:id" element={<StudentDetails />} />
                    <Route
                      path="/staff-evaluation"
                      element={
                        isFaculty() ? (
                          <StaffEvaluation />
                        ) : (
                          <Navigate to="/" replace />
                        )
                      }
                    />
                    <Route path="/reports" element={<Reports />} />
                  </Routes>
                </AppShell.Main>
              </AppShell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
