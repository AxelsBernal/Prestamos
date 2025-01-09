import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

export default function AddProductModal({ open, onClose, onAddProduct, nextId }) {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [errors, setErrors] = useState({
    productName: "",
    productPrice: "",
    productImage: "",
  });

  const handleAddProduct = () => {
    let hasError = false;
    const newErrors = { productName: "", productPrice: "", productImage: "" };

    // Validación de nombre del producto
    if (!productName) {
      newErrors.productName = "El nombre del producto es obligatorio.";
      hasError = true;
    }

    // Validación de precio del producto
    if (!productPrice) {
      newErrors.productPrice = "El precio del producto es obligatorio.";
      hasError = true;
    } else if (isNaN(productPrice)) {
      newErrors.productPrice = "El precio debe ser un número.";
      hasError = true;
    }

    /* Validación de URL de la imagen
    if (!productImage) {
      newErrors.productImage = "La URL de la imagen es obligatoria.";
      hasError = true;
    } else if (!/^https?:\/\/.+\..+/.test(productImage)) {
      newErrors.productImage = "La URL de la imagen no es válida.";
      hasError = true;
    } */

    setErrors(newErrors);

    if (!hasError) {
      onAddProduct({
        id: nextId,
        nombre: productName,
        precio: productPrice,
        urlImagen: productImage,
      });

      setProductName(""); // Limpia el campo de nombre
      setProductPrice(""); // Limpia el campo de precio
      setProductImage(""); // Limpia el campo de URL

      // Mostrar el mensaje de éxito
      setSuccessMessage(true);

      // Ocultar el mensaje después de 1.5 segundos
      setTimeout(() => {
        setSuccessMessage(false);
        onClose(); // Cierra el modal automáticamente
      }, 1500);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" marginBottom={2}>
          Agregar Nuevo Producto
        </Typography>

        {/* Mensaje de éxito */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Producto agregado exitosamente
          </Alert>
        )}

        <TextField
          label="ID"
          value={nextId}
          fullWidth
          disabled
          margin="normal"
        />
        <TextField
          label="Nombre del Producto"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.productName}
          helperText={errors.productName} // Muestra el error debajo del campo
        />
        <TextField
          label="Precio del Producto"
          value={productPrice}
          onChange={(e) => {
            // Permitir solo números y borrar
            const value = e.target.value.replace(/[^0-9]/g, "");
            setProductPrice(value);
          }}
          fullWidth
          margin="normal"
          error={!!errors.productPrice}
          helperText={errors.productPrice} // Muestra el error debajo del campo
        />
        <TextField
          label="URL de la Imagen"
          value={productImage}
          onChange={(e) => setProductImage(e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.productImage}
          helperText={errors.productImage} // Muestra el error debajo del campo
        />
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} style={{ marginRight: "10px" }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
          >
            Agregar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
