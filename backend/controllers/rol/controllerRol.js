const Rol=require("../../models/rol/modelRol")
const sequelize=require("../../database/db");
const RolXPermiso = require("../../models/rol/modelRolxPermiso");
const Permiso = require("../../models/permisos/modelPermiso");
const { Sequelize } = require("sequelize");
const Empleado = require("../../models/empleado/modelEmpleado");


async function listarRolEmpleado(req, res){

    try {
        const rol = await Rol.findAll();
        res.json(rol);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener roles' });
      }
    }


async function listarRol(req, res) {
  try {
    const query = `
    SELECT 
    r.id_Rol,
    r.nombre AS nombre_rol,
    r.estado AS estado_rol,
    GROUP_CONCAT(DISTINCT p.nombre ORDER BY p.id_Permiso) AS permisos,
    GROUP_CONCAT(DISTINCT e.nombre ORDER BY e.id_Empleado) AS empleados
    FROM 
    rol_permisos rp
    LEFT JOIN 
    permisos p ON rp.id_Permiso = p.id_Permiso
LEFT JOIN 
    empleados e ON rp.id_Empleado = e.id_Empleado
LEFT JOIN 
    rols r ON rp.id_Rol = r.id_Rol
GROUP BY r.nombre;    
    `;

    const rolesConPermisos = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

    res.json(rolesConPermisos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener roles con permisos' });
  }
} 
    

async function createRol(req, res) {
  const dataRol = req.body;

  // Validaciones de datos
  if (!dataRol || typeof dataRol !== 'object') {
    return res.status(400).json({ error: 'Los datos del rol son inválidos' });
  }
  if (!dataRol.nombre || typeof dataRol.nombre !== 'string') {
    return res.status(400).json({ error: 'El nombre del rol es inválido' });
  }
  if (!dataRol.permisos || !Array.isArray(dataRol.permisos)) {
    return res.status(400).json({ error: 'Los permisos deben ser un array' });
  }

  try {
    const t = await sequelize.transaction();
    try {
      const rol = await Rol.create({
        nombre: dataRol.nombre,
        estado: 1,
        // Otras propiedades del rol
      }, { transaction: t });

      for (const permisoId of dataRol.permisos) {
        await RolXPermiso.create({
          id_Rol: rol.id_Rol,
          id_Permiso: permisoId,
          id_Empleado: dataRol.id_Empleado
         }, { transaction: t });
      }

      await t.commit();
      res.status(201).json({ message: 'Rol y permisos creados exitosamente' });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear rol y permisos: ' + error.message });
  }
}

async function createRolNuevo(req, res) {
  const dataRol = req.body;
try {
  const t = await sequelize.transaction();


  try {

    const existingRol = await Rol.findOne({
      where: { nombre: dataRol.nombre}
    });

    if (existingRol) {
      // Si el ID de usuario ya existe, muestra una alerta
      return res.status(400).json({ error: 'el nombre del rol ya existe' });
    }

      const rol = await Rol.create({
        nombre: dataRol.nombre,
        estado: 1,
      }, { transaction: t });

      await t.commit();
      res.status(201).json(rol);
    
  } catch (error) {
    await t.rollback();
    throw error;
  
  }  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Error al obtener rol' });

  }
}

async function listaRoles(req, res){
  try {
    const roles = await Rol.findAll();
    
    // Utilizar un conjunto para almacenar nombres únicos de roles
    const rolesUnicos = new Set();

    // Filtrar roles duplicados y almacenar solo un rol por nombre
    const rolesFiltrados = roles.filter(rol => {
      if (!rolesUnicos.has(rol.nombre)) {
        rolesUnicos.add(rol.nombre);
        return true;
      }
      return false;
    });

    res.json(rolesFiltrados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener Roles unicos' });
  }
}

  const { Op } = require('sequelize');
  
  async function desactivarRol(req, res) {
    try {
        const nombreRol = req.params.nombre;

        // Busca todos los roles con el mismo nombre
        const roles = await Rol.findAll({ where: { nombre: nombreRol } });

        if (!roles || roles.length === 0) {
            return res.status(404).json({ error: 'No se encontraron roles con ese nombre' });
        }

        // Obtiene los IDs de los roles con el mismo nombre
        const idsRoles = roles.map(rol => rol.id_Rol);

        // Actualiza el estado de los roles con el mismo nombre
        await Rol.update({ estado: false }, { where: { id_Rol: idsRoles } });

        // Actualiza el estado de los empleados vinculados a los roles
        await Empleado.update({ estado: false }, { where: { id_Empleado: idsRoles } });

        // Actualiza el estado de los empleados vinculados a los roles a través de la tabla intermedia rol_permiso
        await Empleado.update({ estado: false },{ where: { id_Empleado: { [Op.in]: sequelize.literal(`(SELECT id_Empleado FROM rol_permisos WHERE id_Rol IN (${idsRoles.join(',')}) )`) } }});

        res.status(200).json({ message: 'Roles deshabilitados exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al deshabilitar los roles' });
    }
}
  
async function activarRol(req, res) {
  try {
      const nombreRol = req.params.nombre;

      // Busca todos los roles con el mismo nombre
      const roles = await Rol.findAll({ where: { nombre: nombreRol } });

      if (!roles || roles.length === 0) {
          return res.status(404).json({ error: 'No se encontraron roles con ese nombre' });
      }

      // Obtiene los IDs de los roles con el mismo nombre
      const idsRoles = roles.map(rol => rol.id_Rol);

      // Actualiza el estado de los roles con el mismo nombre
      await Rol.update({ estado: true }, { where: { id_Rol: idsRoles } });

      // Actualiza el estado de los empleados vinculados a los roles
      await Empleado.update({ estado: true }, { where: { id_Empleado: idsRoles } });

      // Actualiza el estado de los empleados vinculados a los roles a través de la tabla intermedia rol_permiso
      await Empleado.update({ estado: true }, { where: { id_Empleado: { [Op.in]: sequelize.literal(`(SELECT id_Empleado FROM rol_permisos WHERE id_Rol IN (${idsRoles.join(',')}) )`) } } });

      res.status(200).json({ message: 'Roles habilitados exitosamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al habilitar los roles' });
  } 
}
// Controlador para obtener los nombres y apellidos de los empleados por rol
async function obtenerEmpleadosPorRol(req, res) {
  try {
      const nombreRol = req.params.nombre;

      // Buscar el rol por nombre
      const rol = await Rol.findOne({ where: { nombre: nombreRol } });

      if (!rol) {
          return res.status(404).json({ error: 'No se encontró el rol' });
      }

      // Buscar los empleados asociados a ese rol a través de la tabla intermedia rol_permisos
      const empleados = await Empleado.findAll({
          where: { id_Rol: rol.id_Rol },
          attributes: ['nombre', 'apellidos']
      });

      res.status(200).json(empleados);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los empleados por rol' });
  }
}



async function listarporid(req, res) {
  const { id_Rol } = req.params;

  try {
    const ficha = await Rol.findOne({
      where: { id_Rol: id_Rol },
    });

    if (!ficha) {
      return res.status(404).json({ error: "Ficha no encontrada" });
    }

    const detalleFicha = await RolXPermiso.findAll({
      where: { id_Rol: ficha.id_Rol },
      attributes: [
        "id_rol_permiso",
        "id_Rol",
        "id_Empleado",
        "id_permiso"
      ],
      include: [
        {
          model: Empleado,
          attributes: ["id_Empleado","nombre"],
        },
        {
          model: Permiso,
          attributes: ['id_Permiso','nombre'],
        },{
         model:Rol,
         attributes: ['id_Rol','nombre'],
        }
      ],
    });

    const fichaConDetalles = {
      ...ficha.toJSON(),
      detalles: detalleFicha,
    };

    res.json(fichaConDetalles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la ficha" });
  }
}


  
  async function eliminarRol(req, res) {
    try {
      const id = req.params.id;
      const response = await RolXPermiso.destroy({ where: { id_Rol: id } });
      const responses = await Rol.destroy({ where: { id_Rol: id } });
  
      if (response === 1 || responses ===1) {
        // Si se eliminó correctamente, response será 1.
        res.status(200).json({ message: 'Rol eliminado con éxito' });
      } else {
        // Si no se encontró el usuario o no se pudo eliminar, response será 0.
        res.status(404).json({ message: 'Rol no encontrado o no se pudo eliminar' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar el rol' });
    }
  }
  
  
    async function actualizarRol(req, res) {
      const { id } = req.params;
      const { nombre, permiso, id_Empleado } = req.body;
  
      try {
        
          const rol = await Rol.findByPk(id);
          if (!rol) {
              return res.status(404).send('Rol no encontrado');
          }
  
          // Actualizar el nombre del rol
          rol.nombre = nombre;
  
          // Guardar los cambios en el rol
          await rol.save();
  
          // Eliminar todos los permisos asociados al rol
          await RolXPermiso.destroy({ where: { id_Rol: id } });
  
  
          // Insertar los nuevos permisos asociados al rol
          if (permiso && permiso.length > 0) {
              await Promise.all(permiso.map(async (permisoId) => {
                  await RolXPermiso.create({ id_Rol: id, id_Permiso:permisoId, id_Empleado:id_Empleado});
              }));
          }
  
          console.log('Rol actualizado:', rol.toJSON());
  
          return res.status(200).json(rol);
      } catch (error) {
          console.error('Error al actualizar el rol:', error);
          return res.status(500).send('Error al actualizar el rol');
      }
  }
    
    module.exports={
        listarRol,
        createRol,
        desactivarRol,
        activarRol,
        listarRolEmpleado,
        createRolNuevo,
        listaRoles,
        eliminarRol,
        actualizarRol,
        obtenerEmpleadosPorRol,
        listarporid
    }