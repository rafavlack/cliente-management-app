import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Select,
    MenuItem,
    InputLabel,
    Box,
    Snackbar,
    CircularProgress,
    Avatar,
    IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import MuiAlert from '@material-ui/lab/Alert';
import { useAuth } from '../../context/AuthContext';
import clientService from '../../services/clientService';
import { validateRequired, validateMaxLength } from '../../utils/validators';
import { fileToBase64, validateImageFile } from '../../utils/imageUtils';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(3),
    },
    title: {
        marginBottom: theme.spacing(3),
        fontWeight: 600,
        color: theme.palette.primary.main,
    },
    form: {
        width: '100%',
    },
    buttonGroup: {
        display: 'flex',
        gap: theme.spacing(2),
        marginTop: theme.spacing(3),
    },
    imageSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing(2),
    },
    avatar: {
        width: 150,
        height: 150,
        marginBottom: theme.spacing(1),
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(4),
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ClientForm = () => {
    const classes = useStyles();
    const history = useHistory();
    const { id } = useParams();
    const { userid } = useAuth();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        identificacion: '',
        telefonoCelular: '',
        otroTelefono: '',
        direccion: '',
        fNacimiento: null,
        fAfiliacion: null,
        sexo: 'M',
        resenaPersonal: '',
        imagen: '',
        interesFK: '',
    });

    const [interests, setInterests] = useState([]);
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    // Load interests on mount
    useEffect(() => {
        const loadInterests = async () => {
            try {
                const data = await clientService.getInterests();
                setInterests(data);
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: 'Error al cargar intereses',
                    severity: 'error',
                });
            }
        };
        loadInterests();
    }, []);

    // Load client data if editing
    useEffect(() => {
        if (isEditMode) {
            const loadClient = async () => {
                setLoading(true);
                try {
                    const data = await clientService.getClient(id);
                    setFormData({
                        nombre: data.nombre || '',
                        apellidos: data.apellidos || '',
                        identificacion: data.identificacion || '',
                        telefonoCelular: data.telefonoCelular || '',
                        otroTelefono: data.otroTelefono || '',
                        direccion: data.direccion || '',
                        fNacimiento: data.fNacimiento ? new Date(data.fNacimiento) : null,
                        fAfiliacion: data.fAfiliacion ? new Date(data.fAfiliacion) : null,
                        sexo: data.sexo || 'M',
                        resenaPersonal: data.resenaPersonal || '',
                        imagen: data.imagen || '',
                        interesFK: data.interesesId || '',
                    });
                    if (data.imagen) {
                        setImagePreview(`data:image/jpeg;base64,${data.imagen}`);
                    }
                } catch (error) {
                    setSnackbar({
                        open: true,
                        message: 'Error al cargar cliente',
                        severity: 'error',
                    });
                } finally {
                    setLoading(false);
                }
            };
            loadClient();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleDateChange = (name, date) => {
        setFormData({
            ...formData,
            [name]: date,
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.valid) {
            setSnackbar({
                open: true,
                message: validation.error,
                severity: 'error',
            });
            return;
        }

        try {
            const base64 = await fileToBase64(file);
            setFormData({
                ...formData,
                imagen: base64,
            });
            setImagePreview(URL.createObjectURL(file));
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al procesar la imagen',
                severity: 'error',
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!validateRequired(formData.nombre)) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (!validateMaxLength(formData.nombre, 50)) {
            newErrors.nombre = 'El nombre no debe exceder 50 caracteres';
        }

        if (!validateRequired(formData.apellidos)) {
            newErrors.apellidos = 'Los apellidos son requeridos';
        } else if (!validateMaxLength(formData.apellidos, 100)) {
            newErrors.apellidos = 'Los apellidos no deben exceder 100 caracteres';
        }

        if (!validateRequired(formData.identificacion)) {
            newErrors.identificacion = 'La identificación es requerida';
        } else if (!validateMaxLength(formData.identificacion, 20)) {
            newErrors.identificacion = 'La identificación no debe exceder 20 caracteres';
        }

        if (!validateRequired(formData.telefonoCelular)) {
            newErrors.telefonoCelular = 'El teléfono celular es requerido';
        } else if (!validateMaxLength(formData.telefonoCelular, 20)) {
            newErrors.telefonoCelular = 'El teléfono no debe exceder 20 caracteres';
        }

        if (!validateMaxLength(formData.otroTelefono, 20)) {
            newErrors.otroTelefono = 'El teléfono no debe exceder 20 caracteres';
        }

        if (!validateRequired(formData.direccion)) {
            newErrors.direccion = 'La dirección es requerida';
        } else if (!validateMaxLength(formData.direccion, 200)) {
            newErrors.direccion = 'La dirección no debe exceder 200 caracteres';
        }

        if (!formData.fNacimiento) {
            newErrors.fNacimiento = 'La fecha de nacimiento es requerida';
        }

        if (!formData.fAfiliacion) {
            newErrors.fAfiliacion = 'La fecha de afiliación es requerida';
        }

        if (!validateRequired(formData.resenaPersonal)) {
            newErrors.resenaPersonal = 'La reseña personal es requerida';
        } else if (!validateMaxLength(formData.resenaPersonal, 200)) {
            newErrors.resenaPersonal = 'La reseña no debe exceder 200 caracteres';
        }

        if (!validateRequired(formData.interesFK)) {
            newErrors.interesFK = 'Debe seleccionar un interés';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            setSnackbar({
                open: true,
                message: 'Por favor corrija los errores en el formulario',
                severity: 'error',
            });
            return;
        }

        setLoading(true);
        try {
            const clientData = {
                nombre: formData.nombre,
                apellidos: formData.apellidos,
                identificacion: formData.identificacion,
                celular: formData.telefonoCelular,
                otroTelefono: formData.otroTelefono,
                direccion: formData.direccion,
                fNacimiento: formData.fNacimiento?.toISOString(),
                fAfiliacion: formData.fAfiliacion?.toISOString(),
                sexo: formData.sexo,
                resennaPersonal: formData.resenaPersonal,
                imagen: formData.imagen,
                interesFK: formData.interesFK,
                usuarioId: userid,
            };

            if (isEditMode) {
                // Update client
                await clientService.updateClient({
                    id,
                    ...clientData,
                });
                setSnackbar({
                    open: true,
                    message: 'Cliente actualizado correctamente',
                    severity: 'success',
                });
            } else {
                // Create client
                await clientService.createClient(clientData);
                setSnackbar({
                    open: true,
                    message: 'Cliente creado correctamente',
                    severity: 'success',
                });
            }

            setTimeout(() => {
                history.push('/clients');
            }, 1000);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Hubo un inconveniente con la transacción',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        history.push('/clients');
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading && isEditMode && !formData.nombre) {
        return (
            <Container className={classes.container}>
                <Box className={classes.loading}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
            <Container className={classes.container} maxWidth="md">
                <Paper className={classes.paper}>
                    <Typography variant="h4" className={classes.title}>
                        {isEditMode ? 'Editar Cliente' : 'Mantenimiento de Clientes'}
                    </Typography>

                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Image Section */}
                            <Grid item xs={12} md={3}>
                                <Box className={classes.imageSection}>
                                    <Avatar
                                        src={imagePreview}
                                        className={classes.avatar}
                                    />
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="image-upload"
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="image-upload">
                                        <IconButton color="primary" component="span">
                                            <PhotoCameraIcon />
                                        </IconButton>
                                    </label>
                                    <Typography variant="caption" color="textSecondary">
                                        Imagen del Cliente
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Form Fields */}
                            <Grid item xs={12} md={9}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Nombre *"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            error={!!errors.nombre}
                                            helperText={errors.nombre}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Apellidos *"
                                            name="apellidos"
                                            value={formData.apellidos}
                                            onChange={handleChange}
                                            error={!!errors.apellidos}
                                            helperText={errors.apellidos}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Identificación *"
                                            name="identificacion"
                                            value={formData.identificacion}
                                            onChange={handleChange}
                                            error={!!errors.identificacion}
                                            helperText={errors.identificacion}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Teléfono Celular *"
                                            name="telefonoCelular"
                                            value={formData.telefonoCelular}
                                            onChange={handleChange}
                                            error={!!errors.telefonoCelular}
                                            helperText={errors.telefonoCelular}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Otro Teléfono *"
                                            name="otroTelefono"
                                            value={formData.otroTelefono}
                                            onChange={handleChange}
                                            error={!!errors.otroTelefono}
                                            helperText={errors.otroTelefono}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Dirección *"
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            error={!!errors.direccion}
                                            helperText={errors.direccion}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <KeyboardDatePicker
                                            fullWidth
                                            inputVariant="outlined"
                                            label="Fecha de Nacimiento *"
                                            format="dd/MM/yyyy"
                                            value={formData.fNacimiento}
                                            onChange={(date) => handleDateChange('fNacimiento', date)}
                                            error={!!errors.fNacimiento}
                                            helperText={errors.fNacimiento}
                                            KeyboardButtonProps={{
                                                'aria-label': 'cambiar fecha',
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <KeyboardDatePicker
                                            fullWidth
                                            inputVariant="outlined"
                                            label="Fecha de Afiliación *"
                                            format="dd/MM/yyyy"
                                            value={formData.fAfiliacion}
                                            onChange={(date) => handleDateChange('fAfiliacion', date)}
                                            error={!!errors.fAfiliacion}
                                            helperText={errors.fAfiliacion}
                                            KeyboardButtonProps={{
                                                'aria-label': 'cambiar fecha',
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl component="fieldset" error={!!errors.sexo}>
                                            <FormLabel component="legend">Sexo *</FormLabel>
                                            <RadioGroup
                                                row
                                                name="sexo"
                                                value={formData.sexo}
                                                onChange={handleChange}
                                            >
                                                <FormControlLabel value="M" control={<Radio />} label="Masculino" />
                                                <FormControlLabel value="F" control={<Radio />} label="Femenino" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="outlined" error={!!errors.interesFK}>
                                            <InputLabel>Intereses *</InputLabel>
                                            <Select
                                                name="interesFK"
                                                value={formData.interesFK}
                                                onChange={handleChange}
                                                label="Intereses *"
                                            >
                                                <MenuItem value="">
                                                    <em>Seleccione...</em>
                                                </MenuItem>
                                                {interests.map((interest) => (
                                                    <MenuItem key={interest.id} value={interest.id}>
                                                        {interest.descripcion}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.interesFK && (
                                                <Typography variant="caption" color="error">
                                                    {errors.interesFK}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Reseña Personal *"
                                            name="resenaPersonal"
                                            value={formData.resenaPersonal}
                                            onChange={handleChange}
                                            error={!!errors.resenaPersonal}
                                            helperText={errors.resenaPersonal}
                                            variant="outlined"
                                            multiline
                                            rows={3}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Box className={classes.buttonGroup}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar'}
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBack}
                                disabled={loading}
                            >
                                Regresar
                            </Button>
                        </Box>
                    </form>
                </Paper>

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
            </Container>
        </MuiPickersUtilsProvider>
    );
};

export default ClientForm;
