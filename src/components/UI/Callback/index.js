import React, { PureComponent } from 'react'
import Formsy from 'formsy-react'
import SelectPhone from "../SelectPhone"
import validateForm from "../../../functions/validateForm"
import Textarea from "../../Forms/Textarea"
import Input from "../../Forms/Input"
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';
import { defineMessages } from 'react-intl';
import forEach from "lodash/forEach"
import Cookie from "../../../functions/Cookie"

const msg = defineMessages({
	title: {
		id: "callback.title",
		defaultMessage: "Опишите цель обращения"
	},
	your_phone: {
		defaultMessage: "Ваш номер телефона",
		id: "callback.your_phone"
	},
	email: {
		defaultMessage: "Адрес электронной почты",
		id: "callback.email"
	},
	get_cost: {
		defaultMessage: "Получить стоимость лечения",
		id: "callback.get_cost"
	},
	placeholder: {
		defaultMessage: "Например: Сколько стоит лечение рака молочной железы 4 стадии в Израиле? ",
		id: "callback.placeholder"
	},
});

const
	rc = addElementFunc("callback"),
	Footer = tx([{ className: 'footer' }, rc])('footer'),
	Form = tx([{ name: 'form' }, rc])('div'),
	Field = tx([{ name: 'field' }, rc])('div');

export default class CallbackClass extends PureComponent {
	constructor( props ) {
		super ( props );

		this.submit = this.submit.bind(this);
		this.reset = this.reset.bind(this);

		this.state = {disabled: false}
	}

	submit(model) {
		if (!validateForm(this.refs.form)) return;

		const
			tracking = {...Cookie.getTracking()},
			layout = this.props.layout,
			aliases = this.props.filters.query_aliases;

		let obj = {
			...model,
			procedure_id: tracking.procedure.pop(),
			illness_id: tracking.illness.pop(),
			clinic_id: tracking.clinic.pop(),
			direction_id: tracking.direction.pop(),
			country_to_treat_id: tracking.country.pop(),
			history: JSON.stringify(tracking.url_history),
			city_id: tracking.city.pop(),
			...layout.serverData,
			// history: JSON.stringify(layout.history),
			tracking: JSON.stringify(tracking),
			url: window.location.href
		};

		this.setState({disabled: true});

		const
			{params} = this.props,
			phoneVal = this.refs.select.state.value;
		let fd = new FormData;

		forEach(obj,
			(value, key) => value ?
				fd.append(key, key === "phone" ? phoneVal + value : value)
				: null
		);

		this
			.props
			.submit(fd)
			.then(() => this.setState({disabled: false}));
		this.reset();
	}

	reset() {
		this.refs.form.inputs.forEach(e => e.reset());
	}

	render() {
		const f = this.context.f;
		const {disabled} = this.state;
		this.phone = this.props.layout.current_phone && this.props.layout.current_phone[0];

		return (
			<Formsy.Form
				onSubmit={this.submit}
				ref="form"
				className="callback">
				<Form>
					<Textarea
						required
						className="callback_field"
						name="msg"
						ref="textarea"
						label={f(msg.title)}
						placeholder={f(msg.placeholder)}/>

					<Field>
						<label>
							{f(msg.your_phone)}
							<sup>*</sup>
						</label>

						<div>
							<SelectPhone
								ref="select"
								{...this.props}
								name="phone"
							  required
							/>
						</div>
					</Field>

					<Input
						required
						className="callback_field"
						name="email"
						placeholder="email@domain.com"
						validations={{isEmail: true}}
						icon={true}
						label={f(msg.email)}
					/>

					<Footer>
						<button
							disabled={disabled}
							type="submit"
							className="btn btn_red">
							<span>{f(msg.get_cost)}</span>
						</button>
					</Footer>

				</Form>
			</Formsy.Form>
		)
	}
};

CallbackClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
};

