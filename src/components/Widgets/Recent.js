import React,{PureComponent} from 'react'
import {defineMessages} from 'react-intl';

import tx from 'transform-props-with'
import addElementFunc from "../../functions/elementStyles"

const rc = addElementFunc("recent");

const Recent = tx([{ className: "recent" }])('section');
const Header = tx([{ name: 'header' }, rc])('header');
const Title = tx([{ name: 'title' }, rc])('h4');
const More = tx([{ name: 'more' }, rc])('a');
const Body = tx([{ name: 'body' }, rc])('div');

const msg = defineMessages({
	show_all_history: {
		id: "recent.show_all_history",
		defaultMessage: "Посмотреть всю историю"
	},
	you_recently_viewed: {
		id: "recent.you_recently_viewed",
		defaultMessage: "Вы недавно просматривали:"
	}
});

export default class RecentClass extends PureComponent {
	constructor(props) {
		super(props)
	}

	render() {
		const f = this.props.f;

		return (
			<Recent>
				<Header>
					<Title>{f(msg.you_recently_viewed)}</Title>
					<More href="#">{f(msg.show_all_history)}</More>
				</Header>

				<Body>

				</Body>
			</Recent>
		)
	}
}
