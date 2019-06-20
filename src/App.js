import React, { Component } from 'react';
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
        <HEADER title={this.state.header.title}></HEADER>
        <LISTS></LISTS>
      </div>
    );
  }
}

export default App;