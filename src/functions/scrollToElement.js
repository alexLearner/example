function doScrolling(elementY, duration, elementScroll = window) {
  var startingY = window.pageYOffset;
  var diff = elementY;
  var start;

  window.requestAnimationFrame(function step(timestamp) {
    if (!start) start = timestamp;
    var time = timestamp - start;
    var percent = Math.min(time / duration, 1);

    if (elementScroll === window) {
	    elementScroll.scrollTo(0, startingY + diff * percent);
    }
    else {
	    elementScroll.scrollTop = (startingY + diff * percent);
    }

    if (time < duration) {
      window.requestAnimationFrame(step)
    }
  })
}

export default function(element, elementScroll) {
	if (element.constructor === Number) {
		return doScrolling(element, 300, elementScroll);
	}

  const   header = document.getElementById('header'),
          headerHeight = header.offsetHeight,
          e = document.getElementById(element.replace("#", ""));

  let navTop = 0;


  if (!e) return doScrolling(0, 300);

  navTop = e.getBoundingClientRect().top;

  doScrolling(navTop - 150, 300);
}

