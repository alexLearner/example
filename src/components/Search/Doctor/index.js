import React, {PureComponent} from 'react';
import {Doctor} from '../../Places';
import Slider from "../../UI/Slider"
import { defineMessages } from 'react-intl';

const msg = defineMessages({
	title: {
		defaultMessage: "Ведущие специалисты клиники",
		id: "search.doctors.title"
	},

	more: {
		defaultMessage: "Смотреть всех специалистов",
		id: "search.doctors.more"
	}
});

export default class SearchDoctor extends PureComponent {
	constructor( props ) {
		super ( props );
		this.max = 10;

		this.show = this.show.bind(this);
	}

	show(id, index) {
		this.props.actions.showDoctor(id, undefined , {index, clinic_id: this.props.clinic});
	}

	render() {
		if (!this.props.doctors) return null;

		const f = this.context.f;
		const {
			showDoctors,
			doctors,
			search,
			clinic: id
		} = this.props,
		{pathnames: {clinics: route}} = this.context;
		
		let items = doctors.map((doctor, i) =>
			i > this.max - 1
				? null
				: <Doctor doctor={doctor} key={i} show={() => this.show(doctor.id, i)} />
		);

		return (
			<div className="search_doctors">
				<Slider
					slides={items}
				  title={f(msg.title)}
				  more={f(msg.more)}
				  moreAction={showDoctors}
				  moreLink={`/${route}/${id}/doctors${search}`}
				/>
			</div>
		) 
	}
};

SearchDoctor.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};
