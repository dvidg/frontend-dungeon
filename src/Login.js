import { Button, FormGroup, FormControl} from "react-bootstrap";
import React, {Component } from 'react';
import "./Login.css";
import Lobby from './Lobby';

/* Login holds a user at login page until they submit a username.
 * Game components are rendered on submission.
 * This is our parent component to Game.
 */
export default class Login extends Component {
  constructor() {
  super();
  this.state = {
	  	submitted: false,
	  	user: "",
  };
}

  /* Can't submit until something is entered. */
  validateForm() {
    return this.state.user.length > 0;
  }

  /* Update state as user types so form can be validated. */
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  /* Setting submitted to true renders game. */
  handleSubmit = event => {
    event.preventDefault();
	this.setState({submitted: true});
  }

  /* Render game if submitted a username. If not, only render login page */
  render() { 
    if (this.state.submitted) {
      return (<div><Lobby user = {this.state.user}/></div>);
    } else {
    return (
      <div>
        <h1> Dungeon Betrayal</h1>
        <div className="Login">
          <form onSubmit= {this.handleSubmit}>
            <FormGroup controlId="user" bsSize="large">
              <FormControl
                autoFocus
                type="user"
                value={this.state.email}
                onChange={this.handleChange}
              />
            <Button
              block
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit">
              Play!
            </Button>
           </FormGroup>
          </form>
        </div>
      </div>
    );
  }
}
}
