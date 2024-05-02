import { createContext, useContext, useState } from "react";
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate } from "react-router-dom";
import { getListarRoles,getListarRol,postRol,putDesactivarRol,putActivarRol,listarPermiso,deleteRol,cargaractualizarRol,actualizarRol } from "../../api/rutasApiRol"

export const RolContext = createContext()

export const useRol=()=>{
    const context= useContext(RolContext)
     if(!context){
         throw new Error ("El useRol debe de estar del provider")
     }
     return context;
 }

 export const RolContextProvider = ({ children }) => {

    const navigate=useNavigate()
    const [listar, setListar]=useState([])//Lista todos los roles
    const [Listar, setListar2]=useState([])

    const [searchTerm, setSearchTerm] = useState("");

    async function cargarRol2(){
      const response =  await getListarRoles()
      setListar2(response.data)
      }

      


    const cargarRol = async () => {
      try {
        const response = await getListarRol(); // Llamar la ruta del servidor
        const rolesConPermisos = response.data.map((item) => ({
          id_Rol: item.id_Rol,
          nombre: item.nombre_rol,
          empleados: item.empleados,
          estado: item.estado_rol,
          permisos: item.permisos.split(','), // Convierte la cadena de permisos en un array
        }));
  
        const filteredList = rolesConPermisos.filter((item) =>
          item.id_Rol.toString().includes(searchTerm) ||
          item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
  
        setListar(filteredList); // Se le pasa los datos al setListar
      } catch (error) {
        console.error(error);
        // Maneja el error de manera adecuada
      }
    };

    const[listarActualizar, setListarActualizar]=useState({
  
      id_Rol:"",
      nombre:"",
      detalles:[]
   })

    async function cargarRolActualizar(id_Rol) {
      try {
      
        const response = await cargaractualizarRol(id_Rol);
        const rolData=response.data
    
        const detallesArray = rolData.detalles.map(detalle => ({
          empleado: detalle.empleado,
          permiso: detalle.permiso,
          
        }));   
        
        setListarActualizar({
          id_Rol:rolData.id_Rol,
          nombre:rolData.nombre,
          detalles: detallesArray
        });
    
    
      } catch (error) {
        console.log(error);
      }
    }

    const actualizarValidar= async(id_Rol, values)=>{
      try {
        if( values.nombre==""){
                 
          Swal.fire({
              icon: 'error',
              title: 'Campos Vacios',
              text: 'Por favor ingresar datos!',
              
            })
          }else{
                 
            const swalWithBootstrapButtons = Swal.mixin({
              customClass: {
                confirmButton: 'btn btn-success me-3',
                cancelButton: 'btn btn-danger'
              },
              buttonsStyling: false
            })
            
            Swal.fire({
              title: 'Confirmar el envio del formulario?',
              text: "¡No podrás revertir esto!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Aceptar!',
              cancelButtonText: 'Cancelar!',
              Buttons: true
            }).then(async(result) => {
              if (result.isConfirmed) {
      
            
                await actualizarRol(id_Rol,values)
                
             
      
                swalWithBootstrapButtons.fire(
                  'Registro Enviado!',
                  'Su archivo ha sido enviado con éxito.',
                  'success'
                )
                window.location.reload()
              } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
              ) {
                swalWithBootstrapButtons.fire(
                  'Se cancelo el envio',
                )
              }
             
      
            })
           
           
          }
      
      } catch (error) {
        console.log(error)
      }
        
                
      }
    

async function cargarpermiso(){
  const response =await listarPermiso()
  setListar(response.data)
}

const crearRoles=async(values)=>{
  try {
    console.log(values)
    if(values.id_Empleado==""||values.permisos==""){
             
      Swal.fire({
          icon: 'error',
          title: 'Campos Vacios',
          text: 'Por favor ingresar datos!',
          
        })
      }else{
             
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success me-3',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })
        
        Swal.fire({
          title: 'Confirmar el envio del formulario?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Aceptar!',
          cancelButtonText: 'Cancelar!',
          Buttons: true
        }).then(async(result) => {
          if (result.isConfirmed) {
            try {
              const response = await postRol(values);
              console.log(response);
        
              if (response.data && response.data.error) {
                // Verificar errores específicos
                if (response.data.error === 'el nombre del rol ya existe') {
                  console.log('Mostrar alerta de rol existente');
        
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El nombre del rol ya existe.',
                  });
                }
   else {
                  console.log('Mostrar alerta de otro error');
        
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.error,
                  });
                }
              } else {
                // Verificar si se creó el usuario correctamente
                if (response.data && response.data.rol) {
                  // Si no hay errores, redirige a la página de usuario
                  navigate("/rol");
                  window.location.reload()
                  swalWithBootstrapButtons.fire(
                    'Registro Enviado!',
                    'Your file has been deleted.',
                    'success'
                  );
                } else {
                  navigate("/rol");
                  window.location.reload()
  
                  swalWithBootstrapButtons.fire(
                    'Registro Enviado!',
                    'Su archivo ha sido enviado con exito.',
                    'success'
                  );
                }
              }
            } catch (error) {
              console.error(error);
              swalWithBootstrapButtons.fire(
                'Error',
                'Ocurrió un error al crear el usuario.',
                'error'
              );
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
              'Se cancelo el envio',
              'Este usuario no se registro',
              'error'
            );
          }
        });
      }              
    } catch (error) {
      console.log(error);
    }
  }

