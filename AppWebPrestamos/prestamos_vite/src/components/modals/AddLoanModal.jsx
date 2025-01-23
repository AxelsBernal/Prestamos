import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import axios from "axios";

const AddLoanModal = ({ open, onClose, onLoanAdded }) => {
  const [clients, setClients] = useState([]);
  const [formValues, setFormValues] = useState({
    clienteId: "",
    tipo: "",
    tasaInteres: "",
    fechaInicio: "",
    montoPrestado: "",
    totalPagos: "",
    saldoRestante: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  // Obtener el token del almacenamiento local
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REST_API_CLIENTES}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClients(response.data);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    fetchClients();
  }, [token]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value };

      if (
        name === "montoPrestado" ||
        name === "tasaInteres" ||
        name === "totalPagos"
      ) {
        const montoPrestado = parseFloat(updatedValues.montoPrestado || 0);
        const tasaInteres = parseFloat(updatedValues.tasaInteres || 0) / 100;
        const totalPagos = parseInt(updatedValues.totalPagos || 0, 10);

        if (
          updatedValues.tipo === "semanal" &&
          montoPrestado &&
          tasaInteres &&
          totalPagos
        ) {
          const montoInteres = montoPrestado * tasaInteres;
          updatedValues.saldoRestante = (
            montoInteres * totalPagos
          ).toFixed(2);
        }
      }

      return updatedValues;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        clienteId: formValues.clienteId,
        tipo: formValues.tipo,
        tasaInteres: Number(formValues.tasaInteres) / 100,
        fechaInicio: formValues.fechaInicio,
        montoPrestado: formValues.montoPrestado,
        ...(formValues.tipo === "semanal" && {
          totalPagos: formValues.totalPagos,
          saldoRestante: formValues.saldoRestante,
        }),
      };

      await axios.post(`${import.meta.env.VITE_REST_API_PRESTAMOS}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage({ text: "Préstamo agregado correctamente", type: "success" });
      setFormValues({
        clienteId: "",
        tipo: "",
        tasaInteres: "",
        fechaInicio: "",
        montoPrestado: "",
        totalPagos: "",
        saldoRestante: "",
      });
      onLoanAdded && onLoanAdded();
      setTimeout(() => {
        setMessage({ text: "", type: "" });
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error al agregar préstamo:", error);
      setMessage({
        text: "Error desconocido al agregar préstamo",
        type: "error",
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-loan-modal">
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
          Agregar Préstamo
        </Typography>
        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="cliente-label">Cliente</InputLabel>
            <Select
              labelId="cliente-label"
              name="clienteId"
              value={formValues.clienteId}
              onChange={handleInputChange}
              required
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.nombre} {client.apellidos}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="tipo-label">Tipo</InputLabel>
            <Select
              labelId="tipo-label"
              name="tipo"
              value={formValues.tipo}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="semanal">Semanal</MenuItem>
              <MenuItem value="mensual">Mensual</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Tasa de Interés (%)"
            name="tasaInteres"
            type="number"
            value={formValues.tasaInteres}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
            inputProps={{ min: 1, max: 100 }}
          />
          <TextField
            label="Monto Prestado"
            name="montoPrestado"
            type="number"
            value={formValues.montoPrestado}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          {formValues.tipo === "semanal" && (
            <>
              <TextField
                label="Total de Pagos"
                name="totalPagos"
                type="number"
                value={formValues.totalPagos}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Saldo Restante"
                name="saldoRestante"
                type="number"
                value={formValues.saldoRestante}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          )}
          <TextField
            label="Fecha de Inicio"
            name="fechaInicio"
            type="date"
            value={formValues.fechaInicio}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Agregar Préstamo
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddLoanModal;
