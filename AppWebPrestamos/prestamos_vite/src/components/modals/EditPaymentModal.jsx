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

const EditPaymentModal = ({ open, onClose, selectedPayment, onPaymentUpdated }) => {
  const [formValues, setFormValues] = useState({
    monto: "",
    fecha: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedPayment) {
      setFormValues({
        monto: selectedPayment.monto || "",
        fecha: selectedPayment.fecha || "",
      });
    }
  }, [selectedPayment]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedPayment) {
      console.error("No payment selected for editing.");
      setMessage({ text: "Error: No se encontró el pago para editar.", type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        monto: parseFloat(formValues.monto),
        fecha: formValues.fecha,
      };

      await axios.put(
        `${import.meta.env.VITE_REST_API_PRESTAMOS}/${selectedPayment.prestamoId}/pagos/${selectedPayment.folio}`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setMessage({ text: "Pago actualizado correctamente.", type: "success" });
      onPaymentUpdated && onPaymentUpdated();

      setTimeout(() => {
        setMessage({ text: "", type: "" });
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar el pago:", error);
      setMessage({ text: "Error al actualizar el pago.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-payment-modal">
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
          Editar Pago
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
            {isLoading ? <CircularProgress size={24} /> : "Guardar Cambios"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditPaymentModal;
