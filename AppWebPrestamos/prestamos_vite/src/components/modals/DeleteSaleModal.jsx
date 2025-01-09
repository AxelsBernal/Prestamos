import { ModalContainer,Modal,ModalContent } from "../styled/Modals";
import { Titulo } from "../styled/Texts";
import { ContentButton,ButtonIconClose,ButtonIconDelete } from "../styled/Buttons";
import { AlertaAdvertencia } from "../styled/Notifications";

import { MdDelete } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";

import { Tooltip } from "@mui/material";

export default function DeleteSaleModal ({ VentaId,deleteVenta,OpenModalDelete,toggleModalDelete }){
    
    const handleDeleteVenta = (Id) => {
        deleteVenta(Id)
        toggleModalDelete();
        AlertaAdvertencia(`${Id} eliminada de forma correcta`)
    }

    if (!OpenModalDelete || !VentaId) return null;

    return(
        <ModalContainer>
            {OpenModalDelete && (
                <Modal>
                    <ModalContent>
                        <Titulo>¿Esta seguro?</Titulo>
                        <p>Eliminaras la venta {VentaId}</p>
                        <ContentButton>
                            <Tooltip title='Cerrar'>
                                <ButtonIconClose onClick={toggleModalDelete}><IoIosCloseCircleOutline/></ButtonIconClose>
                            </Tooltip>
                            <Tooltip title='Eliminar venta'>
                                <ButtonIconDelete onClick={() => handleDeleteVenta(VentaId)}><MdDelete/></ButtonIconDelete>
                            </Tooltip>
                        </ContentButton>
                    </ModalContent>
                </Modal>
            )}
        </ModalContainer>
    );
};