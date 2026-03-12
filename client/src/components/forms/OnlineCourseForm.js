import React, { useState, useEffect } from "react";
import { Card, Title, Text, Button, Group, Stack, TextInput, Select, NumberInput, Paper, Badge, ActionIcon, Alert, Collapse } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash, IconInfoCircle } from "@tabler/icons-react";
import { getOnlineCourses, createOnlineCourse, deleteOnlineCourse } from "../../services/api";

const OnlineCourseForm = ({ studentId, onSuccess, canDelete = true }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    course_type: "nptel", course_name: "", platform: "",
    duration_weeks: 4, completion_date: "", certificate_number: "", proof_document: "",
  });

  useEffect(() => { fetchEntries(); }, [studentId]);
  const fetchEntries = async () => { try { const r = await getOnlineCourses(studentId); setEntries(r.data); } catch (e) { console.error(e); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOnlineCourse({ ...formData, student_id: studentId });
      notifications.show({ title: "Success", message: "Online course entry added!", color: "green" });
      setShowForm(false);
      setFormData({ course_type: "nptel", course_name: "", platform: "", duration_weeks: 4, completion_date: "", certificate_number: "", proof_document: "" });
      fetchEntries(); onSuccess();
    } catch (err) { notifications.show({ title: "Error", message: "Failed to add entry", color: "red" }); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this entry?")) {
      try { await deleteOnlineCourse(id); notifications.show({ title: "Success", message: "Deleted!", color: "green" }); fetchEntries(); onSuccess(); }
      catch (e) { notifications.show({ title: "Error", message: "Failed to delete", color: "red" }); }
    }
  };

  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>Online Courses (Max: 100 marks)</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add Entry"}</Button>
        </Group>
        <Alert icon={<IconInfoCircle size={16} />} color="orange" variant="light" mb="md">
          <Text size="sm"><strong>Marks:</strong> Based on course type (NPTEL/Coursera/Udemy etc.), duration, and completion.</Text>
        </Alert>
        <Collapse in={showForm}>
          <Paper p="md" withBorder mb="lg">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <Group grow>
                  <Select label="Course Type" required value={formData.course_type} onChange={(v) => setFormData({ ...formData, course_type: v })}
                    data={[{ value: "nptel", label: "NPTEL" }, { value: "coursera", label: "Coursera" }, { value: "udemy", label: "Udemy" }, { value: "edx", label: "edX" }, { value: "other", label: "Other" }]} />
                  <NumberInput label="Duration (Weeks)" required value={formData.duration_weeks} onChange={(v) => setFormData({ ...formData, duration_weeks: v })} min={1} max={52} />
                </Group>
                <TextInput label="Course Name" required value={formData.course_name} onChange={(e) => setFormData({ ...formData, course_name: e.target.value })} placeholder="e.g., Machine Learning by Andrew Ng" />
                <TextInput label="Platform" value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} placeholder="e.g., Coursera, NPTEL" />
                <Group grow>
                  <TextInput label="Completion Date" type="date" required value={formData.completion_date} onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })} />
                  <TextInput label="Certificate Number" value={formData.certificate_number} onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })} placeholder="If available" />
                </Group>
                <TextInput label="Proof Document" value={formData.proof_document} onChange={(e) => setFormData({ ...formData, proof_document: e.target.value })} placeholder="Certificate URL" />
                <Group justify="flex-end"><Button type="submit" color="green">Submit Entry</Button></Group>
              </Stack>
            </form>
          </Paper>
        </Collapse>
        <Title order={4} mb="sm">Entries ({entries.length})</Title>
        {entries.length === 0 ? (
          <Text c="dimmed" fs="italic">No entries yet.</Text>
        ) : (
          <Stack gap="sm">
            {entries.map((entry) => (
              <Paper key={entry.id} p="md" withBorder>
                <Group justify="space-between" align="flex-start">
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Group justify="space-between">
                      <Text fw={600}>{entry.course_name}</Text>
                      <Badge color={entry.staff_evaluated ? "green" : "yellow"} variant="filled" size="lg">
                        {entry.staff_evaluated ? `${entry.marks_awarded} Marks` : "Pending"}
                      </Badge>
                    </Group>
                    <Group gap="xl">
                      <Text size="sm"><strong>Type:</strong> {entry.course_type}</Text>
                      <Text size="sm"><strong>Platform:</strong> {entry.platform || "N/A"}</Text>
                      <Text size="sm"><strong>Duration:</strong> {entry.duration_weeks} weeks</Text>
                      <Text size="sm"><strong>Completed:</strong> {entry.completion_date}</Text>
                    </Group>
                  </Stack>
                  {canDelete && <ActionIcon color="red" variant="light" onClick={() => handleDelete(entry.id)}><IconTrash size={16} /></ActionIcon>}
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Card>
    </Stack>
  );
};

export default OnlineCourseForm;
