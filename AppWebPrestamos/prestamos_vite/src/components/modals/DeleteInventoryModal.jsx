import { ModalContainer, Modal, ModalContent } from "../styled/Modals";
import { Titulo } from "../styled/Texts";
import { ContentButton, ButtonIconClose, ButtonIconDelete } from "../styled/Buttons";
import { AlertaAdvertencia } from "../styled/Notifications";

import { MdDelete } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";

import { Tooltip } from "@mui/material";

export default function DeleteInventoryModal({ InventarioId, deleteInventario, OpenModalDelete, toggleModalDelete }) {
    
    const handleDeleteInventario = (Id) => {
        deleteInventario(Id);
        toggleModalDelete();
        AlertaAdvertencia(`${Id} eliminada de forma correcta`);
    };

    if (!OpenModalDelete || !InventarioId) return null;

    return (
        <ModalContainer>
            {OpenModalDelete && (
                <Modal>
                    <ModalContent>
                        <Titulo>¿Está seguro?</Titulo>
                        <p>Eliminará el inventario {InventarioId}</p>
                        <ContentButton>
                            <Tooltip title="Cerrar">
                                <ButtonIconClose onClick={toggleModalDelete}><IoIosCloseCircleOutline /></ButtonIconClose>
                            </Tooltip>
                            <Tooltip title="Eliminar inventario">
                                <ButtonIconDelete onClick={() => handleDeleteInventario(InventarioId)}><MdDelete /></ButtonIconDelete>
                            </Tooltip>
                        </ContentButton>
                    </ModalContent>
                </Modal>
            )}
        </ModalContainer>
    );
};