import {
  Button, Grid, TextField, Paper, Dialog, DialogContent, IconButton, Card, CardContent,
  Typography, CardActions, CardMedia
} from '@mui/material';
import { Close as CloseIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import useFetchData from './useFetchData2';
import RefreshIcon from '@mui/icons-material/Refresh';
import Axios from 'axios';

function AF() {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [imagesBySalida, setImagesBySalida] = useState({});
  const [imageCountsBySalida, setImageCountsBySalida] = useState({});
  //const [currentIndexBySalida, setCurrentIndexBySalida] = useState({});
  //const [selectedImage, setSelectedImage] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedSalidaID, setSelectedSalidaID] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [buttonRef, setButtonRef] = useState(null); // Nuevo estado para el botón
  const { data, loading, error, refetch } = useFetchData('http://192.168.110.53:3005/HojaSalida', modelo, marca);

  const handleNumericInput = (event, setter, otherSetter) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setter(value);
      otherSetter('');
    }
  };

  const fetchImages = async (id_salida) => {
    try {
      const response = await Axios.get('http://192.168.110.53:3005/getImages', {
        params: { id_salida }
      });
      if (response.data && response.data.length > 0) {
        setImagesBySalida(prev => ({ ...prev, [id_salida]: response.data }));
        setCurrentImageIndex(0);
      } else {
        setImagesBySalida(prev => ({ ...prev, [id_salida]: [] }));
      }
    } catch (error) {
      console.error('Error al obtener las imágenes:', error);
      setImagesBySalida(prev => ({ ...prev, [id_salida]: [] }));
    }
  };

  const fetchImageCount = async (id_salida) => {
    try {
      const response = await Axios.get('http://192.168.110.53:3005/getImages', {
        params: { id_salida }
      });
      setImageCountsBySalida(prev => ({ ...prev, [id_salida]: response.data.length }));
    } catch (error) {
      console.error('Error al obtener el número de imágenes:', error);
      setImageCountsBySalida(prev => ({ ...prev, [id_salida]: 0 }));
    }
  };

  const clearFields = () => {
    setModelo('');
    setMarca('');
  };

  const handleUpdate = async () => {
    try {
      await refetch();
      clearFields();
      setImagesBySalida({});
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    }
  };

  const handleViewImages = async (id_salida, event) => {
    await fetchImages(id_salida);
    setSelectedSalidaID(id_salida);
    setCurrentImageIndex(0);
    setOpenImageDialog(true);
    setButtonRef(event.currentTarget); // Guardamos referencia al botón
  };

  const handleCloseDialog = () => {
    setOpenImageDialog(false);
    if (buttonRef) {
      buttonRef.focus(); // Devolvemos el foco al botón
    }
  };

  const handleNextImage = () => {
    const images = imagesBySalida[selectedSalidaID];
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };

  const handlePreviousImage = () => {
    const images = imagesBySalida[selectedSalidaID];
    setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (data && data.length > 0) {
      data.forEach(salida => {
        fetchImageCount(salida.ID_SALIDA);
      });
    }
  }, [data]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Paper elevation={3} style={{ padding: '8px' }}
          sx={{
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: '#E1EEF8',
            }
          }}
        >
          <TextField
            label="Código de salida"
            variant="outlined"
            fullWidth
            value={modelo}
            onChange={(event) => handleNumericInput(event, setModelo, setMarca)}
          />
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper elevation={3} style={{ padding: '8px' }}
          sx={{
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: '#E1EEF8',
            }
          }}
        >
          <TextField
            label="Cédula"
            variant="outlined"
            fullWidth
            value={marca}
            onChange={(event) => handleNumericInput(event, setMarca, setModelo)}
          />
        </Paper>
      </Grid>

      <Grid item xs={12} md={1}>
        <Button
          onClick={handleUpdate}
          variant="contained"
          color="primary"
          className="button"
          fullWidth
          startIcon={<RefreshIcon />}
        />
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2} justifyContent="center">
          {loading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : (
            data.map((salida, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{
                  maxWidth: 360,
                  '&:hover': {
                    '& .MuiTypography-root': {
                      fontSize: '1.2rem',
                    },
                  },
                  '& .MuiTypography-root': {
                    transition: 'font-size 0.3s',
                  },
                }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Salida: {salida.ID_SALIDA}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Responsable:</strong> {salida.NOMBRES_RESPONSABLE} {salida.APELLIDOS_RESPONSABLE} <br />
                      <strong>Cedula:</strong>{salida.CEDULA_RESPONSABLE} <br />
                      <strong>Fecha de Salida:</strong> {salida.FECHA_HORA_SALIDA}<br />
                      <strong>Equipo:</strong> {salida.NOMBRE_EQUIPO} ({salida.MARCA_EQUIPO})<br />
                      <strong>Modelo:</strong> {salida.MODELO_EQUIPO}<br />
                      <strong>Serie:</strong> {salida.SERIE_EQUIPO}<br />                      
                      <strong>Destino:</strong> {salida.NOMBRE_DESTINO}<br />
                      <strong>Motivo de salida:</strong> {salida.MOTIVO_SALIDA}<br />
                      <strong>Autorizado por:</strong> {salida.NOMBRES_AUTORIZA} {salida.APELLIDOS_AUTORIZA}<br />
                      <strong>Celular:</strong> {salida.CELULAR_AUTORIZA} 
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={(event) => handleViewImages(salida.ID_SALIDA, event)}
                    >
                      Ver imágenes ({imageCountsBySalida[salida.ID_SALIDA] || 0})
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Grid>

      <Dialog
        open={openImageDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        aria-labelledby="dialog-title"
      >
        <DialogContent>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="Cerrar"
            style={{ position: 'absolute', top: '10px', right: '10px' }}
          >
            <CloseIcon />
          </IconButton>
          {imagesBySalida[selectedSalidaID] && imagesBySalida[selectedSalidaID].length > 0 && (
            <Grid container direction="column" alignItems="center">
              <CardMedia
                component="img"
                image={`data:image/jpeg;base64,${imagesBySalida[selectedSalidaID][currentImageIndex]}`}
                alt={`Imagen ${currentImageIndex + 1}`}
                style={{ maxHeight: '80vh', width: 'auto' }}
              />
              <Typography variant="caption" display="block" align="center">
                Imagen {currentImageIndex + 1} de {imagesBySalida[selectedSalidaID].length}
              </Typography>
              <Grid container justifyContent="space-between">
                <IconButton onClick={handlePreviousImage} aria-label="Imagen anterior">
                  <ArrowBackIcon />
                </IconButton>
                <IconButton onClick={handleNextImage} aria-label="Imagen siguiente">
                  <ArrowForwardIcon />
                </IconButton>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

export default AF;
