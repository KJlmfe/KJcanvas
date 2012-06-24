function init()
{
	Canvas = new KJcanvas();  
	DataStructure = new Stack(); 	
}

Stack = function()
{	
	Stack.ALGORITHM_NAME = "Stack(LinkList)"; 
	Stack.EMPTY_INFO = "Stack is empty,it can't pop anymore!";  
	
	Stack.DATASHAPE_TOP_X = 100; 
	Stack.DATASHAPE_TOP_Y = 100;
	Stack.DATASHAPE_GAP_X = 100; 
	Stack.DATASHAPE_PUSH_X = 150;
	Stack.DATASHAPE_PUSH_Y = 200;

	Stack.DATASHAPE_WIDTH = 60;    
	Stack.DATASHAPE_HEIGHT = 60;  
	Stack.DATASHAPE_BACKCOLOR = "#00FF00";  
	Stack.DATASHAPE_EDGECOLOR = "#FF4500"; 
	Stack.DATASHAPE_TEXTCOLOR = "#0044BB";
	Stack.DATASHAPE_MOVESPEED = 6;
	Stack.DATASHAPE_FONT = "18px sans-serif";
	Stack.DATASHAPE_EDGEWIDTH = 1;

	Stack.POINTERSHAPE_LINECOLOR = "F00";
	Stack.POINTERSHAPE_LINEWIDTH = 2;
	Stack.POINTERSHAPE_MOVESPEED = 2;

	this.addControls();  
	thisStack = this;
}
Stack.prototype = new Algorithm();
Stack.prototype.node = function(value)  
{
	this.data = value;  
	this.next = null;   
	
	this.DataShape = new Rectangle	
	({
		Canvas : Canvas,
		text : value,
		width : Stack.DATASHAPE_WIDTH,
		height : Stack.DATASHAPE_HEIGHT,
		backColor : Stack.DATASHAPE_BACKCOLOR,
		edgeColor : Stack.DATASHAPE_EDGECOLOR,
		textColor : Stack.DATASHAPE_TEXTCOLOR,
		moveSpeed : Stack.DATASHAPE_MOVESPEED,
		font : Stack.DATASHAPE_FONT,
		edgeWidth : Stack.DATASHAPE_EDGEWIDTH
	});
	this.PointerShape = new Line	
	({
		Canvas : Canvas,
		StartShape : this.DataShape,
		EndShape : this.DataShape,
		lineColor : Stack.POINTERSHAPE_LINECOLOR,
		lineWidth : Stack.POINTERSHAPE_LINEWIDTH,
		moveSpeed : Stack.POINTERSHAPE_MOVESPEED 
	});
}
Stack.prototype.create = function()  
{
	this.disableControlBar();
	this.top = new this.node("top"); 
	this.top.next = new this.node("null"); 
	
	Canvas.init();      
	Canvas.cmd("Setup");
	Canvas.cmd
	(
		"FadeIn", this.top.DataShape,  
		{
			x : Stack.DATASHAPE_TOP_X,
			y : Stack.DATASHAPE_TOP_Y
		}
	);
	Canvas.cmd("Delay");
	Canvas.cmd
	(
		"FadeIn", this.top.next.DataShape, 
		{
			x : Stack.DATASHAPE_TOP_X + Stack.DATASHAPE_GAP_X,
			y :	Stack.DATASHAPE_TOP_Y
		},	
		"Move", this.top.PointerShape, 
		{
			aimEndShape : this.top.next.DataShape
		}
	);
	Canvas.cmd("Other", function()
	{
		thisStack.enableControlBar();
	});
	Canvas.cmd("End");
}
Stack.prototype.push = function(value)
{
	this.disableControlBar();

	var tmp_data = this.top.next;
	this.top.next = new this.node(value);
	this.top.next.next = tmp_data;

	Canvas.cmd("Setup");
	Canvas.cmd
	(
		"FadeIn", this.top.next.DataShape,
		{
			x : Stack.DATASHAPE_PUSH_X,
			y : Stack.DATASHAPE_PUSH_Y,
		}
	);
	Canvas.cmd("Delay");
	Canvas.cmd
	(
		"Move", this.top.next.PointerShape, 
		{
			aimEndShape : this.top.next.next.DataShape,
		}
	);
	Canvas.cmd("Delay");
	Canvas.cmd
	(
		"Move", this.top.PointerShape,  
		{
			aimEndShape : this.top.next.DataShape,
		}
	);
	Canvas.cmd("Delay");
	var tmp_pointer = this.top.next;
	Canvas.cmd("StartParallel");
	Canvas.cmd
	(
		"Move",	tmp_pointer.DataShape,
		{
			aim_x : tmp_pointer.next.DataShape.x,
			aim_y : tmp_pointer.next.DataShape.y
		}
	);
	tmp_pointer = tmp_pointer.next;
	while(tmp_pointer)
	{
		Canvas.cmd
		(
			"Move",	tmp_pointer.DataShape,
			{
				aim_x : tmp_pointer.DataShape.x + Stack.DATASHAPE_GAP_X,
			}
		);
		tmp_pointer = tmp_pointer.next;
	}
	Canvas.cmd("EndParallel");
	Canvas.cmd("Other", function()
	{
		thisStack.enableControlBar();
	});
	Canvas.cmd("End");
}
Stack.prototype.pop = function()
{
	if(this.top.next.next == null)
		alert(Stack.EMPTY_INFO);
	else
	{
		this.disableControlBar();
		Canvas.cmd("Setup");	
		Canvas.cmd("StartParallel");
		Canvas.cmd
		(
			"Move",	this.top.next.DataShape,  
			{
				aim_x : Stack.DATASHAPE_PUSH_X,
				aim_y : Stack.DATASHAPE_PUSH_Y
			}
		);
		var tmp_pointer = this.top.next;
		while(tmp_pointer.next !=  null)
		{
			Canvas.cmd
			(
				"Move", tmp_pointer.next.DataShape,
				{
					aim_x : tmp_pointer.DataShape.x,
					aim_y : tmp_pointer.DataShape.y
				}
			);
			tmp_pointer = tmp_pointer.next;
		}
		Canvas.cmd("EndParallel");
		Canvas.cmd("Delay");
		Canvas.cmd
		(
			"Move", this.top.PointerShape,  
			{
		    	aimEndShape : this.top.next.next.DataShape
			}
		);
		Canvas.cmd("Delay");
		Canvas.cmd
		(
			"FadeOut", this.top.next.PointerShape,
			"FadeOut",	this.top.next.DataShape
		);
		Canvas.cmd("Other", function()
		{
			thisStack.enableControlBar();
		});
		Canvas.cmd("End");
		this.top.next = this.top.next.next;
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
		obj.create();
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
