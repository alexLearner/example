import React,{PureComponent} from 'react'
import Control from "../Control"
import TabsMixin from "../TabsMixin"
import LiveSearch from "../LiveSearch"
import {Doctor} from "../../Places"
import {FormattedMessage} from 'react-intl';
import isEqual from "lodash/isEqual"
import tx from 'transform-props-with';
import addElementFunc from "../../../functions/elementStyles";
import msg from "../Tabs/msg"

const rc = addElementFunc("details_doctors");
const pr = addElementFunc("");

const 
	Doctors = tx([{ className: "details_doctors details_tabs_block preloader" }, pr])('div'),
	Body = tx([{ name: 'body' }, rc])('div'),
	Header = tx([{ className: 'details_tabs_header'}])('div'),
	Footer = tx([{ className: 'details_tabs_footer'}])('div');

export default class DetailsDoctors extends TabsMixin {
	constructor(props, {f}) {
		super(props);

		this.name = this.CONSTANTS.doctors.name;
		this.getFunctionName = this.CONSTANTS.doctors.fn;

		this.sortingList = [
			{
				label: f(msg.recommended),
				value: 'recommended'
			},
			{
				label: f(msg.popularity),
				value: 'popularity'
			},
			{
				label: f(msg.by_alphabet),
				value: 'name'
			}
		];
	}

	shouldComponentUpdate(nextProps) {
		return (
			nextProps.hidden !== this.props.hidden ||
			!isEqual(this.props.details.doctors.data, nextProps.details.doctors.data)
		)
	}

	show(id, index) {
		this.props.actions.showDoctor(
			id, 
			undefined, 
			{index: index, clinic_id: this.props.item.id}
		);
	}

	componentDidMount() {
		this.tabComponentDidMount();
	}

	render() {
		const
			{layout, details, filters, hidden} = this.props,
			{doctors} = details,
			f = this.context.f,
			{pagination, fetched} = doctors,
			more = this.returnMoreButton(pagination);

		if (!fetched) {
			return <Doctors active={false} />
		}

		const items = doctors.data.map((doctor, index) =>
			<Doctor show={() => this.show(doctor.id, index)} key={index} doctor={doctor} />
		);

		return (
			<Doctors
				hidden={hidden}
				active={true}>
				<div className="size6of8">
					<Header>
						<LiveSearch
							name="doctors"
							placeholder={f(msg.doctors_placeholder)}
							onChange={this.search}
						/>
					</Header>
					<Body>
						{
							items && items.length ? items : (
								<div>
									<FormattedMessage
										id="deatils.not_found"
										defaultMessage="Ничего не найдено" />
								</div>
							)
						}
					</Body>

					<Footer>
						{more}
					</Footer>
				</div>

				<div className="size2of8">
					<Control
            filters_data={filters}
						sorting={this.sortingList}
						history={this.state.history}
            changeQuery={this.changeQuery}
            sortingChange={this.sorting}
            filteringChange={this.sorting}
					 />
				</div>
			</Doctors>
		)
	}
}

DetailsDoctors.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
	store: React.PropTypes.object
};