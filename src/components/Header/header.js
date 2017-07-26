import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import Nav from "./Nav"
import { FormattedMessage, injectIntl } from 'react-intl';
import {SVG} from "../UI"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../actions/'
import cx from "classnames"
import analyticsEvents from "../../functions/analyticsEvents"
import HeaderSearch from "./HeaderSearch"
import isEqual from "lodash/isEqual"

class Header extends PureComponent {
	constructor( props ) {
		super( props );

		this.callback = this.callback.bind(this);
	}

	shouldComponentUpdate({wrapperClassName, headerSearch, layout: {visiblePhone, deepDirections, current_country}}) {
		return wrapperClassName !== this.props.wrapperClassName
					 || visiblePhone !== this.props.layout.visiblePhone
					 || !isEqual(current_country, this.props.layout.current_country)
					 || !isEqual(headerSearch, this.props.headerSearch)
					 || !isEqual(deepDirections, this.props.layout.deepDirections)
	}

	callback() {
		ga('send', 'event', 'Form',  'Button pressed', window.location.pathname);
		this.props.actions.showPopup("callback");
	}

	render() {
		const
			{home} = this.context.pathnames,
			{current_phone, visiblePhone} = this.props.layout,
			className = this.props.wrapperClassName || "",
			phone = current_phone && current_phone[0] || "",
			tel = phone.replace(/[)(-]/g, ""),
			telVisibled = phone
				.replace("(", " (")
				.replace(")", ") " );

		return (
			<header id="header" className={className}>
				<div className="block">
					<div
						id="logo">
						<Link
							to={"/" + home}
							className="icon"
							dangerouslySetInnerHTML={{
								__html: SVG.logo
							}}
						/>
					</div>

					<Nav {...this.props} />

					<div id="header_control">

						<HeaderSearch
							data={this.props.headerSearch.data}
							actions={this.props.actions} />

						<div
							className={cx("header_control_phone", {["visibled"]: visiblePhone})}>
							<a href={`tel:${tel}`}>
								{telVisibled}
							</a>
							<FormattedMessage
								id="or"
								defaultMessage="или" />
							<div
								className="header_control_phone_link"
								onTouchStart={this.callback}
								onClick={this.callback}>
								<FormattedMessage
									id="footer.callback"
									defaultMessage="Перезвоните мне" />
							</div>
						</div>

						<div
							onClick={() => this.props.actions.showPopup("callback")}
							className="btn btn_white">

							<div
								className="icon icon_phone"
								dangerouslySetInnerHTML={{
									__html: SVG.phone
								}}
							/>

							<FormattedMessage
								id="footer.callback"
								defaultMessage="Перезвоните мне" />
						</div>

					</div>
				</div>
			</header>
		)
	}
}

export default connect(
	state => ({
		headerSearch: state.search.headerSearch,
		layout: state.layout,
		wrapperClassName: state.layout.wrapper.header,
		routing: state.routing
	}),
	dispatch => ({
		actions: bindActionCreators({
			...actions.search,
			...actions.popup,
		}, dispatch)
	})
)(Header);

Header.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};