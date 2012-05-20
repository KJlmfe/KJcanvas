Algorithm = function(size)
{
}
Algorithm.prototype.addAlgorithmControlBar = function(type,value)
{
	var element = document.createElement("input");
	element.setAttribute("type",type);
	element.setAttribute("value",value);
	element.setAttribute("class","controler");

	var father = document.getElementById("AlgorithmControlBar");
	
	father.appendChild(element);
	return element;
}
