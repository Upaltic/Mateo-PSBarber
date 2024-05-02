const Agenda = require("../../models/agenda/modelAgenda");
const Empleado = require("../../models/empleado/modelEmpleado")
const Cliente = require("../../models/clientes/modelClientes")
const Servicio = require("../../models/servicio/modelServicio")
const DetalleServicio = require("../../models/agenda/modelDetalleServicio")
const sequelize=require("../../database/db");
const { Op, and } = require("sequelize");
const { Sequelize } = require("sequelize");


const ventasSemanales = async (req, res) => {
  try {
      const query = `
      SELECT DAYNAME(fecha) AS dia_semana, COUNT(*) AS citas_por_dia FROM agendas WHERE YEARWEEK(fecha) = YEARWEEK(CURRENT_DATE()) GROUP BY DAYNAME(fecha) ORDER BY FIELD(DAYNAME(fecha), 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo');`;

      const ventasM = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

      res.json(ventasM);
  } catch (error) {
      console.error('Error al obtener el análisis de ventasS:', error);
      res.status(500).json({ error: 'Error al obtener el análisis de ventasS' });
  }
};
const ventasMensuales = async (req, res) => {
  try {
      const query = `
      SELECT DATE_FORMAT(agendas.fecha, '%Y-%m') AS mes, SUM(servicios.precio) AS ventas_mensuales
FROM agendas
JOIN detalle_servicios ON agendas.id_agenda = detalle_servicios.id_agenda
JOIN servicios ON detalle_servicios.id_servicio = servicios.id_servicio
WHERE agendas.estado_pago = true
GROUP BY DATE_FORMAT(agendas.fecha, '%Y-%m')
ORDER BY DATE_FORMAT(agendas.fecha, '%Y-%m') ASC;
`;

      const ventasM = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

      res.json(ventasM);
  } catch (error) {
      console.error('Error al obtener el análisis de ventasM:', error);
      res.status(500).json({ error: 'Error al obtener el análisis de ventasM' });
  }
};

const analisisCitas = async (req, res) => {
  try {
      const query = `
      SELECT agendas.fecha, agendas.hora, clientes.nombre AS nombre_cliente, GROUP_CONCAT(servicios.nombre SEPARATOR ', ') AS servicios_realizados FROM agendas LEFT JOIN clientes ON agendas.documento = clientes.documento LEFT JOIN detalle_servicios ON agendas.id_Agenda = detalle_servicios.id_agenda LEFT JOIN servicios ON detalle_servicios.id_servicio = servicios.id_servicio WHERE agendas.fecha >= CURDATE() AND STR_TO_DATE(CONCAT(agendas.fecha, ' ', agendas.hora), '%Y-%m-%d %h:%i%p') >= NOW() GROUP BY agendas.id_Agenda ORDER BY agendas.fecha ASC, STR_TO_DATE(CONCAT(agendas.fecha, ' ', agendas.hora), '%Y-%m-%d %h:%i%p') ASC;
      `;

      const citas = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

      res.json(citas);
  } catch (error) {
      console.error('Error al obtener el análisis de citas:', error);
      res.status(500).json({ error: 'Error al obtener el análisis de citas' });
  }
};

async function clienteConMasCitas(req, res) {
  try {
    const query = `
    SELECT c.nombre, COUNT(a.documento) AS total_citas FROM agendas AS a INNER JOIN clientes AS c ON a.documento = c.documento WHERE MONTH(a.fecha) = MONTH(CURRENT_DATE()) AND YEAR(a.fecha) = YEAR(CURRENT_DATE()) GROUP BY a.documento ORDER BY total_citas DESC LIMIT 1;
    `;

    const resultado = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (resultado.length === 0) {
      return res.status(404).json({ error: "No se encontraron clientes con citas" });
    }

    res.json(resultado[0]);
  } catch (error) {
    console.error('Error al obtener el cliente con más citas:', error);
    res.status(500).json({ error: 'Error al obtener el cliente con más citas' });
  }
}

