import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const MessageSnackbar = ({ open, handleClose, message, severity }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={9000} // He ajustado la duración a 9000ms por defecto
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Cambio aquí, usé "bottom"
      sx={{
        fontSize: '10rem', // Tamaño de fuente grande
        width: '100%', // Asegúrate de que el Alert use todo el ancho del Snackbar
        textAlign: 'center', // Centra el texto dentro del Alert
        minHeight: '150px', // Alto mínimo del Alert
        display: 'flex', // Usa flexbox para centrar el contenido
        alignItems: 'center', // Centra verticalmente el contenido
        justifyContent: 'center', // Centra horizontalmente el contenido
      }}
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} 
        sx={{ 
          fontSize: '5rem', // Tamaño de fuente grande
          width: '100%', // Asegúrate de que el Alert use todo el ancho del Snackbar
          textAlign: 'center', // Centra el texto dentro del Alert
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MessageSnackbar;
