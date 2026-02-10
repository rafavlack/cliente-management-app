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
    MenuItem,
    Box,
    Snackbar,
    CircularProgress,
    Avatar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MuiAlert from '@material-ui/lab/Alert';
import { useAuth } from '../../context/AuthContext';
import clientService from '../../services/clientService';
import { validateRequired } from '../../utils/validators';
import { fileToBase64 } from '../../utils/imageUtils';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(3),
        borderRadius: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(3),
        paddingBottom: theme.spacing(2),
        borderBottom: '1px solid #eee',
    },
    titleBox: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
    },
    titleIcon: {
        width: 60,
        height: 60,
        color: '#8c8c8c',
        border: '1px solid #d9d9d9',
        borderRadius: '50%',
        padding: 4,
    },
    titleIconContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: 600,
        color: '#262626',
        fontSize: '1.5rem',
    },
    actionButtons: {
        display: 'flex',
        gap: theme.spacing(1),
    },
    headerBtn: {
        backgroundColor: '#f0f2f5',
        color: '#595959',
        fontSize: '0.8rem',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: '#e6f7ff',
            color: '#1890ff',
        },
    },
    form: {
        width: '100%',
    },
    fieldLabel: {
        fontSize: '0.85rem',
        fontWeight: 500,
        color: '#595959',
        marginBottom: theme.spacing(0.5),
    },
    outlinedInput: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 0,
        },
        '& .MuiInputBase-input': {
            padding: theme.spacing(1.5),
        },
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
        fNacimiento: isEditMode ? null : new Date(),
        fAfiliacion: isEditMode ? null : new Date(),
        sexo: 'F',
        resenaPersonal: '',
        imagen: '',
        interesFK: '',
    });

    const [interests, setInterests] = useState([]);
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);

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
                        sexo: data.sexo || 'F',
                        resenaPersonal: data.resenaPersonal || '',
                        imagen: data.imagen || '',
                        interesFK: data.interesesId || '',
                    });
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
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                setFormData({ ...formData, imagen: base64 });
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: 'Error al procesar imagen',
                    severity: 'error',
                });
            }
        }
    };


    const validate = () => {
        const newErrors = {};
        if (!validateRequired(formData.nombre)) newErrors.nombre = 'Nombre es requerido';
        if (!validateRequired(formData.apellidos)) newErrors.apellidos = 'Apellidos es requerido';
        if (!validateRequired(formData.identificacion)) newErrors.identificacion = 'Identificación es requerida';
        if (!validateRequired(formData.telefonoCelular)) newErrors.telefonoCelular = 'Teléfono es requerido';
        if (!validateRequired(formData.otroTelefono)) newErrors.otroTelefono = 'Otro teléfono es requerido';
        if (!validateRequired(formData.direccion)) newErrors.direccion = 'Dirección es requerida';
        if (!formData.fNacimiento) newErrors.fNacimiento = 'Fecha requerida';
        if (!formData.fAfiliacion) newErrors.fAfiliacion = 'Fecha requerida';
        if (!validateRequired(formData.resenaPersonal)) newErrors.resenaPersonal = 'Reseña es requerida';
        if (!validateRequired(formData.interesFK)) newErrors.interesFK = 'Interés es requerido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validate()) return;

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
                await clientService.updateClient({ id, ...clientData });
                setSnackbar({ open: true, message: 'Actualizado correctamente', severity: 'success' });
            } else {
                await clientService.createClient(clientData);
                setSnackbar({ open: true, message: 'Creado correctamente', severity: 'success' });
            }

            setTimeout(() => history.push('/clients'), 500);
        } catch (error) {
            setSnackbar({ open: true, message: 'Error en la transacción', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => history.push('/clients');
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

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
            <Container className={classes.container} maxWidth="lg">
                <Paper className={classes.paper}>
                    <Box className={classes.headerRow}>
                        <Box className={classes.titleBox}>
                            <Box
                                className={classes.titleIconContainer}
                                onClick={() => document.getElementById('imageInput').click()}
                                style={{ cursor: 'pointer' }}
                            >
                                {formData.imagen ? (
                                    <Avatar
                                        src={`data:image/jpeg;base64,${formData.imagen}`}
                                        alt="Client"
                                        className={classes.titleIcon}
                                    />
                                ) : (
                                    <AccountCircleIcon className={classes.titleIcon} />
                                )}
                                <input
                                    type="file"
                                    id="imageInput"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Box>
                            <Typography variant="h5" className={classes.title}>
                                Mantenimiento de clientes
                            </Typography>
                        </Box>
                        <Box className={classes.actionButtons}>
                            <Button
                                variant="contained"
                                className={classes.headerBtn}
                                startIcon={<SaveIcon />}
                                onClick={handleSubmit}
                            >
                                Guardar
                            </Button>
                            <Button
                                variant="contained"
                                className={classes.headerBtn}
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBack}
                            >
                                Regresar
                            </Button>
                        </Box>
                    </Box>

                    <form className={classes.form}>
                        <Grid container spacing={2}>
                            {/* Row 1 */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Identificación *"
                                    name="identificacion"
                                    value={formData.identificacion}
                                    onChange={handleChange}
                                    error={!!errors.identificacion}
                                    className={classes.outlinedInput}
                                    placeholder="Identificación"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Nombre *"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    error={!!errors.nombre}
                                    className={classes.outlinedInput}
                                    placeholder="Nombre"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Apellidos *"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    error={!!errors.apellidos}
                                    className={classes.outlinedInput}
                                    placeholder="Apellidos"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            {/* Row 2 */}
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth variant="outlined" className={classes.outlinedInput}>
                                    <TextField
                                        select
                                        label="Género *"
                                        name="sexo"
                                        value={formData.sexo}
                                        onChange={handleChange}
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                    >
                                        <MenuItem value="F">Femenino</MenuItem>
                                        <MenuItem value="M">Masculino</MenuItem>
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <KeyboardDatePicker
                                    fullWidth
                                    inputVariant="outlined"
                                    className={classes.outlinedInput}
                                    label="Fecha de nacimiento *"
                                    format="dd/MM/yyyy"
                                    placeholder="26/04/2022"
                                    value={formData.fNacimiento}
                                    onChange={(date) => handleDateChange('fNacimiento', date)}
                                    error={!!errors.fNacimiento}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <KeyboardDatePicker
                                    fullWidth
                                    inputVariant="outlined"
                                    className={classes.outlinedInput}
                                    label="Fecha de afiliación *"
                                    format="dd/MM/yyyy"
                                    placeholder="26/04/2022"
                                    value={formData.fAfiliacion}
                                    onChange={(date) => handleDateChange('fAfiliacion', date)}
                                    error={!!errors.fAfiliacion}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            {/* Row 3 */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Teléfono Celular *"
                                    name="telefonoCelular"
                                    value={formData.telefonoCelular}
                                    onChange={handleChange}
                                    error={!!errors.telefonoCelular}
                                    className={classes.outlinedInput}
                                    placeholder="Teléfono Celular"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Teléfono Otro *"
                                    name="otroTelefono"
                                    value={formData.otroTelefono}
                                    onChange={handleChange}
                                    error={!!errors.otroTelefono}
                                    className={classes.outlinedInput}
                                    placeholder="Teléfono Otro"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    fullWidth
                                    variant="outlined"
                                    label="Interes *"
                                    name="interesFK"
                                    value={formData.interesFK}
                                    onChange={handleChange}
                                    error={!!errors.interesFK}
                                    className={classes.outlinedInput}
                                    InputLabelProps={{ shrink: true }}
                                >
                                    <MenuItem value="">Seleccione</MenuItem>
                                    {interests.map((interest) => (
                                        <MenuItem key={interest.id} value={interest.id}>
                                            {interest.descripcion}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Row 4 */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Dirección *"
                                    name="direccion"
                                    multiline
                                    rows={1}
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    error={!!errors.direccion}
                                    className={classes.outlinedInput}
                                    placeholder="Dirección"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            {/* Row 5 */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Reseña *"
                                    name="resenaPersonal"
                                    multiline
                                    rows={1}
                                    value={formData.resenaPersonal}
                                    onChange={handleChange}
                                    error={!!errors.resenaPersonal}
                                    className={classes.outlinedInput}
                                    placeholder="Reseña"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
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
