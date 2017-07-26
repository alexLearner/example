import React,{PureComponent} from 'react'
import Control from "../Control"
import LiveSearch from "../LiveSearch"
import Table from "../Table"
import TabMixin from "../TabsMixin"
import isEqual from "lodash/isEqual"
import tx from 'transform-props-with';
import {FormattedMessage} from 'react-intl';
import addElementFunc from "../../../functions/elementStyles";
import msg from "../Tabs/msg"

const rc = addElementFunc("details_procedures");
const pr = addElementFunc("");

const 
	Procedures = tx([{ className: "details_procedures details_tabs_block preloader"}, pr])('div'),
	Body = tx([{ name: 'body' }, rc])('div'),
	Header = tx([{ className: 'details_tabs_header' }])('div'),
	Help = tx([{ name: 'help', className: "details_tabs_help" }, rc])('div'),
	Footer = tx([{ className: 'details_tabs_footer' }])('div');

export default class DetailsProcedures extends TabMixin {
	constructor(props, {f}) {
		super(props);

		this.consultation = this.consultation.bind(this);
		this.reset = this.reset.bind(this);

		this.sortingList = [
			{
				label: f(msg.recommended),
				value: "recommended"
			},
			{
				label: f(msg.popularity),
				value: "popularity"
			},
			{
				label: f(msg.expensive),
				value: "-price"
			},
			{
				label: f(msg.cheap),
				value: "price"
			}
		];

		this.name = this.CONSTANTS.procedures.name;
		this.getFunctionName = this.CONSTANTS.procedures.fn;
	}

	shouldComponentUpdate(nextProps) {
		return (
			nextProps.hidden !== this.props.hidden ||
			!isEqual(this.props.details.procedures.data, nextProps.details.procedures.data)
		)
	}

	reset() {
		this.refs.control.toogleReset();
	}

	componentDidMount() {
		this.tabComponentDidMount();
	}

	consultation(e) {
		e.preventDefault();
		e.stopPropagation();

		let object = {clinic_id: this.props.item.id};

		this.props.actions.setPopupBody(undefined, "get_cost", object)
	}


	render() {
		const
			{
				layout,
				item,
				filters,
				actions,
				hidden,
				details
			} = this.props,
			f = this.context.f;

		if (!details.procedures || !details.procedures.fetched) return <Procedures/>;

		const
			{id} = item,
			{procedures} = details,
			{pagination, data} = procedures,
			more = this.returnMoreButton(pagination);

		return (
			<Procedures active={true} hidden={hidden}>
				<div className="size6of8">
					<Header>
						<LiveSearch
							name="procedures"
							placeholder={f(msg.procedures_placeholder)}
							onChange={this.search}

						/>
					</Header>

					<Body>
						{
							data && data.length ? (
								<Table
									data={data}
									id={id}
									actions={actions}
								/>
							) : (
								<div>
									<FormattedMessage id="deatils.not_found" defaultMessage="Ничего не найдено" />
								</div>
							)
						}
					</Body>

					<Footer>
						{more}
					</Footer>

					<Help>
						<p>{f(msg.is_not_sure_procedure)}</p>
						<a
							href="#"
							onClick={(e) => this.consultation(e)}
							className="btn btn_red">
							{f(msg.get_consultation)}
						</a>
					</Help>
				</div>

				<div className="size2of8">
					<Control
						ref="control"
            filters_data={filters}
						sorting={this.sortingList}
						history={this.state.history}
						changeQuery={this.changeQuery}
						sortingChange={this.sorting}
						filteringChange={this.sorting}
						lastCheckbox={{text: f(msg.procedures_with_cost), name: "with_price"}}
						/>
				</div>
			</Procedures>
		)
	}
}

DetailsProcedures.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};

