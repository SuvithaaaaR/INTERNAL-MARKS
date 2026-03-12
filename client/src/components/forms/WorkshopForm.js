import React, { useState, useEffect } from "react";
import { Card, Title, Text, Button, Group, Stack, TextInput, Select, NumberInput, Paper, Badge, ActionIcon, Alert, Collapse } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash, IconInfoCircle } from "@tabler/icons-react";
import { getWorkshops, createWorkshop, deleteWorkshop } from "../../services/api";

const WorkshopForm = ({ studentId, onSuccess, canDelete = true }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    event_type: "workshop", event_name: "", institution_name: "",
    nirf_rank: "", date_attended: "", duration_days: 1, proof_document: "",
  });

  useEffect(() => { fetchEntries(); }, [studentId]);
  const fetchEntries = async () => { try { const r = await getWorkshops(studentId); setEntries(r.data); } catch (e) { console.error(e); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createWorkshop({ ...formData, student_id: studentId });
      notifications.show({ title: "Success", message: "Workshop/Seminar entry added!", color: "green" });
      setShowForm(false);
      setFormData({ event_type: "workshop", event_name: "", institution_name: "", nirf_rank: "", date_attended: "", duration_days: 1, proof_document: "" });
      fetchEntries(); onSuccess();
    } catch (err) { notifications.show({ title: "Error", message: "Failed to add entry", color: "red" }); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this entry?")) {
      try { await deleteWorkshop(id); notifications.show({ title: "Success", message: "Deleted!", color: "green" }); fetchEntries(); onSuccess(); }
      catch (e) { notifications.show({ title: "Error", message: "Failed to delete", color: "red" }); }
    }
  };

  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>Workshops & Seminars (Max: 100 marks)</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add Entry"}</Button>
        </Group>
        <Alert icon={<IconInfoCircle size={16} />} color="cyan" variant="light" mb="md">
          <Text size="sm"><strong>Marks:</strong> Based on event type, institution NIRF ranking, and duration.</Text>
        </Alert>
        <Collapse in={showForm}>
          <Paper p="md" withBorder mb="lg">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <Group grow>
                  <Select label="Event Type" required value={formData.event_type} onChange={(v) => setFormData({ ...formData, event_type: v })}
                    data={[{ value: "workshop", label: "Workshop" }, { value: "seminar", label: "Seminar" }, { value: "conference", label: "Conference" }, { value: "webinar", label: "Webinar" }]} />
                  <NumberInput label="Duration (Days)" required value={formData.duration_days} onChange={(v) => setFormData({ ...formData, duration_days: v })} min={1} max={30} />
                </Group>
                <TextInput label="Event Name" required value={formData.event_name} onChange={(e) => setFormData({ ...formData, event_name: e.target.value })} placeholder="e.g., AI & ML Workshop" />
                <Group grow>
                  <TextInput label="Institution Name" value={formData.institution_name} onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })} placeholder="Host institution" />
                  <NumberInput label="NIRF Rank" value={formData.nirf_rank} onChange={(v) => setFormData({ ...formData, nirf_rank: v })} min={1} placeholder="If applicable" />
                </Group>
                <TextInput label="Date Attended" type="date" required value={formData.date_attended} onChange={(e) => setFormData({ ...formData, date_attended: e.target.value })} />
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
                      <Text fw={600}>{entry.event_name}</Text>
                      <Badge color={entry.staff_evaluated ? "green" : "yellow"} variant="filled" size="lg">
                        {entry.staff_evaluated ? `${entry.marks_awarded} Marks` : "Pending"}
                      </Badge>
                    </Group>
                    <Group gap="xl">
                      <Text size="sm"><strong>Type:</strong> {entry.event_type}</Text>
                      <Text size="sm"><strong>Duration:</strong> {entry.duration_days} day(s)</Text>
                      <Text size="sm"><strong>Date:</strong> {entry.date_attended}</Text>
                      {entry.institution_name && <Text size="sm"><strong>Venue:</strong> {entry.institution_name}</Text>}
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

export default WorkshopForm;
