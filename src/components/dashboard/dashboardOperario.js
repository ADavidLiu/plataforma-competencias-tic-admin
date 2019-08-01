import React, { Component } from "react";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TextField from "@material-ui/core/TextField";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";

import Warning from "@material-ui/icons/Warning";
import Add from "@material-ui/icons/Add";
import Delete from "@material-ui/icons/Delete";
import Info from "@material-ui/icons/Info";
import CheckCircle from "@material-ui/icons/CheckCircle";

import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Select from "@material-ui/core/Select";

import CircularProgress from '@material-ui/core/CircularProgress';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import generator from "generate-password";

import * as XLSX from "xlsx";

class DashboardOperario extends Component {
    constructor() {
        super();

        this.state = {
            tabIndex: 0,
            didSolicitudesLoad: false,
            isUploading: false,
            basesDeDatos: [],
            solicitudes: {
                practicas: [],
                preentrevistas: [],
                entrevistas: []
            },
            evaluadores: [],
            evaluadoresSeleccionados: {
                practicas: [],
                preentrevistas: [],
                entrevistas: []
            },
            form: {
                usuario: "",
                contrasenia: "",
                isCreado: false
            }
        }
    }

    componentDidMount = () => {
        /* Dentro de cada función, conectarse al backend para traer esta información y actulizar el estado. */
        const newSolicitudes = this.cargarSolicitudes();
        const newEvaluadores = this.cargarEvaluadores();

        this.setState({
            didSolicitudesLoad: true,
            solicitudes: newSolicitudes,
            evaluadores: newEvaluadores
        });
    }

    cargarSolicitudes = () => {
        return {
            practicas: [
                {
                    nombre: "John Doe",
                    fecha: "22-07-2019"
                },
                {
                    nombre: "Jane Doe",
                    fecha: "25-07-2019"
                }
            ],
            preentrevistas: [
                {
                    nombre: "John Doe",
                    fecha: "22-07-2019"
                }
            ],
            entrevistas: [
                {
                    nombre: "Jane Doe",
                    fecha: "20-07-2019"
                }
            ]
        };
    }

    cargarEvaluadores = () => {
        return [
            ...this.state.evaluadores,
            {
                ID: "evaluador-1",
                nombre: "John Doe",
                asignaciones: {
                    practicas: 1,
                    preentrevistas: 1,
                    entrevistas: 0
                }
            },
            {
                ID: "evaluador-2",
                nombre: "Jane Doe",
                asignaciones: {
                    practicas: 0,
                    preentrevistas: 1,
                    entrevistas: 2
                }
            }
        ];
    }

    handleTabChange = (e, newValue) => {
        this.setState({
            tabIndex: newValue
        });
    }

    eliminarArchivo = index => {
        const newBasesDeDatos = [...this.state.basesDeDatos];
        newBasesDeDatos.splice(index, 1);
        
        this.setState({
            basesDeDatos: newBasesDeDatos
        });
    }

    leerArchivo = (e, index) => {
        const fileReader = new FileReader();
        const file = e.target.files[0];

        fileReader.onprogress = e => {
            this.setState({
                isUploading: true
            });
        }

        fileReader.onabort = e => {
            this.setState({
                isUploading: false
            });
        }

        fileReader.onerror = e => {
            this.setState({
                isUploading: false
            });
        }

        fileReader.onloadend = e => {
            const newBasesDeDatos = [...this.state.basesDeDatos];

            const binario = e.target.result;
            const wb = XLSX.read(binario, {type:"binary"});
            
            /* PRIMERA hoja del archivo */
            const hojaIE = wb.SheetNames[0];
            const datosIE = wb.Sheets[hojaIE];
            const dataIE = XLSX.utils.sheet_to_json(datosIE, {header:1, blankrows: false});

            /* SEGUNDA hoja del archivo */
            const hojaSedes = wb.SheetNames[1];
            const datosSedes = wb.Sheets[hojaSedes];
            const dataSedes = XLSX.utils.sheet_to_json(datosSedes, {header:1, blankrows: false});

            /* TERCERA hoja del archivo */
            const hojaDocentes = wb.SheetNames[2];
            const datosDocentes = wb.Sheets[hojaDocentes];
            const dataDocentes = XLSX.utils.sheet_to_json(datosDocentes, {header:1, blankrows: false});

            newBasesDeDatos.push({
                file: file,
                binaryString: fileReader.result,
                nombre: file.name,
                data: {
                    ie: dataIE,
                    sedes: dataSedes,
                    docentes: dataDocentes
                }
            });

            this.setState({
                isUploading: false,
                basesDeDatos: newBasesDeDatos
            });
        };

        if (file) {
            fileReader.readAsBinaryString(file);
        }
    }

