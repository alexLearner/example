import React from "react"
import { FormattedMessage } from 'react-intl';

export default ({close}) => (
	<div onClick={close} className="popup_close_white filters_close">
		<div/>
		<div>
			<FormattedMessage
				id="popup.close"
				defaultMessage="Закрыть"
			/>
			<div className="popup_close_icon"><i className="icon icon_close" /></div>
		</div>
	</div>
)			