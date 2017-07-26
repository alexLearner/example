import React, {PureComponent} from 'react';
import {Link} from "react-router"
import cx from "classnames"
import { FormattedMessage } from 'react-intl';

export default ({data, fetched, route, title, param = "country", search = "", endSearch = "", pathname, column = false}) => (
	data && data.length && fetched
		? <div
				className={
					cx(
						"content countries_container content_container",
						{"content_column": column}
					)
				}
				>
				<div className="countries_title content_title">
					{
						title
							? title
							: <FormattedMessage
									defaultMessage="Чаще всего пациенты выбирают:"
									id="search.countries.default" />
					}
				</div>
				<div className="countries_content content_block">
					{
						data.map((item, index) =>
							item.clinics_count
								? <span key={index}>
										<Link
											key={index}
											to={
												pathname
													? `${pathname}${param}=${item.alias}/` + endSearch
													: `/${route}/${search}${param}=${item.alias}/`+ endSearch
											}
											className="link">
											{item.name}
										</Link>
										<span className="gray">
											{
												item.clinics_count ? (
													" (" + item.clinics_count +
													(data.length - 1 !== index ? "), " : ")")
												) : data.length - 1 !== index ? ", " : ""
											}
										</span>
									</span>
								: null
						)
					}
				</div>
			</div>
		: null
)