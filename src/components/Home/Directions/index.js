import React, {PureComponent} from 'react';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';
import Slider from "../../UI/Slider"
import {Link} from "react-router"
import msg from "./msg"

const rc = addElementFunc("home_direction");
const pr = addElementFunc("");

const
	Dir = tx([{ className: 'home_direction search_place noactive' }, pr])('div'),
	Title = tx([{ name: 'title' }, rc])('div'),
	DirLink = tx([{ name: 'link' }, rc])('a'),
	Header = tx([{ name: 'head' }, rc])('div'),
	Footer = tx([{ name: 'footer' }, rc])('footer'),
	List = tx([{ name: 'list' }, rc])('div');

export default class DirectionsClass extends PureComponent {

	render() {
		const {f, pathnames: {search: route, s_host}} = this.context;
		let {
			directions: {
				fetched,
				data
			},
			title,
			search
		} = this.props;
		let items = [];

		if (!search) {
			search = "";
		}

		items = fetched && data.map((item,index) =>
			index > 10
				? null
				: <Dir key={index} >
						<Title>
							<Link
								to={`/${route}/${search}direction=${item.alias}/`}>
								{item.name}
							</Link>
						</Title>
					{
						!search
							? <Header>
									<DirLink
										className="home_direction_link home_direction_link_circle"
										onClick={() => this.props.show("", 2) }
										>
										{f(msg.procedures)}
										</DirLink>
									{
										item.links.articles
											? <DirLink
												href={s_host + item.links.articles}>
												{f(msg.articles)}
												</DirLink>
											: null
									}
								</Header>
							: null
					}

						<List>
							{
								item && item.illnesses  && item.illnesses.map((illness, index) =>
									<Link
										to={`/${route}/${search}illness=${illness.alias}/`}
										className="link"
										key={index}>
										{illness.name}
									</Link>
								)
							}
						</List>

					{
						!search
							? <Footer>
									<DirLink
										onClick={(e) => {e.preventDefault(); this.props.show("")}}
										href={`${s_host}/illnesses/`}
										className="dotted">
										{f(msg.choose)}
									</DirLink>
								</Footer>
							: null
					}
					</Dir>
		);

		return (
			<Slider
				slides={items}
				footerBtn={true}
				title={title || f(msg.base)}
				more={f(msg.all_directions)}
				moreAction={() => this.props.show("", 2)}
			/>
		)
	}
}

DirectionsClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
};

