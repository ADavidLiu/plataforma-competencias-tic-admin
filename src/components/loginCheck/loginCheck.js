import React, { Component } from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Home from '@material-ui/icons/Home';
import ExitToApp from '@material-ui/icons/ExitToApp';

import Login from "../login/login";
import Dashboard from "../dashboard/dashboard";
import DashboardDocente from "../dashboard/dashboardDocente";
import DashboardEstablecimientoEducativo from "../dashboard/dashboardEstablecimientoEducativo";
import DashboardGobierno from "../dashboard/dashboardGobierno";
import Pagina404 from "../pagina404/pagina404";
import Prueba from "../prueba/prueba";
import Practicas from "../practicas/practicas";
import Preentrevista from "../preentrevista/preentrevista";
import Entrevista from "../entrevista/entrevista";

class LoginCheck extends Component {
    constructor() {
        super();

        this.state = {
            isLogeado: true,
            id: "",
            tipoUsuario: "",
            datosPerfil: {}
        }
    }

    componentDidMount = () => {
        /* Aquí se debe verificar el login inicial del usuario */
        /* Sino, conectarse al backend para obtener los datos personales del evaluador */
        this.setState({
            id: "usuario-1",
            tipoUsuario: "VISUALIZADOR",
            datosPerfil: {
                nombre: "Usuario visualizador",
                imgSrc: ""
            }
        });
    }

    revisarInformacion = data => {
        /* Conectarse al backend para chequear si se logeó bien */

        /* if true. Con los datos correctos */
        this.setState({
            isLogeado: true,
            id: "usuario-1",
            tipoUsuario: "VISUALIZADOR",
            datosPerfil: {
                nombre: "Usuario visualizador",
                imgSrc: ""
            }
        });
    }

    logout = () => {
        this.setState({
            isLogeado: false,
            id: "",
            tipoUsuario: "",
            datosPerfil: {}
        });
    }

    render() {
        return (
            <Router>
                <CssBaseline />
                {
                    this.state.isLogeado ? (
                        <AppBar position="static" color="primary">
                            <Toolbar>
                                <Avatar alt="Imagen de perfil" src={this.state.datosPerfil.imgSrc !== "" ? this.state.datosPerfil.imgSrc : "https://via.placeholder.com/200"} className="mr-3" />
                                <Typography variant="h6" color="inherit">{this.state.datosPerfil.nombre}</Typography>
                                <div className="d-flex align-items-center justify-content-end flex-grow-1">
                                    {
                                        this.state.tipoUsuario !== "OPERARIO" ? (
                                            <Link to="/" className="mr-4">
                                                <IconButton style={{ color: "#ffffff" }} edge="start">
                                                    <Home />
                                                </IconButton>
                                            </Link>
                                        ) : ""
                                    }
                                    <Link to="/">
                                        <IconButton style={{ color: "#ffffff" }} edge="start" onClick={this.logout}>
                                            <ExitToApp />
                                        </IconButton>
                                    </Link>
                                </div>
                            </Toolbar>
                        </AppBar>
                    ) : (
                        <AppBar position="static" color="primary">
                            <Toolbar>
                                <Typography variant="h6" color="inherit">Plataforma de competencias TIC</Typography>
                            </Toolbar>
                        </AppBar>
                    )
                }
                <Container component="main">
                    <div className="py-5">
                        <Switch>
                            <Route path="/" exact render={(...routeProps) => {
                                if (this.state.isLogeado) {
                                    return <Dashboard {...routeProps} tipoUsuario={this.state.tipoUsuario} userID={this.state.id} />;
                                } else {
                                    return <Login {...routeProps} isLogeado={this.state.isLogeado} revisarInformacion={this.revisarInformacion} />
                                }
                            }} />
                            {
                                this.state.isLogeado ? (
                                    <Switch>
                                        <Route path="/login/" render={(...routeProps) => <Login {...routeProps} isLogeado={this.state.isLogeado} revisarInformacion={this.revisarInformacion} />} />
                                        <Route path="/dashboard/" render={(...routeProps) => <Dashboard {...routeProps} tipoUsuario={this.state.tipoUsuario} userID={this.state.id} />} />
                                        <Route path="/dashboard-docente/" render={(...routeProps) => <DashboardDocente {...routeProps} tipoUsuario={this.state.tipoUsuario} userID={this.state.id} />} />
                                        <Route path="/dashboard-ee/" render={(...routeProps) => <DashboardEstablecimientoEducativo {...routeProps} tipoUsuario={this.state.tipoUsuario} userID={this.state.id} />} />
                                        <Route path="/dashboard-gobierno/" render={(...routeProps) => <DashboardGobierno {...routeProps} tipoUsuario={this.state.tipoUsuario} userID={this.state.id} />} />
                                        <Route path="/prueba/" component={Prueba}></Route>
                                        <Route path="/practicas/" component={Practicas}></Route>
                                        <Route path="/preentrevista/" component={Preentrevista}></Route>
                                        <Route path="/entrevista/" component={Entrevista}></Route>
                                        <Route component={Pagina404} />
                                    </Switch>
                                ) : ""
                            }
                            <Route component={Pagina404} />
                        </Switch>
                    </div>
                </Container>
            </Router>
        );
    };
}

export default LoginCheck;