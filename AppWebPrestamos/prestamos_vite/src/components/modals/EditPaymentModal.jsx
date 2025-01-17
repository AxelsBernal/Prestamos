import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

const EditPaymentModal = ({ open, onClose, selectedPayment, onPaymentUpdated }) => {
  const [formValues, setFormValues] = useState({
    monto: "",
    fecha: "",
  });

  useEffect(() => {
    if (selectedPayment) {
      const fecha = selectedPayment.fecha ? new Date(selectedPayment.fecha) : null;

      setFormValues({
        monto: selectedPayment.monto || "",
        fecha: fecha && !isNaN(fecha) ? fecha.toISOString().split("T")[0] : "", // Validate date
      });
    }
  }, [selectedPayment]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        monto: Number(formValues.monto),
        fecha: formValues.fecha,
      };

      await axios.put(
        `${import.meta.env.VITE_REST_API_PRESTAMOS}/${selectedPayment.prestamoId}/pagos/${selectedPayment.folio}`,
        payload
      );

      onPaymentUpdated && onPaymentUpdated();
      onClose();
    } catch (error) {
      console.error("Error al actualizar el pago:", error);
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
        <form onSubmit={handleSubmit}>
          <TextField
            label="Monto Pagado"
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Guardar Cambios
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditPaymentModal;
