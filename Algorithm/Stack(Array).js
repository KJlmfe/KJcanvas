function init()
{
	var Data_Structure = new Stack();  //初始化一个堆栈对象
	Data_Structure.addControls(Data_Structure);  //添加堆栈用户控制器

	var Mycanvas = document.getElementsByTagName("canvas")[0]; //初始化canvas对象
	Data_Structure.canvas = new Canvas(Mycanvas);  //将该canvas对象绑定到该堆栈上
}

Stack = function(size)
{}

Stack.ALGORITHM_NAME = "堆栈(数组)"; //算法名	
Stack.SIZE = 7; //默认堆栈的大小
Stack.OVERFLOW_INFO = "堆栈吃饱了,再压栈,堆栈会撑死的！";
Stack.EMPTY_INFO = "堆栈里空空如也了,弹不出东西了！";

Stack.FRAME_WIDTH = 60;
Stack.FRAME_HEIGHT = 60;
Stack.FRAME_START_X = (Canvas.WIDTH-Stack.FRAME_WIDTH)/2;
Stack.FRAME_START_Y = Canvas.HEIGHT-Stack.FRAME_HEIGHT-10;
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
Stack.SHAPE_MOVE_SPEED = 5;  //默认图新移动速度
Stack.SHAPE_MOVE_PATH = "LINE"; //默认图新移动方式(直线)
Stack.SHAPE_FONT = "10px sans-serif";

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
	this.stack = new Array();  
	this.frame = new Array();
	this.pointer = new Label({
		canvas : this.canvas,
		text : "top = -1",
		textColor : Stack.POINTER_COLOR,
		font : Stack.POINTER_FONT
		});
	this.line = new Line({
		canvas : this.canvas,
		lineColor : Stack.LINE_COLOR
	});

	this.size = Stack.SIZE;
	if(Positive_Integer.test(stackSize))
		this.size = stackSize;
	this.top = 0;
	
	this.canvas.del();
	this.canvas.clear();
	this.canvas.cmd("Setup");
	this.canvas.cmd(
		"Draw",this.pointer,{
		x : Stack.POINTER_START_X,
		y : Stack.POINTER_START_Y
		},
		
		"Draw",this.line,{
		start_x : Stack.LINE_START_X,
		start_y : Stack.LINE_START_Y,
		end_x : Stack.LINE_END_X,
		end_y : Stack.LINE_END_Y	
		});
	for(var i=0; i<this.size; i++)
	{
		this.frame[i] = new Rectangle({
			canvas : this.canvas,
			w : Stack.FRAME_WIDTH,
			h : Stack.FRAME_HEIGHT,
			text : i,
			backColor : Stack.FRAME_BACKCOLOR,
			edgeColor : Stack.FRAME_EDGECOLOR
			});
		this.canvas.cmd(
			"Draw", this.frame[i],{
			x : Stack.FRAME_START_X,
			y : Stack.FRAME_START_Y-i*Stack.FRAME_HEIGHT
			});
	}
	this.canvas.cmd("END");
}
Stack.prototype.push = function( value )
{
	if(this.top >= this.size)
		alert(Stack.OVERFLOW_INFO);
	else
	{
		$(".controler").attr("disabled","disabled");  //禁用所有控制元素
	
		this.stack[this.top] = new Rectangle({
			canvas : this.canvas,
			w : Stack.SHAPE_WIDTH,
			h : Stack.SHAPE_HEIGHT,
			text : value,
			backColor : Stack.SHAPE_BACKCOLOR, 
			edgeColor : Stack.SHAPE_EDGECOLOR, 
			textColor : Stack.SHAPE_TEXTCOLOR,
			font : Stack.SHAPE_FONT,
		});
		
		this.canvas.cmd("Setup");
		this.canvas.cmd(
			"Draw",this.stack[this.top],{
			x : Stack.SHAPE_START_X,
			y : Stack.SHAPE_START_Y
		});
		this.canvas.cmd("Delay",Canvas.DELAY_TIME);
		this.canvas.cmd("StartParallel");
		this.canvas.cmd(
			"Move", this.stack[this.top],{
			aim_x : this.frame[this.top].x,
			aim_y : this.frame[this.top].y,
			move_speed : Stack.SHAPE_MOVE_SPEED
			});
		this.canvas.cmd(
			"Move",this.pointer,{
			text : "top = " + this.top,
			aim_x : this.pointer.x,
			aim_y : this.pointer.y - Stack.FRAME_HEIGHT,
			move_speed : Stack.POINTER_MOVE_SPEED
			});
		this.canvas.cmd(
			"Move",this.line,{
			aim_x : this.line.start_x, 
			aim_y : this.line.start_y - Stack.FRAME_HEIGHT, 
			move_speed : Stack.POINTER_MOVE_SPEED
			});
		this.canvas.cmd("EndParallel");
		/*
 		this.canvas.cmd(
			"Move", this.stack[this.top],{
			aim_x : this.frame[this.top].x,
			aim_y : this.frame[this.top].y,
			move_speed : Stack.SHAPE_MOVE_SPEED
			},
			"Move",this.pointer,{
			text : "top = " + this.top,
			aim_x : this.pointer.x,
			aim_y : this.pointer.y - Stack.FRAME_HEIGHT,
			move_speed : Stack.POINTER_MOVE_SPEED
			},
			"Move",this.line,{
			aim_x : this.line.start_x, 
			aim_y : this.line.start_y - Stack.FRAME_HEIGHT, 
			move_speed : Stack.POINTER_MOVE_SPEED
			});
		*/
		var waitTime = this.canvas.cmd("END");
	
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

		this.canvas.cmd("Setup");
	   	this.canvas.cmd(
			"Move",this.stack[this.top],{
			aim_x : Stack.SHAPE_START_X,
			aim_y : Stack.SHAPE_START_Y,
			move_speed : Stack.SHAPE_MOVE_SPEED
			},

			"Move",this.pointer,{
			text : "top = " + (this.top - 1),
			aim_x : this.pointer.x,
			aim_y : this.pointer.y + Stack.FRAME_HEIGHT,
			move_speed : Stack.POINTER_MOVE_SPEED
			},
			
			"Move",this.line,{
			aim_x : this.line.start_x, 
			aim_y : this.line.start_y + Stack.FRAME_HEIGHT, 
			move_speed : Stack.POINTER_MOVE_SPEED
			});
		this.canvas.cmd("Delay",Canvas.DELAY_TIME);
		this.canvas.cmd("Delete",this.stack[this.top]);
		var waitTime = this.canvas.cmd("END");	
		
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
	this.TextInput = this.addAlgorithmControlBar("text","");
	this.CreatStackButton = this.addAlgorithmControlBar("button","Creat Stack");
	this.CreatStackButton.onclick = function(){
		var stackSize = obj.TextInput.value;
		obj.create(stackSize);
		obj.TextInput.value = "";
		obj.PushButton.disabled = false;
	}

	this.PushButton = this.addAlgorithmControlBar("button","Push");
	this.PushButton.onclick = function(){
		var value = obj.TextInput.value;
		obj.push(value);	
		obj.TextInput.value = "";
	}

	this.PopButton = this.addAlgorithmControlBar("button","Pop");
	this.PopButton.onclick = function(){
		obj.pop();
	}

	this.PushButton.disabled = true;
	this.PopButton.disabled = true;
}
