import { useState,useEffect } from "react";

import { ModalContainer,Modal,ModalContent } from "../styled/Modals";
import { Form,Input,InputList,InputGroup,InputGroupList,Label,Select } from "../styled/Forms";
import { DropdownListInput,LiInput } from "../styled/Lists";
import { Titulo } from "../styled/Texts";
import { ButtonIconClose,ButtonIconAdd,ButtonIconDelete,ContentButton } from "../styled/Buttons";
import { AlertaInformacion,AlertaCorrecto,AlertaAdvertencia,AlertaIncorrecto } from "../styled/Notifications";

import { MdDelete } from "react-icons/md";
import { IoMdAddCircleOutline,IoIosCloseCircleOutline,IoMdSave } from "react-icons/io";

import { Tooltip } from "@mui/material";

export default function AddSaleModal ({ ID,Productos,OpenModalAdd,addVenta,toggleModalAdd }){

    const [venta,setVenta] = useState({
        IdVenta: `V-CDP-${ID.toString().padStart(4, "0")}`,
        TipoDePago: '',
        Fecha: '',
        Hora: '',
        Productos: [
            {
                IdProducto: '',
                Nombre: '',
                Cantidad: 0,
                PrecioUnitario: 0
            }
        ],
        MontoTotal: 0
    });

    useEffect(() => {
        setVenta((prevVenta) => ({
            ...prevVenta,
            IdVenta: `V-CDP-${ID.toString().padStart(4, "0")}`
        }));
    }, [ID]);

    const addProducto = () => {
        const newProducto = {
            IdProducto: '',
            Nombre: '',
            Cantidad: 0,
            PrecioUnitario: 0,
        };
        setVenta({
            ...venta,
            Productos: [...venta.Productos, newProducto],
        });

        AlertaInformacion('Nuevo producto');
    };
    const deleteProducto = (index) => {
        const updatedProductos = [...venta.Productos];
        updatedProductos.splice(index, 1);
        setVenta({
            ...venta,
            Productos: updatedProductos,
        });

        AlertaAdvertencia('Producto eliminado');
    };
    
    const handleChange = (e, index = null, field = null) => {
        const { name, value } = e.target;

        if (index !== null && field) {
            const updatedProductos = [...venta.Productos];
            updatedProductos[index][field] = value;

            if (field === 'IdProducto') {
                const Producto = Productos.find(producto => producto.id == value);
                updatedProductos[index].Nombre = Producto?.nombre || '';
                updatedProductos[index].PrecioUnitario = Producto?.precio || 0;
            }

            const nuevoMontoTotal = updatedProductos.reduce((total, producto) => {
                return total + producto.Cantidad * producto.PrecioUnitario;
            }, 0);

            setVenta({
                ...venta,
                Productos: updatedProductos,
                MontoTotal: nuevoMontoTotal
            });
        } else {
            setVenta({
                ...venta,
                [name]: value,
            });
        }
    };

    const handleSaveAdd = (venta) => {

        if (!venta.TipoDePago || venta.TipoDePago === "") {
            AlertaIncorrecto('¡ Seleccionar un tipo de pago !')
            return;
        }

        if (!venta.Fecha || venta.Fecha === "") {
            AlertaIncorrecto('¡ Ingresar la fecha !')
            return;
        }else{
            const formatoFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;

            if (!formatoFecha.test(venta.Fecha)) {
                AlertaIncorrecto('¡ Fecha incorrecta ! Debe ser DD/MM/AAAA');
                return;
            }
        }

        if (!venta.Hora || venta.Hora === "") {
            AlertaIncorrecto('¡ Ingresar la hora !')
            return;
        } else {
            const formatoHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
        
            if (!formatoHora.test(venta.Hora)) {
                AlertaIncorrecto('¡ Hora incorrecta ! Debe ser HH:mm (24 horas)');
                return;
            }
        }
        
        if (venta.Productos.length === 0) {
            AlertaIncorrecto('¡ Ingresar al menos un producto !');
            return;
        }

        const productoSinId = venta.Productos.some(producto => !producto.IdProducto || producto.IdProducto === "");
        const productoSinCantidad = venta.Productos.some(producto => !producto.Cantidad || producto.Cantidad === 0);

        if (productoSinId) {
            AlertaIncorrecto('¡ Todos los productos deben tener un ID seleccionado !');
            return;
        }

        if(productoSinCantidad){
            AlertaIncorrecto('¡ Todos los productos deben tener una cantidad mayor a 0 !')
            return;
        }
        
        addVenta(venta)
        setVenta({
            IdVenta: `V-CDP-${ID.toString().padStart(4, "0")}`,
            TipoDePago: '',
            Fecha: '',
            Hora: '',
            Productos: [
                {
                    IdProducto: '',
                    Nombre: '',
                    Cantidad: 0,
                    PrecioUnitario: 0
                }
            ],
            MontoTotal: 0
        });
        
        AlertaCorrecto('Venta agregada de forma correcta');

        toggleModalAdd();
    }

    const handleCancelAdd = () => {
        setVenta({
            IdVenta: `V-CDP-${ID.toString().padStart(4, "0")}`,
            TipoDePago: '',
            Fecha: '',
            Hora: '',
            Productos: [
                {
                    IdProducto: '',
                    Nombre: '',
                    Cantidad: 0,
                    PrecioUnitario: 0
                }
            ],
            MontoTotal: 0
        });
        toggleModalAdd();
    }

    if (!OpenModalAdd) return null;
    
    return(
        <>
            <ModalContainer>
                {OpenModalAdd && (
                    <Modal>
                        <ModalContent>
                            <Titulo>Agregar venta</Titulo>
                            <Form>
                                <InputGroup>
                                    <Label>ID Venta</Label>
                                    <Input
                                        type="text"
                                        name="IdVenta"
                                        value={venta.IdVenta}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label>Tipo de pago</Label>
                                    <Select
                                        type='text'
                                        name="TipoDePago"
                                        value={venta.TipoDePago}
                                        onChange={handleChange}
                                    >
                                        <option value=''>Seleccione el tipo de pago</option>
                                        <option value='Efectivo'>Efectivo</option>
                                        <option value='Tarjeta'>Tarjeta</option>
                                    </Select>
                                </InputGroup>
                                <InputGroup>
                                    <Label>Fecha</Label>
                                    <Input
                                        type="text"
                                        name="Fecha"
                                        value={venta.Fecha}
                                        onChange={handleChange}
                                        placeholder="Ingresar la fecha (DD/MM/AAAA)"
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label>Hora</Label>
                                    <Input
                                        type="text"
                                        name="Hora"
                                        value={venta.Hora}
                                        onChange={handleChange}
                                        placeholder="Ingresar la hora (HH:mm)"
                                    />
                                </InputGroup>
                                <DropdownListInput>
                                    {venta.Productos.map((producto, index) => (
                                        <LiInput key={index}>
                                            <InputGroup>
                                                <Label>ID Producto</Label>
                                                <Select
                                                    type='text'
                                                    name='IdProducto'
                                                    value={producto.IdProducto}
                                                    onChange={(e) => handleChange(e, index, 'IdProducto')}
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
                                                        value={producto.Nombre}
                                                        onChange={(e) => handleChange(e, index, 'Nombre')}
                                                        placeholder="..."
                                                        disabled
                                                    />
                                                </InputGroupList>
                                                <InputGroupList>
                                                    <Label>Cantidad</Label>
                                                    <InputList
                                                        type='number'
                                                        name='Cantidad'
                                                        value={producto.Cantidad}
                                                        onChange={(e) => handleChange(e, index, 'Cantidad')}
                                                        placeholder="Ingresar cantidad"
                                                    />
                                                </InputGroupList>
                                                <InputGroupList>
                                                    <Label>Precio unitario</Label>
                                                    <InputList
                                                        type='number'
                                                        name='PrecioUnitario'
                                                        value={producto.PrecioUnitario}
                                                        onChange={(e) => handleChange(e, index, 'PrecioUnitario')}
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
                                        type="text"
                                        name="MontoTotal"
                                        value={venta.MontoTotal}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </InputGroup>
                            </Form>
                            <ContentButton>
                                <Tooltip title='Cancelar'>
                                    <ButtonIconClose onClick={handleCancelAdd}><IoIosCloseCircleOutline/></ButtonIconClose>
                                </Tooltip>
                                <Tooltip title='Guardar venta'>
                                    <ButtonIconAdd onClick={() => handleSaveAdd(venta)}><IoMdSave/></ButtonIconAdd>
                                </Tooltip>
                            </ContentButton>
                        </ModalContent>
                    </Modal>
                )}
            </ModalContainer>
        </>
    );
};