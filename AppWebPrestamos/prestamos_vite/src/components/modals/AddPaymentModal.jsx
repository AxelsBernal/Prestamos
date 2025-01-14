import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import axios from "axios";

const AddPaymentModal = ({ open, onClose, loanId, onPaymentAdded }) => {
  const [formValues, setFormValues] = useState({
    monto: "",
    fecha: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Current Loan ID: en modal: ", loanId);
    try {
      const payload = {
        monto: parseFloat(formValues.monto),
        fecha: formValues.fecha,
      };
  
      await axios.post(
        `${import.meta.env.VITE_REST_API_PRESTAMOS}/${loanId}/pagos`, // Use loanId
        payload
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Agregar Pago
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddPaymentModal;
