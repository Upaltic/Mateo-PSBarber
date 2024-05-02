import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ element, requiredPermissions = [] }) => {
  const token = Cookies.get('token');
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Función para verificar si el usuario tiene los permisos requeridos
  const tienePermiso = (requierepermiso) => {
    if (!user || !user.permisos) {
      return false;
    }
    // Si requiredPermissions está vacío, se asume que no se requieren permisos específicos
    if (requierepermiso.length === 0) {
      return true;
    }
    // Comprobar si el usuario tiene todos los permisos requeridos
    return requierepermiso.every(permiso => user.permisos.includes(permiso));
  };

  if (!token) {
    // Redirige a la página de inicio de sesión si no hay token
    return <Navigate to="/login" replace />;
  } else if (!tienePermiso(requiredPermissions)) {
    // Redirige a la ruta especificada en redirectTo si el usuario no tiene los permisos necesarios
    return <Navigate to="/noDisponible" replace />;
  }

  // Renderiza el componente protegido si hay un token y si se cumplen los permisos requeridos
  return element;
};

export default ProtectedRoute;