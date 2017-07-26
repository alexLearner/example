export default function validateForm(form) {
	let result = true;
	let focus = true;

	form.inputs.map((input,index) => {
		if (!input.isValid()) {
			input.addError();
			if (focus)  {
				input.focus();
				focus = false;
			}
			result = false;
		}
		else {
			input.removeError();
		}
	})

	return result;
}