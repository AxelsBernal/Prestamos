import prestamoService from "../services/prestamo.service";
import clienteService from "../services/cliente.service .js";

// Get all loans filtered by user
export const getAllPrestamos = async (req, res) => {
  try {
    const { userId } = req.user; // Asegúrate de que `usuarioId` es lo que esperas
   // console.log("Fetching prestamos for userId:", userId);

    // Fetch all loans associated with the user
    const prestamos = await prestamoService.listAllByUserId(userId);
   // console.log("Prestamos fetched:", prestamos);

    // Map to add client details
    const prestamosConClientes = await Promise.all(
      prestamos.map(async (prestamo) => {
        const cliente = await clienteService.findById(prestamo.clienteId, userId);
       // console.log("Client for prestamo:", prestamo.id, cliente);
        return {
          ...prestamo._doc,
          nombreCliente: cliente ? cliente.nombre : "No encontrado",
          apellidosCliente: cliente ? cliente.apellidos : "No encontrado",
        };
      })
    );

    res.status(200).json(prestamosConClientes);
  } catch (error) {
    console.error("Error en getAllPrestamos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};




          // Get a specific loan by ID and user
          // Obtener un préstamo específico por ID y usuario
          export const getPrestamoById = async (req, res) => {
            try {
              const { id } = req.params;
              const { userId } = req.user;

              // Usar el servicio para buscar el préstamo
              const prestamo = await prestamoService.findByIdAndUserId(Number(id), userId);
              if (!prestamo) {
                return res.status(404).json({ message: "Préstamo no encontrado" });
              }

              res.status(200).json(prestamo);
            } catch (error) {
              console.error("Error en getPrestamoById:", error);
              res.status(500).json({ message: "Error interno del servidor" });
            }
          };


// Create a loan
export const createPrestamo = async (req, res) => {
  try {
    const { clienteId, tipo, montoPrestado, tasaInteres, fechaInicio } = req.body;
    const { userId } = req.user;

    // Validar que el cliente existe y pertenece al usuario autenticado
    const cliente = await clienteService.findById(clienteId, userId);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado o no pertenece al usuario" });
    }

    // Obtener el último ID de préstamo desde la base de datos
    const lastPrestamo = await prestamoService.findLastByUserId(userId);
    console.log('UsuarioID: ',userId);
    console.log('newId: ',userId);
    const newId = lastPrestamo ? lastPrestamo.id + 1 : 1;    
    console.log('nuevo newId: ',userId);
    // Calcular montos según el tipo de préstamo
    let montoInteres = 0;
    let montoTotal = 0;
    let saldoRestante = 0;
    let totalPagos = 0;

    if (tipo === "semanal") {
      montoInteres = montoPrestado * tasaInteres;
      totalPagos = req.body.totalPagos || 0;
      montoTotal = montoInteres * totalPagos;
      saldoRestante = montoTotal;
    } else if (tipo === "mensual") {
      montoInteres = montoPrestado * tasaInteres;
      montoTotal = montoInteres;
      saldoRestante = montoTotal;
    }

    // Preparar datos para el préstamo
    const prestamoData = {
      id: newId,
      clienteId,
      tipo,
      montoPrestado,
      tasaInteres,
      montoInteres,
      montoTotal,
      saldoRestante,
      totalPagos: tipo === "semanal" ? totalPagos : undefined,
      fechaInicio,
      status: req.body.status || "activo",
      usuarioId: userId,
    };

    // Crear el préstamo
    const prestamo = await prestamoService.create(prestamoData);

    // Asociar el préstamo al cliente
    cliente.prestamosActivos.push(prestamo.id);
    await clienteService.update(cliente.id, userId, cliente);

    res.status(201).json(prestamo);
  } catch (error) {
    console.error("Error en createPrestamo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};



// Update a loan
export const updatePrestamo = async (req, res) => {
  try {
    const { id } = req.params; // ID del préstamo
    const { userId } = req.user; // ID del usuario desde el token

   // console.log("ID del préstamo:", id);
    //console.log("User ID del token:", userId);

    // Llamada al servicio para actualizar el préstamo
    const updatedPrestamo = await prestamoService.update(Number(id), userId, req.body);

    if (!updatedPrestamo) {
   //   console.log("Préstamo no encontrado para ID:", id, "y usuario:", userId);
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }

    //console.log("Préstamo actualizado:", updatedPrestamo);

    res.status(200).json(updatedPrestamo);
  } catch (error) {
    console.error("Error en updatePrestamo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};



// Delete a loan
export const deletePrestamo = async (req, res) => {
  try {
    const { id } = req.params; // ID del préstamo a eliminar
    const { userId } = req.user; // ID del usuario autenticado

    // Buscar el préstamo por ID y usuario
    const prestamo = await prestamoService.findByIdAndUserId(Number(id), userId);
    if (!prestamo) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }

    // Eliminar el préstamo
    await prestamoService.delete(Number(id), userId);

    // Buscar al cliente asociado con el préstamo
    const cliente = await clienteService.findById(prestamo.clienteId, userId);
    if (cliente) {
      // Actualizar el cliente para remover el préstamo de sus préstamos activos
      cliente.prestamosActivos = cliente.prestamosActivos.filter((p) => p !== prestamo.id);
      await clienteService.update(cliente.id, userId, cliente);
    }

    res.status(200).json({ message: "Préstamo eliminado exitosamente" });
  } catch (error) {
    console.error("Error en deletePrestamo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};




// Add a payment to a loan
export const addPago = async (req, res) => {
  try {
    const { id } = req.params; // ID del préstamo
    const { monto, fecha } = req.body; // Datos del pago
    const { userId } = req.user; // ID del usuario autenticado

    // Buscar el préstamo por ID y usuario
    const prestamo = await prestamoService.findByIdAndUserId(Number(id), userId);
    if (!prestamo) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }

    // Calcular el folio del nuevo pago
    const folio = prestamo.pagos.length + 1;

    // Crear el nuevo pago
    const nuevoPago = { folio, monto, fecha };
    prestamo.pagos.push(nuevoPago);

    // Actualizar el saldo restante y el estado del préstamo
    if (prestamo.tipo === "semanal" && prestamo.saldoRestante > 0) {
      prestamo.saldoRestante -= monto;
      if (prestamo.saldoRestante <= 0) {
        prestamo.status = "liquidado"; // Cambiar estado a liquidado si se salda el préstamo
      }
    }

    prestamo.pagosRealizados += 1; // Incrementar pagos realizados

    // Actualizar el préstamo en la base de datos
    const prestamoActualizado = await prestamoService.update(prestamo.id, userId, prestamo);

    res.status(201).json({ message: "Pago agregado exitosamente", prestamo: prestamoActualizado });
  } catch (error) {
    console.error("Error en addPago:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const deletePago = async (req, res) => {
  try {
    const { id, folio } = req.params; // `id` is the loan ID, and `folio` is the payment identifier
    const { userId } = req.user; // Extract user ID from auth middleware

    // Fetch the loan associated with the user
    const prestamo = await prestamoService.findByIdAndUserId(Number(id), userId);
    if (!prestamo) {
      return res.status(404).json({ message: "Préstamo no encontrado o no pertenece al usuario" });
    }

    // Find the index of the payment to delete
    const pagoIndex = prestamo.pagos.findIndex((p) => p.folio === Number(folio));
    if (pagoIndex === -1) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    // Remove the payment and adjust loan details
    const montoEliminado = prestamo.pagos[pagoIndex].monto; // Store the amount being removed
    prestamo.pagos.splice(pagoIndex, 1); // Remove the payment from the array

    // Update the loan details after payment removal
    prestamo.saldoRestante += montoEliminado; // Restore the amount to the remaining balance
    prestamo.pagosRealizados -= 1; // Decrement the count of completed payments

    // Change loan status if applicable
    if (prestamo.saldoRestante > 0 && prestamo.status === "liquidado") {
      prestamo.status = "activo"; // Revert the loan status to active
      prestamo.fechaTermino = null; // Remove the completion date
    }

    // Save the updated loan details
    const prestamoActualizado = await prestamoService.update(prestamo.id, userId, prestamo);

    // Respond with success
    res.status(200).json({
      message: "Pago eliminado exitosamente",
      prestamo: prestamoActualizado,
    });
  } catch (error) {
    console.error("Error en deletePago:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};



export const editPago = async (req, res) => {
  try {
    const { id, folio } = req.params;
    const { monto, fecha } = req.body;
    const { userId } = req.user; // Asegura que solo afecta préstamos del usuario

    // Busca el préstamo por ID y usuario
    const prestamo = await prestamoService.findByIdAndUserId(Number(id), userId);
    if (!prestamo) {
      return res.status(404).json({ message: "Préstamo no encontrado o no pertenece al usuario" });
    }

    // Encuentra el índice del pago específico
    const pagoIndex = prestamo.pagos.findIndex((p) => p.folio === Number(folio));
    if (pagoIndex === -1) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    // Actualiza el pago y ajusta los montos en el préstamo
    const montoAnterior = prestamo.pagos[pagoIndex].monto;
    prestamo.pagos[pagoIndex].monto = monto;
    prestamo.pagos[pagoIndex].fecha = fecha;

    if (monto > montoAnterior) {
      prestamo.saldoRestante -= monto - montoAnterior;
    } else if (monto < montoAnterior) {
      prestamo.saldoRestante += montoAnterior - monto;
    }

    // Ajusta el estado del préstamo según el saldo restante
    if (prestamo.saldoRestante === 0) {
      prestamo.status = "liquidado";
      prestamo.fechaTermino = new Date();
    } else if (prestamo.status === "liquidado" && prestamo.saldoRestante > 0) {
      prestamo.status = "activo";
      prestamo.fechaTermino = null;
    }

    // Actualiza el préstamo en la base de datos
    const prestamoActualizado = await prestamoService.update(prestamo.id, userId, prestamo);

    res.status(200).json({
      message: "Pago editado exitosamente",
      prestamo: prestamoActualizado,
    });
  } catch (error) {
    console.error("Error en editPago:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};



export const getPagosPorCliente = async (req, res) => {
  try {
      const clienteId = parseInt(req.params.clienteId, 10);
      const { userId } = req.user; // Obtener el ID del usuario autenticado

      // Buscar los préstamos asociados al cliente y usuario
      const prestamos = await prestamoService.listAllByUserId(userId);
      const clientePrestamos = prestamos.filter(prestamo => prestamo.clienteId === clienteId);

      if (clientePrestamos.length === 0) {
          return res.status(404).json({ message: "No se encontraron préstamos para este cliente" });
      }

      // Obtener información detallada de los pagos
      const pagos = clientePrestamos.flatMap(prestamo => 
          prestamo.pagos.map((pago, index) => ({
              clienteId: prestamo.clienteId,
              prestamoId: prestamo.id,
              numeroPago: index + 1,
              montoPago: pago.monto,
              fechaPago: pago.fecha,
              saldoRestante: prestamo.saldoRestante,
          }))
      );

      res.status(200).json(pagos);
  } catch (error) {
      console.error("Error en getPagosPorCliente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const getLoanSummaryByClienteId = async (req, res) => {
  try {
      const { clienteId } = req.params; // ID del cliente desde los parámetros de la URL
      const { userId } = req.user; // ID del usuario autenticado desde el middleware de autenticación

      // Obtener los préstamos asociados al cliente y al usuario
      const prestamos = await prestamoService.getLoanSummaryByClienteId(clienteId, userId);

      if (!prestamos || prestamos.length === 0) {
          return res.status(404).json({ message: "No se encontraron préstamos para el cliente especificado" });
      }

      // Crear un resumen con el total de préstamos y los detalles necesarios
      const resumen = {
          clienteId,
          totalPrestamos: prestamos.length,
          detallesPrestamos: prestamos.map(prestamo => ({
              montoPrestado: prestamo.montoPrestado,
              tipo: prestamo.tipo
          }))
      };

      res.status(200).json(resumen);
  } catch (error) {
      console.error("Error en getLoanSummaryByClienteId:", error);
      res.status(500).json({ message: "Error interno del servidor" });
  }
};


import PrestamoService from "../services/prestamo.service.js";

export const obtenerResumenPrestamos = async (req, res) => {
  try {
    const { userId } = req.user; // Ensure the user ID is properly obtained
    const prestamos = await PrestamoService.listAllByUserId(userId);

    let totalCapital = 0; // Suma del capital pendiente
    let totalGanancias = 0; // Suma de las ganancias totales
    const totalPrestamos = prestamos.length; // Total de préstamos registrados

    prestamos.forEach((prestamo) => {
      if (prestamo.tipo === "semanal") {
        // Solo los primeros 10 pagos son capital
        const pagosCapital = Math.min(prestamo.totalPagos, 10);

        prestamo.pagos.forEach((pago, index) => {
          if (index + 1 <= pagosCapital) {
            // Los primeros 10 pagos se descuentan del capital
            totalCapital -= pago.monto;
          } else {
            // A partir del pago 11 son ganancias
            totalGanancias += pago.monto;
          }
        });

        // Agregamos el monto inicial del préstamo al capital total
        totalCapital += prestamo.montoPrestado;
      } else if (prestamo.tipo === "mensual") {
        // Todos los pagos de préstamos mensuales son ganancias
        prestamo.pagos.forEach((pago) => {
          totalGanancias += pago.monto;
        });

        // Si el préstamo no está liquidado, aún se suma el monto inicial al capital total
        if (prestamo.status !== "liquidado") {
          totalCapital += prestamo.montoPrestado;
        }
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
      const { prestamoId } = req.params; // Se obtiene el ID del préstamo desde los parámetros
      const { userId } = req.user; // Se obtiene el ID del usuario autenticado

     // console.log("Buscando préstamo con ID:", prestamoId, "y usuario ID:", userId);

      // Busca el préstamo por ID y usuario
      const prestamo = await prestamoService.findByIdAndUserId(Number(prestamoId), userId);

      if (!prestamo) {
          return res.status(404).json({ message: "Préstamo no encontrado o no pertenece al usuario" });
      }

      //console.log("Préstamo encontrado:", prestamo);

      // Obtén los pagos del préstamo
      const pagos = prestamo.pagos.map((pago, index) => ({
          numeroPago: index + 1,
          montoPago: pago.monto,
          fechaPago: pago.fecha,
      }));

      //console.log("Pagos del préstamo:", pagos);

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
      const { userId } = req.user;

     // console.log(`Buscando pagos para clienteId: ${clienteId}, prestamoId: ${prestamoId}`);

      // Busca el préstamo específico del cliente y usuario
      const prestamo = await prestamoService.findByIdAndUserId(prestamoId, userId);

      if (!prestamo) {
          return res.status(404).json({ message: "Préstamo no encontrado" });
      }

      // Validar que el préstamo pertenece al cliente especificado
      if (prestamo.clienteId !== clienteId) {
          return res.status(400).json({ message: "El préstamo no pertenece al cliente especificado" });
      }

      // Buscar información del cliente
      const cliente = await clienteService.findById(clienteId, userId);

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

      //console.log("Resultado para cliente y préstamo:", resultado);

      res.status(200).json(resultado);
  } catch (error) {
      console.error("Error en getPagosPorClienteYPrestamo:", error);
      res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const getAllPagos = async (req, res) => {
  try {
      // Fetch all loans for the logged-in user
      const { userId } = req.user;
      const prestamos = await prestamoService.listAllByUserId(userId);

      if (!prestamos || prestamos.length === 0) {
          return res.status(404).json({ message: "No se encontraron préstamos para el usuario especificado." });
      }

      // Fetch payments from all loans
      const allPagos = await Promise.all(
          prestamos.flatMap(async (prestamo) => {
              // Fetch client details for each loan
              const cliente = await clienteService.findById(prestamo.clienteId, userId);

              // Format payment details
              return prestamo.pagos.map((pago) => ({
                  prestamoId: prestamo.id,
                  nombreCliente: cliente ? `${cliente.nombre} ${cliente.apellidos}` : "No encontrado",
                  montoPrestado: prestamo.montoPrestado,
                  folio: pago.folio,
                  monto: pago.monto,
                  fecha: pago.fecha,
              }));
          })
      );

      // Flatten and return all payments
      res.status(200).json(allPagos.flat());
  } catch (error) {
      console.error("Error in getAllPagos:", error);
      res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const getMontoTotalPorMes = async (req, res) => {
  try {
    const { mes, anio } = req.query; // Recibe mes (1-12) y año como parámetros
    const { userId } = req.user; // ID del usuario autenticado

    // Validar que mes y año sean válidos
    if (!mes || !anio || isNaN(mes) || isNaN(anio)) {
      return res.status(400).json({ message: "Mes y año son requeridos y deben ser números válidos" });
    }

    // Crear rango de fechas para el mes solicitado
    const fechaInicio = new Date(anio, mes - 1, 1); // Primer día del mes
    const fechaFin = new Date(anio, mes, 0, 23, 59, 59); // Último día del mes

    // Obtener préstamos asociados al usuario
    const prestamos = await prestamoService.listAllByUserId(userId);

    // Filtrar pagos dentro del rango de fechas y sumar montos
    const montoTotal = prestamos.flatMap((prestamo) =>
      prestamo.pagos.filter((pago) => pago.fecha >= fechaInicio && pago.fecha <= fechaFin)
    ).reduce((total, pago) => total + pago.monto, 0);

    res.status(200).json({ montoTotal });
  } catch (error) {
    console.error("Error en getMontoTotalPorMes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};




