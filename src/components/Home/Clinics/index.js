import React, {PureComponent} from 'react';
import Slider from "../../UI/Slider"
import Clinic from "./Clinic"

export default class ClinicsClass extends PureComponent {
	constructor(props) {
		super(props)
	}

	render() {
		const
			clinics = this.props.clinics,
			{fetched, data} = clinics,
			{f, msg, pathnames: {clinics: route}} = this.context;
		let items = [], rating;

		items = fetched && data.map((clinic, index) =>
			<Clinic clinic={clinic} route={route} key={index} />
		);

		return (
			<Slider
				slides={items}
				footerBtn={true}
				title={f(msg.t_clinics)}
				more={f(msg.all_clinics)}
				moreLink="/clinics/"
			/>
		)
	}
}

ClinicsClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
	msg: React.PropTypes.object
};



