export default function removeClass(elements, className) {
	for (var i = 0; i < elements.length; i++) {
		elements[i].classList.remove(className);
	}
}