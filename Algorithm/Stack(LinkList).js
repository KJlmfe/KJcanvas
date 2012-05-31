function init()
{
	var canvas = document.getElementsByTagName("Canvas")[0]; //得到html上canvas元素
	KJCanvas = new Canvas(canvas);  //用上面的canvas初始化一个全局画板对象(KJCanvas)
	
	var DataStructure = new Stack();  //初始化一个数据结构对象
	DataStructure.addControls(DataStructure);  //给该数据结构演示动画添加用户界面控制器
}

Stack = function()
{}

Stack.ALGORITHM_NAME = "堆栈(链表实现)"; 	//动画名称
Stack.EMPTY_INFO = "堆栈里空空如也了,弹不出东西了！";  
Stack.DELAY_TIME = 1000;  //“Delay”的时间

//DATASHAPE ---> 堆栈元素矩形

Stack.DATASHAPE_WIDTH = 60;     //宽度
Stack.DATASHAPE_HEIGHT = 60;   //长度

Stack.DATASHAPE_FONT = "16px sans-serif"; //填充字体

Stack.DATASHAPE_TOP_X = 100;  //表头(栈顶)的位置
Stack.DATASHAPE_TOP_Y = 100;
Stack.DATASHAPE_GAP_X = 100;  //彼此之间的横向间隔
Stack.DATASHAPE_PUSH_X = 150;  //入栈元素的位置
Stack.DATASHAPE_PUSH_Y = 200;

Stack.DATASHAPE_BACKCOLOR = "FFCAAC";  //背景色
Stack.DATASHAPE_EDGECOLOR = "D58FFF";  //边框色
Stack.DATASHAPE_TEXTCOLOR = "FF2451";  //填充文本色

Stack.DATASHAPE_STARTALPHA = 0;  //淡入淡出的目标透明度
Stack.DATASHAPE_ENDALPHA = 1;  //淡入淡出的目标透明度

Stack.DATASHAPE_FADESPEED = 0.05;  //淡入淡出的速度
Stack.DATASHAPE_MOVESPEED = 2;  //移动速度

//POINTERSHAPE ---> 连接堆栈元素之间的线条

Stack.POINTERSHAPE_WIDTH = 3;	//线条的宽度

Stack.POINTERSHAPE_COLOR = "4DDC12";  //线条的颜色

Stack.POINTERSHAPE_STARTALPHA = 0;   //透明度
Stack.POINTERSHAPE_ENDALPHA = 1;  //淡入淡出的目标透明度

Stack.POINTERSHAPE_FADESPEED = 0.01;  //淡入淡出的速度
Stack.POINTERSHAPE_MOVESPEED = 2;  //移动速度

Stack.prototype = new Algorithm();

