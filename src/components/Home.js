import React from 'react';
import { useHistory } from 'react-router-dom';
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/People';
import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(4),
    },
    title: {
        marginBottom: theme.spacing(4),
        fontWeight: 600,
        color: theme.palette.primary.main,
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
        },
    },
    cardContent: {
        flexGrow: 1,
        textAlign: 'center',
    },
    icon: {
        fontSize: 80,
        color: theme.palette.primary.main,
        marginBottom: theme.spacing(2),
    },
    cardActions: {
        justifyContent: 'center',
        padding: theme.spacing(2),
    },
    welcomeBox: {
        marginBottom: theme.spacing(4),
        padding: theme.spacing(3),
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        borderRadius: theme.shape.borderRadius,
    },
}));

const Home = () => {
    const classes = useStyles();
    const history = useHistory();
    const { user } = useAuth();

    const handleNavigateToClients = () => {
        history.push('/clients');
    };

    return (
        <Container className={classes.container} maxWidth="lg">
            <Box className={classes.welcomeBox}>
                <Typography variant="h4" gutterBottom>
                    Bienvenido, {user}
                </Typography>
                <Typography variant="body1">
                    Sistema de Gestión de Clientes
                </Typography>
            </Box>

            <Typography variant="h5" className={classes.title}>
                Panel de Control
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <PeopleIcon className={classes.icon} />
                            <Typography variant="h5" component="h2" gutterBottom>
                                Cuentas Clientes
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Gestione la información de sus clientes, cree nuevos registros,
                                actualice datos existentes y consulte el historial.
                            </Typography>
                        </CardContent>
                        <CardActions className={classes.cardActions}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleNavigateToClients}
                            >
                                Ir a Clientes
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;
