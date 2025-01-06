import Cliente from '../models/Cliente';

class ClienteService {
    // Listar todos los clientes
    async listAll() {
        return await Cliente.find().populate('prestamosActivos').populate('historialPrestamos');
    }

    // Buscar cliente por ID (campo personalizado)
    async findById(id) {
        return await Cliente.findOne({ id }).populate('prestamosActivos').populate('historialPrestamos');
    }

    // Crear un nuevo cliente
    async create(data) {
        const cliente = new Cliente(data);
        return await cliente.save();
    }

    // Actualizar un cliente por su ID
    async update(id, data) {
        return await Cliente.findOneAndUpdate({ id }, data, { new: true });
    }

    // Eliminar un cliente por su ID
    async delete(id) {
        return await Cliente.findOneAndDelete({ id });
    }
    
    async findByPrestamoId(prestamoId) {
        return await Cliente.findOne({ prestamosActivos: prestamoId });
    }
    
}

export default new ClienteService();
