import {createContext , useContext, useState} from "react"
import { getListarAgenda, putDesactivarAgenda,putActivarAgenda, getListarCitaEstadoPago, putDesactivarEstadoPago, putActivarEstadoPago,buscarCitaConClientePorId } from "../../api/rutasApiAgenda";
import Swal from 'sweetalert2';
export const AgendaContext = createContext()

export const useAgenda=()=>{
    const context= useContext(AgendaContext)
     if(!context){
         throw new Error ("El useAgenda debe de estar del provider")
     }
     return context;
 }
 export const AgendaContextProvider = ({ children }) => {

    const [listar, setListar]=useState([])
    const [searchTerm, setSearchTerm] = useState("");

    async function listaAgenda() {
      const response = await getListarAgenda();
      const filterList = response.data.filter(
          (item) =>
              item.id_Agenda.toString().includes(searchTerm) ||
              item.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.cliente.apellidos.toString().includes(searchTerm) ||
              item.cliente.telefono.toString().includes(searchTerm) ||
              item.fecha.toString().includes(searchTerm) ||
              item.hora.toString().includes(searchTerm) ||
              item.estado.toString().includes(searchTerm.toLowerCase()) ||
              item.estado_Pago.toString().includes(searchTerm.toLowerCase())
      );
  
      // Obtener la fecha de hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00
  
      // Ordenar por fecha, de hoy a la más lejana
      filterList.sort((a, b) => {
          const dateA = new Date(a.fecha);
          const dateB = new Date(b.fecha);
  
          // Comparar solo las fechas sin la hora
          dateA.setHours(0, 0, 0, 0);
          dateB.setHours(0, 0, 0, 0);
  
          // Comparar con la fecha de hoy
          if (dateA.getTime() === today.getTime()) return -1; // Si a es hoy, ponerlo primero
          if (dateB.getTime() === today.getTime()) return 1; // Si b es hoy, ponerlo primero
          return dateA - dateB; // Ordenar por fecha normalmente
      });
  
      setListar(filterList);
      console.log(response);
  }
  
  

  async function listarCitaEstadoPago() {
    const response = await getListarCitaEstadoPago();
    const filterList = response.data.filter(
        (item) =>
            item.id_Agenda.toString().includes(searchTerm) ||
            item.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.cliente.apellidos.toString().includes(searchTerm) ||
            item.cliente.telefono.toString().includes(searchTerm) ||
            item.fecha.toString().includes(searchTerm) ||
            item.hora.toString().includes(searchTerm)
    );

    // Ordenar por fecha, de la más lejana a la más cercana
    filterList.sort((a, b) => {
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);

        // Comparar solo las fechas sin la hora
        dateA.setHours(0, 0, 0, 0);
        dateB.setHours(0, 0, 0, 0);

        // Ordenar por fecha de forma descendente
        return dateB - dateA;
    });

    setListar(filterList);
    console.log(response);
}



      const filtrarDesactivados = listar.sort((a, b) => {
              if (a.estado === b.estado) {
                return 0;
                

              }
              return a.estado ? -1 : 1;
          });

          const filtrarDesactivadosPagos = listar.sort((a, b) => {
            if (a.estado_Pago === b.estado_Pago) {
              return 0;

            }
            return a.estado_Pago ? -1 : 1;
        });


        const desactivarAgenda = async (id_Agenda) => {
            try {
              const response = await putDesactivarAgenda(id_Agenda);
              if (response.status === 200) {
                const updatedList = listar.map((item) => {
                  if (item.id_Agenda === id_Agenda) {
                    return { ...item, estado: false };
                  }
                  return item;
                });
                setListar(updatedList);
              }
            } catch (error) {
              console.error(error);
            }
          };
      
          const activarAgenda = async (id_Agenda) => {
            try {
              const response = await putActivarAgenda(id_Agenda);
              if (response.status === 200) {
                const updatedList = listar.map((item) => {
                  if (item.id_Agenda === id_Agenda) {
                    return { ...item, estado: true };
                  }
                  return item;
                });
                setListar(updatedList);
                
              }
            } catch (error) {
              console.error(error);
            }
          };

          
const desactivarProcesoPago = async (id_Agenda) => {
  try {
    const response = await putDesactivarEstadoPago(id_Agenda);
    if (response.status === 200) {
      const updatedList = listar.map((item) => {
        if (item.id_Agenda === id_Agenda) {
          return { ...item, estado_Pago: false };
        }
        return item;
      });
      setListar(updatedList);
      Swal.fire(
        "Pagado exitosamente!",
        "El registro ha pagado.",
        "success"
      );
      listaAgenda();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al pagar el registro",
        text: "No se pudo pagar el registro",
      });
    }
  } catch (error) {
    console.error(error);
  }
};
      
          const activarProcesoPago = async (id_Agenda) => {
            try {
              const response = await putActivarEstadoPago(id_Agenda);
              if (response.status === 200) {
                const updatedList = listar.map((item) => {
                  if (item.id_Agenda === id_Agenda) {
                    return { ...item, estado_Pago: true };
                  }
                  return item;
                });
                setListar(updatedList);
                window.location.reload();
              }
            } catch (error) {
              console.error(error);
            }
          };



        return(
            <AgendaContext.Provider value={{listaAgenda,filtrarDesactivados,setSearchTerm,searchTerm,activarAgenda,desactivarAgenda,listar,setListar,listarCitaEstadoPago,desactivarProcesoPago, activarProcesoPago, filtrarDesactivadosPagos}}>
                {children}
            </AgendaContext.Provider>
            )

}