    seleccionarEvaluador = (e, index, tipoSolicitud) => {
        const newEvaluadoresSeleccionados = [...this.state.evaluadoresSeleccionados[tipoSolicitud]];
        const evaluadorEncontrado = this.state.evaluadores.find(evaluador => evaluador.ID === e.target.value);

        newEvaluadoresSeleccionados[index] = evaluadorEncontrado;

        this.setState({
            evaluadoresSeleccionados: {
                ...this.state.evaluadoresSeleccionados,
                [tipoSolicitud]: newEvaluadoresSeleccionados
            }
        });
    }

    asignarEvaluador = (index, tipoSolicitud) => {
        /* Conectarse al backend para asignarlo, y luego eliminarlo del array actual. */
        const newSolicitudes = [...this.state.solicitudes[tipoSolicitud]];
        newSolicitudes.splice(index, 1);

        const newEvaluadoresSeleccionados = [...this.state.evaluadoresSeleccionados[tipoSolicitud]];
        newEvaluadoresSeleccionados.splice(index, 1);

        this.setState({
            solicitudes: {
                ...this.state.solicitudes,
                [tipoSolicitud]: newSolicitudes
            },
            evaluadoresSeleccionados: {
                ...this.state.evaluadoresSeleccionados,
                [tipoSolicitud]: newEvaluadoresSeleccionados
            }
        });
    }

    crearEvaluador = e => {
        e.preventDefault();
        if (this.state.form.nombre !== "" && this.state.form.contrasenia !== "") {
            /* Enviar al backend */
            this.setState({
                form: {
                    usuario: "",
                    contrasenia: "",
                    isCreado: true
                }
            });
        }
    }

    reiniciarNotificacion = () => {
        this.setState({
            form: {
                ...this.state.form,
                isCreado: false
            }
        });
    }

    generarContrasenia = () => {
        this.setState({
            form: {
                ...this.state.form,
                contrasenia: generator.generate({
                    length: 10,
                    numbers: true
                })
            }
        });
    }

