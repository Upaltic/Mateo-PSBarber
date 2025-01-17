    /* eslint-disable react/prop-types */
    import '../../css/pages.css'
    import { Field } from 'formik';
    import { Form, Formik } from 'formik';
    import TextField from '@mui/material/TextField';
    import CheckIcon from '@mui/icons-material/Check';
    import ErrorIcon from '@mui/icons-material/Error';
    import { useParams} from 'react-router-dom'
    import React from 'react';
    import Swal from 'sweetalert2';
    import { useEffect } from 'react'

    import {useServicio} from "../../context/servicio/contexServicio"
    // import { useServicio } from '../../context/Servicio/contexServicio';
    import { actualizarServicio } from '../../api/rutasApiServicio';


    const CrearServicio = ({handleCloseModal2,ServicioId}) => {

      const {ListarActualizar,cargarDatosServicios,validacionActualizar}=useServicio()
      const params =useParams()

        
      useEffect(()=>{
      
        validacionActualizar(ServicioId)
        cargarDatosServicios(params.id_Servicio)
       

      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[params.id_Servicio,ServicioId])

      const handleCancel = () => {
        Swal.fire("Actualización cancelada", "Su archivo está seguro", "error");
      };

      const handleFormSubmit = async (values) => {
        try {
          const result = await Swal.fire({
            title: "Confirmar actualización?",
            text: "Tu registro será actualizado",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            buttons: true,
          });
          
          if (result.isConfirmed) {
            await actualizarServicio(ServicioId, values)
              .then((response) => {
                if (response.status === 200) {
                  Swal.fire({
                    icon: "success",
                    title: "Actualización exitosa",
                    text: "Su archivo ha sido actualizado.",
                  });
                  handleCloseModal2();
                } else if (response.status === 400 && response.data.error) {
                  Swal.fire({
                    icon: "error",
                    title: "Servicio ya registrado",
                    text: response.data.error,
                  });
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Error en la solicitud",
                    text: "Error al actualizar el Servicio.",
                  });
                }
              })
              .catch(() => {
                Swal.fire({
                  icon: "error",
                  title: "Error en la solicitud",
                  text: "el servicio ya existe en la base de datos",
                });
              });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            handleCancel();
          }
        } catch (error) {
          console.error(error);
        }
      };
    

        return (
            <>
                <Formik
                     initialValues={ListarActualizar}
                     enableReinitialize={true}
                     onSubmit={
                         handleFormSubmit
                     }
                    
                     validate={async (values) => {
                      const errors = {};
                      
                      // Validaciones para el campo "nombre"
                      if (!values.nombre) {
                          errors.nombre = 'Este campo es requerido';
                      } else if (!/^[a-zA-Z-ñÑáéíóúÁÉÍÓÚ]+(?: [a-zA-Z-ñÑáéíóúÁÉÍÓÚ]+)*$/.test(values.nombre)) {
                          errors.nombre = 'Este campo solo debe contener letras. Puede incluir un espacio entre las palabras.';
                      }
                  
                      // Validaciones para el campo "precio"
                      if (!values.precio) {
                          errors.precio = 'Este campo es requerido';
                      } else if (!/^\d+$/.test(values.precio)) {
                          errors.precio = 'Este campo solo debe contener números enteros';
                      } else {
                          const precio = parseInt(values.precio, 10);
                          if (precio < 1000) {
                              errors.precio = 'El precio debe ser mayor o igual a 1000';
                          } else if (precio > 1000000) {
                              errors.precio = 'El precio debe ser menor o igual a un millón';
                          }
                      }
                  
                      // Validación para no-leading-trailing-space en cualquier campo
                      for (const key in values) {
                          if (typeof values[key] === 'string') {
                              if (/^\s|\s$/.test(values[key])) {
                                  errors[key] = 'No debe empezar ni terminar con un espacio en blanco';
                              }
                          }
                      }
                      
                      return errors;
                  }}
                    >
                    {({ handleChange, handleSubmit, values, errors, isValid }) => (
                        <div className="modal-content justify-content-center" style={{ position: 'absolute', top: '0%', left: '0%', transform: 'translate(-50%, -50%)', width: '800px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px',textAlign:'center' }}>
                            <h5 className="card-title">Actualizar Servicio</h5>
                            <Form onSubmit={handleSubmit} className="row g-3 needs-validation">
                            <div className="">
                                <div className="mb-3 mt-3">
                                    <Field
                                        type="text"
                                        name="nombre"
                                        label=''
                                        onChange={handleChange}
                                        value={values.nombre}
                                        as={TextField}
                                        className={`${values.nombre && /^[a-zA-Z-ñÑáéíóúÁÉÍÓÚ]+(?: [a-zA-Z-ñÑáéíóúÁÉÍÓÚ]+)*$/.test(values.nombre) ? 'is-valid' : 'is-invalid'}`}
                                        InputProps={{
                                            endAdornment: (
                                                <React.Fragment>
                                                    {values.nombre && /^[a-zA-Z-ñÑáéíóúÁÉÍÓÚ]+(?: [a-zA-Z-ñÑáéíóúÁÉÍÓÚ]+)*$/.test(values.nombre) ? (
                                                        <CheckIcon style={{ color: 'green' }} />
                                                    ) : (
                                                        <ErrorIcon style={{ color: 'red' }} />
                                                    )}
                                                </React.Fragment>
                                            ),
                                        }}


                                        required
                                        style={{ width: '100%', height: '40px', marginBottom: '15px' }}
                                    />
                                    {errors.nombre && (
                                        <div className='invalid-feedback'>{errors.nombre}</div>
                                    )}
                                    </div>
                                    <div className="">
                                    <Field
                                            type="text"  // Cambié el tipo a "text" para permitir texto y números
                                            name="precio"
                                            label='Precio'
                                            id="precio"
                                            required
                                            as={TextField}
                                            className={`form-selec ${errors.precio ? 'is-invalid' : values.precio ? 'is-valid' : ''}`}
                                            onChange={handleChange}
                                            value={values.precio}
                                            InputProps={{
                                                endAdornment: (
                                                  <React.Fragment>
                                                  {(values.precio && (/^(1000|[1-9]\d{3,4}|100000)$/.test(values.precio))) ? (
                                                      <CheckIcon style={{ color: 'green' }} />
                                                  ) : (
                                                      <ErrorIcon style={{ color: 'red' }} />
                                                  )}
                                              </React.Fragment>
                                                ),
                                            }}
                                            style={{ width: '100%', height: '40px', marginBottom: '15px' }}
                                        />
                                        {errors.precio && (
                                            <div className='invalid-feedback'>{errors.precio}</div>
                                        )}
                                    </div>
                                    
                                </div>
                                
                                <div className="col-md-12 d-flex justify-content-between">
                                    <button className="btn btn-dark" type="submit" disabled={!isValid}>
                                        Actualizar
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={handleCloseModal2}>
                                        Cancelar
                                    </button>
                                </div>

                            </Form>
                        </div>
                    )}
                </Formik>
            </>
        );
    }
    export default CrearServicio;
