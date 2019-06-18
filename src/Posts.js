import React, { Component } from 'react';
import axios from 'axios';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

class Posts extends Component {
  state = {
    posts: []
  };

  _loadPosts() {
    if (!this.state.posts.length) {
      axios.get(POSTS_URL).then(res => {
        this.setState({ posts: res.data.slice(0, 50) });
      });
    }
  }

  render() {
    this.props.isVisible && this._loadPosts();

    return (
      <div className="section">
        <div>
          <h1>
            Posts section {this.props.isVisible ? 'visible' : 'not visible yet'}{' '}
            && 50 posts {this.state.posts.length ? 'loaded' : 'not loaded yet'}
          </h1>
        </div>
        <div>
          {this.state.posts.map((post, index) => {
            return (
              <ul key={index}>
                <li>Post id: {post.id}</li>
                <li>Title: {post.title}</li>
                <li>Body: {post.body}</li>
              </ul>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Posts;