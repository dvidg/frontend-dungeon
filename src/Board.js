import Square from './Square';
import React from 'react';

/* Renders Board - which consists of individual Squares. 
 * All values are passed in props from Game.
 * Squares are rendered row by row, mapping visualMap (2d array) */
class Board extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
		    visualMap: this.props.visualMap,
		    playerLocation: this.props.playerLocation,
		    username: this.props.username,
		    myTurn: this.props.myTurn,
		    websocket: this.props.websocket
		};
    }

    /* OnClick function sends clicked location and username to validate move in backend. */ 
    handleClick(squareCoord, tile) {
		if (this.props.myTurn) {
            this.props.websocket.send("/sendLocation", {}, JSON.stringify({ coord: squareCoord }));
		} else { alert("not your turn"); }
    }

    /* Render all Squares in a row. If a player is located at that coordinate - pass that information to Square. */ 
    renderSquare(type, coord) {
		var i;
		var players = [];
		for (i=0; i <= 3; i++){
           if (coord[0] === this.props.playerLocation[i][0] && coord[1] === this.props.playerLocation[i][1]) {
				players.push(i);
		   }
		}
	    return (
	    	<Square tileType={type} 
		    coord={coord} 
		    playerID={players} 
		    onClick={() => this.handleClick(coord, type)}
		/>);	    
	}
    
    /* Map a row of Squares to renderSquare */
    renderRows(grid, x) {
		return grid.map((row, y) => <div key={y}> {this.renderSquare(row, [x,y])} </div>);
    }
    
    /* Render all Squares */
    render() {
	var all = this.props.visualMap;
    return (
		<div>
	        {all.map((x, i) => <div className='board-row' key={i}> {this.renderRows(x, i)} </div>)}
		</div>
	);
  }
}


// ========================================

export default Board;
