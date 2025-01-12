import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { AlertaCorrecto, AlertaIncorrecto } from "../styled/Notifications"; // Make sure these are defined
import "../modals/css/AddClientModal.css";

export default function AddClientModal({ open, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAdd(formData);
      AlertaCorrecto("Cliente agregado correctamente.");
      setFormData({
        nombre: "",
        apellidos: "",
        telefono: "",
        direccion: "",
        email: "",
      });
      onClose();
    } else {
      AlertaIncorrecto("Por favor, complete todos los campos obligatorios.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-box">
        <h2>Agregar Cliente</h2>
        <form>
          {["nombre", "apellidos", "telefono", "direccion", "email"].map((field) => (
            <TextField
              key={field}
              name={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              fullWidth
              margin="normal"
              value={formData[field]}
              onChange={handleChange}
              error={errors[field]}
              helperText={errors[field] && "Campo obligatorio"}
            />
          ))}
          <div className="modal-actions">
            <Button onClick={onClose} color="error">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Guardar
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
