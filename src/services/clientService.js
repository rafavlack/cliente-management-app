import api from './api';

const clientService = {
    // Get list of clients with optional filters
    listClients: async (identificacion = '', nombre = '', usuarioId) => {
        const response = await api.post('/api/Cliente/Listado', {
            identificacion,
            nombre,
            usuarioId,
        });
        return response.data;
    },

    // Get client by ID
    getClient: async (clientId) => {
        const response = await api.get(`/api/Cliente/Obtener/${clientId}`);
        return response.data;
    },

    // Create new client
    createClient: async (clientData) => {
        const response = await api.post('/api/Cliente/Crear', clientData);
        return response.data;
    },

    // Update existing client
    updateClient: async (clientData) => {
        const response = await api.post('/api/Cliente/Actualizar', clientData);
        return response.data;
    },

    // Delete client
    deleteClient: async (clientId) => {
        const response = await api.delete(`/api/Cliente/Eliminar/${clientId}`);
        return response.data;
    },

    // Get interests list
    getInterests: async () => {
        const response = await api.get('/api/Intereses/Listado');
        return response.data;
    },
};

export default clientService;
