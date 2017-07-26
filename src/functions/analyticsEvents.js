const event = (name, id, eventName, body) => {
	const analytics = window.analytics;

	if (!analytics) return new Error("analytics is not defined");

	if (id) {
		analytics.track(`${name}:${id}@${eventName}`, body)
	}
	else {
		analytics.track(`${name}`, body)
	}
};

export default {
	click: (id, body) => event("mouse", id, "onclick", body),
	mouseover: (id, body) => event("mouse", id, "onmouseover", body),
	mouseout: (id, body) => event("mouse", id, "onmouseout", body),

	// Frame/Object Events
	pageshow: (body) => event("onpageshow", body),
	pagehide: (body) => event("onpagehide", body),

	// Form Events
	reset: (id, body) => event("form", id, "onreset’", body),
	select: (id, body) => event("form", id, "onselect’", body),
	submit: (id, body) => event("form", id, "onsubmit’", body),

	//Clipboard Events
	copy: (id, body) => event("clipboard", id, "oncopy", body),
	paste: (id, body) => event("clipboard", id, "onpaste", body)
}