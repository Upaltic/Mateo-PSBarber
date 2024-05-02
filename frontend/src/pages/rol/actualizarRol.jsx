/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Form, Formik, Field } from 'formik';
import { listarPermiso } from '../../api/rutasApiRol';
import { useRol } from '../../context/Rol/RolContex';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';

const ActualizarRol = ({ RolId }) => {

  const { actualizarValidar, cargarRolActualizar, listarActualizar } = useRol();
  const [nombreRol, setNombreRol] = useState("");
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);
  const [loading] = useState(false);
  console.log(listarActualizar)
  useEffect(() => {
    cargarRolActualizar(RolId);
  }, [RolId]);

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await listarPermiso();
        setPermisosDisponibles(response.data);
      } catch (error) {
        console.error('Error al obtener permisos', error);
      }
    };

    fetchPermisos();
  }, []);

  

  function getUniqueUserNames(detalles) {
    const userNamesSet = new Set();

    detalles.forEach((detalle) => {
      if (detalle.empleado && detalle.empleado.id_Empleado) {
        userNamesSet.add(detalle.empleado.id_Empleado);
      }
    });
    return [...userNamesSet][0] || '';
  }

  return (
    <div className="modal-content" style={{ width: '600px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <h5 className="card-title">Actualizar rol</h5>
      <Formik
        initialValues={
          listarActualizar
        }
        validate={async (values) => {
          const errors = {}

          if (!values.nombre) {
            errors.nombre = 'Este campo es requerido';
          } else if (!/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(values.nombre)) {
            errors.nombre = 'Este campo solo debe contener letras';
          }

          return errors;
        }}
        enableReinitialize={true}
        onSubmit={async (values) => {
          const selectedPermissions = values.detalles.map(detalle => detalle.permiso);

          const updatedValues = {
            ...values,
            permiso: selectedPermissions.map(permiso => permiso.id_Permiso),
            id_Empleado: getUniqueUserNames(values.detalles)
          };

          actualizarValidar(RolId, updatedValues);
        }}
      >
        {({ handleChange, handleSubmit, setFieldValue, values, errors, isValid }) => (
          <Form onSubmit={handleSubmit} className="row g-3 needs-validation">
            <input  type='hidden' name='rol' onChange={handleChange} value={values.id_Rol}  className="form-control" disabled/>

            <div className="mb-3">
              <Field
                type='text'
                name='nombre'
                label='Nombre'
                value={values.nombre}
                as={TextField}
                onChange={handleChange}
                className={` ${
                  values.nombre && /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(values.nombre) ? 'is-valid' : 'is-invalid'
                }`}
                InputProps={{
                  endAdornment: (
                    <React.Fragment>
                      {values.nombre && /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(values.nombre) ? (
                        <CheckIcon style={{ color: 'green' }} />
                      ) : (
                        <ErrorIcon style={{ color: 'red' }} />
                      )}
                    </React.Fragment>
                  ),
                }}
                sx={{ width: '100%' }}
              />
              {errors.nombre && <div className='invalid-feedback'>{errors.nombre}</div>}
            </div>

            <div className='col-md-12'>
              <Autocomplete
                multiple
                id='permisos'
                name="permiso"
                options={permisosDisponibles || []}
                getOptionLabel={(option) => option.nombre}
                onChange={(event, newValue) => {
                  const updatedDetalles = newValue.map(permiso => ({
                    permiso,
                    empleado: values.detalles.find(detalle => detalle.permiso.nombre === permiso.nombre)?.empleado || null
                  }));
                  setFieldValue('detalles', updatedDetalles);
                }}
                value={values.detalles.map(detalle => detalle.permiso)}
                renderInput={(params) => (
                  <TextField {...params} label='Permisos' variant='outlined' />
                )}
              />
            </div>

            <div className="col-md-12 d-flex justify-content-between">
              <button className="btn btn-dark" type="submit" disabled={!isValid || loading}>
                {loading ? 'Enviando...' : 'Actualizar'}
              </button>
              <button type="button" className="btn btn-danger">
                Cancelar
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ActualizarRol;