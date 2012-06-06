function init()
{
	Canvas = new KJcanvas();  //用上面的canvas初始化一个全局画板对象(Canvas)
	
	DataStructure = new Stack(); 		   //初始化一个数据结构对象
	DataStructure.addControls(DataStructure);  //给该数据结构演示动画添加用户界面控制器
}

Stack = function(size)
{}

Stack.ALGORITHM_NAME = "堆栈(数组)"; //算法名	
Stack.SIZE = 7; //默认堆栈的大小
Stack.OVERFLOW_INFO = "堆栈吃饱了,再压栈,堆栈会撑死的！";
Stack.EMPTY_INFO = "堆栈里空空如也了,弹不出东西了！";

Stack.FRAME_WIDTH = 60;
Stack.FRAME_HEIGHT = 60;
Stack.FRAME_START_X = 500;
Stack.FRAME_START_Y = 500;
Stack.FRAME_TEXT = "";
Stack.FRAME_BACKCOLOR = "FFF";
Stack.FRAME_EDGECOLOR = "000";

Stack.SHAPE_BACKCOLOR = "ABC";  //默认图形填充背景色
Stack.SHAPE_EDGECOLOR = "000";  //默认图形边框颜色
Stack.SHAPE_TEXTCOLOR = "C00";  //默认图形填充文本颜色
Stack.SHAPE_TEXT = "shape";    //默认图新填充的文本内容
Stack.SHAPE_WIDTH = 40;       //默认图形宽度
Stack.SHAPE_HEIGHT = 40;      //默认图形高度
Stack.SHAPE_START_X = 0;           //默认图新位置
Stack.SHAPE_START_Y = 0;

Stack.POINTER_FONT = "20px sans-serif";
Stack.POINTER_MOVE_SPEED = 2;
Stack.POINTER_START_X = Stack.FRAME_START_X + Stack.FRAME_WIDTH+100;
Stack.POINTER_START_Y = Stack.FRAME_START_Y + Stack.FRAME_HEIGHT;
Stack.POINTER_COLOR = "000";

Stack.LINE_START_X = Stack.FRAME_START_X + Stack.FRAME_WIDTH/2 + 20;
Stack.LINE_START_Y = Stack.FRAME_START_Y + Stack.FRAME_HEIGHT;
Stack.LINE_END_X = Stack.POINTER_START_X - 45; 
Stack.LINE_END_Y = Stack.FRAME_START_Y + Stack.FRAME_HEIGHT;
Stack.LINE_COLOR = "F00";

