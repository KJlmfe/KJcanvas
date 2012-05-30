function init()
{
	var Data_Structure = new Stack();  //初始化一个堆栈对象
	Data_Structure.addControls(Data_Structure);  //添加堆栈用户控制器

	var Mycanvas = document.getElementsByTagName("canvas")[0]; //初始化canvas对象
	Data_Structure.canvas = new Canvas(Mycanvas);  //将该canvas对象绑定到该堆栈上
}

Stack = function(size)
{}

Stack.ALGORITHM_NAME = "堆栈(链表实现)"; //算法名	
Stack.EMPTY_INFO = "堆栈里空空如也了,弹不出东西了！";

Stack.DATASHAPE_WIDTH = 60;
Stack.DATASHAPE_HEIGHT = 60;
Stack.DATASHAPE_FONT = "16px sans-serif";

Stack.DATASHAPE_TOP_X = 100;
Stack.DATASHAPE_TOP_Y = 100;
Stack.DATASHAPE_GAP_X = 100;
Stack.DATASHAPE_PUSH_X = 150;
Stack.DATASHAPE_PUSH_Y = 200;

Stack.DATASHAPE_BACKCOLOR = "FFCAAC";  //默认图形填充背景色
Stack.DATASHAPE_EDGECOLOR = "D58FFF";  //默认图形边框颜色
Stack.DATASHAPE_TEXTCOLOR = "FF2451";  //默认图形填充文本颜色

Stack.DATASHAPE_MOVE_SPEED = 2;  //默认图新移动速度
Stack.POINTER_MOVE_SPEED = 3;
Stack.DELAY_TIME = 1500;

Stack.POINTER_COLOR = "4DDC12";
Stack.POINTER_WIDTH = 3;
Stack.POINTER_FONT = "20px sans-serif";

Stack.prototype = new Algorithm();

