import React from "react";

import DashboardOperario from "./dashboardOperario";
import DashboardVisualizador from "./dashboardVisualizador";

const Dashboard = props => {
    return (
        <React.Fragment>
            {
                props.tipoUsuario === "OPERARIO" ? <DashboardOperario /> : <DashboardVisualizador />
            }
        </React.Fragment>
    );
}

export default Dashboard;