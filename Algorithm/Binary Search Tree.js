function init()
{
	Canvas = new KJcanvas();  //用上面的canvas初始化一个全局画板对象(Canvas)
	
	DataStructure = new BST(); 		   //初始化一个数据结构对象
	DataStructure.addControls(DataStructure);  //给该数据结构演示动画添加用户界面控制器
}

BST = function()
{}

BST.ALGORITHM_NAME = "堆栈(链表实现)"; 			//动画名称
BST.EMPTY_INFO = "堆栈里空空如也了,弹不出东西了！";  

//DATASHAPE ---> 堆栈元素矩形

BST.DATASHAPE_WIDTH = 30;     //宽度
BST.DATASHAPE_HEIGHT = 30;   //长度

BST.DATASHAPE_ROOT_X = 400;  //表头(栈顶)的位置
BST.DATASHAPE_ROOT_Y = 20;
BST.DATASHAPE_GAP_Y = 40;  //彼此之间的横向间隔
BST.DATASHAPE_INSERT_X = 0;  //入栈元素的位置
BST.DATASHAPE_INSERT_Y = 0;
BST.DATASHAPE_GAP_CHILD_X = 200;
BST.DATASHAPE_GAP_CHILD_Y = 70;
BST.DATASHAPE_GAP_K = 50;

BST.prototype = new Algorithm();

