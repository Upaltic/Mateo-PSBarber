const Empleado = require("../../models/empleado/modelEmpleado");
const Rol = require("../../models/rol/modelRol");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const Tipo_empleado = require("../../models/tipo_empleado/modelTipoEmpleado");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sequelize=require("../../database/db")
const RolXPermiso =require("../../models/rol/modelRolxPermiso")

async function listarEmpleado(req, res) {
  try {
    const EmpleadoContipoEm = await Empleado.findAll({
      include: [
        {
          model: Tipo_empleado,
          attributes: ["nombre"],
        },
      ],
      attributes: [
        "id_Empleado",
        "nombre",
        "apellidos",
        "telefono",
        "tipo_documento",
        "documento",
        "email",
        "estado",
      ],
    });
  const empleadoConRol = await Promise.all(EmpleadoContipoEm.map(async (EmpleadoContipoEm) =>{
    const rolesAsociadas = await RolXPermiso.findOne({
      where: {
        id_Empleado: EmpleadoContipoEm.id_Empleado,
      },
    });
    return{
      ...EmpleadoContipoEm.toJSON(),
        tieneRoles: !!rolesAsociadas,
    };
  })
);

    res.json(empleadoConRol);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Hubo un error al obtener los empleados con roles" });
  }
}

async function listarEmpleadoautocomplete(req, res){

  try {
      const empleado = await Empleado.findAll();
      res.json(empleado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los empleado' });
    }
  }

async function crearEmpleado(req, res) {
  const dataEmpleado = req.body;
  try {
    
    // Verificar si el documento de Empleado ya existe
    const existingEmpleado = await Empleado.findOne({
      where: {
        documento: dataEmpleado.documento,
      },
    });

    if (existingEmpleado) {
      return res.status(400).json({ error: "El documento del Empleado ya existe" });
    }

    // Verificar si el correo electrónico ya existe
    const existingEmpleadoEmail = await Empleado.findOne({
      where: { email: dataEmpleado.email },
    });

    if (existingEmpleadoEmail) {
      return res.status(400).json({ error: "El correo electrónico ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(dataEmpleado.contrasena, 10);
    const empleado = await Empleado.create({
      id_Empleado: dataEmpleado.id_Empleado,
      nombre: dataEmpleado.nombre,
      apellidos: dataEmpleado.apellidos,
      telefono: dataEmpleado.telefono,
      tipo_documento: dataEmpleado.tipo_documento,
      documento: dataEmpleado.documento,
      email: dataEmpleado.email,
      estado: 1,
      id_Tipo_Empleado: dataEmpleado.id_Tipo_Empleado,
      contrasena: hashedPassword,
    });

    const token = jwt.sign({ EmpleadoId: empleado.id_Empleado }, 'your-secret-key', {
      expiresIn: '1h'
    });
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'juandavidruaisaza@gmail.com',
        pass: ''//cambiar esta parte del codigo a un doenv
      }
    });

    res.status(201).json({ empleado, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear nuevo empleado" });
  }
}


// actualizar empleado
async function actualizarEmpleado(req, res) {
  const { id_Empleado } = req.params;
  const {
    nombre,
    apellidos,
    telefono,
    tipo_documento,
    documento,
    email,
    estado,
    id_Tipo_Empleado,
    contrasena
  } = req.body;

  try {
    // Verificar si el documento de Empleado ya existe
    const existingEmpleadoWithDocument = await Empleado.findOne({
      where: {
        documento,
        id_Empleado: { [Op.ne]: id_Empleado }
      }
    });

    if (existingEmpleadoWithDocument) {
      return res.status(400).json({ error: 'Documento ya existente en la base de datos' });
    }

    // Verificar si el correo electrónico ya existe
    const existingEmpleadoWithEmail = await Empleado.findOne({
      where: {
        email,
        id_Empleado: { [Op.ne]: id_Empleado }
      }
    });

    if (existingEmpleadoWithEmail) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado por otro empleado' });
    }

    const empleadoToUpdate = await Empleado.findByPk(id_Empleado);

    if (!empleadoToUpdate) {
      return res.status(404).send('Empleado no encontrado');
    }

    // Actualizar los campos del empleado
    empleadoToUpdate.nombre = nombre;
    empleadoToUpdate.apellidos = apellidos;
    empleadoToUpdate.telefono = telefono;
    empleadoToUpdate.tipo_documento = tipo_documento;
    empleadoToUpdate.documento = documento;
    empleadoToUpdate.email = email;
    empleadoToUpdate.estado = estado;
    empleadoToUpdate.id_Tipo_Empleado = id_Tipo_Empleado;
    empleadoToUpdate.contrasena = contrasena;

    // Guardar los cambios en la base de datos
    await empleadoToUpdate.save();

    return res.status(200).json(empleadoToUpdate);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al actualizar el Empleado');
  }
}


// fin de actualizar
// traer informacion para actualizar
async function listarporid(req, res){
  try {
    const EmpleadoId = req.params.id;
    const empleado = await Empleado.findByPk(EmpleadoId);

    if (empleado) {
      res.json(empleado);
    } else {
      res.status(404).json({ message: 'Empleado no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

async function desactivarEmpleado(req, res) {
  try {
      const { id_Empleado } = req.params;
      const empleado = await Empleado.findByPk(id_Empleado);
      if (!empleado) {
          return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      // Actualiza el estado del empleado a "deshabilitado" (false)
      await empleado.update({ estado: false });

      res.status(200).json({ message: 'Empleado deshabilitado exitosamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al deshabilitar empleado' });
  }
}

async function activarEmpleado(req, res) {
  try {
      const { id_Empleado } = req.params;
      const empleado = await Empleado.findByPk(id_Empleado);
      if (!empleado) {
          return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      await empleado.update({ estado: true });

      res.status(200).json({ message: 'Empleado habilitado exitosamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al habilitar empleado' });
  }
}

async function eliminarEmpleado(req, res) {
  try {
      const { id_Empleado } = req.params;
      const empleado = await Empleado.findByPk(id_Empleado);

      if (!empleado) {
          return res.status(404).json({ error: 'Empleado no encontrado' });
      }

      // Añadir lógica para verificar si el empleado se puede eliminar
      if (empleado.noSePuedeEliminar) {
          return res.status(400).json({ error: 'Este empleado no se puede eliminar.' });
      }

      // Elimina el empleado
      await empleado.destroy();

      res.json({ message: 'Empleado eliminado exitosamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar empleado' });
  }
}
const secretKey = 'your-secret-key';

async function login(req, res) {
  const { email, contrasena } = req.body;

  try {
    // Buscar usuario en la tabla rol_x_permisos
    const usuarioConRolYPermisos = await sequelize.query(
      `SELECT empleados.id_empleado, empleados.nombre, empleados.apellidos, empleados.email, empleados.contrasena, empleados.estado,
      MAX(rols.nombre) AS nombre, GROUP_CONCAT(permisos.nombre) AS permisos
      FROM empleados
      LEFT JOIN rol_permisos ON empleados.id_empleado = rol_permisos.id_empleado
      LEFT JOIN rols ON rol_permisos.id_rol = rols.id_rol
      LEFT JOIN permisos ON rol_permisos.id_permiso = permisos.id_permiso
      WHERE empleados.email = :email
      GROUP BY empleados.id_empleado
      LIMIT 0, 25;`,
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Verificar si el usuario existe
    if (!usuarioConRolYPermisos || usuarioConRolYPermisos.length === 0) {
      return res.status(203).json({ error: 'Authentication failed' });
    }

    const empleado = usuarioConRolYPermisos[0];

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(contrasena, empleado.contrasena);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Verificar el estado del usuario
    if (!empleado.estado) {
      return res.status(401).json({ error: 'User is not authorized to login' });
    }

    // Crear el token con la información del usuario
    const token = jwt.sign(
      {
        userId: empleado.id_Empleado,
        nombre: empleado.nombre,
        apellido: empleado.apellidos,
        email: empleado.email,
        nombre_rol: empleado.nombre,
        permisos: empleado.permisos.split(',') // Convertir la cadena de permisos en un array
      },
      secretKey,
      { expiresIn: '1h' }
    );

    // Establecer el token en las cookies de la respuesta
    res.cookie('token', token, { httpOnly: true });

    // Responder con el token y la información del usuario
    res.status(200).json({
      token,
      user: {
        id: empleado.id_Empleado,
        nombre: empleado.nombre,
        apellido: empleado.apellidos,
        email: empleado.email,
        nombre: empleado.nombre,
        permisos: empleado.permisos.split(',') // Convertir la cadena de permisos en un array
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al iniciar sesión' });
  }
}


async function enviarEmail(req, res) {
  try {
    const { email } = req.body;

    // Busca al usuario por su dirección de correo electrónico
    const empleado = await Empleado.findOne({ where: { email } });

    if (!empleado) {
      return res.status(404).json({ error: 'empleado no encontrado' });
    }

    const token = jwt.sign({ userId: empleado.id_Empleado }, 'tu_secreto', { expiresIn: '1h' });

    // Envía un correo electrónico informando sobre el cambio de contraseña
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'danielsenju1999@gmail.com',
        pass: 'iifk mvtw vfga yery'
      }
    });

    const mailOptions = {
      from: 'danielsenju1999@gmail.com',
      to: empleado.email,
      subject: 'Cambio de Contraseña Exitoso',
      html: `
      <h1>¡Hola ${empleado.nombre} ${empleado.apellidos}!</h1>
          <p>Hemos recibido una solicitud para restablecer tu contraseña en PS Barber.</p>
          <p>Si no has solicitado esto, puedes ignorar este correo electrónico; tu contraseña actual seguirá siendo válida.</p>
          <p>Para cambiar tu contraseña, haz clic en el siguiente enlace:</p>
          <a href="https://psbarber.onrender.com/cambiarcontrasena?token=${token}" target="_blank">Cambiar Contraseña</a>
          <p>Este enlace expirará en 1 hora por razones de seguridad.</p>
          <p>Si tienes algún problema con el enlace, copia y pega la siguiente URL en tu navegador:</p>
          <p>https://psbarber.onrender.com/cambiarcontrasena?token=${token}</p>
          <p>¡Gracias por confiar en PS Barber!</p>
          <p>Saludos,</p>
          <p>El equipo de PS Barber</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Correo electrónico enviado: ' + info.response);
      }
    });

    res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
} 
// async function enviarEmail(req, res) {
//   try {
//     const { email } = req.body;

//     // Busca al usuario por su dirección de correo electrónico
//     const empleado = await Empleado.findOne({ where: { email } });

//     if (!empleado) {
//       return res.status(404).json({ error: 'empleado no encontrado' });
//     }
    
//     const token = jwt.sign({ userId: empleado.id_Empleado }, 'tu_secreto', { expiresIn: '1h' });

//     // Envía un correo electrónico informando sobre el cambio de contraseña
    

//     const mailOptions = {
//       from: 'danielsenju1999@gmail.com',
//       to: empleado.email,
//       subject: 'Recuperación de Contraseña - PS Barber',
//       html: `
//         <h1>¡Hola ${empleado.nombres} ${empleado.apellido}!</h1>
//         <p>Hemos recibido una solicitud para restablecer tu contraseña en PS Barber.</p>
//         <p>Si no has solicitado esto, puedes ignorar este correo electrónico; tu contraseña actual seguirá siendo válida.</p>
//         <p>Para cambiar tu contraseña, haz clic en el siguiente enlace:</p>
//         <a href="http://localhost:5173/cambiarcontrasena?token=${token}" target="_blank">Cambiar Contraseña</a>
//         <p>Este enlace expirará en 1 hora por razones de seguridad.</p>
//         <p>Si tienes algún problema con el enlace, copia y pega la siguiente URL en tu navegador:</p>
//         <p>http://localhost:5173/cambiarcontrasena?token=${token}</p>
//         <p>¡Gracias por confiar en PS Barber!</p>
//         <p>Saludos,</p>
//         <p>El equipo de PS Barber</p>
//       `
//     };
    

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error(error);
//       } else {
//         console.log('Correo electrónico enviado: ' + info.response);
//       }
//     });

//     res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al cambiar la contraseña' });
//   }
// }

async function cambiarContrasena(req, res) {
  try {
    const { email, contrasena} = req.body;

  
    // Busca al usuario por su dirección de correo electrónico
    const empleado = await Empleado.findOne({ where: { email } });

    if (!empleado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Hashea la nueva contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Actualiza la contraseña del usuario
    await empleado.update({ contrasena: hashedPassword });

    // Envía un correo electrónico informando sobre el cambio de contraseña
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'danielsenju1999@gmail.com',
        pass: 'iifk mvtw vfga yery'
      }
    });

    const mailOptions = {
      from: 'danielsenju1999@gmail.com',
      to: empleado.email,
      subject: 'Cambio de Contraseña Exitoso',
      html: `
        <h1>¡Hola ${empleado.nombre}!</h1>
        <p>Tu contraseña ha sido cambiada exitosamente.</p>
        <p>Si no has sido tu comunicate con el administrador</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Correo electrónico enviado: ' + info.response);
      }
    });

    res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
}
async function listarEmpleadosSinRol(req, res) {
  try {
      const empleadosSinRol = await sequelize.query(
          `SELECT e.id_Empleado, e.nombre, e.apellidos, e.estado
           FROM empleados e
           LEFT JOIN rol_permisos rp ON e.id_Empleado = rp.id_Empleado
           WHERE rp.id_Rol IS NULL`,
          { type: sequelize.QueryTypes.SELECT }
      );

      res.json(empleadosSinRol);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al obtener los empleados sin rol' });
  }
}


module.exports = {
  listarEmpleado,
  listarEmpleadoautocomplete,
  crearEmpleado,
  actualizarEmpleado,
  activarEmpleado,
  listarporid,
  eliminarEmpleado,
  desactivarEmpleado,
  login,
  enviarEmail,
  cambiarContrasena,
  listarEmpleadosSinRol 
};
