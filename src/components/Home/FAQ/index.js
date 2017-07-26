import React, {PureComponent} from 'react';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';
import SVG from "../../UI/SVG"
import Content from "../Content"

const rc = addElementFunc("home_faq");
const ac = addElementFunc("home_according");
const pr = addElementFunc("");

const
	FAQ = tx([{ className: 'home_faq preloader' }, pr])('div'),
	Items = tx([{ name: 'items home_according' }, rc])('div'),
	AccordingItem = tx([{ name: 'item' }, ac])('div'),
	AccordingTitle = tx([{ name: 'title' }, ac])('h3'),
	AccordingContent = tx([{ name: 'content', className: "content" }, ac])('div');

export default class FAQClass extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {active: 2};
		this.active = this.active.bind(this);
	}

	active(index) {
		this.setState({
			active: this.state.active === index ? -1 : index
		})
	}


	render() {
		const
			{pathnames: {clinics: route}} = this.context,
			{active} = this.state,
			{faq} = this.props;

		if (!faq.fetched) {
			return <FAQ />
		};

		const items = faq.data.according.map(({title, content}, index) =>
			<AccordingItem
				active={index === active}
				key={index}>
				<AccordingTitle
					onClick={() => this.active(index)}>
					{title}
					<img className="icon" src={SVG.prev} alt="prev" />
				</AccordingTitle>
				<AccordingContent
					dangerouslySetInnerHTML={{__html: content}}
				/>
			</AccordingItem>
		);

		return (
			<FAQ active={true}>
				<Content
					className="home_faq_content"
					content={faq.data.content} />
				<Items>
					{items}
				</Items>
			</FAQ>
		)
	}
}

FAQClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};
