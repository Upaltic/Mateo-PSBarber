import axios from 'axios';
const baseURL = import.meta.env.VITE_REACT_API_URL;

export const getListarRol = async ()=>{
    return await axios.get(`${baseURL}rol`)
  }
export const getListarRolEmpleado = async ()=>{
    return await axios.get(`${baseURL}rol/Empleado`)
  }  

export const postRol = async (task) => {
    try {
      const response = await axios.post(`${baseURL}rol/create`, task);
      return response.data;
    } catch (error) {
      if (error.response) {
        
        return { error: 'Error del servidor', data: error.response.data };
      }
    }
  };

export const getListarRoles=async ()=>{
    return await axios.get(`${baseURL}rol/rolesnuevo`)
  }
  export const getListarEmpleadosRoles=async ()=>{
    return await axios.get(`${baseURL}empleadosinrol/`)
  }

export const putDesactivarRol = async (nombre) => {
    return await axios.put(`${baseURL}rol/disable/${nombre}`);
  }

export const putObternerEmpleadosDelRol = async (id_Rol) => {
    return await axios.get(`${baseURL}rol/obtenerEmpleadosPorRol/${id_Rol}`);
  }

export const putActivarRol = async (id_Rol) => {
    return await axios.put(`${baseURL}rol/activate/${id_Rol}`);
  }
  
export const listarPermiso=async ()=>{
    return await axios.get(`${baseURL}rol/permiso`)
  }

export const deleteRol = async (id_Rol) => {
    return await axios.delete(`${baseURL}rol/delete/${id_Rol}`);
  }

export const actualizarRol=async (id_Rol, task)=>{
    return await axios.put(`${baseURL}rol/update/${id_Rol}`, task)
  }

export const cargaractualizarRol = async (id_Rol) => {
    return await axios.get(`${baseURL}rol/${id_Rol}`);
  }


