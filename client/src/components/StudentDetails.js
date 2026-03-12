import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Stack,
  Badge,
  Tabs,
  Loader,
  Center,
  Grid,
  Paper,
  ThemeIcon,
  Alert,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconUser,
  IconMail,
  IconSchool,
  IconBuilding,
  IconChartBar,
  IconInfoCircle,
} from "@tabler/icons-react";
import { getStudent, getCalculations } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Import all component forms
import CommunityServiceForm from "./forms/CommunityServiceForm";
import PatentForm from "./forms/PatentForm";
import ScopusForm from "./forms/ScopusForm";
import ProjectCompetitionForm from "./forms/ProjectCompetitionForm";
import HackathonForm from "./forms/HackathonForm";
import WorkshopForm from "./forms/WorkshopForm";
import OnlineCourseForm from "./forms/OnlineCourseForm";
import EntrepreneurshipForm from "./forms/EntrepreneurshipForm";
import CodingPlatformForm from "./forms/CodingPlatformForm";
import MinorProjectForm from "./forms/MinorProjectForm";

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [calculations, setCalculations] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [loading, setLoading] = useState(true);
  const { isFaculty } = useAuth();
  const canDelete = isFaculty();

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      const [studentRes, calcRes] = await Promise.all([
        getStudent(id),
        getCalculations(id),
      ]);
      setStudent(studentRes.data);
      setCalculations(calcRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching student data:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load student data",
        color: "red",
      });
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchStudentData();
  };

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (!student) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconInfoCircle />} title="Not Found" color="red">
          Student not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Student Info Card */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={2} mb="md">
            {student.student_name}
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <ThemeIcon variant="light" size="lg">
                  <IconUser size={18} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">
                    Roll Number
                  </Text>
                  <Text fw={500}>{student.roll_number}</Text>
                </div>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <ThemeIcon variant="light" size="lg" color="cyan">
                  <IconSchool size={18} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">
                    Semester
                  </Text>
                  <Text fw={500}>{student.semester}</Text>
                </div>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <ThemeIcon variant="light" size="lg" color="green">
                  <IconMail size={18} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">
                    Email
                  </Text>
                  <Text fw={500}>{student.email || "-"}</Text>
                </div>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <ThemeIcon variant="light" size="lg" color="orange">
                  <IconBuilding size={18} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">
                    Department
                  </Text>
                  <Text fw={500}>{student.department || "-"}</Text>
                </div>
              </Group>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="summary">Summary</Tabs.Tab>
            <Tabs.Tab value="community">Community Service</Tabs.Tab>
            <Tabs.Tab value="patent">Patent Filing</Tabs.Tab>
            <Tabs.Tab value="scopus">Scopus Papers</Tabs.Tab>
            <Tabs.Tab value="project">Project Competition</Tabs.Tab>
            <Tabs.Tab value="hackathon">Hackathons</Tabs.Tab>
            <Tabs.Tab value="workshop">Workshops</Tabs.Tab>
            <Tabs.Tab value="course">Online Courses</Tabs.Tab>
            <Tabs.Tab value="entrepreneurship">Entrepreneurship</Tabs.Tab>
            <Tabs.Tab value="coding">Coding Platforms</Tabs.Tab>
            <Tabs.Tab value="minor">Minor Projects</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="summary" pt="md">
            {calculations && (
              <Stack gap="lg">
                {/* Total Marks */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" align="center">
                    <Group>
                      <ThemeIcon size="xl" variant="light" color="blue">
                        <IconChartBar size={24} />
                      </ThemeIcon>
                      <div>
                        <Text size="sm" c="dimmed">
                          Total Marks
                        </Text>
                        <Title order={2}>{calculations.totalMarks}</Title>
                      </div>
                    </Group>
                  </Group>
                </Card>

                {/* Marks Breakdown */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={3} mb="md">
                    Marks Breakdown
                  </Title>
                  <Stack gap="sm">
                    <Paper p="sm" withBorder>
                      <Group justify="space-between">
                        <Text>1. Community Service</Text>
                        <Badge size="lg" variant="filled">
                          {calculations.breakdown.communityService.capped} /{" "}
                          {calculations.breakdown.communityService.cap}
                        </Badge>
                      </Group>
                    </Paper>

                    <Paper p="sm" withBorder>
                      <Group justify="space-between">
                        <Text>
                          2-4, 7. Full FA Marks (Best of
                          Patent/Scopus/Competition/Hackathon/Entrepreneurship)
                        </Text>
                        <Badge size="lg" variant="filled" color="orange">
                          {calculations.breakdown.fullFAMarks.total} / 240
                        </Badge>
                      </Group>
                    </Paper>

                    <Paper p="sm" withBorder>
                      <Group justify="space-between">
                        <Text>5. Workshops & Seminars</Text>
                        <Badge size="lg" variant="filled" color="cyan">
                          {calculations.breakdown.workshops.capped} /{" "}
                          {calculations.breakdown.workshops.cap}
                        </Badge>
                      </Group>
                    </Paper>

                    <Paper p="sm" withBorder>
                      <Group justify="space-between">
                        <Text>6. Online Courses</Text>
                        <Badge size="lg" variant="filled" color="green">
                          {calculations.breakdown.onlineCourses.capped} /{" "}
                          {calculations.breakdown.onlineCourses.cap}
                        </Badge>
                      </Group>
                    </Paper>

                    <Paper p="sm" withBorder>
                      <Group justify="space-between">
                        <Text>8. Coding Platforms</Text>
                        <Badge size="lg" variant="filled" color="red">
                          {calculations.breakdown.codingPlatforms.capped} /{" "}
                          {calculations.breakdown.codingPlatforms.cap}
                        </Badge>
                      </Group>
                    </Paper>

                    <Paper p="sm" withBorder>
                      <Group justify="space-between">
                        <Text>9. Minor Projects</Text>
                        <Badge size="lg" variant="filled" color="violet">
                          {calculations.breakdown.minorProjects.capped} /{" "}
                          {calculations.breakdown.minorProjects.cap}
                        </Badge>
                      </Group>
                    </Paper>

                    <Paper p="md" withBorder bg="var(--mantine-primary-color-light)">
                      <Group justify="space-between">
                        <Text fw={700} size="lg">
                          TOTAL MARKS
                        </Text>
                        <Badge size="xl" variant="filled">
                          {calculations.totalMarks}
                        </Badge>
                      </Group>
                    </Paper>
                  </Stack>
                </Card>

                {/* Detailed Breakdown */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={3} mb="md">
                    Detailed Breakdown
                  </Title>
                  <Stack gap="xs">
                    <div>
                      <Text fw={600} c="dimmed">
                        Patent Filing:{" "}
                        {calculations.breakdown.patentFiling.total} marks
                      </Text>
                      <Text size="sm" c="dimmed">
                        {calculations.breakdown.patentFiling.entries.length}{" "}
                        entries
                      </Text>
                    </div>

                    <div>
                      <Text fw={600} c="dimmed">
                        Scopus Papers:{" "}
                        {calculations.breakdown.scopusPapers.total} marks
                      </Text>
                      <Text size="sm" c="dimmed">
                        {calculations.breakdown.scopusPapers.entries.length}{" "}
                        entries
                      </Text>
                    </div>

                    <div>
                      <Text fw={600} c="dimmed">
                        Project Competitions:{" "}
                        {calculations.breakdown.projectCompetitions.total} marks
                      </Text>
                      <Text size="sm" c="dimmed">
                        {
                          calculations.breakdown.projectCompetitions.entries
                            .length
                        }{" "}
                        entries
                      </Text>
                    </div>

                    <div>
                      <Text fw={600} c="dimmed">
                        Hackathons: {calculations.breakdown.hackathons.total}{" "}
                        marks
                      </Text>
                      <Text size="sm" c="dimmed">
                        {calculations.breakdown.hackathons.entries.length}{" "}
                        entries
                      </Text>
                    </div>

                    <div>
                      <Text fw={600} c="dimmed">
                        Entrepreneurship:{" "}
                        {calculations.breakdown.entrepreneurship.total} marks
                      </Text>
                      <Text size="sm" c="dimmed">
                        {calculations.breakdown.entrepreneurship.entries.length}{" "}
                        entries
                      </Text>
                    </div>
                  </Stack>
                </Card>
              </Stack>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="community" pt="md">
            <CommunityServiceForm
              studentId={id}
              onSuccess={refreshData}
              canDelete={canDelete}
            />
          </Tabs.Panel>

          <Tabs.Panel value="patent" pt="md">
            <PatentForm
              studentId={id}
              onSuccess={refreshData}
              canDelete={canDelete}
            />
          </Tabs.Panel>

          <Tabs.Panel value="scopus" pt="md">
            <ScopusForm
              studentId={id}
              onSuccess={refreshData}
              canDelete={canDelete}
            />
          </Tabs.Panel>

          <Tabs.Panel value="project" pt="md">
            <ProjectCompetitionForm
              studentId={id}
              onSuccess={refreshData}
              canDelete={canDelete}
            />
          </Tabs.Panel>

          <Tabs.Panel value="hackathon" pt="md">
            <HackathonForm
              studentId={id}
              onSuccess={refreshData}
              canDelete={canDelete}
            />
          </Tabs.Panel>

          <Tabs.Panel value="workshop" pt="md">
            <WorkshopForm
              studentId={id}
              onSuccess={refreshData}
              canDelete={canDelete}
            />
          </Tabs.Panel>

          <Tabs.Panel value="course" pt="md">
            <OnlineCourseForm
              studentId={id}
              onSuccess={refreshData}
              canDelete={canDelete}
            />
          </Tabs.Panel>

          <Tabs.Panel value="entrepreneurship" pt="md">
            <EntrepreneurshipForm
              studentId={id}
              onSuccess={refreshData}
              canDelete={canDelete}
            />
          </Tabs.Panel>

          <Tabs.Panel value="coding" pt="md">
            <CodingPlatformForm
              studentId={id}
              onSuccess={refreshData}
              canDelete={canDelete}
            />
          </Tabs.Panel>

          <Tabs.Panel value="minor" pt="md">
            <MinorProjectForm
              studentId={id}
              onSuccess={refreshData}
              canDelete={canDelete}
            />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};

export default StudentDetails;
