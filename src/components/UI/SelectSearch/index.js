import React, { Component } from 'react'
import {LazilyLoadFactory} from "../../LazilyLoad"

export default LazilyLoadFactory(class extends Component {
	constructor( props ) {
		super ( props );
		
		this.selectChange = this.selectChange.bind(this);
		this.reset = this.reset.bind(this);

		this.state = {
			value: this.props.value || ""
		}
	}

	componentDidMount() {
		this.setState({isMount: true})
	}

	componentWillReceiveProps(nextProps, nextState) {
		if (this.props.changedValue !== nextProps.changedValue) {
			this.selectChange(nextProps.changedValue)
		}
		if (this.props.reset) {
			this.selectChange(nextProps.options[0])
		}

		if (nextProps.value !== this.props.value) {
			this.setState({value: nextProps.value})
		}
	}

	reset() {
		this.setState({value: ""})
	}

	selectChange(value) {
		this.setState({
			value
		});

		if (this.props.onChange) {
			this.props.onChange(value);
		}
	}

	render() {
		if (!this.state.isMount) return null;
		const Select = this.props.Select;
		
		return (
			<Select
				className={this.props.className}
				name={this.props.name}
				options={this.props.options}
				value={this.state.value}
				onChange={this.selectChange}
				placeholder=""
	      searchable= {this.props.searchable || false}
			/>		
		) 
	}
},
{
	Select: () => import("react-select")
});