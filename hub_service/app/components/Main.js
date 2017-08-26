import React from "react";
import Solar from "./Solar";
import House from "./House";
import Motor from "./Motor";
import MotorBatteryGroup from "./MotorBatteryGroup";
import Enviro from "./Enviro";
import Gps from "./Gps";

class Main extends React.Component {

  constructor() {
    super();

    this.state = {
      history: [],
      telemetry: []
    }

    this.getHistory = this.getHistory.bind(this);
  }

  componentDidMount() {

    fetch('/all/60')
      .then((res) => res.json())
        .then((obj) => {
          //console.log(obj);
          this.setState({history: obj});
        });

    var ws = new WebSocket('ws://192.168.10.1:8080');

    ws.onmessage = function(event) {
        var telemetry = JSON.parse(event.data);
        this.setState({telemetry: telemetry});
    }.bind(this);
  }

  getHistory() {
    return(this.state.history);
  }

  render() {

    var house,
        solar,
        enviro,
        gps,
        motor,
        motorbatts;

    var list = this.state.telemetry.map((elem) => { return elem.family; })

    if(list.includes('house')) {
      var data = this.state.telemetry.filter((elem) => {return elem.family === 'house'});
      house = (
        <div className="component-container">
          <House data={data} color="royalblue" history={this.getHistory}/>
        </div>
      )
    }

    if(list.includes('solar')) {
      var data = this.state.telemetry.filter((elem) => {return elem.family === 'solar'});
      solar = (
        <div className="component-container">
          <Solar data={data} color="gold"/>
        </div>
      )
    }

    if(list.includes('motor')) {
      var data = this.state.telemetry.filter((elem) => {return elem.family === 'motor'});
      motor = (
        <div className="component-container">
          <Motor data={data} color="firebrick"/>
        </div>
      )
    }

    if(list.includes('motorbatt')) {
      var data = this.state.telemetry.filter((elem) => {return elem.family === 'motorbatt'});
      motorbatts = (
        <div className="component-container">
          <MotorBatteryGroup data={data} color="orange"/>
        </div>
      )
    }

    if(list.includes('enviro')) {
      var data = this.state.telemetry.filter((elem) => {return elem.family === 'enviro'});
      enviro = (
        <div className="component-container">
          <Enviro data={data} color="darkviolet"/>
        </div>
      )
    }

    if(list.includes('gps')) {
      var data = this.state.telemetry.filter((elem) => {return elem.family === 'gps'});
      gps = (
        <div className="component-container">
          <Gps data={data} color="lightseagreen"/>
        </div>
      )
    }

    return (
      <div className="mainContainer">
        {house}
        {solar}
        {enviro}
        {gps}
        {motor}
        {motorbatts}
      </div>
    )

  }
}
export default Main;
