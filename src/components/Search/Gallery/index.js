import React, {Component} from 'react';
import tx from 'transform-props-with';
import {Link} from 'react-router';
import addElementFunc from '../../../functions/elementStyles';

const rc = addElementFunc("");

const 
	SubItem = tx([{ className: "search_subgallery_item animated_img" }, rc])('div'),
	Body = tx([{ className: "search_gallery_img animated_img" }, rc])('div');

export default class SearchGallery extends Component {
	constructor( props ) {
		super ( props );

		this.bgImage = this.bgImage.bind(this);
		this.getNameImage = this.getNameImage.bind(this);
		this.renderImage = this.renderImage.bind(this);

		this.state = {
			active: 0,
			isLoadImage: false,
			isLoad: false,
			isLoadImages: []
		}
	}

	componentDidMount() {
		this.setState({isLoad: true})
	}

	getNameImage(index, name) {
		const
			s_host = this.context.pathnames.s_host,
			img = this.props.images[index];

		if (!img) return null;
		return s_host + img[name];
	}

	renderImage(index) {
		let isLoadImages = this.state.isLoadImages;
		isLoadImages[index] = true;
		this.setState({isLoadImages});
	}

	bgImage(index, name, Element = SubItem) {
		const images = this.props.images;
		const s_host = this.context.pathnames.s_host;

		if (!images[index]) return null;

		if (this.state.isLoadImages[index]) {
			const styles = {
				backgroundImage: `url(${s_host}/resize_260x200${images[index][name]})`,
				backgroundSize: "cover"	
			};

			return <Element
				style={styles}
				active={true} />
		}
		else return <Element />;
	}

	render() {
		const 
				{
					isLoad,
				} = this.state,
				{images, link} = this.props;

		if (!images || !images[0]) return null;

		return (
			<Link 
				to={link}
				className="search_gallery">
				{
					isLoad ? (
						<div hidden>
							<img 
								alt="" 
								onLoad={() => this.renderImage(0)} 
								src={this.getNameImage(0,"name_b")}
							/>
						</div>
					) : null
				}
				{this.bgImage(0, "name_b", Body)}
			</Link>
		) 
	}
};

SearchGallery.contextTypes = {pathnames: React.PropTypes.object};