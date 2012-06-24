function init()
{
	Canvas = new KJcanvas();  
	DataStructure = new Queue();
}

Queue = function()
{
	Queue.ALGORITHM_NAME = "Queue(LinkList)"; 			
	Queue.EMPTY_INFO = "Queue is empty,it can't dequeue anymore!";  

	Queue.DATASHAPE_WIDTH = 60;     
	Queue.DATASHAPE_HEIGHT = 60;   
	
	Queue.DATASHAPE_FRONT_X = Canvas.width - Queue.DATASHAPE_WIDTH;  
	Queue.DATASHAPE_FRONT_Y = Canvas.height/2 - Queue.DATASHAPE_HEIGHT;
	Queue.DATASHAPE_GAP_X = 100; 
	
	Queue.DATASHAPE_WIDTH = 60;    
	Queue.DATASHAPE_HEIGHT = 60;  
	Queue.DATASHAPE_BACKCOLOR = "#00FF00";  
	Queue.DATASHAPE_EDGECOLOR = "#FF4500"; 
	Queue.DATASHAPE_TEXTCOLOR = "#0044BB";
	Queue.DATASHAPE_MOVESPEED = 6;
	Queue.DATASHAPE_FONT = "18px sans-serif";
	Queue.DATASHAPE_EDGEWIDTH = 1;

	Queue.POINTERNEXTSHAPE_LINECOLOR = "F00";
	Queue.POINTERNEXTSHAPE_LINEWIDTH = 2;
	Queue.POINTERNEXTSHAPE_MOVESPEED = 2;

	Queue.POINTERLASTSHAPE_LINECOLOR = "#CC00CC";
	Queue.POINTERLASTSHAPE_LINEWIDTH = 4;
	Queue.POINTERLASTSHAPE_MOVESPEED = 2;

	this.addControls();  
	thisQueue = this;
}
Queue.prototype = new Algorithm();
Queue.prototype.node = function(value)  
{
	this.data = value;  
	this.last = null;
	this.next = null;   
		
	this.DataShape = new Rectangle	
	({
		Canvas : Canvas,
		text : value,
		width : Queue.DATASHAPE_WIDTH,
		height : Queue.DATASHAPE_HEIGHT,
		backColor : Queue.DATASHAPE_BACKCOLOR,
		edgeColor : Queue.DATASHAPE_EDGECOLOR,
		textColor : Queue.DATASHAPE_TEXTCOLOR,
		moveSpeed : Queue.DATASHAPE_MOVESPEED,
		font : Queue.DATASHAPE_FONT,
		edgeWidth : Queue.DATASHAPE_EDGEWIDTH
	});
	this.PointerNextShape = new Line
	({
		Canvas : Canvas,
		StartShape : this.DataShape,
		EndShape : this.DataShape,
		lineColor : Queue.POINTERNEXTSHAPE_LINECOLOR,
		lineWidth : Queue.POINTERNEXTSHAPE_LINEWIDTH,
		moveSpeed : Queue.POINTERNEXTSHAPE_MOVESPEED 
	});
	this.PointerLastShape = new Line
	({
		Canvas : Canvas,
		StartShape : this.DataShape,
		EndShape : this.DataShape,
		lineColor : Queue.POINTERLASTSHAPE_LINECOLOR,
		lineWidth : Queue.POINTERLASTSHAPE_LINEWIDTH,
		moveSpeed : Queue.POINTERLASTSHAPE_MOVESPEED 
	});
}
Queue.prototype.create = function() 
{
	this.disableControlBar();
	this.front = new this.node("front");  
	this.rear = new this.node("rear");  
	this.front.next = this.rear;
	this.rear.last = this.front;

	Canvas.init();        
	Canvas.cmd("Setup"); 
	Canvas.cmd
	(
		"FadeIn", this.front.DataShape,
		{
			x : Queue.DATASHAPE_FRONT_X,
			y : Queue.DATASHAPE_FRONT_Y
		},	
		"FadeIn", this.rear.DataShape,
		{
			x : Queue.DATASHAPE_FRONT_X - Queue.DATASHAPE_GAP_X,
			y :	Queue.DATASHAPE_FRONT_Y
		}	
	);
	Canvas.cmd
	(
		"Move", this.front.PointerNextShape,
		{
			aimEndShape : this.front.next.DataShape
		},
		"Move", this.rear.PointerLastShape,
		{
			aimEndShape : this.rear.last.DataShape
		}
	);
	Canvas.cmd("Other", function()
	{
		thisQueue.enableControlBar();
	});
	Canvas.cmd("End");
}
Queue.prototype.enqueue = function( value )
{
	this.disableControlBar();

	this.enqueueNode = new this.node(value);
	
	this.enqueueNode.last = this.rear.last;
	this.rear.last.next = this.enqueueNode;

	this.enqueueNode.next = this.rear;
	this.rear.last = this.enqueueNode;

	Canvas.cmd("Setup");
	Canvas.cmd
	(
		"FadeIn", this.enqueueNode.DataShape, 
		{
			x : this.rear.DataShape.x + Queue.DATASHAPE_GAP_X/2,
			y : this.rear.DataShape.y + Queue.DATASHAPE_HEIGHT*1.5
		}
	);
	Canvas.cmd("Delay");
	Canvas.cmd
	(
		"Move", this.enqueueNode.PointerLastShape,  
		{
			aimEndShape : this.enqueueNode.last.DataShape,
		},
		"Move", this.enqueueNode.last.PointerNextShape,
		{
			aimEndShape : this.enqueueNode.DataShape,
		}
	);
	Canvas.cmd("Delay");
	Canvas.cmd
	(
		"Move", this.enqueueNode.PointerNextShape,
		{
			aimEndShape : this.rear.DataShape,
		},
		"Move", this.rear.PointerLastShape,  
		{
			aimEndShape : this.enqueueNode.DataShape,
		}
	);
	Canvas.cmd("Delay");
	
	var tmp_pointer = this.enqueueNode;
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
	while(tmp_pointer != null)
	{
		Canvas.cmd
		(
			"Move",	tmp_pointer.DataShape,
			{
				aim_x : tmp_pointer.DataShape.x - Queue.DATASHAPE_GAP_X,
			}
		);
		tmp_pointer = tmp_pointer.next;
	}
	Canvas.cmd("EndParallel");
	Canvas.cmd("Other", function()
	{
		thisQueue.enableControlBar();
	});
	Canvas.cmd("End");
}
Queue.prototype.dequeue = function()
{
	if(this.front.next == this.rear && this.rear.last == this.front)
		alert(Queue.EMPTY_INFO);
	else
	{
		this.disableControlBar();
		
		Canvas.cmd("Setup");	
		Canvas.cmd("StartParallel");
		this.dequeueNode = this.front.next;
		Canvas.cmd
		(
			"Move",	this.dequeueNode.DataShape,
			{			
				aim_x : this.front.DataShape.x - Queue.DATASHAPE_GAP_X/2,
				aim_y : this.front.DataShape.y + Queue.DATASHAPE_HEIGHT*1.5
			}
		);
		this.front.next = this.dequeueNode.next;
		this.dequeueNode.next.last = this.front;
		
		var tmp_pointer = this.dequeueNode.next;
		while(tmp_pointer != null)
		{
			Canvas.cmd
			(
				"Move", tmp_pointer.DataShape,
				{
					aim_x : tmp_pointer.DataShape.x + Queue.DATASHAPE_GAP_X,
				}
			);
			tmp_pointer = tmp_pointer.next;
		}
		Canvas.cmd("EndParallel");
		Canvas.cmd("Delay");
		Canvas.cmd
		(
			"Move", this.front.PointerNextShape, 
			{
		    	aimEndShape : this.front.next.DataShape
			},
			"Move", this.front.next.PointerLastShape,
			{
				aimEndShape : this.front.DataShape
			}
		);
		Canvas.cmd("Delay");
		Canvas.cmd
		(
			"FadeOut", this.dequeueNode.DataShape,
			"FadeOut", this.dequeueNode.PointerLastShape,
			"FadeOut", this.dequeueNode.PointerNextShape
		);
		Canvas.cmd("Other", function()
		{
			thisQueue.enableControlBar();
		});
		Canvas.cmd("End");
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
	
	this.CreatQueueButton.onclick = function()
	{
		obj.create();
		obj.TextInput.value = "";
	}
	this.EnqueueButton.onclick = function()
	{
		var value = obj.TextInput.value;
		obj.enqueue(value);	
		obj.TextInput.value = "";
	}
	this.DequeueButton.onclick = function()
	{
		obj.dequeue();
	}

	this.EnqueueButton.disabled = true;
	this.DequeueButton.disabled = true;
}
