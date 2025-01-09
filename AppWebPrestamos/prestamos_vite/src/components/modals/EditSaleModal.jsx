import { ModalContainer,Modal,ModalContent } from "../styled/Modals";
import { Form,Input, InputList,InputGroup,InputGroupList,Select,Label } from "../styled/Forms";
import { DropdownListInput,LiInput } from "../styled/Lists";
import { ContentButton,ButtonIconAdd,ButtonIconDelete,ButtonIconClose } from "../styled/Buttons";
import { Titulo } from "../styled/Texts";
import { AlertaInformacion,AlertaCorrecto,AlertaAdvertencia,AlertaIncorrecto } from "../styled/Notifications";
import { useState,useEffect } from "react";

import { MdDelete,MdEdit } from "react-icons/md";
import { IoMdAddCircleOutline,IoIosCloseCircleOutline } from "react-icons/io";

import { Tooltip } from "@mui/material";

export default function EditSaleModal ({ Productos,Venta,OpenModalEdit,editVenta,toggleModalEdit }){

    const [editedVenta, setEditedVenta] = useState({
        ...Venta,
        Productos: Venta?.Productos || [],
    });
    
    useEffect(() => {
        if (OpenModalEdit) {
            setEditedVenta({ 
                ...Venta,
                Productos: Venta.Productos || [],
            });
        }
    }, [OpenModalEdit]);
    
    const addProducto = () => {
        const newProducto = {
            IdProducto: '',
            Nombre: '',
            Cantidad: 0,
            PrecioUnitario: 0,
        };
        setEditedVenta((prevVenta) => ({
            ...prevVenta,
            Productos: [...prevVenta.Productos, newProducto],
        }));
        
        AlertaInformacion('Nuevo producto');
    };
    const deleteProducto = (index) => {
        const updatedProductos = [...editedVenta.Productos];
        updatedProductos.splice(index, 1);
        setEditedVenta({
            ...editedVenta,
            Productos: updatedProductos,
        });

        AlertaAdvertencia('Producto eliminado');
    };
    const handleEditChange = (e, index = null, field = null) => {
        const { name, value } = e.target;

        if (index !== null && field !== null) {
            if (!editedVenta.Productos) return;
            const updatedProductos = [...editedVenta.Productos || []];
            updatedProductos[index][field] = value;
    
            if (field === 'IdProducto') {
                const Producto = Productos.find(producto => producto.id == value);
                updatedProductos[index].Nombre = Producto?.nombre || '';
                updatedProductos[index].PrecioUnitario = Producto?.precio || 0;
            }

            const nuevoMontoTotal = updatedProductos.reduce((total, producto) => {
                return total + producto.Cantidad * producto.PrecioUnitario;
            }, 0);

            setEditedVenta({
                ...editedVenta,
                Productos: updatedProductos,
                MontoTotal: nuevoMontoTotal,
            });
        } else {
            setEditedVenta({
                ...editedVenta,
                [name]: value,
            });
        }
    };
    const handleSaveEdit = () => {

        if (!editedVenta.TipoDePago || editedVenta.TipoDePago === "") {
            AlertaIncorrecto('¡ Seleccionar un tipo de pago !')
            return;
        }

        if (!editedVenta.Fecha || editedVenta.Fecha === "") {
            AlertaIncorrecto('¡ Ingresar la fecha !')
            return;
        }else{
            const formatoFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;

            if (!formatoFecha.test(editedVenta.Fecha)) {
                AlertaIncorrecto('¡ Fecha incorrecta ! Debe ser DD/MM/AAAA');
                return;
            }
        }

        if (!editedVenta.Hora || editedVenta.Hora === "") {
            AlertaIncorrecto('¡ Ingresar la hora !')
            return;
        } else {
            const formatoHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
        
            if (!formatoHora.test(editedVenta.Hora)) {
                AlertaIncorrecto('¡ Hora incorrecta ! Debe ser HH:mm (24 horas)');
                return;
            }
        }
        
        if (editedVenta.Productos.length === 0) {
            AlertaIncorrecto('¡ Ingresar al menos un producto !');
            return;
        }

        const productoSinId = editedVenta.Productos.some(producto => !producto.IdProducto || producto.IdProducto === "");
        const productoSinCantidad = editedVenta.Productos.some(producto => !producto.Cantidad || producto.Cantidad === 0);

        if (productoSinId) {
            AlertaIncorrecto('¡ Todos los productos deben tener un ID seleccionado !');
            return;
        }

        if(productoSinCantidad){
            AlertaIncorrecto('¡ Todos los productos deben tener una cantidad mayor a 0 !')
            return;
        }

        editVenta(editedVenta);

        AlertaCorrecto('Venta editada de forma correcta');

        toggleModalEdit();
    }
    const handleCancelEdit = () => {
        setEditedVenta({
            ...Venta,
            Productos: Venta?.Productos || [],
        });
        toggleModalEdit();
    }

    if (!OpenModalEdit) return null;

    return(
        <ModalContainer>
            {OpenModalEdit && (
                <Modal>
                    <ModalContent>
                        <Titulo>Editar venta</Titulo>
                        <Form> 
                            <InputGroup>
                                <Label>ID Venta</Label>
                                <Input
                                    type='text'
                                    name='IdVenta'
                                    value={editedVenta.IdVenta || ''}
                                    onChange={handleEditChange}
                                    disabled
                                />    
                            </InputGroup>
                            <InputGroup>
                                <Label>Tipo de pago</Label>
                                <Select
                                    type='text'
                                    name="TipoDePago"
                                    value={editedVenta.TipoDePago || ''}
                                    onChange={handleEditChange}
                                >
                                    <option value=''>Seleccione el tipo de pago</option>
                                    <option value='Efectivo'>Efectivo</option>
                                    <option value='Tarjeta'>Tarjeta</option>
                                </Select>
                            </InputGroup>
                            <InputGroup>
                                <Label>Fecha</Label>
                                <Input
                                    type='text'
                                    name='Fecha'
                                    value={editedVenta.Fecha || ''}
                                    onChange={handleEditChange}
                                    placeholder="Ingresar la fecha (DD/MM/AAAA)"
                                /> 
                            </InputGroup>
                            <InputGroup>
                                <Label>Hora</Label>
                                <Input
                                    type='text'
                                    name='Hora'
                                    value={editedVenta.Hora || ''}
                                    onChange={handleEditChange}
                                    placeholder="Ingresar la hora (24:00)"
                                />
                            </InputGroup>
                            <DropdownListInput>
                                {(editedVenta.Productos || []).map((producto, index) => (
                                    <LiInput key={index}>
                                        <InputGroup>
                                            <Label>ID Producto</Label>
                                            <Select
                                                type='text'
                                                name='IdProducto'
                                                value={producto.IdProducto || ''}
                                                onChange={(e) => handleEditChange(e, index, 'IdProducto')}
                                            >
                                                <option  value="">Seleccione un producto</option>
                                                {Productos.map((producto) =>(
                                                    <option 
                                                        key={producto.id}
                                                        name='IdProducto' 
                                                        value={producto.id}
                                                    >
                                                        {producto.id}
                                                    </option>
                                                ))}
                                            </Select>
                                        </InputGroup>
                                        <DropdownListInput>
                                            <InputGroupList>
                                                <Label>Nombre</Label>
                                                <InputList
                                                    type='text'
                                                    name='Nombre'
                                                    value={producto.Nombre || ''}
                                                    onChange={(e) => handleEditChange(e, index, 'Nombre')}
                                                    placeholder="..."
                                                    disabled
                                                />
                                            </InputGroupList>
                                            <InputGroupList>
                                                <Label>Cantidad</Label>
                                                <InputList
                                                    type='number'
                                                    name='Cantidad'
                                                    value={producto.Cantidad || 0}
                                                    onChange={(e) => handleEditChange(e, index, 'Cantidad')}
                                                    placeholder="Ingresar cantidad"
                                                />
                                            </InputGroupList>
                                            <InputGroupList>
                                                <Label>Precio unitario</Label>
                                                <InputList
                                                    type='number'
                                                    name='PrecioUnitario'
                                                    value={producto.PrecioUnitario || 0}
                                                    onChange={(e) => handleEditChange(e, index, 'PrecioUnitario')}
                                                    disabled
                                                />
                                            </InputGroupList>
                                        </DropdownListInput>
                                        <Tooltip title='Eliminar producto'>
                                            <ButtonIconDelete onClick={() => deleteProducto(index)}><MdDelete/></ButtonIconDelete>
                                        </Tooltip>
                                    </LiInput>
                                ))}
                            </DropdownListInput>
                            <Tooltip title='Agregar producto'>
                                <ButtonIconAdd onClick={addProducto}><IoMdAddCircleOutline/></ButtonIconAdd>
                            </Tooltip>
                            <InputGroup>
                                <Label>Monto total</Label>
                                <Input
                                    type='number'
                                    name='MontoTotal'
                                    value={editedVenta.MontoTotal || 0}
                                    onChange={handleEditChange}
                                    disabled
                                />
                            </InputGroup>
                        </Form>
                        <ContentButton>
                            <Tooltip title='Cancelar'>
                                <ButtonIconClose onClick={handleCancelEdit}><IoIosCloseCircleOutline/></ButtonIconClose>
                            </Tooltip>
                            <Tooltip title='Editar venta'>
                                <ButtonIconAdd onClick={() => handleSaveEdit(editedVenta)}><MdEdit/></ButtonIconAdd>
                            </Tooltip>
                        </ContentButton>
                    </ModalContent>
                </Modal>
            )}    
        </ModalContainer>
    );
};