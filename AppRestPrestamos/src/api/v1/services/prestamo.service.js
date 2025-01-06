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
    
}

export default new PrestamoService();
