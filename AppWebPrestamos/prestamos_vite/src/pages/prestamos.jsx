import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import "../css/Prestamo.css";

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REST_API_PRESTAMOS}`
        );
        const data = response.data;

        console.log("Datos recibidos del backend:", data); // Verificar datos recibidos del backend

        // Procesar los datos para incluir tasa de interés y fecha
        const formattedData = data.map((prestamo) => {
          const nombreCompleto = `${prestamo.nombreCliente || "Desconocido"} ${
            prestamo.apellidosCliente || ""
          }`.trim();

          console.log(
            `Cliente ID: ${prestamo.clienteId}, Nombre completo: ${nombreCompleto}`
          ); // Verificar el nombre completo

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

        console.log("Datos procesados para la tabla:", formattedData); // Validar datos finales para la tabla
        setPrestamos(formattedData);
      } catch (error) {
        console.error("Error al obtener los préstamos:", error);
      }
    };

    fetchPrestamos();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "ID Préstamo",
      flex: 1,
      headerClassName: "green-header",
    },
    {
      field: "clienteId",
      headerName: "ID Cliente",
      flex: 1,
      headerClassName: "green-header",
    },
    {
      field: "nombreCliente",
      headerName: "Nombre del Cliente",
      flex: 1,
      headerClassName: "green-header",
    },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 1,
      headerClassName: "green-header",
    },
    {
      field: "montoPrestado",
      headerName: "Monto Prestado",
      flex: 1,
      headerClassName: "green-header",
    },
    {
      field: "tasaInteres",
      headerName: "Tasa de Interés",
      flex: 1,
      headerClassName: "green-header",
    },
    {
      field: "montoInteres",
      headerName: "Monto Interés",
      flex: 1,
      headerClassName: "green-header",
    },
    {
      field: "montoTotal",
      headerName: "Monto Total",
      flex: 1,
      headerClassName: "green-header",
    },
    {
      field: "saldoRestante",
      headerName: "Saldo Restante",
      flex: 1,
      headerClassName: "green-header",
    },
    {
      field: "fechaInicio",
      headerName: "Fecha Inicio",
      flex: 1,
      headerClassName: "green-header",
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 1,
      headerClassName: "green-header",
    },
  ];

  return (
    <div className="prestamos-container">
      <h1>Listado de Préstamos</h1>
      <div className="tabla-prestamos">
        <DataGrid
          rows={prestamos}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.id}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
}
