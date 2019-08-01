import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import CircularProgress from '@material-ui/core/CircularProgress';

import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Select from "@material-ui/core/Select";

import VisorPerfiles from "../visorPerfiles/visorperfiles";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import moment from "moment";

class DashboardVisualizador extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            divisiones: [],
            divisionMostrada: 0,
            data: [],
            categoriaSeleccionada: "gobiernos",
            paises: [],
            paisSeleccionado: {
                nombre: "Todos",
                gobiernos: [],
                establecimientos: [],
                docentes: []
            }
        }

        this.timeouts = [];
    }

    componentDidMount = () => {
        /* Conexión al backend */
        const dataCargada = [
            {
                pais: "Colombia",
                gobiernos: [
                    {
                        tipo: "GOBIERNO",
                        perfilID: "gobierno-1",
                        nombre: "Ministerio de Educación Nacional",
                        numEstablecimientos: 5281,
                        numDocentesAsociados: 3520,
                        numDocentesIndependientes: 927
                    },
                    {
                        tipo: "GOBIERNO",
                        perfilID: "gobierno-2",
                        nombre: "Secretaría de Educación de Cali",
                        numEstablecimientos: 125,
                        numDocentesAsociados: 870,
                        numDocentesIndependientes: 103
                    }
                ],
                establecimientos: [
                    {
                        tipo: "ESTABLECIMIENTO",
                        perfilID: "establecimiento-1",
                        nombre: "Universidad Javeriana - Cali",
                        numDocentes: 341
                    }
                ],
                docentes: [
                    {
                        tipo: "DOCENTE",
                        perfilID: "docente-1",
                        nombre: "John Doe",
                        pasoActual: 3,
                        ultimoIngreso: moment().unix()
                    },
                    {
                        tipo: "DOCENTE",
                        perfilID: "docente-2",
                        nombre: "Jane Doe",
                        pasoActual: 1,
                        ultimoIngreso: moment().unix()
                    }
                ]
            },
            {
                pais: "Perú",
                gobiernos: [
                    {
                        tipo: "GOBIERNO",
                        perfilID: "gobierno-3",
                        nombre: "Ministerio de Educación Nacional",
                        numEstablecimientos: 2485,
                        numDocentesAsociados: 1200,
                        numDocentesIndependientes: 309
                    }
                ],
                establecimientos: [
                    {
                        tipo: "ESTABLECIMIENTO",
                        perfilID: "establecimiento-2",
                        nombre: "Universidad John Doe - Lima",
                        numDocentes: 198
                    }
                ],
                docentes: [
                    {
                        tipo: "DOCENTE",
                        perfilID: "docente-3",
                        nombre: "Jane Doe",
                        pasoActual: 4,
                        ultimoIngreso: moment().unix()
                    }
                ]
            }
        ];

        const todos = {
            pais: "Todos",
            gobiernos: [],
            establecimientos: [],
            docentes: []
        };
        dataCargada.forEach(division => {
            todos.gobiernos = [...todos.gobiernos, ...division.gobiernos];
            todos.establecimientos = [...todos.establecimientos, ...division.establecimientos];
            todos.docentes = [...todos.docentes, ...division.docentes];
        });
        dataCargada.unshift(todos);

        const paisesCargados = [...this.state.paises];
        dataCargada.forEach(division => {
            paisesCargados.push(division.pais);
        });

        this.setState({
            isLoading: false,
            data: dataCargada,
            paises: paisesCargados,
            paisSeleccionado: {
                nombre: todos.pais,
                gobiernos: [...todos.gobiernos],
                establecimientos: [...todos.establecimientos],
                docentes: [...todos.docentes]
            }
        });
    }

    cargarDatosDivision = nuevaDivisionIndex => {
        /* Simulando un delay al traer los datos del backend, para ver la animación de carga. */
        const timeout = setTimeout(() => {
            this.setState({
                isLoading: false,
            });

            clearTimeout(timeout);
        }, 500);
        this.timeouts.push(timeout);
    }

    handleTabChange = (e, newValue) => {
        let nuevaCategoria = "";
        switch (newValue) {
            case 0:
                nuevaCategoria = "gobiernos";
                break;
            case 1: 
                nuevaCategoria = "establecimientos";
                break;
            case 2:
                nuevaCategoria = "docentes";
                break;
        }

        this.setState({
            divisionMostrada: newValue,
            isLoading: true,
            categoriaSeleccionada: nuevaCategoria
        });

        this.timeouts.forEach(timeout => {
            clearTimeout(timeout);
        });

        this.cargarDatosDivision(newValue);
    }

    handlePaisChange = e => {
        const paisEncontrado = this.state.data.find(division => division.pais === e.target.value);

        this.setState({
            paisSeleccionado: {
                nombre: paisEncontrado.pais,
                gobiernos: [...paisEncontrado.gobiernos],
                establecimientos: [...paisEncontrado.establecimientos],
                docentes: [...paisEncontrado.docentes]
            }
        });
    }
    
    render() {
        return (
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <Paper>
						<Tabs
							indicatorColor="primary"
							textColor="primary"
							value={this.state.divisionMostrada}
							onChange={this.handleTabChange}
						>
							<Tab label="Gobiernos"/>
							<Tab label="Establecimientos Educativos"/>
							<Tab label="Docentes"/>
						</Tabs>
					</Paper>
                </Grid>
                {
                    this.state.isLoading ? (
                        <Grid item xs={12}>
                            <CircularProgress color="primary" className="d-block mx-auto" />
                        </Grid>
                    ) : (
                        <React.Fragment>
                            <Grid item xs={12}>
                                <div className="d-flex align-items-center justify-content-start">
                                    <Typography variant="body1" className="mr-3">Actualmente viendo datos de:</Typography>
                                    <FormControl variant="filled" className="col-6 col-md-auto">
                                        <Select
                                            value={this.state.paisSeleccionado.nombre}
                                            onChange={this.handlePaisChange}
                                            variant="filled"
                                            input={<OutlinedInput required name="subdivisionSeleccionada" id="modalidadTrabajoActividad"/>}
                                        >
                                            {
                                                this.state.paises.map((pais, i) => {
                                                    return (
                                                        <MenuItem key={i} value={pais}>{pais}</MenuItem>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                                <hr/>
                            </Grid>
                            <Grid item xs={12}>
                                <VisorPerfiles tipo="GOBIERNOS" numPorPagina={6} perfiles={this.state.paisSeleccionado[this.state.categoriaSeleccionada]} />
                            </Grid>
                        </React.Fragment>
                    )
                }
            </Grid>
        );
    }
}

export default DashboardVisualizador;