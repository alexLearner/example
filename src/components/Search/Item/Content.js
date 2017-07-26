import React, {PureComponent} from 'react';
import cx from 'classnames';
import content_triangle from '../../../assets-front/img/icons/content_triangle.svg';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

export default class SearchItemContent extends PureComponent {
	render() {
		const
			{
				toggleContent,
				active_content,
				texts: {brief_txt, brief_title},
			} = this.props;

		return (
			<div className="search_item_content">
				{
					brief_title ? (
						<div
							onClick={toggleContent}
							className={cx(
								'block_info block_info_search block_info_big', 
								{"active": active_content}
							)}
							>

							{brief_title}
							<img className="mobile icon" src={content_triangle} alt="" />
						</div>
					) : null
				}

				<div className="search_content" dangerouslySetInnerHTML={{__html: brief_txt}} />
			</div>
		)
	}
}

SearchItemContent.contextTypes = {f: React.PropTypes.func};


