var ALGORITHM_NAME = "堆栈(数组)"; //算法名	

var SHAPE_BACKCOLOR = "ABC";  //默认图形填充背景色
var SHAPE_EDGECOLOR = "000";  //默认图形边框颜色
var SHAPE_TEXTCOLOR = "C00";  //默认图形填充文本颜色
var SHAPE_TEXT = "shape";    //默认图新填充的文本内容
var SHAPE_WIDTH = 40;       //默认图形宽度
var SHAPE_HEIGHT = 40;      //默认图形高度
var SHAPE_START_X = 0;           //默认图新位置
var SHAPE_START_Y = 0;
var SHAPE_END_X = 500;      //默认图新移动目标位置
var SHAPE_END_Y = 500;
var SHAPE_MOVE_SPEED = 5;  //默认图新移动速度
var SHAPE_MOVE_PATH = "LINE"; //默认图新移动方式(直线)
var REFRESH_TIME = 24; //默认画面刷新时间

var MAX_ANIMATE_SPEED = 5;  //最大动画速度
var CANVAS_WIDTH = 1000;  //默认画板宽度
var CANVAS_HEIGHT = 550;  //默认画板高度
var DELAY_TIME = 600; //默认延迟时间

function init()
{
	var SimpleStack = new Stack();
	SimpleStack.addControls(SimpleStack);

	var Mycanvas= document.getElementById("canvas");
	canvas = new canvas(Mycanvas);
}

Stack = function(size)
{

}
Stack.prototype.create = function(stackSize)
{
	this.stack = new Array();
	this.size = 10;
	this.top = 0;
	if(stackSize)
		this.size = stackSize;
}
Stack.prototype.addControls = function(obj)
{
	$("#AlgorithmName").html(ALGORITHM_NAME);
	this.TextInput = addAlgorithmControlBar("text","");
	this.CreatStackButton = addAlgorithmControlBar("button","Creat Stack");
	this.CreatStackButton.onclick = function(){
		var stackSize = obj.TextInput.value;
		obj.create(stackSize);
		obj.TextInput.value = "";
		obj.PushButton.disabled = false;
	}

	this.PushButton = addAlgorithmControlBar("button","Push");
	this.PushButton.onclick = function(){
		var value = obj.TextInput.value;
		obj.push(value);	
		obj.TextInput.value = "";
	}

	this.PopButton = addAlgorithmControlBar("button","Pop");
	this.PopButton.onclick = function(){
		obj.pop();
	}

	this.PushButton.disabled = true;
	this.PopButton.disabled = true;
}
Stack.prototype.push = function( value )
{
	this.stack[this.top] = new Rectangle(SHAPE_WIDTH,SHAPE_HEIGHT,SHAPE_START_X,SHAPE_START_Y,value);
	$(".controler").attr("disabled","disabled");
	canvas.cmd("Setup");	
 	canvas.cmd("Draw",this.stack[this.top],SHAPE_START_X,SHAPE_START_Y);
 	canvas.cmd("Delay",DELAY_TIME);

	if(this.top == 0)
 		waitTime = canvas.cmd("Move",this.stack[this.top],SHAPE_END_X,SHAPE_END_Y,SHAPE_MOVE_SPEED);
 	else
 		waitTime = canvas.cmd("Move",this.stack[this.top],this.stack[this.top-1].x,this.stack[this.top-1].y-SHAPE_WIDTH,SHAPE_MOVE_SPEED);
	var me = this; 
	setTimeout(function(){
		me.top++
		$(".controler").removeAttr("disabled");
	},waitTime);		
}
Stack.prototype.pop = function()
{
	var me = this;
 	this.top--;
	$(".controler").attr("disabled","disabled");

	canvas.cmd("Setup");
    canvas.cmd("Move",this.stack[this.top],SHAPE_START_X,SHAPE_START_Y,SHAPE_MOVE_SPEED);
	canvas.cmd("Delay",DELAY_TIME);
	waitTime = canvas.cmd("Delete",this.stack[this.top]);
	setTimeout(function(){
		$(".controler").removeAttr("disabled");
		if(me.top <= 0)
			me.PopButton.disabled = true;
	},waitTime);		
}
function addAlgorithmControlBar(type,value)
{
	var element = document.createElement("input");
	element.setAttribute("type",type);
	element.setAttribute("value",value);
	element.setAttribute("class","controler");

	var father = document.getElementById("AlgorithmControlBar");
	
	father.appendChild(element);
	return element;
}
