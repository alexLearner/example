import React,{PureComponent} from 'react'
import {Link} from 'react-router';
import TabMixin from "../TabsMixin"
import {Doctor} from "../../Places"
import {Rating} from "../../UI"
import Table from "../Table"
import tx from 'transform-props-with';
import addElementFunc from "../../../functions/elementStyles";
import msg from "./msg"

const rc = addElementFunc("details_info");
const pr = addElementFunc("");

const 
	Info = tx([{ className: "details_info" }, pr])('div'),
	Content = tx([{ name: 'content', className: "block_content content" }, rc])('div'),
	Container = tx([{ name: 'container' }, rc])('div'),
	Sidebar = tx([{ name: 'sidebar' }, rc])('div'),
	Title = tx([{ name: 'title' }, rc])('h2'),
	Field = tx([{ name: 'field' }, rc])('div'),
	Caption = tx([{ name: 'caption', className: "caption" }, rc])('div'),
	FieldTitle = tx([{ name: 'field_title'}, rc])('div'),
	Places = tx([{ name: 'places'}, rc])('div'),
	Header = tx([{ name: 'header' }, rc])('div');

export default class DetailsInfo extends TabMixin {
	constructor(props) {
		super(props);

		this.show = this.show.bind(this);
		this.conditionsFields = this.conditionsFields.bind(this);
	}

	componentDidMount() {
		this.tabComponentDidMount();
	}

	shouldComponentUpdate(nextProps) {
		return (nextProps.hidden !== this.props.hidden)
	}

	show(id, index) {
		this.props.actions.showDoctor(
			id,
			undefined,
			{index: index, clinic_id: this.props.item.id}
		);
	}

	scrollTop() {
		const headerHeight = document.getElementById('header').offsetHeight;

		if (!isMobile) {
			const navTop =
				document.getElementById("details_tabs")
				.offsetTop;

			return window.scrollTo(0,Math.abs(navTop) - headerHeight - 12)
		}
	}

	conditionsFields(array) {
		const
			clinic = this.props.item.alias,
			{search} = this.props,
			{pathnames: {clinics: route}} = this.context;

		return array
			.filter(item => !!item)
			.map(({name, id, description}, index) =>
				<Field key={index}>
					<Link
						to={`/${route}/${clinic}/${search}#tab-accommodation`}>
						{name}
					</Link>
					{
						description ? (
							<Caption>{description}</Caption>
						) : null
					}
				</Field>
			)
	}

	render() {
		const
			{
				f,
				pathnames: {clinics: route}
			} = this.context,
			{item, actions, hidden} = this.props,
			{
				id,
				alias,
				popularity_doctors,
				rating_bookimed,
				name_kogo,
				name,
				texts,
				doctors_count,
				popularity_procedures,
				conditions,
			} = item,
			{
				accommodation,
				transfer
			} = conditions,
			doctorsJSX = popularity_doctors.map((doctor, i) =>
				i >= 2
					? null
					: <Doctor key={i} doctor={doctor} show={() => this.show(doctor.id, i)} />
			),
			accommodationList = this.conditionsFields(accommodation),
			transferList = this.conditionsFields(transfer),
			conditionsVisible = !(!transferList.length && !accommodationList.length);

		let search = this.props.search || "";

		return (
			<Info hidden={hidden}>
				<div className="size5of8">
					<Header>
						<Title>
							{f(msg.description)}&#160;
							{name_kogo || name}
						</Title>
					</Header>

					<Content dangerouslySetInnerHTML={{__html: texts.txt_long || "" }} />

					<Container>
						<Header>
							{
								popularity_procedures && popularity_procedures.length
									? <Title>
											{f(msg.procedures)}
											<Link
												className="details_info_more blue"
												to={`/${route}/${alias}/${search}#tab-diagnostics`}>
												{f(msg.view_all_procedures)}
											</Link>
										</Title>
									: null
							}

						</Header>

						<Content>
							<Table
								id={id}
								actions={actions}
								data={popularity_procedures} />
						</Content>
						{
							doctors_count ? (
								<div>
									<Header>
										<Title>
											{f(msg.doctors)}
											<span>{doctors_count}</span>
											<Link
												className="details_info_more blue"
												to={`/${route}/${alias}/${search}#tab-doctors`}>
												{f(msg.view_all_doctors)}
											</Link>
										</Title>
									</Header>

									<Places>
										{doctorsJSX}
									</Places>
								</div>
							) : null
						}
					</Container>

				</div>

				<div className="size3of8">
					<Sidebar>
						{
							rating_bookimed.general.count ? (
								<div>
									<Header>
										<Title>
											{f(msg.rate)}
											<span className="blue">
												{rating_bookimed.general.content}
												&#160;
												{(rating_bookimed.general.count * 10).toFixed(1)}
											</span>
										</Title>
									</Header>

									<Rating
										rating={(rating_bookimed.general.count * 10).toFixed(1)}
										rating_bookimed={item.rating_bookimed}
										rating_help="true"
										disabled={true}
										rating_alltime_visible={true}
										className="search_item_head_rating rating_alltime_visible rating_blue" />
								</div>
							) : null
						}

						{
							conditionsVisible
								? <Header>
										<Title>
											{f(msg.conditions)}
										</Title>
									</Header>
								: null
						}


						{
							transferList && transferList.length ? (
								<div>
									<FieldTitle>{f(msg.transfer)}</FieldTitle>
									{transferList}
									<Field>
										<Link
											to={`/${route}/${alias}/${search}#tab-accommodation`}
											className="link">
											{f(msg.more_transfer)}
										</Link>
									</Field>
								</div>
							) : null
						}

						{
							accommodationList && accommodationList.length ? (
								<div>
									<FieldTitle>{f(msg.accommodation)}</FieldTitle>
									{accommodationList}
									<Field>
										<Link
											to={`/${route}/${alias}/${search}#tab-accommodation`}
											className="link">
											{f(msg.more_accommodation)}
										</Link>
									</Field>
								</div>
							) : null
						}

					</Sidebar>
				</div>
			</Info>
		)
	}
}

DetailsInfo.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};

