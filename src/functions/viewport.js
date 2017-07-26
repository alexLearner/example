import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

const 
		MOBILE = 764,
		MOBILE_SM = 720,
		TABLET = 1160,
		TABLET_SM = 960;

let 
		isMobile = false,
		isMobileSm = false,
		isTablet = false,
		isTabletSm = false;

if (canUseDOM) {
	const width = document.body.offsetWidth;

	if (width < MOBILE) {
		isMobile = true;
	}

	if (width < MOBILE_SM) {
		isMobileSm = true;
	}

	if (width < TABLET) {
		isTablet = true;
	}

	if (width < TABLET_SM) {
		isTabletSm = true;
	}
}	

export {isMobile, isMobileSm, isTablet, isTabletSm}