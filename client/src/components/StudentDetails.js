import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Stack,
  Badge,
  Select,
  Table,
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
import {
  getStudent,
  getCalculations,
  getInternalCourseMappings,
  upsertInternalCourseMapping,
} from "../services/api";
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

const COURSE_ALLOCATION_TEMPLATE = [
  {
    code: "CSB1321",
    name: "WEB TECHNOLOGY",
    category: "Theory",
    credits: 3,
  },
  {
    code: "CSB1322",
    name: "COMPILER DESIGN",
    category: "Theory",
    credits: 3,
  },
  {
    code: "CSB1323",
    name: "CRYPTOGRAPHY AND NETWORK SECURITY",
    category: "Theory",
    credits: 4,
  },
  {
    code: "CSB1332",
    name: "DESIGN PROJECT",
    category: "Theory",
    credits: 2,
  },
  {
    code: "CSB1333",
    name: "COMPREHENSION",
    category: "Theory",
    credits: 1,
  },
  {
    code: "CSC1371",
    name: "APPLICATION DEVELOPMENT",
    category: "Theory",
    credits: 3,
  },
  {
    code: "CSC1394",
    name: "UI AND UX DESIGN",
    category: "Theory",
    credits: 3,
  },
];

const INTERNAL_COMPONENTS = [
  {
    key: "communityService",
    label: "1. Community Service",
    shortLabel: "Community Service",
    color: "blue",
    getEarned: (breakdown) => Number(breakdown.communityService?.capped || 0),
    getMax: (breakdown) => Number(breakdown.communityService?.cap || 40),
  },
  {
    key: "fullFAMarks",
    label:
      "2-4, 7. Full FA Marks (Best of Patent/Scopus/Competition/Hackathon/Entrepreneurship)",
    shortLabel: "Full FA",
    color: "orange",
    getEarned: (breakdown) => Number(breakdown.fullFAMarks?.total || 0),
    getMax: () => 240,
  },
  {
    key: "workshops",
    label: "5. Workshops & Seminars",
    shortLabel: "Workshops",
    color: "cyan",
    getEarned: (breakdown) => Number(breakdown.workshops?.capped || 0),
    getMax: (breakdown) => Number(breakdown.workshops?.cap || 20),
  },
  {
    key: "onlineCourses",
    label: "6. Online Courses",
    shortLabel: "Online Courses",
    color: "green",
    getEarned: (breakdown) => Number(breakdown.onlineCourses?.capped || 0),
    getMax: (breakdown) => Number(breakdown.onlineCourses?.cap || 80),
  },
  {
    key: "codingPlatforms",
    label: "8. Coding Platforms",
    shortLabel: "Coding Platforms",
    color: "red",
    getEarned: (breakdown) => Number(breakdown.codingPlatforms?.capped || 0),
    getMax: (breakdown) => Number(breakdown.codingPlatforms?.cap || 120),
  },
  {
    key: "minorProjects",
    label: "9. Minor Projects",
    shortLabel: "Minor Projects",
    color: "violet",
    getEarned: (breakdown) => Number(breakdown.minorProjects?.capped || 0),
    getMax: (breakdown) => Number(breakdown.minorProjects?.cap || 160),
  },
];

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [calculations, setCalculations] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [loading, setLoading] = useState(true);
  const [componentCourseMap, setComponentCourseMap] = useState({});
  const [savingComponentKey, setSavingComponentKey] = useState(null);
  const { isFaculty } = useAuth();
  const canDelete = isFaculty();

  const fetchStudentData = useCallback(async () => {
    try {
      const [studentRes, calcRes, mappingsRes] = await Promise.all([
        getStudent(id),
        getCalculations(id),
        getInternalCourseMappings(id),
      ]);

      const mappingData = Array.isArray(mappingsRes.data)
        ? mappingsRes.data.reduce((acc, mapping) => {
            acc[mapping.component_key] = mapping.course_code;
            return acc;
          }, {})
        : {};

      setStudent(studentRes.data);
      setCalculations(calcRes.data);
      setComponentCourseMap(mappingData);
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
  }, [id]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const handleCourseSelection = async (componentKey, courseCode) => {
    const selectedComponent = INTERNAL_COMPONENTS.find(
      (component) => component.key === componentKey,
    );
    const componentName = selectedComponent?.shortLabel || "Internal component";

    setSavingComponentKey(componentKey);
    try {
      await upsertInternalCourseMapping(id, {
        componentKey,
        courseCode,
      });

      setComponentCourseMap((prev) => {
        const next = { ...prev };
        if (courseCode) {
          next[componentKey] = courseCode;
        } else {
          delete next[componentKey];
        }
        return next;
      });

      notifications.show({
        title: "Saved",
        message: courseCode
          ? `${componentName} mapped to ${courseCode}`
          : `${componentName} mapping cleared`,
        color: "green",
      });
    } catch (error) {
      console.error("Error saving course mapping:", error);
      notifications.show({
        title: "Error",
        message: "Failed to save course selection",
        color: "red",
      });
    } finally {
      setSavingComponentKey(null);
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

  const componentBreakdown = calculations?.breakdown || {};
  const marksByComponent = INTERNAL_COMPONENTS.reduce((acc, component) => {
    acc[component.key] = component.getEarned(componentBreakdown);
    return acc;
  }, {});

  const courseOptions = COURSE_ALLOCATION_TEMPLATE.map((course) => ({
    value: course.code,
    label: `${course.code} - ${course.name}`,
  }));

  const courseWiseAllocation = COURSE_ALLOCATION_TEMPLATE.map((course) => {
    const mappedComponents = INTERNAL_COMPONENTS.filter(
      (component) => componentCourseMap[component.key] === course.code,
    );

    const allocatedMarks = mappedComponents.reduce(
      (sum, component) => sum + Number(marksByComponent[component.key] || 0),
      0,
    );

    return {
      ...course,
      mappedComponents,
      allocatedMarks,
    };
  });

  const totalCredits = COURSE_ALLOCATION_TEMPLATE.reduce(
    (sum, course) => sum + course.credits,
    0,
  );

  const allocatedTotal = courseWiseAllocation.reduce(
    (sum, course) => sum + course.allocatedMarks,
    0,
  );

  const unassignedTotal = INTERNAL_COMPONENTS.reduce((sum, component) => {
    if (componentCourseMap[component.key]) {
      return sum;
    }
    return sum + Number(marksByComponent[component.key] || 0);
  }, 0);

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
                    {INTERNAL_COMPONENTS.map((component) => (
                      <Paper p="sm" withBorder key={component.key}>
                        <Stack gap="xs">
                          <Group justify="space-between" wrap="wrap">
                            <Text>{component.label}</Text>
                            <Badge
                              size="lg"
                              variant="filled"
                              color={component.color}
                            >
                              {marksByComponent[component.key]} /{" "}
                              {component.getMax(componentBreakdown)}
                            </Badge>
                          </Group>

                          <Group
                            justify="space-between"
                            align="flex-end"
                            wrap="wrap"
                          >
                            <Text size="sm" c="dimmed">
                              Select subject for this internal component
                            </Text>
                            <Select
                              placeholder="Select course"
                              searchable
                              clearable
                              data={courseOptions}
                              value={componentCourseMap[component.key] || null}
                              onChange={(value) =>
                                handleCourseSelection(component.key, value)
                              }
                              disabled={savingComponentKey === component.key}
                              style={{ width: "100%", maxWidth: 360 }}
                            />
                          </Group>
                        </Stack>
                      </Paper>
                    ))}

                    <Paper
                      p="md"
                      withBorder
                      bg="var(--mantine-primary-color-light)"
                    >
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
                    Course-wise Internal Allocation
                  </Title>
                  <Text size="sm" c="dimmed" mb="md">
                    Course-wise internals are calculated from the subject
                    selected for each internal component above.
                  </Text>

                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Course Details</Table.Th>
                        <Table.Th>Credits</Table.Th>
                        <Table.Th>Mapped Components</Table.Th>
                        <Table.Th>Allocated Internal</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {courseWiseAllocation.map((course) => (
                        <Table.Tr key={course.code}>
                          <Table.Td>
                            <Text fw={600}>{course.name}</Text>
                            <Badge mt={6} variant="light" color="blue">
                              {course.code} ({course.category})
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Badge variant="light" color="gray" size="lg">
                              {course.credits}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            {course.mappedComponents.length === 0 ? (
                              <Text size="sm" c="dimmed">
                                Not mapped
                              </Text>
                            ) : (
                              <Group gap={6} wrap="wrap">
                                {course.mappedComponents.map((component) => (
                                  <Badge
                                    key={`${course.code}-${component.key}`}
                                    variant="light"
                                    color={component.color}
                                  >
                                    {component.shortLabel}
                                  </Badge>
                                ))}
                              </Group>
                            )}
                          </Table.Td>
                          <Table.Td>
                            <Badge variant="filled" color="grape" size="lg">
                              {course.allocatedMarks}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                      <Table.Tr>
                        <Table.Td>
                          <Text fw={700}>TOTAL</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="filled" color="dark" size="lg">
                            {totalCredits}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="filled" color="dark" size="lg">
                            {
                              Object.keys(componentCourseMap).filter(
                                (componentKey) =>
                                  componentCourseMap[componentKey],
                              ).length
                            }
                            /{INTERNAL_COMPONENTS.length}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="filled" color="blue" size="lg">
                            {allocatedTotal}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>

                  {unassignedTotal > 0 && (
                    <Alert
                      mt="md"
                      icon={<IconInfoCircle size={16} />}
                      title="Pending Subject Mapping"
                      color="yellow"
                    >
                      {unassignedTotal} marks are not assigned to a course yet.
                      Select subjects in Marks Breakdown to include them in
                      course-wise internals.
                    </Alert>
                  )}
                </Card>

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
