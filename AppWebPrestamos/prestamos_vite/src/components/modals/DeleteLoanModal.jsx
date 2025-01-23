import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";

export default function DeleteLoanModal({ open, onClose, selectedLoanId, onLoanDeleted }) {
  const [loading, setLoading] = useState(false);
  const [loanDetails, setLoanDetails] = useState(null);

  // Obtener detalles del préstamo
  useEffect(() => {
    const fetchLoanDetails = async () => {
      if (!selectedLoanId) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REST_API_PRESTAMOS}/${selectedLoanId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setLoanDetails(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles del préstamo:", error);
        setLoanDetails(null);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchLoanDetails();
    }
  }, [selectedLoanId, open]);

  // Función para eliminar préstamo
  const handleDelete = async () => {
    if (!selectedLoanId) return;

    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_REST_API_PRESTAMOS}/${selectedLoanId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      onLoanDeleted(); // Refresca los datos después de eliminar
      onClose();
    } catch (error) {
      console.error("Error al eliminar el préstamo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Eliminar Préstamo</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : loanDetails ? (
          <Typography>
            ¿Estás seguro de que deseas eliminar el préstamo con el id de {" "}
            <strong>{loanDetails.id}</strong> con un monto de{" "}
            <strong>{loanDetails.montoPrestado}</strong>?
          </Typography>
        ) : (
          <Typography>No se pudieron cargar los detalles del préstamo.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          disabled={loading || !loanDetails}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
