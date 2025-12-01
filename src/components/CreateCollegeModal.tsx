import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { collegeService } from "../services/collegeService";
import { College, CollegeFormData } from "../types";

interface CreateCollegeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  college?: College | null;
}

const CreateCollegeModal: React.FC<CreateCollegeModalProps> = ({
  open,
  onClose,
  onSave,
  college,
}) => {
  const [formData, setFormData] = useState<CollegeFormData>({
    name: "",
    code: "",
    city: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    is_active: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (college) {
      setFormData({
        name: college.name,
        code: college.code,
        city: college.city,
        contact_email: college.contact_email,
        contact_phone: college.contact_phone,
        website: college.website || "",
        is_active: college.is_active,
      });
    } else {
      setFormData({
        name: "",
        code: "",
        city: "",
        contact_email: "",
        contact_phone: "",
        website: "",
        is_active: true,
      });
    }
    setError("");
  }, [college, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (college) {
        await collegeService.updateCollege(college.id, formData);
      } else {
        await collegeService.createCollege(formData);
      }
      onSave();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          `Failed to ${college ? "update" : "create"} college`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {college ? "Edit College" : "Create New College"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              required
              fullWidth
              label="College Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., RV College of Engineering"
            />
            <TextField
              required
              fullWidth
              label="College Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., RVCE"
            />
            <TextField
              required
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g., Bengaluru"
            />
            <TextField
              required
              fullWidth
              label="Contact Email"
              name="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={handleChange}
              placeholder="e.g., admin@rvce.com"
            />
            <TextField
              required
              fullWidth
              label="Contact Phone"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              placeholder="e.g., 1234567890"
            />
            <TextField
              fullWidth
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="e.g., www.rvce.com"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={handleChange}
                  name="is_active"
                  color="primary"
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : college ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateCollegeModal;
