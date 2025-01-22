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
import { toast } from "react-toastify";

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

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REST_API_CLIENTES}`, axiosConfig);
        setClientes(response.data);
        setFilteredClients(response.data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
        toast.error("Error al cargar los clientes. Por favor, inténtalo nuevamente.", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
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
      const response = await axios.post(`${import.meta.env.VITE_REST_API_CLIENTES}`, newClient, axiosConfig);
      setClientes([...clientes, response.data]);
      setFilteredClients([...clientes, response.data]);
      setIsAddModalOpen(false);
      toast.success("Cliente agregado correctamente.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      toast.error("Error al agregar el cliente. Por favor, inténtalo nuevamente.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const handleEditClient = async (updatedClient) => {
    try {
      await axios.put(`${import.meta.env.VITE_REST_API_CLIENTES}/${updatedClient.id}`, updatedClient, axiosConfig);
      const updatedClientes = clientes.map((cliente) =>
        cliente.id === updatedClient.id ? updatedClient : cliente
      );
      setClientes(updatedClientes);
      setFilteredClients(updatedClientes);
      setIsEditModalOpen(false);
      toast.success("Cliente editado correctamente.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.error("Error al editar cliente:", error);
      toast.error("Error al editar el cliente. Por favor, inténtalo nuevamente.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_REST_API_CLIENTES}/${clientId}`, axiosConfig);
      const updatedClientes = clientes.filter((cliente) => cliente.id !== clientId);
      setClientes(updatedClientes);
      setFilteredClients(updatedClientes);
      setIsDeleteModalOpen(false);
      toast.success("Cliente eliminado correctamente.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      toast.error("Error al eliminar el cliente. Por favor, inténtalo nuevamente.", {
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
      <h1 style={{ textAlign: "center", margin: "20px 0", color: "#333" }}>Listado de Clientes</h1>
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
        <Tooltip title="Agregar Cliente">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Agregar
          </Button>
        </Tooltip>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#4caf50" }}>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>ID</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Nombre</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Teléfono</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Email</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.id}</TableCell>
                  <TableCell>{`${cliente.nombre} ${cliente.apellidos}`}</TableCell>
                  <TableCell>{cliente.telefono}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedClient(cliente);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        color="secondary"
                        onClick={() => {
                          setSelectedClient(cliente);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
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
    </>
  );
}
