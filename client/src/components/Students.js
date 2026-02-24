import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Button,
  Table,
  Modal,
  TextInput,
  Select,
  Group,
  Stack,
  Loader,
  Center,
  Paper,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash, IconEye, IconSearch } from "@tabler/icons-react";
import { getStudents, createStudent, deleteStudent } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    student_name: "",
    roll_number: "",
    semester: "2",
    email: "",
    department: "",
  });

  const navigate = useNavigate();
  const { user, isFaculty } = useAuth();

  useEffect(() => {
    // Redirect students directly to their own detail page
    if (!isFaculty() && user?.student_id) {
      navigate(`/students/${user.student_id}`, { replace: true });
      return;
    }
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(
        (student) =>
          student.student_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.roll_number
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      let studentData = response.data;
      
      // If logged in as student, only show their own record
      if (!isFaculty() && user?.student_id) {
        studentData = studentData.filter(s => s.id === user.student_id);
      }
      
      setStudents(studentData);
      setFilteredStudents(studentData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load students",
        color: "red",
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStudent(formData);
      notifications.show({
        title: "Success",
        message: "Student added successfully!",
        color: "green",
      });
      close();
      setFormData({
        student_name: "",
        roll_number: "",
        semester: "2",
        email: "",
        department: "",
      });
      fetchStudents();
    } catch (error) {
      console.error("Error creating student:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.error || "Failed to add student",
        color: "red",
      });
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this student? All related entries will be deleted.",
      )
    ) {
      try {
        await deleteStudent(id);
        notifications.show({
          title: "Success",
          message: "Student deleted successfully!",
          color: "green",
        });
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        notifications.show({
          title: "Error",
          message: "Failed to delete student",
          color: "red",
        });
      }
    }
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
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
            Students Management
          </Title>
          <Text c="dimmed" size="lg">
            Manage student records and entries
          </Text>
        </div>

        {/* Action Bar */}
        <Group justify="space-between">
          <TextInput
            placeholder="Search students..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flexGrow: 1, maxWidth: 400 }}
          />
          {isFaculty() && (
            <Button leftSection={<IconPlus size={16} />} onClick={open}>
              Add Student
            </Button>
          )}
        </Group>

        {/* Students Table */}
        {filteredStudents.length === 0 ? (
          <Paper p="xl" withBorder>
            <Center>
              <Stack align="center" gap="md">
                <Text size="xl" fw={600}>
                  No students found
                </Text>
                <Text c="dimmed">Add your first student to get started</Text>
                <Button leftSection={<IconPlus size={16} />} onClick={open}>
                  Add Student
                </Button>
              </Stack>
            </Center>
          </Paper>
        ) : (
          <Paper withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Roll Number</Table.Th>
                  <Table.Th>Semester</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Department</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredStudents.map((student) => (
                  <Table.Tr key={student.id}>
                    <Table.Td>{student.student_name}</Table.Td>
                    <Table.Td>
                      <Badge variant="light">{student.roll_number}</Badge>
                    </Table.Td>
                    <Table.Td>{student.semester}</Table.Td>
                    <Table.Td>{student.email || "-"}</Table.Td>
                    <Table.Td>{student.department || "-"}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Button
                          size="xs"
                          leftSection={<IconEye size={14} />}
                          onClick={() => navigate(`/students/${student.id}`)}
                        >
                          View
                        </Button>
                        {isFaculty() && (
                          <ActionIcon
                            color="red"
                            variant="light"
                            onClick={() => handleDelete(student.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        )}
      </Stack>

      {/* Add Student Modal */}
      <Modal opened={opened} onClose={close} title="Add New Student" size="lg">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Student Name"
                placeholder="Enter name"
                required
                value={formData.student_name}
                onChange={(e) => handleChange("student_name", e.target.value)}
              />
              <TextInput
                label="Roll Number"
                placeholder="Enter roll number"
                required
                value={formData.roll_number}
                onChange={(e) => handleChange("roll_number", e.target.value)}
              />
            </Group>

            <Group grow>
              <Select
                label="Semester"
                required
                value={formData.semester}
                onChange={(value) => handleChange("semester", value)}
                data={[
                  { value: "2", label: "Semester 2" },
                  { value: "3", label: "Semester 3" },
                  { value: "4", label: "Semester 4" },
                  { value: "5", label: "Semester 5" },
                  { value: "6", label: "Semester 6" },
                  { value: "7", label: "Semester 7" },
                ]}
              />
              <TextInput
                label="Email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Group>

            <TextInput
              label="Department"
              placeholder="Enter department"
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Cancel
              </Button>
              <Button type="submit">Add Student</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};

export default Students;
