import React,{PureComponent} from 'react'
import {defineMessages} from 'react-intl';
import {SelectSearch} from "../UI"
import Textarea from "../Forms/Textarea"
import validateForm from "../../functions/validateForm"
import Formsy from 'formsy-react'
import tx from 'transform-props-with'
import addElementFunc from "../../functions/elementStyles"
import forEach from "lodash/forEach"

const rc = addElementFunc("review_form");
const 
		Form = tx([{ className: "review_form" }])('section'),
		Header = tx([{ name: 'header' }, rc])('header'),
		Title = tx([{ name: 'title' }, rc])('h2'),
		Body = tx([{ name: 'body' }, rc])('div'),
		Container = tx([{ name: 'container' }, rc])('div'),
		Field = tx([{ name: 'field' }, rc])('div'),
		Btn = tx([{ name: 'btn', className: "btn btn_form", role: "button", tabIndex: 0 }, rc])('div');

const msg = defineMessages({
	yes: {
		id: "yes",
		defaultMessage: "Да"
	},
	no: {
		id: "no",
		defaultMessage: "Нет"
	},
	is_you_found: {
		id: "review_form.is_you_found",
		defaultMessage: "Вы нашли то, что искали?"
	},
	placeholder: {
		id: "review_form.placeholder",
		defaultMessage: "Например, на вкладке докторов не хватает специализации."
	},
	leave_review: {
		id: "review_form.leave_review",
		defaultMessage: "Отзыв о странице"
	},
	positive_text: {
		id: "review_form.positive_text",
		defaultMessage: "Расскажите нам о том, что Вам понравилось. Ваши комментарии позволят сделать наш сайт полезнее для всех!"
	},
	negative_text: {
		id: "review_form.negative_text",
		defaultMessage: "Опишите, пожалуйста, проблему"
	},
	negative_title: {
		id: "review_form.negative_title",
		defaultMessage: "Укажите категорию проблемы, которая лучше всего ее описывает"
	},
	comment: {
		id: "review_form.comment",
		defaultMessage: "Оставить комментарий"
	}
});

const OPTIONS = [
	{
		value: "cause",
		label: "Я не смог найти то, что я искал"
	},
	{
		value: "cause2",
		label: "Что-то не работает"
	},
	{
		value: "cause3",
		label: "Ошибка в описании или картинках"
	},
	{
		value: "cause3",
		label: "Я просто хочу связаться с поддержкой"
	},
];

const NegativeBlock = ({changeType, f}) =>
	<Container>
		<Field>
			<p>{f(msg.negative_title)}</p>
			<SelectSearch
				name="cause"
				value={OPTIONS[0]}
				options={OPTIONS}
				onChange={changeType}
			/>
		</Field>

		<Textarea
			className="review_form_field"
			label={f(msg.negative_text)}
			name="comment"
			required
			placeholder={f(msg.placeholder)}
		/>
	</Container>;

const PositiveBlock = ({changeType, f}) =>
	<Container>
		<Textarea
			className="review_form_field"
			label={f(msg.positive_text)}
			name="comment"
			required
			placeholder={f(msg.placeholder)}
		/>
	</Container>;

class ReviewForm extends PureComponent {
	constructor(props) {
		super(props);

		this.submitForm = this.submitForm.bind(this);
		this.changeType = this.changeType.bind(this);

		this.state = {
			active: false,
			is_helpful: -1,
			disabled: false,
			type: OPTIONS[0].value
		};
	}

	toogle(is_helpful = false) {
		this.setState({
			active: !this.state.active,
			is_helpful: is_helpful
		});
	}

	changeType(type) {
		this.setState({type})
	}

	submitForm(model) {
		if (!validateForm(this.refs.form)) return;

		const is_helpful = this.state.is_helpful;
		let fd = new FormData();

		forEach(
			{
				...model,
				is_helpful,
				url: window.location.pathname,
				type: !is_helpful ? this.state.type.label : -1
			},
			(value, key) => value !== -1 ? fd.append(key, value) : null
		);

		this.props.actions.detailsPostReview(fd);
		this.setState({
			active: false,
			// disabled: true,
			is_helpful: -1
		});
	}

	render() {
		const 
				{f} = this.context,
				{active, is_helpful, disabled} = this.state,
				content = is_helpful
					? <PositiveBlock f={f} />
					: <NegativeBlock f={f} changeType={this.changeType} />;

		return (
			<Form>
				<div className="block">
					<Header>
						<Title>{f(msg.leave_review)}</Title>
					</Header>

					<Body>
						<p>{f(msg.is_you_found)}</p>
						<Btn
							active={is_helpful === 1}
							onClick={() => !disabled && this.toogle(1)}>
							<span>{f(msg.yes)}</span>
						</Btn>
						<Btn
							active={!is_helpful}
							onClick={() => !disabled && this.toogle(0)}>
							<span>{f(msg.no)}</span>
						</Btn>
					</Body>

					{
						!disabled && active ? (
							<Formsy.Form 
								onSubmit={this.submitForm} 
								className="review_form_hidden"
								ref="form">

								{content}

								<button type="submit" className="btn btn_red btn_submit">
									<span>{f(msg.comment)}</span>
								</button>
							</Formsy.Form>
						) : null
					}
				</div>
			</Form>
		)
	}
}


ReviewForm.contextTypes = {
  f: React.PropTypes.func
};

export default ReviewForm;
