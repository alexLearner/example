import React, {PureComponent} from 'react';
import {defineMessages} from 'react-intl';

const msg = defineMessages({
	procedures: {
		id : "popup.procedures",
		defaultMessage: "Процедуры"
	},
	show_procedurec: {
		id : "popup.show_procedurec",
		defaultMessage: "Показать все процедуры"
	},
	diagnostics: {
		id : "popup.diagnostics",
		defaultMessage: "Диагностики"
	},
	cost: {
		id: "search.procedure.cost",
		defaultMessage: "Цена по запросу"
	},
	show_diagnostics: {
		id : "popup.show_diagnostics",
		defaultMessage: "Показать все диагностики"
	}
});

export default class SearchProcedures extends PureComponent {
	constructor( props ) {
		super ( props );
		
		this.max = 3;
		this.show = this.show.bind(this);
		this.showAll = this.showAll.bind(this);
	}

	show(e, id, type) {
		e.preventDefault();
		e.stopPropagation();

		this.props.actions.showProcedure(id, {
			type,
			current_clinic: this.props.id
		}, {type, clinic: this.props.id})
	}

	showAll(type) {
		const {id, filters} = this.props;

		let query = {
			clinic: id,
			type, 
			direction_on_top: filters.direction.id,
			illness_on_top: filters.illness ? filters.illness.id : undefined,
			procedure_on_top: filters.procedure.id,
		};

		this.props.actions.showProcedures(query, {clinic: id, type})
	}

	render() {
		const
			{f, pathnames: {s_host}} = this.context,
			p = this.props,
			{
				diagnostic_count,
				operation_count
			} = p;

		let operations = p.operations || [],
				diagnostics = p.diagnostics || [];

		operations = operations.length && operations.map((procedure, index) => {
			if (index >= this.max) return null;

			return (
				<a
					href={`${s_host}/clinics/procedure=${procedure.alias}/`}
					onClick={e => this.show(e, procedure.id, "operation")}
					className="search_procedures_item"
					key={index}>
					<p>{procedure.name}</p>
					{
						procedure.price && procedure.price.length > 1
							? <span>{procedure.price}</span>
							: <span>{f(msg.cost)}</span>
					}
				</a>
			)
		});

		diagnostics = diagnostics.length &&  diagnostics.map((procedure, index) => {
			if (index >= this.max) return null;

			return (
				<a
					href={`${s_host}/clinics/procedure=${procedure.alias}/`}
					onClick={e => this.show(e, procedure.id, "diagnostic")}
					className="search_procedures_item"
					key={index}>
					<p>{procedure.name}</p>
					{
						procedure.price && procedure.price.length > 1
							? <span>{procedure.price}</span>
							: <span>{f(msg.cost)}</span>
					}
				</a>
			)
		});

		return (
			<div className="search_procedures">
				{
					operation_count > 0 ? (
						<div 
							onClick={() => this.showAll("operation")} 
							className="search_procedure search_place noactive"
							>
							<div className="search_operations_title">
								{f(msg.procedures)}
								<span className="search_count">{operation_count}</span>
							</div>
							<div className="search_procedure_container">
								{operations}
							</div>

							<div className="search_place_btn" >
								{f(msg.show_procedurec)}
							</div>
						</div>
					) : null
				}

				{
					diagnostic_count > 0 ? (
						<div 
							onClick={() => this.showAll("diagnostic")} 
							className="search_procedure search_place noactive"
							>
							<div className="search_operations_title">
								{f(msg.diagnostics)}
								<span className="search_count">{diagnostic_count}</span>
							</div>
							<div className="search_procedure_container">
								{diagnostics}
							</div>

							<div className="search_place_btn">
								{f(msg.show_diagnostics)}
							</div>
						</div>
					): null
				}

			</div>
		) 
	}
};

SearchProcedures.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};