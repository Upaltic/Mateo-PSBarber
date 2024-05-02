import { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Swal from 'sweetalert2';
import { postAgenda, obtenerHorasDisponibles} from '../../api/rutasApiAgenda';
import { getListarServicios } from '../../api/rutasApiServicio';
import { getListarClientes } from '../../api/rutasApiCliente';
import HorarioCarousel from '../../components/HorarioCarousel';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const ModalCrearAgenda = ({ handleCloseModal }) => {
  
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7); // Sumamos 7 días
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [servicios, setServicios] = useState([]);
  const [fecha, setFecha] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [Documento, setDocumento] = useState('');
  const [clientesDisponibles, setclientesDisponibles] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);


  // useEffect(() => {
  //   const hoy = new Date();
  //   const unaSemanaDespues = new Date();
  //   unaSemanaDespues.setDate(hoy.getDate() + 7); // Añade 7 días a la fecha actual

  //   // Formatea las fechas para que sean compatibles con el atributo "min" y "max"
  //   const formatoFecha = (date) => {
  //     const yyyy = date.getFullYear();
  //     let mm = date.getMonth() + 1; // Los meses comienzan desde 0
  //     let dd = date.getDate();

  //     if (mm < 10) {
  //       mm = '0' + mm;
  //     }

  //     if (dd < 10) {
  //       dd = '0' + dd;
  //     }

  //     return `${yyyy}-${mm}-${dd}`;
  //   };

  //   setFechaMinima(formatoFecha(hoy));
  //   setFechaMaxima(formatoFecha(unaSemanaDespues));
  // }, []);
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await getListarClientes();
        const clientesActivos = response.data.filter(clientes => clientes.estado);
        setclientesDisponibles(clientesActivos);
      } catch (error) {
          console.error('Error al obtener clientes', error);
        }
      };

      fetchClientes();
    }, []);
  

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await getListarServicios();
        const serviciosActivos = response.data.filter(servicio => servicio.estado);
        setServiciosDisponibles(serviciosActivos);
      } catch (error) {
        console.error('Error al obtener servicios', error);
      }
    };

    fetchServicios();
  }, []);

  useEffect(() => {
    const fetchHorasDisponibles = async () => {
      try {
        if (fecha) {
          const response = await obtenerHorasDisponibles(fecha);
          setHorasDisponibles(response.data.horasDisponibles);
        }
      } catch (error) {
        console.error('Error al obtener horas disponibles', error);
      }
    };

    fetchHorasDisponibles();
  }, [fecha]);


  const generarHorasDisponibles = () => {
    return horasDisponibles;
  };
