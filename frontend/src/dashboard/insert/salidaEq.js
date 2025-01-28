import React, { useState, useRef } from 'react';
import axios from 'axios'; // Importa Axios
import { Box, Paper, TextField, Button } from '@mui/material';
import './EditableTable.css'; // Importa el archivo CSS
import MessageSnackbar from './MessageSnackbar';
import Typography from '@mui/material/Typography';



const EditableTable = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  const [rows, setRows] = useState([]);

  const [responsable, setResponsable] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    celular: ''
  });
  const [autoriza, setAutoriza] = useState({
    nombres: '',
    apellidos: '',
    celular: ''
  });

  const [motivo, setMotivo] =useState('');

  // Refs para los inputs de archivo
  const fileInputRefs = useRef([]);

  const handleChange = (e, rowIndex, colName) => {
    const updatedRows = [...rows];
    const value = e.target.value;
  
    // Validación para campo de cantidad (col6)
    if (colName === 'col6' && (!/^\d*$/.test(value) || parseInt(value) < 0)) {
      return; // Solo números enteros positivos
    }
  
    // Si se cambia la columna 4 (serie) y no está vacía, asigna 1 a la columna 6 (cantidad) y desactiva la edición
    if (colName === 'col4') {
      if (value.trim() !== '') {
        updatedRows[rowIndex].col6 = '1'; // Establece automáticamente el valor de col6
      } else {
        updatedRows[rowIndex].col6 = ''; // Limpia col6 si col4 está vacío
      }
    } else if (colName === 'col6' && updatedRows[rowIndex].col4.trim() !== '') {
      // Si la columna 4 (serie) no está vacía, no permite modificar col6
      return;
    }
  
    updatedRows[rowIndex][colName] = value;
    setRows(updatedRows);
  };
  

  const handleAddRow = () => {
    setRows([...rows, { col1: '', col2: '', col3: '', col4: '', col5: '', col6: '', col7: '', photos: [] }]);
  };

  const handleRemoveRow = (rowIndex) => {
    const updatedRows = rows.filter((_, index) => index !== rowIndex);
    setRows(updatedRows);
  };

  const handlePhotoChange = (e, rowIndex) => {
    const files = Array.from(e.target.files);
    const updatedRows = [...rows];
    updatedRows[rowIndex].photos = [...updatedRows[rowIndex].photos, ...files];
    setRows(updatedRows);
    // Resetear el input de archivo
    if (fileInputRefs.current[rowIndex]) {
      fileInputRefs.current[rowIndex].value = null;
    }
  };

  const handleRemovePhoto = (rowIndex, photoIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].photos = updatedRows[rowIndex].photos.filter((_, index) => index !== photoIndex);
    setRows(updatedRows);
    // También vacía el input de archivo si no hay más fotos
    if (updatedRows[rowIndex].photos.length === 0 && fileInputRefs.current[rowIndex]) {
      fileInputRefs.current[rowIndex].value = null;
    }
  };

  const handleDuplicateRow = (rowIndex) => {
    const rowToDuplicate = rows[rowIndex];
    const newRow = {
      ...rowToDuplicate,
      col4: '', // Excluir serie
      col5: rowToDuplicate.col5, // Incluir descripción
      //col7: '', // Excluir destino
      photos: [] // Excluir fotos
    };
    const updatedRows = [...rows];
    updatedRows.splice(rowIndex + 1, 0, newRow); // Insertar la fila duplicada justo después de la fila original
    setRows(updatedRows);
  };

  const handleResponsableChange =async (e) => {
    const { name, value } = e.target;

    // Validación para campo de cédula y celular
    if ((name === 'cedula' || name === 'celular') && !/^\d*$/.test(value)) {
      return; // Solo permitir números
    }

    if (name === 'celular' && value.length > 10) {
      return; // Limitar a 10 dígitos
    }

    if (name === 'cedula' && value.length > 10) {
      return; // Limitar a 10 dígitos
    }

    setResponsable(prevState => ({
      ...prevState,
      [name]: value
    }));    
  
    // Si el campo modificado es la cédula, buscar los datos del responsable
    if (name === 'cedula' && value.length === 10) {
      try {
        const response = await axios.post('http://192.168.110.53:3015/obtenerResponsable', {
          cedula: value
        });
        const { nombres, apellidos, telefono } = response.data;
        setResponsable(prevState => ({
          ...prevState,
          nombres: nombres || '',
          apellidos: apellidos || '',
          celular: telefono || '' // Cambiado a 'celular' para coincidir con el estado
        }));
      } catch (error) {
        console.error('Error al buscar responsable', error);
        // Opcional: Manejar error de búsqueda aquí
      }
    }
  };

  const handleAutorizaChange = (e) => {
    const { name, value } = e.target;

    // Validación para campo de celular
    if (name === 'celular' && !/^\d*$/.test(value)) {
      return; // Solo permitir números
    }

    if (name === 'celular' && value.length > 10) {
      return; // Limitar a 10 dígitos
    }

    setAutoriza(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  
  // Función de validación
  // Función de validación
// Función de validación
const validateFields = () => {
  const isResponsableValid = Object.values(responsable).every(value => value.trim() !== '') &&
    responsable.cedula.length === 10 && // Validar longitud de cédula
    (responsable.celular.trim() === '' || responsable.celular.length === 10);

  const isAutorizaValid = Object.values(autoriza).every(value => value.trim() !== '') && autoriza.celular.length === 10;

  const isAnyRowValid = rows.some(row => row.photos.length > 0);

  const uniqueSeries = new Set();

  const areRowsValid = rows.every((row, index) => {
    const isRowValid = row.col1 && row.col5 && row.col6 && row.col7

    if (!isRowValid) {
      console.log(`Fila ${index + 1} no es válida:`, row);
      return false;
    }

    if (row.col4.trim() !== '' && uniqueSeries.has(row.col4)) {
      alert(`Número de Serie Repetido en la fila ${index + 1}.`);
      row.col4 = ''; // Limpiar la serie repetida
      return false;
    }

    uniqueSeries.add(row.col4.trim());

    // Verificar que cada fila tenga al menos una foto
    if (row.photos.length === 0) {
      alert(`Por favor, suba al menos una foto en la fila ${index + 1}.`);
      return false;
    }

    return true;
  });

  if (!isResponsableValid) {
    alert('Por favor, complete todos los campos obligatorios para el responsable y asegúrese de que la cédula tenga 10 dígitos y el celular tenga 10 dígitos si se ingresa.');
    return false;
  }

  if (!isAutorizaValid) {
    alert('Por favor, complete todos los campos obligatorios para la persona que autoriza y asegúrese de que el celular tenga 10 dígitos.');
    return false;
  }

  if (!areRowsValid) {
    alert('Por favor, complete todos los campos obligatorios y asegúrese de no ingresar series repetidas.');
    return false;
  }

  if (!isAnyRowValid) {
    alert('Por favor, suba al menos una foto.');
    return false;
  }

  return true;
};



    // Función para limpiar todos los campos
    const resetFields = () => {
      setResponsable({ cedula: '', nombres: '', apellidos: '', celular: '' });
      setAutoriza({ nombres: '', apellidos: '', celular: '' });      
      //setRows(initialRows);
      // Restablece todas las filas al estado inicial
      setRows([{ col1: '', col2: '', col3: '', col4: '', col5: '', col6: '', col7: '', photos: [] }]);
      setMotivo('');
      setRows([]);
      fileInputRefs.current.forEach(input => {
        if (input) input.value = null;
      });
    };

  // FUNCIONES

  
  const handleSubmit = async () => {
    if (!validateFields()) return;
    try {
      //const motivoSalida = rows[0].col8;
      // Primero, inserta los datos de la salida
      const { data: { idSalida } } = await axios.post('http://192.168.110.53:3015/insertarSalida', {
        cedulaResponsable: responsable.cedula,
        nombresResponsable: responsable.nombres,
        apellidosResponsable: responsable.apellidos,
        celularResponsable: responsable.celular,
        nombresAutoriza: autoriza.nombres,
        apellidosAutoriza: autoriza.apellidos,
        celularAutoriza: autoriza.celular,
        motivoSalida:motivo,
        fechaHoraSalida:new Date().toLocaleString('en-EC', { timeZone: 'America/Guayaquil' }),// Usar la fecha actual como ejemplo
        fechaSalida:new Date()
      });
      //const { idSalida } = response.data; // Obtener el idSalida de la respuesta
      setSnackbarMessage(`Tu código de salida es: ${idSalida}`);
      setSnackbarSeverity('success');
      
  console.log( new Date().toLocaleString('en-EC', { timeZone: 'America/Guayaquil' }));
      // Inserta los detalles del equipo
      await Promise.all(rows.map(async (row) => {
        if (row.col1 && row.col2 && row.col3) { // Asegúrate de que los campos requeridos no estén vacíos
          await axios.post('http://192.168.110.53:3015/insertarSalidaEquipoDetalle', {
            idSalida,
            nombreEquipo: row.col1,
            marcaEquipo: row.col2,
            modeloEquipo: row.col3,
            serieEquipo: row.col4,
            descripcionEquipo: row.col5,
            cantidad: row.col6,
            nombreDestino: row.col7
          });
        }
      }));
  
      // Inserta las fotos
      await Promise.all(rows.map(async (row) => {
        if (row.photos.length > 0) {
          const formData = new FormData();
          formData.append('idSalida', idSalida);
          row.photos.forEach(photo => formData.append('imagenesFotos', photo)); // Ajusta el nombre del campo aquí
  
          await axios.post('http://192.168.110.53:3015/insertarFoto', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }
      }));
  
      alert('Datos guardados con éxito');
      resetFields(); // Limpiar campos después de guardar
    } catch (error) {
      setSnackbarMessage('Error al guardar los datos');
      setSnackbarSeverity('error');

      console.error('Error al enviar los datos', error);
      alert('Error al enviar los datos');
    }
    setOpenSnackbar(true);
  };
  
  const handleCancel = () => {
    resetFields(); // Limpiar campos al cancelar
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box p={2}>
      <Paper elevation={3} style={{ padding: '16px', overflowX: 'auto' }}>
        <table className="editable-table">
          <thead>
            <tr>
              <th>EQUIPO/OBJETO*</th>
              <th>MARCA</th>
              <th>MODELO</th>
              <th>SERIE</th>
              <th>DESCRIP*</th>
              <th>CANTIDAD*</th>
              <th>DESTINO*</th> 
              <th>FOTO</th>
              <th>..TOOL..</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {['col1', 'col2', 'col3', 'col4', 'col5', 'col6', 'col7'].map((col, colIndex) => (
                  <td key={colIndex}>
                    <TextField 
                      value={row[col]} 
                      onChange={(e) => handleChange(e, rowIndex, col)} 
                      fullWidth 
                      className="custom-textfield" 
                      variant="outlined" 
                      disabled={col === 'col6' && row.col4.trim() !== ''}
                    />
                  </td>
                ))}
                <td>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={(e) => handlePhotoChange(e, rowIndex)}
                    ref={el => fileInputRefs.current[rowIndex] = el}
                    style={{ display: 'none' }}
                  />
                  <label 
                    htmlFor={`file-input-${rowIndex}`} 
                    style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                  >
                    (+)
                  </label>
                  <input 
                    id={`file-input-${rowIndex}`} 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={(e) => handlePhotoChange(e, rowIndex)}
                    ref={el => fileInputRefs.current[rowIndex] = el}
                    style={{ display: 'none' }}
                  />
                  <div className="photo-container">
                    {Array.isArray(row.photos) && row.photos.length > 0 ? (
                      row.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="photo-preview">
                          <img src={URL.createObjectURL(photo)} alt={`Imagen ${photoIndex + 1}`} />
                          <button className="remove-photo" onClick={() => handleRemovePhoto(rowIndex, photoIndex)}>×</button>
                        </div>
                      ))
                    ) : (
                      <p>Vacío</p>
                    )}
                  </div>
                </td>
                <td>
                  <Button variant="contained" color="error" onClick={() => handleRemoveRow(rowIndex)} size="small">
                    .x.
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => handleDuplicateRow(rowIndex)} size="small">
                    ++
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button variant="contained" color="success" onClick={handleAddRow} style={{ marginTop: '16px' }}>+</Button>
        <TextField label="Motivo de salida" variant="outlined" fullWidth value={motivo} onChange={(event) => setMotivo(event.target.value)} style={{ marginTop: '16px' }}/>
      </Paper>

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} mt={2}>
        <Paper elevation={3} style={{ padding: '16px', flex: 1 }}>
          <h3>Responsable</h3>
          <Box display="grid" gap={2}>
            <Typography style={{ fontSize: '11px' }} component="h3">
              Para tramaco: 0992066526
            </Typography>
            {['cedula', 'nombres', 'apellidos', 'celular'].map((field, index) => (
              <TextField
                key={index}
                label={field.charAt(0).toUpperCase() + field.slice(1) + (field !== 'celular' ? '*' : '')}
                name={field}
                value={responsable[field]}
                onChange={handleResponsableChange}
                fullWidth
              />
            ))}
          </Box>
        </Paper>

        <Paper elevation={3} style={{ padding: '16px', flex: 1 }}>
          <h3>Autorizador</h3>
          <Box display="grid" gap={2}>
            {['nombres', 'apellidos', 'celular'].map((field, index) => (
              <TextField
                key={index}
                label={field.charAt(0).toUpperCase() + field.slice(1) + '*'}
                name={field}
                value={autoriza[field]}
                onChange={handleAutorizaChange}
                fullWidth
              />
            ))}
          </Box>

          <Box display="flex" justifyContent="center" gap={2} mt={2}>
            <Button 
              variant="contained" 
              color="success" 
              onClick={handleSubmit} 
              style={{ marginTop: '16px', width: '200px' }}
            >
              Guardar
            </Button>
            <MessageSnackbar
              open={openSnackbar}
              handleClose={handleCloseSnackbar}
              message={snackbarMessage}
              severity={snackbarSeverity}
            />
            <Button 
              variant="contained" 
              color="warning" 
              onClick={handleCancel} 
              style={{ marginTop: '16px', width: '200px' }}
            >
              Cancelar
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default EditableTable;


{/*
  src\dashboard\insert\salidaEq.js
  Line 378:27:  Redundant alt attribute. Screen-readers already announce `img` tags as an image. You don’t need to use the words `image`, `photo,` or `picture` (or any specified custom words) in the alt prop  jsx-a11y/img-redundant-alt

  */}