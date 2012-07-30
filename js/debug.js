function mouseMove(ev) 
{ 
	ev= ev || window.event; 
	var mousePos = mouseCoords(ev); 
	document.getElementById("y-coord").value = mousePos.x-146; 
	document.getElementById("x-coord").value = mousePos.y-77; 
} 
function mouseCoords(ev) 
{ 
	if(ev.pageX || ev.pageY){ 
		return {x:ev.pageX, y:ev.pageY}; 
	} 
	return { 
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
		y:ev.clientY + document.body.scrollTop - document.body.clientTop 
	}; 
} 
document.onmousemove = mouseMove; 
