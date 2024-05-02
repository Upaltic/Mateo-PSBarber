import { useRol } from "../../context/rol/RolContex";
import { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Nav from "../../components/Nav";
import '../../css/pages.css';
import ReactDOM from 'react-dom';
import Tooltip from '@mui/material/Tooltip';
import CrearRol from "./crearRol";
import '../../css/pages.css'
import RolUpdate from './actualizarRol'
import { putObternerEmpleadosDelRol } from "../../api/rutasApiRol";


const Rol = () => {

const{crearRoles,cargarRol,searchTerm,setSearchTerm,filtrarDesactivados,desactivarRol,activarRol,eliminarRol }=useRol()

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [selectedClienteId, setSelectedClienteId] = useState(null);


    const handleOpenInfoModal = async (agendaInfo) => {
      try {
        // Llamada a la función para obtener la información de la cita con el ID
        const data = await buscarCitaConClientePorId(agendaInfo.id_Agenda);
        // Abrir el modal y pasar los datos de la cita
        setSelectedAgenda(data);
        setShowInfoModal(true);
      } catch (error) {
        console.error('Error al obtener la información de la cita:', error);
        // Manejar el error según corresponda
      }
    };

    useEffect(() => {
        cargarRol()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchTerm]);

    const handleOpenModal = () => {
        setOpenCreateModal(true);
    };

    //   Manejo envío formulario
    const handleSubmitForm = async (formData) => {
    crearRoles(formData)
    };

    // Cerrar modal create
    const handleCloseModal = () => {
        setOpenCreateModal(false);
        cargarRol()
    };
    

//abrir update
const handleOpenUpdateModal = (id) => {
    setSelectedClienteId(id);
    setOpenUpdateModal(true);
  };

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
        cargarRol()
    };

    return (
        <>
            <Nav />
            <main id="main" className="main">
                <div className="">
                    <h1>Gestionar de Roles</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/home">Home</a>
                            </li>
                            <li className="breadcrumb-item active">
                                <a href="/rol">Gestionar de Roles</a>
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="container mt-5">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title"></h5>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex justify-content-between align-items-center mb-3">

                                    <button type="button" className="btn btn-dark" onClick={handleOpenModal}>
                                        Agregar Rol
                                    </button>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">

                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="form-control"
                                    />

                                </div>
                            </div>
                            <div>
                                <DataGrid
                                    stickyHeader
                                    autoHeight
                                    rows={filtrarDesactivados.map((item) => ({
                                      ...item,
                                      id: item.id_Rol
                                    }))}
                                    columns={[
                                        {field: 'nombre', headerName: 'Nombre', flex:0.4,headerClassName: "encabezado-negro" },
                                        {field: 'permisos', headerName: 'Permisos', flex: 1,headerClassName: "encabezado-negro"},
                                        {field: 'empleados', headerName: 'Empleados', flex: 1,headerClassName: "encabezado-negro"},
                                        {field: "estado",headerName: "Estado",flex: 0.2,headerClassName: "encabezado-negro",                          
                                        renderCell: (params) => ( 
                                          <Tooltip
                                          title={params.row.estado ? 'Inhabilitar' : 'Habilitar'}
                                          arrow
                                        >
                                          <div className="switch-button">
                                            <input
                                              type="checkbox"
                                              id={`switch-label-${params.row.nombre}`}
                                              checked={params.row.estado}
                                              onChange={(e) => {
                                                e.preventDefault(); // Evitar la navegación por defecto
                                                if (params.row.estado) {
                                                  desactivarRol(params.row.nombre);
                                                } else {
                                                  activarRol(params.row.nombre);
                                                }
                                              }}
                                              className="switch-button__checkbox"
                                            />
                                            <label
                                              htmlFor={`switch-label-${params.row.nombre}`}
                                              className="switch-button__label"></label>
                                          </div>
                                        </Tooltip>
                                        
                                            ),
                                          },
                                          {
                                            field: 'acciones',
                                            headerName: 'Acciones',
                                            flex: 0.4,
                                            headerClassName: 'encabezado-negro',
                                            renderCell: (params) => (
                                              <div>
                                                <Tooltip title="Actualizar" arrow>
                                                  <span>
                                                    <button
                                                      className="btn btn-outline-dark me-1"
                                                      onClick={() => { handleOpenUpdateModal(params.row.id_Rol); }}
                                                      disabled={!params.row.estado}
                                                      data-id={`edit-button-${params.row.id_Rol}`}
                                                    >
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 16 16"
                                                      >
                                                        <g fill="currentColor">
                                                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                          <path
                                                            fillRule="evenodd"
                                                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                                                          />
                                                        </g>
                                                      </svg>
                                                    </button>
                                                  </span>
                                                </Tooltip>
                                                {params.row.nombre === 'Administrador' || params.row.nombre === 'admin' || params.row.nombre === 'Administrador'  ? (
                                                  <Tooltip title="Eliminar" arrow>
                                                    <button
                                                      className="btn btn-outline-dark me-1"
                                                      onClick={() => eliminarRol(params.row.id_Rol)}
                                                      disabled
                                                    >
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 20 20"
                                                      >
                                                        <path
                                                          fill="currentColor"
                                                          d="m6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"
                                                        />
                                                      </svg>
                                                    </button>
                                                  </Tooltip>
                                                ) : (
                                                  <Tooltip title="Eliminar" arrow>
                                                    <button
                                                      className="btn btn-outline-dark me-1"
                                                      onClick={() => eliminarRol(params.row.id_Rol)}
                                                      disabled={!params.row.estado}
                                                    >
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 20 20"
                                                      >
                                                        <path
                                                          fill="currentColor"
                                                          d="m6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"
                                                        />
                                                      </svg>
                                                    </button>
                                                  </Tooltip>
                                                )}
                                              </div>
                                            ),
                                          }
                                          


                                    ]}
                                    
                                    pageSize={5}
                                    pageSizeOptions={[5, 25, 50, 100]}
                                    getRowClassName={(params) => {
                                    if (!params.row.estado) {
                                    return 'Rol-desactivado';
                                    }
                                    return null
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {openCreateModal && ReactDOM.createPortal(
                    <>
                        <div style={{
                            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 1049,
                        }}
                            onClick={handleCloseModal}
                        />
                        <div className="modal-create" style={{
                            position: 'fixed', top: '40%', left: '50%', transform: 'translateX(-50%)', zIndex: 1050,
                            maxHeight: '25vh', overflowY: 'visible', display: 'flex', alignItems: 'center'
                        }}>
                            <div style={{ width: '300%', height: '300%' }}>
                                <CrearRol handleSubmitForm={handleSubmitForm} handleCloseModal={handleCloseModal} />
                            </div>
                        </div>
                    </>,
                    document.body
                )}

{openUpdateModal && ReactDOM.createPortal(
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1049,
            }}
            onClick={handleCloseUpdateModal}
          />
          <div
            className="modal-update"
            style={{
            //   maxHeight: '0vh',
              position: 'fixed',
              top: '30%',
              left: '42%',
              transform: 'translateX(-50%)',
              zIndex: 1050,
              maxHeight: '25vh',
              overflowY: 'visible',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '150%', height: '180%' }}>
              <RolUpdate handleCloseUpdateModal={handleCloseUpdateModal} RolId={selectedClienteId}/>
            </div>
          </div>
        </>,
        document.body
      )}
            </main>
        </>
    );
};

export default Rol;
