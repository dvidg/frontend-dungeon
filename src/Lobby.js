import { Button } from "react-bootstrap";
import React, {Component } from 'react';
import Game from "./Game.js";
import Stomp from 'stompjs';

/* Login holds a user at login page until they submit a username.
 * Game components are rendered on submission.
 * This is our parent component to Game.
 */
export default class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            eventHistory: [[]],
            playerTurn: "", //name of current active player
            myTurn: false,
            playerNumber: null, //playerID, negative = spectator
            visualMap: [[]],
            playerLocation: [[], [], [], []],
            phaseTwo: false,
            omen: -1,
            startGame: false,
            lobbyList: [], //array of player names
            spectatorLobbyList: [], //array of spectator names
            popupVisible: false,
            currentEvent: "",
            underAttack: false,
            attackResult: "",
            gameRunning: false,
            viewGame: false,
            hasWon: false,
            difficulty: 1,
            winnerList: [],
            displayDifficulty: "Easy",
            playerStats: [[], []]
        };

        /* Open websocket connection and setup subscriptions. */
        this.connection = 'ws://localhost:8080/player';
        this.stompClient = Stomp.client(this.connection);
        this.stompClient.connect({"user" : this.state.user}, frame => {
            // Receive message when game starts
            this.stompClient.subscribe("/topic/startGame", res => {
                this.setState({ startGame: true});
            });

            /* Add player to lobby - positive int means player, negative means spectator */
            this.stompClient.subscribe("/topic/lobby/add", res => {
                this.setState({ playerNumber: JSON.parse(res.body)});
            });

            /* Receive lobbyList for displaying */
            this.stompClient.subscribe("/topic/lobby/list", res => {
                this.setState({ lobbyList: JSON.parse(res.body)});
            });

            /* Receive spectatorList for displaying */
            this.stompClient.subscribe("/topic/lobby/spectatorList", res => {
                this.setState({ spectatorLobbyList: JSON.parse(res.body)});
            });

            /* Receive visual map so that it can be passed to Board. */
            this.stompClient.subscribe("/topic/getVisualMap", res => {
                this.setState({ visualMap: JSON.parse(res.body)});
            });

            /* Receive attacks */
            this.stompClient.subscribe("/user/topic/attack", res => {
                this.setState({ underAttack: true, popupVisible: true, attackResult: JSON.parse(JSON.stringify(res.body)) });
            });

            /* Receive stats */
            this.stompClient.subscribe("/topic/getPlayerStats", res => {
                this.setState({ playerStats: JSON.parse(res.body) }
                );
            });

			/* Receive phase two scenario */
            this.stompClient.subscribe("/topic/phaseTwo", res => {
                this.setState({ popupVisible: true, currentEvent: JSON.parse(JSON.stringify(res.body))});
            });

            this.stompClient.subscribe("/topic/endGame", res => {
            	this.setState({ winnerList: JSON.parse(res.body)});
                this.setState({hasWon: true});
            });

            /* Receive all players location as 2d array. If it receives coordinates that are 99 it means it was an invalid click. */
            this.stompClient.subscribe("/topic/location", response => {
                if (JSON.parse(response.body)[0][0] === 99) {
                    //change nothing
                } else {
                    this.setState({ playerLocation: JSON.parse(response.body) });
                }
            });

            /* Receives turn information: boolean set for own turn, playerTurn so that events can be stored correctly,  */
            this.stompClient.subscribe("/topic/client/turn", response => {  
				if (JSON.stringify(this.props.user) === JSON.stringify(response.body)) {
                    this.setState({ playerTurn: JSON.stringify(response.body), myTurn: true, omen: this.state.omen+1});
                } else {  this.setState({ playerTurn: JSON.stringify(response.body), myTurn: false, omen: this.state.omen+1} ) }
				
				// Check omen counter and kick off phase two if cap is reached.
				if (this.state.omen === 8 && !this.state.phaseTwo && this.state.myTurn) {
                	this.stompClient.send("/startPhaseTwo", {}, 1);
                }
            });

            this.stompClient.subscribe("/topic/phaseTwoResponse", response => {
                var justResponse = JSON.parse(JSON.stringify(response.body));
                var responseWithText = "Phase Two has begun!\n" + justResponse;
                var copyArray = this.state.eventHistory.concat(responseWithText);
                this.setState({ currentEvent: justResponse, eventHistory: copyArray, phaseTwo: true });
            });

            /* Error messages are received here. */
            this.stompClient.subscribe("/user/topic/error", response => {
                alert(JSON.stringify(response.body));
            });

            this.stompClient.subscribe("/topic/changeDifficulty", response => {
                var chooseDifficulty = ["Easy", "Medium", "Hard", "Very Hard", "Nightmare"];
                var localDiff = JSON.parse(response.body)
                this.setState({difficulty: localDiff});
                this.setState({displayDifficulty: chooseDifficulty[localDiff - 1]});
            });

            /* Receives event responses and keeps all events in a history to pass to Event component. */
            this.stompClient.subscribe("/topic/event", response => {
                var justResponse = JSON.parse(JSON.stringify(response.body));
                var responseWithName = JSON.parse(this.state.playerTurn) + ": " + justResponse;
                var copyArray = this.state.eventHistory.concat(responseWithName);
                this.setState({ currentEvent: justResponse, eventHistory: copyArray });
            });

            /* Receives events for individual players to see */
			this.stompClient.subscribe("/user/topic/event", response => {
                var justResponse = JSON.parse(JSON.stringify(response.body));
                this.setState({ currentEvent: justResponse, popupVisible: true}); 
            });
        });
    } /* close constructor */

    /* view lobby list for pregame display */
    createLobbyList() {
        var lobbyList = [];
        for (var i = 0; i < this.state.lobbyList.length; i++) {
            lobbyList.push(<p> {this.state.lobbyList[i]} </p>);
        }
        return lobbyList;
    }

    createWinnerList() {
        var winnerListLocal = [];
        if (this.state.winnerList.length > 0) {
	        for (var i = 0; i < this.state.winnerList.length; i++) {
	            winnerListLocal.push(<p> {this.state.winnerList[i]} </p>);
	        }
    	}

        return winnerListLocal;
    }

    /* view lobby list for pregame display */
    createSpectatorLobbyList() {
        var spectatorLobbyList = [];
        for (var i = 0; i < this.state.spectatorLobbyList.length; i++) {
            spectatorLobbyList.push(<p> {this.state.spectatorLobbyList[i]} </p>);
        }
        return spectatorLobbyList;
    }

    /* start game from lobby */
    startGame() {
        this.setState({gameRunning: true});
        this.stompClient.send("/startGame", {}, 1);
    }

    /* reset */
    reset() {
        
    }



    /* Get Table */
    getTable() {
    	if(this.state.winnerList.length>0) {
    		return (
            <table className="playersTable">
                <tbody>
                    <tr> 
                        <th> Winners! </th>
                    </tr>  
                    <tr>
                        <td> {this.createWinnerList()} </td>         
                    </tr>
                </tbody>
            </table>);
    	}
        return(
            <table className="playersTable">
                <tbody>
                    <tr> 
                        <th> Players </th>
                        <th> Spectators </th>
                    </tr>  
                    <tr>
                        <td className = "playerLobbyList"> {this.createLobbyList()} </td>
                        <td> {this.createSpectatorLobbyList()} </td>         
                    </tr>
                </tbody>
            </table>);
    }

    spectateGame() {
        this.setState({viewGame: true});
//      this.stompClient.send("/startGame", {}, 1);
    }

    changeDifficulty() {
        var localDiff = this.state.difficulty + 1;
        if (localDiff === 6) { localDiff = 1; }
        this.setState({difficulty: localDiff})
        this.stompClient.send("/difficulty", {}, JSON.stringify({localDiff}));
    }

    addBot() {
        this.stompClient.send("/addBot", {}, 1);
    }

    /* Render game if submitted a username. If not, only render login page */
    render() {
        if (this.state.playerNumber === 0 | this.state.playerNumber > 0) {
        /* NB: in JSX, null >= 0 is TRUE */   
            if(this.state.hasWon) {
                return(
	                <div>
	                    <p><h1> Ready to play again! </h1></p>

	                    <div> {this.getTable()} </div>
	                    <Button onClick = {() => this.changeDifficulty() }> Current Difficulty: {this.state.displayDifficulty} </Button>
	        			<Button onClick = {() => this.startGame() }> Start Game </Button>
	                </div>
	                );
            }
            else if (this.state.startGame) { /* start game settings */
                    return (
                        <div>
                            <Game user = {this.state.user}
        						  eventHistory = {this.state.eventHistory}
        						  playerTurn = {this.state.playerTurn}
        						  myTurn = {this.state.myTurn}
        						  playerNumber = {this.state.playerNumber}
        						  visualMap = {this.state.visualMap}
        						  playerLocation = {this.state.playerLocation}
        						  fight = {this.state.fight}
                                  phaseTwo = {this.state.phaseTwo}
        						  omen = {this.state.omen}
        						  popupVisible = {this.state.popupVisible}
        						  websocket = {this.stompClient}
        						  currentEvent = {this.state.currentEvent}
        						  underAttack = {this.state.underAttack}
        						  playerList =  {this.state.lobbyList}
                                  playerStats = {this.state.playerStats}
        						  attackResult = {this.state.attackResult}
                                  lobbyList = {this.state.lobbyList}
                                  spectatorList = {this.state.spectatorLobbyList}/>
        	    		</div>
                    );
            } else if (this.state.lobbyList.length !== 4) { /* less than 4 players */
            	console.log(this.state.lobbyList, this.state.lobbyList.length);
            	var numMissing = 4 - (this.state.lobbyList.length);
            	return (
             		<div>
            			<h1> Waiting for {numMissing} more... </h1>
            			<div> {this.getTable()} </div>
                        <Button onClick = {() => this.changeDifficulty() }> Current Difficulty: {this.state.displayDifficulty} </Button>
              			<Button onClick = {() => this.addBot() }> Add Bot </Button>
            		</div>
            	);
            }
            
            else { /* once 4 players: show game button */
            	return (
                    <div>
                        <p><h1> Ready to Play </h1></p>
                        <div> {this.getTable()} </div>
                        <Button onClick = {() => this.changeDifficulty() }> Current Difficulty: {this.state.displayDifficulty} </Button>
            			<Button onClick = {() => this.startGame() }> Start Game </Button>
                    </div>
                );
            }
        }
        else {
        	if (this.state.hasWon) {
                return (<div>
        			<div> {this.getTable()} </div>
        		</div>)
        	}
            else if (this.state.startGame && this.state.viewGame) {
                return (<div>
                                <Game user = {this.state.user}
                                      eventHistory = {this.state.eventHistory}
                                      playerTurn = {this.state.playerTurn}
                                      myTurn = {this.state.myTurn}
                                      playerNumber = {this.state.playerNumber}
                                      visualMap = {this.state.visualMap}
                                      playerLocation = {this.state.playerLocation}
                                      phaseTwo = {this.state.phaseTwo}
                                      fight = {this.state.fight}
                                      omen = {this.state.omen}
                                      popupVisible = {this.state.popupVisible}
                                      websocket = {this.stompClient}
                                      currentEvent = {this.state.currentEvent}
                                      underAttack = {this.state.underAttack}
                                      playerList =  {this.state.lobbyList}
                                      playerStats = {this.state.playerStats}
                                      attackResult = {this.state.attackResult}
                                      lobbyList = {this.state.lobbyList}
                                      spectatorList = {this.state.spectatorLobbyList}/>
                            </div>
                           );
            }
            else if (this.state.startGame) {
                return (
                <div>
                    <h1> Hi Spectator! </h1>
                    <div> {this.getTable()} </div>
                    <h2> The game has begun! </h2>
                    <Button onClick = {() => this.spectateGame() }> Spectate Game </Button>
                </div>);
            }
       
            else {
                return (
                <div>
                    <h1> Hi Spectator! </h1>
                    <div> {this.getTable()} </div>
                    <h2> The game has not begun yet. </h2>
                </div>);
            }
        }
    }           
}
