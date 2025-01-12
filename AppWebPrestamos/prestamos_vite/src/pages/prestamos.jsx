import { useState, useEffect } from "react";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { GrView, GrNext, GrPrevious } from "react-icons/gr";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FcSearch } from "react-icons/fc";

import AddInventoryModal from "../components/modals/AddInventoryModal";
import GetInventoryModal from "../components/modals/GetInventoryModal";
import EditInventoryModal from "../components/modals/EditInventoryModal";
import DeleteInventoryModal from "../components/modals/DeleteInventoryModal";   

import { Titulo } from "../components/styled/Texts";
import { ButtonIconBlue,ButtonIconD,ButtonIconE,ButtonIconV,ContentButton,Pagination } from "../components/styled/Buttons";
import { TablaVentas,Tabla,Td,Th,Tr } from "../components/styled/Tables";
import { Tooltip } from "@mui/material";

export default function Inventarios( ID, productos, inventarios, addInventario,editInventario,deleteInventario ) {
    document.title = "CdP - Inventario";

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const recordsPerPage = 8;

    const filteredRecords = (inventarios || []).filter((inventario) =>
        Object.values(inventario).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (inventario) => {
        setSelectedRow((prevSelected) => (prevSelected === inventario ? null : inventario));
    };

    const [OpenModalGet, setOpenModalGet] = useState(false);
    const [OpenModalAdd, setOpenModalAdd] = useState(false);
    const [OpenModalEdit, setOpenModalEdit] = useState(false);
    const [OpenModalDelete, setOpenModalDelete] = useState(false);
    
    const [Inventario, setInventario] = useState(null);
    const [InventarioId, setInventarioId] = useState(null);

    const toggleModalAdd = () => {
        setOpenModalAdd(!OpenModalAdd);
    };
    const toggleModalGet = (Inventario) => {
        setOpenModalGet(!OpenModalGet);
        setInventario(Inventario);
    };
    const toggleModalEdit = (Inventario) => {
        setOpenModalGet(!OpenModalGet);
        setInventario(Inventario);
    };
    const toggleModalDelete = (Inventario) => {
        setOpenModalGet(!OpenModalGet);
        setInventario(Inventario);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const table = document.getElementById("TablaVentas");
            if (table && !table.contains(event.target)) {
                setSelectedRow(null);
            }
        };
    
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <>
            <Titulo>Listado de Inventario</Titulo>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <Tooltip title="Agregar inventario">
                    <ButtonIconBlue onClick={toggleModalAdd}><IoMdAddCircleOutline /></ButtonIconBlue>
                </Tooltip>
                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'auto'
                    }}
                >
                    <FcSearch size={24} />
                </button>
                <Tooltip title="Buscador" placement="right">
                    <input
                        type="text"
                        placeholder="Buscar inventario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: "10px",
                            fontSize: "14px",
                            border: 'none',
                            backgroundColor: 'transparent',
                            borderBottom: "2px solid #000",
                            borderRadius: "6px",
                            width: "250px",
                        }}
                    />
                </Tooltip>
                <Tooltip title="Ver inventario">
                    <ButtonIconV disabled={selectedRow === null} onClick={() => toggleModalGet(selectedRow)}><GrView /></ButtonIconV>
                </Tooltip>
                <Tooltip title="Editar inventario">
                    <ButtonIconE disabled={selectedRow === null} onClick={() => toggleModalEdit(selectedRow)}><MdModeEdit/></ButtonIconE>
                </Tooltip>
                <Tooltip title="Eliminar inventario">
                    <ButtonIconD disabled={selectedRow === null} onClick={() => toggleModalDelete(selectedRow)}><MdDelete /></ButtonIconD>
                </Tooltip>
            </div>
            <TablaVentas id="TablaVentas">
                <Tabla>
                    <thead>
                        <Tr>
                            <Th>ID Inventario</Th>
                            <Th>ID Producto</Th>
                            <Th>Cantidad</Th>
                            <Th>Fecha</Th>
                        </Tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((inventario) => (
                            <Tr
                                key={inventario.IdInventario} // Aquí es importante usar un valor único como la clave
                                onClick={() => handleRowClick(inventario)}
                                style={{
                                    backgroundColor: selectedRow === inventario ? '#e0f7fa' : 'transparent',
                                    cursor: 'pointer',
                                }}
                            >
                                <Td>{inventario.IdInventario}</Td>
                                <Td>{inventario.IdProducto}</Td>
                                <Td>{inventario.Cantidad}</Td>
                                <Td>{inventario.Fecha}</Td>
                            </Tr>
                        ))}
                    </tbody>
                </Tabla>
            </TablaVentas>
            <Pagination>
                <Tooltip title="Anterior página">
                    <button disabled={currentPage === 1} onClick={prevPage}><GrPrevious /></button>
                </Tooltip>
                <span>Página {currentPage} de {totalPages}</span>
                <Tooltip title="Siguiente página">
                    <button disabled={currentPage === totalPages || totalPages === 0} onClick={nextPage}><GrNext /></button>
                </Tooltip>
            </Pagination>
            <AddInventoryModal 
                OpenModalAdd={OpenModalAdd} 
                addInventario={addInventario} 
                toggleModalAdd={toggleModalAdd}
            />
            <GetInventoryModal 
                Inventario={Inventario} 
                OpenModalGet={OpenModalGet} 
                toggleModalGet={toggleModalGet}
            />
            <EditInventoryModal 
                Inventario={Inventario} 
                OpenModalEdit={OpenModalEdit} 
                editInventario={editInventario} 
                toggleModalEdit={toggleModalEdit}
            />
            <DeleteInventoryModal 
                InventarioId={Inventario?.IdInventario} 
                OpenModalDelete={OpenModalDelete} 
                deleteInventario={deleteInventario} 
                toggleModalDelete={toggleModalDelete}
            />
        </>
    );
}