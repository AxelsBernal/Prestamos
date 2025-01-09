import React, { useState, useEffect } from "react";
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

export default function EditProductModal({ open, onClose, onEditProduct, product }) {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [errors, setErrors] = useState({
    productName: "",
    productPrice: "",
    productImage: "",
  });

  useEffect(() => {
    if (product) {
      setProductName(product.nombre || "");
      setProductPrice(product.precio || "");
      setProductImage(product.urlImagen || "");
    }
  }, [product]);

  const handleEditProduct = () => {
    let hasError = false;
    const newErrors = { productName: "", productPrice: "", productImage: "" };

    // Validación del nombre del producto
    if (!productName) {
      newErrors.productName = "El nombre del producto es obligatorio.";
      hasError = true;
    }

    // Validación del precio del producto
    if (!productPrice) {
      newErrors.productPrice = "El precio del producto es obligatorio.";
      hasError = true;
    } else if (isNaN(productPrice)) {
      newErrors.productPrice = "El precio debe ser un número.";
      hasError = true;
    }
 
    /*Validación de URL de la imagen
    if (!productImage) {
      newErrors.productImage = "La URL de la imagen es obligatoria.";
      hasError = true;
    } else if (!/^https?:\/\/.+\..+/.test(productImage)) {
      newErrors.productImage = "La URL de la imagen no es válida.";
      hasError = true;
    } */

    setErrors(newErrors);

    if (!hasError) {
      onEditProduct({
        ...product,
        nombre: productName,
        precio: productPrice,
        urlImagen: productImage,
      });

      // Mostrar mensaje de éxito
      setSuccessMessage(true);

      // Ocultar mensaje después de 3 segundos
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
          Editar Producto
        </Typography>

        {/* Mensaje de éxito */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Actualización exitosa
          </Alert>
        )}

        <TextField
          label="ID"
          value={product?.id || ""}
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
          helperText={errors.productName} // Muestra error debajo del campo
        />
        <TextField
          label="Precio del Producto"
          value={productPrice}
          onChange={(e) => {
            // Solo permite números
            const value = e.target.value.replace(/[^0-9]/g, "");
            setProductPrice(value);
          }}
          fullWidth
          margin="normal"
          error={!!errors.productPrice}
          helperText={errors.productPrice} // Muestra error debajo del campo
        />
        <TextField
          label="URL de la Imagen"
          value={productImage}
          onChange={(e) => setProductImage(e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.productImage}
          helperText={errors.productImage} // Muestra error debajo del campo
        />
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} style={{ marginRight: "10px" }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditProduct}
          >
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
