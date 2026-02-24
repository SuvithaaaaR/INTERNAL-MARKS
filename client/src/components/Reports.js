import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Table,
  Select,
  Group,
  Stack,
  Loader,
  Center,
  Paper,
  Badge,
  ScrollArea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconFileDownload } from "@tabler/icons-react";
import { getSummaryReport } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Reports = () => {
  const [report, setReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semesterFilter, setSemesterFilter] = useState("all");
  const { user, isFaculty } = useAuth();

  useEffect(() => {
    fetchReport();
  }, []);

  useEffect(() => {
    if (semesterFilter === "all") {
      setFilteredReport(report);
    } else {
      setFilteredReport(
        report.filter((s) => s.semester === parseInt(semesterFilter)),
      );
    }
  }, [semesterFilter, report]);

  const fetchReport = async () => {
    try {
      const response = await getSummaryReport();
      let reportData = response.data;
      
      // Filter data for students (only show their own data)
      if (!isFaculty() && user?.student_id) {
        reportData = reportData.filter(r => r.student_id === user.student_id);
      }
      
      setReport(reportData);
      setFilteredReport(reportData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching report:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load report",
        color: "red",
      });
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Roll Number",
      "Semester",
      "Department",
      "Community Service",
      "Patent",
      "Scopus",
      "Competition",
      "Hackathon",
      "Workshop",
      "Course",
      "Entrepreneurship",
      "Coding",
      "Projects",
      "Full FA Marks",
      "Total Marks",
    ];

    const csvData = filteredReport.map((student) => [
      student.student_name,
      student.roll_number,
      student.semester,
      student.department || "",
      student.community_service_marks,
      student.patent_marks,
      student.scopus_marks,
      student.competition_marks,
      student.hackathon_marks,
      student.workshop_marks,
      student.course_marks,
      student.entrepreneurship_marks,
      student.coding_marks,
      student.project_marks,
      student.full_fa_marks,
      student.total_marks,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `internal_marks_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <div>
          <Title order={1} mb="xs">
            {isFaculty() ? "Reports" : "My Marks Report"}
          </Title>
          <Text c="dimmed" size="lg">
            {isFaculty() 
              ? "View and export marks summary" 
              : "View your complete marks breakdown across all activities"
            }
          </Text>
        </div>

        {/* Filters and Export */}
        <Group justify="space-between">
          {isFaculty() && (
            <Select
              label="Filter by Semester"
              value={semesterFilter}
              onChange={(value) => setSemesterFilter(value || "all")}
              data={[
                { value: "all", label: "All Semesters" },
                { value: "2", label: "Semester 2" },
                { value: "3", label: "Semester 3" },
                { value: "4", label: "Semester 4" },
                { value: "5", label: "Semester 5" },
                { value: "6", label: "Semester 6" },
                { value: "7", label: "Semester 7" },
              ]}
              style={{ width: 200 }}
            />
          )}
          <Button
            leftSection={<IconFileDownload size={16} />}
            color="green"
            onClick={exportToCSV}
          >
            {isFaculty() ? "Export to CSV" : "Download My Report"}
          </Button>
        </Group>

        {/* Report Table */}
        {filteredReport.length === 0 ? (
          <Paper p="xl" withBorder>
            <Center>
              <Stack align="center" gap="md">
                <Text size="xl" fw={600}>
                  No data available
                </Text>
                <Text c="dimmed">
                  Add students and their entries to generate reports
                </Text>
              </Stack>
            </Center>
          </Paper>
        ) : (
          <Paper withBorder>
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Roll No</Table.Th>
                    <Table.Th>Sem</Table.Th>
                    <Table.Th>Dept</Table.Th>
                    <Table.Th>Community</Table.Th>
                    <Table.Th>Patent</Table.Th>
                    <Table.Th>Scopus</Table.Th>
                    <Table.Th>Competition</Table.Th>
                    <Table.Th>Hackathon</Table.Th>
                    <Table.Th>Workshop</Table.Th>
                    <Table.Th>Course</Table.Th>
                    <Table.Th>Startup</Table.Th>
                    <Table.Th>Coding</Table.Th>
                    <Table.Th>Projects</Table.Th>
                    <Table.Th>Full FA</Table.Th>
                    <Table.Th>
                      <Text fw={700} c="blue">
                        Total
                      </Text>
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredReport.map((student) => (
                    <Table.Tr key={student.id}>
                      <Table.Td>{student.student_name}</Table.Td>
                      <Table.Td>
                        <Badge variant="light">{student.roll_number}</Badge>
                      </Table.Td>
                      <Table.Td>{student.semester}</Table.Td>
                      <Table.Td>{student.department || "-"}</Table.Td>
                      <Table.Td>{student.community_service_marks}</Table.Td>
                      <Table.Td>{student.patent_marks}</Table.Td>
                      <Table.Td>{student.scopus_marks}</Table.Td>
                      <Table.Td>{student.competition_marks}</Table.Td>
                      <Table.Td>{student.hackathon_marks}</Table.Td>
                      <Table.Td>{student.workshop_marks}</Table.Td>
                      <Table.Td>{student.course_marks}</Table.Td>
                      <Table.Td>{student.entrepreneurship_marks}</Table.Td>
                      <Table.Td>{student.coding_marks}</Table.Td>
                      <Table.Td>{student.project_marks}</Table.Td>
                      <Table.Td>
                        <Text fw={600}>{student.full_fa_marks}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge size="lg" variant="filled">
                          {student.total_marks}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};

export default Reports;
