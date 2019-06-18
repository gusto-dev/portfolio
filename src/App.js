import React, { Component } from 'react';
import TrackVisibility from 'react-on-screen';
import Users from './Users';
import Posts from './Posts';
import Comments from './Comments';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TrackVisibility offset={500} once>
          <Users />
        </TrackVisibility>
        <TrackVisibility offset={300} once>
          <Posts />
        </TrackVisibility>
        <TrackVisibility offset={450} once>
          <Comments />
        </TrackVisibility>
      </div>
    );
  }
}

export default App;