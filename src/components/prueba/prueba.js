import React, { Component } from "react";
import moment from "moment";

import { Redirect } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Snackbar from '@material-ui/core/Snackbar';

import preguntasPrueba from "../../models/preguntasPrueba";
import shuffleArray from "../../utils/shuffleArray";

import Pregunta from "../pregunta/pregunta"

class Prueba extends Component {
    constructor() {
        super();
        
        this.state = {
            tipoUsuario: "",
            isPruebaIniciada: false,
            isPruebaTerminada: false,
            preguntas: preguntasPrueba,
            respuestas: [],
            revision: {},
            tiempoDisponible: 5400 * 1000,
            tiempoRestante: "calculando..."
        }

        this.countdown = "";
        this.tiempoLimite = "";

        /* Para hacer las preguntas y el orden random */
        this.shuffledQuestions = shuffleArray(this.state.preguntas);
        this.codigosDescriptores = [];
        this.selectedQuestions = [];
        this.finalQuestions = [];

        /* Se obtienen los códigos de los descriptores */
        this.shuffledQuestions.forEach(question => {
            this.codigosDescriptores.push(question.codigoDescriptor);
        });
        /* Se eliminan duplicados */
        this.codigosDescriptores = [...new Set(this.codigosDescriptores)];

        /* Se agrupan todas las preguntas por descriptor en un array por cada uno */
        this.codigosDescriptores.forEach(codigo => {
            const codigoArray = this.shuffledQuestions.filter(question => question.codigoDescriptor === codigo);
            this.finalQuestions.push(codigoArray);
        });
        
        /* Se selecciona una pregunta random de cada descriptor */
        this.finalQuestions.forEach(questionsArray => {
            if (questionsArray.length > 1) {
                const randomIndex = Math.floor(Math.random() * Math.floor(questionsArray.length));
                questionsArray.splice(randomIndex, 1);
                const selectedQuestion = questionsArray.pop();
                this.selectedQuestions.push(selectedQuestion);   
            }
        });

        /* Se copian las preguntas seleccionadas al arreglo de preguntas finales */
        this.finalQuestions = [...this.selectedQuestions];
    }

    componentDidMount = () => {
        let infoCargada = {};
        if (this.props.location && this.props.location.state !== undefined) {
            infoCargada = {
                tipoUsuario: this.props.location.state.tipoUsuario
            }
        } else {
            infoCargada = {
                tipoUsuario: ""
            }
        }

        this.setState({
            tipoUsuario: infoCargada.tipoUsuario
        });
    }

    componentWillUnmount() {
        clearTimeout(this.tiempoLimite);
        clearInterval(this.countdown);
    }

    actualizarRespuestas = preguntaRespondida => {
        const encontrado = this.state.respuestas.find(respuesta => respuesta.id === preguntaRespondida.id);

        if (encontrado === undefined) {
            // el ID aún no está. Agregar.
            this.state.respuestas.push(preguntaRespondida);
        } else {
            // La pregunta ya había sido respondida. Actualizar.
            encontrado.respuestaSeleccionada = preguntaRespondida.respuestaSeleccionada;
        }
    }

    revisarRespuestas = e => {
        if (e) {
            e.preventDefault();
            this.setState({
                ...this.state,
                isPruebaTerminada: true
            });
        }
        
        const revision = {
            numCorrectas: 0,
            numIncorrectas: 0,
            correctas: [],
            incorrectas: []
        }
        
        this.state.respuestas.forEach(respuesta => {
            this.state.preguntas.find(pregunta => {
                if (respuesta.id === pregunta.id) {
                    const preguntaRevisada = {
                        id: pregunta.id,
                        codigoDescriptor: pregunta.codigoDescriptor
                    };

                    if (respuesta.respuestaSeleccionada === pregunta.respuesta) {
                        revision.numCorrectas++;
                        revision.correctas.push(preguntaRevisada);
                    } else {
                        revision.numIncorrectas++;
                        revision.incorrectas.push(preguntaRevisada);   
                    }
                }
                return null;
            });
        });

        this.setState({
            ...this.state,
            isPruebaTerminada: true,
            revision: revision
        });

        console.log(revision);
        // Enviar al backend ahora!
    }

