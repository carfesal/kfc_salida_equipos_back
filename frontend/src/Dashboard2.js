import React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
//import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

//import Fondo from './dashboard/Fondo';
import Creasalida from './dashboard/insert/salidaEq';
import Consultasalida from './dashboard/select/SelectEquipos3';
import Tooltip from '@mui/material/Tooltip';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        display: 'none', // Oculta el menú completamente
      }),
    },
  }),
);

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = React.useState(false);
  const [selectedJS, setSelectedJS] = React.useState("salidaEq"); // Estado para almacenar el archivo JS seleccionado

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const renderJSComponent = () => {
    switch (selectedJS) {
      case "salidaEq":
        return <Creasalida key="salidaEq" />;
      case "s_equipos":
        return <Consultasalida key="s_equipos" />;
      default:
        return <Creasalida key="salidaEq" />; // Por defecto, muestra el componente Fondo
    }
  };
  

  const handleJSSelection = (JSName) => {
    setSelectedJS(JSName);
    setOpen(false); // Cierra el menú al seleccionar un ítem
  };

  const handleReload = () => {
    window.location.reload();
  };

  

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              backgroundColor: '#1976D2',pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              SALIDA DE EQUIPOS IT.
            </Typography>

            <Box display="flex" alignItems="center" gap={2}> {/* gap={2} aplica el espaciado */}
            

            <Tooltip title="Cerrar sesión">
              <IconButton color="inherit" onClick={handleReload}>                
                  <NotificationsIcon sx={{ fontSize: 35 }} />                
              </IconButton>
              </Tooltip>
              </Box>      

          </Toolbar>
        </AppBar>

        {/* MENÚ CON ITEMS */}
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>

          <Divider />
          <List component="nav">            

            
            <ListItemButton onClick={() => handleJSSelection("salidaEq")}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Hoja de salida" />
            </ListItemButton>  

            <Divider sx={{ my: 1 }} />
            <ListSubheader component="div" inset>
              
              Consultas
            </ListSubheader>

            <ListItemButton onClick={() => handleJSSelection("s_equipos")}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Salida de equipos" />
            </ListItemButton>
            
            
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />

          {/* CONTAINER QUE LLAMA A ALCHIVO .JS */}
          <Container maxWidth={false} sx={{ mt: 2, mb: 4 }}>
            {renderJSComponent()} {/* Renderiza el componente de gráfico seleccionado */}
            
          </Container>          
        </Box>
      </Box>
    </ThemeProvider>
  );
}
