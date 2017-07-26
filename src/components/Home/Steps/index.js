import React, {PureComponent} from 'react';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';
import Callback from "../../UI/Callback"

const rc = addElementFunc("home_steps");
const pr = addElementFunc("");

const
	Steps = tx([{ className: 'home_steps section' }, pr])('div'),
	Title = tx([{ name: 'title' }, rc])('h3'),
	Left = tx([{ name: 'left' }, rc])('div'),
	Right = tx([{ name: 'right' }, rc])('div'),
	List = tx([{ name: 'list' }, rc])('ul'),
	Step = tx([{ name: 'step' }, rc])('li'),
	StepItem = tx([{ name: 'step_item' }, rc])('i');

const STEPS_CONTENT = [
	"Вы рассказываете о медицинской проблеме",
	"Мы подбираем для вас клинику",
	"Вы получаете программы лечения и делаете выбор",
	"Мы помогаем подготовиться к поездке за рубеж",
	"Вы проходите лечение в выбранной клинике",
	"Мы координируем ваше пребывание за границей",
	"Вы возвращаетесь домой после лечения",
	"Мы остаёмся с вами на связи"
];

export default class StepsClass extends PureComponent {
	constructor( props ) {
		super ( props );
	}

	render() {
		const list = STEPS_CONTENT.map((item,index) =>
			<Step
				key={index}
				active={index === 0}>
				<StepItem />
				{item}
				<div
					onClick={this.props.showCallback}
					className="btn btn_red">
					Получить стоимость лечения
				</div>
			</Step>
		);

		return (
			<Steps>
				<Left>
					<Title>Как это работает?</Title>
					<List>
						{list}
					</List>
				</Left>

				<Right>
					<Callback
						params={{}}
						onChange={this.props.changeCountry}
						submit={this.props.callback}
						{...this.props} />
				</Right>
			</Steps>
		);
	}
}

StepsClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
};

