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
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedSalidaID, setSelectedSalidaID] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [buttonRef, setButtonRef] = useState(null);
  const { data, loading, error, refetch } = useFetchData('http://localhost:3005/HojaSalida2', modelo, marca);

  const handleNumericInput = (event, setter) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  const fetchImages = async (id_salida) => {
    try {
      const response = await Axios.get('http://localhost:3005/getImages2', {
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
      const response = await Axios.get('http://localhost:3005/getImages2', {
        params: { id_salida }
      });
      setImageCountsBySalida(prev => ({ ...prev, [id_salida]: response.data.length }));
    } catch (error) {
      console.error('Error al obtener el número de imágenes:', error);
      setImageCountsBySalida(prev => ({ ...prev, [id_salida]: 0 }));
    }
  };

  const handleUpdate = async () => {
    try {
      await refetch();
      // clearFields(); // No limpiar los campos aquí
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
    setButtonRef(event.currentTarget);
  };

  const handleCloseDialog = () => {
    setOpenImageDialog(false);
    if (buttonRef) {
      buttonRef.focus();
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
      const uniqueSalidas = [...new Set(data.map(salida => salida.id_salida))];
      uniqueSalidas.forEach(id_salida => {
        fetchImageCount(id_salida);
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
            onChange={(event) => handleNumericInput(event, setModelo)}
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
            onChange={(event) => handleNumericInput(event, setMarca)}
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
                      Salida: {salida.id_salida}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Responsable:</strong> {salida.nombres_responsable} {salida.apellidos_responsable} <br />
                      <strong>Cédula:</strong> {salida.cedula_responsable} <br />
                      <strong>Fecha de Salida:</strong> {salida.fecha_hora_salida}<br />
                      <strong>Equipo:</strong> {salida.nombre_equipo} ({salida.marca_equipo})<br />
                      <strong>Modelo:</strong> {salida.modelo_equipo}<br />
                      <strong>Serie:</strong> {salida.serie_equipo}<br />
                      <strong>Destino:</strong> {salida.nombre_destino}<br />
                      <strong>Motivo de salida:</strong> {salida.motivo_salida}<br />
                      <strong>Autorizado por:</strong> {salida.nombres_autoriza} {salida.apellidos_autoriza}<br />
                      <strong>Celular:</strong> {salida.celular_autoriza}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={(event) => handleViewImages(salida.id_salida, event)}
                    >
                      Ver imágenes ({imageCountsBySalida[salida.id_salida] || 0})
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Grid>

      {/* Código del diálogo para mostrar las imágenes */}
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
