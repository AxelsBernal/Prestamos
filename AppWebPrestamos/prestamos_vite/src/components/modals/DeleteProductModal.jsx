import React, { useState } from "react";
import {
  Modal,
  Box,
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
  textAlign: "center",
};

export default function DeleteProductModal({ open, onClose, onDeleteProduct, product }) {
  const [successMessage, setSuccessMessage] = useState(false); // Estado para el mensaje de éxito

  const handleDeleteProduct = () => {
    onDeleteProduct(product.id); // Llama la función de eliminación en el componente padre

    // Mostrar mensaje de éxito
    setSuccessMessage(true);

    // Ocultar mensaje y cerrar modal después de 3 segundos
    setTimeout(() => {
      setSuccessMessage(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {successMessage ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Producto eliminado exitosamente
          </Alert>
        ) : (
          <>
            <Typography variant="h6" component="h2" marginBottom={2}>
              ¿Estás seguro de eliminar este producto?
            </Typography>
            <Typography variant="body1" marginBottom={2}>
              ID: {product?.id || "N/A"} - {product?.nombre || "N/A"}
            </Typography>
            <Box mt={3} display="flex" justifyContent="center">
              <Button
                onClick={onClose}
                variant="outlined"
                color="primary"
                style={{ marginRight: "10px" }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteProduct}
                variant="contained"
                color="error"
              >
                Eliminar
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
