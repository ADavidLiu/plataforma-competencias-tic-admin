import React, { Component } from "react";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import CircularProgress from '@material-ui/core/CircularProgress';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class DashboardOperario extends Component {
    constructor() {
        super();

        this.state = {
            tabIndex: 0,
            didSolicitudesLoad: false
        }
    }

    handleTabChange = (e, newValue) => {
        this.setState({
            tabIndex: newValue
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
							value={this.state.tabIndex}
							onChange={this.handleTabChange}
						>
   							<Tab label="Cargar nueva base de datos" />
   							<Tab label="Asignar evaluadores" />
						</Tabs>
					</Paper>
                </Grid>
                <Grid item xs={12}>
                    {
                        this.state.tabIndex === 0 ? (
                            <Grid container spacing={5}>
                                <Grid item xs={12}>
                                    <Typography variant="h5">Cargar nueva base de datos</Typography>
                                    <hr/>
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid container spacing={5}>
                                <Grid item xs={12}>
                                    <Typography variant="h5">Asignar evaluadores</Typography>
                                    <hr/>
                                </Grid>
                            </Grid>
                        )
                    }
                </Grid>
            </Grid>
        );
    }
}

export default DashboardOperario;