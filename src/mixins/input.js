import React, { Component } from 'react'
import Formsy from 'formsy-react'

const InputMixin = {
	mixins: [Formsy.Mixin],

	getInitialState() {
		return {
			error: false
		}
	},

	focus() {
		this.refs.input.focus();
	},

	reset() {
		this.setValue("")
	},

	addError() {
		this.setState({error: true})
	},

	removeError() {
		this.setState({error: false})
	},

	changeValue() {
		let val = this.refs.input.value;
		
 		if ( this.props.onChange ) {
			// this.props.onChange(input)
		}

		this.setValue(val);

		if (!this.isValidValue(val) && !this.state.error) {
			this.addError();
		}
		else if (this.state.error) {
			this.removeError();
		}

	},

	returnInputClassName( name ) {
		if ( !name ) name = "input";
		let result = name;
		let p = this.props;

		(this.state.error) ? result = result + " error" : result = result;

		return result;
	}
}

export default InputMixin