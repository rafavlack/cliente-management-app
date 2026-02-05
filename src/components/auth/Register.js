import React, { useState } from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Link,
    Snackbar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import authService from '../../services/authService';
import {
    validateRequired,
    validateEmail,
    validatePassword,
    getPasswordValidationMessage,
} from '../../utils/validators';

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
        maxWidth: 450,
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

const Register = () => {
    const classes = useStyles();
    const history = useHistory();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!validateRequired(formData.username)) {
            newErrors.username = 'El usuario es requerido';
        }

        if (!validateRequired(formData.email)) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Ingrese un correo electrónico válido';
        }

        if (!validateRequired(formData.password)) {
            newErrors.password = 'La contraseña es requerida';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = getPasswordValidationMessage();
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);
        try {
            const response = await authService.register(
                formData.username,
                formData.email,
                formData.password
            );

            setSnackbar({
                open: true,
                message: response.message || 'Usuario creado correctamente',
                severity: 'success',
            });

            setTimeout(() => {
                history.push('/login');
            }, 1500);
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Error al registrar usuario',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box className={classes.container}>
            <Container maxWidth="sm">
                <Paper className={classes.paper} elevation={3}>
                    <Typography variant="h4" className={classes.title}>
                        Registro
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="username"
                            label="Usuario *"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange}
                            error={!!errors.username}
                            helperText={errors.username}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Correo Electrónico *"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Contraseña *"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'REGISTRARSE'}
                        </Button>
                        <Box className={classes.link}>
                            <Typography variant="body2">
                                ¿Ya tiene una cuenta?{' '}
                                <Link component={RouterLink} to="/login">
                                    Inicie sesión
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

export default Register;