    handleFormChange = e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }
    
    render() {
        return (
            <Grid container>
                <Grid item xs={12} className="mb-5">
                    <Paper>
						<Tabs
							indicatorColor="primary"
							textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
							value={this.state.tabIndex}
							onChange={this.handleTabChange}
						>
                            <Tab label="Asignar solicitudes" />
   							<Tab label="Cargar bases de datos" />
   							<Tab label="Crear evaluadores" />
						</Tabs>
					</Paper>
                </Grid>
                <Grid item xs={12}>
                    {
                        this.state.tabIndex === 0 ? (
                            <Grid container spacing={5}>
                                <Grid item xs={12} className="pb-0">
                                    <Typography variant="h5">Solicitudes de revisión en espera</Typography>
                                    <hr/>
                                </Grid>
                                {
                                    Object.keys(this.state.evaluadoresSeleccionados).map(tipoSolicitud => {
                                        return (
                                            <React.Fragment key={tipoSolicitud}>
                                                {
                                                    this.state.didSolicitudesLoad ? (
                                                        <Grid item xs={12} sm={6} md={4}>
                                                            {
                                                                tipoSolicitud === "practicas" ? <Typography variant="h6" className="mb-4">Prácticas educativas</Typography> : tipoSolicitud === "preentrevistas" ? <Typography variant="h6" className="mb-4">Pre-entrevistas</Typography> : <Typography variant="h6" className="mb-4">Entrevistas</Typography>
                                                            }
                                                            {
                                                                this.state.solicitudes[tipoSolicitud].length === 0 ? (
                                                                    <Typography variant="body1"><CheckCircle color="primary" /> No hay solicitudes activas</Typography>
                                                                ) : (
                                                                    <div>
                                                                    {
                                                                        this.state.solicitudes[tipoSolicitud].map((solicitud, i) => {
                                                                            return (
                                                                                <Grid container spacing={5} key={i}>
                                                                                    <Grid item xs={12}>
                                                                                        <Paper className="p-4">
                                                                                            <Typography variant="body1"><strong>Nombre: </strong>{solicitud.nombre}</Typography>
                                                                                            <Typography variant="body1"><strong>Fecha de solicitud: </strong>{solicitud.fecha}</Typography>
                                                                                        </Paper>
                                                                                    </Grid>
                                                                                    <Grid item xs={12} className="py-0">
                                                                                        <Typography variant="body2" className="mb-2"><strong>Asignar evaluador</strong></Typography>
                                                                                        <FormControl variant="outlined" className="w-100">
                                                                                            <InputLabel htmlFor="seleccionarEvaluador">Seleccione un evaluador *</InputLabel>
                                                                                            <Select
                                                                                                value={this.state.evaluadoresSeleccionados[tipoSolicitud][i] ? this.state.evaluadoresSeleccionados[tipoSolicitud][i].ID : ""}
                                                                                                onChange={e => { this.seleccionarEvaluador(e, i, tipoSolicitud) }}
                                                                                                input={<OutlinedInput required name="evaluadoresSeleccionados" id="seleccionarEvaluador"/>}
                                                                                            >
                                                                                                {
                                                                                                    this.state.evaluadores.map((evaluador, i) => {
                                                                                                        return (
                                                                                                            <MenuItem key={i} value={evaluador.ID}>{evaluador.nombre}</MenuItem>
                                                                                                        );
                                                                                                    })
                                                                                                }
                                                                                            </Select>
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                    {
                                                                                        this.state.evaluadoresSeleccionados[tipoSolicitud][i] ? (
                                                                                            <Grid item xs={12}>
                                                                                                <div className="p-4 pt-3 d-flex align-items-start justify-content-between" style={{border: "1px solid #3f51b5", borderRadius: 5}}>
                                                                                                    <Info color="primary" className="mr-2" />
                                                                                                    <div className="flex-grow-1">
                                                                                                        <Typography variant="body1" className="mb-2"><strong>{this.state.evaluadoresSeleccionados[tipoSolicitud][i].nombre}</strong> tiene actualmente asignada la siguiente cantidad de revisiones:</Typography>
                                                                                                        <div className="d-flex align-items-start justify-content-between text-center">
                                                                                                            <Typography variant="subtitle2"><Typography component="span" variant="body1">{this.state.evaluadoresSeleccionados[tipoSolicitud][i].asignaciones.practicas}</Typography><br/>Prácticas</Typography>
                                                                                                            <Typography variant="subtitle2"><Typography component="span" variant="body1">{this.state.evaluadoresSeleccionados[tipoSolicitud][i].asignaciones.preentrevistas}</Typography><br/>Pre-entrevistas</Typography>
                                                                                                            <Typography variant="subtitle2"><Typography component="span" variant="body1">{this.state.evaluadoresSeleccionados[tipoSolicitud][i].asignaciones.entrevistas}</Typography><br/>Entrevistas</Typography>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </Grid>
                                                                                        ) : ""
                                                                                    }
                                                                                    <Grid item xs={12}>
                                                                                        <Button variant="contained" color="primary" size="large" disabled={this.state.evaluadoresSeleccionados[tipoSolicitud][i] === "" || this.state.evaluadoresSeleccionados[tipoSolicitud][i] === undefined} fullWidth onClick={() => { this.asignarEvaluador(i, tipoSolicitud); }}>Asignar</Button>
                                                                                    </Grid>
                                                                                    <Grid item xs={12} className="pt-0">
                                                                                        <hr/>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            );
                                                                        })
                                                                    }
                                                                    </div>
                                                                )
                                                            }
                                                        </Grid>
                                                    ) : (
                                                        <Grid item xs={12} className="text-center">
                                                            <CircularProgress color="primary" />
                                                        </Grid>
                                                    )
                                                }
                                            </React.Fragment>
                                        );
                                    })
                                }
                            </Grid>
                        ) : this.state.tabIndex === 1 ? (
                            <Grid container spacing={5}>
                                <Grid item xs={12} className="pb-0">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <Typography variant="h5">Archivos seleccionados</Typography>
                                        <Button
                                            variant="contained"
                                            component="label"
                                            color="primary"
                                        >
                                            <Add />
                                            <input type="file" required accept=".xlsm,.xlsx" onChange={this.leerArchivo} style={{ display: "none" }} />
                                        </Button>
                                    </div>
                                    <hr/>
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        this.state.basesDeDatos.length === 0 ? (
                                            <div className="d-md-flex align-items-center justify-content-center text-center">
                                                <Warning className="mb-2 mb-md-0 mr-md-2"/>
                                                <Typography variant="body2" className="text-md-left"><em>Dé click en el <strong>botón +</strong> en la esquina superior derecha para seleccionar los archivos. Recuerde que sólo se aceptan los formatos <strong>.xlsx</strong> y <strong>.xlsm</strong>.</em></Typography>
                                            </div>
                                        ) : (
                                            <React.Fragment>
                                                {
                                                    this.state.isUploading ? <CircularProgress color="primary" className="d-block mx-auto mb-3" /> : ""
                                                }
                                                {
                                                    this.state.basesDeDatos.map((archivo, i) => {
                                                        return (
                                                            <React.Fragment key={i}>
                                                                <div className="d-flex align-items-center justify-content-between">
                                                                    <Typography variant="body2"><em>{archivo.nombre}</em></Typography>
                                                                    <Delete style={{cursor:"pointer"}} onClick={() => { this.eliminarArchivo(i); }} />
                                                                </div>
                                                                <hr/>
                                                            </React.Fragment>
                                                        );
                                                    })
                                                }
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                    color="primary"
                                                    fullWidth
                                                >
                                                    Cargar archivos seleccionados
                                                    <input type="file" required accept=".xlsm,.xlsx" onInput={this.leerArchivo} style={{ display: "none" }} />
                                                </Button>
                                            </React.Fragment>
                                        )
                                    }
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid container spacing={5} justify="center">
                                <Grid item xs={12} className="text-center">
                                    <Typography variant="h5">Formulario de registro de evaluadores</Typography>
                                    <hr/>
                                </Grid>
                                <Grid item xs={12} sm={8} md={6} className="pt-0">
                                    <form onSubmit={this.crearEvaluador}>
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="usuario"
                                            label="Usuario"
                                            name="usuario"
                                            value={this.state.form.usuario}
                                            onChange={this.handleFormChange}
                                        />
                                        <div className="d-flex align-items-stretch justify-content-between mt-3 mb-2">
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                disabled
                                                id="contrasenia"
                                                label="Contraseña"
                                                name="contrasenia"
                                                type="text"
                                                value={this.state.form.contrasenia}
                                                onChange={this.handleFormChange}
                                                className="my-0"
                                            />
                                            <Button variant="outlined" color="primary" className="ml-4 px-4" onClick={this.generarContrasenia}>Generar</Button>
                                        </div>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className="mt-3"
                                            size="large"
                                        >
                                            Crear evaluador
                                        </Button>
                                    </form>
                                </Grid>
                            </Grid>
                        )
                    }
                </Grid>
                <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "left" }} open={this.state.form.isCreado} onClose={this.reiniciarNotificacion} autoHideDuration={3000} message={<span><CheckCircle size="sm" className="mr-2" />¡Evaluador creado exitosamente!</span>} />
            </Grid>
        );
    }
}

export default DashboardOperario;