import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Stack, Tooltip, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";
import "../css/Prestamo.css";
import AddLoanModal from "../components/modals/AddLoanModal";
import DeleteLoanModal from "../components/modals/DeleteLoanModal";
import EditLoanModal from "../components/modals/EditLoanModal";
import AddPaymentModal from "../components/modals/AddPaymentModal";

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [showPagos, setShowPagos] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [currentLoanId, setCurrentLoanId] = useState(null);
  const [selectedLoanId, setSelectedLoanId] = useState(null);


  // Función para obtener el token
  const getToken = () => localStorage.getItem("token");

  // Columnas de la tabla de préstamos
  const columns = [
    { field: "id", headerName: "ID", width: 70, headerClassName: "green-header" },
    { field: "nombreCliente", headerName: "Cliente", flex: 1, headerClassName: "green-header" },
    { field: "montoPrestado", headerName: "Monto Prestado",width: 70, flex: 1, headerClassName: "green-header" },
    { field: "tipo", headerName: "Tipo de Prestamo", flex: 1, headerClassName: "green-header" },
    { field: "montoTotal", headerName: "Monto Total", flex: 1,width: 70, headerClassName: "green-header" },
    { field: "pagosRealizados", headerName: "Pagos realizados",width: 70, flex: 1, headerClassName: "green-header" },
    { field: "saldoRestante", headerName: "Saldo Restante", flex: 1, headerClassName: "green-header" },
    { field: "status", headerName: "Estatus",width: 70, flex: 1, headerClassName: "green-header" },
    { field: "fechaInicio", headerName: "Fecha de Inicio", flex: 1, headerClassName: "green-header" },
    {
      field: "acciones",
      headerName: "Acciones",
      headerClassName: "green-header",
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
                    <Tooltip title="Agregar Pago">
            <IconButton
              onClick={() => handleOpenAddPaymentModal(params.row)}
              color="primary"
            >
              <PaymentIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ver Pagos">
            <IconButton onClick={() => handleViewWithPayments(params.row)} color="primary">
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar Préstamo">
            <IconButton onClick={() => handleOpenEditModal(params.row)} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar Préstamo">
            <IconButton onClick={() => handleOpenDeleteModal(params.row)} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
      flex: 1,
    },
  ];

  // Columnas de la tabla de pagos
  const pagoColumns = [
    { field: "numeroPago", headerName: "Pago N°", width: 90,headerClassName: "green-header" },
    { field: "montoPago", headerName: "Monto de Pago", flex: 1,headerClassName: "green-header" },
    { field: "fechaPago", headerName: "Fecha de Pago", flex: 1,headerClassName: "green-header" },
  ];

  const fetchPrestamos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REST_API_PRESTAMOS}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
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
            ? new Date(prestamo.fechaInicio).toISOString().split("T")[0]
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

  // Abrir modal de agregar pago
  const handleOpenAddPaymentModal = (loan) => {
    //console.log("Préstamo seleccionado:", loan); // Verifica si el préstamo se pasa correctamente
    setSelectedLoanId(loan.id); // Cambia `loan.id` si tu campo ID tiene otro nombre
    setIsAddPaymentModalOpen(true);
  };
  
  const handleCloseAddPaymentModal = () => {
    setSelectedLoanId(null);
    setIsAddPaymentModalOpen(false);
  };

  // Abrir modal de editar préstamo
  const handleOpenEditModal = (loan) => {
    setSelectedRow(loan);
    setIsEditModalOpen(true);
  };

  // Abrir modal de eliminar préstamo
  const handleOpenDeleteModal = (loan) => {
    setSelectedRow(loan);
    setIsDeleteModalOpen(true);
  };

  // Ver pagos de un préstamo
  const handleViewWithPayments = async (row) => {
    if (row) {
      const { clienteId, id } = row;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REST_API_PRESTAMOS}/pagos/cliente/${clienteId}/prestamo/${id}`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
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
          setCurrentLoanId(id);
        } else {
          console.error("Datos de pagos no disponibles o inválidos:", pagosData);
          alert("No se encontraron pagos para este préstamo.");
        }
      } catch (error) {
        console.error("Error al obtener los detalles del préstamo:", error);
      }
    }
  };

  useEffect(() => {
    fetchPrestamos();
  }, []);

  return (
    <div className="prestamos-container">
      <Box sx={{ marginBottom: 2 }}>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Agregar Préstamo">
            <IconButton onClick={() => setIsModalOpen(true)} color="primary">
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refrescar">
            <IconButton onClick={fetchPrestamos} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      {!showPagos ? (
        <DataGrid
    rows={prestamos}
    columns={columns}
    autoHeight
    pageSize={5}
    rowsPerPageOptions={[5]}
    onRowClick={(params) => setSelectedRow(params.row)}
    getRowClassName={(params) =>
      params.row.status === "liquidado" ? "row-liquidado" : ""
    }
/>
      ) : (
        <DataGrid
          rows={pagos}
          columns={pagoColumns}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      )}

      <AddLoanModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLoanAdd={fetchPrestamos} 
      />
      <DeleteLoanModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        selectedLoanId={selectedRow?.id}
        onLoanDeleted={fetchPrestamos}
      />
      <EditLoanModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedLoanId={selectedRow?.id}
        onLoanEdited={fetchPrestamos}
      />;
      <AddPaymentModal
        open={isAddPaymentModalOpen}
        onClose={handleCloseAddPaymentModal}
        loanId={selectedLoanId} // Aquí se pasa el ID del préstamo
        onPaymentAdded={() => fetchPrestamos()} // Refresca los datos después de agregar el pago
      />
    </div>
  );
}
