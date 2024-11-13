import React, { useState, useEffect, useCallback } from 'react';
import { Tooltip,Grid,Paper,Autocomplete,TextField,Container } from '@mui/material';
import Axios from 'axios';

function Dash() {  

  const [comboCadena, setComboCadena] = useState([]);
  const [selectedCadena, setSelectedCadena] = useState('');

  const [comboStore, setComboStore] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');

  const [, setComboPC] = useState([]);
  const [, setSelectedPC] = useState('');  

  const [totalCadenas, setTotalCadenas] = useState(null); // Estado para almacenar el total de cadenas
  const [totalLocales, setTotalLocales] = useState(null);
  const [totalCajas, setTotalCajas] = useState(null);
  const [totalServer, setTotalServer] = useState(null);
  const [totalMinipc, setTotalMinipc] = useState(null);
  const [totalHeladeria, setTotalHeladeria] = useState(null);
  const [totalPosiflex, setTotalPosiflex] = useState(null);
  const [totalAllinOne, setTotalAllinOne] = useState(null);
  const [totalZkteco, setTotalZkateco] = useState(null);
  const [totalPar7200, setTotalPar7200] = useState(null);
  const [totalNcr, setTotalNcr] = useState(null);
  const [totalPar500, setTotalPar500] = useState(null);
  const [totalPar2000, setTotalPar2000] = useState(null);
  const [totalSenor, setTotalSenor] = useState(null);
  const [totalOptiplex, setTotalOptiplex] = useState(null);
  const [totalNuc, setTotalNuc] = useState(null);
  const [totalSrvDell, setTotalSrvDell] = useState(null);
  const [totalSrvLenovo, setTotalSrvLenovo] = useState(null);
  const [totalSrvSupermicro, setTotalSrvSupermicro] = useState(null);
  

  const [showAdditionalGrids, setShowAdditionalGrids] = useState(false); // Estado para manejar la visibilidad de los grids adicionales
  const [showAdditionalGrids2, setShowAdditionalGrids2] = useState(false);
  const [showAdditionalGrids3, setShowAdditionalGrids3] = useState(false);

  const [selectedFiltro, setSelectedFiltro] = useState(null);

  // Manejar el cambio de selección
  const handleFiltroSeleccionado = (event, value) => {
    setSelectedFiltro(value);
  };

  const opcionesFiltro = [
    { id: 1, nombre: 'LOCAL' },
    { id: 2, nombre: 'REGION' },
    { id: 3, nombre: 'PROVINCIA' },
    { id: 4, nombre: 'CIUDAD' },
    { id: 5, nombre: 'CENTRO COMERCIAL' },
  ];

  //COMBO CADENA
  const obtenerComboCadena = useCallback(async () => {
    try {
      const response = await Axios.get("http://192.168.110.53:3006/comboCadena");
      setComboCadena(response.data);
    } catch (error) {
      console.error("Error al obtener las opciones del combo box:", error);
    }
  }, []);

  useEffect(() => {
    obtenerComboCadena();
  }, [obtenerComboCadena]);

  const handleCadenaSeleccionado = async (event, value) => {
    setSelectedCadena(value);    
    
    if (value) {
      obtenerStore(value);      
    }
    setSelectedStore('');        
    setSelectedPC(''); 
    setComboPC([]);
    setComboStore([]);
    
  };

  // COMBO STORE
  const obtenerStore = async (local) => {
    try {
      const response = await Axios.get("http://192.168.110.53:3006/comboStore", { params: { local } });
      setComboStore(response.data);
    } catch (error) {
      console.error("Error al obtener las opciones del combo box:", error);
    }
  };

  const handleStoreSeleccionado = async (event,value,newValue) => {    

    setSelectedStore(value);  
    
    setSelectedPC('');     
  }; 

  // TOTAL CADENAS
  const obtenerTotalCadenas = useCallback(async (local) => {
    try {
      const response = await Axios.get("http://192.168.110.53:3006/FillTotalCadenas", { params: { local } });

      //console.log('CADENAS: ',response.data);
      
      setTotalCadenas(response.data);
      
    } catch (error) {
      console.error("Error al obtener el total de cadenas:", error);
    }
  }, []);

  useEffect(() => {
    obtenerTotalCadenas(selectedCadena);
  }, [obtenerTotalCadenas,selectedCadena]);

  // TOTAL LOCALES
  const obtenerTotalLocales = useCallback(async (local,local2) => {
    try {
      const response = await Axios.get("http://192.168.110.53:3006/FillTotalLocales", { params: { local,local2 } });
      console.log(response.data);
      setTotalLocales(response.data);
    } catch (error) {
      console.error("Error al obtener el total de locales:", error);
    }
  }, []); // No hay dependencias externas en esta función

  useEffect(() => {
    obtenerTotalLocales(selectedCadena,selectedStore);
  }, [obtenerTotalLocales,selectedCadena,selectedStore]);

  // TOTAL SERVIDORES
  const obtenerTotalServer = useCallback(async (local,local2) => {
    try {
      const response = await Axios.get("http://192.168.110.53:3006/FillTotalServer", { params: { local,local2 } });
      console.log(response.data);
      setTotalServer(response.data);
    } catch (error) {
      console.error("Error al obtener el total de locales:", error);
    }
  }, []); // No hay dependencias externas en esta función

  useEffect(() => {
    obtenerTotalServer(selectedCadena,selectedStore);
  }, [obtenerTotalServer,selectedCadena,selectedStore]);


  const obtenerTotalPos = useCallback(async (local,local2) => {
    try {
      const response = await Axios.get("http://192.168.110.53:3006/FillTotalPos", { params: { local,local2 } });
      console.log(response.data);
      setTotalCajas(response.data);
    } catch (error) {
      console.error("Error al obtener el total de locales:", error);
    }
  }, []); // No hay dependencias externas en esta función

  useEffect(() => {
    obtenerTotalPos(selectedCadena,selectedStore);
  }, [obtenerTotalPos,selectedCadena,selectedStore]);

  // TOTAL MINI PC
  const obtenerTotaMinipc = useCallback(async (local,local2) => {
    try {
      const response = await Axios.get("http://192.168.110.53:3006/FillTotalMinipc", { params: { local,local2 } });
      console.log(response.data);
      setTotalMinipc(response.data);
    } catch (error) {
      console.error("Error al obtener el total de Minipc:", error);
    }
  }, []); // No hay dependencias externas en esta función

  useEffect(() => {
    obtenerTotaMinipc(selectedCadena,selectedStore);
  }, [obtenerTotaMinipc,selectedCadena,selectedStore]);  

  // TOTAL HELADERIAS
  const obtenerTotaHeladeria = useCallback(async (local,local2) => {
    try {
      const response = await Axios.get("http://192.168.110.53:3006/FillTotalHeladeria", { params: { local,local2 } });
      console.log(response.data);
      setTotalHeladeria(response.data);
    } catch (error) {
      console.error("Error al obtener el total de Minipc:", error);
    }
  }, []); // No hay dependencias externas en esta función

  useEffect(() => {
    obtenerTotaHeladeria(selectedCadena,selectedStore);
  }, [obtenerTotaHeladeria,selectedCadena,selectedStore]);  


  // TOTAL POSIFLEX
  const obtenerTotalPosiflex = useCallback(async (local,local2) => {
    try {
      const response = await Axios.get("http://192.168.110.53:3006/FillTotalPosiflex", { params: { local,local2 } });
      console.log(response.data);
      setTotalPosiflex(response.data);
    } catch (error) {
      console.error("Error al obtener el total de locales:", error);
    }
  }, []); // No hay dependencias externas en esta función

  useEffect(() => {
    obtenerTotalPosiflex(selectedCadena,selectedStore);
  }, [obtenerTotalPosiflex,selectedCadena,selectedStore]);

  // TOTAL ALL IN ONE
  const obtenerTotalAllinOne = useCallback(async (local,local2) => {
    try {
      const response = await Axios.get("http://192.168.110.53:3006/FillTotalAllinOne", { params: { local,local2 } });
      console.log(response.data);
      setTotalAllinOne(response.data);
    } catch (error) {
      console.error("Error al obtener el total de locales:", error);
    }
  }, []); // No hay dependencias externas en esta función

  useEffect(() => {
    obtenerTotalAllinOne(selectedCadena,selectedStore);
  }, [obtenerTotalAllinOne,selectedCadena,selectedStore]);


  // TOTAL ZKTeco
  const obtenerTotalZKTeco= useCallback(async (local,local2) => {
    try {
      const response = await Axios.get("http://192.168.110.53:3006/FillTotalZKTeco", { params: { local,local2 } });
      console.log(response.data);
      setTotalZkateco(response.data);
    } catch (error) {
      console.error("Error al obtener el total de ZKTeco:", error);
    }
  }, []); // No hay dependencias externas en esta función

  useEffect(() => {
    obtenerTotalZKTeco(selectedCadena,selectedStore);
  }, [obtenerTotalZKTeco,selectedCadena,selectedStore]);

  // TOTAL PAR 7200
  const obtenerTotaPar7200= useCallback(async (local,local2) => {
    try {
      const response = await Axios.get("http://192.168.110.53:3006/FillTotalPar7200", { params: { local,local2 } });
      console.log(response.data);
      setTotalPar7200(response.data);
    } catch (error) {
      console.error("Error al obtener el total de ZKTeco:", error);
    }
  }, []); // No hay dependencias externas en esta función

  useEffect(() => {
    obtenerTotaPar7200(selectedCadena,selectedStore);
  }, [obtenerTotaPar7200,selectedCadena,selectedStore]);

  // TOTAL NCR
  const obtenerTotalNcr= useCallback(async (local,local2) => {
    try {
      const response = await Axios.get("http://192.168.110.53:3006/FillTotalNcr", { params: { local,local2 } });
      console.log(response.data);
      setTotalNcr(response.data);
    } catch (error) {
      console.error("Error al obtener el total de ZKTeco:", error);
    }
  }, []); // No hay dependencias externas en esta función

  useEffect(() => {
    obtenerTotalNcr(selectedCadena,selectedStore);
  }, [obtenerTotalNcr,selectedCadena,selectedStore]);

  // TOTAL PAR 500
  const obtenerTotalPar500= useCallback(async (local,local2) => {
    try {
      const response = await Axios.get("http://192.168.110.53:3006/FillTotalPar500", { params: { local,local2 } });
      console.log(response.data);
      setTotalPar500(response.data);
    } catch (error) {
      console.error("Error al obtener el total de Par500:", error);
    }
  }, []); // No hay dependencias externas en esta función

  useEffect(() => {
    obtenerTotalPar500(selectedCadena,selectedStore);
  }, [obtenerTotalPar500,selectedCadena,selectedStore]);

    // TOTAL PAR 2000
    const obtenerTotalPar2000= useCallback(async (local,local2) => {
      try {
        const response = await Axios.get("http://192.168.110.53:3006/FillTotalPar2000", { params: { local,local2 } });
        console.log(response.data);
        setTotalPar2000(response.data);
      } catch (error) {
        console.error("Error al obtener el total de Par2000:", error);
      }
    }, []); // No hay dependencias externas en esta función
  
    useEffect(() => {
      obtenerTotalPar2000(selectedCadena,selectedStore);
    }, [obtenerTotalPar2000,selectedCadena,selectedStore]);

    // TOTAL SENOR
    const obtenerTotalSenor= useCallback(async (local,local2) => {
      try {
        const response = await Axios.get("http://192.168.110.53:3006/FillTotalSenor", { params: { local,local2 } });
        console.log(response.data);
        setTotalSenor(response.data);
      } catch (error) {
        console.error("Error al obtener el total de Par2000:", error);
      }
    }, []); // No hay dependencias externas en esta función
  
    useEffect(() => {
      obtenerTotalSenor(selectedCadena,selectedStore);
    }, [obtenerTotalSenor,selectedCadena,selectedStore]);

    // TOTAL OPTIPLEX
    const obtenerTotalOptiplex= useCallback(async (local,local2) => {
      try {
        const response = await Axios.get("http://192.168.110.53:3006/FillTotalOptiplex", { params: { local,local2 } });
        console.log(response.data);
        setTotalOptiplex(response.data);
      } catch (error) {
        console.error("Error al obtener el total de Optiplex:", error);
      }
    }, []); // No hay dependencias externas en esta función
  
    useEffect(() => {
      obtenerTotalOptiplex(selectedCadena,selectedStore);
    }, [obtenerTotalOptiplex,selectedCadena,selectedStore]);

    // TOTAL NUC
    const obtenerTotalNuc= useCallback(async (local,local2) => {
      try {
        const response = await Axios.get("http://192.168.110.53:3006/FillTotalNuc", { params: { local,local2 } });
        console.log(response.data);
        setTotalNuc(response.data);
      } catch (error) {
        console.error("Error al obtener el total de NUC:", error);
      }
    }, []); // No hay dependencias externas en esta función
  
    useEffect(() => {
      obtenerTotalNuc(selectedCadena,selectedStore);
    }, [obtenerTotalNuc,selectedCadena,selectedStore]);

    // TOTAL SRV DELL
    const obtenerTotalSrvDell= useCallback(async (local,local2) => {
      try {
        const response = await Axios.get("http://192.168.110.53:3006/FillTotalSrvDell", { params: { local,local2 } });
        console.log(response.data);
        setTotalSrvDell(response.data);
      } catch (error) {
        console.error("Error al obtener el total de DELL:", error);
      }
    }, []); // No hay dependencias externas en esta función
  
    useEffect(() => {
      obtenerTotalSrvDell(selectedCadena,selectedStore);
    }, [obtenerTotalSrvDell,selectedCadena,selectedStore]);

    // TOTAL LENOVO
    const obtenerTotalSrvLenovo= useCallback(async (local,local2) => {
      try {
        const response = await Axios.get("http://192.168.110.53:3006/FillTotalSrvLenovo", { params: { local,local2 } });
        console.log(response.data);
        setTotalSrvLenovo(response.data);
      } catch (error) {
        console.error("Error al obtener el total de Optiplex:", error);
      }
    }, []); // No hay dependencias externas en esta función
  
    useEffect(() => {
      obtenerTotalSrvLenovo(selectedCadena,selectedStore);
    }, [obtenerTotalSrvLenovo,selectedCadena,selectedStore]);
    
    // TOTAL SUPERMICRO
    const obtenerTotalSrvSupermicro= useCallback(async (local,local2) => {
      try {
        const response = await Axios.get("http://192.168.110.53:3006/FillTotalSrvSupermicro", { params: { local,local2 } });
        console.log(response.data);
        setTotalSrvSupermicro(response.data);
      } catch (error) {
        console.error("Error al obtener el total de Optiplex:", error);
      }
    }, []); // No hay dependencias externas en esta función
  
    useEffect(() => {
      obtenerTotalSrvSupermicro(selectedCadena,selectedStore);
    }, [obtenerTotalSrvSupermicro,selectedCadena,selectedStore]);


    // Función para manejar el clic en el grid "POS"
    const handlePOSClick = () => {
      if (
        totalMinipc > 0 ||
        totalHeladeria > 0 ||
        totalPosiflex > 0 ||
        totalZkteco > 0 ||
        totalPar7200 > 0 ||
        totalNcr > 0 ||
        totalPar500 > 0 ||
        totalPar2000 > 0 ||
        totalSenor > 0 ||
        totalAllinOne > 0
      ) {
      setShowAdditionalGrids(prevState => !prevState); // Muestra los grids adicionales
      } 
    };

    const handlePOSClick2 = () => {
      if (
        totalSrvDell > 0 ||
        totalSrvLenovo > 0 ||
        totalSrvSupermicro > 0
      ) {
      setShowAdditionalGrids2(prevState => !prevState); // Muestra los grids adicionales
      } 
    };

    const handlePOSClick3 = () => {
      if (
        totalNuc > 0 ||
        totalOptiplex > 0
      ) {
      setShowAdditionalGrids3(prevState => !prevState); // Muestra los grids adicionales
      } 
    };
      

  return (
    <div>
      {/* CONTAINER 1 */}
      <Container maxWidth={false} sx={{ mt: 3, mb: 1}}>
        <Grid container spacing={2}>

          {/* COMBO 1 */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 80,
                width: '100%', // Ancho completo
                backgroundColor: '#ffffff', // Color de fondo del Paper
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                }
              }}
            >
              <Autocomplete
                id="combo-cadena"
                options={comboCadena}
                getOptionLabel={(option) => option} // Asegúrate de que se muestre correctamente la etiqueta de la opción
                sx={{
                  width: '100%',
                  backgroundColor: '#ffffff', // Fondo blanco del Autocomplete
                  borderRadius: 1, // Bordes redondeados
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#6a6767', // Borde gris del TextField
                    },
                    '&:hover fieldset': {
                      borderColor: '#a2d2e2', // Borde azul claro al pasar el mouse
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#b5b6b9', // Borde gris claro al estar enfocado
                    },
                  },
                }} // Ajusta el ancho del Autocomplete
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seleccionar cadena"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      style: { color: '#6a6767' },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      style: { color: '#6a6767' },
                    }}
                  />
                )}
                value={selectedCadena}
                onChange={handleCadenaSeleccionado}
              />
            </Paper>
          </Grid> 

          {/* COMBO 2 */}
      <Grid item xs={12} md={6} lg={3}>
        <Paper
          elevation={5}
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', // Centra verticalmente el contenido
            textAlign: 'center', // Centra horizontalmente el texto
            height: 80,
            width: '100%', // Ancho completo
            backgroundColor: '#ffffff', // Color de fondo del Paper
            transition: 'transform 0.3s ease-in-out', // Transición suave
            '&:hover': {
              transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
            },
          }}
        >
          <Autocomplete
            id="combo-filtro"
            options={opcionesFiltro}
            getOptionLabel={(option) => option.nombre} // Mostrar el nombre de la opción
            sx={{
              width: '100%',
              backgroundColor: '#ffffff', // Fondo blanco del Autocomplete
              borderRadius: 1, // Bordes redondeados
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#6a6767', // Borde gris del TextField
                },
                '&:hover fieldset': {
                  borderColor: '#a2d2e2', // Borde azul claro al pasar el mouse
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#b5b6b9', // Borde gris claro al estar enfocado
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccionar Filtro"
                variant="outlined"
                size="small"
                InputLabelProps={{
                  style: { color: '#6a6767' },
                }}
                InputProps={{
                  ...params.InputProps,
                  style: { color: '#6a6767' },
                }}
              />
            )}
            value={selectedFiltro}
            onChange={handleFiltroSeleccionado}
          />
        </Paper>
      </Grid>  

          {/* COMBO 3 */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 80,
                width: '100%', // Ancho completo
                backgroundColor: '#ffffff', // Color de fondo del Paper
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                }
              }}
            >
              <Autocomplete
                id="combo-local"
                options={comboStore}
                getOptionLabel={(option) => option} // Asegúrate de que se muestre correctamente la etiqueta de la opción
                sx={{
                  width: '100%',
                  backgroundColor: '#ffffff', // Fondo blanco del Autocomplete
                  borderRadius: 1, // Bordes redondeados
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#6a6767', // Borde gris del TextField
                    },
                    '&:hover fieldset': {
                      borderColor: '#a2d2e2', // Borde azul claro al pasar el mouse
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#b5b6b9', // Borde gris claro al estar enfocado
                    },
                  },
                }} // Ajusta el ancho del Autocomplete
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seleccionar local"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      style: { color: '#6a6767' },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      style: { color: '#6a6767' },
                    }}
                  />
                )}
                value={selectedStore}
                onChange={handleStoreSeleccionado}
              />
            </Paper>
          </Grid>                   


        </Grid>
      </Container>

      {/* CONTAINER 2 */}
      <Container maxWidth={false} sx={{ mt: 4, mb: 1 }}>
        <Grid container spacing={2}> 

          {/* TEXTO 1 */}
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#FFFFFF', // Color de fondo del Paper
                border: '3px solid #eced87', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#eced87', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
                            {/* Estilo para el texto */}
                            <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>Cadenas</h1>
                            <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalCadenas}</h1>
            </Paper>
          </Grid>

          {/* TEXTO 2 */}
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#FFFFFF', // Color de fondo del Paper
                border: '3px solid #fefda6', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#fefda6', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>Locales</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalLocales}</h1>
            </Paper>
          </Grid>

          {/* TEXTO 3 */}
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#FFFFFF', // Color de fondo del Paper
                border: '3px solid #fa6262', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#fa6262', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <Tooltip title="Total POS" onClick={handlePOSClick}>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>POS</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalCajas}</h1>
              </Tooltip>
            </Paper>
          </Grid>

          {/* TEXTO 4 */}
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#ffffff', // Color de fondo del Paper
                border: '3px solid #b5b6b9', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#b5b6b9', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <Tooltip title="Total MiniPC" onClick={handlePOSClick3}>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>Mini Pc</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalMinipc}</h1>
              </Tooltip>
            </Paper>
          </Grid>

          {/* TEXTO 5 */}
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#ffffff', // Color de fondo del Paper
                border: '3px solid #aeeca8', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#aeeca8', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <Tooltip title="Total Server" onClick={handlePOSClick2}>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>Servidores</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalServer}</h1>
              </Tooltip>
            </Paper>
          </Grid>          

          {/* TEXTO 6 */}
          {showAdditionalGrids && totalPosiflex > 0 &&(
            
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#FFFFFF', // Color de fondo del Paper
                border: '3px solid #fa6262', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#fa6262', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>Posiflex</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalPosiflex}</h1>
            </Paper>
          </Grid>
          )}

          {/* TEXTO 7 */}
          {showAdditionalGrids && totalZkteco > 0 &&(
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#FFFFFF', // Color de fondo del Paper
                border: '3px solid #fa6262', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#fa6262', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>ZKTeco</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalZkteco}</h1>
            </Paper>
          </Grid>)}

          {/* TEXTO 8 */}
          {showAdditionalGrids && totalPar7200 > 0 &&(
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#FFFFFF', // Color de fondo del Paper
                border: '3px solid #fa6262', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#fa6262', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>Par 7200</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalPar7200}</h1>
            </Paper>
          </Grid>)}

          {/* TEXTO 9 */}
          {showAdditionalGrids && totalNcr > 0 &&(
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#FFFFFF', // Color de fondo del Paper
                border: '3px solid #fa6262', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#fa6262', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>NCR</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalNcr}</h1>
            </Paper>
          </Grid> )} 

          {/* TEXTO 10 */}
          {showAdditionalGrids && totalPar500 > 0 &&(
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#FFFFFF', // Color de fondo del Paper
                border: '3px solid #fa6262', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#fa6262', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>Par 500</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalPar500	}</h1>
            </Paper>
          </Grid> )}    

          {/* TEXTO 11 */}
          {showAdditionalGrids && totalSenor > 0 &&(
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#FFFFFF', // Color de fondo del Paper
                border: '3px solid #fa6262', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#fa6262', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>Senor</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalSenor}</h1>
            </Paper>
          </Grid> )}

          {/* TEXTO 12 */}
          {showAdditionalGrids && totalPar2000 > 0 &&(
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#FFFFFF', // Color de fondo del Paper
                border: '3px solid #fa6262', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#fa6262', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>Par 2000</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalPar2000}</h1>
            </Paper>
          </Grid>  )}

          {/* ALL IN ONE */}
          {showAdditionalGrids && totalAllinOne > 0 &&(
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#FFFFFF', // Color de fondo del Paper
                border: '3px solid #fa6262', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#fa6262', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>All in One</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalAllinOne}</h1>
            </Paper>
          </Grid>  )}

          {/* TEXTO 13 */}
          {showAdditionalGrids && totalHeladeria > 0 &&(
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#FFFFFF', // Color de fondo del Paper
                border: '3px solid #fa6262', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#fa6262', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 15vw, 1.5rem)' }}>Heladerías KFC</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalHeladeria}</h1>
            </Paper>
          </Grid> )}     

          {/* TEXTO 14 */}
          {showAdditionalGrids3 && totalOptiplex > 0 &&(
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#ffffff', // Color de fondo del Paper
                border: '3px solid #b5b6b9', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#b5b6b9', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 15vw, 1.5rem)' }}>Optiplex</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalOptiplex}</h1>
            </Paper>
          </Grid> )}

          {/* TEXTO 15*/}
          {showAdditionalGrids3 && totalNuc > 0 &&(
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#ffffff', // Color de fondo del Paper
                border: '3px solid #b5b6b9', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#b5b6b9', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 15vw, 1.5rem)' }}>Nuc</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalNuc}</h1>
            </Paper>
          </Grid> )} 

          {/* TEXTO 16 */}
          {showAdditionalGrids2 && totalSrvDell > 0 &&(
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#ffffff', // Color de fondo del Paper
                border: '3px solid #aeeca8', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#aeeca8', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 15vw, 1.5rem)' }}>Dell</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalSrvDell}</h1>
            </Paper>
          </Grid> )}

          {/* TEXTO 17 */}
          {showAdditionalGrids2 && totalSrvLenovo > 0 &&(
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#ffffff', // Color de fondo del Paper
                border: '3px solid #aeeca8', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#aeeca8', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 15vw, 1.5rem)' }}>Lenovo</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalSrvLenovo}</h1>
            </Paper>
          </Grid> )}

          {/* TEXTO 14 */}
          {showAdditionalGrids2 && totalSrvSupermicro > 0 &&(
          <Grid item xs={12} md={6} lg={2.4}>
            <Paper elevation={5}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centra verticalmente el contenido
                textAlign: 'center', // Centra horizontalmente el texto
                height: 120,
                width: '100%', // Ancho completo
                backgroundColor: '#ffffff', // Color de fondo del Paper
                border: '3px solid #aeeca8', // Color y grosor del borde
                transition: 'transform 0.3s ease-in-out', // Transición suave
                '&:hover': {
                  transform: 'scale(1.05)', // Agranda el componente al pasar el mouse
                  backgroundColor: '#aeeca8', // Cambia el color de fondo al pasar el mouse
                }
              }}
            >
              {/* Estilo para el texto */}
              <h1 style={{ fontSize: 'clamp(0.2rem, 15vw, 1.5rem)' }}>Supermicro</h1>
              <h1 style={{ fontSize: 'clamp(0.2rem, 5vw, 2rem)' }}>{totalSrvSupermicro}</h1>
            </Paper>
          </Grid> )}


        </Grid>
      </Container>

      {/* PONER EN OTRO CONTAINER BLANCO */}
      <Container maxWidth={false} sx={{ mt: 1, mb: 1 }}>
        <Grid container spacing={1}>
          {/* ARCHIVO JS */}
        </Grid>
      </Container>
    </div>
  );
}

export default Dash;

