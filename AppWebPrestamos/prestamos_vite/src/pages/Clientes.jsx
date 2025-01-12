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

  // Fetch data from API
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REST_API_CLIENTES}`);
        setClientes(response.data);
        setFilteredClients(response.data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
    const filtered = clientes.filter((cliente) =>
      `${cliente.nombre} ${cliente.apellidos}`.toLowerCase().includes(value)
    );
    setFilteredClients(filtered);
    setPage(0);
  };

  const handleAddClient = async (newClient) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REST_API_CLIENTES}`, newClient);
      setClientes([...clientes, response.data]);
      setFilteredClients([...clientes, response.data]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error al agregar cliente:", error);
    }
  };

  const handleEditClient = async (updatedClient) => {
    try {
      await axios.put(`${import.meta.env.VITE_REST_API_CLIENTES}/${updatedClient.id}`, updatedClient);
      const updatedClientes = clientes.map((cliente) =>
        cliente.id === updatedClient.id ? updatedClient : cliente
      );
      setClientes(updatedClientes);
      setFilteredClients(updatedClientes);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error al editar cliente:", error);
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_REST_API_CLIENTES}/${clientId}`);
      const updatedClientes = clientes.filter((cliente) => cliente.id !== clientId);
      setClientes(updatedClientes);
      setFilteredClients(updatedClientes);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  return (
    <>
      <h2 style={{ textAlign: "center", margin: "20px 0", color: "#333" }}>
        Listado de Clientes
      </h2>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "0 5% 10px" }}>
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
              onClick={handleOpenAddModal}
              style={{ marginRight: "10px" }}
            >
              Agregar
            </Button>
          </Tooltip>
          <Tooltip title="Editar Cliente">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleOpenEditModal}
              disabled={!selectedClient}
              style={{ marginRight: "10px" }}
            >
              Editar
            </Button>
          </Tooltip>
          <Tooltip title="Eliminar Cliente">
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleOpenDeleteModal}
              disabled={!selectedClient}
            >
              Eliminar
            </Button>
          </Tooltip>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#4caf50" }}>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>ID</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Nombre</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Teléfono</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Dirección</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients &&
              filteredClients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((cliente) => (
                  <TableRow
                    key={cliente.id}
                    onClick={() => setSelectedClient(cliente)}
                    style={{
                      backgroundColor: selectedClient?.id === cliente.id ? "#f5f5f5" : "inherit",
                      cursor: "pointer",
                    }}
                  >
                    <TableCell>{cliente.id}</TableCell>
                    <TableCell>{`${cliente.nombre} ${cliente.apellidos}`}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>{cliente.direccion}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={filteredClients?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <AddClientModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAddClient={handleAddClient}
      />
      <EditClientModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        onEditClient={handleEditClient}
        client={selectedClient}
      />
      <DeleteClientModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDeleteClient={handleDeleteClient}
        client={selectedClient}
      />
    </>
  );
}
