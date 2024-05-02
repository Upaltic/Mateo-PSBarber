import axios from 'axios';
const baseURL = import.meta.env.VITE_REACT_API_URL;

export const getListarServicios = async ()=>{
    return await axios.get(`${baseURL}Servicio`)
}

export const postServicio = async (task) => {
    try {
      const response = await axios.post(`${baseURL}Servicio/create`,task);
      return response.data;
    } catch (error) {
      if (error.response) {
        
        return { error: 'Error del servidor', data: error.response.data };
      }
    }
  };

  export const datosServicio=async (id_Servicio)=>{
    return await axios.get(`${baseURL}Servicio/${id_Servicio}`)
  }

  export const actualizarServicio=async (id_Servicio, task)=>{
    return await axios.put(`${baseURL}Servicio/update/${id_Servicio}`, task)
  }
  export const deleteServicio = async (id_Servicio) => {
    return await axios.delete(`${baseURL}Servicio/delete/${id_Servicio}`);
  }

  export const putDesactivarServicio = async (id_Servicio) => {
    return await axios.put(`${baseURL}Servicio/disable/${id_Servicio}`);
  }

  export const putActivarServicio = async (id_Servicio) => {
    return await axios.put(`${baseURL}Servicio/activate/${id_Servicio}`);
  }


