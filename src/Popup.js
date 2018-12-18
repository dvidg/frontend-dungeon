import React from 'react';
import {Button } from 'react-bootstrap';
import Dice from './Dice';

export default class Popup extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
			visible:true,
			diceValue: 1,
			diceRoll: false,
			websocket: this.props.websocket,
			myTurn: this.props.myTurn,
			phaseTwo: this.props.phaseTwo,
		    underAttack: this.props.underAttack,
		    hideDiceRoll: 0
		}
	}
  
    /* Rolls dice on click. */
    handleDiceRoll() {
        var random = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
		this.props.websocket.send("/event/response", {}, JSON.stringify({ "diceRoll": (random+1)}));
        this.setState({ diceRoll: true, diceValue: random });
        this.setState({hideDiceRoll: true});
    }

	/* Rolls dice on click. Sends response to fight. */
    handleDiceRollFight() {
        var random = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
        return random;
	}

	render() {
		if (this.props.underAttack) {
			console.log(this.state.popupVisible);
			console.log(this.props.popupVisible + "props");
			return ( 
				<div class="popup">
					<div> {this.props.children} </div>
					{/*<Dice diceRoll = {this.state.diceValue} onClick = {() => this.handleDiceRollFight()}/>*/}
					<Button onClick = { () => this.props.onClick() }> Continue </Button>
				</div>
			);
		} else if (this.props.visible && this.props.phaseTwo) { 
			return ( 
				<div class="popup">
					<div> {this.props.children} </div>
					<Button onClick = { () => this.props.onClick() }> Continue </Button>
				</div>
			);
		} else if (this.props.visible && this.props.myTurn && this.state.hideDiceRoll === 0) {
			return (
				<div class="popup">
		       		<div>{this.props.children}</div>
					<Dice diceRoll = {this.state.diceValue} onClick = {() => this.handleDiceRoll()}/>
				  	<Button onClick = { () => this.props.onClick() }> Continue </Button>
				</div>
			);
		} else if (this.props.visible && this.props.myTurn && this.state.hideDiceRoll === 1) {
			return (
				<div class="popup">
		       		<div>{this.props.children}</div>
				  	<Button onClick = { () => this.props.onClick() }> Continue </Button>
				</div>
			);
		} else {
			return ( 
				<div class="popup">
					<div> {this.props.children} </div>
					<Button onClick = { () => this.props.onClick() }> Continue </Button>
				</div>
			);	
		} 
  	}
}