const getTotalCitasMes = async () => {
  try {
      // Obtener la fecha de inicio y fin del mes actual (sin la hora)
      const fechaInicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const fechaFinMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

      // Consultar las citas que ocurrieron dentro del mes actual (sin la hora)
      const totalCitasMes = await Agenda.count({
          where: {
              fecha: {
                  [Op.between]: [fechaInicioMes, fechaFinMes]
              }
          }
      });

      return totalCitasMes;
  } catch (error) {
      console.error('Error al obtener el total de citas en el mes:', error);
      throw error;
  }
};

// async function totalPagado(req, res) {
//   try {
//     const totalPagado = await DetalleServicio.sum('Servicio.precio', {
//       include: [{
//         model: Servicio,
//         attributes: [],
//       }, {
//         model: Agenda,
//         attributes: [],
//         where: { estado_pago: false }
//       }]
//     });

//     res.json({ totalPagado });
//   } catch (error) {
//     console.error('Error al obtener el total pagado:', error);
//     res.status(500).json({ error: 'Error al obtener el total pagado' });
//   }
// }

const totalPagado = async (req, res) => {
  try {
    const query = `
      SELECT SUM(servicios.precio) AS totalPagado
      FROM detalle_servicios
      INNER JOIN servicios ON detalle_servicios.id_Servicio = servicios.id_Servicio
      INNER JOIN agendas ON detalle_servicios.id_Agenda = agendas.id_agenda
      WHERE agendas.estado_pago = false;
    `;

    const totalPagadoResult = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

    // Devolver el resultado como un objeto JSON con la clave totalPagado
    res.json({ totalPagado: totalPagadoResult[0].totalPagado });
  } catch (error) {
    console.error('Error al obtener el análisis de total de pago:', error);
    res.status(500).json({ error: 'Error al obtener el análisis total de pago' });
  }
};



async function totalCitasEnMesActual(req, res) {
  try {
      // Obtener el año y mes actual
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // Sumamos 1 porque los meses en JavaScript son 0-indexados

      // Construir la fecha de inicio y fin del mes actual
      const startDate = new Date(currentYear, currentMonth - 1, 1); // El mes en JavaScript es 0-indexado
      const endDate = new Date(currentYear, currentMonth, 0); // 0 del siguiente mes equivale al último día del mes actual

      // Realizar la consulta para contar las citas en el mes actual
      const totalCitas = await Agenda.count({
          where: {
              fecha: {
                  [Op.between]: [startDate, endDate],
              },
          },
      });

      // Enviar el total de citas como respuesta
      res.json({ totalCitas });
  } catch (error) {
      console.error('Error al obtener el total de citas en el mes actual:', error);
      res.status(500).json({ error: 'Error al obtener el total de citas en el mes actual' });
  }
}

