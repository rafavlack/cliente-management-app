import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    paper: {
        padding: theme.spacing(6),
        textAlign: 'center',
        maxWidth: 500,
    },
    icon: {
        fontSize: 100,
        color: theme.palette.error.main,
        marginBottom: theme.spacing(2),
    },
    title: {
        marginBottom: theme.spacing(2),
        fontWeight: 600,
    },
    description: {
        marginBottom: theme.spacing(4),
        color: theme.palette.text.secondary,
    },
    button: {
        marginTop: theme.spacing(2),
    },
}));

const NotFound = () => {
    const classes = useStyles();

    return (
        <Box className={classes.container}>
            <Container maxWidth="sm">
                <Paper className={classes.paper} elevation={3}>
                    <ErrorOutlineIcon className={classes.icon} />
                    <Typography variant="h3" className={classes.title}>
                        404
                    </Typography>
                    <Typography variant="h5" className={classes.title}>
                        Página No Encontrada
                    </Typography>
                    <Typography variant="body1" className={classes.description}>
                        Lo sentimos, la página que está buscando no existe o ha sido movida.
                    </Typography>
                    <Button
                        component={RouterLink}
                        to="/home"
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.button}
                    >
                        Volver al Inicio
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default NotFound;
