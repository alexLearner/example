import React, {PureComponent} from 'react';
import addElementFunc from '../../../functions/elementStyles';
import tx from 'transform-props-with';
import Swipeable from 'react-swipeable';
import {SVG} from '../../UI';

const rc = addElementFunc("slider");

const 
	Slider = tx([{ className: "slider" }])('div'),
	Item = tx([{ name: 'item' }, rc])('div'),
	Items = tx([{ name: 'items' }, rc])('div'),
	Title = tx([{ name: 'title' }, rc])('div'),
	Btn = tx([{ name: 'btn' }, rc])('div'),
	Controls = tx([{ name: 'control' }, rc])('div'),
	Container = tx([{ name: 'container' }, rc])('div');


export default class DetailsSliderClass extends PureComponent {
	constructor( props ) {
		super ( props );

		this.next = this.next.bind(this);
		this.prev = this.prev.bind(this);
		this.onResizeWindow = this.onResizeWindow.bind(this);
		this.transformSlider = this.transformSlider.bind(this);
		this.timer = {};

		this.state = {
			slide: 0,
			slidesVisible: 2,
			loaded: false
		}
	}

	next(e) {
		e.stopPropagation();
		e.preventDefault();

		if (this.state.slide < this.props.slides.length - this.state.slidesVisible) {
			this.setState({slide: this.state.slide + 1})
		}
	}

	prev(e) {
		e.stopPropagation();
		e.preventDefault();

		if (this.state.slide > 0) {
			this.setState({slide: this.state.slide - 1})
		}
	}

	componentDidMount() {
		this.setState({loaded: true})
		this.onResizeWindow();
		window.addEventListener("resize", this.onResizeWindow);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.onResizeWindow);
	}

	transformSlider() {
		const slider = document.getElementById("slider");
		const width = document.body.offsetWidth;

		if (width < 1200 && this.state.slidesVisible !== 1) {
			this.setState({
				slidesVisible: 1
			})
		}

		if (width >= 1200 && this.state.slidesVisible !== 2) {
			this.setState({
				slidesVisible: 2
			})
		}
	}

	onResizeWindow() {
		clearTimeout(this.timer);
		this.timer = setTimeout(this.transformSlider, 50)		
	}

	render() {
		if (!(this.props.slides && this.props.slides.length)) return null;

		if (!this.state.loaded) return <Swipeable className="slider preloader" />
		
		const 
			{slides, title} = this.props,
			{slide, slidesVisible} = this.state,
			count = slides.length,
			width = (100 * count / slidesVisible) + "%",
			slideWidth = (100 / count),
      translate = 'translateX(-'+slide*slideWidth+'%)',
			css = {
					width: width,
					transform: translate,
          WebkitTransform: translate,
          MozTransform: translate,
          OTransform: translate,
          msTransform: translate
        },

				slidesJsx = slides.map((slide, index) => (
					<Item style={{width: `${slideWidth}%`}} key={index}>
						{slide}
					</Item>
				));

		return (
			<Swipeable 
				className="slider preloader active" 
				onSwipedRight={this.prev} 
				onSwipedLeft={this.next}
				>
				<Title>
					{title}
					{
						count > 2 ? (
							<Controls>
								<Btn modifier="prev" onClick={this.prev}>
									<img className="icon" src={SVG.prev} alt=""/>
								</Btn>
								<Btn modifier="next" onClick={this.next}>
									<img className="icon" src={SVG.next} alt=""/>
								</Btn>
							</Controls>
						) : null
					}
				</Title>
				<Container id="slider">
					<Items style={css}>
						{slidesJsx}
					</Items>
				</Container>
			</Swipeable>
		)
	}	
};
