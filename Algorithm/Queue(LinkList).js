function init()
{
	Canvas = new KJcanvas();  //用上面的canvas初始化一个全局画板对象(Canvas)
	DataStructure = new Queue(); 		   //初始化一个数据结构对象
}

Queue = function()
{
	this.addControls();  //给该数据结构演示动画添加用户界面控制器
}

Queue.ALGORITHM_NAME = "链表(链表实现)"; 			//动画名称
Queue.EMPTY_INFO = "链表里空空如也了,弹不出东西了！";  

//DATASHAPE ---> 链表元素矩形

Queue.DATASHAPE_WIDTH = 60;     //宽度
Queue.DATASHAPE_HEIGHT = 60;   //长度

Queue.DATASHAPE_TOP_X = 500;  //表头(栈顶)的位置
Queue.DATASHAPE_TOP_Y = 100;
Queue.DATASHAPE_GAP_X = 100;  //彼此之间的横向间隔
Queue.DATASHAPE_PUSH_X = 450;  //入栈元素的位置
Queue.DATASHAPE_PUSH_Y = 200;

Queue.prototype = new Algorithm();

Queue.prototype.node = function(value)  //链表节点
{
	this.data = value;  
	this.last = null;
	this.next = null;   //指向下一个链表元素
		
	this.DataShape = new Rectangle		//链表元素图形
	({
		Canvas : Canvas,
		text : value,
		width : Queue.DATASHAPE_WIDTH,
		height : Queue.DATASHAPE_HEIGHT
	});

	this.PointerNextShape = new Line		//指针图形
	({
		Canvas : Canvas,
		StartShape : this.DataShape,
		EndShape : this.DataShape
	});

	this.PointerLastShape = new Line		//指针图形
	({
		Canvas : Canvas,
		StartShape : this.DataShape,
		EndShape : this.DataShape
	});
}
Queue.prototype.create = function()  //初始化链表,并绘制该链表
{
	this.disableControlBar();
	this.front = new this.node("front");        //表头
	this.rear = new this.node("rear");  //表尾
	this.front.next = this.rear;
	this.rear.last = this.front;

	Canvas.init();        //初始化一个洁白的画板
	Canvas.cmd("Setup");  //开始动画动作
	Canvas.cmd
	(
		"FadeIn", this.rear.DataShape,  //表头淡入
		{
			x : Queue.DATASHAPE_TOP_X,
			y : Queue.DATASHAPE_TOP_Y
		},	
		"FadeIn", this.front.DataShape, //表尾淡入
		{
			x : Queue.DATASHAPE_TOP_X + Queue.DATASHAPE_GAP_X,
			y :	Queue.DATASHAPE_TOP_Y
		}	
	);
	Canvas.cmd
	(
		"Move", this.front.PointerNextShape, //表头指向表尾 
		{
			aimEndShape : this.front.next.DataShape
		},
		"Move", this.rear.PointerLastShape,
		{
			aimEndShape : this.rear.last.DataShape
		}
	);
	Canvas.cmd("Other",function()
	{
		$(".controler").removeAttr("disabled");		//启用所有控制元素
	});
	Canvas.cmd("End");  //结束动画
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
		"FadeIn", this.enqueueNode.DataShape,   //入栈元素淡入
		{
			x : Queue.DATASHAPE_PUSH_X,
			y : Queue.DATASHAPE_PUSH_Y,
		}
	);
	Canvas.cmd("Delay");
	Canvas.cmd
	(
		"Move", this.enqueueNode.PointerLastShape,  //入栈元素(新栈顶)指向旧栈顶
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
		"Move", this.rear.PointerLastShape,  //表头指向入栈元素(新栈顶)
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
	Canvas.cmd("Other",function()
	{
		$(".controler").removeAttr("disabled");		//启用所有控制元素
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
		Canvas.cmd
		(
			"Move",	this.front.next.DataShape,  //栈顶出栈
			{
				aim_x : Queue.DATASHAPE_PUSH_X,
				aim_y : Queue.DATASHAPE_PUSH_Y
			}
		);
		this.dequeueNode = this.front.next;
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
					//aim_x : tmp_pointer.last.DataShape.x,
					//aim_y : tmp_pointer.last.DataShape.y
				}
			);
			tmp_pointer = tmp_pointer.next;
		}
		Canvas.cmd("EndParallel");
		Canvas.cmd("Delay");
		Canvas.cmd
		(
			"Move", this.front.PointerNextShape,  //表头指向新的栈顶
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
		Canvas.cmd("Other",function()
		{
			$(".controler").removeAttr("disabled");		//启用所有控制元素
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
	this.CreatQueueButton.onclick = function(){
		obj.create();
		obj.TextInput.value = "";
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
