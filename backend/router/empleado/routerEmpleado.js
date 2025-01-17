const Router=require("express").Router()
const empleadoController=require("../../controllers/Empleado/controllerEmpleado")

Router.get("/empleadosinrol/", empleadoController.listarEmpleadosSinRol)

Router.get("/", empleadoController.listarEmpleado)
Router.get("/auto", empleadoController.listarEmpleadoautocomplete)
Router.post("/create", empleadoController.crearEmpleado)
Router.put("/update/:id_Empleado", empleadoController.actualizarEmpleado)
Router.get("/:id", empleadoController.listarporid);
Router.put("/disable/:id_Empleado", empleadoController.desactivarEmpleado)
Router.put("/activate/:id_Empleado", empleadoController.activarEmpleado)
Router.delete("/delete/:id_Empleado", empleadoController.eliminarEmpleado)
Router.post("/login", empleadoController.login)
Router.post("/cambiarcontrasena", empleadoController.cambiarContrasena)
Router.post("/enviaremail/", empleadoController.enviarEmail)

module.exports=Router;