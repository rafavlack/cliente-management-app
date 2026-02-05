import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    userid: null,
    imagen: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.username,
                token: action.payload.token,
                userid: action.payload.userid,
                imagen: action.payload.imagen,
            };
        case 'LOGOUT':
            return {
                ...initialState,
            };
        case 'RESTORE_SESSION':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.username,
                token: action.payload.token,
                userid: action.payload.userid,
                imagen: action.payload.imagen,
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Restore session on mount
    useEffect(() => {
        const authData = authService.getAuthData();
        if (authData.token && authData.username) {
            dispatch({
                type: 'RESTORE_SESSION',
                payload: authData,
            });
        }
    }, []);

    const login = (authData) => {
        authService.saveAuthData(authData);
        dispatch({
            type: 'LOGIN',
            payload: authData,
        });
    };

    const logout = () => {
        authService.clearAuthData();
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
