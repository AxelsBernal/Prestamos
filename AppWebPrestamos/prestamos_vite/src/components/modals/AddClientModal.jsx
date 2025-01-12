import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

export default function AddClientModal({ open, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onAdd(formData);
    setFormData({
      nombre: "",
      apellidos: "",
      telefono: "",
      direccion: "",
      email: "",
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-box">
        <h2>Agregar Cliente</h2>
        <form>
          <TextField
            name="nombre"
            label="Nombre"
            fullWidth
            margin="normal"
            value={formData.nombre}
            onChange={handleChange}
          />
          <TextField
            name="apellidos"
            label="Apellidos"
            fullWidth
            margin="normal"
            value={formData.apellidos}
            onChange={handleChange}
          />
          <TextField
            name="telefono"
            label="Teléfono"
            fullWidth
            margin="normal"
            value={formData.telefono}
            onChange={handleChange}
          />
          <TextField
            name="direccion"
            label="Dirección"
            fullWidth
            margin="normal"
            value={formData.direccion}
            onChange={handleChange}
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />
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
