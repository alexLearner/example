import React, {PureComponent} from 'react';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';
import {defineMessages} from 'react-intl';

const msg = defineMessages({
	title: {
		id: "home.media.title",
		defaultMessage: "Bookimed в топ-медиа"
	}
});

const rc = addElementFunc("home_media");
const pr = addElementFunc("");
const
	Media = tx([{ className: 'home_media preloader' }, pr])('div'),
	Body = tx([{ name: 'body' }, rc])('div'),
	Item = tx([{ name: 'item' }, rc])('a'),
	Title = tx([{ name: 'title' }, rc])('div');

export default class HomeMedia extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {mounted: false};
	}

	componentDidMount() {
		this.setState({mounted: true})
	}

	render() {
		const
			{media: {fetched, data}} = this.props,
			{f, pathnames: {s_host}} = this.context,
			mounted = this.state.mounted;

		return fetched
			? <Media active={true}>
					<Title>{f(msg.title)}</Title>
					<Body>
					{
						data.map((item, index) =>
							<Item
								rel="nofollow"
								key={index}
								target="_blank"
								href={item.link}>
								<img
									src={mounted ? s_host + item.img : null}
									alt=""
									className="home_media_img" />
							</Item>
						)
					}
					</Body>
				</Media>
			: <Media />;
	}
}

HomeMedia.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};

