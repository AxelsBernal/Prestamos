import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Tooltip, IconButton, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "../css/pagos.css";
import EditPaymentModal from "../components/modals/EditPaymentModal"; // Ensure the path is correct

export default function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch all payments
  const fetchPagos = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REST_API_PRESTAMOS}/pagos/All`
      );
      const formattedData = response.data.map((pago) => ({
        ...pago,
        formattedFecha: new Date(pago.fecha).toLocaleDateString("es-MX"), // For display in the table
        fecha: pago.fecha.split("T")[0], // For use in the date picker
      }));
      setPagos(formattedData);
    } catch (error) {
      console.error("Error al obtener los pagos:", error);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handlePaymentUpdated = () => {
    fetchPagos();
    setIsEditModalOpen(false);
  };

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeletePayment = async () => {
    if (selectedRow) {
      const { prestamoId, folio } = selectedRow;
      try {
        await axios.delete(
          `${import.meta.env.VITE_REST_API_PRESTAMOS}/${prestamoId}/pagos/${folio}`
        );
        fetchPagos();
        setIsDeleteDialogOpen(false);
        setSelectedRow(null);
      } catch (error) {
        console.error("Error al eliminar el pago:", error);
      }
    }
  };

  // Define columns for the DataGrid
  const columns = [
    {
      field: "prestamoId",
      headerName: "ID Préstamo",
      flex: 1,
      headerClassName: "green-header",
    },
    {
      field: "nombreCliente",
      headerName: "Nombre del Cliente",
      flex: 2,
      headerClassName: "green-header",
    },
    {
      field: "montoPrestado",
      headerName: "Monto Prestado",
      flex: 1,
      headerClassName: "green-header",
    },
    {
      field: "folio",
      headerName: "Folio",
      flex: 1,
      headerClassName: "green-header",
    },
    {
      field: "monto",
      headerName: "Monto Pagado",
      flex: 1,
      headerClassName: "green-header",
    },
    {
      field: "formattedFecha",
      headerName: "Fecha",
      flex: 1,
      headerClassName: "green-header",
    },
  ];

  return (
    <div className="pagos-container">
      <h1 style={{ textAlign: "center", margin: "20px 0", color: "#333" }}>
        Listado de Pagos
      </h1>
      <Box>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Tooltip title="Refrescar">
            <IconButton onClick={fetchPagos} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {selectedRow && (
            <>
              <Tooltip title="Editar Pago">
                <IconButton onClick={handleOpenEditModal} color="primary">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar Pago">
                <IconButton onClick={handleOpenDeleteDialog} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
        <div className="tabla-pagos">
          <DataGrid
            rows={pagos}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => `${row.prestamoId}-${row.folio}`}
            disableSelectionOnClick
            onRowSelectionModelChange={(ids) => {
              const selectedId = ids[0];
              const selected = pagos.find(
                (row) => `${row.prestamoId}-${row.folio}` === selectedId
              );
              setSelectedRow(selected);
            }}
          />
        </div>
        <EditPaymentModal
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          selectedPayment={selectedRow}
          onPaymentUpdated={handlePaymentUpdated}
        />
        <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            {selectedRow && (
              <Typography>
                ¿Está seguro de que desea eliminar el pago?
                <br />
                <strong>ID Préstamo:</strong> {selectedRow.prestamoId}
                <br />
                <strong>Nombre del Cliente:</strong> {selectedRow.nombreCliente}
                <br />
                <strong>Monto Prestado:</strong> {selectedRow.montoPrestado}
                <br />
                <strong>Folio:</strong> {selectedRow.folio}
                <br />
                <strong>Monto Pagado:</strong> {selectedRow.monto}
                <br />
                <strong>Fecha:</strong> {selectedRow.formattedFecha}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleDeletePayment} color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}
