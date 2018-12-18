import React from 'react';

/* Displays event in sidebar */
/* Popup is now used for actual events */
class Event extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
			eventId: this.props.eventId,
			websocket: this.props.websocket,
	    	playerName: this.props.playerName
		}
	}
	

	/* need to stop getting the eventID and instead the response */
	render() {
		return (
			<div>	  
				<h4>Events</h4>
				<p> 		           	
	    			{this.props.eventId.map(txt => <p>{txt}</p>)}
				</p>
			</div>
		);
	}
}
	        
export default Event;
