/* eslint-disable react/prop-types */
import{ useState, useEffect } from 'react';
import { Form, Formik} from 'formik';
import { listarPermiso } from '../../api/rutasApiRol';
import { useRol} from '../../context/Rol/RolContex';
import TextField from '@mui/material/TextField';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import Autocomplete from '@mui/material/Autocomplete';
import { getListarEmpleadoauto } from '../../api/rutasApi';
const CrearRol = ({ handleCloseModal }) => {

  const {listar,crearRoles} = useRol();
  const [nombreRol, setNombreRol]=useState("")

  const [permisosDisponibles, setPermisosDisponibles] = useState([]);
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);

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

 useEffect(() => {
  const fetchEmpleados = async () => {
    try {
      const response = await getListarEmpleadoauto();
      setEmpleadosDisponibles(response.data);
    } catch (error) {
      console.error('Error al obtener empleados', error);
    }
  };

  fetchEmpleados();
}, []);

  return (
    <div className="modal-content" style={{ width: '600px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <h5 className="card-title">Agregar nombre rol</h5>
      <Formik
        initialValues={{
          nombre: '',
          permisos: [],
          id_Empleado: '', // Cambiado de 'id_Empledo' a 'empleado'
        }}
        validate={() => {
          
        }}
        onSubmit={async (values) => {
          // Obtener los identificadores de los permisos seleccionados
          const permisosIds = values.permisos.map(permiso => permiso.id_Permiso);
          
          // Enviar el formulario con los permisos como identificadores
          await crearRoles({ ...values, nombre: nombreRol, permisos: permisosIds });

        }}
      >
        {({ handleChange, handleSubmit, setFieldValue, values, errors, isValid }) => (
          <Form onSubmit={handleSubmit} className="row g-3 needs-validation">
            <div className="mb-3">
            <Autocomplete 
                disablePortal
                id="rol"
                options={listar.filter((rol) => rol.estado).map(rol => rol.nombre)}
                getOptionLabel={(option) => option}
                value={values.nombre}
                onInputChange={(event, newInputValue) => {// Con esta parte se puede agregar el rol escrito
                  setNombreRol(newInputValue);
                }}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="Rol" sx={{ width: '100%' }}/>
                )}
              />
              {errors.nombre && (
                <div className='invalid-feedback'>{errors.nombre}</div>
              )}
            </div>

            <div className='col-md-12'>
            <Autocomplete
                          multiple
                          id='permisos'
                          name="permisos"
                          options={permisosDisponibles || []}
                          getOptionLabel={(option) => option.nombre}
                          value={values.permisos}
                          
                          onChange={(_, newValue) => {
                            setFieldValue('permisos', newValue);
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label='Permisos' variant='outlined' />
                          )}
                        />
            </div>
            <div className='col-md-12'>
            <Autocomplete 
                disablePortal
                id="fixed-tags-demo"
                options={empleadosDisponibles.filter((empleado) => empleado.estado)}
                getOptionLabel={(option) => `${option.nombre} ${option.apellidos}`}
                onChange={(event, newValue) => {
                   handleChange({ target: { name: 'id_Empleado', value: newValue ? newValue.id_Empleado : '' } });
                }}
                value={empleadosDisponibles.find((empleado) => empleado.id_Empleado === values.id_Empleado) || null}
                    sx={{ width: '100%' }}
                    renderInput={(params) => <TextField {...params} label="Empleado" sx={{ width: '100%' }}/>}
                />


            </div>

            <div className="col-md-12 d-flex justify-content-between">
              <button className="btn btn-dark" type="submit" disabled={!isValid || loading}>
                {loading ? 'Enviando...' : 'Agregar'}
              </button>
              <button type="button" className="btn btn-danger" onClick={handleCloseModal}>
                Cancelar
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CrearRol;
