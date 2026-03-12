import React, { useState, useEffect } from "react";
import {
  Card,
  Title,
  Text,
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Paper,
  Badge,
  ActionIcon,
  Alert,
  Collapse,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash, IconInfoCircle } from "@tabler/icons-react";
import {
  getCommunityService,
  createCommunityService,
  deleteCommunityService,
} from "../../services/api";

const CommunityServiceForm = ({ studentId, onSuccess, canDelete = true }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    activity_type: "workshop",
    organization_name: "",
    activity_description: "",
    team_size: 1,
    date_conducted: "",
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);

  const fetchEntries = async () => {
    try {
      const response = await getCommunityService(studentId);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCommunityService({ ...formData, student_id: studentId });
      notifications.show({ title: "Success", message: "Entry added successfully!", color: "green" });
      setShowForm(false);
      setFormData({ activity_type: "workshop", organization_name: "", activity_description: "", team_size: 1, date_conducted: "", proof_document: "" });
      fetchEntries();
      onSuccess();
    } catch (error) {
      console.error("Error creating entry:", error);
      notifications.show({ title: "Error", message: "Failed to add entry", color: "red" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteCommunityService(id);
        notifications.show({ title: "Success", message: "Entry deleted!", color: "green" });
        fetchEntries();
        onSuccess();
      } catch (error) {
        notifications.show({ title: "Error", message: "Failed to delete entry", color: "red" });
      }
    }
  };

  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>Community Service (Max: 40 marks)</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Entry"}
          </Button>
        </Group>

        <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light" mb="md">
          <Text size="sm"><strong>Marks Allocation:</strong> Conducted Workshop/Coding Session at School/NGO/Industry: 40 marks per entry. Team of max 3 members. Must provide certificate/letter from organization.</Text>
        </Alert>

        <Collapse in={showForm}>
          <Paper p="md" withBorder mb="lg">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <Group grow>
                  <Select label="Activity Type" required value={formData.activity_type} onChange={(v) => setFormData({ ...formData, activity_type: v })}
                    data={[{ value: "workshop", label: "Workshop/Training Program" }, { value: "coding_session", label: "Coding Session" }, { value: "awareness_program", label: "Awareness Program" }, { value: "skill_development", label: "Skill Development" }]}
                  />
                  <TextInput label="Organization Name" required value={formData.organization_name} onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })} placeholder="e.g., ABC Public School" />
                </Group>
                <Textarea label="Activity Description" required value={formData.activity_description} onChange={(e) => setFormData({ ...formData, activity_description: e.target.value })} placeholder="Topics covered, duration, participants, impact..." rows={3} />
                <Group grow>
                  <NumberInput label="Team Size (Max 3)" required value={formData.team_size} onChange={(v) => setFormData({ ...formData, team_size: v })} min={1} max={10} />
                  <TextInput label="Date Conducted" type="date" required value={formData.date_conducted} onChange={(e) => setFormData({ ...formData, date_conducted: e.target.value })} />
                </Group>
                <TextInput label="Proof Document" value={formData.proof_document} onChange={(e) => setFormData({ ...formData, proof_document: e.target.value })} placeholder="Certificate URL or file link" />
                <Group justify="flex-end">
                  <Button type="submit" color="green">Submit Entry</Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Collapse>

        <Title order={4} mb="sm">Entries ({entries.length})</Title>
        {entries.length === 0 ? (
          <Text c="dimmed" fs="italic">No entries yet. Add your first entry above.</Text>
        ) : (
          <Stack gap="sm">
            {entries.map((entry) => (
              <Paper key={entry.id} p="md" withBorder>
                <Group justify="space-between" align="flex-start">
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Group justify="space-between">
                      <Text fw={600}>{entry.organization_name}</Text>
                      <Badge color={entry.staff_evaluated ? "green" : "yellow"} variant="filled" size="lg">
                        {entry.staff_evaluated ? `${entry.marks_awarded} Marks` : "Pending Evaluation"}
                      </Badge>
                    </Group>
                    <Group gap="xl">
                      <Text size="sm"><strong>Type:</strong> {entry.activity_type}</Text>
                      <Text size="sm"><strong>Team:</strong> {entry.team_size} members</Text>
                      <Text size="sm"><strong>Date:</strong> {entry.date_conducted}</Text>
                    </Group>
                    {entry.activity_description && <Text size="sm" c="dimmed">{entry.activity_description}</Text>}
                  </Stack>
                  {canDelete && (
                    <ActionIcon color="red" variant="light" onClick={() => handleDelete(entry.id)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  )}
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Card>
    </Stack>
  );
};

export default CommunityServiceForm;
