Algorithm = function(size)
{
}
Algorithm.prototype.addControlBar = function(type,value)
{
	var element = document.createElement("input");
	element.setAttribute("type",type);
	element.setAttribute("value",value);
	element.setAttribute("class","controler");

	var father = document.getElementById("AlgorithmControlBar");
	
	father.appendChild(element);
	return element;
}
Algorithm.prototype.disableControlBar = function()
{
	$(".controler").attr("disabled","disabled");  //禁用所有控制元素
}
Algorithm.prototype.enableControlBar = function()
{
	$(".controler").removeAttr("disabled");		//启用所有控制元素
}
