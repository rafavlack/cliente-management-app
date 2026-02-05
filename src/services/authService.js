import api from './api';

const authService = {
    login: async (username, password) => {
        const response = await api.post('/api/Authenticate/login', {
            username,
            password,
        });
        return response.data;
    },

    register: async (username, email, password) => {
        const response = await api.post('/api/Authenticate/register', {
            username,
            email,
            password,
        });
        return response.data;
    },

    saveAuthData: (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userid', data.userid);
        localStorage.setItem('username', data.username);
        if (data.imagen) {
            localStorage.setItem('imagen', data.imagen);
        }
    },

    getAuthData: () => {
        return {
            token: localStorage.getItem('token'),
            userid: localStorage.getItem('userid'),
            username: localStorage.getItem('username'),
            imagen: localStorage.getItem('imagen'),
        };
    },

    clearAuthData: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userid');
        localStorage.removeItem('username');
        localStorage.removeItem('imagen');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};

export default authService;
