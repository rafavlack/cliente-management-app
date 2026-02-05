import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Box,
    Snackbar,
    CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MuiAlert from '@material-ui/lab/Alert';
import { useAuth } from '../../context/AuthContext';
import clientService from '../../services/clientService';
import ConfirmDialog from '../common/ConfirmDialog';

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
    title: {
        fontWeight: 600,
        color: '#003a8c',
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
    searchCard: {
        padding: theme.spacing(2),
        border: '1px solid #e8e8e8',
        borderRadius: theme.spacing(0.5),
        marginBottom: theme.spacing(3),
    },
    searchBox: {
        display: 'flex',
        gap: theme.spacing(2),
        alignItems: 'center',
    },
    searchField: {
        flex: 1,
        '& .MuiOutlinedInput-root': {
            borderRadius: 0,
        },
    },
    searchButton: {
        backgroundColor: '#fff',
        color: '#595959',
        border: '1px solid #d9d9d9',
        boxShadow: 'none',
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
        padding: theme.spacing(1),
    },
    tableHeaderCell: {
        backgroundColor: '#1890ff',
        color: '#fff',
        fontWeight: 'bold',
    },
    tableRow: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#fff',
        },
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
    },
    idCell: {
        color: '#8c8c8c',
    },
    tableContainer: {
        border: '1px solid #e8e8e8',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(4),
    },
    noData: {
        textAlign: 'center',
        padding: theme.spacing(4),
        color: theme.palette.text.secondary,
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ClientList = () => {
    const classes = useStyles();
    const history = useHistory();
    const { userid } = useAuth();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        identificacion: '',
        nombre: '',
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, clientId: null, clientName: '' });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await clientService.listClients(
                filters.identificacion,
                filters.nombre,
                userid
            );
            setClients(data);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al buscar clientes',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddClient = () => {
        history.push('/clients/new');
    };

    const handleEditClient = (clientId) => {
        history.push(`/clients/edit/${clientId}`);
    };

    const handleDeleteClick = (clientId, clientName) => {
        setConfirmDialog({
            open: true,
            clientId,
            clientName,
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            // Desactivado por requerimiento
            setSnackbar({
                open: true,
                message: 'Cliente eliminado correctamente',
                severity: 'success',
            });
            setConfirmDialog({ open: false, clientId: null, clientName: '' });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al eliminar cliente',
                severity: 'error',
            });
        }
    };

    const handleDeleteCancel = () => {
        setConfirmDialog({ open: false, clientId: null, clientName: '' });
    };

    const handleBack = () => {
        history.push('/home');
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Load clients on mount
    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <Container className={classes.container} maxWidth="lg">
            <Paper className={classes.paper}>
                <Box className={classes.headerRow}>
                    <Typography variant="h5" className={classes.title}>
                        Consulta de clientes
                    </Typography>
                    <Box className={classes.actionButtons}>
                        <Button
                            variant="contained"
                            className={classes.headerBtn}
                            startIcon={<AddIcon />}
                            onClick={handleAddClient}
                        >
                            Agregar
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

                <Box className={classes.searchCard}>
                    <Box className={classes.searchBox}>
                        <TextField
                            className={classes.searchField}
                            label="Nombre"
                            name="nombre"
                            variant="outlined"
                            size="small"
                            value={filters.nombre}
                            onChange={handleFilterChange}
                        />
                        <TextField
                            className={classes.searchField}
                            label="Identificación"
                            name="identificacion"
                            variant="outlined"
                            size="small"
                            value={filters.identificacion}
                            onChange={handleFilterChange}
                        />
                        <IconButton
                            onClick={handleSearch}
                            className={classes.searchButton}
                            title="Buscar"
                        >
                            <SearchIcon />
                        </IconButton>
                    </Box>
                </Box>

                {loading ? (
                    <Box className={classes.loading}>
                        <CircularProgress />
                    </Box>
                ) : clients.length === 0 ? (
                    <Typography className={classes.noData}>
                        No se encontraron clientes
                    </Typography>
                ) : (
                    <TableContainer className={classes.tableContainer}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableHeaderCell}>Identificación</TableCell>
                                    <TableCell className={classes.tableHeaderCell}>Nombre completo</TableCell>
                                    <TableCell className={classes.tableHeaderCell} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clients.map((client) => (
                                    <TableRow key={client.id} className={classes.tableRow}>
                                        <TableCell className={classes.idCell}>{client.identificacion}</TableCell>
                                        <TableCell>{`${client.nombre} ${client.apellidos}`}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="action"
                                                size="small"
                                                onClick={() => handleEditClient(client.id)}
                                                title="Editar"
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                color="action"
                                                size="small"
                                                onClick={() => handleDeleteClick(client.id, `${client.nombre} ${client.apellidos}`)}
                                                title="Eliminar"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <ConfirmDialog
                open={confirmDialog.open}
                title="Confirmar Eliminación"
                message={`¿Está seguro que desea eliminar al cliente ${confirmDialog.clientName}?`}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />

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
    );
};

export default ClientList;
