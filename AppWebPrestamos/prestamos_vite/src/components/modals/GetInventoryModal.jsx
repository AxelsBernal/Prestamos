import { ContentButton, ButtonIconClose } from '../styled/Buttons';
import { ModalContainer, Modal, ModalContent } from '../styled/Modals';
import { DropdownList, Li } from '../styled/Lists';
import { Titulo } from '../styled/Texts';

import { Tooltip } from '@mui/material';

import { IoIosCloseCircleOutline } from "react-icons/io";

export default function GetInventoryModal({ Inventario, OpenModalGet, toggleModalGet }) {
    if (!OpenModalGet || !Inventario) return null;

    return (
        <ModalContainer>
            {OpenModalGet && (
            <Modal>
                <ModalContent>
                    <Titulo>{Inventario.IdInventario}</Titulo> 
                    <DropdownList>
                        <Li>Productos:</Li>
                        <DropdownList>
                            {Inventario.Productos.map((producto, index) => (
                                <Li key={index}>
                                    Id producto: {producto.IdProducto}
                                    <DropdownList>
                                        <Li>Nombre: {producto.Nombre}</Li>
                                    </DropdownList>
                                </Li>
                            ))}
                        </DropdownList>
                        <Li>Cantidad: {Inventario.Cantidad}</Li>
                        <Li>Fecha: {Inventario.Fecha}</Li>
                    </DropdownList>
                    <ContentButton>
                        <Tooltip title='Cerrar'>
                            <ButtonIconClose onClick={toggleModalGet}><IoIosCloseCircleOutline/></ButtonIconClose>
                        </Tooltip>
                    </ContentButton>
                </ModalContent>
            </Modal>
            )}
        </ModalContainer>
    );
};