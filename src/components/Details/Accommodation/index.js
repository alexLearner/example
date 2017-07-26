import React,{Component} from 'react'
import Hotels from "./Hotels"
import TabMixin from "../TabsMixin"
import {defineMessages} from 'react-intl';
import AccommodationField from "./AccommodationField"
import tx from 'transform-props-with';
import addElementFunc from "../../../functions/elementStyles";
import async from "../../../functions/async";

const rc = addElementFunc("details_accommodation");
const pr = addElementFunc("");

const 
	Accommodation = tx([{ className: "details_accommodation preloader"}, pr])('div'),
	Body = tx([{ name: 'body' }, rc])('div'),
	Title = tx([{ name: 'title' }, rc])('div'),
	SubTitle = tx([{ name: 'subtitle' }, rc])('div'),
	CaptionYellow = tx([{ name: 'caption', className: "caption orange" }, rc])('div'),
	Content = tx([{ name: 'content', className: "block_content" }, rc])('div'),
	Map = tx([{ name: 'map' }, rc])('div'),
	Header = tx([{ name: 'header'}, rc])('div'),
	Images = tx([{ name: 'images'}, rc])('div'),
	HeaderLeft = tx([{ name: 'header_left'}, rc])('div'),
	HeaderRight = tx([{ name: 'header_right'}, rc])('div'),
	Footer = tx([{ name: 'footer'}, rc])('div');


const msg = defineMessages({});

export default class DetailsAccommodation extends TabMixin {
	constructor(props) {
		super(props);

		this.addMap = this.addMap.bind(this);

		this.name = this.CONSTANTS.accommodation.name;
		this.getFunctionName = this.CONSTANTS.accommodation.fn;

		this.state = {
			map: false
		}
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.hidden !== this.props.hidden
	}

	componentDidUpdate() {
		this.addMap();
	}

	initMap() {
		const location = this.props.details.accommodation.data.location;
		const myLatLng = {
			lat: location[0],
			lng: location[1],
		};

		let map;

		map = new google.maps.Map(document.getElementById('map'), {
			center: myLatLng,
			zoom: 14,
			zoomControl: false,
			scrollwheel: false,
		});

		const marker = new google.maps.Marker({
			position: myLatLng,
			map
		});
	}

	addMap() {
		if (this.props.details.accommodation.fetched && !this.state.map) {
			if (!window.google) {
				if (window.google_loading) return;

				window.google_loading = true;
				async("https://maps.googleapis.com/maps/api/js?key=AIzaSyBGy1e5VvhjbRPsMjcwCs7ZNkHjYAyaIP0", () => {
					this.initMap();
				})
			}
			else {
				this.initMap();
			}
			this.setState({map: true});
		}
	}

	componentDidMount() {
		this.tabComponentDidMount();
		this.addMap()
	}

	render() {
		if (!this.props.details.accommodation.fetched) return <Accommodation hidden={true}/>;

		const
				{
					layout,
					item,
					hidden,
					details
				} = this.props,

				data = details.accommodation.data,
				{
					country_name,
					city_name,
					address
				} = item,
				{information} = data;

		let
				informationJSX = [	];

		if (information) {
			informationJSX = information.map(({title, fields}, index) => (
				<AccommodationField key={index} title={title} data={fields} />
			))
		}

		return (
			<Accommodation hidden={hidden} active={true}>
				<Header>
					<HeaderLeft>
						<Title>
							{country_name ? country_name + ", " : null}
							{city_name ? city_name + ", " : null}
							{address}&#160;
						</Title>
						<Content dangerouslySetInnerHTML={{__html: data.subtitle}} />
					</HeaderLeft>

					<HeaderRight>
						<Map id="map" className="google_map"/>
					</HeaderRight>
				</Header>

				<Body>
					{informationJSX}
					{
						data.hotels && data.hotels.length ? (
							<AccommodationField title={'Проживание'}>
								<Hotels {...data.hotels} />
							</AccommodationField>
						) : null
					}
				</Body>

				<Footer>

				</Footer>
			</Accommodation>
		)
	}
}

