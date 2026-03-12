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
  Paper,
  Badge,
  ActionIcon,
  Alert,
  Collapse,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash, IconInfoCircle } from "@tabler/icons-react";
import {
  getCodingPlatforms,
  createCodingPlatform,
  deleteCodingPlatform,
} from "../../services/api";

const CodingPlatformForm = ({ studentId, onSuccess, canDelete = true }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    platform: "leetcode",
    score_rating: "",
    problems_solved: 0,
    acceptance_rate: "",
    date_achieved: "",
    profile_link: "",
    screenshot: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);
  const fetchEntries = async () => {
    try {
      const r = await getCodingPlatforms(studentId);
      setEntries(r.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCodingPlatform({ ...formData, student_id: studentId });
      notifications.show({
        title: "Success",
        message: "Coding platform entry added!",
        color: "green",
      });
      setShowForm(false);
      setFormData({
        platform: "leetcode",
        score_rating: "",
        problems_solved: 0,
        acceptance_rate: "",
        date_achieved: "",
        profile_link: "",
        screenshot: "",
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
        await deleteCodingPlatform(id);
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
          <Title order={3}>Coding Platforms (Max: 100 marks)</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Entry"}
          </Button>
        </Group>
        <Alert
          icon={<IconInfoCircle size={16} />}
          color="violet"
          variant="light"
          mb="md"
        >
          <Text size="sm">
            <strong>Marks:</strong> Based on platform, problems solved, and
            rating achieved.
          </Text>
        </Alert>
        <Collapse in={showForm}>
          <Paper p="md" withBorder mb="lg">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <Group grow>
                  <Select
                    label="Platform"
                    required
                    value={formData.platform}
                    onChange={(v) => setFormData({ ...formData, platform: v })}
                    data={[
                      { value: "leetcode", label: "LeetCode" },
                      { value: "hackerrank", label: "HackerRank" },
                      { value: "codeforces", label: "Codeforces" },
                      { value: "codechef", label: "CodeChef" },
                      { value: "hackerearth", label: "HackerEarth" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                  <TextInput
                    label="Score / Rating"
                    value={formData.score_rating}
                    onChange={(e) =>
                      setFormData({ ...formData, score_rating: e.target.value })
                    }
                    placeholder="e.g., 1500, 5 stars"
                  />
                </Group>
                <Group grow>
                  <NumberInput
                    label="Problems Solved"
                    required
                    value={formData.problems_solved}
                    onChange={(v) =>
                      setFormData({ ...formData, problems_solved: v })
                    }
                    min={0}
                  />
                  <TextInput
                    label="Acceptance Rate"
                    value={formData.acceptance_rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        acceptance_rate: e.target.value,
                      })
                    }
                    placeholder="e.g., 65%"
                  />
                </Group>
                <Group grow>
                  <TextInput
                    label="Date Achieved"
                    type="date"
                    required
                    value={formData.date_achieved}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_achieved: e.target.value,
                      })
                    }
                  />
                  <TextInput
                    label="Profile Link"
                    value={formData.profile_link}
                    onChange={(e) =>
                      setFormData({ ...formData, profile_link: e.target.value })
                    }
                    placeholder="Profile URL"
                  />
                </Group>
                <TextInput
                  label="Screenshot"
                  value={formData.screenshot}
                  onChange={(e) =>
                    setFormData({ ...formData, screenshot: e.target.value })
                  }
                  placeholder="Screenshot URL"
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
                      <Text fw={600}>{entry.platform}</Text>
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
                        <strong>Rating:</strong> {entry.score_rating || "N/A"}
                      </Text>
                      <Text size="sm">
                        <strong>Problems:</strong> {entry.problems_solved}
                      </Text>
                      <Text size="sm">
                        <strong>Acceptance:</strong>{" "}
                        {entry.acceptance_rate || "N/A"}
                      </Text>
                      <Text size="sm">
                        <strong>Date:</strong> {entry.date_achieved}
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

export default CodingPlatformForm;
