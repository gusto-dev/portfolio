import React, { Component } from 'react';
import TOP from "./components/TOP";
import HEADER from "./components/HEADER";
import LISTS from "./components/LISTS";
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      header:{title:"HeeGeun's Portfolio List"}
    }
  }
  render() {
    return (
      <div className="App">
        <TOP></TOP>
        <HEADER title={this.state.header.title}></HEADER>
        <LISTS></LISTS>
      </div>
    );
  }
}

export default App;