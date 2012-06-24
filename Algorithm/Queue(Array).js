function init()
{
	Canvas = new KJcanvas();
	DataStructure = new Queue(); 
}

Queue = function()
{
	Queue.ALGORITHM_NAME = "Queue(Array)"; 
	Queue.SIZE = 7; 
	Queue.OVERFLOW_INFO = "Queue is full,it will overflow if you enqueue anymore!";
	Queue.EMPTY_INFO = "Queue is empty,it can't dequeue anymore!";
	
	Queue.FRAME_WIDTH = 60;
	Queue.FRAME_HEIGHT = 60;
	Queue.FRAME_X = Queue.FRAME_WIDTH/2 + 100;
	Queue.FRAME_Y = Canvas.height / 2;
	Queue.FRAME_BACKCOLOR = "FFF";
	Queue.FRAME_EDGECOLOR = "000";
	Queue.FRAME_TEXTCOLOR = "#F00";
	Queue.FRAME_FONT = "18px sans-serif";
	Queue.FRAME_EDGEWIDTH = 2;

	Queue.SHAPE_WIDTH = 40;       
	Queue.SHAPE_HEIGHT = 40;     
	Queue.SHAPE_X = Queue.SHAPE_WIDTH/2 + 2;          
	Queue.SHAPE_Y = Queue.SHAPE_HEIGHT/2 + 2;
	Queue.SHAPE_BACKCOLOR = "#4D90FE"; 
	Queue.SHAPE_EDGECOLOR = "000"; 
	Queue.SHAPE_TEXTCOLOR = "FFF";
	Queue.SHAPE_MOVESPEED = 5;  
	Queue.SHAPE_FONT = "18px sans-serif";
	Queue.SHAPE_EDGEWIDTH = 1;
	
	Queue.REAR_POINTER_X = Queue.FRAME_X;
	Queue.REAR_POINTER_Y = Queue.FRAME_Y + Queue.FRAME_HEIGHT/2 + 100;
	Queue.REAR_POINTER_FONT = "20px sans-serif";
	Queue.REAR_POINTER_TEXTCOLOR = "#DAA520";
	Queue.REAR_POINTER_MOVESPEED = 2;

	Queue.FRONT_POINTER_X = Queue.FRAME_X;
	Queue.FRONT_POINTER_Y = Queue.FRAME_Y - Queue.FRAME_HEIGHT/2 - 100;
	Queue.FRONT_POINTER_FONT = "20px sans-serif";
	Queue.FRONT_POINTER_TEXTCOLOR = "#32CD32";
	Queue.FRONT_POINTER_MOVESPEED = 2;

	this.addControls();
	thisQueue = this;
}
Queue.prototype = new Algorithm();
Queue.prototype.create = function(queueSize) 
{
	this.disableControlBar();
	this.queue = new Array(); 
	this.rear = 0;
	this.front = 0;
	this.size = Queue.SIZE;
	if(Positive_Integer.test(queueSize))
		this.size = queueSize;
	this.frame = new Array();  
	this.front_pointer = new Label
	({
		Canvas : Canvas,
		text : "front=" + this.front,
		x : Queue.FRONT_POINTER_X,
		y : Queue.FRONT_POINTER_Y,
		font : Queue.FRONT_POINTER_FONT,
		textColor : Queue.FRONT_POINTER_TEXTCOLOR,
		moveSpeed : Queue.FRONT_POINTER_MOVESPEED
	});
	this.rear_pointer = new Label
	({
		Canvas : Canvas,
		text : "rear=" + this.rear,
	    x : Queue.REAR_POINTER_X,
		y : Queue.REAR_POINTER_Y,
		font : Queue.REAR_POINTER_FONT,
		textColor : Queue.REAR_POINTER_TEXTCOLOR,
		moveSpeed : Queue.REAR_POINTER_MOVESPEED
	});
	
	Canvas.init();
	Canvas.cmd("Setup");
	Canvas.cmd("StartParallel");
	Canvas.cmd
	(
		"Draw",this.front_pointer,
		"Draw",this.rear_pointer
	);
	for(i=0; i<this.size; i++)
	{
		this.frame[i] = new Rectangle
		({
			Canvas : Canvas,
			text : i, 
			width : Queue.FRAME_WIDTH, 
			height : Queue.FRAME_HEIGHT, 
			x : Queue.FRAME_X + i*Queue.FRAME_WIDTH, 
			y : Queue.FRAME_Y,
			backColor : Queue.FRAME_BACKCOLOR, 
			edgeColor : Queue.FRAME_EDGECOLOR,
			edgeColor : Queue.FRAME_TEXTCOLOR,
			font : Queue.FRAME_FONT = "18px sans-serif",
			edgeWidth : Queue.FRAME_EDGEWIDTH
		}); 
		Canvas.cmd("Draw", this.frame[i]);
	}
	Canvas.cmd("EndParallel");
	Canvas.cmd("Other", function()
	{
		thisQueue.enableControlBar();
	});
	Canvas.cmd("End");
}
Queue.prototype.enqueue = function(value)
{
	if(this.rear >= this.size)
		alert(Queue.OVERFLOW_INFO);
	else
	{
		this.disableControlBar();	
		this.queue[this.rear] = new Rectangle
		({
			Canvas : Canvas,
			text : value,
			width : Queue.SHAPE_WIDTH, 
			height : Queue.SHAPE_HEIGHT,
			x : Queue.SHAPE_X,
			y : Queue.SHAPE_Y,
			backColor : Queue.SHAPE_BACKCOLOR, 
			edegeColor : Queue.SHAPE_EDGECOLOR,
			textColor : Queue.SHAPE_TEXTCOLOR,
			moveSpeed : Queue.SHAPE_MOVESPEED,
			font : Queue.SHAPE_FONT,
			edgeWidth : Queue.SHAPE_EDGEWIDTH,
		});

		Canvas.cmd("Setup");	
		Canvas.cmd("FadeIn", this.queue[this.rear])
 		Canvas.cmd
		(
			"Move", this.queue[this.rear],
			{
				aim_x : this.frame[this.rear].x,
				aim_y : this.frame[this.rear].y,
			}
		);
		Canvas.cmd
		(
			"Move", this.rear_pointer,
			{
				text : "rear=" + (this.rear+1),
				aim_x : this.rear_pointer.x + Queue.FRAME_WIDTH,
			}
		);
		Canvas.cmd("Other", function()
		{
			thisQueue.enableControlBar();
		});
		Canvas.cmd("End");
		this.rear++;
	}
}
Queue.prototype.dequeue = function()
{
	if(this.front >= this.rear)
		alert(Queue.EMPTY_INFO);
	else
	{
		this.disableControlBar();
		Canvas.cmd("Setup");
	   	Canvas.cmd
		(
			"Move",this.queue[this.front],
			{
				aim_x : Queue.SHAPE_X,
				aim_y : Queue.SHAPE_Y,
			}
		);
		Canvas.cmd
		(
			"Move",this.front_pointer,
			{
				text : "front=" + (this.front + 1),
				aim_x : this.frame[this.front].x + Queue.FRAME_WIDTH,
			}
		)
		Canvas.cmd("FadeOut", this.queue[this.front]);
		Canvas.cmd("Other", function()
		{
			thisQueue.enableControlBar();
		});
		Canvas.cmd("End");
 		this.front++;
	}
}
Queue.prototype.addControls = function()
{
	var obj = this;
	$("#AlgorithmName").html(Queue.ALGORITHM_NAME);
	
	this.TextInput = this.addControlBar("text","");
	this.CreatQueueButton = this.addControlBar("button","Creat Queue");
	this.EnqueueButton = this.addControlBar("button","Enqueue");
	this.DequeueButton = this.addControlBar("button","Dequeue");

	this.CreatQueueButton.onclick = function(){
		var queueSize = obj.TextInput.value;
		obj.create(queueSize);
		obj.TextInput.value = "";
		obj.EnqueueButton.disabled = false;
	}

	this.EnqueueButton.onclick = function(){
		var value = obj.TextInput.value;
		obj.enqueue(value);	
		obj.TextInput.value = "";
	}

	this.DequeueButton.onclick = function(){
		obj.dequeue();
	}

	this.EnqueueButton.disabled = true;
	this.DequeueButton.disabled = true;
}
