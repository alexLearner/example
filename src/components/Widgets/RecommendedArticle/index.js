import React, {PureComponent} from 'react';
import { FormattedMessage } from 'react-intl';

const RecommendedArcticle = ({data, fetched, route}, {pathnames: {s_host}}) => (
	data && data.length && fetched
		? <div className="content content_container">
				<div className="content_title">
					<FormattedMessage
						id="recommended_article.title"
						defaultMessage="Рекомендованная статья: "
					/>
				</div>
				<div className="content_block">
					{
						data && data.map((item, index) =>
							<span key={index}>
								<a
									href={
										item.alias
											? s_host + `/article/${item.alias}/`
											: s_host + `${item.query}`
										}
									className="link">
									{item.title || item.name + " "}
								</a>
							</span>
						)
					}
				</div>
			</div>
		: null
);

RecommendedArcticle.contextTypes = {
	pathnames: React.PropTypes.object,
};

export default RecommendedArcticle;