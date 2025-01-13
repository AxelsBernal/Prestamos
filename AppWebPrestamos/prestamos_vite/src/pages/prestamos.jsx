import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Stack, Tooltip, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import "../css/Prestamo.css";
import AddLoanModal from "../components/modals/AddLoanModal";
import DeleteLoanModal from "../components/modals/DeleteLoanModal";

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [showPagos, setShowPagos] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch all loans
  const fetchPrestamos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REST_API_PRESTAMOS}`);
      const data = response.data;

      const formattedData = data.map((prestamo) => {
        const nombreCompleto = `${prestamo.nombreCliente || "Desconocido"} ${
          prestamo.apellidosCliente || ""
        }`.trim();

        return {
          ...prestamo,
          tasaInteres: prestamo.tasaInteres
            ? `${(prestamo.tasaInteres * 100).toFixed(1)}%`
            : "NA",
          fechaInicio: prestamo.fechaInicio
            ? new Date(prestamo.fechaInicio).toLocaleDateString("es-MX")
            : "NA",
          nombreCliente: nombreCompleto,
        };
      });

      setPrestamos(formattedData);
      setShowPagos(false);
    } catch (error) {
      console.error("Error al obtener los préstamos:", error);
    }
  };

  // View loan details with payments
  const handleViewWithPayments = async () => {
    if (selectedRow) {
      const { clienteId, id } = selectedRow;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REST_API_PRESTAMOS}/pagos/cliente/${clienteId}/prestamo/${id}`
        );
        console.log("Respuesta de la API:", response.data);

        const pagosData = response.data;

        if (pagosData && pagosData.pagos && Array.isArray(pagosData.pagos)) {
          const pagosFormatted = pagosData.pagos.map((pago, index) => ({
            id: `${id}-${index + 1}`,
            idPrestamo: pagosData.idPrestamo,
            idCliente: pagosData.idCliente,
            nombreCliente: pagosData.nombreCliente,
            montoPrestado: pagosData.montoPrestado,
            montoTotal: pagosData.montoTotal,
            saldoRestante: pagosData.saldoRestante,
            fechaInicio: pagosData.fechaInicio,
            numeroPago: pago.numeroPago,
            montoPago: pago.montoPago,
            fechaPago: pago.fechaPago,
          }));

          setPagos(pagosFormatted);
          setShowPagos(true);
        } else {
          console.error("Datos de pagos no disponibles o inválidos:", pagosData);
          alert("No se encontraron pagos para este préstamo.");
        }
      } catch (error) {
        console.error("Error al obtener los detalles del préstamo:", error);
      }
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  // Refresh loans when modal is closed after adding a loan
  const handleLoanAdded = () => {
    fetchPrestamos();
    setIsModalOpen(false);
  };

  // Refresh loans when a loan is deleted
  const handleLoanDeleted = () => {
    fetchPrestamos();
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    fetchPrestamos();
  }, []);

  const columns = [
    { field: "id", headerName: "ID Préstamo", flex: 1, headerClassName: "green-header" },
    { field: "clienteId", headerName: "ID Cliente", flex: 1, headerClassName: "green-header" },
    { field: "nombreCliente", headerName: "Nombre del Cliente", flex: 1, headerClassName: "green-header" },
    { field: "tipo", headerName: "Tipo", flex: 1, headerClassName: "green-header" },
    { field: "montoPrestado", headerName: "Monto Prestado", flex: 1, headerClassName: "green-header" },
    { field: "tasaInteres", headerName: "Tasa de Interés", flex: 1, headerClassName: "green-header" },
    { field: "montoInteres", headerName: "Monto Interés", flex: 1, headerClassName: "green-header" },
    { field: "montoTotal", headerName: "Monto Total", flex: 1, headerClassName: "green-header" },
    { field: "saldoRestante", headerName: "Saldo Restante", flex: 1, headerClassName: "green-header" },
    { field: "fechaInicio", headerName: "Fecha Inicio", flex: 1, headerClassName: "green-header" },
    { field: "status", headerName: "Estado", flex: 1, headerClassName: "green-header" },
  ];

  const pagosColumns = [
    { field: "idPrestamo", headerName: "ID Préstamo", flex: 1, headerClassName: "green-header" },
    { field: "idCliente", headerName: "ID Cliente", flex: 1, headerClassName: "green-header" },
    { field: "nombreCliente", headerName: "Nombre del Cliente", flex: 1, headerClassName: "green-header" },
    { field: "montoPrestado", headerName: "Monto Prestado", flex: 1, headerClassName: "green-header" },
    { field: "montoTotal", headerName: "Monto Total", flex: 1, headerClassName: "green-header" },
    { field: "saldoRestante", headerName: "Saldo Restante", flex: 1, headerClassName: "green-header" },
    { field: "fechaInicio", headerName: "Fecha Inicio", flex: 1, headerClassName: "green-header" },
    { field: "numeroPago", headerName: "Número de Pago", flex: 1, headerClassName: "green-header" },
    { field: "montoPago", headerName: "Monto de Pago", flex: 1, headerClassName: "green-header" },
    { field: "fechaPago", headerName: "Fecha de Pago", flex: 1, headerClassName: "green-header" },
  ];

  return (
    <div className="prestamos-container">
      <h1>Listado de Préstamos</h1>
      <Box>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Tooltip title="Refrescar">
            <IconButton onClick={fetchPrestamos} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Agregar Préstamo">
            <IconButton onClick={handleOpenModal} color="success">
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
          {selectedRow && (
            <>
              <Tooltip title="Ver con Pagos">
                <IconButton onClick={handleViewWithPayments} color="info">
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar Préstamo">
                <IconButton onClick={handleOpenDeleteModal} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
        <div className="tabla-prestamos">
          <DataGrid
            rows={showPagos ? pagos : prestamos}
            columns={showPagos ? pagosColumns : columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.id}
            disableSelectionOnClick
            onRowSelectionModelChange={(ids) => {
              const selectedId = ids[0];
              const selected = prestamos.find((row) => row.id === selectedId);
              setSelectedRow(selected);
            }}
          />
        </div>
        <AddLoanModal open={isModalOpen} onClose={handleCloseModal} onLoanAdded={handleLoanAdded} />
        <DeleteLoanModal
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          selectedLoan={selectedRow}
          onLoanDeleted={handleLoanDeleted}
        />
      </Box>
    </div>
  );
}
