function init()
{
	var Data_Structure = new Stack();  //初始化一个堆栈对象
	Data_Structure.addControls(Data_Structure);  //添加堆栈用户控制器

	var Mycanvas = document.getElementsByTagName("canvas")[0]; //初始化canvas对象
	Data_Structure.canvas = new Canvas(Mycanvas);  //将该canvas对象绑定到该堆栈上
}

Stack = function(size)
{
	this.top = null;
}

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
Stack.SHAPE_START_X = 200;           //默认图新位置
Stack.SHAPE_START_Y = 200;
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

Stack.prototype.DataStructure = function(value)
{
	this.data = value;
	this.next = null;
	
	this.dataShape = new Rectangle({
		text : value
	});

	this.nextShape = new Line({
		startObject : this.dataShape
	});
}
Stack.prototype.create = function()  //初始化堆栈大小,并绘制该堆栈
{
	this.top = new this.DataStructure("top");
	this.top.next = new this.DataStructure("null");
	this.top.nextShape.endObject = this.top.next.dataShape;
	
	this.canvas.del();
	this.canvas.clear();
	this.canvas.cmd("Setup");
	
	this.canvas.cmd(
		"Draw",this.top.dataShape,{
		canvas : this.canvas,
		x : 50,
		y : 50
		},
	
	"Draw",this.top.next.dataShape,{
		canvas : this.canvas,
		x : 400,
		y :50
		},
		
		"Draw",this.top.nextShape,{
		canvas : this.canvas
		});
	this.canvas.cmd("END");
}
Stack.prototype.push = function( value )
{
		$(".controler").attr("disabled","disabled");  //禁用所有控制元素
	
		var tmp_data = this.top.next;
		this.top.next = new this.DataStructure(value);
		this.top.next.next = tmp_data;

		this.top.nextShape.endObject = this.top.next.dataShape;
		if(this.top.next.next)
			this.top.next.nextShape.endObject = this.top.next.next.dataShape;

		this.canvas.cmd("Setup");
		this.canvas.cmd(
			"Draw",this.top.next.dataShape,{
			canvas : this.canvas,
			x : Stack.SHAPE_START_X,
			y : Stack.SHAPE_START_Y
			});
		this.canvas.cmd("Delay");
		this.canvas.cmd(
			"Draw",this.top.next.nextShape,{
			canvas : this.canvas
			});
		this.canvas.cmd("Delay");
		this.canvas.cmd(
			"Delete",this.top.nextShape,{
			});
		this.canvas.cmd("Delay",Canvas.DELAY_TIME);
		this.canvas.cmd(
			"Draw",this.top.nextShape,{
			});

		var tmp_pointer = this.top.next;

		this.canvas.cmd(
			"Move",	tmp_pointer.dataShape,{
			aim_x : tmp_pointer.next.dataShape.x,
			aim_y : tmp_pointer.next.dataShape.y
			});

		tmp_pointer = tmp_pointer.next;
		while(tmp_pointer)
		{
			this.canvas.cmd(
				"Move",	tmp_pointer.dataShape,{
				aim_x : tmp_pointer.dataShape.x + 100,
				aim_y : tmp_pointer.dataShape.y
				});
			tmp_pointer = tmp_pointer.next;
		}
         //this.canvas.cmd(
			//"Move", this.stack[this.top],{
			//aim_x : this.frame[this.top].x,
			//aim_y : this.frame[this.top].y,
			//move_speed : Stack.SHAPE_MOVE_SPEED
			//},
			//"Move",this.pointer,{
			//text : "top = " + this.top,
			//aim_x : this.pointer.x,
			//aim_y : this.pointer.y - Stack.FRAME_HEIGHT,
			//move_speed : Stack.POINTER_MOVE_SPEED
			//},
			//"Move",this.line,{
			//aim_x : this.line.start_x, 
			//aim_y : this.line.start_y - Stack.FRAME_HEIGHT, 
			//move_speed : Stack.POINTER_MOVE_SPEED
			//});
		var waitTime = this.canvas.cmd("END");
	
		var me = this; 
		setTimeout(function(){
			$(".controler").removeAttr("disabled");
		},waitTime);
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
