import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Stepper from "@material-ui/core/Stepper";
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import { Link } from "react-router-dom";

import moment from "moment";

function Perfil(props) {
    const { tipo, perfil, userID } = props;

    let perfilMostrado = "";

    if (tipo === "DOCENTES") {
        perfilMostrado = (
            <Grid container alignItems="center">
                <Grid item xs={6}>
                    <Typography variant="subtitle1"><strong>{perfil.nombre}</strong></Typography>
                    <Typography variant="body2">Último ingreso: {perfil.ultimoIngreso === "" ? <strong>nunca ha ingresado</strong> : moment.unix(perfil.ultimoIngreso).format("DD/MM/YYYY - h:mm:ss")}</Typography>
                </Grid>
                <Grid item xs={6} className="text-right">
                    <Link to={{
                        pathname: "/dashboard-docente",
                        state: {
                            docenteID: userID
                        }
                    }} style={{textDecoration: "none"}}>
                        <Button
                            type="submit"
                            variant="outlined"
                            color="default"
                            size="medium"
                        >Ver detalles</Button>
                    </Link>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <Stepper
                            activeStep={perfil.pasoActual}
                            alternativeLabel
                            className="my-4"
                            style={{backgroundColor: "transparent"}}
                        >
                            <Step key="Registro">
                                <StepLabel>Registro de datos</StepLabel>
                            </Step>
                            <Step key="Prueba de conocimiento">
                                <StepLabel>Prueba de conocimiento</StepLabel>
                            </Step>
                            <Step key="Prácticas educativas">
                                <StepLabel>Prácticas educativas</StepLabel>
                            </Step>
                            <Step key="Preentrevista">
                                <StepLabel>Preentrevista</StepLabel>
                            </Step>
                            <Step key="Entrevista">
                                <StepLabel>Entrevista</StepLabel>
                            </Step>
                        </Stepper>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <hr/>
                </Grid>
            </Grid>
        );
    } else if (tipo === "ESTABLECIMIENTOS") {
        perfilMostrado = (
            <Grid container alignItems="center">
                <Grid item xs={6}>
                    <Typography variant="subtitle1"><strong>{perfil.nombre}</strong></Typography>
                    <Typography variant="body2">Número de docentes: {perfil.numDocentes}</Typography>
                </Grid>
                <Grid item xs={6} className="text-right">
                    <Link to={{
                        pathname: "/dashboard-ee",
                        state: {
                            establecimientoID: userID
                        }
                    }} style={{textDecoration: "none"}}>
                        <Button
                            type="submit"
                            variant="outlined"
                            color="default"
                            size="medium"
                        >Ver detalles</Button>
                    </Link>
                </Grid>
                <Grid item xs={12}>
                    <hr/>
                </Grid>
            </Grid>
        );
    } else if (tipo === "GOBIERNOS") {
        switch (perfil.tipo) {
            case "DOCENTE":
                perfilMostrado = (
                    <Grid container alignItems="center">
                        <Grid item xs={6}>
                            <Typography variant="subtitle1"><strong>{perfil.nombre}</strong></Typography>
                            <Typography variant="body2">Último ingreso: {perfil.ultimoIngreso === "" ? <strong>nunca ha ingresado</strong> : moment.unix(perfil.ultimoIngreso).format("DD/MM/YYYY - h:mm:ss")}</Typography>
                        </Grid>
                        <Grid item xs={6} className="text-right">
                            <Link to={{
                                pathname: "/dashboard-docente",
                                state: {
                                    docenteID: userID
                                }
                            }} style={{textDecoration: "none"}}>
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    color="default"
                                    size="medium"
                                >Ver detalles</Button>
                            </Link>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <Stepper
                                    activeStep={perfil.pasoActual}
                                    alternativeLabel
                                    className="my-4"
                                    style={{backgroundColor: "transparent"}}
                                >
                                    <Step key="Registro">
                                        <StepLabel>Registro de datos</StepLabel>
                                    </Step>
                                    <Step key="Prueba de conocimiento">
                                        <StepLabel>Prueba de conocimiento</StepLabel>
                                    </Step>
                                    <Step key="Prácticas educativas">
                                        <StepLabel>Prácticas educativas</StepLabel>
                                    </Step>
                                    <Step key="Preentrevista">
                                        <StepLabel>Preentrevista</StepLabel>
                                    </Step>
                                    <Step key="Entrevista">
                                        <StepLabel>Entrevista</StepLabel>
                                    </Step>
                                </Stepper>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <hr/>
                        </Grid>
                    </Grid>
                );
                break;
            case "ESTABLECIMIENTO":
                perfilMostrado = (
                    <Grid container alignItems="center">
                        <Grid item xs={6}>
                            <Typography variant="subtitle1"><strong>{perfil.nombre}</strong></Typography>
                            <Typography variant="body2">Número de docentes: {perfil.numDocentes}</Typography>
                        </Grid>
                        <Grid item xs={6} className="text-right">
                            <Link to={{
                                pathname: "/dashboard-ee",
                                state: {
                                    establecimientoID: userID
                                }
                            }} style={{textDecoration: "none"}}>
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    color="default"
                                    size="medium"
                                >Ver detalles</Button>
                            </Link>
                        </Grid>
                        <Grid item xs={12}>
                            <hr/>
                        </Grid>
                    </Grid>
                );
                break;
            case "GOBIERNO":
                perfilMostrado = (
                    <Grid container alignItems="center">
                        <Grid item xs={8}>
                            <Typography variant="subtitle1"><strong>{perfil.nombre}</strong></Typography>
                        </Grid>
                        <Grid item xs={4} className="text-right">
                            <Link to={{
                                pathname: "/dashboard-gobierno",
                                state: {
                                    establecimientoID: userID
                                }
                            }} style={{textDecoration: "none"}}>
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    color="default"
                                    size="medium"
                                >Ver detalles</Button>
                            </Link>
                        </Grid>
                        <Grid item xs={12} className="mt-4">
                            <Grid container spacing={1} className="d-flex align-items-stretch justify-content-between">
                                <Grid item xs={4}>
                                    <Paper className="p-3 p-md-4 text-center h-100">
                                        <Typography variant="body1">{perfil.numEstablecimientos}</Typography>
                                        <Typography variant="body2"><strong>Establecimientos</strong></Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper className="p-3 p-md-4 text-center h-100">
                                        <Typography variant="body1">{perfil.numDocentesIndependientes}</Typography>
                                        <Typography variant="body2"><strong>Docentes independientes</strong></Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper className="p-3 p-md-4 text-center h-100">
                                        <Typography variant="body1">{perfil.numDocentesAsociados}</Typography>
                                        <Typography variant="body2"><strong>Docentes asociados</strong></Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <hr className="my-4"/>
                        </Grid>
                    </Grid>
                );
                break;
            default:
                break;
        }
    }

    return perfilMostrado;
}

export default Perfil;