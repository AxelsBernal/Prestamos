import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import axios from "axios";

const DeleteLoanModal = ({ open, onClose, selectedLoan, onLoanDeleted }) => {
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleDelete = async () => {
    try {
      const { id } = selectedLoan;
      await axios.delete(`${import.meta.env.VITE_REST_API_PRESTAMOS}/${id}`);
      setMessage({ text: "Préstamo eliminado correctamente", type: "success" });
      onLoanDeleted && onLoanDeleted(); // Refresh the loan list
      setTimeout(() => {
        setMessage({ text: "", type: "" });
        onClose(); // Close the modal
      }, 5000);
    } catch (error) {
      console.error("Error al eliminar préstamo:", error);
      setMessage({ text: "Error al eliminar el préstamo", type: "error" });
    }
  };

  if (!selectedLoan) {
    return null;
  }

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="delete-loan-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Eliminar Préstamo
        </Typography>
        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}
        <Typography sx={{ mb: 2 }}>
          ¿Estás seguro de que deseas eliminar el préstamo con los siguientes
          detalles?
        </Typography>
        <Typography>
          <strong>ID Préstamo:</strong> {selectedLoan.id}
        </Typography>
        <Typography>
          <strong>Cliente:</strong> {selectedLoan.nombreCliente}
        </Typography>
        <Typography>
          <strong>Monto Total:</strong> {selectedLoan.montoTotal}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <strong>Fecha de Inicio:</strong> {selectedLoan.fechaInicio}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            Eliminar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteLoanModal;
