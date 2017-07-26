import React, { PureComponent } from 'react'

const colors = [
"#FFCCCC",
"#FFF1CC",
"#E5F1CC",
"#CCE1EF",
"#D2CCFB",
"#FAE8E8",
"#F8F6F2",
"#F4FBEB",
"#E3F1F9",
"#E5E3F6",
"#FBF3ED",
"#FFE4CC"
]

export default class SymbolImg extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {isLoad: false}
	}

	componentDidMount() {
		this.setState({isLoad: true})
	}

	render() {
		const 
				{value} = this.props,
				{isLoad} = this.state,
				styles = isLoad ? {backgroundColor: colors[Math.floor((Math.random() * 12))]} : {};

		return (
			<div className="symbol_img" style={styles}>
				{value[0]}
			</div>

		)
	}
}

