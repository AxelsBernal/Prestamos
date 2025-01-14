import prestamoService from '../services/prestamo.service';
import clienteService from '../services/cliente.service ';

export const getAllPrestamos = async (req, res) => {
    try {
        // Obtener todos los préstamos
        const prestamos = await prestamoService.listAll();

        // Obtener los nombres de los clientes asociados a los préstamos
        const prestamosConClientes = await Promise.all(
            prestamos.map(async (prestamo) => {
                const cliente = await clienteService.findById(prestamo.clienteId);
                return {
                    ...prestamo._doc,
                    nombreCliente: cliente ? cliente.nombre : "No encontrado",
                    apellidosCliente: cliente ? cliente.apellidos : "No encontrado",
                };
            })
        );

        res.status(200).json(prestamosConClientes);
    } catch (error) {
        console.error('Error en getAllPrestamos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


export const getPrestamoById = async (req, res) => {
    try {
        const { id } = req.params;
        const prestamo = await prestamoService.findById(Number(id));
        if (!prestamo) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }
        res.status(200).json(prestamo);
    } catch (error) {
        console.error('Error en getPrestamoById:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createPrestamo = async (req, res) => {
    try {
        const { clienteId, tipo, montoPrestado, tasaInteres, fechaInicio } = req.body;

        // Validate clienteId
        const cliente = await clienteService.findById(Number(clienteId));
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Autoincrement ID
        const lastPrestamo = await prestamoService.listAll();
        const newId = lastPrestamo.length > 0 ? Math.max(...lastPrestamo.map(p => p.id)) + 1 : 1;

        // Calculate fields based on tipo
        let montoInteres = 0;
        let montoTotal = 0;
        let saldoRestante = 0;
        let totalPagos = 0;

        if (tipo === 'semanal') {
            // For "semanal", calculate based on payments
            montoInteres = montoPrestado * tasaInteres;
            totalPagos = req.body.totalPagos || 0; // Ensure totalPagos is provided in the request
            montoTotal = montoInteres * totalPagos;
            saldoRestante = montoTotal;
        } else if (tipo === 'mensual') {
            // For "mensual", montoInteres is just a percentage of the montoPrestado
            montoInteres = montoPrestado * tasaInteres;
            montoTotal = 0;
            saldoRestante = 0;
        }

        // Create Prestamo
        const prestamoData = {
            id: newId,
            clienteId,
            tipo,
            montoPrestado,
            tasaInteres,
            montoInteres,
            montoTotal,
            saldoRestante,
            totalPagos: tipo === 'semanal' ? totalPagos : undefined, // Only set for semanal
            fechaInicio,
            status: req.body.status || 'activo',
        };

        const prestamo = await prestamoService.create(prestamoData);

        // Update cliente
        cliente.prestamosActivos.push(prestamo.id);
        await clienteService.update(cliente.id, cliente);

        res.status(201).json(prestamo);
    } catch (error) {
        console.error('Error en createPrestamo:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};





  

export const updatePrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPrestamo = await prestamoService.update(Number(id), req.body);
        if (!updatedPrestamo) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }
        res.status(200).json(updatedPrestamo);
    } catch (error) {
        console.error('Error en updatePrestamo:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const deletePrestamo = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID proporcionado no es válido' });
        }

        const prestamo = await prestamoService.findById(id);
        if (!prestamo) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }

        const cliente = await clienteService.findById(prestamo.clienteId);
        if (cliente) {
            cliente.prestamosActivos = cliente.prestamosActivos.filter(
                (prestamoId) => prestamoId !== id
            );
            await clienteService.update(cliente.id, cliente);
        }

        await prestamoService.delete(id);

        res.status(200).json({ message: 'Préstamo eliminado correctamente' });
    } catch (error) {
        console.error('Error en deletePrestamo:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const addPago = async (req, res) => {
    try {
        const { id } = req.params;
        const { monto, fecha } = req.body;

        const prestamo = await prestamoService.findById(Number(id));
        if (!prestamo) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }

        if (prestamo.status === 'liquidado') {
            return res.status(400).json({ message: 'No se puede agregar un pago a un préstamo liquidado' });
        }

        const folio = prestamo.pagos.length + 1;
        const nuevoPago = { folio, monto, fecha };

        prestamo.pagos.push(nuevoPago);
        prestamo.pagosRealizados += 1;

        // Actualizar saldo restante solo para préstamos semanales
        if (prestamo.tipo === 'semanal') {
            prestamo.saldoRestante -= monto;

            if (prestamo.saldoRestante === 0) {
                prestamo.status = 'liquidado';
                prestamo.fechaTermino = new Date();

                // Actualizar el historial del cliente
                const cliente = await clienteService.findById(prestamo.clienteId);
                if (cliente) {
                    cliente.historialPrestamos.push(prestamo.id);
                    cliente.prestamosActivos = cliente.prestamosActivos.filter((p) => p !== prestamo.id);
                    await clienteService.update(cliente.id, cliente);
                }
            }
        } else if (prestamo.tipo === 'mensual') {
            // No actualizar el saldo restante automáticamente
            // El saldo solo se cambia al liquidar manualmente el préstamo
        }

        const prestamoActualizado = await prestamoService.update(prestamo.id, prestamo);

        res.status(200).json({
            message: 'Pago agregado exitosamente',
            prestamo: prestamoActualizado,
        });
    } catch (error) {
        console.error('Error en addPago:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


export const deletePago = async (req, res) => {
    try {
        const { id, folio } = req.params;

        const prestamo = await prestamoService.findById(Number(id));
        if (!prestamo) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }

        const pagoIndex = prestamo.pagos.findIndex((p) => p.folio === Number(folio));
        if (pagoIndex === -1) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        const montoEliminado = prestamo.pagos[pagoIndex].monto;
        prestamo.pagos.splice(pagoIndex, 1);

        prestamo.saldoRestante += montoEliminado;
        prestamo.pagosRealizados -= 1;

        if (prestamo.saldoRestante > 0 && prestamo.status === 'liquidado') {
            prestamo.status = 'activo';
            prestamo.fechaTermino = null;

            const cliente = await clienteService.findById(prestamo.clienteId);
            if (cliente) {
                cliente.historialPrestamos = cliente.historialPrestamos.filter((p) => p !== prestamo.id);
                cliente.prestamosActivos.push(prestamo.id);
                await clienteService.update(cliente.id, cliente);
            }
        }

        const prestamoActualizado = await prestamoService.update(prestamo.id, prestamo);

        res.status(200).json({
            message: 'Pago eliminado exitosamente',
            prestamo: prestamoActualizado,
        });
    } catch (error) {
        console.error('Error en deletePago:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const editPago = async (req, res) => {
    try {
        const { id, folio } = req.params;
        const { monto, fecha } = req.body;

        const prestamo = await prestamoService.findById(Number(id));
        if (!prestamo) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }

        const pagoIndex = prestamo.pagos.findIndex((p) => p.folio === Number(folio));
        if (pagoIndex === -1) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        const montoAnterior = prestamo.pagos[pagoIndex].monto;
        prestamo.pagos[pagoIndex].monto = monto;
        prestamo.pagos[pagoIndex].fecha = fecha;

        if (monto > montoAnterior) {
            prestamo.saldoRestante -= (monto - montoAnterior);
        } else if (monto < montoAnterior) {
            prestamo.saldoRestante += (montoAnterior - monto);
        }

        if (prestamo.saldoRestante === 0) {
            prestamo.status = 'liquidado';
            prestamo.fechaTermino = new Date();

            const cliente = await clienteService.findById(prestamo.clienteId);
            if (cliente) {
                if (!cliente.historialPrestamos.includes(prestamo.id)) {
                    cliente.historialPrestamos.push(prestamo.id);
                }
                cliente.prestamosActivos = cliente.prestamosActivos.filter((p) => p !== prestamo.id);
                await clienteService.update(cliente.id, cliente);
            }
        } else if (prestamo.status === 'liquidado' && prestamo.saldoRestante > 0) {
            prestamo.status = 'activo';
            prestamo.fechaTermino = null;

            const cliente = await clienteService.findById(prestamo.clienteId);
            if (cliente) {
                cliente.historialPrestamos = cliente.historialPrestamos.filter((p) => p !== prestamo.id);
                cliente.prestamosActivos.push(prestamo.id);
                await clienteService.update(cliente.id, cliente);
            }
        }

        const prestamoActualizado = await prestamoService.update(prestamo.id, prestamo);

        res.status(200).json({
            message: 'Pago editado exitosamente',
            prestamo: prestamoActualizado,
        });
    } catch (error) {
        console.error('Error en editPago:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getPagosPorCliente = async (req, res) => {
    try {
        const clienteId = parseInt(req.params.clienteId, 10);

        // Busca los préstamos del cliente
        const prestamos = await prestamoService.listAll(); // Lista todos los préstamos
        const clientePrestamos = prestamos.filter(prestamo => prestamo.clienteId === clienteId);

        // Obtener información detallada de pagos
        const pagos = clientePrestamos.flatMap(prestamo => 
            prestamo.pagos.map((pago, index) => ({
                cliente: `${prestamo.clienteId}`, // Aquí puedes vincular el nombre del cliente si lo tienes en otro servicio
                prestamo: prestamo.montoPrestado,
                numeroPago: index + 1,
                montoPago: pago.monto,
                fechaPago: pago.fecha
            }))
        );

        res.status(200).json(pagos);
    } catch (error) {
        console.error("Error en getPagosPorCliente:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getLoanSummaryByClienteId = async (req, res) => {
    const { clienteId } = req.params;

    try {
        const prestamos = await prestamoService.getLoanSummaryByClienteId(clienteId);

        if (!prestamos || prestamos.length === 0) {
            return res.status(404).json({ message: "No loans found for the specified client" });
        }

        const summary = {
            clienteId,
            totalPrestamos: prestamos.length,
            detallesPrestamos: prestamos.map((prestamo) => ({
                montoPrestado: prestamo.montoPrestado,
                tipo: prestamo.tipo
            }))
        };

        res.status(200).json(summary);
    } catch (error) {
        console.error("Error in getLoanSummaryByClienteId:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

import PrestamoService from "../services/prestamo.service.js";

export const obtenerResumenPrestamos = async (req, res) => {
    try {
        const prestamos = await PrestamoService.listAll();

        let totalCapital = 0;
        let totalGanancias = 0;
        const totalPrestamos = prestamos.length;

        prestamos.forEach(prestamo => {
            if (prestamo.tipo === "semanal") {
                prestamo.pagos.forEach(pago => {
                    if (prestamo.pagosRealizados > 10) {
                        // A partir del pago número 11 es ganancia
                        totalGanancias += pago.monto || 0;
                    } else {
                        // Antes del pago número 11 es capital
                        totalCapital += pago.monto || 0;
                    }
                });
            } else if (prestamo.tipo === "mensual") {
                // Todos los pagos de préstamos mensuales son ganancia
                prestamo.pagos.forEach(pago => {
                    totalGanancias += pago.monto || 0;
                });
            }
        });

        res.status(200).json({
            totalPrestamos,
            totalCapital,
            totalGanancias,
        });
    } catch (error) {
        console.error("Error en obtenerResumenPrestamos:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

export const getPagosPorPrestamo = async (req, res) => {
    try {
        const prestamoId = parseInt(req.params.prestamoId, 10); // Asegúrate de que prestamoId sea un número
        console.log("Buscando préstamo con ID:", prestamoId);

        // Busca el préstamo por ID
        const prestamo = await prestamoService.findById(prestamoId);

        if (!prestamo) {
            return res.status(404).json({ message: "Préstamo no encontrado" });
        }

        console.log("Préstamo encontrado:", prestamo);

        // Obtén los pagos del préstamo
        const pagos = prestamo.pagos.map((pago, index) => ({
            numeroPago: index + 1,
            montoPago: pago.monto,
            fechaPago: pago.fecha,
        }));

        console.log("Pagos del préstamo:", pagos);

        res.status(200).json(pagos);
    } catch (error) {
        console.error("Error en getPagosPorPrestamo:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};


export const getPagosPorClienteYPrestamo = async (req, res) => {
    try {
        const clienteId = parseInt(req.params.clienteId, 10);
        const prestamoId = parseInt(req.params.prestamoId, 10);

        console.log(`Buscando pagos para clienteId: ${clienteId}, prestamoId: ${prestamoId}`);

        // Busca el préstamo específico del cliente
        const prestamo = await prestamoService.findById(prestamoId);

        if (!prestamo) {
            return res.status(404).json({ message: "Préstamo no encontrado" });
        }

        // Validar que el préstamo pertenece al cliente
        if (prestamo.clienteId !== clienteId) {
            return res.status(400).json({ message: "El préstamo no pertenece al cliente especificado" });
        }

        // Buscar información del cliente
        const cliente = await clienteService.findById(clienteId);

        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        // Formatear la respuesta con la información del préstamo y los pagos
        const resultado = {
            idPrestamo: prestamo.id,
            idCliente: prestamo.clienteId,
            nombreCliente: `${cliente.nombre} ${cliente.apellidos}`, // Combinar nombre y apellidos del cliente
            montoPrestado: prestamo.montoPrestado,
            montoTotal: prestamo.montoTotal,
            saldoRestante: prestamo.saldoRestante,
            fechaInicio: new Date(prestamo.fechaInicio).toLocaleDateString("es-MX"),
            pagos: prestamo.pagos.map((pago, index) => ({
                numeroPago: index + 1,
                montoPago: pago.monto,
                fechaPago: new Date(pago.fecha).toLocaleDateString("es-MX"),
            })),
        };

        console.log("Resultado para cliente y préstamo:", resultado);

        res.status(200).json(resultado);
    } catch (error) {
        console.error("Error en getPagosPorClienteYPrestamo:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getAllPagos = async (req, res) => {
    try {
        // Fetch all loans
        const prestamos = await prestamoService.listAll();

        // Fetch payments from all loans
        const allPagos = await Promise.all(
            prestamos.flatMap(async (prestamo) => {
                const cliente = await clienteService.findById(prestamo.clienteId);
                return prestamo.pagos.map((pago) => ({
                    nombreCliente: cliente ? `${cliente.nombre} ${cliente.apellidos}` : "No encontrado",
                    montoPrestado: prestamo.montoPrestado,
                    folio: pago.folio,
                    monto: pago.monto,
                    fecha: pago.fecha,
                }));
            })
        );

        res.status(200).json(allPagos.flat());
    } catch (error) {
        console.error("Error in getAllPagos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

