import React, {PureComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import SVG from '../../UI/SVG';
import Swipeable from 'react-swipeable';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';

const rc = addElementFunc("details_gallery");

const
	Gallery = tx([{ className: "details_gallery" }])('div'),
	Body = tx([{ name: 'body' }, rc])('div'),
	Footer = tx([{ name: 'footer' }, rc])('div'),
	Item = tx([{ name: 'item' }, rc])('div'),
	Control = tx([{ name: 'control' }, rc])('div'),
	NavBtn = tx([{ name: 'nav' }, rc])('div'),
	Img = tx([{ name: 'img' }, rc])('div');

export default class DetailsGallery extends PureComponent {
	constructor(props, {pathnames: {s_host}}) {
		super(props);

		this.goTo = this.goTo.bind(this);
		this.prev = this.prev.bind(this);
		this.next = this.next.bind(this);
		this.load = this.load.bind(this);
		this.show = this.show.bind(this);

		this.state = {
			active: 0,
			max: 4,
			bg: props.images ? `${s_host}/resize_450x296${props.images[0].name_b}` : ""
		}
	}

	goTo(e, active) {
		e.preventDefault();
		e.stopPropagation();	
		const {images} = this.props;
		const count = images && images.length;

		if (active < this.state.max && active < count && active >= 0) {
			this.setState({active})
		}
		
		if (active === this.state.max) {
			this.setState({active: 0})
		}
	}

	show() {
		const
			s_host = this.context.pathnames.s_host,
			{images} = this.props,
			index = this.state.active,
			imgs = images.length && images.map(e => ({src: s_host + e.name_b}));

    require.ensure([], (require) => {
    	const $ = require('jquery');
    	window.$ = window.jQuery = $;
      require('../../../vendors/jquery.fancybox.js');
		  $.fancybox.open(imgs, {}, index);
    })
	}

	prev(e) {
		this.goTo(e, this.state.active - 1)
	}

	next(e) {
		this.goTo(e, this.state.active + 1)
	}

	load(bg) {
		this.setState({bg})
	}

	render() {
		if (!this.props.images) return null;

		const
				{f, pathnames: {s_host}} = this.context,
				{images} = this.props,
				active = this.state.active ? images[this.state.active] : images[0],
				count = images.length,
				img = `${s_host}/resize_450x296${active.name_b}`,
				imagesJSX = count && images.map(({name_s}, index) => {
					if (index > this.state.max - 1) return null;

					return (
						<Item
							onClick={
								this.state.max - 1 !== index
								? (e) => this.goTo(e, index)
								: () => this.show(index)
							}
							key={index}
							active={this.state.active === index}>
							<Img style={{backgroundImage: `url(${s_host}/resize_100x67${images[index].name_s})`}} />
							{
								(this.state.max - 1 === index) ? (
									<FormattedMessage
										id="details.gallery.more"
										values={{count: count - 2}}
										defaultMessage="Ещё {count} фото"
										/>
								) : null
							}
						</Item>
					)
				});
		
		return (
			<Swipeable 
				className="details_gallery"
				onSwipedLeft={this.prev} 
				onSwipedRight={this.next}
				>
				<Body>
					<img
						onLoad={() => this.load(img)}
						src={img}
						alt="" />
					<Img
						onClick={this.show}
						href={this.state.bg}
						style={{backgroundImage: `url(${this.state.bg})`}} />

					<Control>
						<NavBtn modifier="prev" onClick={this.prev}>
							<img className="icon" src={SVG.prev} alt=""/>
						</NavBtn>
						<NavBtn modifier="next" onClick={this.next}>
							<img className="icon" src={SVG.next} alt=""/>
						</NavBtn>
					</Control>
				</Body>

				<Footer>
					{imagesJSX}
				</Footer>
			</Swipeable>
		)
	}
}

DetailsGallery.contextTypes = {
  f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};
