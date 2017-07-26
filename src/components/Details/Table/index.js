import React,{PureComponent} from 'react'
import msg from "./msg"

export default class DetailsTable extends PureComponent {
	constructor(props) {
		super(props);

		this.show = this.show.bind(this);
		this.consultation = this.consultation.bind(this);		
	}

	show(e, id, type) {
		this.props.actions.showProcedure(id, {
			type,
			current_clinic: this.props.id
		}, {type, clinic: this.props.id})
	}

	consultation(e, id) {
		e.preventDefault();
		e.stopPropagation();

		this.props.actions.setPopupBody(undefined, "get_cost", {
			procedure_id: id,
			clinic_id: this.props.id
		})
	}

	render() {
		const
			{data, type: propsType} = this.props,
			{f, pathnames: {s_host}} = this.context,
			items = data.map(({name, price, id, type, alias}, index) => (
				<tr
					key={index}
					onClick={(e) => this.show(e, id, type || propsType)}>
					<td>
						<a
							onClick={e => e.preventDefault()}
							href={s_host + `/clinics/procedure=${alias}/` }>
							{name}
						</a>
						<span className="link">{f(msg.more)}</span>
					</td>
					<td>
						{price || f(msg.cost)}
						<i className="triangle" />
						<span
							href="#"
							className="red"
							onClick={e => this.consultation(e, id)}>
							{f(msg.order)}
						</span>
					</td>
				</tr>
			));

		return (
			<table className="details_table">
				<tbody>
					{items}
				</tbody>
			</table>
		)
	}
}

DetailsTable.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
};