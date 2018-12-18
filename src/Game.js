import React from "react";
import Board from "./Board";
import Event from "./Event";
import Fight from './Fight';
import { Button } from 'react-bootstrap';
import Popup from './Popup';
//import Expire from './Expire';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

/* Game is our parent component (after login).
*  Creates websocket connection and manages all subscriptions - any updates from subscriptions gets passed to child componenet as props.
*  Board, Dice, Events and Stats are rendered from here.
*/
class Game extends React.Component {
	constructor(props) {
    super(props);
    this.state = { //need to comment these
		user: this.props.user,
		eventHistory: this.props.eventHistory, //past events
		playerTurn: this.props.playerTurn, //username of current active player
		previousTurn: this.props.previousTurn,
		myTurn: this.props.myTurn, //true if your turn
		playerNumber: this.props.playerNumber, //your usernumber (+1 for counter)
		visualMap: this.props.visualMap, //map
		playerLocation: this.props.playerLocation, //playerLocations
		phaseTwo: this.props.phaseTwo, //true if phase two
		fight: false, //true if fight
		omen: this.props.omen, //counter, incleases per click currently
		websocket: this.props.websocket,
		popupVisible: this.props.popupVisible,
		currentEvent: this.props.currentEvent,
		playerList: this.props.playerList, //list of players
		underAttack: this.props.underAttack,
		attackResult: this.props.attackResult,
		playerStats: this.props.playerStats
	};
  }

	//Update state  
	componentWillReceiveProps(nextProps){
		if(nextProps.popupVisible !== this.props.popupVisible) {
			this.setState({popupVisible:nextProps.popupVisible});
		}
		console.log(this.state.popupVisible + " begin");
	}

	/* Render fight option if two players are sharing square and we're in end game. */
	fightTime() {
		var sharingPlayers = [];
		if (this.props.phaseTwo && this.props.myTurn) {
			for (var i=0; i <= 3; i++) {
				if (this.props.playerNumber !== i) {
					if (this.props.playerLocation[this.props.playerNumber][0] === this.props.playerLocation[i][0] 
						&& this.props.playerLocation[this.props.playerNumber][1] === this.props.playerLocation[i][1]) {
							sharingPlayers.push(i);
					}
				}
			}
			return ( <Fight players = {sharingPlayers} websocket = {this.props.websocket} playerList = {this.props.playerList} playerTurn = {this.props.playerTurn}/> );
		}		
	}
	
	endTurn() {
		this.props.websocket.send("/endTurn");
//		return ( <Expire delay={5000}> Its your turn - {this.props.playerTurn} </Expire> );
	}

	/* Render turn-specific stuff */
	turnTime() {
		if (this.props.myTurn) {
			return (<Button onClick = {() => this.endTurn() }> End Turn </Button>);
		} else { return; }
	}
	
	/* Display player counter in screen corner */
	playerCounter() {
		var counter = "counter" + (this.state.playerNumber+1) + ".png";
		return ( <img src={counter} alt="failToFindResource"/> );
	}

	handleClosePopup() {
		this.setState({popupVisible: false});
	}

	popup() {
		if (this.state.popupVisible && this.props.underAttack) {
			return (<Popup visible = {this.state.popupVisible} 
				onClick = { () => this.handleClosePopup() } 
				websocket = {this.props.websocket}
				playerTurn = {this.props.playerTurn}
				myTurn = {this.props.myTurn}
				underAttack = {this.props.underAttack}
				playerNumber = {this.props.playerNumber} >
				<h2> You were attacked! </h2>
				{this.props.attackResult}
			</Popup>);
		}
		else if (this.state.popupVisible) {
			return (<Popup visible = {this.state.popupVisible}
                onClick = { () => this.handleClosePopup() }
                websocket = {this.props.websocket}
                myTurn = {this.props.myTurn}
                underAttack = {this.props.underAttack} >
                {this.props.currentEvent}
            </Popup>);
		}
	}

	/* table for stats and who you are */
	createStatsIcon() {
		var playerNumber = this.state.playerNumber;
		//of form[[20,4,5],[20,4,5],[20,4,5],[20,4,5]]
	    var playerHP = this.props.playerStats[playerNumber][0]; //refactor and delete these
	    var playerAttack = this.props.playerStats[playerNumber][1];
	    var playerSpeed = this.props.playerStats[playerNumber][2];
	    return(<div>
			<table className="statsTable">
				<tr>
					<td>Your Health:</td>
					<td> {playerHP} </td>         
				</tr>
				<tr>
					<td>Your Attack:</td>
					<td> {playerAttack} </td>
				</tr>
				<tr>
					<td>Your Speed:</td>
					<td> {playerSpeed} </td>
				</tr>
				<tr>
					<td>You are:</td>
					<td> {this.playerCounter()} </td>
				</tr>
			</table>
	    </div>);
	}
/*
	 getCurrentPlayerID() {
		for (var i =0; i <= 3; i++) {
	 		if	(this.props.playerList[i] === this.props.playerTurn) {
				return i;
			}
		}
	 }
*/
	/* icon for whose turn it is */
	/* current does not work - needs 1 replacing with 'playerID whose turn it is' */
	turnIcon() {
//		var playerNum = this.getCurrentPlayerID();
		var str = '/counter' + + '.png'; //change 1 to playerID
		return (<div> <img src={str} alt='c' /> </div>);
	}  

	checkIfSpectator() {
		if (this.props.playerNumber >= 0) {
			return (
		        <div>
					<div className="Board">
						<Board username = {this.props.user} visualMap = {this.props.visualMap}  playerLocation = {this.props.playerLocation} myTurn = {this.props.myTurn} websocket = {this.props.websocket} />
					</div>
					<div>
						{this.popup()}
					</div>
					<Tabs className="gameTabs">
						<TabList>
							<Tab>Game Controls</Tab>
							<Tab>Event History</Tab>
						</TabList>
						<TabPanel>
							<h2> <span class = "omen"> OMEN: {this.props.omen} </span> </h2>
							<div> {this.fightTime()} </div>
							<div> {this.turnTime()} </div>
							<div> {this.createStatsIcon()} </div>
							<div> It's your turn - {this.props.playerTurn} {this.turnIcon()} </div>
						</TabPanel>
						<TabPanel> 
							<h2> <Event playerName = {this.props.playerTurn} eventId = {this.props.eventHistory} websocket = {this.props.websocket} /> </h2>
						</TabPanel>
					</Tabs>
				</div>
	    	);
		}
		else {
			return (<p> Hi spectator </p>);
		}
	}


	/* Render Game components */
	render() { 
	    return (this.checkIfSpectator());
	}
}

export default Game;

// <Expire delay={5000}>