async function resumenDiario(req, res) {
  try {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM agendas WHERE DATE(fecha) = CURDATE()) AS citas_programadas,
        (SELECT COUNT(*) FROM detalle_servicios JOIN agendas ON detalle_servicios.id_agenda = agendas.id_agenda WHERE DATE(agendas.fecha) = CURDATE()) AS servicios_realizados,
        (SELECT COUNT(*) FROM agendas WHERE DATE(fecha) = CURDATE() AND estado_pago = false) AS pagos_recibidos;
    `;

    const [result] = await sequelize.query(query);

    const { citas_programadas, servicios_realizados, pagos_recibidos } = result[0];

    res.json({ citas_programadas, servicios_realizados, pagos_recibidos });
  } catch (error) {
    console.error('Error al obtener el resumen diario:', error);
    res.status(500).json({ error: 'Error al obtener el resumen diario' });
  }
}

async function servicioMasSolicitado(req, res) {
  try {
    const resultado = await DetalleServicio.findAll({
      attributes: [
        [sequelize.literal('COUNT(*)'), 'total_solicitudes'],
        'id_servicio'
      ],
      include: [
        {
          model: Servicio,
          attributes: ['nombre']
        }
      ],
      group: ['detalle_servicios.id_servicio'],
      order: [[sequelize.literal('total_solicitudes'), 'DESC']],
      limit: 1
    });

    if (resultado.length === 0) {
      return res.status(404).json({ error: "No se encontraron servicios solicitados" });
    }

    res.json(resultado[0]);
  } catch (error) {
    console.error('Error al obtener el servicio más solicitado:', error);
    res.status(500).json({ error: 'Error al obtener el servicio más solicitado' });
  }
}


async function listarCitas(req, res) {
  try {
    const agendaConCliente = await Agenda.findAll({
      include: [
        {
          model: Cliente,
          attributes: ["nombre", "apellidos", "telefono"],
        },
      ],
      attributes: [
        "id_Agenda",
        "fecha",
        "hora",
        "estado",
        "estado_Pago"
      ],
    });

    res.json(agendaConCliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al obtener la agenda con los clientes" });
  }
}


async function createCita(req, res) {
  const dataCita = req.body;
  const t = await sequelize.transaction();

  try {
      // Verificar si el cliente con el documento existe
      const existingCliente = await Cliente.findOne({
          where: {
              documento: dataCita.documento
          },
      });

      if (!existingCliente) {
          return res.status(404).json({ error: "Cliente no encontrado. Debe registrarse primero." });
      }

      // Verificar si el empleado con el ID existe
      const existingEmpleado = await Empleado.findByPk(dataCita.id_Empleado);

      if (!existingEmpleado) {
          return res.status(404).json({ error: "Empleado no encontrado. Proporcione un ID de Empleado válido." });
      }

      // Verificar si la fecha de la cita ya existe
      // const existingCitaFecha = await Agenda.findOne({
      //     where: {
      //         fecha: dataCita.fecha
      //     },
      // });

      // // Verificar si la hora de la cita ya existe
      // const existingCitaHora = await Agenda.findOne({
      //     where: {
      //         hora: dataCita.hora
      //     },
      // });

      // if (existingCitaFecha && existingCitaHora) {
      //     return res.status(400).json({ error: "Esta fecha y hora no está disponible" });
      // }

      // Crear la cita
      const cita = await Agenda.create({
          fecha: dataCita.fecha,
          hora: dataCita.hora,
          id_Empleado: dataCita.id_Empleado,
          documento: dataCita.documento,
          estado: 1,
          estado_Pago:1,
      }, { transaction: t });

      // Verificar y crear los detalles de servicio
      if (dataCita.servicios && Array.isArray(dataCita.servicios)) {
          const promises = dataCita.servicios.map(async (servicio) => {
              await DetalleServicio.create({
                  id_Agenda: cita.id_Agenda,
                  id_Servicio: servicio.id_Servicio,
              }, { transaction: t });
          });

          await Promise.all(promises);
      }

      // Confirmar la transacción
      await t.commit();

      // Enviar la respuesta con la cita creada
      res.status(201).json(cita);
  } catch (error) {
      // Revertir la transacción en caso de error
      await t.rollback();

      console.error(error);

      if (error.name === 'SequelizeForeignKeyConstraintError') {
          return res.status(400).json({ error: 'ID de Empleado no válido. Verifique la existencia del Empleado.' });
      }

      return res.status(500).json({ error: 'Error al crear la cita', message: error.message });
  }
}
    


// traer informacion para actualizar
async function listarPorIdCita(req, res){
  try {
    const CitaId = req.params.id;
    const cita = await Agenda.findByPk(CitaId);

    if (cita) {
      res.json(cita);
    } else {
      res.status(404).json({ message: 'Cita no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
}




async function buscarCitaConClientePorId(req, res) {
  try {
    const { id_Agenda } = req.params;

    // Buscar la cita por su ID
    const cita = await Agenda.findByPk(id_Agenda);

    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    
    // Obtener el documento del cliente asociado a la cita
    const documentoCliente = cita.documento;

    // Buscar el cliente por su documento
    const cliente = await Cliente.findOne({
      where: {
        documento: documentoCliente,
      },
      attributes: ["nombre", "apellidos", "email", "telefono"],
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Buscar los servicios asociados a la agenda
    const servicios = await DetalleServicio.findAll({
      where: {
        id_Agenda: id_Agenda,
      },
      include: {
        model: Servicio,
        attributes: ["nombre", "precio"],
      },
    });

    // Combinar la información de la cita, el cliente y los servicios
    const citaConClienteYServicios = {
      cita: cita,
      cliente: cliente,
      servicios: servicios
    };

    res.status(200).json(citaConClienteYServicios);
  } catch (error) {
    console.error('Error al buscar la cita, el cliente y los servicios:', error);
    res.status(500).json({ error: 'Error al buscar la cita, el cliente y los servicios' });
  }
}



// actualizar empleado
async function actualizarCita(req, res) {
  const { id_Agenda } = req.params;
  const {
    nombre,
    correo,
    telefono,
    fecha,
    hora,
    id_Empleado,
  } = req.body;

  try {
  // Verificar si la fecha de la cita ya existe
  const existingCitaFecha = await Agenda.findOne({
    where: {
      fecha,
    id_Agenda: { [Op.ne]: id_Agenda }
    },
  });

  // Verificar si la hora de la cita ya existe
  const existingCitaHora = await Agenda.findOne({
    where: {
    hora,
    id_Agenda: { [Op.ne]: id_Agenda }
    },
  });

  if (existingCitaFecha && existingCitaHora) {
    return res.status(400).json({ error: "Este horario no esta disponible" });
  }
  console.log("este es el json",body)
    const citaToUpdate = await Agenda.findByPk(id_Agenda);

    if (!citaToUpdate) {
      return res.status(404).send('Cita no encontrada');
    }

    // Actualizar los campos de la cita
    citaToUpdate.nombre = nombre;
    citaToUpdate.correo = correo;
    citaToUpdate.telefono = telefono;
    citaToUpdate.fecha = fecha;
    citaToUpdate.hora = hora;
    citaToUpdate.id_Empleado = id_Empleado;

    // Guardar los cambios en la base de datos
    await citaToUpdate.save();

    return res.status(200).json(citaToUpdate);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al actualizar la cita');
  }
}

async function desactivarCita(req, res) {
  try {
      const { id_Agenda } = req.params;
      const cita = await Agenda.findByPk(id_Agenda);
      if (!cita) {
          return res.status(404).json({ error: 'Cita no encontrada' });
      }
      // Actualiza el estado de la cita a "deshabilitado" (false)
      await cita.update({ estado: false });

      res.status(200).json({ message: 'Cita deshabilitada exitosamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al deshabilitar la cita' });
  }
}

async function desactivarRol(req, res) {
  try {
    const nombreRol = req.params.nombre;
    
    // Busca todos los roles con el mismo nombre
    const roles = await Rol.findAll({ where: { nombre: nombreRol } });

    if (!roles || roles.length === 0) {
      return res.status(404).json({ error: 'No se encontraron roles con ese nombre' });
    }

    // Obtiene los IDs de los roles con el mismo nombre
    const idsRoles = roles.map(rol => rol.id);

    // Actualiza el estado de los roles con el mismo nombre
    await Rol.update({ estado: false }, { where: { id: idsRoles } });

    // Actualiza el estado de los empleados vinculados a los roles
    await Empleado.update({ estado: false }, { where: { id_Rol: idsRoles } });

    res.status(200).json({ message: 'Roles deshabilitados exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al deshabilitar los roles' });
    }
  }

async function activarCita(req, res) {
  try {
      const { id_Agenda } = req.params;
      const cita = await Agenda.findByPk(id_Agenda);
      if (!cita) {
          return res.status(404).json({ error: 'Cita no encontrada' });
      }
      await cita.update({ estado: true });

      res.status(200).json({ message: 'Cita habilitada exitosamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al habilitar la cita' });
  }
}

// Función para obtener horas reservadas desde la base de datos
async function obtenerHorasReservadasEnBackend(fecha) {
  try {
      const horasReservadas = await Agenda.findAll({
          attributes: ['hora'],
          where: {
              fecha: fecha,
              estado: 1
          }
      });

      // Extraer las horas reservadas como un array de strings
      const horasReservadasArray = horasReservadas.map(reserva => reserva.hora);

      return horasReservadasArray;
  } catch (error) {
      console.error("Error al obtener horas reservadas desde la base de datos:", error);
      throw error;
  }
}

// Controlador para obtener horas disponibles
async function obtenerHorasDisponibles (req, res){
  try {
      const { fecha } = req.params; // Suponiendo que la fecha viene en los parámetros de la solicitud

      // Obtener todas las horas disponibles
      const todasLasHoras = ['07:00AM', '08:00AM', '09:00AM', '10:00AM', '11:00AM', '12:00PM', '01:00PM', '02:00PM', '03:00PM', '04:00PM', '05:00PM', '06:00PM', '07:00PM'];



      // Obtener las horas ya reservadas desde la base de datos
      const horasReservadas = await obtenerHorasReservadasEnBackend(fecha);

      // Filtrar las horas disponibles excluyendo las horas reservadas
      const horasDisponibles = todasLasHoras.filter(hora => !horasReservadas.includes(hora));

      // Enviar las horas disponibles como respuesta
      res.json({ horasDisponibles });
  } catch (error) {
      console.error("Error general al obtener horas disponibles:", error);
      res.status(500).json({ error: "Error al obtener horas disponibles" });
  }
};

async function obtenerInfoClientePorDocumento(req, res) {
  try {
    const { documento } = req.params;

    // Buscar el cliente por documento
    const cliente = await Cliente.findOne({
      where: {
        documento: documento,
      },
      attributes: ['nombre', 'telefono', 'email', /* Otros campos que necesitas */],
    });

    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener información del cliente:', error);
    res.status(500).json({ error: 'Error al obtener información del cliente' });
  }
}
async function listarCitas(req, res) {
  try {
    const agendaConCliente = await Agenda.findAll({
      where: {
        estado_Pago:1
      },
      include: [
        {
          model: Cliente,
          attributes: ["nombre", "apellidos", "telefono"],
        },
      ],
      attributes: [
        "id_Agenda",
        "fecha",
        "hora",
        "estado",
        "estado_Pago"
      ],
    });

    res.json(agendaConCliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al obtener la agenda con los clientes" });
  }
}


async function listarCitasEstadoPago(req, res) {
  try {
    const agendaEstadoPago = await Agenda.findAll({
      where: {
        estado_Pago:0
      },
      include: [
        {
          model: Cliente,
          attributes: ["nombre", "apellidos", "telefono"],
        },
      ],
      attributes: [
        "id_Agenda",
        "fecha",
        "hora",
        "estado_Pago"
      ],
    });

    res.json(agendaEstadoPago);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al obtener la agenda con estado finalizado" });
  }
}


async function desactivarEstadoPago(req, res) {
  try {
      const { id_Agenda } = req.params;
      const cita = await Agenda.findByPk(id_Agenda);
      if (!cita) {
          return res.status(404).json({ error: 'Cita no encontrada' });
      }
      // Actualiza el estado de la cita a "deshabilitado" (false)
      await cita.update({ estado_Pago: false });

      res.status(200).json({ message: 'Cita deshabilitada exitosamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al deshabilitar la cita' });
  }
}

async function activarEstadoPago(req, res) {
  try {
      const { id_Agenda } = req.params;
      const cita = await Agenda.findByPk(id_Agenda);
      if (!cita) {
          return res.status(404).json({ error: 'Cita no encontrada' });
      }
      await cita.update({ estado_Pago: true });

      res.status(200).json({ message: 'Cita habilitada exitosamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al habilitar la cita' });
  }
}


module.exports = {
  listarCitas,
  createCita,
  listarPorIdCita,
  actualizarCita,
  desactivarCita,
  activarCita,
  obtenerHorasDisponibles,
  obtenerInfoClientePorDocumento,
  buscarCitaConClientePorId,
  listarCitasEstadoPago,
  desactivarEstadoPago,
  activarEstadoPago,
  clienteConMasCitas,
  getTotalCitasMes,
  totalCitasEnMesActual,
  totalPagado,
  resumenDiario,
  servicioMasSolicitado,
  analisisCitas,
  ventasMensuales,
  ventasSemanales
};