    iniciarPrueba = () => {
        this.setState({
            ...this.state,
            isPruebaIniciada: true
        });

        let duracion = this.state.tiempoDisponible;

        this.countdown = setInterval(() => {
            const tempTime = moment.duration(duracion);
            const nuevoTiempoRestante = `${tempTime.hours()}:${tempTime.minutes()}:${tempTime.seconds()}`;

            this.setState({
                tiempoRestante: nuevoTiempoRestante
            });

            duracion -= 1000;
        }, 1000);

        this.tiempoLimite = setTimeout(() => {
            this.revisarRespuestas();
            this.setState({
                ...this.state,
                isPruebaTerminada: true
            });
            clearTimeout(this.tiempoLimite);
            clearInterval(this.countdown);
        }, this.state.tiempoDisponible);
    }

    terminarPrueba = () => {
        /* Realmente, volver a la página de inicio de cada usuario */
        this.props.history.push("/dashboard");
    }

    render() {
        if (this.props.location && this.props.location.state === undefined) {
            return <Redirect to="/" />
        }

        return (
            <React.Fragment>
                <Grid container justify="center">
                    <Grid item xs={12} sm={8} md={6}>
                        <form onSubmit={this.revisarRespuestas}>
                            {!this.state.isPruebaIniciada ? (
                                <React.Fragment>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" className="mb-5 text-center">Prueba de conocimiento sobre apropiación de las TIC a las prácticas educativas</Typography>
                                        <Typography variant="h6" className="mb-2">Introducción</Typography>
                                        <Typography variant="body1" className="mb-4">Esta es una prueba para evaluar el conocimiento acerca del diseño, implementación y evaluación de prácticas educativas con TIC.</Typography>
                                        <Typography variant="h6" className="mb-2">Instrucciones</Typography>
                                        <Typography variant="body1">A continuación, encontrará 31 preguntas de opción múltiple con única respuesta. Cada pregunta está constituida por un enunciado y cuatro (4) opciones de respuesta. Seleccione la opción que considere más correcta. Esta prueba debe ser finalizada una vez se inicia. Puede tomarse hasta una hora y treinta minutos (1:30) para responder. La resolución de la prueba es estrictamente individual.</Typography>
                                    </Grid>
                                    <Grid item xs={12} className="mt-5">
                                        <Button
                                            type="button"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className="mt-2"
                                            size="large"
                                            onClick={this.iniciarPrueba}
                                        >
                                            Iniciar prueba
                                        </Button>
                                    </Grid>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" className="text-center">Cuestionario de preguntas</Typography>
                                        <hr className="my-5" />
                                        {this.finalQuestions.map(pregunta => {
                                            return <Pregunta key={pregunta.id} id={pregunta.id} data={pregunta} actualizarRespuestas={this.actualizarRespuestas} />
                                        })}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className="mt-2"
                                            size="large"
                                        >
                                            Enviar respuestas
                                        </Button>
                                    </Grid>
                                </React.Fragment>
                            )}
                        </form>
                    </Grid>
                </Grid>
                <Dialog open={this.state.isPruebaTerminada} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Resultados</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            La prueba ha finalizado. A continuación podrá encontrar sus resultados.
                            <br/><br/>
                            <strong>Preguntas correctas:</strong> {this.state.revision.numCorrectas}
                            <br/>
                            <strong>Preguntas incorrectas:</strong> {this.state.revision.numIncorrectas}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.terminarPrueba}>Volver a inicio</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    key="tiempo-restante"
                    open={!this.state.isPruebaTerminada && this.state.isPruebaIniciada}
                    ContentProps={{ 'aria-describedby': 'message-id' }}
                    message={"Tiempo restante: " + this.state.tiempoRestante}
                />
            </React.Fragment>
        );
    }
}

export default Prueba;