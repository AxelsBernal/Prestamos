import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button, MenuItem, CircularProgress } from "@mui/material";
import axios from "axios";

const EditLoanModal = ({ open, onClose, selectedLoanId, onLoanEdited }) => {
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
    status: "",
  });
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  useEffect(() => {
    if (selectedLoanId && open) {
      const fetchLoanDetails = async () => {
        setLoading(true); // Inicia el indicador de carga
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${import.meta.env.VITE_REST_API_PRESTAMOS}/${selectedLoanId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const loanData = response.data;

          setFormValues({
            id: loanData.id || "",
            clienteId: loanData.clienteId || "",
            tipo: loanData.tipo || "",
            montoPrestado: loanData.montoPrestado || "",
            tasaInteres: loanData.tasaInteres * 100 || "",
            montoInteres: loanData.montoInteres || "",
            montoTotal: loanData.montoTotal || "",
            saldoRestante: loanData.saldoRestante || "",
            totalPagos: loanData.totalPagos || "",
            pagosRealizados: loanData.pagosRealizados || "",
            fechaInicio: loanData.fechaInicio.split("T")[0] || "",
            status: loanData.status || "",
          });
        } catch (error) {
          console.error("Error fetching loan details:", error);
        } finally {
          setLoading(false); // Finaliza el indicador de carga
        }
      };

      fetchLoanDetails();
    }
  }, [selectedLoanId, open]);

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
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_REST_API_PRESTAMOS}/${formValues.id}`,
        {
          ...formValues,
          tasaInteres: formValues.tasaInteres / 100,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onLoanEdited && onLoanEdited();
      onClose();
    } catch (error) {
      console.error("Error updating loan:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Editar Préstamo
        </Typography>
        {loading ? ( // Mostrar CircularProgress mientras se cargan los datos
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Loan ID"
              name="id"
              value={formValues.id}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Client ID"
              name="clienteId"
              value={formValues.clienteId}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Type"
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
        )}
      </Box>
    </Modal>
  );
};

export default EditLoanModal;
