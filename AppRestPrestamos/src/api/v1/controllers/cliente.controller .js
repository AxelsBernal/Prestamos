import clienteService from '../services/cliente.service ';

export const getAllClientes = async (req, res) => {
    try {
        const clientes = await clienteService.listAll();
        res.status(200).json(clientes);
    } catch (error) {
        console.error('Error en getAllClientes:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await clienteService.findById(Number(id));
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json(cliente);
    } catch (error) {
        console.error('Error en getClienteById:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createCliente = async (req, res) => {
    try {
        const cliente = await clienteService.create(req.body);
        res.status(201).json(cliente);
    } catch (error) {
        console.error('Error en createCliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCliente = await clienteService.update(Number(id), req.body);
        if (!updatedCliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json(updatedCliente);
    } catch (error) {
        console.error('Error en updateCliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCliente = await clienteService.delete(Number(id));
        if (!deletedCliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        console.error('Error en deleteCliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
