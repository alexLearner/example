import React, {PureComponent} from 'react';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';
import SVG from '../SVG';

const rc = addElementFunc("checkbox");

const 
	Checkbox = tx([{ className: "checkbox" }])('div'),
	Container = tx([{ name: 'container' }, rc])('div');

export default class CheckboxClass extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			active: this.props.active || false
		};

		this.toogle = this.toogle.bind(this);
	}

	toogle() {
		this.setState(
			{active: !this.state.active}, 
			() => {
				this.props.change({
					name: this.props.name,
					label: this.props.text,
					value: this.state.active ? true : undefined
				});
			})
	}

	render() {
		const {name, text, change} = this.props;
		const {active} = this.state;

		return (
			<Checkbox onClick={this.toogle}>
				<input 
					type="checkbox" 
					name={name || "checkbox"}
					checked={active}
					onChange={this.toogle}
					className="hidden"
				/>
				<Container active={this.state.active}>
					<img src={SVG.checkbox} alt="" className="icon"/>
				</Container>
				<p>{text}</p>
			</Checkbox>
		)
	}
}
