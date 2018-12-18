import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import Dice from './Dice';

/* Fight component only appears if two players are sharing a Square.
 * In which case, all players are listed on the fight pop up -
 * selecting a player allows you to initiate a fight.
 */
export default class Fight extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		    modal: false,
			diceValue: 1,
			dice: false,
			websocket: this.props.websocket,
			attacked: "",
			playerTurn: this.props.playerTurn, //username of active player
			playerList: this.props.playerList
		};
	this.handleClose = this.handleClose.bind(this);
	this.handleShow = this.handleShow.bind(this);
	}

  	handleClose() {
    	this.setState({ show: false });
  	}

  	handleShow() {
    	this.setState({ show: true });
  	}

	/* Display all players on tile so you can choose who to fight. */
  	listPlayers() {
		var list = [];
		var mySet = new Set(); // set used to remove duplicates
    	
		for (var j = 0; j <= (this.props.players).length-1; j++) {
			if (j != this.state.playerNumber) {
				if (!(mySet.has(this.props.players[j]))) {
					mySet.add(this.props.players[j]);
		}}}
		for (let i of mySet) {
				if (i === 0) {
			    	list.push(<Button onClick= {() => this.handleAttackZero()}> {i} </Button>);
				}
				if (i === 1) {
					list.push(<Button onClick= {() => this.handleAttackOne()}> {i} </Button>);
				}
				if (i === 2) {
					list.push(<Button onClick= {() => this.handleAttackTwo()}> {i} </Button>);
				}
				if (i === 3) {
					list.push(<Button onClick= {() => this.handleAttackThree()}> {i} </Button>);
				}
			}

		
		console.log(this.props.playerList + "Fight Array");
		console.log(mySet + "my set");
		return list;
  	}

   /* Rolls dice on click. */
    handleDiceRoll() {
        var random = Math.floor(Math.random() * 6) + 1 
		this.setState({ diceValue: (random - 1) }); //added -1
		this.props.websocket.send("/attack", {}, JSON.stringify({"playerName": this.state.attacked, "diceRoll": random, "attackerPlayerName": this.props.playerTurn}));
    }

	handleAttackZero() {
		console.log("zero");
		this.setState({dice: true, attacked: this.props.playerList[0]});
	}

	handleAttackOne() {
		console.log("one");
		this.setState({dice: true, attacked: this.props.playerList[1]});
	}

	handleAttackTwo() {
		console.log("two");
		this.setState({dice: true, attacked: this.props.playerList[2]});
	}

	handleAttackThree() {
		console.log("three");
		this.setState({dice: true, attacked: this.props.playerList[3]});
	}

  render() {
    if (!this.state.dice) {
      return (
          <div className="modal-container" style={{ height: 200 }}>
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={() => this.setState({ show: true })}
        >
        Fight!
		</Button>

        <Modal
          show={this.state.show}
          onHide={this.handleHide}
          container={this}
          aria-labelledby="Fight!"
        >
          <Modal.Body>
			<h2> Who do you want to fight? </h2>
			{this.listPlayers()} 
			   <Button onClick={this.handleClose}>Close</Button>
			</Modal.Body>
		  <Dice diceRoll = {this.state.diceValue} onClick={() => this.handleDiceRoll()}/>
        </Modal>
      </div>
	);
    } 
    else {
		      return (
          <div className="modal-container" style={{ height: 200 }}>
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={() => this.setState({ show: true })}
        >
        Fight!
        </Button>

        <Modal
          show={this.state.show}
          onHide={this.handleHide}
          container={this}
          aria-labelledby="Fight!"
        >
          <Modal.Body>
            <h2> Roll the Dice to fight! </h2>
               <Button onClick={this.handleClose}>Close</Button>
            </Modal.Body>
          <Dice diceRoll = {this.state.diceValue} onClick={() => this.handleDiceRoll()}/>
        </Modal>
      </div>
    );
	}
  }
}
