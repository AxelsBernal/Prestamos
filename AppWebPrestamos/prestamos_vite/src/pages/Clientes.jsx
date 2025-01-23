import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Tooltip,
  TextField,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddClientModal from "../components/modals/AddClientModal";
import EditClientModal from "../components/modals/EditClientModal";
import DeleteClientModal from "../components/modals/DeleteClientModal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch data from API
  const fetchClientes = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REST_API_CLIENTES}`,
        axiosConfig
      );
      setClientes(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
      toast.error("Error al cargar los clientes.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
    const filtered = clientes.filter((cliente) =>
      `${cliente.nombre || ""} ${cliente.apellidos || ""}`
        .toLowerCase()
        .includes(value)
    );
    setFilteredClients(filtered);
    setPage(0);
  };

  const handleAddClient = async (newClient) => {
    try {
      if (!newClient.nombre || !newClient.apellidos || !newClient.email) {
        throw new Error("Todos los campos son obligatorios.");
      }

      await axios.post(
        `${import.meta.env.VITE_REST_API_CLIENTES}`,
        newClient,
        axiosConfig
      );

      // Recargar los datos después de agregar
      await fetchClientes();

      setIsAddModalOpen(false);
      toast.success("Cliente agregado correctamente.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.error("Error al agregar cliente:", error.message || error);
      toast.error(
        error.message || "Error al agregar el cliente. Intente nuevamente.",
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
    }
  };

  const handleEditClient = async (updatedClient) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_REST_API_CLIENTES}/${updatedClient.id}`,
        updatedClient,
        axiosConfig
      );

      await fetchClientes();

      setIsEditModalOpen(false);
      toast.success("Cliente editado correctamente.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.error("Error al editar cliente:", error);
      toast.error("Error al editar el cliente.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_REST_API_CLIENTES}/${clientId}`,
        axiosConfig
      );

      await fetchClientes();

      setIsDeleteModalOpen(false);
      toast.success("Cliente eliminado correctamente.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      toast.error("Error al eliminar el cliente.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>
        Listado de Clientes
      </h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          variant="outlined"
          placeholder="Buscar cliente..."
          value={searchValue}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <SearchIcon style={{ marginRight: "10px" }} />,
          }}
          style={{ width: "60%" }}
        />
        <div>
          <Tooltip title="Agregar Cliente">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={() => setIsAddModalOpen(true)}
              style={{ marginRight: "10px" }}
            >
              Agregar
            </Button>
          </Tooltip>
          {selectedClient && (
            <>
              <Tooltip title="Editar">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditModalOpen(true)}
                  style={{ marginRight: "10px" }}
                >
                  Editar
                </Button>
              </Tooltip>
              <Tooltip title="Eliminar">
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Eliminar
                </Button>
              </Tooltip>
            </>
          )}
        </div>
      </div>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#4caf50" }}>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>ID</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Nombre</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Teléfono</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Dirección</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Email</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Préstamos Activos</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Historial</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((cliente) => (
                <TableRow
                  key={cliente.id}
                  onClick={() => setSelectedClient(cliente)}
                  style={{
                    backgroundColor:
                      selectedClient?.id === cliente.id ? "#f5f5f5" : "inherit",
                    cursor: "pointer",
                  }}
                >
                  <TableCell>{cliente.id}</TableCell>
                  <TableCell>{`${cliente.nombre || ""} ${cliente.apellidos || ""}`}</TableCell>
                  <TableCell>{cliente.telefono || "-"}</TableCell>
                  <TableCell>{cliente.direccion || "-"}</TableCell>
                  <TableCell>{cliente.email || "-"}</TableCell>
                  <TableCell>{cliente.prestamosActivos?.length || 0}</TableCell>
                  <TableCell>{cliente.historialPrestamos?.length || 0}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={filteredClients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <AddClientModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddClient}
        AddCliente={() => fetchClientes()}
      />
      <EditClientModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={selectedClient}
        onEdit={handleEditClient}
      />
      <DeleteClientModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        client={selectedClient}
        onDelete={() => handleDeleteClient(selectedClient.id)}
      />
      <ToastContainer />
    </>
  );
}
