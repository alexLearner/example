import React, {PureComponent} from 'react';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';
import LazyImg from "../../UI/LazyImg"

const rc = addElementFunc("place");
const pr = addElementFunc("");
const
	Place = tx([{ className: 'place' }, pr])('div'),
	Body = tx([{ name: 'body' }, rc])('div');

export default ({img, children}) =>
	<Place>
		<LazyImg src={img} className="place_img" />
		<Body>{children}</Body>
	</Place>


