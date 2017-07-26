import React,{PureComponent} from 'react'

export default class LiveSearch extends PureComponent {
	constructor(props) {
		super(props);

		this.change = this.change.bind(this);

		this.state = {
			value: props.value
		}
	}

	change({target}) {
		const {value} = target;

		if (value || value === "") {
			this.setState({value});
			this.props.onChange({q: value});
		}
	}

	render() {
		const {name, placeholder} = this.props;

		return (
			<div className="livesearch_wrap">
			<input
					name={name}
					placeholder={placeholder}
					className="input"
					ref="input"
					value={this.state.value || ""}
					onChange={this.change}
				/>
			</div>
		)
	}
}

