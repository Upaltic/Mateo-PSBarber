const Router=require("express").Router()
const rolController=require("../../controllers/rol/controllerRol")
const permisoController=require("../../controllers/permiso/controllerPermiso")

Router.get("/", rolController.listarRol)
Router.get("/empleado", rolController.listarRolEmpleado)
Router.get("/rolesnuevo", rolController.listaRoles)
Router.get("/obtenerEmpleadosPorRol/:id_Rol",rolController.obtenerEmpleadosPorRol)
Router.post("/create", rolController.createRol)
Router.put("/disable/:nombre", rolController.desactivarRol)
Router.put("/activate/:nombre", rolController.activarRol)
Router.put("/update/:id", rolController.actualizarRol)
Router.delete("/delete/:id", rolController.eliminarRol)
Router.get("/permiso", permisoController.listarPermiso)
Router.get("/:id_Rol", rolController.listarporid)
Router.post("/create/nuevo", rolController.createRolNuevo)


module.exports=Router;