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
  getEntrepreneurship,
  createEntrepreneurship,
  deleteEntrepreneurship,
  uploadProofDocument,
} from "../../services/api";

const EntrepreneurshipForm = ({ studentId, onSuccess, canDelete = true }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [formData, setFormData] = useState({
    startup_name: "",
    registration_type: "sole_proprietorship",
    registration_number: "",
    registration_date: "",
    funding_secured: false,
    funding_amount: 0,
    incubation_status: "none",
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);
  const fetchEntries = async () => {
    try {
      const r = await getEntrepreneurship(studentId);
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

      await createEntrepreneurship(payload);
      notifications.show({
        title: "Success",
        message: "Entrepreneurship entry added!",
        color: "green",
      });
      setShowForm(false);
      setFormData({
        startup_name: "",
        registration_type: "sole_proprietorship",
        registration_number: "",
        registration_date: "",
        funding_secured: false,
        funding_amount: 0,
        incubation_status: "none",
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
        await deleteEntrepreneurship(id);
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
          <Title order={3}>Entrepreneurship (Max: 100 marks)</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Entry"}
          </Button>
        </Group>
        <Alert
          icon={<IconInfoCircle size={16} />}
          color="teal"
          variant="light"
          mb="md"
        >
          <Text size="sm">
            <strong>Marks:</strong> Based on startup registration, funding, and
            incubation status.
          </Text>
        </Alert>
        <Collapse in={showForm}>
          <Paper p="md" withBorder mb="lg">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Startup Name"
                  required
                  value={formData.startup_name}
                  onChange={(e) =>
                    setFormData({ ...formData, startup_name: e.target.value })
                  }
                  placeholder="e.g., TechStart Innovations"
                />
                <Group grow>
                  <Select
                    label="Registration Type"
                    required
                    value={formData.registration_type}
                    onChange={(v) =>
                      setFormData({ ...formData, registration_type: v })
                    }
                    data={[
                      {
                        value: "sole_proprietorship",
                        label: "Sole Proprietorship",
                      },
                      { value: "partnership", label: "Partnership" },
                      { value: "llp", label: "LLP" },
                      { value: "pvt_ltd", label: "Pvt Ltd" },
                    ]}
                  />
                  <TextInput
                    label="Registration Number"
                    value={formData.registration_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registration_number: e.target.value,
                      })
                    }
                    placeholder="If registered"
                  />
                </Group>
                <Group grow>
                  <TextInput
                    label="Registration Date"
                    type="date"
                    value={formData.registration_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registration_date: e.target.value,
                      })
                    }
                  />
                  <Select
                    label="Incubation Status"
                    value={formData.incubation_status}
                    onChange={(v) =>
                      setFormData({ ...formData, incubation_status: v })
                    }
                    data={[
                      { value: "none", label: "None" },
                      { value: "applied", label: "Applied" },
                      { value: "incubated", label: "Incubated" },
                      { value: "graduated", label: "Graduated" },
                    ]}
                  />
                </Group>
                <Group grow>
                  <Switch
                    label="Funding Secured"
                    checked={formData.funding_secured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        funding_secured: e.currentTarget.checked,
                      })
                    }
                    mt="xl"
                  />
                  {formData.funding_secured && (
                    <NumberInput
                      label="Funding Amount (INR)"
                      value={formData.funding_amount}
                      onChange={(v) =>
                        setFormData({ ...formData, funding_amount: v })
                      }
                      min={0}
                    />
                  )}
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
                      : "Upload a PDF registration/funding document (max 10MB)"}
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
                      <Text fw={600}>{entry.startup_name}</Text>
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
                        <strong>Type:</strong> {entry.registration_type}
                      </Text>
                      <Text size="sm">
                        <strong>Incubation:</strong> {entry.incubation_status}
                      </Text>
                      <Text size="sm">
                        <strong>Funding:</strong>{" "}
                        {entry.funding_secured
                          ? `Yes - ₹${entry.funding_amount}`
                          : "No"}
                      </Text>
                      {entry.registration_date && (
                        <Text size="sm">
                          <strong>Date:</strong> {entry.registration_date}
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

export default EntrepreneurshipForm;
