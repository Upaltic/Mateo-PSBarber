import axios from 'axios';
const baseURL = import.meta.env.VITE_REACT_API_URL;

export const obtenerHorasDisponibles = async (fecha) => {
  return await axios.get(`${baseURL}agenda/obtenerHorasDisponibles/${fecha}`);
}

export const getListarAgenda = async () => {
  return await axios.get(`${baseURL}agenda`);
}

export const obtenerInfoClientePorCorreo = async (documento) => {
  return await axios.get(`${baseURL}agenda/obtenerDatosClientes/${documento}`);
}


export const putDesactivarAgenda = async (id_Agenda) => {
  return await axios.put(`${baseURL}agenda/disable/${id_Agenda}`);
}

export const putActivarAgenda = async (id_Agenda) => {
  return await axios.put(`${baseURL}agenda/activate/${id_Agenda}`);
}


export const buscarCitaConClientePorId = async (id_Agenda) => {
  try {
    
    const response = await axios.get(`${baseURL}agenda/citaExitosa/${id_Agenda}`);
    console.log('la data es esta___________',response )
    return response.data;
    
  } catch (error) {
    console.error('Error al buscar la cita y el cliente:', error);
    throw error; // Re-lanza el error para que pueda ser manejado por el código que llama a esta función
  }
};
export const postAgenda = async (data) => {
  try {
    console.log('la data es esta___________',data)
    const response = await axios.post(`${baseURL}agenda/create`, data);
    return response.data;
  } catch (error) {
    console.error('Error en postAgenda:', error);
    throw error;
  }
};
export const getListarCitaEstadoPago = async () =>{
  return await axios.get(`${baseURL}agenda/finalizada`)
}

export const putDesactivarEstadoPago = async (id_Agenda) => {
  return await axios.put(`${baseURL}agenda/disablePago/${id_Agenda}`)
}
export const putActivarEstadoPago = async (id_Agenda) => {
  return await axios.put(`${baseURL}agenda/activatePago/${id_Agenda}`)
}

