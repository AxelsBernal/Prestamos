import Prestamo from '../models/Prestamo';

class PrestamoService {
    async listAll() {
        return await Prestamo.find();
    }

    async findById(id) {
        return await Prestamo.findOne({ id });
    }

    async create(data) {
        const prestamo = new Prestamo(data);
        return await prestamo.save();
    }

    async update(id, data) {
        return await Prestamo.findOneAndUpdate({ id }, data, { new: true });
    }

    async delete(id) {
        return await Prestamo.findOneAndDelete({ id });
    }

    async findByClienteId(clienteId) {
        try {
            return await Prestamo.find({ clienteId });
        } catch (error) {
            console.error("Error in findByClienteId:", error);
            throw error;
        }
    }

    async getLoanSummaryByClienteId(clienteId) {
        try {
            const prestamos = await Prestamo.find({ clienteId }, { montoPrestado: 1, tipo: 1 }); // Select only necessary fields
            return prestamos;
        } catch (error) {
            console.error("Error in getLoanSummaryByClienteId:", error);
            throw error;
        }
    }
    
    
}

export default new PrestamoService();
