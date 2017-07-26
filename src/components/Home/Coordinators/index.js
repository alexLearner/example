import React, {PureComponent} from 'react';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';
import LazyImg from "../../UI/LazyImg"
import Media from "../Media"
import Content from "../Content"
import {isTabletSm} from "../../../functions/viewport"
import Slider from "../../UI/Slider"

const rc = addElementFunc("home_coordinators");
const pr = addElementFunc("");

const
	Coordinators = tx([{ className: 'home_coordinators preloader' }, pr])('div'),
	Footer = tx([{ name: 'footer' }, rc])('footer'),
	Items = tx([{ name: 'items' }, rc])('div'),
	Item = tx([{ name: 'item search_place noactive' }, rc])('div'),
	ItemContent = tx([{ name: 'item_content' }, rc])('div'),
	Body = tx([{ name: 'body' }, rc])('div');

export default class ClinicsClass extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			mounted: false
		}
	}

	componentDidMount() {
		this.setState({mounted: true});
	}


	render() {
		const {pathnames: {clinics: route}} = this.context;
		const {
			coordinators: {fetched, data},
			media
		} = this.props;
		const mounted = this.state.mounted;

		if (!fetched) {
			return <Coordinators />
		};

		const items = data.coordinators.map((item, index) =>
			index > 3
				? null
				: <Item key={index}>
						<LazyImg
							src={item.img}
						  alt={item.name}
						  className="home_coordinators_img"
						/>
						<ItemContent>
							<p>{item.name}</p>
							<span>{item.position}</span>
						</ItemContent>
					</Item>
		);

		return (
			<Coordinators active={true}>
				<Body>
					<Content
						className="home_coordinators_content"
						content={data.content} />
					<Items>
						{
							!isTabletSm
								? items
								: mounted ? <Slider slides={items}/> : items
						}
					</Items>
				</Body>

				<Footer>
					<Media media={media} />
				</Footer>
			</Coordinators>
		)
	}
}

ClinicsClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};



