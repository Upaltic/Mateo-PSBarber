import { useState, useEffect } from 'react';
import Nav from '../../components/Nav';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import "../../css/dashboart.css";
import { PieChart } from '@mui/x-charts/PieChart'; 
const baseURL = import.meta.env.VITE_REACT_API_URL;

    const Dashboard = () => {
        const [clienteConMasCitas, setClienteConMasCitas] = useState(null);
        const [citasDelMes, setCitasDelMes] = useState(null);
        const [totalPagado, setTotalPagado] = useState(null);
        const [serviciomaspedido, setserviciomaspedido] = useState(null);
        const [resumenDiario, setresumenDiario] = useState(null);
        const [orden_de_citas, setorden_de_citas] = useState(null);
        const [citas, setCitas] = useState([]);
        const [ventasMensuales ,setVentasMensuales] = useState(null);
        const [ventasSemanales ,setVentasSemanales] = useState(null);
        
        useEffect(() => {
            const fetchCitas = async () => {
                try {
                    const response = await axios.get(`${baseURL}agenda/analisisCitas`);
                    setCitas(response.data);
                } catch (error) {
                    console.error('Error al obtener las citas:', error);
                }
            };

            fetchCitas();
        }, []);  

        useEffect(() => {
            // Llamar a la API para obtener la información del cliente con más citas
            const fetchorden_de_citas= async () => {
                try {
                    const response = await axios.get(`${baseURL}agenda/analisisCitas`);
                    setorden_de_citas(response.data);
                } catch (error) {
                    console.error('Error al obtener el cliente con más citas:', error);
                }
            };

            fetchorden_de_citas();
        }, []);

        useEffect(() => {
            // Llamar a la API para obtener la información del cliente con más citas
            const fetchresumenDiario= async () => {
                try {
                    const response = await axios.get(`${baseURL}agenda/resumenDiario`);
                    setresumenDiario(response.data);
                } catch (error) {
                    console.error('Error al obtener el cliente con más citas:', error);
                }
            };

            fetchresumenDiario();
        }, []);

        useEffect(() => {
            // Llamar a la API para obtener la información del cliente con más citas
            const fetchserviciomaspedido= async () => {
                try {
                    const response = await axios.get(`${baseURL}agenda/servicioMasSolicitado`);
                    setserviciomaspedido(response.data);
                } catch (error) {
                    console.error('Error al obtener el cliente con más citas:', error);
                }
            };

            fetchserviciomaspedido();
        }, []);

        useEffect(() => {
            // Llamar a la API para obtener la información del cliente con más citas
            const fetchClienteConMasCitas = async () => {
                try {
                    const response = await axios.get(`${baseURL}agenda/clienteConMasCitas`);
                    setClienteConMasCitas(response.data);
                } catch (error) {
                    console.error('Error al obtener el cliente con más citas:', error);
                }
            };

            fetchClienteConMasCitas();
        }, []);

        useEffect(() => {
            // Llamar a la API para obtener la información del cliente con más citas
            const fetchCitasDelMes = async () => {
                try {
                    const response = await axios.get(`${baseURL}agenda/totalCitasEnMesActual`);
                    setCitasDelMes(response.data);
                } catch (error) {
                    console.error('Error al obtener citas del mes:', error);
                }
            };

            fetchCitasDelMes();
        }, []);

        useEffect(() => {
            // Llamar a la API para obtener la información del cliente con más citas
            const fetchTotalpagado = async () => {
                try {
                    const response = await axios.get(`${baseURL}agenda/totalPagado`);
                    setTotalPagado(response.data);
                } catch (error) {
                    console.error('Error al obtener citas del mes:', error);
                }
            };

            fetchTotalpagado ();
        }, []);

        useEffect(() => {
            const fetchVentasMensuales = async () => {
                try {
                    const response = await axios.get(`${baseURL}agenda/ventasMensuales`);
                    if (response.data) {
                        setVentasMensuales(response.data);
                    } else {
                        setVentasMensuales([]); // Otra alternativa podría ser establecer un valor predeterminado
                    }
                } catch (error) {
                    console.error('Error al obtener las ventas mensuales:', error);
                }
            };
        
            fetchVentasMensuales();
        }, []);

        useEffect(() => {
            const fetchVentasSemanales = async () => {
                try {
                    const response = await axios.get(`${baseURL}agenda/ventasSemanales`);
                    if (response.data) {
                        setVentasSemanales(response.data);
                    } else {
                        setVentasSemanales([]); // Otra alternativa podría ser establecer un valor predeterminado
                    }
                } catch (error) {
                    console.error('Error al obtener las ventas mensuales:', error);
                }
            };
        
            fetchVentasSemanales();
        }, []);
        

        const StyledTableCell = styled(TableCell)(({ theme }) => ({
            [`&.${tableCellClasses.head}`]: {
                backgroundColor: theme.palette.common.black,
                color: theme.palette.common.white,
            },
            [`&.${tableCellClasses.body}`]: {
                fontSize: 14,
            },
        }));
        
        const StyledTableRow = styled(TableRow)(({ theme }) => ({
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
            '&:last-child td, &:last-child th': {
                backgroundColor: theme.palette.common.grey,
                border: 0.2,
            },
        }));
        

        return (   
            <main id="main" className="main">
                <div className="pagetitle">
            <h1>Dashboard</h1>
            <nav>
                <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <a href="/home">Home</a>
                </li>
                <li className="breadcrumb-item active">
                    <a href="/Agenda">Dashboard</a>
                </li>
                </ol>
            </nav>
            </div>
            <div>
                <Nav/>
                    {/* primera colupna */}
                    <div className="card-containerdash">
                        <div className="carddash ">
                        {clienteConMasCitas && (
                        <div className="card-bodydash  text-center">
                        <h5 className="card-titledash  font-weight-bold mb-4 ">Cliente con más citas del mes</h5>
                        <p className="card-textdash  h1">{clienteConMasCitas.nombre}</p>
                        <p className="card-textdash ">
                        <h3 className="font-weight-bold ">{clienteConMasCitas.total_citas}</h3></p>
                    </div>
                    )}
                    </div>
                    {citasDelMes && (
                        <div className="carddash ">
                            <div className="card-bodydash  text-center">
                                <h5 className="mb-4 ">Total de citas del mes</h5>
                                <p className="card-textdash ">
                                <h1 className="font-weight-bold  ">{citasDelMes.totalCitas}</h1></p>
                                
                            </div>
                        </div>
                        )}
                    {totalPagado && (
    <div className="carddash ">
        <div className="card-bodydash  text-center">
            <h5 className=" mb-4 ">Total pagado</h5>
            <p className="card-textdash ">
                <h1 className="font-weight-bold  ">${parseInt(totalPagado.totalPagado).toLocaleString('es-CO')}</h1>
            </p>
        </div>
    </div>
)}

                        {serviciomaspedido && (
                        <div className="carddash ">
                        <div className="card-bodydash  text-center">
                                <h5 className="card-titledash  font-weight-bold "> Servicio más popular</h5>
                                <p className="card-textdash ">
                                    <h2 className="font-weight-bold  "> {serviciomaspedido.servicio.nombre}</h2></p>
                                    <p className="card-textdash ">Total de citas: {serviciomaspedido.total_solicitudes}</p>
                            </div>
                        </div>)}
                        
                    </div>

                    {/* segunda colupna */}
                    <div className="card-containerdash2">
                    {ventasMensuales && (
                        <div className="carddash2 text-center    ">
                        <h5 className="mt-4 mb-">Pagos mensuales</h5>
                        <BarChart
    dataset={ventasMensuales.map(item => ({
        mes: item.mes,
        ventas_mensuales: item.ventas_mensuales
    }))}
    xAxis={[{ scaleType: 'band', dataKey: 'mes' }]}
    series={[
        { dataKey: 'ventas_mensuales', label: 'Pagos Mensuales' }
    ]}
    height={300}
/>

                    </div>
                    )}
                    {orden_de_citas && (
                        <div className="carddash2 text-center">
                            <h5 className="mt-4 mb-">Próximas citas</h5>
                        <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Fecha</StyledTableCell>
                            <StyledTableCell>Hora</StyledTableCell>
                            <StyledTableCell>Nombre del Cliente</StyledTableCell>
                            <StyledTableCell>Servicios Realizados</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {citas.map((cita) => (
                            <StyledTableRow key={cita.fecha + cita.hora}>
                                <StyledTableCell component="th" scope="row">
                                    {cita.fecha}
                                </StyledTableCell>
                                <StyledTableCell>{cita.hora}</StyledTableCell>
                                <StyledTableCell>{cita.nombre_cliente}</StyledTableCell>
                                <StyledTableCell>{cita.servicios_realizados}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
                    </div>
                        )}
                    </div>
                    {/* tercera colupna graficas */}
                    <div className='card-containerdash2'>
                        
                    </div>
                    <div className="card-containerdash2">
                    <div className='carddash2 text-center'>
                        {resumenDiario && (
                    <div className="card-bodydash  text-center">
                        <h5 className="card-titledash">Resumen diario</h5>
                        <h5 className="card-text">Citas programadas para hoy: {resumenDiario.citas_programadas}</h5>
                        <h5 className="card-text pt-2">Cantidad de servicios programados para hoy :{resumenDiario.servicios_realizados}</h5>
                        <h5 className="card-text pt-2">Citas pagadas de hoy: {resumenDiario.pagos_recibidos}</h5>
    
                    </div>
                    )}
                        </div>
                        {ventasSemanales && (
    <div className="carddash2 text-center">
        <h5 className="mt-4 mb-">Citas en la semana</h5>
        <Stack direction="row" sx={{ width: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
            <PieChart
  series={[
    {
      data: ventasSemanales.map(item => ({
        id: item.dia_semana,
        value: item.citas_por_dia,
        // Puedes personalizar el color aquí si lo deseas
      })),
      highlightScope: { faded: 'global', highlighted: 'item' },
      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
      innerRadius: 26,
      paddingAngle: 7,
    },
  ]}
  margin={{
    left: 40,
    bottom: 10
  }}
  width={250}
  height={160}
/>

            </Box>
            <Box sx={{ flexGrow: 1 }}>
            <BarChart
                dataset={ventasSemanales.map(item => ({
                dia_semana: item.dia_semana,
                citas_por_dia: item.citas_por_dia
                }))}
                xAxis={[{ scaleType: 'band', dataKey: 'dia_semana' }]}
                series={[
                    { dataKey: 'citas_por_dia', label: 'citas semanales' }
                ]}
                height={160}
                />
            </Box>
        </Stack>
    </div>
)}

                    </div>
                
            </div>
            </main>  
        );
    };
    
    export default Dashboard;
