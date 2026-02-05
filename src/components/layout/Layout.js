import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Divider,
    Hidden,
    CssBaseline,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: '#001529', // Dark navy from mockup
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    title: {
        flexGrow: 1,
        fontWeight: 600,
        textTransform: 'uppercase',
        fontSize: '1rem',
    },
    drawer: {
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#f0f2f5', // Light gray background from mockup
        borderRight: 'none',
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        minHeight: '100vh',
        backgroundColor: '#eef1f4',
    },
    toolbar: theme.mixins.toolbar,
    profileSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(4, 2),
    },
    largeAvatar: {
        width: theme.spacing(12),
        height: theme.spacing(12),
        backgroundColor: '#333',
        marginBottom: theme.spacing(2),
    },
    userName: {
        fontWeight: 600,
        color: '#333',
    },
    menuHeader: {
        padding: theme.spacing(2),
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        textTransform: 'uppercase',
    },
    menuIconBox: {
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: '#1890ff',
        marginRight: theme.spacing(2),
    },
    activeItem: {
        color: '#1890ff',
        '& .MuiListItemText-primary': {
            fontWeight: 600,
        },
    },
}));

const Layout = ({ children }) => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (path) => {
        history.push(path);
        setMobileOpen(false);
    };

    const handleLogout = () => {
        logout();
        history.push('/login');
    };

    const menuItems = [
        { text: 'INICIO', code: 'IN', path: '/home' },
        { text: 'Consulta Clientes', code: 'CC', path: '/clients' },
    ];

    const drawer = (
        <div>
            <div className={classes.toolbar} />
            <Box className={classes.profileSection}>
                <AccountCircleIcon className={classes.largeAvatar} style={{ fontSize: 100, color: '#000' }} />
                <Typography variant="h6" className={classes.userName}>
                    {user || 'Nombre de Usuario'}
                </Typography>
            </Box>
            <Divider />
            <Typography className={classes.menuHeader}>MENÚ</Typography>
            <Divider />
            <List>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => handleNavigation(item.path)}
                            className={isActive ? classes.activeItem : ''}
                        >
                            <Box className={classes.menuIconBox}>
                                {item.code}
                            </Box>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap className={classes.title}>
                        COMPANIA PRUEBA
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body1" style={{ fontWeight: 600, marginRight: 8 }}>
                            {user || 'Nombre de Usuario'}
                        </Typography>
                        <IconButton color="inherit" onClick={handleLogout} title="Cerrar sesión">
                            <ExitToAppIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer}>
                <Hidden mdUp implementation="css">
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true,
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {children}
            </main>
        </div>
    );
};

export default Layout;
