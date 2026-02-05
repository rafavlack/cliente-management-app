import React from 'react';
import { useHistory } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/People';
import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 128px)',
        paddingBottom: theme.spacing(60),
    },
    welcomeSection: {
        textAlign: 'center',
    },
    title: {
        fontWeight: 700,
        color: '#001529',
        fontSize: '3.5rem',
    },
}));

const Home = () => {
    const classes = useStyles();

    return (
        <Container className={classes.container} maxWidth="lg">
            <Box className={classes.welcomeSection}>
                <Typography variant="h2" className={classes.title}>
                    Bienvenido
                </Typography>
            </Box>
        </Container>
    );
};

export default Home;