Stack.prototype.stackNode = function(value)  //堆栈节点
{
	this.data = value;  
	this.next = null;   //指向下一个堆栈元素
	
	this.DataShape = new Rectangle
	({
		text : value,
		font : Stack.DATASHAPE_FONT,
		width : Stack.DATASHAPE_WIDTH,
		height : Stack.DATASHAPE_HEIGHT,
		backColor : Stack.DATASHAPE_BACKCOLOR,
		edgeColor : Stack.DATASHAPE_EDGECOLOR,
		textColor : Stack.DATASHAPE_TEXTCOLOR,
		moveSpeed : Stack.DATASHAPE_MOVESPEED,
		startAlpha : Stack.DATASHAPE_STARTALPHA,
		endAlpha : Stack.DATASHAPE_ENDALPHA,
		fadeSpeed : Stack.DATASHAPE_FADESPEED,
		Canvas : KJCanvas
	});

	this.PointerShape = new Line
	({
		StartShape : this.DataShape,
		lineColor : Stack.POINTERSHAPE_COLOR,
		lineWidth : Stack.POINTERSHAPE_WIDTH,
		startAlpha : Stack.POINTERSHAPE_STARTALPHA,
		endAlpha : Stack.POINTERSHAPE_ENDALPHA,
		fadeSpeed : Stack.POINTERSHAPE_FADESPEED,
		moveSpeed : Stack.POINTERSHAPE_MOVESPEED,
		Canvas : KJCanvas
	});
}
Stack.prototype.create = function()  //初始化堆栈,并绘制该堆栈
{
	$(".controler").attr("disabled","disabled");  //禁用所有控制元素
	
	this.top = new this.stackNode("top");        //表头
	this.top.next = new this.stackNode("null");  //表尾
	
	KJCanvas.init();        //初始化一个洁白的画板
	KJCanvas.cmd("Setup");  //开始动画动作
	KJCanvas.cmd
	(
		"FadeIn", this.top.DataShape,  //表头淡入
		{
			x : Stack.DATASHAPE_TOP_X,
			y : Stack.DATASHAPE_TOP_Y
		},	
		"Draw", this.top.PointerShape,  
		{
			EndShape : this.top.PointerShape.StartShape,
		}
	);
	KJCanvas.cmd("Delay",Stack.DELAY_TIME);
	KJCanvas.cmd
	(
		"FadeIn", this.top.next.DataShape, //表尾淡入
		{
			x : Stack.DATASHAPE_TOP_X + Stack.DATASHAPE_GAP_X,
			y :	Stack.DATASHAPE_TOP_Y
		},	
		"Move", this.top.PointerShape, //表头指向表尾 
		{
			aim_EndShape : this.top.next.DataShape
		}
	);
	var waitTime = KJCanvas.cmd("END");
	
	var me = this; 
	setTimeout(function()
	{
		$(".controler").removeAttr("disabled");
	}, waitTime);
}
Stack.prototype.push = function( value )
{
	$(".controler").attr("disabled","disabled");  //禁用所有控制元素
	
	var tmp_data = this.top.next;
	this.top.next = new this.stackNode(value);
	this.top.next.next = tmp_data;

	KJCanvas.cmd("Setup");
	KJCanvas.cmd
	(
		"FadeIn", this.top.next.DataShape,   //入栈元素淡入
		{
			x : Stack.DATASHAPE_PUSH_X,
			y : Stack.DATASHAPE_PUSH_Y,
		}
	);
	KJCanvas.cmd("Delay",Stack.DELAY_TIME);
	KJCanvas.cmd
	(
		"Draw", this.top.next.PointerShape,
		{
			EndShape : this.top.next.PointerShape.StartShape,
		}
	);
	KJCanvas.cmd
	(
		"Move", this.top.next.PointerShape,  //入栈元素(新栈顶)指向旧栈顶
		{
			aim_EndShape : this.top.next.next.DataShape,
		}
	);
	KJCanvas.cmd("Delay",Stack.DELAY_TIME);
	KJCanvas.cmd
	(
		"Move", this.top.PointerShape,  //表头指向入栈元素(新栈顶)
		{
			aim_EndShape : this.top.next.DataShape,
		}
	);
	KJCanvas.cmd("Delay",Stack.DELAY_TIME);
	var tmp_pointer = this.top.next;
	KJCanvas.cmd("StartParallel");
	KJCanvas.cmd
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
		KJCanvas.cmd
		(
			"Move",	tmp_pointer.DataShape,
			{
				aim_x : tmp_pointer.DataShape.x + Stack.DATASHAPE_GAP_X,
			}
		);
		tmp_pointer = tmp_pointer.next;
	}
	KJCanvas.cmd("EndParallel");
	var waitTime = KJCanvas.cmd("END");
	
	var me = this; 
	setTimeout(function()
	{
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
	
		KJCanvas.cmd("Setup");	
		KJCanvas.cmd("StartParallel");
		KJCanvas.cmd
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
			KJCanvas.cmd
			(
				"Move", tmp_pointer.next.DataShape,
				{
					aim_x : tmp_pointer.DataShape.x,
					aim_y : tmp_pointer.DataShape.y
				}
			);
			tmp_pointer = tmp_pointer.next;
		}
		KJCanvas.cmd("EndParallel");
		KJCanvas.cmd("Delay",Stack.DELAY_TIME);
		KJCanvas.cmd
			(
				"Move", this.top.PointerShape,  //表头指向新的栈顶
				{
			    	aim_EndShape : this.top.next.next.DataShape
				}
			);
		KJCanvas.cmd("Delay",Stack.DELAY_TIME);
		KJCanvas.cmd
		(
			"FadeOut", this.top.next.PointerShape,
			{
			},
			"FadeOut",this.top.next.DataShape,
			{
			}
		);
		KJCanvas.cmd("Delay",Stack.DELAY_TIME);
	//	KJCanvas.cmd("FadeOut",this.top.next.DataShape,{});//"Delete",this.top.next.PointerShape,{});
		
		var waitTime = KJCanvas.cmd("END");	
		
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
