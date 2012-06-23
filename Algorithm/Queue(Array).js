function init()
{
	Canvas = new KJcanvas();  //用上面的canvas初始化一个全局画板对象(Canvas)
	DataStructure = new Queue(); 	//初始化一个队列对象
}

Queue = function()
{
	this.addControls();
}
Queue.ALGORITHM_NAME = "队列(数组)"; //算法名	
Queue.SIZE = 7; //默认队列的大小
Queue.OVERFLOW_INFO = "队列吃饱了,再压栈,队列会撑死的！";
Queue.EMPTY_INFO = "队列里空空如也了,弹不出东西了！";

Queue.FRAME_WIDTH = 60;
Queue.FRAME_HEIGHT = 60;
Queue.FRAME_START_X = 100;
Queue.FRAME_START_Y = 250;//(Canvas.HEIGHT-Queue.FRAME_HEIGHT)/2;
Queue.FRAME_TEXT = "";
Queue.FRAME_BACKCOLOR = "FFF";
Queue.FRAME_EDGECOLOR = "000";

Queue.SHAPE_BACKCOLOR = "ABC";  //默认图形填充背景色
Queue.SHAPE_EDGECOLOR = "000";  //默认图形边框颜色
Queue.SHAPE_TEXTCOLOR = "C00";  //默认图形填充文本颜色
Queue.SHAPE_TEXT = "shape";    //默认图新填充的文本内容
Queue.SHAPE_WIDTH = 40;       //默认图形宽度
Queue.SHAPE_HEIGHT = 40;      //默认图形高度
Queue.SHAPE_START_X = 0;           //默认图新位置
Queue.SHAPE_START_Y = 0;
Queue.SHAPE_MOVE_SPEED = 5;  //默认图新移动速度
Queue.SHAPE_MOVE_PATH = "LINE"; //默认图新移动方式(直线)
Queue.SHAPE_FONT = "10px sans-serif";

Queue.REAR_POINTER_FONT = "20px sans-serif";
Queue.REAR_POINTER_MOVE_SPEED = 2;
Queue.REAR_POINTER_START_X = Queue.FRAME_START_X;
Queue.REAR_POINTER_START_Y = Queue.FRAME_START_Y + (Queue.FRAME_HEIGHT+100);
Queue.REAR_POINTER_COLOR = "000";

Queue.FRONT_POINTER_FONT = "20px sans-serif";
Queue.FRONT_POINTER_MOVE_SPEED = 2;
Queue.FRONT_POINTER_START_X = Queue.FRAME_START_X;
Queue.FRONT_POINTER_START_Y = Queue.FRAME_START_Y - (Queue.FRAME_HEIGHT+100);
Queue.FRONT_POINTER_COLOR = "000";

Queue.prototype = new Algorithm();
Queue.prototype.create = function(queueSize)  //初始化队列大小,并绘制该队列
{
	this.queue = new Array();  //队列 
	this.rear = 0;
	this.front = 0;
	this.size = Queue.SIZE;
	if(Positive_Integer.test(queueSize))
		this.size = queueSize;

	this.frame = new Array();  //数组框架
	this.front_pointer = new Label({
		Canvas : Canvas,
		text : "front="+this.front,
		textColor : Queue.FRONT_POINTER_COLOR,
		font : Queue.FRONT_POINTER_FONT,
		moveSpeed : Queue.FRONT_POINTER_MOVE_SPEED});
	this.rear_pointer = new Label({
		Canvas : Canvas,
		text : "rear="+this.rear,
		textColor : Queue.REAR_POINTER_COLOR,
		font : Queue.REAR_POINTER_FONT,
		moveSpeed : Queue.REAR_POINTER_MOVE_SPEED});
	
	Canvas.init();
	Canvas.cmd("Setup");
	Canvas.cmd("StartParallel");
	Canvas.cmd("Draw",this.front_pointer,{
		x : Queue.FRONT_POINTER_START_X,
		y : Queue.FRONT_POINTER_START_Y});
	Canvas.cmd("Draw",this.rear_pointer,{
	    x : Queue.REAR_POINTER_START_X,
		y : Queue.REAR_POINTER_START_Y});
	for(i=0; i<this.size; i++)
	{
		this.frame[i] = new Rectangle({
			Canvas : Canvas,
			width : Queue.FRAME_WIDTH, 
			height : Queue.FRAME_HEIGHT, 
			text : i, 
			backColor : Queue.FRAME_BACKCOLOR, 
			edgeColor : Queue.FRAME_EDGECOLOR
			}); 
		Canvas.cmd("Draw",this.frame[i],{
			x : Queue.FRAME_START_X+i*Queue.FRAME_WIDTH, 
			y : Queue.FRAME_START_Y});
	}
	Canvas.cmd("EndParallel");
	Canvas.cmd("End");
}
Queue.prototype.enqueue = function( value )
{
	if(this.rear >= this.size)
		alert(Queue.OVERFLOW_INFO);
	else
	{
		this.disableControlBar();
	
		this.queue[this.rear] = new Rectangle({
			Canvas : Canvas,
			width : Queue.SHAPE_WIDTH, 
			height : Queue.SHAPE_HEIGHT,
			text : value,
			backColor : Queue.SHAPE_BACKCOLOR, 
			edegeColor : Queue.SHAPE_EDGECOLOR,
			textColor : Queue.SHAPE_TEXTCOLOR,
			font : Queue.SHAPE_FONT
			});

		Canvas.cmd("Setup");	
		Canvas.cmd("Draw",this.queue[this.rear],{
			x : Queue.SHAPE_START_X,
			y : Queue.SHAPE_START_Y});
 		Canvas.cmd("Delay",Canvas.DELAY_TIME);
 		Canvas.cmd(
			"Move", this.queue[this.rear],{
			aim_x : this.frame[this.rear].x,
			aim_y : this.frame[this.rear].y,
			moveSpeed : Queue.SHAPE_MOVE_SPEED
			},
			
			"Move",this.rear_pointer,{
			text : "rear=" + (this.rear+1),
			aim_x : this.rear_pointer.x + Queue.FRAME_WIDTH,
			moveSpeed : Queue.REAR_POINTER_MOVE_SPEED
			});
		Canvas.cmd("Other",function(){
			$(".controler").removeAttr("disabled");		//启用所有控制元素
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
	   	Canvas.cmd(
			"Move",this.queue[this.front],
			{
				aim_x : Queue.SHAPE_START_X,
				aim_y : Queue.SHAPE_START_Y,
			},
			"Move",this.front_pointer,
			{
				text : "front=" + (this.front+1),
				aim_x : this.frame[this.front].x+Queue.FRAME_WIDTH,
			}
		);
		Canvas.cmd("Delay",Canvas.DELAY_TIME);
	
		Canvas.cmd("Delete",this.queue[this.front]);
		Canvas.cmd("Other",function(){
			$(".controler").removeAttr("disabled");		//启用所有控制元素
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
	this.CreatQueueButton.onclick = function(){
		var queueSize = obj.TextInput.value;
		obj.create(queueSize);
		obj.TextInput.value = "";
		obj.EnqueueButton.disabled = false;
	}

	this.EnqueueButton = this.addControlBar("button","Enqueue");
	this.EnqueueButton.onclick = function(){
		var value = obj.TextInput.value;
		obj.enqueue(value);	
		obj.TextInput.value = "";
	}

	this.DequeueButton = this.addControlBar("button","Dequeue");
	this.DequeueButton.onclick = function(){
		obj.dequeue();
	}

	this.EnqueueButton.disabled = true;
	this.DequeueButton.disabled = true;
}
