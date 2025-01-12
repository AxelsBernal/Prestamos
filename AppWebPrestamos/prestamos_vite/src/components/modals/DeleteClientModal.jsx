import React from "react";
import { Modal, Box, Button, Typography } from "@mui/material";

export default function DeleteClientModal({ open, onClose, clientId, onDelete }) {
  const handleDelete = () => {
    onDelete(clientId);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-box">
        <Typography variant="h6" gutterBottom>
          ¿Estás seguro de que deseas eliminar este cliente?
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
