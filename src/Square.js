import React from 'react';
import floor from './floor.png';
import counter1 from './counter1.png';
import counter2 from './counter2.png';
import counter3 from './counter3.png';
import counter4 from './counter4.png';

class Square extends React.Component {
  constructor(props) {
    super(props);
	  this.state = { 
		  tileType: this.props.tileType,
		  coord: this.props.coord,
		  playerID: this.props.playerID
	  };
  }

   //setting playerID state from props
   componentWillReceiveProps(nextProps){
      if(nextProps.playerID !== this.props.playerID){
          this.setState({playerID:nextProps.playerID});
        }
    }

    playerTile(playerID){
	if (this.state.playerID === 1) {
	}
        switch(playerID) {
	    case 1:
                return (<img className= {"squarePlayer"} src={counter1} alt='c' />);
            case 2:
	        return (<img className= {"squarePlayer"} src={counter2} alt='c' />);
	    case 3:
                return (<img className= {"squarePlayer"} src={counter3} alt='c' />);
            case 4:
                return (<img className= {"squarePlayer"} src={counter4} alt='c' />);
	    default:
		return;
		}
    }

  //render differently depending on whether player is on tile	  
  render() {
	return (
            <button className="square" onClick= {() => this.props.onClick()} >
                <img className="backgroundPlayer" src={floor} alt='oops' />
                {this.playerTile(this.state.playerID)}
	    </button>
        );
  }

}

export default Square;