Stack.prototype.stackNode = function(value)
{
	this.data = value;
	this.next = null;
	
	this.dataShape = new Rectangle
	({
		text : value,
		width : Stack.DATASHAPE_WIDTH,
		height : Stack.DATASHAPE_HEIGHT,
		font : Stack.DATASHAPE_FONT,
		backColor : Stack.DATASHAPE_BACKCOLOR,
		edgeColor : Stack.DATASHAPE_EDGECOLOR,
		textColor : Stack.DATASHAPE_TEXTCOLOR,
		move_speed : Stack.DATASHAPE_MOVE_SPEED
	});

	this.pointerShape = new Line
	({
		startObject : this.dataShape,
		lineColor : Stack.POINTER_COLOR,
		lineWidth : Stack.POINTER_WIDTH
	});
}
Stack.prototype.create = function()  //初始化堆栈大小,并绘制该堆栈
{
	this.top = new this.stackNode("top");
	this.top.next = new this.stackNode("null");
	
	this.canvas.del();
	this.canvas.clear();
	this.canvas.cmd("Setup");
	this.canvas.cmd
	(
		"Draw", this.top.dataShape,
		{
			canvas : this.canvas,
			x : Stack.DATASHAPE_TOP_X,
			y : Stack.DATASHAPE_TOP_Y
		},	

		"Draw", this.top.next.dataShape,
		{
  		 	canvas : this.canvas,
			x : Stack.DATASHAPE_TOP_X + Stack.DATASHAPE_GAP_X,
			y :	Stack.DATASHAPE_TOP_Y
		},
		
		"Draw", this.top.pointerShape,
		{
			canvas : this.canvas,
			endObject : this.top.next.dataShape
		}
	);
	this.canvas.cmd("END");
}
Stack.prototype.push = function( value )
{
	$(".controler").attr("disabled","disabled");  //禁用所有控制元素
	
	var tmp_data = this.top.next;
	this.top.next = new this.stackNode(value);
	this.top.next.next = tmp_data;

	this.canvas.cmd("Setup");
	this.canvas.cmd
	(
		"Draw", this.top.next.dataShape,
		{
			canvas : this.canvas,
			x : Stack.DATASHAPE_PUSH_X,
			y : Stack.DATASHAPE_PUSH_Y
		}
	);
	this.canvas.cmd("Delay",Stack.DELAY_TIME);
	this.canvas.cmd
	(
		"Draw", this.top.next.pointerShape,
		{
			canvas : this.canvas,
			endObject : this.top.next.next.dataShape
		}
	);
	this.canvas.cmd("Delay",Stack.DELAY_TIME);
	this.canvas.cmd
	(
		"Move", this.top.pointerShape,
		{
			aim_endObject : this.top.next.dataShape,
			aim_startObject : this.top.pointerShape.startObject,
			move_speed : 1
		}
	);
	this.canvas.cmd("Delay",Stack.DELAY_TIME);
   /* this.canvas.cmd*/
	//(
		//"Draw", this.top.pointerShape,
		//{
	////		endObject : this.top.next.dataShape,
		//}
	/*);*/
	this.canvas.cmd("Delay",Stack.DELAY_TIME);
	
	var tmp_pointer = this.top.next;
	this.canvas.cmd("StartParallel");
	this.canvas.cmd
	(
		"Move",	tmp_pointer.dataShape,
		{
			aim_x : tmp_pointer.next.dataShape.x,
			aim_y : tmp_pointer.next.dataShape.y
		}
	);

	tmp_pointer = tmp_pointer.next;
	while(tmp_pointer)
	{
		this.canvas.cmd
		(
			"Move",	tmp_pointer.dataShape,
			{
				aim_x : tmp_pointer.dataShape.x + Stack.DATASHAPE_GAP_X,
				aim_y : tmp_pointer.dataShape.y
			}
		);
		tmp_pointer = tmp_pointer.next;
	}
	this.canvas.cmd("EndParallel");
	var waitTime = this.canvas.cmd("END");
	
	var me = this; 
	setTimeout(function(){
		$(".controler").removeAttr("disabled");
		},waitTime);
}
Stack.prototype.pop = function()
{
	if(this.top.next.next == null)
		alert(Stack.EMPTY_INFO);
	else
	{
		$(".controler").attr("disabled","disabled");
	
		this.canvas.cmd("Setup");	
		this.canvas.cmd("StartParallel");
		this.canvas.cmd
		(
			"Move",	this.top.next.dataShape,
			{
				aim_x : Stack.DATASHAPE_PUSH_X,
				aim_y : Stack.DATASHAPE_PUSH_Y
			}
		);
		var tmp_pointer = this.top.next;
		while(tmp_pointer.next !=  null)
		{
			this.canvas.cmd
			(
				"Move", tmp_pointer.next.dataShape,
				{
					aim_x : tmp_pointer.dataShape.x,
					aim_y : tmp_pointer.dataShape.y
				}
			);
			tmp_pointer = tmp_pointer.next;
		}
		this.canvas.cmd("EndParallel");
		this.canvas.cmd("Delay",Stack.DELAY_TIME);
		this.canvas.cmd("Delete",this.top.pointerShape);
		this.canvas.cmd("Delay",Stack.DELAY_TIME);
		this.canvas.cmd
			(
				"Draw", this.top.pointerShape,
				{
			    	endObject : this.top.next.next.dataShape
				}
			);
		this.canvas.cmd("Delay",Stack.DELAY_TIME);
		this.canvas.cmd("Delete",this.top.next.dataShape,{},"Delete",this.top.next.pointerShape,{});
		
		var waitTime = this.canvas.cmd("END");	
		
		var me = this;	
		setTimeout(function(){
			$(".controler").removeAttr("disabled");
		},waitTime);		
		
		this.top.next = this.top.next.next;
	}
}
Stack.prototype.addControls = function(obj)
{
	$("#AlgorithmName").html(Stack.ALGORITHM_NAME);
	this.TextInput = this.addAlgorithmControlBar("text","");
	this.CreatStackButton = this.addAlgorithmControlBar("button","Creat Stack");
	this.CreatStackButton.onclick = function(){
		obj.create();
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
