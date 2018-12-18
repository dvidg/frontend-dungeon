import React from 'react';

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('../public', false, /\.(png|jpe?g|svg)$/));


/* Square renders an individual tile.
 * Child component to Board.
 * Renders players, and tile type depending on props.
 */
class Square extends React.Component {
  constructor(props) {
    super(props);
	  this.state = { 
		  tileType: this.props.tileType,
		  coord: this.props.coord,
		  playerID: this.props.playerID,
		  floorType: this.props.floorType
	  };
  }
/*
    setting playerID state from props 
   componentWillReceiveProps(nextProps){
      if(nextProps.playerID !== this.props.playerID){
          this.setState({playerID:nextProps.playerID});
        }
    }
*/
	/* Loop through player list to render counters. */
    playerTile(playerID){
		var i;
		var playerCounters = [];
	    for (i=0; i < playerID.length; i++) {
                if (playerID.length === 1){
					playerCounters.push(<img className= {"squarePlayer4"} src={images["counter" + (playerID[i]+1) + ".png"]} alt='c' />);
				} 
				else {
					playerCounters.push(<img className= {"squarePlayer" + playerID[i]} src={images["counter" + (playerID[i]+1) + ".png"]} alt='c' />);
				}
			}
		return playerCounters;
		}
	
render() {
	return (
            <button className="square" onClick= {() => this.props.onClick()} >
            <img className="backgroundPlayer" src={images["floor_" + this.props.tileType + ".png"]} alt={this.props.tileType}/>
                {this.playerTile(this.props.playerID)}
	    </button>
        );
  }


}

export default Square;
