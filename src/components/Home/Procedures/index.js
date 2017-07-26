import React, {PureComponent} from 'react';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';
import Place from "../Place"
import Table from "../../Details/Table"
import Slider from "../../UI/Slider"
import isEmpty from "lodash/isEmpty"
import msg from "./msg"

const rc = addElementFunc("home_procedures");
const tb = addElementFunc("tabs");
const pr = addElementFunc("");

const
	Procedures = tx([{ className: 'home_procedures preloader' }, pr])('div'),
	Tabs = tx([{ className: 'tabs' }, pr])('div'),
	Body = tx([{ name: 'body' }, tb])('div'),
	Item = tx([{ name: 'item' }, tb])('div'),
	Nav = tx([{ name: 'nav' }, tb])('ul'),
	NavItem = tx([{ name: 'nav_item' }, tb])('li');

export default class ProceduresClass extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {active: 0}
	}

	componentWillReceiveProps(nextProps) {
		if (!(nextProps.operations.data && nextProps.operations.data.length)) {
			this.setState({active: 1})
		}
	}

	render() {
		const
			{active} = this.state,
			{f} = this.context,
			{
				actions,
				diagnostics,
				operations
			} = this.props;

		if (!(diagnostics.fetched && operations.fetched)) {
			return <Procedures />
		}

		return (
			<Procedures active={true}>
				<Tabs className="procedures_tabs">
					<Nav className="tabs_nav">
						{
							operations.data.length ? (
								<NavItem
									active={active === 0}
									onClick={() => this.setState({active: 0})}>
									{f(msg.procedures)}
								</NavItem>
							) : null
						}

						{
							diagnostics.data.length ? (
								<NavItem
									active={active === 1}
									onClick={() => this.setState({active: 1})}>
									{f(msg.diagnostics)}
								</NavItem>
							) : null
						}

					</Nav>

					<Body>
						<Item
							active={active === 0}
							>
							<Table
								actions={actions}
								type="operation"
								data={operations.data} />
						</Item>
						<Item
							active={active === 1}
							>
							<Table
								actions={actions}
								type="diagnostic"
								data={diagnostics.data} />
						</Item>
					</Body>
				</Tabs>
			</Procedures>
		)
	}
}

ProceduresClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};



