import Cliente from '../models/Cliente';

class ClienteService {
    // Obtener el último cliente registrado para generar el próximo ID
    async getLastCliente() {
        return await Cliente.findOne().sort({ id: -1 }).exec(); // Ordena por ID descendente y toma el primero
    }

    // Listar todos los clientes de un usuario específico
    async listAllByUserId(userId) {
        return await Cliente.find({ usuarioId: userId }).populate('prestamosActivos').populate('historialPrestamos');
    }

    // Buscar cliente por ID (campo personalizado) y usuario específico
    async findById(id, userId) {
        return await Cliente.findOne({ id, usuarioId: userId }).populate('prestamosActivos').populate('historialPrestamos');
    }

    // Crear un nuevo cliente asociado a un usuario
    async create(data) {
        const cliente = new Cliente(data);
        return await cliente.save();
    }

    // Actualizar un cliente por su ID y usuario
    async update(id, userId, data) {
        return await Cliente.findOneAndUpdate({ id, usuarioId: userId }, data, { new: true });
    }
    

    // Eliminar un cliente por su ID y usuario
    async delete(id, userId) {
        console.log('Buscando cliente con id:', id, 'y usuarioId:', userId);
        const cliente = await Cliente.findOneAndDelete({ id, usuarioId: userId });
        console.log('Cliente encontrado para eliminar:', cliente);
        return cliente;
    }
    
}

export default new ClienteService();
