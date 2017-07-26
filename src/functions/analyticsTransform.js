import cx from 'classnames'

const NAMES = {
	mouse: ["onClick", "onMouseEnter", "onMouseLeave"],
	clipboard: ["onCopy", "onPaste"]
};

export default (eventName, name = mouse)  => {
	return (oldProps) => {
		let obj = {};

		NAMES[name].forEach((value, key) => obj[key] = [key]())
		return {
			className: cx({
				[`${className}`]: className,
				[`${blockClassName}_${name}`]: name,
				[`${blockClassName}_${name}_${modifier}`]: name && modifier,
				['active']: active,
				['hidden']: hidden,
				['start']: start,
				['disabled']: disabled,
			}),
			...props
		}
	}
}
