import Square from './Square';
import React from 'react';
import Stomp from 'stompjs';
//import axios from 'axios';

//holds board state such as player location
//also responsible for rendering square
class Board extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
	    visualMap: [[]],
	    playerLocation: [[], [], [], []],
	    username: this.props.username,
            myTurn: false
    };
    
    //open websocket and start connection 
    this.connection = 'ws://immense-castle-97130.herokuapp.com/player';
    this.stompClient = Stomp.client(this.connection);
    this.stompClient.connect({"user" : this.state.username}, frame => {
	this.stompClient.subscribe("/topic/location", response => {
            this.setState({ playerLocation: JSON.parse(response.body) });
        });
	 this.stompClient.subscribe("/user/topic/client", response => {
            this.setState({ username: JSON.parse(response.body) });
        });

    });
    }


    //initial start up loading map/player 
    componentDidMount() {
        fetch('http://localhost:8080/api/visualMap', {"user" : "laurie"})
            .then(res => res.json())
            .then(data => this.setState({ visualMap: data }));
    }
    
    //onclick function to update individual square  
    handleClick(squareCoord) {
         this.stompClient.send("/sendLocation", {}, JSON.stringify({ coord: squareCoord }));
    }

    //render individual square from Square.js
    renderSquare(type, coord) {
	var i;
	for (i=0; i <= 3; i++){
           if (coord[0] === this.state.playerLocation[i][0] && coord[1] === this.state.playerLocation[i][1]) {
                return (<Square tileType={type} 
		    coord={coord} 
		    playerID={i+1} 
		    onClick={() => this.handleClick(coord)}
		   />);
	    }
	}
	    return (<Square tileType={type} 
                 coord={coord}
                 playerID={0}
                 onClick={() => this.handleClick(coord)}
                />);

        }
    

    //takes row of map to render
    renderRows(grid, x) {
	return grid.map((row, y) => <div key={y}> {this.renderSquare(row, [x,y])}</div> );
    }

    render() {
	const all = this.state.visualMap; 
        return (
	    <div>
	        {all.map((x, i) => <div className='board-row' key={i}> {this.renderRows(x, i)} </div>)}
		</div>
    );
  }
}


// ========================================


export default Board;