//   const seleccionarHora = (hora) => {
//     setHf oraSeleccionada(hora);
//   };
  return (
    <>
      <Formik
        initialValues={{
          fecha: '',
          hora:'',
          id_empleado:52,
          documento:'',
          estado_pago:1,
          servicios: [],
        }}
        validate={(values) => {
          const errors = {};

          if (!values.fecha) {
            errors.fecha = 'Este campo es requerido';
        }
        if (!values.servicios || values.servicios.length === 0) {
            errors.servicios = 'Debes seleccionar al menos un servicio.';
          }
        if (!values.hora) {
            errors.hora = 'Debes seleccionar una hora.';
          }

          // Validaciones para el campo "nombre"    
        
          if (!values.documento) {
            errors.documento = 'Este campo es requerido';
          } 
          // Agregar más validaciones para "servicios", "fecha" y "hora" si es necesario
          return errors;
        }}
        enableReinitialize={true}
        onSubmit={async (values) => {
            try {
                if(values != null) {
                  const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                      confirmButton: 'btn btn-success',
                      cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                  });
            
                  swalWithBootstrapButtons.fire({
                    title: 'Confirmar el envío del formulario?',
                    text: "",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Aceptar!',
                    cancelButtonText: 'Cancelar!',
                    buttons: true
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      try {
                        const data = {
                          fecha,
                          hora: horaSeleccionada,
                          id_Empleado: 45,
                          servicios: servicios.map(servicio => ({ id_Servicio: servicio.id_Servicio })),
                          documento: Documento ? Documento.documento : '',
                        };
            
                        const response = await postAgenda(data);
                        console.log("esta es la respuesta",response);
                        console.log("este es el data",data)
            
                        if (response.data && response.data.error) {
                          // Verificar errores específicos
                          if (response.data.error === 'el id de agenda ya existe') {
                            Swal.fire({
                              icon: 'error',
                              title: 'Error',
                              text: 'El documento de agenda ya existe.',
                            });
                          }
                    
                          else {
                            Swal.fire({
                              icon: 'error',
                              title: 'Error',
                              text: response.data.error,
                            });
                          }
                        } else {
                          if (response.data && response.data.agenda) {
                            swalWithBootstrapButtons.fire(
                              'Registro Enviado!',
                            ).then(() => {
                              handleCloseModal();
                              // Recargar la página después de cerrar el modal
                              window.location.reload();
                            });
                          } else {
                            swalWithBootstrapButtons.fire(
                            'Registro Enviado!',
                          ).then(() => {
                            handleCloseModal();
                            // Recargar la página después de cerrar el modal
                            window.location.reload();
                          });
                        }
                      }
                    } catch (error) {
                      console.error(error);
                      swalWithBootstrapButtons.fire(
                        'Error',
                        'Ocurrió un error al crear la agenda.',
                        'error'
                      );
                    }
                  } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                      'Se canceló el envío',
                      'error'
                    );
                  }
                });
              }
            } catch (error) {
              console.log(error);
            }
          }}
          
        
      >
        {({ handleChange, handleSubmit, values, errors, isValid }) => (
          <div className="modal-content" style={{ position: 'absolute', top: '0%', left: '0%', transform: 'translate(-50%, -50%)', width: '800px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h5 className="card-title">Agregar agenda</h5>
          <Form onSubmit={handleSubmit} className="row g-3 needs-validation">
                  <div className="col-md-6">
                    <div className='mb-3'>
                    </div>
                    <div className="mb-3">
                    <div className="mb-3">
                    <input
          type="date"
          name="fecha"
          id="fecha"
          className={`form-control date-input `}
          min={getCurrentDate()} // Establecemos la fecha mínima como la fecha actual
          max={getMaxDate()} // Establecemos la fecha máxima como 7 días después de la fecha actua
          value={values.fecha}
          onChange={(e) => {
          setFecha(e.target.value);
                          handleChange(e);
                        }}
          required
        />
        {errors.fecha && <div className='invalid-feedback'>{errors.fecha}</div>}
                    </div>
                      <div className="mb-3">
                      <Autocomplete 
                        disablePortal
                        id="fixed-tags-demo"
                        className={` ${errors.documento ? 'is-invalid' : 'is-valid'}`}
                        options={clientesDisponibles.filter((documento) => documento.estado)}
                        getOptionLabel={(option) => `${option.nombre} ${option.apellidos} -${option.documento} `}
                        onChange={(event, newValue) => {
                          setDocumento(newValue);
                          handleChange({ 
                            target: { name: 'documento', value: newValue ? newValue.documento : '' } 
                          });
                        }}
                        value={clientesDisponibles.find((documento) => documento.documento === values.documento) || null}
                        sx={{ width: '100%' }}
                        renderInput={(params) => <TextField {...params} label="documento" sx={{ width: '100%' }}/>}
                      />

                      {errors.documento && (
                        <div className='invalid-feedback'>{errors.documento}</div>
                      )}
                      </div>
                      
                      <div className="mb-3">

                      <HorarioCarousel
                        horasDisponibles={generarHorasDisponibles()}
                        horaSeleccionada={horaSeleccionada}
                        handleSeleccionarHora={(hora) => {
                          setHoraSeleccionada(hora);
                          handleChange({
                            target: {
                              name: 'hora',
                              value: hora,
                            },
                          });
                          console.log('Hora seleccionadaaaaa:', hora);
                        }}
                      />
                    </div>
                    {errors.hora && (
                        <div className='invalid-feedback'>{errors.hora}</div>
                      )}
                    <p>Hora seleccionada: {horaSeleccionada}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      
                    </div>
                    <div className="mb-3">
                    <Autocomplete
                      disabled
                      id="fixed-tags-demo"
                      options={['Sebastian']}
                      value="Sebastian"
                      sx={{ width: '100%' }}
                      renderInput={(params) => <TextField {...params} label="Empleado" />}
                    />

                      {errors.documento && (
                        <div className='invalid-feedback'>{errors.documento}</div>
                      )}
                      </div>
                    
                    <div className="mb-3">
                        <Autocomplete
                          multiple
                          id="servicios"
                          options={serviciosDisponibles}
                          className={` ${errors.servicios ? 'is-invalid' : 'is-valid'}`}
                          getOptionLabel={(option) => `${option.nombre} - $${option.precio.toLocaleString('es-CO')}`}
                          getOptionSelected={(option, value) => option.id_Servicio === value.id_Servicio}
                          value={servicios}
                          onChange={(_, newValue) => {
                            setServicios(newValue);
                            handleChange({
                              target: {
                                name: 'servicios',
                                value: newValue,
                              },
                            });
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label='Servicios' variant='outlined' />
                          )}
                        />
                      {errors.servicios && (
                        <div className='invalid-feedback'>{errors.servicios}</div>
                      )}
                    </div>
                    
                    
                  </div>
                  <div className="col-md-6">
                  </div>
                  
                  <div className="col-md-12 d-flex justify-content-between">
                  <button className="btn btn-dark" type="submit" disabled={!isValid}>
                      Agregar
                  </button>
                  <button type="button" className="btn btn-danger" onClick={handleCloseModal}>
                      Cancelar
                  </button>
              </div>
                </Form>
      </div>    
        )}
      </Formik>
    </>
  );
};

export default ModalCrearAgenda;
