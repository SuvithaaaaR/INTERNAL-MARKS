import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Group,
  Stack,
  TextInput,
  Select,
  Checkbox,
  Badge,
  Text,
  Title,
  Alert,
  ActionIcon,
  Paper,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
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
    hackathon_type: "inter_intra_college",
    nirf_rank: "",
    result: "participated",
    organized_by_industry: false,
    date_participated: new Date(),
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);

  const fetchEntries = async () => {
    try {
      const response = await getHackathons(studentId);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        student_id: studentId,
        date_participated:
          formData.date_participated instanceof Date
            ? formData.date_participated.toISOString().split("T")[0]
            : formData.date_participated,
      };
      await createHackathon(dataToSubmit);
      notifications.show({
        title: "Success",
        message: "Hackathon entry added successfully!",
        color: "green",
      });
      setShowForm(false);
      setFormData({
        hackathon_name: "",
        organizer: "",
        hackathon_type: "inter_intra_college",
        nirf_rank: "",
        result: "participated",
        organized_by_industry: false,
        date_participated: new Date(),
        proof_document: "",
      });
      fetchEntries();
      onSuccess();
    } catch (error) {
      console.error("Error creating entry:", error);
      notifications.show({
        title: "Error",
        message: "Failed to add entry",
        color: "red",
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteHackathon(id);
        notifications.show({
          title: "Success",
          message: "Entry deleted successfully!",
          color: "green",
        });
        fetchEntries();
        onSuccess();
      } catch (error) {
        console.error("Error deleting entry:", error);
        notifications.show({
          title: "Error",
          message: "Failed to delete entry",
          color: "red",
        });
      }
    }
  };

  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>Hackathons & Contests (Max: Full FA - 240)</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? "default" : "filled"}
          >
            {showForm ? "Cancel" : "Add Entry"}
          </Button>
        </Group>

        <Alert icon={<IconInfoCircle />} color="blue" mb="lg">
          <Text size="sm">
            <strong>Marks Allocation:</strong>
            <br />• Participated (Inter/Intra College): 20 marks
            <br />• Participated (Top 200 NIRF Institution): 80 marks
            <br />• Won/Awarded: 160 marks
            <br />• Won (Industry/Government Organized): 240 marks (Full FA)
          </Text>
        </Alert>

        {showForm && (
          <Paper p="md" withBorder mb="lg">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Hackathon Name"
                  placeholder="Enter hackathon name"
                  required
                  value={formData.hackathon_name}
                  onChange={(e) =>
                    setFormData({ ...formData, hackathon_name: e.target.value })
                  }
                />

                <Group grow>
                  <TextInput
                    label="Organizer"
                    placeholder="Institution, Company, or Organization"
                    required
                    value={formData.organizer}
                    onChange={(e) =>
                      setFormData({ ...formData, organizer: e.target.value })
                    }
                  />
                  <Select
                    label="Hackathon Type"
                    required
                    value={formData.hackathon_type}
                    onChange={(value) =>
                      setFormData({ ...formData, hackathon_type: value })
                    }
                    data={[
                      {
                        value: "inter_intra_college",
                        label: "Inter/Intra College (20 marks)",
                      },
                      {
                        value: "nirf_top_200",
                        label: "Top 200 NIRF Institution (80 marks)",
                      },
                      {
                        value: "industry",
                        label: "Industry/Government (160-240 marks)",
                      },
                    ]}
                  />
                </Group>

                <Group grow>
                  <TextInput
                    label="NIRF Rank (if applicable)"
                    type="number"
                    placeholder="e.g., 150"
                    value={formData.nirf_rank}
                    onChange={(e) =>
                      setFormData({ ...formData, nirf_rank: e.target.value })
                    }
                  />
                  <Select
                    label="Result"
                    required
                    value={formData.result}
                    onChange={(value) =>
                      setFormData({ ...formData, result: value })
                    }
                    data={[
                      { value: "participated", label: "Participated" },
                      { value: "won", label: "Won" },
                      { value: "runner_up", label: "Runner Up" },
                      { value: "finalist", label: "Finalist" },
                    ]}
                  />
                </Group>

                <DateInput
                  label="Date Participated"
                  required
                  value={formData.date_participated}
                  onChange={(value) =>
                    setFormData({ ...formData, date_participated: value })
                  }
                />

                <Checkbox
                  label="Organized by Industry/Government (240 marks if won)"
                  checked={formData.organized_by_industry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organized_by_industry: e.currentTarget.checked,
                    })
                  }
                />

                <TextInput
                  label="Proof Document"
                  placeholder="Certificate or participation proof"
                  value={formData.proof_document}
                  onChange={(e) =>
                    setFormData({ ...formData, proof_document: e.target.value })
                  }
                />

                <Button type="submit" color="green">
                  Submit Entry
                </Button>
              </Stack>
            </form>
          </Paper>
        )}

        <div>
          <Title order={4} mb="md">
            Entries ({entries.length})
          </Title>
          {entries.length === 0 ? (
            <Text c="dimmed" fs="italic">
              No entries yet. Add your first entry above.
            </Text>
          ) : (
            <Stack gap="md">
              {entries.map((entry) => (
                <Card key={entry.id} padding="md" withBorder>
                  <Group justify="space-between" align="start">
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Group justify="space-between">
                        <Title order={5}>{entry.hackathon_name}</Title>
                        <Badge
                          size="lg"
                          color={entry.staff_evaluated ? "green" : "yellow"}
                          variant="filled"
                        >
                          {entry.staff_evaluated
                            ? `✅ ${entry.marks_awarded} Marks Awarded`
                            : "⏳ Pending Evaluation"}
                        </Badge>
                      </Group>

                      <Group gap="xl">
                        <div>
                          <Text size="xs" c="dimmed">
                            Organizer
                          </Text>
                          <Text size="sm">{entry.organizer}</Text>
                        </div>
                        <div>
                          <Text size="xs" c="dimmed">
                            Type
                          </Text>
                          <Text size="sm">{entry.hackathon_type}</Text>
                        </div>
                        {entry.nirf_rank && (
                          <div>
                            <Text size="xs" c="dimmed">
                              NIRF Rank
                            </Text>
                            <Text size="sm">{entry.nirf_rank}</Text>
                          </div>
                        )}
                        <div>
                          <Text size="xs" c="dimmed">
                            Result
                          </Text>
                          <Text size="sm">{entry.result}</Text>
                        </div>
                        <div>
                          <Text size="xs" c="dimmed">
                            Date
                          </Text>
                          <Text size="sm">{entry.date_participated}</Text>
                        </div>
                      </Group>

                      {entry.organized_by_industry && (
                        <Badge color="blue" variant="light">
                          Industry/Government Organized
                        </Badge>
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
                </Card>
              ))}
            </Stack>
          )}
        </div>
      </Card>
    </Stack>
  );
};

export default HackathonForm;
