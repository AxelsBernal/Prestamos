import prestamoService from '../services/prestamo.service';
import clienteService from '../services/cliente.service ';

export const getAllPrestamos = async (req, res) => {
    try {
        const prestamos = await prestamoService.listAll();
        res.status(200).json(prestamos);
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
        const { clienteId } = req.body;

        const cliente = await clienteService.findById(Number(clienteId));
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const prestamo = await prestamoService.create(req.body);
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
        prestamo.saldoRestante -= monto;
        prestamo.pagosRealizados += 1;

        if (prestamo.saldoRestante === 0) {
            prestamo.status = 'liquidado';
            prestamo.fechaTermino = new Date();

            const cliente = await clienteService.findById(prestamo.clienteId);
            if (cliente) {
                cliente.historialPrestamos.push(prestamo.id);
                cliente.prestamosActivos = cliente.prestamosActivos.filter((p) => p !== prestamo.id);
                await clienteService.update(cliente.id, cliente);
            }
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