Stack.prototype = new Algorithm();
Stack.prototype.create = function(stackSize)  //初始化堆栈大小,并绘制该堆栈
{
	this.disableControlBar();
	this.stack = new Array();  
	this.frame = new Array();
	this.pointer = new Label
	({
		Canvas : Canvas,
		text : "top = -1",
		textColor : Stack.POINTER_COLOR,
		font : Stack.POINTER_FONT
	});
	this.line = new Line
	({
		Canvas : Canvas,
		lineColor : Stack.LINE_COLOR
	});
	this.size = Stack.SIZE;
	if(Positive_Integer.test(stackSize))
		this.size = stackSize;
	this.top = 0;
	
	Canvas.init();
	Canvas.cmd("Setup");
	Canvas.cmd
	(
		"Draw", this.pointer,
		{
			x : Stack.POINTER_START_X,
			y : Stack.POINTER_START_Y
		},
		"Draw", this.line,
		{
			start_x : Stack.LINE_START_X,
			start_y : Stack.LINE_START_Y,
			end_x : Stack.LINE_END_X,
			end_y : Stack.LINE_END_Y	
		}
	);
	Canvas.cmd("StartParallel");
	for(var i=0; i<this.size; i++)
	{
		this.frame[i] = new Rectangle
		({
			Canvas : Canvas,
			width : Stack.FRAME_WIDTH,
			height : Stack.FRAME_HEIGHT,
			text : i,
			backColor : Stack.FRAME_BACKCOLOR,
			edgeColor : Stack.FRAME_EDGECOLOR
		});
		Canvas.cmd
		(
			"Draw", this.frame[i],
			{
				x : Stack.FRAME_START_X,
				y : Stack.FRAME_START_Y-i*Stack.FRAME_HEIGHT,
			}
		);
	}
	Canvas.cmd("EndParallel");
	Canvas.cmd("Other",function()
	{
		$(".controler").removeAttr("disabled");		//启用所有控制元素
	});
	Canvas.cmd("End");
}
Stack.prototype.push = function( value )
{
	if(this.top >= this.size)
		alert(Stack.OVERFLOW_INFO);
	else
	{
		this.disableControlBar();
	
		this.stack[this.top] = new Rectangle
		({
			Canvas : Canvas,
			width : Stack.SHAPE_WIDTH,
			height : Stack.SHAPE_HEIGHT,
			text : value,
		});
		Canvas.cmd("Setup");
		Canvas.cmd
		(
			"FadeIn", this.stack[this.top],
			{
				x : Stack.SHAPE_START_X,
				y : Stack.SHAPE_START_Y,
			}
		);
		Canvas.cmd("Delay");
		Canvas.cmd
		(
			"Move", this.stack[this.top],
			{
				aim_x : this.frame[this.top].x,
				aim_y : this.frame[this.top].y,
			},
			"Move", this.pointer,
			{
				text : "top = " + this.top,
				aim_x : this.pointer.x,
				aim_y : this.pointer.y - Stack.FRAME_HEIGHT,
				moveSpeed : Stack.POINTER_MOVE_SPEED
			},
			"Move",this.line,
			{
				aimStart_x : this.line.start_x, 
				aimStart_y : this.line.start_y - Stack.FRAME_HEIGHT, 
				aimEnd_x : this.line.end_x, 
				aimEnd_y : this.line.end_y - Stack.FRAME_HEIGHT, 
				moveSpeed : Stack.POINTER_MOVE_SPEED
			}
		);
		Canvas.cmd("Other",function()
		{
			$(".controler").removeAttr("disabled");		//启用所有控制元素
		});
	    Canvas.cmd("End");
		this.top++;
	}
}
Stack.prototype.pop = function()
{
	if(this.top <= 0)
		alert(Stack.EMPTY_INFO);
	else
	{
		this.disableControlBar();
	 	this.top--;
		Canvas.cmd("Setup");
	   	Canvas.cmd
		(
			"Move", this.stack[this.top],
			{
				aim_x : Stack.SHAPE_START_X,
				aim_y : Stack.SHAPE_START_Y,
			},
			"Move", this.pointer,
			{
				text : "top = " + (this.top - 1),
				aim_x : this.pointer.x,
				aim_y : this.pointer.y + Stack.FRAME_HEIGHT,
				moveSpeed : Stack.POINTER_MOVE_SPEED
			},
			"Move", this.line,
			{
				aimStart_x : this.line.start_x, 
				aimStart_y : this.line.start_y + Stack.FRAME_HEIGHT, 
				aimEnd_x : this.line.end_x, 
				aimEnd_y : this.line.end_y + Stack.FRAME_HEIGHT, 
				moveSpeed : Stack.POINTER_MOVE_SPEED
			}
		);
		Canvas.cmd("Delay");
		Canvas.cmd("FadeOut", this.stack[this.top]);
		Canvas.cmd("Other",function()
		{
			$(".controler").removeAttr("disabled");		//启用所有控制元素
		});
		Canvas.cmd("END");	
	}
}
Stack.prototype.addControls = function(obj)
{
	$("#AlgorithmName").html(Stack.ALGORITHM_NAME);
	this.TextInput = this.addControlBar("text","");
	this.CreatStackButton = this.addControlBar("button","Creat Stack");
	this.CreatStackButton.onclick = function(){
		var stackSize = obj.TextInput.value;
		obj.create(stackSize);
		obj.TextInput.value = "";
	}

	this.PushButton = this.addControlBar("button","Push");
	this.PushButton.onclick = function(){
		var value = obj.TextInput.value;
		obj.push(value);	
		obj.TextInput.value = "";
	}

	this.PopButton = this.addControlBar("button","Pop");
	this.PopButton.onclick = function(){
		obj.pop();
	}

	this.PushButton.disabled = true;
	this.PopButton.disabled = true;
}
