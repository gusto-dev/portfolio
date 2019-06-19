import React, { Component } from 'react';

class HEADER extends Component{
  render(){
    return (
      <header>
        <h1>{this.props.title}</h1>
        <h2>{this.props.sub}</h2>
      </header>
    );
  }
}

export default HEADER;