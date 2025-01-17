import { useAgenda} from "../../context/agenda/contexAgenda";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Nav from "../../components/Nav"
import ReactDOM from 'react-dom';
import Tooltip from '@mui/material/Tooltip';
import ModalCrearAgenda from '../agenda/modalCrearAgenda'

import { buscarCitaConClientePorId } from "../../api/rutasApiAgenda";


import "../../css/pages.css";
import AgendaInfo from './infoPago'
// import iconpay from "../../../public/img/check_payment_pay_icon_143297.svg"

function Pago(){

  const {activarAgenda,desactivarAgenda,listarCitaEstadoPago,searchTerm,setSearchTerm,filtrarDesactivadosPagos, desactivarProcesoPago, activarProcesoPago} =useAgenda()


  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  useEffect(() => {
    listarCitaEstadoPago();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 
 },[searchTerm]);

 const handleOpenModal = () => {
  setOpenCreateModal(true);
};

// Manejo envío formulario
const handleSubmitForm = async (formData) => {
agregarAgenda(formData)
};

// Cerrar modal create
const handleCloseModal = () => {
setOpenCreateModal(false);
}; 


  // // Modal de información
// Dentro de la función Pago

// Modal de información
// const handleOpenInfoModal = (AgendaInfo) => {
//   setSelectedAgenda(AgendaInfo);
//   setShowInfoModal(true);
// };
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


const handleCloseInfoModal = () => {
// setShowInfoModal(false);
setSelectedAgenda(null);
};



return(
    <>
    
    
    
    <Nav/>
    <main id="main" className="main">
    <div className="pagetitle">
      <h1>Gestión de pagos</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/home">Home</a>
          </li>
          <li className="breadcrumb-item active">
            <a href="/pago">Gestión de Pagos</a>
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
              rows={filtrarDesactivadosPagos.map((item) => ({
                ...item,
                id: item.id_Agenda,
                nombre: item.cliente.nombre,
                apellidos: item.cliente.apellidos
              }))}
              columns={[

                { field: 'nombre', headerName: 'Nombre cliente', flex: 0.8,headerClassName: "encabezado-negro", },
                { field: 'apellidos', headerName: 'Apellidos', flex: 0.8,headerClassName: "encabezado-negro", },
                { field: 'fecha', headerName: 'Fecha', flex: 0.7,headerClassName: "encabezado-negro", },
                { field: 'hora', headerName: 'Hora', flex: 0.5, headerClassName: "encabezado-negro",},
                {
                  field: 'estado_Pago',
                  headerName: 'Estado cita',
                  flex: 0.5,
                  headerClassName: "encabezado-negro",
                  renderCell: (params) => ( 
                    <Tooltip title="Pago" arrow>
                            <span>
                            <button className="btn btn-outline-danger me-1">
                              Finalizado
                            </button>

                            </span>
                            </Tooltip>
                  ),},
                  {
                    field: "info",
                    headerName:"Info",
                    flex:0.3,
                    headerClassName:"encabezado-negro",
                    renderCell: (params)=>(
                      <div>
                        <Tooltip title="Información" arrow>
                            <span>
                            <button
                              className="btn btn-outline-dark me-1"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.9px',
                                borderRadius: '50%',
                              }}
                                onClick={() => handleOpenInfoModal(params.row)}
                                
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" 
                                fill="gray" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                              </svg>
                            </button>
                            </span>
                          </Tooltip>
                      </div>
                    )
                  },
                
                
              ]}
                    pageSize={5}
                    pageSizeOptions={[5, 25, 50, 100]}
                      getRowClassName={(params) => {
                        if (!params.row.estado) {
                          return 'Agenda-desactivado';
                        }
                        return null
                      }}
            />
          </div>
        </div>
      </div>
    </div>
    </main>
    {/* modal de crear empleado */}
    {openCreateModal && ReactDOM.createPortal(
    <>
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1049,
    }}
    onClick={handleCloseModal}
    />
    <div className="modal-create" style={{position: 'fixed', top: '50%', left: '50%', transform: 'translateX(-50%)', zIndex: 1050, 
      maxHeight: '25vh', overflowY: 'visible', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '300%', height: '300%' }}>
        <ModalCrearAgenda handleSubmitForm={handleSubmitForm} handleCloseModal={handleCloseModal} />
      </div>
    </div>
  </>,
  document.body
)}

{showInfoModal && selectedAgenda && (
  <AgendaInfo
    Agenda={selectedAgenda}
    handleCloseModal={handleCloseInfoModal}
    open={showInfoModal}
  />
)}
    </>
    )
}
 
export default Pago;