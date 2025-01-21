import clienteService from '../services/cliente.service ';

export const getAllClientes = async (req, res) => {
    try {
        const userId = req.user.userId; // Obtén el ID del usuario desde el middleware de autenticación
        const clientes = await clienteService.listAllByUserId(userId); // Usa el nombre correcto del método
        res.status(200).json(clientes);
    } catch (error) {
        console.error('Error en getAllClientes:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Otros métodos del controlador permanecen sin cambios


export const getClienteById = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del cliente desde los parámetros
        const userId = req.user.userId; // Obtener el userId desde el middleware de autenticación

        // Llamar al método correcto del servicio
        const cliente = await clienteService.findById(Number(id), userId);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json(cliente);
    } catch (error) {
        console.error('Error en getClienteById:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

import ClienteService from "../services/cliente.service .js";

export const createCliente = async (req, res) => {
    try {
        const { nombre, apellidos, telefono, direccion, email } = req.body;

        // Obtener el usuario autenticado desde req.user
        const usuarioId = req.user.userId;

        // Obtener el último cliente registrado
        const lastCliente = await ClienteService.getLastCliente();
        const nextId = lastCliente ? lastCliente.id + 1 : 1;

        // Crear un nuevo cliente
        const newCliente = {
            id: nextId,
            nombre,
            apellidos,
            telefono,
            direccion,
            email,
            usuarioId,
        };

        const cliente = await ClienteService.create(newCliente);

        res.status(201).json({
            message: 'Cliente creado exitosamente',
            cliente,
        });
    } catch (error) {
        console.error('Error en createCliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};




export const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;  // userId extraído del middleware de autenticación
      //  console.log('Actualizando cliente con ID:', id, 'y userId:', userId);
        
        const updatedCliente = await clienteService.update(Number(id), userId, req.body);
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
        const userId = req.user.userId; // Extraer el `userId` del middleware
        const clienteId = parseInt(req.params.id, 10);

        if (!userId) {
           // console.log('Middleware auth: Decoded userId:', req.params.id);
            return res.status(400).json({ message: 'Usuario no autorizado' });
        }

       //console.log('Eliminando cliente con ID:', clienteId, 'y userId:', userId);

        const clienteEliminado = await clienteService.delete(clienteId, userId);
        if (!clienteEliminado) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        console.error('Error en deleteCliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

