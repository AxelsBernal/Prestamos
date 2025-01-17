import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button, MenuItem } from "@mui/material";
import axios from "axios";

const EditLoanModal = ({ open, onClose, selectedLoan, onLoanEdited }) => {
  const [formValues, setFormValues] = useState({
    id: "",
    clienteId: "",
    tipo: "",
    montoPrestado: "",
    tasaInteres: "",
    montoInteres: "",
    montoTotal: "",
    saldoRestante: "",
    totalPagos: "",
    pagosRealizados: "",
    fechaInicio: "",
    status: "", // Add status field
  });

  useEffect(() => {
    if (selectedLoan && open) {
      const fetchLoanDetails = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_REST_API_PRESTAMOS}/${selectedLoan.id}`
          );
          const loanData = response.data;

          setFormValues({
            id: loanData.id,
            clienteId: loanData.clienteId,
            tipo: loanData.tipo,
            montoPrestado: loanData.montoPrestado,
            tasaInteres: loanData.tasaInteres * 100, // Convert to percentage
            montoInteres: loanData.montoInteres,
            montoTotal: loanData.montoTotal,
            saldoRestante: loanData.saldoRestante,
            totalPagos: loanData.totalPagos || "",
            pagosRealizados: loanData.pagosRealizados,
            fechaInicio: loanData.fechaInicio.split("T")[0], // Format date
            status: loanData.status, // Set the current status
          });
        } catch (error) {
          console.error("Error al obtener los detalles del préstamo:", error);
        }
      };

      fetchLoanDetails();
    }
  }, [selectedLoan, open]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        tipo: formValues.tipo,
        montoPrestado: formValues.montoPrestado,
        tasaInteres: formValues.tasaInteres / 100, // Convert to decimal
        montoInteres: formValues.montoInteres,
        montoTotal: formValues.montoTotal,
        saldoRestante: formValues.saldoRestante,
        ...(formValues.tipo === "semanal" && {
          totalPagos: formValues.totalPagos,
        }),
        pagosRealizados: formValues.pagosRealizados,
        fechaInicio: formValues.fechaInicio,
        status: formValues.status, // Include status in payload
      };

      await axios.put(
        `${import.meta.env.VITE_REST_API_PRESTAMOS}/${formValues.id}`,
        payload
      );
      onLoanEdited && onLoanEdited();
      onClose(); // Close the modal immediately after saving
    } catch (error) {
      console.error("Error al actualizar el préstamo:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-loan-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Editar Préstamo
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="ID Préstamo"
            name="id"
            value={formValues.id}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="ID Cliente"
            name="clienteId"
            value={formValues.clienteId}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Tipo"
            name="tipo"
            value={formValues.tipo}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
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
          <TextField
            label="Tasa de Interés (%)"
            name="tasaInteres"
            type="number"
            value={formValues.tasaInteres}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Monto Interés"
            name="montoInteres"
            type="number"
            value={formValues.montoInteres}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Monto Total"
            name="montoTotal"
            type="number"
            value={formValues.montoTotal}
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
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          {formValues.tipo === "semanal" && (
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
          )}
          <TextField
            label="Pagos Realizados"
            name="pagosRealizados"
            type="number"
            value={formValues.pagosRealizados}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
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
          <TextField
            label="Estado"
            name="status"
            select
            value={formValues.status}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="liquidado">Liquidado</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Actualizar Préstamo
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditLoanModal;
