import React, { Component } from "react";
import { Button, FormGroup, FormControl} from "react-bootstrap";
import "./Login.css";
import Board from "./Board.js";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      submitted: false
    };
  }

  validateForm() {
    return this.state.user.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.setState({submitted: true});
  }

  render() { 
   var username = this.state.user;
    if (this.state.submitted) {
	    return ( <Board username = {username} /> );
    } else {
    return (
     <div>
	    <h1> Betrayal at the House on the Hill </h1>
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
            type="submit"
          >
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

