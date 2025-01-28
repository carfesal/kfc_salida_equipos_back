import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Alert, Grid, Link, Paper } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAuth } from './AuthContext';
import ModalForm1 from './InsertTecnico';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.110.53:3010/ValidarLogin', {
        email,
        password,
      });
      if (response.status === 200) {
        setError('');
        const userType = email === 'seguridad@kfc.com.ec' ? 'seguridad' : 'normal';
        login(userType);
        console.log('Inicio de sesión exitoso');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Correo electrónico o contraseña incorrectos');
      } else {
        setError('Error interno del servidor');
      }
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPassword(value);
    }
  };

  const handleKeyDown = (e) => {
    const invalidChars = ['-', '+', 'e', 'E', '.', ','];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
        padding: '0 16px', // Add some padding to prevent content from touching screen edges
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={2}
          mt={2}
        >
          {/* Left Side: Text and Image */}
          <Paper elevation={0} style={{ padding: '16px', flex: 1, backgroundColor: '#F0F2F5' }}>
            <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 'bold', textAlign: { xs: 'center', md: 'left' } }}>
              Auto-inventario
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              Automatiza la recopilación de información sobre las características de tus computadoras (desktop, laptop, mini PC).
            </Typography>
            <Box
              display="flex"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              mt={2}
            >
              <Box
                component="img"
                src={`${process.env.PUBLIC_URL}/erwin2.png`}
                alt="Imagen de cuenta"
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  width: { xs: '150px', md: '220px' },
                }}
              />
            </Box>
          </Paper>

          {/* Right Side: Login Form */}
          <Paper elevation={3} style={{ padding: '16px', flex: 1 }}>
            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
              <TextField
                label="Correo electrónico o teléfono"
                type="email"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Contraseña"
                type="password"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                onKeyDown={handleKeyDown}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, mb: 2, height: 50, fontSize: '16px', borderRadius: 6, fontWeight: 'bold', textTransform: 'none' }}
              >
                Iniciar sesión
              </Button>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <Link href="#" variant="body2" sx={{ mb: 1 }}>
                  ¿Olvidaste tu contraseña?
                </Link>
                <Box
                  sx={{
                    width: '100%',
                    borderBottom: '1px solid #ccc',
                    mb: 2,
                  }}
                />
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#969696',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#2b8a3e' },
                  mt: 2,
                  height: 50,
                  fontSize: '16px',
                  borderRadius: 6,
                  fontWeight: 'bold',
                  textTransform: 'none',
                }}
                onClick={handleOpenModal}
              >
                Crear cuenta nueva
              </Button>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ mt: 4 }} />
      </Container>
      {openModal && (
        <div className="overlay">
          <ModalForm1 open={openModal} handleClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
};

export default Login;
