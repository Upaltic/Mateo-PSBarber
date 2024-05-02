import axios from 'axios';
const baseURL = import.meta.env.VITE_REACT_API_URL;

export const getListarClientes = async ()=>{
    return await axios.get(`${baseURL}cliente`)
}

export const postCliente = async (task) => {
    try {
      const response = await axios.post(`${baseURL}cliente/create/`,task);
      return response.data;
    } catch (error) {
      if (error.response) {
        
        return { error: 'Error del servidor', data: error.response.data };
      }
    }
  };

  export const datosCliente=async (documento)=>{
    return await axios.get(`${baseURL}cliente/${documento}`)
  }

  export const actualizarCliente=async (documento, task)=>{
    return await axios.put(`${baseURL}cliente/update/${documento}`, task)
  }
  export const deleteCliente = async (documento) => {
    return await axios.delete(`${baseURL}cliente/delete/${documento}`);
  }

  export const putDesactivarCliente = async (documento) => {
    return await axios.put(`${baseURL}cliente/disable/${documento}`);
  }

  export const putActivarCliente = async (documento) => {
    return await axios.put(`${baseURL}cliente/activate/${documento}`);
  }


