function init()
{
	var ArrayQueue = new Queue();  //初始化一个队列对象
	ArrayQueue.addControls(ArrayQueue);  //添加队列用户控制器

	var Mycanvas = document.getElementsByTagName("canvas")[0]; //初始化canvas对象
	ArrayQueue.canvas = new Canvas(Mycanvas);  //将该canvas对象绑定到该队列上
}

Queue = function(size)
{
}
Queue.ALGORITHM_NAME = "队列(数组)"; //算法名	
Queue.SIZE = 7; //默认队列的大小
Queue.OVERFLOW_INFO = "队列吃饱了,再压栈,队列会撑死的！";
Queue.EMPTY_INFO = "队列里空空如也了,弹不出东西了！";

Queue.FRAME_WIDTH = 60;
Queue.FRAME_HEIGHT = 60;
Queue.FRAME_START_X = 100;
Queue.FRAME_START_Y = (Canvas.HEIGHT-Queue.FRAME_HEIGHT)/2;
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
Queue.REAR_POINTER_START_X = Queue.FRAME_START_X + Queue.FRAME_WIDTH/2;
Queue.REAR_POINTER_START_Y = Queue.FRAME_START_Y + Queue.FRAME_HEIGHT+100;
Queue.REAR_POINTER_COLOR = "000";

Queue.FRONT_POINTER_FONT = "20px sans-serif";
Queue.FRONT_POINTER_MOVE_SPEED = 2;
Queue.FRONT_POINTER_START_X = Queue.FRAME_START_X - Queue.FRAME_WIDTH/2;
Queue.FRONT_POINTER_START_Y = Queue.FRAME_START_Y + Queue.FRAME_HEIGHT+200;
Queue.FRONT_POINTER_COLOR = "000";

Queue.prototype = new Algorithm();
Queue.prototype.create = function(queueSize)  //初始化队列大小,并绘制该队列
{
	this.queue = new Array();  
	this.frame = new Array();
	this.front_pointer = new Label("front = -1",Queue.FRONT_POINTER_COLOR,Queue.FRONT_POINTER_FONT);
	this.rear_pointer = new Label("rear = 0",Queue.REAR_POINTER_COLOR,Queue.REAR_POINTER_FONT);
	this.size = Queue.SIZE;
	this.rear = 0;
	this.front = -1;
	if(Positive_Integer.test(queueSize))
		this.size = queueSize;
	
	this.canvas.del();
	this.canvas.clear();
	this.canvas.cmd("Setup");
	this.canvas.cmd("Draw",this.front_pointer,Queue.FRONT_POINTER_START_X,Queue.FRONT_POINTER_START_Y);
	this.canvas.cmd("Draw",this.rear_pointer,Queue.REAR_POINTER_START_X,Queue.REAR_POINTER_START_Y);
	for(i=0; i<this.size; i++)
	{
		this.frame[i] = new Rectangle(
			Queue.FRAME_WIDTH, Queue.FRAME_HEIGHT, 
			Queue.FRAME_TEXT, 
			Queue.FRAME_BACKCOLOR, Queue.FRAME_EDGECOLOR
			); 
		this.canvas.cmd("Draw",this.frame[i], Queue.FRAME_START_X+i*Queue.FRAME_WIDTH, Queue.FRAME_START_Y);
	}
}
Queue.prototype.enqueue = function( value )
{
	if(this.rear >= this.size)
		alert(Queue.OVERFLOW_INFO);
	else
	{
		$(".controler").attr("disabled","disabled");  //禁用所有控制元素
	
		this.queue[this.rear] = new Rectangle(
			Queue.SHAPE_WIDTH, Queue.SHAPE_HEIGHT,
			value,
			Queue.SHAPE_BACKCOLOR, Queue.SHAPE_EDGECOLOR, Queue.SHAPE_TEXTCOLOR,
			Queue.SHAPE_FONT
			);

		this.canvas.cmd("Setup");	
		this.canvas.cmd("Draw",this.queue[this.rear],Queue.SHAPE_START_X,Queue.SHAPE_START_Y);
 		this.canvas.cmd("Delay",Canvas.DELAY_TIME);
		this.rear_pointer.text = "rear";
 		waitTime = this.canvas.cmd(
			"Move", this.queue[this.rear],
			this.frame[this.rear].x+(Queue.FRAME_WIDTH-Queue.SHAPE_WIDTH)/2,
			this.frame[this.rear].y+(Queue.FRAME_HEIGHT-Queue.SHAPE_HEIGHT)/2,
			Queue.SHAPE_MOVE_SPEED,
			
			"Move",this.rear_pointer,
			this.frame[this.rear].x+(Queue.FRAME_WIDTH/2),this.frame[this.rear].y+(Queue.FRAME_HEIGHT+100),
			Queue.REAR_POINTER_MOVE_SPEED
			);
		this.rear_pointer.text = "rear = "+this.rear;
		var me = this; 
		setTimeout(function(){
			me.rear++
			$(".controler").removeAttr("disabled");
		},waitTime);	
	}
}
Queue.prototype.dequeue = function()
{
	if(this.front + 1>= this.rear)
		alert(Queue.EMPTY_INFO);
	else
	{
		$(".controler").attr("disabled","disabled");
	
	 	this.front++;

		this.canvas.cmd("Setup");
		this.front_pointer.text = "front = "+this.front;
	   	this.canvas.cmd(
			"Move",this.queue[this.front],
			Queue.SHAPE_START_X,Queue.SHAPE_START_Y,
			Queue.SHAPE_MOVE_SPEED,
			
			"Move",this.front_pointer,
			this.frame[this.front].x+(Queue.FRAME_WIDTH/2),this.frame[this.front].y+(Queue.FRAME_HEIGHT+200),
			Queue.FRONT_POINTER_MOVE_SPEED
		);
		this.canvas.cmd("Delay",Canvas.DELAY_TIME);
	
		waitTime = this.canvas.cmd("Delete",this.queue[this.front]);
	
		var me = this;	
		setTimeout(function(){
			$(".controler").removeAttr("disabled");
		/*	if(me.top <= 0)
				me.DequeueButton.disabled = true;*/
		},waitTime);		
	}
}
Queue.prototype.addControls = function(obj)
{
	$("#AlgorithmName").html(Queue.ALGORITHM_NAME);
	this.TextInput = this.addAlgorithmControlBar("text","");
	this.CreatQueueButton = this.addAlgorithmControlBar("button","Creat Queue");
	this.CreatQueueButton.onclick = function(){
		var queueSize = obj.TextInput.value;
		obj.create(queueSize);
		obj.TextInput.value = "";
		obj.EnqueueButton.disabled = false;
	}

	this.EnqueueButton = this.addAlgorithmControlBar("button","Enqueue");
	this.EnqueueButton.onclick = function(){
		var value = obj.TextInput.value;
		obj.enqueue(value);	
		obj.TextInput.value = "";
	}

	this.DequeueButton = this.addAlgorithmControlBar("button","Dequeue");
	this.DequeueButton.onclick = function(){
		obj.dequeue();
	}

	this.EnqueueButton.disabled = true;
	this.DequeueButton.disabled = true;
}
