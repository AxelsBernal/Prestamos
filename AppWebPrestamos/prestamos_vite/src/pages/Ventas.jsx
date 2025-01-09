import { useState,useEffect } from "react";

import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { GrView,GrNext,GrPrevious } from "react-icons/gr";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FcSearch } from "react-icons/fc";

import AddSaleModal from "../components/modals/AddSaleModal";
import GetSaleModal from "../components/modals/GetSaleModal";
import EditSaleModal from "../components/modals/EditSaleModal";
import DeleteSaleModal from "../components/modals/DeleteSaleModal";

import { Titulo } from "../components/styled/Texts";
import { ButtonIconBlue,ButtonIconD,ButtonIconE,ButtonIconV,ContentButton,Pagination } from "../components/styled/Buttons";
import { TablaVentas,Tabla,Td,Th,Tr } from "../components/styled/Tables";
import { Tooltip } from "@mui/material";

export default function Ventas({ ID,productos,ventas,addVenta,editVenta,deleteVenta }) {
    
    document.title = "CdP - Ventas";

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const recordsPerPage = 8;

    const filteredRecords = ventas.filter((venta) =>
        Object.values(venta).some((value) =>
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

    const handleRowClick = (venta) => {
        setSelectedRow((prevSelected) => (prevSelected === venta ? null : venta));
    };

    const [OpenModalAdd, setOpenModalAdd] = useState(false);
    const [OpenModalGet, setOpenModalGet] = useState(false);
    const [OpenModalEdit, setOpenModalEdit] = useState(false);
    const [OpenModalDelete, setOpenModalDelete] = useState(false);

    const [Venta, setVenta] = useState(null);
    const [VentaId, setVentaId] = useState(null);

    //INSERTAR
    const toggleModalAdd = () => {
        setOpenModalAdd(!OpenModalAdd);
    };
    //INSERTAR
    //MOSTRAR
    const toggleModalGet = (Venta) => {
        setOpenModalGet(!OpenModalGet);
        setVenta(Venta);
    };
    //MOSTRAR
    //EDITAR
    const toggleModalEdit = (Venta) => {
        setOpenModalEdit(!OpenModalEdit);
        setVenta(Venta);
    };
    //EDITAR
    //ELIMINAR
    const toggleModalDelete = (Id) => {
        setOpenModalDelete(!OpenModalDelete);
        setVentaId(Id);
    };
    //ELIMINAR

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
            <Titulo>Listado de Ventas</Titulo>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <Tooltip title='Agregar venta'>
                    <ButtonIconBlue onClick={toggleModalAdd}><IoMdAddCircleOutline/></ButtonIconBlue>
                </Tooltip>
                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'auto'
                    }}
                >
                    <FcSearch size={24}/>
                </button>
                <Tooltip title='Buscador' placement="right">
                    <input
                        type="text"
                        placeholder="Buscar ventas..."
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
                <Tooltip title='Ver venta'>
                    <ButtonIconV disabled={selectedRow === null} onClick={() => toggleModalGet(selectedRow)}><GrView/></ButtonIconV>
                </Tooltip>
                <Tooltip title='Editar venta'>
                    <ButtonIconE disabled={selectedRow === null} onClick={() => toggleModalEdit(selectedRow)}><MdModeEdit/></ButtonIconE>
                </Tooltip>
                <Tooltip title='Eliminar venta'>
                    <ButtonIconD disabled={selectedRow === null} onClick={() => toggleModalDelete(selectedRow.IdVenta)}><MdDelete/></ButtonIconD>
                </Tooltip>
            </div>
            <TablaVentas id="TablaVentas">
                <Tabla>
                    <thead>
                    <Tr>
                        <Th>ID Venta</Th>
                        <Th>Tipo de Pago</Th>
                        <Th>Fecha</Th>
                        <Th>Hora</Th>
                        <Th>Monto Total</Th>
                    </Tr>
                    </thead>
                    <tbody>
                    {currentRecords.map((venta) => (
                        <Tr
                            key={venta}
                            onClick={() => handleRowClick(venta)}
                            style={{
                                backgroundColor: selectedRow === venta ? '#e0f7fa' : 'transparent',
                                cursor: 'pointer',
                            }}
                        >
                            <Td>{venta.IdVenta}</Td>
                            <Td>{venta.TipoDePago}</Td>
                            <Td>{venta.Fecha}</Td>
                            <Td>{venta.Hora}</Td>
                            <Td>{venta.MontoTotal}</Td>
                        </Tr>
                    ))}
                    </tbody>
                </Tabla>
            </TablaVentas>
            <Pagination>
                <Tooltip title='Anterior página'>
                    <button disabled={currentPage === 1} onClick={prevPage}><GrPrevious/></button>
                </Tooltip>
                <span>Página {currentPage} de {totalPages}</span>
                <Tooltip title='Siguiente página'>
                    <button disabled={currentPage === totalPages || totalPages === 0} onClick={nextPage}><GrNext/></button>
                </Tooltip>
            </Pagination> 
            <AddSaleModal 
                ID={ID}
                Ventas={ventas}
                Productos={productos}
                OpenModalAdd={OpenModalAdd} 
                addVenta={addVenta} 
                toggleModalAdd={toggleModalAdd}
            />
            <GetSaleModal 
                Venta={Venta} 
                OpenModalGet={OpenModalGet} 
                toggleModalGet={toggleModalGet}
            />
            <EditSaleModal 
                Productos={productos}
                Venta={Venta} 
                OpenModalEdit={OpenModalEdit}
                editVenta={editVenta}
                toggleModalEdit={toggleModalEdit}
            />
            <DeleteSaleModal 
                VentaId={VentaId} 
                deleteVenta={deleteVenta}
                OpenModalDelete={OpenModalDelete}  
                toggleModalDelete={toggleModalDelete} 
            />
        </>       
    );
}