import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import DashboardOperario from "./dashboardOperario";
import DashboardVisualizador from "./dashboardVisualizador";

class Dashboard extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.props.tipoUsuario === "OPERARIO" ? <DashboardOperario /> : <DashboardVisualizador />
                }
            </React.Fragment>
        );
    }
}

export default Dashboard;