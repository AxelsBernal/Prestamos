import { useState, useEffect } from "react";
import { ModalContainer, Modal, ModalContent } from "../styled/Modals";
import { Form, Input, InputList, InputGroup, InputGroupList, Label, Select } from "../styled/Forms";
import { DropdownListInput, LiInput } from "../styled/Lists";
import { Titulo } from "../styled/Texts";
import { ButtonIconClose, ButtonIconAdd, ContentButton } from "../styled/Buttons";
import { AlertaCorrecto, AlertaIncorrecto } from "../styled/Notifications";

import { MdEdit } from "react-icons/md";
import { IoIosCloseCircleOutline, IoMdSave } from "react-icons/io";

import { Tooltip } from "@mui/material";

export default function EditInventoryModal({ Productos, Inventario, OpenModalEdit, editInventario, toggleModalEdit }) {
  const [editedInventario, setEditedInventario] = useState({
    ...Inventario,
    Productos: Inventario?.Productos || [],
  });

  useEffect(() => {
    if (OpenModalEdit) {
      setEditedInventario({
        ...Inventario,
        Productos: Inventario.Productos || [],
      });
    }
  }, [OpenModalEdit]);

  const handleEditChange = (e, index = null, field = null) => {
    const { name, value } = e.target;

    if (index !== null && field !== null) {
      const updatedProductos = [...editedInventario.Productos];
      updatedProductos[index][field] = value;

      if (field === "IdProducto") {
        const Producto = Productos.find(producto => producto.id == value);
        updatedProductos[index].Nombre = Producto?.nombre || '';
      }

      setEditedInventario({
        ...editedInventario,
        Productos: updatedProductos,
      });
    } else {
      setEditedInventario({
        ...editedInventario,
        [name]: value,
      });
    }
  };

  const handleSaveEdit = () => {
    if (editedInventario.Productos.length === 0) {
      AlertaIncorrecto('¡ Ingresar al menos un producto !');
      return;
    }

    const productoSinId = editedInventario.Productos.some(producto => !producto.IdProducto || producto.IdProducto === "");

    if (productoSinId) {
      AlertaIncorrecto('¡ Todos los productos deben tener un ID seleccionado !');
      return;
    }

    if (!editedInventario.Fecha || editedInventario.Fecha === "") {
      AlertaIncorrecto('¡ Ingresar la fecha !');
      return;
    } else {
      const formatoFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;

      if (!formatoFecha.test(editedInventario.Fecha)) {
        AlertaIncorrecto('¡ Fecha incorrecta ! Debe ser DD/MM/AAAA');
        return;
      }
    }

    editInventario(editedInventario);

    AlertaCorrecto('Inventario editado correctamente');
    toggleModalEdit();
  };

  const handleCancelEdit = () => {
    setEditedInventario({
      ...Inventario,
      Productos: Inventario?.Productos || [],
    });
    toggleModalEdit();
  };

  if (!OpenModalEdit) return null;

  return (
    <ModalContainer>
      {OpenModalEdit && (
        <Modal>
          <ModalContent>
            <Titulo>Editar Inventario</Titulo>
            <Form>
              <InputGroup>
                <Label>ID Inventario</Label>
                <Input
                  type="text"
                  name="IdInventario"
                  value={editedInventario.IdInventario}
                  onChange={handleEditChange}
                  disabled
                />
              </InputGroup>

              <DropdownListInput>
                {editedInventario.Productos.map((producto, index) => (
                  <LiInput key={index}>
                    <InputGroup>
                      <Label>ID Producto</Label>
                      <Select
                        type="text"
                        name="IdProducto"
                        value={producto.IdProducto}
                        onChange={(e) => handleEditChange(e, index, "IdProducto")}
                      >
                        <option value="">Seleccione un producto</option>
                        {Productos.map((producto) => (
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
                          type="text"
                          name="Nombre"
                          value={producto.Nombre}
                          onChange={(e) => handleEditChange(e, index, "Nombre")}
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
                  value={editedInventario.Cantidad}
                  onChange={handleEditChange}
                />
              </InputGroup>

              <InputGroup>
                <Label>Fecha</Label>
                <Input
                  type="text"
                  name="Fecha"
                  value={editedInventario.Fecha}
                  onChange={handleEditChange}
                  placeholder="Ingresar la fecha (DD/MM/AAAA)"
                />
              </InputGroup>
            </Form>

            <ContentButton>
              <Tooltip title="Cancelar">
                <ButtonIconClose onClick={handleCancelEdit}>
                  <IoIosCloseCircleOutline />
                </ButtonIconClose>
              </Tooltip>
              <Tooltip title="Guardar inventario">
                <ButtonIconAdd onClick={handleSaveEdit}>
                  <IoMdSave />
                </ButtonIconAdd>
              </Tooltip>
            </ContentButton>
          </ModalContent>
        </Modal>
      )}
    </ModalContainer>
  );
}