BST.prototype.node = function(value)  //堆栈节点
{
	this.value = value;  
	this.right = null;   //指向下一个堆栈元素
	this.left = null;

	this.DataShape = new Rectangle		//堆栈元素图形
	({
		Canvas : Canvas,
		text : value,
		width : BST.DATASHAPE_WIDTH,
		height : BST.DATASHAPE_HEIGHT
	});
	
	this.LeftPointerShape = new Line		//指针图形
	({
		Canvas : Canvas,
		StartShape : this.DataShape,
		EndShape : this.DataShape
	});

	this.RightPointerShape = new Line		//指针图形
	({
		Canvas : Canvas,
		StartShape : this.DataShape,
		EndShape : this.DataShape
	});
}
BST.prototype.create = function()  //初始化堆栈,并绘制该堆栈
{
	
	Canvas.init();        //初始化一个洁白的画板
	Canvas.cmd("Setup");  //开始动画动作
	Canvas.cmd
	(
		"FadeIn", this.root.DataShape,  //表头淡入
		{
			x : BST.DATASHAPE_TOP_X,
			y : BST.DATASHAPE_TOP_Y
		}
	);
	Canvas.cmd("Other",function()
	{
		$(".controler").removeAttr("disabled");		//启用所有控制元素
	});
	Canvas.cmd("End");  //结束动画
}
BST.prototype.insert = function( value )
{
	this.disableControlBar();

	Canvas.cmd("Setup");
	var insertNode = new this.node( value );
	Canvas.cmd
	(
		"Draw", insertNode.DataShape,
		{
			x : BST.DATASHAPE_INSERT_X,
			y : BST.DATASHAPE_INSERT_Y,
		}
	);
	if(this.root == null)
	{
		Canvas.cmd
		(
			"Move", insertNode.DataShape,
			{
				aim_x : BST.DATASHAPE_ROOT_X,
				aim_y : BST.DATASHAPE_ROOT_Y,
			}
		);
		this.root = insertNode;
	}
	else
	{
		Canvas.cmd
		(
			"Move", insertNode.DataShape,
			{
				aim_x : this.root.DataShape.x,
				aim_y : this.root.DataShape.y + BST.DATASHAPE_GAP_Y,
			}
		);
		var tmp = this.root;
		var level = 0;
		while(1)
		{
			Canvas.cmd("Delay");
			if(value < tmp.value)
				if(tmp.left == null)
				{
					Canvas.cmd
					(
						"Move", insertNode.DataShape,  
						{
							aim_x : tmp.DataShape.x - (BST.DATASHAPE_GAP_CHILD_X - level * BST.DATASHAPE_GAP_K),
							aim_y : tmp.DataShape.y + BST.DATASHAPE_GAP_CHILD_Y,
						},
						"Move", tmp.LeftPointerShape,
						{
							aimEnd_x : tmp.DataShape.x - (BST.DATASHAPE_GAP_CHILD_X - level * BST.DATASHAPE_GAP_K),
							aimEnd_y : tmp.DataShape.y + BST.DATASHAPE_GAP_CHILD_Y,
						}
					);
					tmp.left = insertNode;
					break;
				}
				else
				{
					tmp = tmp.left;
					Canvas.cmd
					(
						"Move", insertNode.DataShape,   
						{
							aim_x : tmp.DataShape.x,
							aim_y : tmp.DataShape.y + BST.DATASHAPE_GAP_Y,
						}
					);		
				}
			else
				if(tmp.right == null)
				{
					Canvas.cmd
					(
						"Move", insertNode.DataShape,   
						{
							aim_x : tmp.DataShape.x + (BST.DATASHAPE_GAP_CHILD_X - level * BST.DATASHAPE_GAP_K),
							aim_y : tmp.DataShape.y + BST.DATASHAPE_GAP_CHILD_Y,
						},
						"Move", tmp.RightPointerShape,
						{
							aimEnd_x : tmp.DataShape.x + (BST.DATASHAPE_GAP_CHILD_X - level * BST.DATASHAPE_GAP_K),
							aimEnd_y : tmp.DataShape.y + BST.DATASHAPE_GAP_CHILD_Y,
						}
					);
					tmp.right = insertNode;
					break;
				}
				else
				{
					tmp = tmp.right;
					Canvas.cmd
					(
						"Move", insertNode.DataShape,  
						{
							aim_x : tmp.DataShape.x,
							aim_y : tmp.DataShape.y + BST.DATASHAPE_GAP_Y,
						}
					);		
				}
			level++;
		}
	}
	Canvas.cmd("Other",function()
	{
		$(".controler").removeAttr("disabled");		//启用所有控制元素
	});
	Canvas.cmd("End");
}
BST.prototype.pop = function( value )
{
	if(this.root == null)
		alert(BST.EMPTY_INFO);
	else
	{
		this.disableControlBar();
		
		var tmp = this.root;
		var level = 1;
		while(1)
		{
			if(value == tmp.value)
			{
				
			}
			if(value < tmp.value)
				if(tmp.left == null)
				{
					tmp.left = new this.node( value );
					Canvas.cmd
					(
						"FadeIn", tmp.left.DataShape,   //入栈元素淡入
						{
							x : tmp.DataShape.x - 50 + level * 20,
							y : tmp.DataShape.y + 100,
						}
					);		
					break;
				}
				else
					tmp = tmp.left;
			else
				if(tmp.right == null)
				{
					tmp.right = new this.node( value );
					Canvas.cmd
					(
						"FadeIn", tmp.right.DataShape,   //入栈元素淡入
						{
							x : tmp.DataShape.x + 50 + level * 20,
							y : tmp.DataShape.y + 100,
						}
					);		
					break;
				}
				else
					tmp = tmp.right;
			level++;
		}	
		Canvas.cmd("Setup");	
		Canvas.cmd("StartParallel");
		Canvas.cmd
		(
			"Move",	this.top.next.DataShape,  //栈顶出栈
			{
				aim_x : BST.DATASHAPE_PUSH_X,
				aim_y : BST.DATASHAPE_PUSH_Y
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
BST.prototype.addControls = function(obj)
{
	$("#AlgorithmName").html(BST.ALGORITHM_NAME);
	this.TextInput = this.addControlBar("text","");
	this.CreatBSTButton = this.addControlBar("button","Creat BST");
	this.CreatBSTButton.onclick = function(){
		var value = obj.TextInput.value;
		value = parseFloat(value);
		obj.create( value );
		obj.TextInput.value = "";
	}

	this.PushButton = this.addControlBar("button","Push");
	this.PushButton.onclick = function(){
		var value = obj.TextInput.value;
		value = parseFloat(value);
		obj.insert(value);	
		obj.TextInput.value = "";
	}

	this.PopButton = this.addControlBar("button","Pop");
	this.PopButton.onclick = function(){
		obj.pop();
	}
}
