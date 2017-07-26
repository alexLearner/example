import React, {PureComponent} from 'react';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';
import Filter from "../../Filters/Filters.js"
import SVG from "../../UI/SVG"
import {browserHistory} from "react-router"
import forEach from "lodash/forEach"
import msg from "./msg"

const
	rc = addElementFunc("home_banner"),
	pr = addElementFunc(""),
	Banner = tx([{ className: 'home_banner' }, pr])('div'),
	Form = tx([{ name: 'form' }, rc])('div'),
	Icon = tx([{ name: 'icon' }, rc])('span'),
	Title = tx([{ name: 'title' }, rc])('h1'),
	SubTitle = tx([{ name: 'subtitle' }, rc])('div');

export default class BannerClass extends PureComponent {
	constructor( props ) {
		super ( props );

		this.show = this.show.bind(this);
		this.active = this.active.bind(this);
	}

	show(q, modifier) {
		if (modifier) {
			this.refs.filter.changeModifier(modifier, q);
		}
		else {
			this.refs.filter.show(q)
		}
	}

	active() {
		let
			search = "/",
			filters = this.props.filters,
			route = this.context.pathnames.search;

		forEach(filters, ({alias}, key) => {
			if (key === "query" || key === "query_aliases") return;
			if (!alias) return;

			search = search + `${key}=${alias}/`;
		});

		browserHistory.push(`/${route}${search}`);
	}

	render() {
		const f = this.context.f;
		return (
			<Banner>
				<div className="block">
					<Title>
						{f(msg.find)}
					</Title>
					<SubTitle>
						{f(msg.coord)}
					</SubTitle>
					<Form>
						{f(msg.change)}
						<div className="relative">
							<Filter {...this.props} ref="filter"/>
							<Icon
								onClick={this.active}
								dangerouslySetInnerHTML={{__html: SVG.search}} />
						</div>
					</Form>
				</div>
			</Banner>
		);
	}
}

BannerClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
};

