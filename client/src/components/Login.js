import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Stack,
  Center,
  Box,
} from "@mantine/core";
import { IconAlertCircle, IconLogin } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        position: "relative",
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(33, 150, 243, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(63, 81, 181, 0.08) 0%, transparent 50%)
          `,
        }}
      />
      <Container size={420} my={40} style={{ position: "relative", zIndex: 1 }}>
        <Paper
          withBorder
          shadow="xl"
          p={40}
          radius="lg"
          style={{ backgroundColor: "white" }}
        >
          <Center mb="xl">
            <Stack gap="xs" align="center">
              <Title order={2} style={{ color: "#1e3a8a", fontWeight: 700 }}>
                Internal Marks System
              </Title>
              <Text size="sm" c="dimmed">
                Faculty & Student Portal
              </Text>
            </Stack>
          </Center>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  variant="filled"
                >
                  {error}
                </Alert>
              )}

              <TextInput
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                size="md"
                styles={{
                  input: {
                    borderColor: "#e5e7eb",
                    "&:focus": {
                      borderColor: "#2563eb",
                    },
                  },
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                size="md"
                styles={{
                  input: {
                    borderColor: "#e5e7eb",
                    "&:focus": {
                      borderColor: "#2563eb",
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                leftSection={<IconLogin size={18} />}
                style={{
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                  marginTop: "8px",
                }}
              >
                Login
              </Button>

              <Alert color="blue" variant="light" style={{ marginTop: "16px" }}>
                <div style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
                  <strong>Faculty:</strong> username: faculty, password:
                  admin123
                  <br />
                  <strong>Students:</strong> username: roll_number, password:
                  student123
                </div>
              </Alert>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
