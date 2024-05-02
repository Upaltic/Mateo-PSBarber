import { Route,Routes } from "react-router-dom"
import { EmpleadoContextProvider } from "./context/empleado/empleadoContex"
import { RolContextProvider } from "./context/rol/RolContex"
import { ClienteContextProvider }from"./context/cliente/contexCliente"
import { ServicioContextProvider } from "./context/servicio/contexServicio"
import { AgendaContextProvider } from "./context/Agenda/contexAgenda"

import Cliente from "./pages/cliente/Cliente"
import ProtectedRoute from './ProtectedRoute';

import RecuperarContrasena from "./pages/empleado/recuperarContrasena"
import Login from "./pages/empleado/login"
import Empleado from "./pages/empleado/empleado"
import CrearEmpleado from "./pages/empleado/CrearEmpleado"
import ActualizarEmpleado from "./pages/empleado/ActualizarEmpleado"
import EnviarEmail from "./pages/empleado/enviarEmail"
import Pago from "./pages/pago/pago"
import CrearPago from "./pages/pago/CrearPago"
import Rol from "./pages/rol/Rol"
import Servicio from "./pages/servicio/servicio"
import Landingpage from "./pages/agenda/crearCita"
import Agenda from "./pages/agenda/Agenda"
import Dashboard from "./pages/dashboard/dashboard"
import Cheque from "./pages/agenda/chaque"
import EnviarContrasena from "./pages/empleado/contrasena"

function NotFound() {
  return <div className='text-center'>404 Pagina No Disponible</div>;
}

function App() {


  return (
    <>
    <div className="w-full h-full bg-zinc-900 font-nunito relative">
    <AgendaContextProvider>
    <EmpleadoContextProvider>
    <RolContextProvider>
    <ClienteContextProvider>
    <ServicioContextProvider>
    

    <Routes>
      <Route path="/" element={<Landingpage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/enviarEmail" element={<EnviarEmail/>}/>
      <Route path="/recuperarcontrasena" element={<RecuperarContrasena/>}/>
      <Route path="/cambiarcontrasena" element={<EnviarContrasena/>}/>

     
      <Route path="/agenda/cheque" element={<Cheque/>}/> 
      <Route path="/agenda" element={<ProtectedRoute  element={<Agenda/>}requiredPermissions={['Agenda']}/>}/>  
      <Route path="/servicio" element={<ProtectedRoute  element={<Servicio/>}requiredPermissions={['Servicios']}/>}/>  
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} requiredPermissions={['Dashboard']}/>}/>
      <Route path="/cliente" element={<ProtectedRoute  element={<Cliente/>}requiredPermissions={['Clientes']}/>}/>
      <Route path="/empleado" element={<ProtectedRoute  element={<Empleado/>}requiredPermissions={['Empleados']}/>}/>
      <Route path="/pago" element={<ProtectedRoute  element={<Pago/>}requiredPermissions={['Pagos']}/>}/>
      <Route path="/rol" element={<ProtectedRoute  element={<Rol/>}requiredPermissions={['Roles']}/>}/>


      <Route path="/empleado/create" element={<CrearEmpleado/>}/>
      <Route path="/empleado/update" element={<ActualizarEmpleado/>}/>

      
      <Route path="/pago/create" element={<CrearPago/>}/>
      
      
      <Route path="/rol/create" element={<Rol/>}/>
      <Route path="/rol/update" element={<Rol/>}/>
      <Route path='*' element={<NotFound />} />
    </Routes>

    </ServicioContextProvider>
    </ClienteContextProvider>
    </RolContextProvider>
    </EmpleadoContextProvider>
    </AgendaContextProvider>
    </div>
    </>
  )
}

export default App
