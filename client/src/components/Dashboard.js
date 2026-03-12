import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Stack,
  Badge,
  Table,
  Loader,
  Center,
  Paper,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconUsers,
  IconClipboardList,
  IconChartBar,
  IconCheck,
  IconSparkles,
  IconTrophy,
  IconCertificate,
  IconBriefcase,
  IconCode,
  IconBulb,
} from "@tabler/icons-react";
import { getStudents, getSummaryReport } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEntries: 0,
    avgMarks: 0,
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isFaculty } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, reportRes] = await Promise.all([
        getStudents(),
        getSummaryReport(),
      ]);

      let students = studentsRes.data;
      let report = reportRes.data;

      // Filter data for students (only show their own data)
      if (!isFaculty() && user?.student_id) {
        students = students.filter((s) => s.id === user.student_id);
        report = report.filter((r) => r.student_id === user.student_id);
      }

      const totalMarks = report.reduce(
        (sum, student) => sum + student.total_marks,
        0,
      );
      const avgMarks =
        students.length > 0 ? (totalMarks / students.length).toFixed(2) : 0;

      setStats({
        totalStudents: students.length,
        totalEntries: report.length,
        avgMarks,
      });

      setRecentStudents(students.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load dashboard data",
        color: "red",
      });
      setLoading(false);
    }
  };

  const activityComponents = [
    {
      icon: IconCheck,
      title: "Community Service",
      description:
        "School/NGO/Industry workshops & coding sessions (Team of max 3)",
      max: 40,
      color: "blue",
    },
    {
      icon: IconSparkles,
      title: "Patent Filing & Prototyping",
      description:
        "Prototype + Patent filing + IPM cell publication OR Tech transfer",
      max: 240,
      color: "orange",
      fullFA: true,
    },
    {
      icon: IconCertificate,
      title: "Scopus-Indexed Papers",
      description:
        "Conference/Journal publications with institute students & faculty",
      max: 240,
      color: "green",
      fullFA: true,
    },
    {
      icon: IconTrophy,
      title: "Project Competitions",
      description:
        "Participation/Winning at NIRF institutions or Industry projects",
      max: 100,
      color: "pink",
    },
    {
      icon: IconCode,
      title: "Hackathons & Contests",
      description:
        "College/NIRF/Industry/Government hackathons (Participation/Winning)",
      max: 240,
      color: "cyan",
      fullFA: true,
    },
    {
      icon: IconClipboardList,
      title: "Workshops & Seminars",
      description: "Attending workshops/seminars at Top 200 NIRF institutions",
      max: 20,
      color: "violet",
    },
    {
      icon: IconCertificate,
      title: "Online Courses & Certifications",
      description: "MOOC (Coursera, Udemy) & NPTEL courses (4/8 weeks)",
      max: 80,
      color: "yellow",
    },
    {
      icon: IconBriefcase,
      title: "Entrepreneurship Activities",
      description: "Udyam registration, DPIIT recognition, Funding/Incubation",
      max: 240,
      color: "teal",
      fullFA: true,
    },
    {
      icon: IconCode,
      title: "Coding Competitions",
      description: "HackerRank, CodeChef, LeetCode (Semester-wise scoring)",
      max: 120,
      color: "red",
    },
    {
      icon: IconBulb,
      title: "Minor Projects",
      description: "Unique projects for Industry/NGO/Community",
      max: 160,
      color: "indigo",
    },
  ];

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={1} mb="xs">
            {isFaculty()
              ? "📊 Internal Marks Dashboard"
              : "🎓 My Academic Performance"}
          </Title>
          <Text c="dimmed" size="lg">
            {isFaculty()
              ? "Comprehensive system for calculating internal marks across 10 activity components"
              : "Track your achievements and internal marks across all activity components"}
          </Text>
        </div>

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group>
              <ThemeIcon size={60} radius="md" variant="light" color="blue">
                <IconUsers size={30} />
              </ThemeIcon>
              <div>
                <Text size="xl" fw={700}>
                  {stats.totalStudents}
                </Text>
                <Text size="sm" c="dimmed">
                  {isFaculty() ? "Total Students" : "My Profile"}
                </Text>
              </div>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group>
              <ThemeIcon size={60} radius="md" variant="light" color="grape">
                <IconClipboardList size={30} />
              </ThemeIcon>
              <div>
                <Text size="xl" fw={700}>
                  {stats.totalEntries}
                </Text>
                <Text size="sm" c="dimmed">
                  {isFaculty() ? "Activity Entries" : "My Activities"}
                </Text>
              </div>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group>
              <ThemeIcon size={60} radius="md" variant="light" color="cyan">
                <IconChartBar size={30} />
              </ThemeIcon>
              <div>
                <Text size="xl" fw={700}>
                  {stats.avgMarks}
                </Text>
                <Text size="sm" c="dimmed">
                  {isFaculty() ? "Average Marks" : "My Total Marks"}
                </Text>
              </div>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Activity Components */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            {isFaculty()
              ? "📋 Activity Components & Marks Allocation"
              : "📋 My Activity Components"}
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {activityComponents.map((component, index) => (
              <Paper key={index} p="md" withBorder>
                <Group mb="xs">
                  <ThemeIcon size="lg" radius="md" color={component.color}>
                    <component.icon size={20} />
                  </ThemeIcon>
                  <Text fw={600}>{component.title}</Text>
                  {component.fullFA && (
                    <Badge color="orange" variant="light" size="sm">
                      Full FA
                    </Badge>
                  )}
                </Group>
                <Text size="sm" c="dimmed" mb="xs">
                  {component.description}
                </Text>
                <Badge color={component.color} variant="filled">
                  Max: {component.max} marks
                </Badge>
              </Paper>
            ))}
          </SimpleGrid>

          <Paper p="md" mt="md" bg="var(--mantine-primary-color-light)" radius="md">
            <Text size="sm">
              <strong>💡 Note:</strong> Full FA (Formative Assessment)
              components are worth 240 marks each. Only the{" "}
              <strong>highest scoring</strong> Full FA component counts toward
              your total marks.
            </Text>
          </Paper>
        </Card>

        {/* Recent Students - Only for Faculty */}
        {isFaculty() && recentStudents.length > 0 && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Recent Students
            </Title>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Roll Number</Table.Th>
                  <Table.Th>Semester</Table.Th>
                  <Table.Th>Department</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {recentStudents.map((student) => (
                  <Table.Tr key={student.id}>
                    <Table.Td>{student.student_name}</Table.Td>
                    <Table.Td>{student.roll_number}</Table.Td>
                    <Table.Td>{student.semester}</Table.Td>
                    <Table.Td>{student.department}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        )}
      </Stack>
    </Container>
  );
};

export default Dashboard;
