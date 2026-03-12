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
  NumberInput,
  Switch,
  Paper,
  Badge,
  ActionIcon,
  Alert,
  Collapse,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash, IconInfoCircle } from "@tabler/icons-react";
import {
  getHackathons,
  createHackathon,
  deleteHackathon,
} from "../../services/api";

const HackathonForm = ({ studentId, onSuccess, canDelete = true }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    hackathon_name: "",
    organizer: "",
    hackathon_type: "inter_college",
    nirf_rank: "",
    result: "participant",
    organized_by_industry: false,
    date_participated: "",
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);
  const fetchEntries = async () => {
    try {
      const r = await getHackathons(studentId);
      setEntries(r.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHackathon({ ...formData, student_id: studentId });
      notifications.show({
        title: "Success",
        message: "Hackathon entry added!",
        color: "green",
      });
      setShowForm(false);
      setFormData({
        hackathon_name: "",
        organizer: "",
        hackathon_type: "inter_college",
        nirf_rank: "",
        result: "participant",
        organized_by_industry: false,
        date_participated: "",
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
        await deleteHackathon(id);
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
          <Title order={3}>Hackathons (Max: 100 marks)</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Entry"}
          </Button>
        </Group>
        <Alert
          icon={<IconInfoCircle size={16} />}
          color="grape"
          variant="light"
          mb="md"
        >
          <Text size="sm">
            <strong>Marks:</strong> Based on hackathon type, NIRF ranking, and
            result achieved.
          </Text>
        </Alert>
        <Collapse in={showForm}>
          <Paper p="md" withBorder mb="lg">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Hackathon Name"
                  required
                  value={formData.hackathon_name}
                  onChange={(e) =>
                    setFormData({ ...formData, hackathon_name: e.target.value })
                  }
                  placeholder="e.g., Smart India Hackathon"
                />
                <Group grow>
                  <TextInput
                    label="Organizer"
                    required
                    value={formData.organizer}
                    onChange={(e) =>
                      setFormData({ ...formData, organizer: e.target.value })
                    }
                    placeholder="Organizing body"
                  />
                  <Select
                    label="Hackathon Type"
                    required
                    value={formData.hackathon_type}
                    onChange={(v) =>
                      setFormData({ ...formData, hackathon_type: v })
                    }
                    data={[
                      { value: "inter_college", label: "Inter-College" },
                      { value: "national", label: "National" },
                      { value: "international", label: "International" },
                    ]}
                  />
                </Group>
                <Group grow>
                  <Select
                    label="Result"
                    required
                    value={formData.result}
                    onChange={(v) => setFormData({ ...formData, result: v })}
                    data={[
                      { value: "participant", label: "Participant" },
                      { value: "finalist", label: "Finalist" },
                      { value: "winner", label: "Winner" },
                    ]}
                  />
                  <NumberInput
                    label="NIRF Rank"
                    value={formData.nirf_rank}
                    onChange={(v) => setFormData({ ...formData, nirf_rank: v })}
                    min={1}
                    placeholder="If applicable"
                  />
                </Group>
                <Group grow>
                  <TextInput
                    label="Date Participated"
                    type="date"
                    required
                    value={formData.date_participated}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_participated: e.target.value,
                      })
                    }
                  />
                  <Switch
                    label="Organized by Industry"
                    checked={formData.organized_by_industry}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organized_by_industry: e.currentTarget.checked,
                      })
                    }
                    mt="xl"
                  />
                </Group>
                <TextInput
                  label="Proof Document"
                  value={formData.proof_document}
                  onChange={(e) =>
                    setFormData({ ...formData, proof_document: e.target.value })
                  }
                  placeholder="Certificate URL"
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
                      <Text fw={600}>{entry.hackathon_name}</Text>
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
                        <strong>Type:</strong> {entry.hackathon_type}
                      </Text>
                      <Text size="sm">
                        <strong>Organizer:</strong> {entry.organizer}
                      </Text>
                      <Text size="sm">
                        <strong>Result:</strong> {entry.result}
                      </Text>
                      <Text size="sm">
                        <strong>Date:</strong> {entry.date_participated}
                      </Text>
                    </Group>
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

export default HackathonForm;
