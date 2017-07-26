import cx from 'classnames'

export default (blockClassName) => {
	return (oldProps) => {
		const { modifier, name, active, hidden, disabled, className, start, ...props } = oldProps;
		
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
