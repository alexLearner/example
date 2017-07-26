export default function removeStyle(elements, style) {
	for (var i = 0; i < elements.length; i++) {
		elements[i].style[style] = "";
	}
}