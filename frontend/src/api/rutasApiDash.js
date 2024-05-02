import axios from 'axios';

export const getClienteConMaxCitas = async ()=>{
    return await axios.get('http://localhost:3001/agenda/clienteConMasCitas')
}
