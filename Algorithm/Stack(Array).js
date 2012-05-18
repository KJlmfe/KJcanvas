var Positive_Integer = /^[0-9]*[1-9][0-9]*$/;
var CANVAS_WIDTH = 1000;  //默认画板宽度
var CANVAS_HEIGHT = 550;  //默认画板高度
var DELAY_TIME = 600; //默认延迟时间
var REFRESH_TIME = 24; //默认画面刷新时间
var MAX_ANIMATE_SPEED = 5;  //最大动画速度

function init()
{
	var ArrayStack = new Stack();
	ArrayStack.addControls(ArrayStack);

	var Mycanvas= document.getElementById("canvas");
	canvas = new canvas(Mycanvas);
}

Stack = function(size)
{

}
Stack.FRAME_WIDTH = 60;
Stack.FRAME_HEIGHT = 60;
Stack.FRAME_START_X = (CANVAS_WIDTH-Stack.FRAME_WIDTH)/2;
Stack.FRAME_START_Y = CANVAS_HEIGHT-Stack.FRAME_HEIGHT-10;
Stack.FRAME_TEXT = "";
Stack.FRAME_BACKCOLOR = "FFF";
Stack.FRAME_EDGECOLOR = "000";
Stack.SIZE = 7; //默认堆栈的大小
Stack.ALGORITHM_NAME = "堆栈(数组)"; //算法名	

Stack.SHAPE_BACKCOLOR = "ABC";  //默认图形填充背景色
Stack.SHAPE_EDGECOLOR = "000";  //默认图形边框颜色
Stack.SHAPE_TEXTCOLOR = "C00";  //默认图形填充文本颜色
Stack.SHAPE_TEXT = "shape";    //默认图新填充的文本内容
Stack.SHAPE_WIDTH = 40;       //默认图形宽度
Stack.SHAPE_HEIGHT = 40;      //默认图形高度
Stack.SHAPE_START_X = 0;           //默认图新位置
Stack.SHAPE_START_Y = 0;
Stack.SHAPE_MOVE_SPEED = 5;  //默认图新移动速度
Stack.SHAPE_MOVE_PATH = "LINE"; //默认图新移动方式(直线)
Stack.OVERFLOW_INFO = "堆栈吃饱了,再压栈,堆栈会撑死的！";
Stack.EMPTY_INFO = "堆栈里空空如也了,弹不出东西了！";

Stack.prototype.create = function(stackSize)
{
	this.stack = new Array();
	this.frame = new Array();
	this.size = Stack.SIZE;
	this.top = 0;
	if(Positive_Integer.test(stackSize))
		this.size = stackSize;
	
	canvas.del();
	canvas.clear();
	canvas.cmd("Setup");
	
	for(i=0; i<this.size; i++)
	{
		this.frame[i] = new Rectangle(
			Stack.FRAME_WIDTH, Stack.FRAME_HEIGHT, 
			Stack.FRAME_TEXT, 
			Stack.FRAME_BACKCOLOR, Stack.FRAME_EDGECOLOR
			); 
		canvas.cmd("Draw",this.frame[i], Stack.FRAME_START_X, Stack.FRAME_START_Y-i*Stack.FRAME_HEIGHT);
	}
}
Stack.prototype.push = function( value )
{
	if(this.top >= this.size)
		alert(Stack.OVERFLOW_INFO);
	else
	{
		$(".controler").attr("disabled","disabled");  //禁用所有控制元素
	
		this.stack[this.top] = new Rectangle(
			Stack.SHAPE_WIDTH, Stack.SHAPE_HEIGHT,
			value,
			Stack.SHAPE_BACKCOLOR, Stack.SHAPE_EDGECOLOR
			);

		canvas.cmd("Setup");	
 		canvas.cmd("Draw",this.stack[this.top],Stack.SHAPE_START_X,Stack.SHAPE_START_Y);
 		canvas.cmd("Delay",DELAY_TIME);

 		waitTime = canvas.cmd(
			"Move", this.stack[this.top],
			this.frame[this.top].x+(Stack.FRAME_WIDTH-Stack.SHAPE_WIDTH)/2,
			this.frame[this.top].y+(Stack.FRAME_HEIGHT-Stack.SHAPE_HEIGHT)/2,
			Stack.SHAPE_MOVE_SPEED
			);

		var me = this; 
		setTimeout(function(){
			me.top++
			$(".controler").removeAttr("disabled");
		},waitTime);	
	}
}
Stack.prototype.pop = function()
{
	if(this.top <= 0)
		alert(Stack.EMPTY_INFO);
	else
	{
		$(".controler").attr("disabled","disabled");
	
	 	this.top--;

		canvas.cmd("Setup");
	   	canvas.cmd("Move",this.stack[this.top],Stack.SHAPE_START_X,Stack.SHAPE_START_Y,Stack.SHAPE_MOVE_SPEED);
		canvas.cmd("Delay",DELAY_TIME);
	
		waitTime = canvas.cmd("Delete",this.stack[this.top]);
	
		var me = this;	
		setTimeout(function(){
			$(".controler").removeAttr("disabled");
		/*	if(me.top <= 0)
				me.PopButton.disabled = true;*/
		},waitTime);		
	}
}
Stack.prototype.addControls = function(obj)
{
	$("#AlgorithmName").html(Stack.ALGORITHM_NAME);
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
