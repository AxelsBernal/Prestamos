import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const AddPaymentModal = ({ open, onClose, loanId, onPaymentAdded }) => {
  const [formValues, setFormValues] = useState({
    monto: "",
    fecha: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      // Limpiar campos al cerrar el modal
      setFormValues({
        monto: "",
        fecha: "",
      });
      setMessage({ text: "", type: "" });
    }
  }, [open]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!loanId) {
      console.error("No se encontró loanId");
      setMessage({ text: "Error: No se encontró el ID del préstamo.", type: "error" });
      return;
    }

    setIsLoading(true);
    console.log("ID del préstamo:", loanId); // Para verificar que el ID llega correctamente

    try {
      const payload = {
        monto: parseFloat(formValues.monto),
        fecha: formValues.fecha,
      };

      await axios.post(
        `${import.meta.env.VITE_REST_API_PRESTAMOS}/${loanId}/pagos`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMessage({ text: "Pago agregado correctamente", type: "success" });
      onPaymentAdded && onPaymentAdded();

      setTimeout(() => {
        setMessage({ text: "", type: "" });
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error al agregar el pago:", error);
      setMessage({ text: "Error al agregar el pago", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-payment-modal">
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
          Agregar Pago
        </Typography>
        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Monto"
            name="monto"
            type="number"
            value={formValues.monto}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Fecha"
            name="fecha"
            type="date"
            value={formValues.fecha}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Agregar Pago"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddPaymentModal;
