export default function (name, cookie) {
	let arr = cookie.split(";");
	let auth = arr.filter((item) => {
		if (~item.indexOf(`${name}`)) {
			return true
		}
		return false
	}).pop();

	if (auth) {
		auth = auth.replace(`${name}=`, "");
	}
	return auth;
}