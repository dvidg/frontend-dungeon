import React from 'react';
import { Button } from 'react-bootstrap';

export default class Dice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
		}
    }
	
	render() {
		const emojis = ['2680','2681','2682','2683','2684','2685'];
		var emoji = String.fromCodePoint('0x' + emojis[this.props.diceRoll]);
		return (
			<div>
			<Button onClick = {() => {this.props.onClick()} }> Roll! </Button>
			<h2><span class="emoji"> {emoji} </span> </h2>
			</div>
		);
	}
}
