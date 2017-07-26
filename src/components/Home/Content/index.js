import React, {PureComponent} from 'react';
import tx from 'transform-props-with';

import addElementFunc from '../../../functions/elementStyles';
const rc = addElementFunc("");

const Block = tx([{ name: '' }, rc])('div');

export default class HomeContentClass extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			active: true
		};

		this.toogle = this.toogle.bind(this);
		this.isVisibleMore = this.isVisibleMore.bind(this);
	}

	componentDidMount() {
		this.isVisibleMore();
	}

	isVisibleMore() {
		const content = this.refs.content;
		if (content.offsetHeight > 160) {
			this.setState({active: false})
		}
	}

	toogle() {
		this.setState({active: !this.state.active});
	}

	render() {
		const
			{
				content: __html,
				className
			} = this.props,
			{f, msg} = this.context,
			active = this.state.active;

		return (
			<div
				ref="content"
				className={"home_content " + className || ""}>
				<Block
					className="content home_content_block"
					active={active}
					dangerouslySetInnerHTML={{__html}} />

				{
					!active
						? <div
								onClick={this.toogle}
								className="btn btn_white_bg">
								{f(msg.all_show)}
							</div>
						: null
				}

			</div>

		)
	}
}

HomeContentClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
	msg: React.PropTypes.object
};