const filtrarDesactivados = listar.sort((a, b) => {
  if (a.estado === b.estado) {
    return 0;
  }
  return a.estado ? -1 : 1;
});

const activarRol = async (id_Rol) => {
  try {
    const response = await putActivarRol(id_Rol);
    if (response.status === 200) {
      // Actualiza la lista de rol después de activar uno
      const updatedList = listar.map((item) => {
        if (item.id_Rol === id_Rol) {
          // Actualiza el estado del cliente en la lista
          return { ...item, estado: true };
        }
        return item;
      });
      setListar(updatedList);
              Swal.fire(
                "Cambio de estado exitosamente!",
                "Se ha habilitado.",
                "success"
              );
              cargarRol();
            } else {
              Swal.fire({
                icon: "error",
                title: "Error al habilitar el rol",
                text: "No se pudo habilitar el rol",
              });
            }
          } catch (error) {
            console.error(error);
          }
};

const desactivarRol= async (id_Rol) => {
  try {
    const response = await putDesactivarRol(id_Rol);
    if (response.status === 200) {
      // Actualiza la lista de rol después de desactivar uno
      const updatedList = listar.map((item) => {
        if (item.id_Rol === id_Rol) {
          // Actualiza el estado del cliente en la lista
          return { ...item, estado: false };
        }
        return item;
      });
      setListar(updatedList);
              Swal.fire(
                "Actualizado exitosamente!",
                "Se ha inhabilitado.",
                "success"
              );
              cargarRol();
            } else {
              Swal.fire({
                icon: "error",
                title: "Error al inhabilitar el rol",
                text: "No se pudo inhabilitar el rol",
              });
            }
          } catch (error) {
            console.error(error);
          }
    }


  const eliminarRol = async (id_Rol) => {
    try {
      Swal.fire({
        title: "Eliminar registro?",
        text: "No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await deleteRol(id_Rol);
          if (response.status === 200) {
            Swal.fire(
              "Eliminado!",
              "El registro ha sido eliminado.",
              "success"
            );
            cargarRol();
          } else {
            Swal.fire({
              icon: "error",
              title: "Error al eliminar el registro",
              text: "No se pudo eliminar el registro",
            });
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
    };

  



  
    return( 
        <RolContext.Provider value={{actualizarValidar,listarActualizar,cargarRolActualizar,eliminarRol ,listar, cargarRol, desactivarRol, activarRol, crearRoles,searchTerm,setSearchTerm, cargarpermiso,filtrarDesactivados,cargarRol2,Listar}}>
            {children}
        </RolContext.Provider>
      )
 }