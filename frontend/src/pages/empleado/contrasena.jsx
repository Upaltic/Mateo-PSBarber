import '../../css/login.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import  { useState } from 'react';
import Cookies from 'js-cookie';
import { cambiarContrasena } from '../../api/rutasApi';
import Swal from 'sweetalert2';
import * as Yup from 'yup'; 

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Correo electrónico inválido').required('Campo requerido'),
    contrasena: Yup.string().min(8, 'Mínimo 8 caracteres').required('Campo requerido').matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
      'Debe contener al menos una letra, un número y un carácter especial'
    ),
  });
  const handleRecuperarContrasena = async (values, { setSubmitting }) => {
    const { email, contrasena } = values;
    try {
      await cambiarContrasena(email, contrasena);
      Swal.fire({
        icon: 'success',
        title: 'Contraseña Cambiada.',
      }).then(() => {
        navigate('/');
      });
    } catch (error) {
      setError('Este correo no está registrado en la base de datos.');
      console.error('Error al cambiar la contraseña:', error);
    }
    setSubmitting(false);
  };

  
  return (
    <body className='body1'>
    <div className="BodyImg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">

                <div className="row">
                  {/* columna imagen */}
                  <div className="col-md-6">
                    <div className="logo-container">
                      <img
                        src="../../img/1687297823359 (1).png"
                        alt="Logo"
                        className="logo-card"
                      />
                    </div>
                    {/* fin */}
                  </div>
                  {/* columna formulario */}
                  <div className="col-md-6">
                    <div className="form-container">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <p className="brand-text">PS Barber</p>
                    <h5 className="card-title">Recuperar contraseña</h5>
                    <Formik 
                    initialValues={{
                      email:"",
                      contrasena:"" 
                    }}
                    onSubmit={handleRecuperarContrasena}
                    validationSchema={validationSchema} // Asigna el esquema de validación
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Correo electrónico
                          </label>
                          <Field type="email" id="email" name="email"   className="form-control" />
                          <small id="emailError" className="text-danger">
                          <ErrorMessage name="email" component="div" />
                          </small>
                          <label htmlFor="email" className="form-label">
                            Contraseña
                          </label>
                          <Field type="password" id="contrasena" name="contrasena" className="form-control" />
                          <small id="emailError" className="text-danger">
                          <ErrorMessage name="contrasena" component="div" className="text-danger" />
                          </small>
                        </div>
                        
                          <button type="submit" disabled={isSubmitting} className="btn btn-dark">
                            Enviar nueva contraseña
                          </button>
                        <div className="mt-3">
                          <a href="/" className="text-decoration-none">
                            De vuelta al inicio
                          </a>
                          <br />
                        </div>
                      </Form>
                    )
                    }
                  </Formik>
                    </div>
                  </div>
                  {/* fin */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </body>
    
  );
}

export default Login;
