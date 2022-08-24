import React, { Component } from "react";
import axios from "axios"
import moment from "moment";
import {Modal, ModalBody, ModalFooter} from 'reactstrap';

const baseUrl = "https://api.datos.gob.mx/v1/condiciones-atmosfericas";

class App extends Component {
  state = {
    data: [],
    total: [],
    detalleDato_Modal: false,
    forms:{
      _id: '',
      cityid: '',
      name: '',
      state: '',
      probabilityofprecip: '',
      relativehumidity: '',
      lastreporttime: '',
      llueve: ''
    }
  };

  seleccionID = (datos) => {
    this.setState({detalleDato_Modal: true})
    this.setState({
      forms:{
        _id: datos._id,
        cityid: datos.cityid,
        name: datos.name,
        state: datos.state,
        probabilityofprecip: datos.probabilityofprecip,
        relativehumidity: datos.relativehumidity,
        lastreporttime: moment(datos.lastreporttime).format('YYYY/MM/DD'),
        llueve: datos.probabilityofprecip > 60 || datos.relativehumidity > 50 ? "Si" : "No"
      }
    })
  }

  obtenerInformacion = () =>{
    axios.get(baseUrl).then(response => {
      this.setState({data : response.data.results});
      //console.log(response.data.results)
      
    }).catch(error =>{
      console.log(error.message);
    })
    
  }

  totalRegistros = () =>{
    axios.get(baseUrl).then(response => {
      this.setState({total : response.data.pagination});
      //console.log(response.data.pagination.pageSize);
    }).catch(error =>{
      console.log(error.message);
    })
  }

  componentDidMount() {
    this.obtenerInformacion()
    
  }

  render() {
    const {forms} = this.state;
    return (
      <>
        <div className="container mt-5">
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">_id</th>
                <th scope="col">cityid</th>
                <th scope="col">name</th>
                <th scope="col">state</th>
                <th scope="col">probabilityofprecip</th>
                <th scope="col">relativehumidity</th>
                <th scope="col">lastreporttime<br/>(YYYY/MM/DD)</th>
                <th scope="col">Llueve</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.data.map(datos =>{
                  return(
                    <tr>
                      <th scope="row" onClick={() => {this.seleccionID(datos)}}>{datos._id}</th>
                      <td>{datos.cityid}</td>
                      <td>{datos.name}</td>
                      <td>{datos.state}</td>
                      <td>{datos.probabilityofprecip}</td>
                      <td>{datos.relativehumidity}</td>
                      <td>{moment(datos.lastreporttime).format('YYYY/MM/DD')}</td>
                      <td>{
                          datos.probabilityofprecip > 60 || datos.relativehumidity > 50 ? "Si" : "No"
                        }
                      </td>
                    </tr>
                  )
                })
              }              
            </tbody>
          </table>
          
          <div>
            {
              this.state.total.map(tot =>{
                return(
                  <p>Total de registros = {tot.pageSize}</p>
                )
              })
            }
          </div>
                    
          <Modal isOpen = {this.state.detalleDato_Modal}>
            <ModalBody>
              <li>
                <ul>_id: {forms._id}</ul>
                <ul>Cityid: {forms.cityid}</ul>
                <ul>Name: {forms.name}</ul>
                <ul>State: {forms.state}</ul>
                <ul>Probabilityofprecip: {forms.probabilityofprecip}</ul>
                <ul>Relativehumidity: {forms.relativehumidity}</ul>
                <ul>Lastreporttime: {moment(forms.lastreporttime).format('YYYY/MM/DD')}</ul>
                <ul>Llueve: {
                    forms.probabilityofprecip > 60 || forms.relativehumidity > 50 ? "Si" : "No"  
                  }
                </ul>
              </li>
            </ModalBody>
            <ModalFooter>
              <button type="button" className="btn btn-danger" onClick={() => this.setState({detalleDato_Modal: false})}>Regresar</button>
            </ModalFooter>

          </Modal>
        </div>
      </>
    );
  }
}

export default App;
