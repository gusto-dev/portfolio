import React, { Component } from 'react';
import axios from 'axios';

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

class Users extends Component {
  state = {
    users: []
  };

  _loadUsers() {
    if (!this.state.users.length) {
      axios.get(USERS_URL).then(res => {
        this.setState({ users: res.data });
      });
    }
  }

  render() {
    this.props.isVisible && this._loadUsers();

    return (
      <div className="section">
        <div>
          <h1>
            Users section {this.props.isVisible ? 'visible' : 'not visible yet'}{' '}
            && 10 users {this.state.users.length ? 'loaded' : 'not loaded yet'}
          </h1>
        </div>
        <div>
          {this.state.users.map((user, index) => {
            return (
              <ul key={index}>
                <li>User id: {user.id}</li>
                <li>Name: {user.name}</li>
              </ul>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Users;