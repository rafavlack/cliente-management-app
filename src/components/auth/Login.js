import React, { useState } from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    FormControlLabel,
    Checkbox,
    Link,
    Snackbar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { validateRequired } from '../../utils/validators';

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    paper: {
        padding: theme.spacing(4),
        maxWidth: 400,
        width: '100%',
    },
    title: {
        marginBottom: theme.spacing(3),
        textAlign: 'center',
        color: theme.palette.primary.main,
        fontWeight: 600,
    },
    form: {
        width: '100%',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        padding: theme.spacing(1.5),
    },
    link: {
        textAlign: 'center',
        marginTop: theme.spacing(2),
    },
}));


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = () => {
    const classes = useStyles();
    const history = useHistory();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: localStorage.getItem('rememberedUsername') || '',
        password: '',
        rememberMe: !!localStorage.getItem('rememberedUsername'),
    });

    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'error',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'rememberMe' ? checked : value,
        });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!validateRequired(formData.username)) {
            newErrors.username = 'El usuario es requerido';
        }

        if (!validateRequired(formData.password)) {
            newErrors.password = 'La contraseña es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            const response = await authService.login(
                formData.username,
                formData.password
            );

            if (formData.rememberMe) {
                localStorage.setItem(
                    'rememberedUsername',
                    formData.username
                );
            } else {
                localStorage.removeItem('rememberedUsername');
            }

            login(response);
            setSnackbar({
                open: true,
                message: 'Inicio de sesión exitoso',
                severity: 'success',
            });

            setTimeout(() => history.push('/home'), 500);
        } catch (error) {
            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    'Error al iniciar sesión. Verifique sus credenciales.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <Box className={classes.container}>
            <Container maxWidth="xs">
                <Paper className={classes.paper} elevation={3}>
                    <Typography variant="h4" className={classes.title}>
                        Iniciar Sesión
                    </Typography>

                    <form className={classes.form} onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            label="Usuario"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={!!errors.username}
                            helperText={errors.username}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            type="password"
                            label="Contraseña"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    color="primary"
                                />
                            }
                            label="Recuérdame"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={loading}
                        >
                            {loading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
                        </Button>

                        <Box className={classes.link}>
                            <Typography variant="body2">
                                ¿No tiene una cuenta?{' '}
                                <Link component={RouterLink} to="/register">
                                    Regístrese
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );

};

export default Login;
