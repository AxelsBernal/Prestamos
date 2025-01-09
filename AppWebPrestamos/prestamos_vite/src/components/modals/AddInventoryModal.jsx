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

export default function AddInventoryModal({ ID,Productos,OpenModalAdd,addInventario,toggleModalAdd }) {
  
  const [inventario,setInventario] = useState({
    IdVenta: 'I-CDP-${ID.toString().padStart(4, "0")}',
    Productos: [
        {
            IdProducto: '',
            Nombre: '',
        }
    ],
    Cantidad: 0,
    Fecha: '',
});

useEffect(() => {
  setInventario((prevInventario) => ({
      ...prevInventario,
      IdInventario: 'I-CDP-${ID.toString().padStart(4, "0")}'
  }));
}, [ID]);

const handleChange = (e, index = null, field = null) => {
  const { name, value } = e.target;

  if (index !== null && field) {
      const updatedProductos = [...inventario.Productos];
      updatedProductos[index][field] = value;

      if (field === 'IdProducto') {
          const Producto = Productos.find(producto => producto.id == value);
          updatedProductos[index].Nombre = Producto?.nombre || '';
      }

      setInventario({
          ...inventario,
          Productos: updatedProductos
      });
  } else {
      setInventario({
          ...inventario,
          [name]: value,
      });
  }
};

const handleSaveAdd = (inventario) => {

  if (inventario.Productos.length === 0) {
    AlertaIncorrecto('¡ Ingresar al menos un producto !');
    return;
  }

  const productoSinId = inventario.Productos.some(producto => !producto.IdProducto || producto.IdProducto === "");

  if (productoSinId) {
    AlertaIncorrecto('¡ Todos los productos deben tener un ID seleccionado !');
    return;
  }

  if (!inventario.Fecha || inventario.Fecha === "") {
      AlertaIncorrecto('¡ Ingresar la fecha !')
      return;
  }else{
      const formatoFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;

      if (!formatoFecha.test(inventario.Fecha)) {
          AlertaIncorrecto('¡ Fecha incorrecta ! Debe ser DD/MM/AAAA');
          return;
      }
  }

  addInventario(inventario)

  setInventario({
      IdInventario: 'I-CDP-${ID.toString().padStart(4, "0")}',
      IdProducto: '',
      Cantidad: 0,
      Fecha: '',
  });
  
  AlertaCorrecto('Inventario agregado de forma correcta');

  toggleModalAdd();
}

  const handleCancelAdd = () => {
    setInventario({
      IdInventario: 'I-CDP-${(Math.floor(Math.random() * 10000)).toString().padStart(4, "0")}',
      Producto: { IdProducto: "", Nombre: "" },
      Cantidad: 0,
      Fecha: "",
    });
    toggleModalAdd();
  };

  if (!OpenModalAdd) return null;

  return (
    <>
      <ModalContainer>
                {OpenModalAdd && (
                    <Modal>
                        <ModalContent>
                            <Titulo>Agregar inventario</Titulo>
                            <Form>
                                <InputGroup>
                                    <Label>ID Inventario</Label>
                                    <Input
                                        type="text"
                                        name="IdInventario"
                                        value={inventario.IdInventario}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </InputGroup>
                                <DropdownListInput>
                                    {inventario.Productos.map((producto, index) => (
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
                                                        <option key={producto.id} value={producto.id}>
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
                                            </DropdownListInput>
                                        </LiInput>
                                    ))}
                                </DropdownListInput>
                                <InputGroup>
                                    <Label>Cantidad</Label>
                                    <Input
                                        type="text"
                                        name="Cantidad"
                                        value={inventario.Cantidad}
                                        onChange={handleChange}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label>Fecha</Label>
                                    <Input
                                        type="text"
                                        name="Fecha"
                                        value={inventario.Fecha}
                                        onChange={handleChange}
                                        placeholder="Ingresar la fecha (DD/MM/AAAA)"
                                    />
                                </InputGroup>
                            </Form>
                            <ContentButton>
                                <Tooltip title='Cancelar'>
                                    <ButtonIconClose onClick={handleCancelAdd}><IoIosCloseCircleOutline/></ButtonIconClose>
                                </Tooltip>
                                <Tooltip title='Guardar inventario'>
                                    <ButtonIconAdd onClick={() => handleSaveAdd(inventario)}><IoMdSave/></ButtonIconAdd>
                                </Tooltip>
                            </ContentButton>
                        </ModalContent>
                    </Modal>
                )}
            </ModalContainer>
    </>
  );
}