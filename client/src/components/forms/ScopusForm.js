import React, { useState, useEffect } from "react";
import {
  Card,
  Title,
  Text,
  Button,
  Group,
  Stack,
  TextInput,
  Select,
  Switch,
  Paper,
  Badge,
  ActionIcon,
  Alert,
  Collapse,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash, IconInfoCircle } from "@tabler/icons-react";
import {
  getScopusPapers,
  createScopusPaper,
  deleteScopusPaper,
} from "../../services/api";

const ScopusForm = ({ studentId, onSuccess, canDelete = true }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    paper_title: "",
    publication_type: "conference",
    journal_conference_name: "",
    publication_date: "",
    scopus_indexed: true,
    co_authors: "",
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);
  const fetchEntries = async () => {
    try {
      const r = await getScopusPapers(studentId);
      setEntries(r.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createScopusPaper({ ...formData, student_id: studentId });
      notifications.show({
        title: "Success",
        message: "Scopus paper added!",
        color: "green",
      });
      setShowForm(false);
      setFormData({
        paper_title: "",
        publication_type: "conference",
        journal_conference_name: "",
        publication_date: "",
        scopus_indexed: true,
        co_authors: "",
        proof_document: "",
      });
      fetchEntries();
      onSuccess();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to add entry",
        color: "red",
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this entry?")) {
      try {
        await deleteScopusPaper(id);
        notifications.show({
          title: "Success",
          message: "Deleted!",
          color: "green",
        });
        fetchEntries();
        onSuccess();
      } catch (e) {
        notifications.show({
          title: "Error",
          message: "Failed to delete",
          color: "red",
        });
      }
    }
  };

  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>Scopus-Indexed Papers (Full FA: 240 marks)</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Entry"}
          </Button>
        </Group>
        <Alert
          icon={<IconInfoCircle size={16} />}
          color="green"
          variant="light"
          mb="md"
        >
          <Text size="sm">
            <strong>Marks:</strong> Conference/Journal publications with
            institute students & faculty. Full FA component.
          </Text>
        </Alert>
        <Collapse in={showForm}>
          <Paper p="md" withBorder mb="lg">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Paper Title"
                  required
                  value={formData.paper_title}
                  onChange={(e) =>
                    setFormData({ ...formData, paper_title: e.target.value })
                  }
                  placeholder="Title of the paper"
                />
                <Group grow>
                  <Select
                    label="Publication Type"
                    required
                    value={formData.publication_type}
                    onChange={(v) =>
                      setFormData({ ...formData, publication_type: v })
                    }
                    data={[
                      { value: "conference", label: "Conference Paper" },
                      { value: "journal", label: "Journal Paper" },
                    ]}
                  />
                  <TextInput
                    label="Journal/Conference Name"
                    required
                    value={formData.journal_conference_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        journal_conference_name: e.target.value,
                      })
                    }
                    placeholder="e.g., IEEE ICSE 2025"
                  />
                </Group>
                <Group grow>
                  <TextInput
                    label="Publication Date"
                    type="date"
                    required
                    value={formData.publication_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        publication_date: e.target.value,
                      })
                    }
                  />
                  <TextInput
                    label="Co-Authors"
                    value={formData.co_authors}
                    onChange={(e) =>
                      setFormData({ ...formData, co_authors: e.target.value })
                    }
                    placeholder="Comma-separated names"
                  />
                </Group>
                <Switch
                  label="Scopus Indexed"
                  checked={formData.scopus_indexed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scopus_indexed: e.currentTarget.checked,
                    })
                  }
                />
                <TextInput
                  label="Proof Document"
                  value={formData.proof_document}
                  onChange={(e) =>
                    setFormData({ ...formData, proof_document: e.target.value })
                  }
                  placeholder="Paper URL or DOI link"
                />
                <Group justify="flex-end">
                  <Button type="submit" color="green">
                    Submit Entry
                  </Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Collapse>
        <Title order={4} mb="sm">
          Entries ({entries.length})
        </Title>
        {entries.length === 0 ? (
          <Text c="dimmed" fs="italic">
            No entries yet.
          </Text>
        ) : (
          <Stack gap="sm">
            {entries.map((entry) => (
              <Paper key={entry.id} p="md" withBorder>
                <Group justify="space-between" align="flex-start">
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Group justify="space-between">
                      <Text fw={600}>{entry.paper_title}</Text>
                      <Badge
                        color={entry.staff_evaluated ? "green" : "yellow"}
                        variant="filled"
                        size="lg"
                      >
                        {entry.staff_evaluated
                          ? `${entry.marks_awarded} Marks`
                          : "Pending"}
                      </Badge>
                    </Group>
                    <Group gap="xl">
                      <Text size="sm">
                        <strong>Type:</strong> {entry.publication_type}
                      </Text>
                      <Text size="sm">
                        <strong>Venue:</strong> {entry.journal_conference_name}
                      </Text>
                      <Text size="sm">
                        <strong>Date:</strong> {entry.publication_date}
                      </Text>
                    </Group>
                    {entry.co_authors && (
                      <Text size="sm" c="dimmed">
                        <strong>Co-authors:</strong> {entry.co_authors}
                      </Text>
                    )}
                  </Stack>
                  {canDelete && (
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => handleDelete(entry.id)}
                    >
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

export default ScopusForm;
