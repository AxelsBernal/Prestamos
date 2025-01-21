import Prestamo from '../models/Prestamo';

class PrestamoService {
    // Listar todos los préstamos de un usuario específico
    async listAllByUserId(usuarioId) {
        return await Prestamo.find({ usuarioId });
    }
    

    // Buscar un préstamo por ID y usuario
    async findById(id, userId) {
        return await Prestamo.findOne({ id, userId });
    }

    // Crear un nuevo préstamo asociado a un usuario
    async create(data) {
        const prestamo = new Prestamo(data);
        return await prestamo.save();
    }

    // Actualizar un préstamo por su ID y usuario
    async update(id, userId, data) {
        return await Prestamo.findOneAndUpdate({ id, usuarioId: userId }, data, { new: true });
      }
      
      

    // Eliminar un préstamo por su ID y usuario
    async delete(id, userId) {
        try {
            const result = await Prestamo.findOneAndDelete({ id, usuarioId: userId });
            return result;
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
    

    // Obtener el último ID disponible
    async getLastPrestamoId(userId) {
        try {
            const lastPrestamo = await Prestamo.find({ userId }).sort({ id: -1 }).limit(1); // Ordenar por ID descendente
            return lastPrestamo.length > 0 ? lastPrestamo[0].id : 0; // Retornar el último ID o 0 si no hay préstamos
        } catch (error) {
            console.error("Error in getLastPrestamoId:", error);
            throw error;
        }
    }

    // Buscar el último préstamo de un usuario
    async findLastByUserId(userId) {
        try {
            return await Prestamo.findOne({ usuarioId: userId }).sort({ id: -1 });
        } catch (error) {
            console.error("Error in findLastByUserId:", error);
            throw error;
        }
    }

  
        // Buscar un préstamo por ID y usuarioId
        async findByIdAndUserId(id, usuarioId) {
            try {
                return await Prestamo.findOne({ id, usuarioId });
            } catch (error) {
                console.error("Error in findByIdAndUserId:", error);
                throw error;
            }
        }

    // Obtener un resumen de préstamos por cliente y usuario
   // Obtener un resumen de préstamos por cliente y usuario
async getLoanSummaryByClienteId(clienteId, userId) {
    try {
        // Asegurarse de que clienteId y userId estén en el formato correcto
        const parsedClienteId = typeof clienteId === "string" ? parseInt(clienteId, 10) : clienteId;

        if (isNaN(parsedClienteId)) {
            throw new Error("clienteId debe ser un número válido");
        }

        // Buscar los préstamos relacionados con el clienteId y userId
        const prestamos = await Prestamo.find(
            { clienteId: parsedClienteId, usuarioId: userId },
            { montoPrestado: 1, tipo: 1 } // Seleccionar solo los campos necesarios
        );

        // Verificar si no hay préstamos encontrados
        if (!prestamos || prestamos.length === 0) {
            console.log(`No se encontraron préstamos para clienteId: ${parsedClienteId} y usuarioId: ${userId}`);
            return [];
        }

        return prestamos;
    } catch (error) {
        console.error("Error in getLoanSummaryByClienteId:", error.message);
        throw error;
    }
}

}

export default new PrestamoService();
