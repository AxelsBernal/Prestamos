import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/AddClientModal.css"; // Reutilizamos el CSS para mantener consistencia

export default function EditClientModal({ open, onClose, client, onEdit }) {
  const [formData, setFormData] = useState(client || {});
  const [error, setError] = useState({});

  useEffect(() => {
    setFormData(client || {});
    setError({});
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellidos) newErrors.apellidos = "Los apellidos son obligatorios";
    if (!formData.telefono) newErrors.telefono = "El teléfono es obligatorio";
    if (!formData.direccion) newErrors.direccion = "La dirección es obligatoria";
    if (!formData.email) newErrors.email = "El email es obligatorio";
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      try {
        onEdit(formData);
        toast.success("Cliente editado correctamente", {
          position: "top-right",
          autoClose: 3000,
        });
        onClose();
      } catch (error) {
        toast.error("Error al editar el cliente", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } else {
      toast.error("Por favor, completa los campos obligatorios", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-box">
        <h2>Editar Cliente</h2>
        <form>
          <TextField
            name="id"
            label="ID"
            fullWidth
            margin="normal"
            value={formData.id || ""}
            InputProps={{ readOnly: true }}
          />
          <TextField
            name="nombre"
            label="Nombre"
            fullWidth
            margin="normal"
            value={formData.nombre || ""}
            onChange={handleChange}
            error={!!error.nombre}
            helperText={error.nombre}
          />
          <TextField
            name="apellidos"
            label="Apellidos"
            fullWidth
            margin="normal"
            value={formData.apellidos || ""}
            onChange={handleChange}
            error={!!error.apellidos}
            helperText={error.apellidos}
          />
          <TextField
            name="telefono"
            label="Teléfono"
            fullWidth
            margin="normal"
            value={formData.telefono || ""}
            onChange={handleChange}
            error={!!error.telefono}
            helperText={error.telefono}
          />
          <TextField
            name="direccion"
            label="Dirección"
            fullWidth
            margin="normal"
            value={formData.direccion || ""}
            onChange={handleChange}
            error={!!error.direccion}
            helperText={error.direccion}
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email || ""}
            onChange={handleChange}
            error={!!error.email}
            helperText={error.email}
          />
          <TextField
            name="prestamosActivos"
            label="Préstamos Activos"
            fullWidth
            margin="normal"
            value={formData.prestamosActivos?.length || 0}
            InputProps={{ readOnly: true }}
          />
          <TextField
            name="historialPrestamos"
            label="Historial de Préstamos"
            fullWidth
            margin="normal"
            value={formData.historialPrestamos?.length || 0}
            InputProps={{ readOnly: true }}
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
