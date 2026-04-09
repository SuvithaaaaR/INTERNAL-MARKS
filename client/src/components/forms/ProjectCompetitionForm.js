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
  getProjectCompetitions,
  createProjectCompetition,
  deleteProjectCompetition,
  uploadProofDocument,
} from "../../services/api";

const ProjectCompetitionForm = ({ studentId, onSuccess, canDelete = true }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [formData, setFormData] = useState({
    competition_type: "inter_college",
    competition_name: "",
    institution_name: "",
    nirf_rank: "",
    result: "participant",
    industry_level: false,
    date_participated: "",
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);
  const fetchEntries = async () => {
    try {
      const r = await getProjectCompetitions(studentId);
      setEntries(r.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, student_id: studentId };

      if (proofFile) {
        const uploadResponse = await uploadProofDocument(proofFile);
        payload.proof_document = uploadResponse.data.downloadUrl;
      }

      await createProjectCompetition(payload);
      notifications.show({
        title: "Success",
        message: "Competition entry added!",
        color: "green",
      });
      setShowForm(false);
      setFormData({
        competition_type: "inter_college",
        competition_name: "",
        institution_name: "",
        nirf_rank: "",
        result: "participant",
        industry_level: false,
        date_participated: "",
        proof_document: "",
      });
      setProofFile(null);
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
        await deleteProjectCompetition(id);
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
          <Title order={3}>Project Competitions (Max: 100 marks)</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Entry"}
          </Button>
        </Group>
        <Alert
          icon={<IconInfoCircle size={16} />}
          color="pink"
          variant="light"
          mb="md"
        >
          <Text size="sm">
            <strong>Marks:</strong> Participation/Winning at NIRF institutions
            or Industry projects. Points vary by NIRF rank and result.
          </Text>
        </Alert>
        <Collapse in={showForm}>
          <Paper p="md" withBorder mb="lg">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <Group grow>
                  <Select
                    label="Competition Type"
                    required
                    value={formData.competition_type}
                    onChange={(v) =>
                      setFormData({ ...formData, competition_type: v })
                    }
                    data={[
                      { value: "inter_college", label: "Inter-College" },
                      { value: "national", label: "National" },
                      { value: "industry", label: "Industry" },
                    ]}
                  />
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
                </Group>
                <TextInput
                  label="Competition Name"
                  required
                  value={formData.competition_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      competition_name: e.target.value,
                    })
                  }
                  placeholder="e.g., Smart India Hackathon"
                />
                <Group grow>
                  <TextInput
                    label="Institution Name"
                    value={formData.institution_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        institution_name: e.target.value,
                      })
                    }
                    placeholder="Host institution"
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
                    label="Industry Level"
                    checked={formData.industry_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        industry_level: e.currentTarget.checked,
                      })
                    }
                    mt="xl"
                  />
                </Group>
                <div>
                  <Text size="sm" fw={500} mb={6}>
                    Proof Document (PDF)
                  </Text>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  />
                  <Text size="xs" c="dimmed" mt={4}>
                    {proofFile
                      ? `Selected: ${proofFile.name}`
                      : "Upload a PDF certificate/document (max 10MB)"}
                  </Text>
                </div>
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
                      <Text fw={600}>{entry.competition_name}</Text>
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
                        <strong>Type:</strong> {entry.competition_type}
                      </Text>
                      <Text size="sm">
                        <strong>Result:</strong> {entry.result}
                      </Text>
                      <Text size="sm">
                        <strong>Date:</strong> {entry.date_participated}
                      </Text>
                      {entry.institution_name && (
                        <Text size="sm">
                          <strong>Venue:</strong> {entry.institution_name}
                        </Text>
                      )}
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

export default ProjectCompetitionForm;
