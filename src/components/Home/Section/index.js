import React, {PureComponent} from 'react';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';
import { Link } from 'react-router'

const rc = addElementFunc("section");
const pr = addElementFunc("");
const
	Section = tx([{ className: 'section' }, pr])('section'),
	Title = tx([{ name: 'title' }, rc])('h3'),
	Header = tx([{ name: 'header' }, rc])('header'),
	Footer = tx([{ name: 'footer' }, rc])('footer'),
	Body = tx([{ name: 'body' }, rc])('div');

export default ({title, more, moreLink, children}) =>
	title
		? <Section>
				<Header>
					<Title>
						{title}
					</Title>
					{
						more
							? <Link
									to={moreLink}
									className="link">
									{more}
								</Link>
							: null
					}
				</Header>
				<Body>{children}</Body>
				{
					more
						? <Footer>
								<Link
									to={moreLink}
									className="btn btn_white_bg section_btn">
									{more}
								</Link>
							</Footer>
						: null
				}
			</Section>
		: <Section>{children}</Section>


