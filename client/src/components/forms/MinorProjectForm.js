import React, { useState, useEffect } from "react";
import { Card, Title, Text, Button, Group, Stack, TextInput, Textarea, NumberInput, Paper, Badge, ActionIcon, Alert, Collapse } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash, IconInfoCircle } from "@tabler/icons-react";
import { getMinorProjects, createMinorProject, deleteMinorProject } from "../../services/api";

const MinorProjectForm = ({ studentId, onSuccess, canDelete = true }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    project_title: "", problem_statement: "", industry_ngo_community: "",
    uniqueness_score: 5, project_description: "", github_link: "", demo_link: "", proof_document: "",
  });

  useEffect(() => { fetchEntries(); }, [studentId]);
  const fetchEntries = async () => { try { const r = await getMinorProjects(studentId); setEntries(r.data); } catch (e) { console.error(e); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMinorProject({ ...formData, student_id: studentId });
      notifications.show({ title: "Success", message: "Minor project entry added!", color: "green" });
      setShowForm(false);
      setFormData({ project_title: "", problem_statement: "", industry_ngo_community: "", uniqueness_score: 5, project_description: "", github_link: "", demo_link: "", proof_document: "" });
      fetchEntries(); onSuccess();
    } catch (err) { notifications.show({ title: "Error", message: "Failed to add entry", color: "red" }); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this entry?")) {
      try { await deleteMinorProject(id); notifications.show({ title: "Success", message: "Deleted!", color: "green" }); fetchEntries(); onSuccess(); }
      catch (e) { notifications.show({ title: "Error", message: "Failed to delete", color: "red" }); }
    }
  };

  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>Minor Projects (Max: 100 marks)</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add Entry"}</Button>
        </Group>
        <Alert icon={<IconInfoCircle size={16} />} color="indigo" variant="light" mb="md">
          <Text size="sm"><strong>Marks:</strong> Based on project uniqueness, industry relevance, and implementation quality.</Text>
        </Alert>
        <Collapse in={showForm}>
          <Paper p="md" withBorder mb="lg">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput label="Project Title" required value={formData.project_title} onChange={(e) => setFormData({ ...formData, project_title: e.target.value })} placeholder="e.g., Smart Waste Management System" />
                <Textarea label="Problem Statement" required value={formData.problem_statement} onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })} placeholder="Describe the problem" minRows={2} />
                <Textarea label="Project Description" value={formData.project_description} onChange={(e) => setFormData({ ...formData, project_description: e.target.value })} placeholder="Brief description of the project" minRows={3} />
                <Group grow>
                  <TextInput label="Industry/NGO/Community" value={formData.industry_ngo_community} onChange={(e) => setFormData({ ...formData, industry_ngo_community: e.target.value })} placeholder="Associated organization" />
                  <NumberInput label="Uniqueness Score (1-10)" required value={formData.uniqueness_score} onChange={(v) => setFormData({ ...formData, uniqueness_score: v })} min={1} max={10} />
                </Group>
                <Group grow>
                  <TextInput label="GitHub Link" value={formData.github_link} onChange={(e) => setFormData({ ...formData, github_link: e.target.value })} placeholder="Repository URL" />
                  <TextInput label="Demo Link" value={formData.demo_link} onChange={(e) => setFormData({ ...formData, demo_link: e.target.value })} placeholder="Live demo URL" />
                </Group>
                <TextInput label="Proof Document" value={formData.proof_document} onChange={(e) => setFormData({ ...formData, proof_document: e.target.value })} placeholder="Document URL" />
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
                      <Text fw={600}>{entry.project_title}</Text>
                      <Badge color={entry.staff_evaluated ? "green" : "yellow"} variant="filled" size="lg">
                        {entry.staff_evaluated ? `${entry.marks_awarded} Marks` : "Pending"}
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">{entry.problem_statement}</Text>
                    <Group gap="xl">
                      <Text size="sm"><strong>Uniqueness:</strong> {entry.uniqueness_score}/10</Text>
                      {entry.industry_ngo_community && <Text size="sm"><strong>Organization:</strong> {entry.industry_ngo_community}</Text>}
                      {entry.github_link && <Text size="sm"><strong>GitHub:</strong> {entry.github_link}</Text>}
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

export default MinorProjectForm;
