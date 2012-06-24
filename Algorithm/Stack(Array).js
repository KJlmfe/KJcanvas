function init()
{
	Canvas = new KJcanvas(); 		 
	DataStructure = new Stack(); 		
}

Stack = function()
{
	Stack.ALGORITHM_NAME = "Stack(Array)"; 
	Stack.SIZE = 7; 
	Stack.OVERFLOW_INFO = "Stack is full,it will overflow if you push anymore!";
	Stack.EMPTY_INFO = "Stack is empty,it can't pop anymore!";

	Stack.FRAME_WIDTH = 50;
	Stack.FRAME_HEIGHT = 50;
	Stack.FRAME_X = Canvas.width/2;
	Stack.FRAME_Y = Canvas.height - Stack.FRAME_HEIGHT/2 - 2;
	Stack.FRAME_BACKCOLOR = "FFF";
	Stack.FRAME_EDGECOLOR = "000";
	Stack.FRAME_TEXTCOLOR = "#F00";
	Stack.FRAME_FONT = "18px sans-serif";
	Stack.FRAME_EDGEWIDTH = 2;

	Stack.SHAPE_WIDTH = 40;       
	Stack.SHAPE_HEIGHT = 40;      
	Stack.SHAPE_X = Stack.SHAPE_WIDTH/2 + 2;
	Stack.SHAPE_Y = Stack.SHAPE_HEIGHT/2 + 2;
	Stack.SHAPE_BACKCOLOR = "#00FF00";  
	Stack.SHAPE_EDGECOLOR = "#FF4500"; 
	Stack.SHAPE_TEXTCOLOR = "#0044BB";
	Stack.SHAPE_MOVESPEED = 6;
	Stack.SHAPE_FONT = "18px sans-serif";
	Stack.SHAPE_EDGEWIDTH = 1;

	Stack.POINTER_X = Stack.FRAME_X + Stack.FRAME_WIDTH + 100;
	Stack.POINTER_Y = Stack.FRAME_Y;
	Stack.POINTER_FONT = "20px sans-serif";
	Stack.POINTER_TEXTCOLOR = "000";
	Stack.POINTER_MOVESPEED = 2;

	Stack.LINE_START_X = Stack.FRAME_X + Stack.FRAME_WIDTH/2 + 20;
	Stack.LINE_START_Y = Stack.FRAME_Y;
	Stack.LINE_END_X = Stack.POINTER_X - 45; 
	Stack.LINE_END_Y = Stack.FRAME_Y;
	Stack.LINE_COLOR = "F00";
	Stack.LINE_LINEWIDTH = 2;
	Stack.LINE_MOVESPEED = 2;

	this.addControls(); 
	thisStack = this;
}
Stack.prototype = new Algorithm();
Stack.prototype.create = function(stackSize)  
{
	this.disableControlBar();
	this.stack = new Array();  
	this.frame = new Array();
	this.pointer = new Label
	({
		Canvas : Canvas,
		text : "top = 0",
		x : Stack.POINTER_X,
		y : Stack.POINTER_Y,
		font : Stack.POINTER_FONT,
		textColor : Stack.POINTER_TEXTCOLOR,
		moveSpeed : Stack.POINTER_MOVESPEED = 2
	});
	this.line = new Line
	({
		Canvas : Canvas,
		start_x : Stack.LINE_START_X,
		start_y : Stack.LINE_START_Y,
		end_x : Stack.LINE_END_X,
		end_y : Stack.LINE_END_Y,	
		lineColor : Stack.LINE_COLOR,
		lineWidth : Stack.LINE_LINEWIDTH,
		moveSpeed : Stack.LINE_MOVESPEED
	});
	this.size = Stack.SIZE;
	if(Positive_Integer.test(stackSize))
		this.size = stackSize;
	this.top = 0;
	
	Canvas.init();
	Canvas.cmd("Setup");
	Canvas.cmd("StartParallel");
	Canvas.cmd
	(
		"Draw", this.pointer,
		"Draw", this.line
	);
	for(var i=0; i<this.size; i++)
	{
		this.frame[i] = new Rectangle
		({
			Canvas : Canvas,
			text : i,
			width : Stack.FRAME_WIDTH,
			height : Stack.FRAME_HEIGHT,
			x : Stack.FRAME_X,
			y : Stack.FRAME_Y-i*Stack.FRAME_HEIGHT,
			backColor : Stack.FRAME_BACKCOLOR,
			edgeColor : Stack.FRAME_EDGECOLOR,
			textColor : Stack.FRAME_TEXTCOLOR,
			font : Stack.FRAME_FONT,
			edgeWidth : Stack.FRAME_EDGEWIDTH
		});
		Canvas.cmd("Draw", this.frame[i]);
	}
	Canvas.cmd("EndParallel");
	Canvas.cmd("Other", function()
	{
		thisStack.enableControlBar();
	});
	Canvas.cmd("End");
}
Stack.prototype.push = function(value)
{
	if(this.top >= this.size)
		alert(Stack.OVERFLOW_INFO);
	else
	{
		this.disableControlBar();
		this.stack[this.top] = new Rectangle
		({
			Canvas : Canvas,
			text : value,
			width : Stack.SHAPE_WIDTH,
			height : Stack.SHAPE_HEIGHT,
			x : Stack.SHAPE_X,
			y : Stack.SHAPE_Y,
			backColor : Stack.SHAPE_BACKCOLOR,
			edgeColor : Stack.SHAPE_EDGECOLOR,
			textColor : Stack.SHAPE_TEXTCOLOR,
			moveSpeed : Stack.SHAPE_MOVESPEED,
			font : Stack.SHAPE_FONT,
			edgeWidth : Stack.SHAPE_EDGEWIDTH
		});
		Canvas.cmd("Setup");
		Canvas.cmd("FadeIn", this.stack[this.top]);
		Canvas.cmd("Delay");
		Canvas.cmd
		(
			"Move", this.stack[this.top],
			{
				aim_x : this.frame[this.top].x,
				aim_y : this.frame[this.top].y,
			}
		);
		Canvas.cmd
		(
			"Move", this.pointer,
			{
				text : "top = " + (this.top+1),
				aim_y : this.pointer.y - Stack.FRAME_HEIGHT,
			},
			"Move", this.line,
			{
				aimStart_y : this.line.start_y - Stack.FRAME_HEIGHT, 
				aimEnd_y : this.line.end_y - Stack.FRAME_HEIGHT, 
			}
		);
		Canvas.cmd("Other", function()
		{
			thisStack.enableControlBar();
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
			"Move", this.pointer,
			{
				text : "top = " + this.top,
				aim_y : this.pointer.y + Stack.FRAME_HEIGHT,
			},
			"Move", this.line,
			{
				aimStart_y : this.line.start_y + Stack.FRAME_HEIGHT, 
				aimEnd_y : this.line.end_y + Stack.FRAME_HEIGHT, 
			}
		);
	   	Canvas.cmd
		(
			"Move", this.stack[this.top],
			{
				aim_x : Stack.SHAPE_X,
				aim_y : Stack.SHAPE_Y,
			}
		);
		Canvas.cmd("Delay");
		Canvas.cmd("FadeOut", this.stack[this.top]);
		Canvas.cmd("Other", function()
		{
			$(".controler").removeAttr("disabled");		
		});
		Canvas.cmd("END");	
	}
}
Stack.prototype.addControls = function()
{
	var obj = this;
	$("#AlgorithmName").html(Stack.ALGORITHM_NAME);
	
	this.TextInput = this.addControlBar("text","");
	this.CreatStackButton = this.addControlBar("button","Creat Stack");
	this.PushButton = this.addControlBar("button","Push");
	this.PopButton = this.addControlBar("button","Pop");
	
	this.CreatStackButton.onclick = function()
	{
		var stackSize = obj.TextInput.value;
		obj.create(stackSize);
		obj.TextInput.value = "";
	}

	this.PushButton.onclick = function()
	{
		var value = obj.TextInput.value;
		obj.push(value);	
		obj.TextInput.value = "";
	}

	this.PopButton.onclick = function()
	{
		obj.pop();
	}

	this.PushButton.disabled = true;
	this.PopButton.disabled = true;
}
