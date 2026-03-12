import React, { useState, useEffect } from "react";
import { Card, Title, Text, Button, Group, Stack, TextInput, Select, Switch, Paper, Badge, ActionIcon, Alert, Collapse } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash, IconInfoCircle } from "@tabler/icons-react";
import { getPatents, createPatent, deletePatent } from "../../services/api";

const PatentForm = ({ studentId, onSuccess, canDelete = true }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patent_type: "filed", patent_title: "", application_number: "", filing_date: "",
    status: "filed", prototype_developed: false, technology_transfer: false, proof_document: "",
  });

  useEffect(() => { fetchEntries(); }, [studentId]);

  const fetchEntries = async () => {
    try { const r = await getPatents(studentId); setEntries(r.data); } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPatent({ ...formData, student_id: studentId });
      notifications.show({ title: "Success", message: "Patent entry added!", color: "green" });
      setShowForm(false);
      setFormData({ patent_type: "filed", patent_title: "", application_number: "", filing_date: "", status: "filed", prototype_developed: false, technology_transfer: false, proof_document: "" });
      fetchEntries(); onSuccess();
    } catch (err) {
      notifications.show({ title: "Error", message: "Failed to add entry", color: "red" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this entry?")) {
      try { await deletePatent(id); notifications.show({ title: "Success", message: "Deleted!", color: "green" }); fetchEntries(); onSuccess(); }
      catch (e) { notifications.show({ title: "Error", message: "Failed to delete", color: "red" }); }
    }
  };

  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>Patent Filing & Prototyping (Full FA: 240 marks)</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add Entry"}</Button>
        </Group>
        <Alert icon={<IconInfoCircle size={16} />} color="orange" variant="light" mb="md">
          <Text size="sm"><strong>Marks:</strong> Prototype + Patent filing + IPM cell publication OR Technology transfer. Full FA component (240 marks max).</Text>
        </Alert>
        <Collapse in={showForm}>
          <Paper p="md" withBorder mb="lg">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <Group grow>
                  <Select label="Patent Type" required value={formData.patent_type} onChange={(v) => setFormData({ ...formData, patent_type: v })}
                    data={[{ value: "filed", label: "Patent Filed" }, { value: "published", label: "Patent Published" }, { value: "granted", label: "Patent Granted" }]} />
                  <Select label="Status" required value={formData.status} onChange={(v) => setFormData({ ...formData, status: v })}
                    data={[{ value: "filed", label: "Filed" }, { value: "published", label: "Published" }, { value: "granted", label: "Granted" }]} />
                </Group>
                <TextInput label="Patent Title" required value={formData.patent_title} onChange={(e) => setFormData({ ...formData, patent_title: e.target.value })} placeholder="Title of the patent" />
                <Group grow>
                  <TextInput label="Application Number" value={formData.application_number} onChange={(e) => setFormData({ ...formData, application_number: e.target.value })} placeholder="e.g., APP/2025/001234" />
                  <TextInput label="Filing Date" type="date" required value={formData.filing_date} onChange={(e) => setFormData({ ...formData, filing_date: e.target.value })} />
                </Group>
                <Group>
                  <Switch label="Prototype Developed" checked={formData.prototype_developed} onChange={(e) => setFormData({ ...formData, prototype_developed: e.currentTarget.checked })} />
                  <Switch label="Technology Transfer" checked={formData.technology_transfer} onChange={(e) => setFormData({ ...formData, technology_transfer: e.currentTarget.checked })} />
                </Group>
                <TextInput label="Proof Document" value={formData.proof_document} onChange={(e) => setFormData({ ...formData, proof_document: e.target.value })} placeholder="Certificate URL or file link" />
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
                      <Text fw={600}>{entry.patent_title}</Text>
                      <Badge color={entry.staff_evaluated ? "green" : "yellow"} variant="filled" size="lg">
                        {entry.staff_evaluated ? `${entry.marks_awarded} Marks` : "Pending"}
                      </Badge>
                    </Group>
                    <Group gap="xl">
                      <Text size="sm"><strong>Type:</strong> {entry.patent_type}</Text>
                      <Text size="sm"><strong>Status:</strong> {entry.status}</Text>
                      <Text size="sm"><strong>Filed:</strong> {entry.filing_date}</Text>
                    </Group>
                    <Group gap="md">
                      {entry.prototype_developed ? <Badge color="green" variant="light">Prototype</Badge> : null}
                      {entry.technology_transfer ? <Badge color="blue" variant="light">Tech Transfer</Badge> : null}
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

export default PatentForm;
