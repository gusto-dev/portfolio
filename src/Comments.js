import React, { Component } from 'react';
import axios from 'axios';

const COMMENTS_URL = 'https://jsonplaceholder.typicode.com/comments';

class Comments extends Component {
  state = {
    comments: []
  };

  _loadComments() {
    if (!this.state.comments.length) {
      axios.get(COMMENTS_URL).then(res => {
        this.setState({ comments: res.data });
      });
    }
  }

  render() {
    this.props.isVisible && this._loadComments();

    return (
      <div className="section">
        <div>
          <h1>
            Comments section{' '}
            {this.props.isVisible ? 'visible' : 'not visible yet'} && 500
            comments {this.state.comments.length ? 'loaded' : 'not loaded yet'}
          </h1>
        </div>
        <div>
          {this.state.comments.map((comment, index) => {
            return (
              <ul key={index}>
                <li>Comment id: {comment.id}</li>
                <li>Name: {comment.name}</li>
                <li>Email: {comment.email}</li>
                <li>Body: {comment.body}</li>
              </ul>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Comments;