import React, {PureComponent} from 'react';
import {Doctor} from '../../Places';
import Slider from "../../UI/Slider"
import msg from "./msg"

export default class HomeDoctors extends PureComponent {
	constructor( props ) {
		super ( props );
		this.max = 10;

		this.show = this.show.bind(this);
	}

	show(id, index) {
		this.props.actions.showDoctor(id, undefined , {index, clinic_id: this.props.clinic});
	}

	render() {
		const
			doctors = this.props.doctors,
			{f, pathnames: {s_host}} = this.context,
			{fetched, data} = doctors,
			items = fetched && data.map((doctor, i) =>
				i > this.max - 1 || !doctor.img
					? null
					: <Doctor doctor={doctor} key={i} show={() => this.show(doctor.id, i)} />
			);

		return (
			<div className="search_doctors">
				<Slider
					slides={items}
					footerBtn={true}
					title={f(msg.title)}
					more={f(msg.all)}
					outLink={true}
					moreLink={`${s_host}/doctors/`}
				/>
			</div>
		)
	}
};

HomeDoctors.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
};

