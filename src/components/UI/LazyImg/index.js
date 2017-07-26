import React, {PureComponent} from 'react';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';

const pr = addElementFunc();
const
	Img = tx([{ name: '' }, pr])('div');

export default class LazyImg extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {mounted: false, loaded: false};

		this.load = this.load.bind(this);
	}

	componentDidMount() {
		this.setState({mounted: true})
	}

	load() {
		this.setState({loaded: true})
	}

	render() {
		const
			{
				className,
				src,
				alt
			} = this.props,
			{
				loaded,
				mounted
			} = this.state;

		if (!src || src == "false") return <Img className = {"lazy_img animated_img " + className || ""} />

		return (
			<Img
				className={"lazy_img animated_img " + className || ""}
				active={loaded}
			  style={{backgroundImage: loaded ? `url(${src})` : ""}}
			>
				<img hidden src={mounted && src ? src : ""} alt={alt} onLoad={this.load} />
			</Img>
		)
	}
}

