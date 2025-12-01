import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Link as MuiLink,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { collegeService } from "../services/collegeService";
import { College } from "../types";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    college_id: 0,
    roll_number: "",
    branch: "",
    year: 1,
  });
  const [colleges, setColleges] = useState<College[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingColleges, setLoadingColleges] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const data = await collegeService.getAllColleges(0, 100, true);
        setColleges(data);
      } catch (err) {
        console.error("Failed to load colleges", err);
      } finally {
        setLoadingColleges(false);
      }
    };
    fetchColleges();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.college_id) {
      setError("Please select a college");
      setLoading(false);
      return;
    }

    try {
      await authService.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        college_id: Number(formData.college_id),
        roll_number: formData.roll_number,
        branch: formData.branch,
        year: Number(formData.year),
      });
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Event Manager
          </Typography>
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {loadingColleges ? (
              <Box display="flex" justifyContent="center" my={2}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="first_name"
                  label="First Name"
                  name="first_name"
                  autoComplete="given-name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="college-label">College</InputLabel>
                  <Select
                    labelId="college-label"
                    id="college_id"
                    name="college_id"
                    value={formData.college_id}
                    label="College"
                    onChange={handleChange}
                  >
                    <MenuItem value={0} disabled>
                      Select a college
                    </MenuItem>
                    {colleges.map((college) => (
                      <MenuItem key={college.id} value={college.id}>
                        {college.name} ({college.code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="roll_number"
                  label="Roll Number"
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="branch"
                  label="Branch"
                  name="branch"
                  placeholder="e.g., Computer Science"
                  value={formData.branch}
                  onChange={handleChange}
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="year-label">Year of Study</InputLabel>
                  <Select
                    labelId="year-label"
                    id="year"
                    name="year"
                    value={formData.year}
                    label="Year of Study"
                    onChange={handleChange}
                  >
                    <MenuItem value={1}>1st Year</MenuItem>
                    <MenuItem value={2}>2nd Year</MenuItem>
                    <MenuItem value={3}>3rd Year</MenuItem>
                    <MenuItem value={4}>4th Year</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || loadingColleges}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <MuiLink component={Link} to="/login" variant="body2">
                Already have an account? Login
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
