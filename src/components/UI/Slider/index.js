import React, {PureComponent} from 'react';
import {Link} from "react-router";
import addElementFunc from '../../../functions/elementStyles';
import tx from 'transform-props-with';
import SVG from '../SVG';

const rc = addElementFunc("scroll-slider");
const pc = addElementFunc("");

const
	Slider = tx([{ className: "scroll-slider preloader" }, pc])('div'),
	Item = tx([{ name: 'item' }, rc])('div'),
	Items = tx([{ name: 'items' }, rc])('div'),
	Title = tx([{ name: 'title' }, rc])('h3'),
	Header = tx([{ name: 'header' }, rc])('div'),
	Footer = tx([{ name: 'footer' }, rc])('div'),
	Btn = tx([{ name: 'btn' }, rc])('div'),
	Controls = tx([{ name: 'control' }, rc])('div'),
	Container = tx([{ name: 'container' }, rc])('div');

export default class SliderClass extends PureComponent {
	constructor( props ) {
		super ( props );
		
		this.next = this.next.bind(this);
		this.prev = this.prev.bind(this);
		this.sliderConstructor = this.sliderConstructor.bind(this);
		this.scrollSlider = this.scrollSlider.bind(this);
		
		this.timer = {};
		
		this.state = {
			scrollWidth: props.scrollWidth || 664,
			end: false,
			start: false,
			mounted: false
		}
	}
	
	componentDidMount() {
		this.slider = this.sliderConstructor();
		this.setState({mounted: true});
		this.scrollSlider();
	}

	
	next(e) {
		e.stopPropagation();
		e.preventDefault();
		this.sliderConstructor().next();
	}
	
	sliderConstructor() {
		const
			slider = this.refs.slider,
			scrollWidth = this.state.scrollWidth;

		if (!slider) return;

		let
		  scrollLeftMax = slider.scrollWidth - slider.clientWidth;

		const scroll = (width, duration = 250) => {
			const
					scrollPosition = slider.scrollLeft,
					dp = width/duration * 10;
			let
					pos = scrollPosition,
					id = setInterval(frame, 10);
			
			if (
				(scrollLeftMax <= pos && width > 0) ||
				(scrollLeftMax === 0 && width < 0)
			) return;
			
			function frame() {
				if (
					(pos >= scrollPosition + width && width > 0) ||
					(pos <= scrollPosition + width && width < 0 )
				) {
					clearInterval(id);
				} else {
					pos = pos + dp;
					slider.scrollLeft = pos;
				}
			}
		};
		
		return {
			next: scroll.bind(this, scrollWidth),
			prev: scroll.bind(this, -scrollWidth),
		}
	}
	
	
	prev(e) {
		e.stopPropagation();
		e.preventDefault();
		this.sliderConstructor().prev();
	}
	
	scrollSlider() {
		const slider = this.refs.slider;
		if (!slider || !this.state.mounted) return;
		const scrollLeftMax = slider.scrollWidth - slider.clientWidth;
		const scrollLeft = slider.scrollLeft;
		const currentState = this.state;
		
		let state = {
			end: scrollLeftMax < scrollLeft + 25,
			start: scrollLeft > 25
		};

		if (
			currentState.end !== state.end
			|| currentState.start !== state.start
		) {
			this.setState(state, 0)
		}
	}
	
	render() {
		const {slides} = this.props;

		if (!(slides && slides.length)) {
			return <Slider />;
		}
		
		const
			{title, more, moreLink, outLink, moreAction, footerBtn} = this.props,
			{end, start} = this.state,
			count = slides.length,

			slidesJsx = slides.map((slide, index) =>
				<Item key={index}>
					{slide}
				</Item>
			);

		return (
			<Slider active={true} start={start}>
				<Header>
					<Title>
						{title}
					</Title>
					{
						more && count > 2 ? (
								moreAction ? (
										<a
											href="#"
											className="link"
											onClick={e => {e.preventDefault(); moreAction()}}>
											{more}</a>
									) :
										outLink
											? <a
													className="link"
													href={moreLink}>
													{more}
												</a>
											: <Link
													className="link"
													to={moreLink}>
													{more}
												</Link>

							) : null
					}
					{
						count > 2 ? (
								<Controls>
									<Btn modifier="prev" hidden={!start} onClick={this.prev}>
										<img className="icon" src={SVG.prev} alt=""/>
									</Btn>
									<Btn modifier="next" hidden={end} onClick={this.next}>
										<img className="icon" src={SVG.next} alt=""/>
									</Btn>
								</Controls>
							) : null
					}
				</Header>
				<div className="scroll-slider_shadow">
					<div
						onScroll={this.scrollSlider}
						className="scroll-slider_container"
						ref="slider">
						<Items>
							{slidesJsx}
						</Items>
					</div>
				</div>

				{
					footerBtn && more
						? <Footer>

							{
								moreAction ? (
										<a
											href="#"
											className="btn btn_white_bg scroll-slider_more_btn"
											onClick={e => {e.preventDefault(); moreAction()}}>
											{more}</a>
									) :
									outLink
										? <a
											className="btn btn_white_bg scroll-slider_more_btn"
											href={moreLink}>
											{more}
										</a>
										: <Link
											className="btn btn_white_bg scroll-slider_more_btn"
											to={moreLink}>
											{more}
										</Link>
							}

							</Footer>
						: null
				}
			</Slider>
		);
		
	}
};
