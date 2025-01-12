import React from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DeleteClientModal({ open, onClose, client, onDelete }) {
  const handleDelete = async () => {
    try {
      await onDelete(client?.id); // Assuming onDelete returns a promise
      toast.success("Cliente eliminado correctamente");
      onClose(); // Close the modal after successful deletion
    } catch (error) {
      toast.error("Error al eliminar el cliente");
      console.error(error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-box">
        <Typography variant="h6" gutterBottom>
          ¿Estás seguro de que deseas eliminar este cliente?
        </Typography>
        <Typography variant="body1" gutterBottom>
          ID: {client?.id || "N/A"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Nombre: {client?.nombre || "N/A"}
        </Typography>
        <div className="modal-actions">
          <Button onClick={onClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
