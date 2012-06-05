function init()
{
	var canvas = document.getElementsByTagName("Canvas")[0]; 	//得到html上canvas元素
	Canvas = new KJcanvas();  //用上面的canvas初始化一个全局画板对象(Canvas)
	
	DataStructure = new Stack(); 		   //初始化一个数据结构对象
	DataStructure.addControls(DataStructure);  //给该数据结构演示动画添加用户界面控制器
}

Stack = function()
{}

Stack.ALGORITHM_NAME = "堆栈(链表实现)"; 			//动画名称
Stack.EMPTY_INFO = "堆栈里空空如也了,弹不出东西了！";  

//DATASHAPE ---> 堆栈元素矩形

Stack.DATASHAPE_WIDTH = 60;     //宽度
Stack.DATASHAPE_HEIGHT = 60;   //长度

Stack.DATASHAPE_TOP_X = 100;  //表头(栈顶)的位置
Stack.DATASHAPE_TOP_Y = 100;
Stack.DATASHAPE_GAP_X = 100;  //彼此之间的横向间隔
Stack.DATASHAPE_PUSH_X = 150;  //入栈元素的位置
Stack.DATASHAPE_PUSH_Y = 200;

Stack.prototype = new Algorithm();

Stack.prototype.stackNode = function(value)  //堆栈节点
{
	this.data = value;  
	this.next = null;   //指向下一个堆栈元素
	
	this.DataShape = new Rectangle		//堆栈元素图形
	({
		Canvas : Canvas,
		text : value,
		width : Stack.DATASHAPE_WIDTH,
		height : Stack.DATASHAPE_HEIGHT
	});

	this.PointerShape = new Line		//指针图形
	({
		Canvas : Canvas,
		StartShape : this.DataShape,
		EndShape : this.DataShape
	});
}
Stack.prototype.create = function()  //初始化堆栈,并绘制该堆栈
{
	this.top = new this.stackNode("top");        //表头
	this.top.next = new this.stackNode("null");  //表尾
	
	Canvas.init();        //初始化一个洁白的画板
	Canvas.cmd("Setup");  //开始动画动作
	Canvas.cmd
	(
		"FadeIn", this.top.DataShape,  //表头淡入
		{
			x : Stack.DATASHAPE_TOP_X,
			y : Stack.DATASHAPE_TOP_Y
		}
	);
	Canvas.cmd("Delay");
	Canvas.cmd
	(
		"FadeIn", this.top.next.DataShape, //表尾淡入
		{
			x : Stack.DATASHAPE_TOP_X + Stack.DATASHAPE_GAP_X,
			y :	Stack.DATASHAPE_TOP_Y
		},	
		"Move", this.top.PointerShape, //表头指向表尾 
		{
			aimEndShape : this.top.next.DataShape
		}
	);
	Canvas.cmd("Other",function()
	{
		$(".controler").removeAttr("disabled");		//启用所有控制元素
	});
	Canvas.cmd("End");  //结束动画
}
Stack.prototype.push = function( value )
{
	this.disableControlBar();

	var tmp_data = this.top.next;
	this.top.next = new this.stackNode(value);
	this.top.next.next = tmp_data;

	Canvas.cmd("Setup");
	Canvas.cmd
	(
		"FadeIn", this.top.next.DataShape,   //入栈元素淡入
		{
			x : Stack.DATASHAPE_PUSH_X,
			y : Stack.DATASHAPE_PUSH_Y,
		}
	);
	Canvas.cmd("Delay");
	Canvas.cmd
	(
		"Move", this.top.next.PointerShape,  //入栈元素(新栈顶)指向旧栈顶
		{
			aimEndShape : this.top.next.next.DataShape,
		}
	);
	Canvas.cmd("Delay");
	Canvas.cmd
	(
		"Move", this.top.PointerShape,  //表头指向入栈元素(新栈顶)
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
	Canvas.cmd("Other",function()
	{
		$(".controler").removeAttr("disabled");		//启用所有控制元素
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
			"Move",	this.top.next.DataShape,  //栈顶出栈
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
			"Move", this.top.PointerShape,  //表头指向新的栈顶
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
		Canvas.cmd("Other",function()
		{
			$(".controler").removeAttr("disabled");		//启用所有控制元素
		});
		Canvas.cmd("End");	
		this.top.next = this.top.next.next;
	}
}
Stack.prototype.addControls = function(obj)
{
	$("#AlgorithmName").html(Stack.ALGORITHM_NAME);
	this.TextInput = this.addControlBar("text","");
	this.CreatStackButton = this.addControlBar("button","Creat Stack");
	this.CreatStackButton.onclick = function(){
		obj.create();
		obj.TextInput.value = "";
	}

	this.PushButton = this.addControlBar("button","Push");
	this.PushButton.onclick = function(){
		var value = obj.TextInput.value;
		obj.push(value);	
		obj.TextInput.value = "";
	}

	this.PopButton = this.addControlBar("button","Pop");
	this.PopButton.onclick = function(){
		obj.pop();
	}

	this.PushButton.disabled = true;
	this.PopButton.disabled = true;
}
