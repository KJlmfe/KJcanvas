function init()
{
	var canvas = document.getElementsByTagName("Canvas")[0]; //初始化Canvas对象
	KJCanvas = new Canvas(canvas);  //将该Canvas对象绑定到该堆栈上
	
	var DataStructure = new Stack();  //初始化一个堆栈对象
	DataStructure.addControls(DataStructure);  //添加堆栈用户动画界面控制器
}

Stack = function()
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

Stack.DATASHAPE_MOVESPEED = 2;  //默认图新移动速度
Stack.POINTERSHAPE_MOVESPEED = 3;
Stack.DELAY_TIME = 1500;

Stack.POINTERSHAPE_COLOR = "4DDC12";
Stack.POINTERSHAPE_WIDTH = 3;

Stack.DATASHAPE_ALPHA = 0;
Stack.DATASHAPE_AIMALPHA = 1;
Stack.DATASHAPE_FADESPEED = 0.05;

Stack.POINTERSHAPE_ALPHA = 0;
Stack.POINTERSHAPE_AIMALPHA = 1;
Stack.POINTERSHAPE_FADESPEED = 0.05;


Stack.prototype = new Algorithm();

Stack.prototype.stackNode = function(value)
{
	this.data = value;
	this.next = null;
	
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
		alpha : Stack.DATASHAPE_ALPHA,
		aimAlpha : Stack.DATASHAPE_AIMALPHA,
		fadeSpeed : Stack.DATASHAPE_FADESPEED,
		Canvas : KJCanvas
	});

	this.PointerShape = new Line
	({
		StartShape : this.DataShape,
		lineColor : Stack.POINTERSHAPE_COLOR,
		lineWidth : Stack.POINTERSHAPE_WIDTH,
		alpha : Stack.POINTERSHAPE_ALPHA,
		aimAlpha : Stack.POINTERSHAPE_AIMALPHA,
		fadeSpeed : Stack.POINTERSHAPE_FADESPEED,
		Canvas : KJCanvas
	});
}
Stack.prototype.create = function()  //初始化堆栈,并绘制该堆栈
{
	this.top = new this.stackNode("top");
	this.top.next = new this.stackNode("null");
	
	KJCanvas.del();
	KJCanvas.clear();
	KJCanvas.cmd("Setup");
	KJCanvas.cmd
	(
		"FadeIn", this.top.DataShape,
		{
			x : Stack.DATASHAPE_TOP_X,
			y : Stack.DATASHAPE_TOP_Y,
		},	

		"FadeIn", this.top.next.DataShape,
		{
			x : Stack.DATASHAPE_TOP_X + Stack.DATASHAPE_GAP_X,
			y :	Stack.DATASHAPE_TOP_Y,
		},
		
		"FadeIn", this.top.PointerShape,
		{
			EndShape : this.top.next.DataShape,
		}
	);
	KJCanvas.cmd("END");
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
		"FadeIn", this.top.next.DataShape,
		{
			x : Stack.DATASHAPE_PUSH_X,
			y : Stack.DATASHAPE_PUSH_Y,
		}
	);
	KJCanvas.cmd("Delay",Stack.DELAY_TIME);
	KJCanvas.cmd
	(
		"FadeIn", this.top.next.PointerShape,
		{
			EndShape : this.top.next.PointerShape.StartShape,
		}
	);
	KJCanvas.cmd
	(
		"Move", this.top.next.PointerShape,
		{
			aim_EndShape : this.top.next.next.DataShape,
		}
	);
	
	KJCanvas.cmd("Delay",Stack.DELAY_TIME);
	KJCanvas.cmd
	(
		"Move", this.top.PointerShape,
		{
			aim_EndShape : this.top.next.DataShape,
			moveSpeed : 1
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
	
		KJCanvas.cmd("Setup");	
		KJCanvas.cmd("StartParallel");
		KJCanvas.cmd
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
				"Move", this.top.PointerShape,
				{
			    	aim_EndShape : this.top.next.next.DataShape
				}
			);
		KJCanvas.cmd("Delay",Stack.DELAY_TIME);
		KJCanvas.cmd
		(
			"Move", this.top.next.PointerShape,
			{
				aim_EndShape : this.top.next.PointerShape.StartShape,
				moveSpeed : 0.5
			}
		)
		KJCanvas.cmd("Delete",this.top.next.DataShape,{},"Delete",this.top.next.PointerShape,{});
		
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
