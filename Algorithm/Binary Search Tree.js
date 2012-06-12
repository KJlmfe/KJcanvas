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
BST.prototype.delete = function( value )
{
	this.disableControlBar();

	Canvas.cmd("Setup");
	var deleteNode = new this.node( value );
	Canvas.cmd
	(
		"Draw", deleteNode.DataShape,
		{
			x : BST.DATASHAPE_INSERT_X,
			y : BST.DATASHAPE_INSERT_Y,
		}
	);
	var tmp = this.root;
	var mother = this.root;
	while(1)
	{
		Canvas.cmd("Delay");
		if(tmp == null)			//没有找到
		{
			Canvas.cmd
			(
				"Other", function(){
					alert("很抱歉，我们没能在BST里找到 " + value + " 删除失败");
				}
			);
			Canvas.cmd("FadeOut", deleteNode.DataShape);
			break;
		}

		Canvas.cmd
		(
			"Move", deleteNode.DataShape,
			{
				aim_x : tmp.DataShape.x,
				aim_y : tmp.DataShape.y + BST.DATASHAPE_GAP_Y,
			}
		);
		
		if(value < tmp.value)
		{
			mother = tmp;
			tmp = tmp.left;
		}
		else if(value > tmp.value)
		{
			mother = tmp;
			tmp = tmp.right;
		}
		else		//找到了
		{
			Canvas.cmd
			(
				"Move", deleteNode.DataShape,
				{
					aim_x : tmp.DataShape.x,
					aim_y : tmp.DataShape.y,
				}
			);
			Canvas.cmd("Delete", deleteNode.DataShape);
			Canvas.cmd("FadeOut", tmp.DataShape);

			if(tmp.left == null && tmp.right == null)  //删除的是叶子节点
			{
				if(mother.left == tmp)
				{
					Canvas.cmd("FadeOut", mother.LeftPointerShape);
					mother.left = null;
				}
				if(mother.right == tmp)
				{
					Canvas.cmd("FadeOut", mother.RightPointerShape);
					mother.right = null;
				}
			}
			else if(tmp.left == null)   //删除的节点只有右儿子
			{	
				Canvas.cmd("StartParallel");
				if(mother.left == tmp)
				{
					Canvas.cmd("Move", mother.LeftPointerShape,
					{
						aimEndShape : tmp.right.DataShape,
					});
					mother.left = tmp.right;
				}
				if(mother.right == tmp)
				{
					Canvas.cmd("Move", mother.RightPointerShape,
					{
						aimEndShape : tmp.right.DataShape,
					});
					mother.right = tmp.right;
				}
				Canvas.cmd("FadeOut", tmp.RightPointerShape);
				Canvas.cmd("EndParallel");
			}
			else if(tmp.right == null)	//删除的节点只有左儿子
			{
				Canvas.cmd("StartParallel");
				if(mother.left == tmp)
				{
					Canvas.cmd("Move", mother.LeftPointerShape,
					{
						aimEndShape : tmp.left.DataShape,
					});
					mother.left = tmp.left;
				}
				if(mother.right == tmp)
				{
					Canvas.cmd("Move", mother.RightPointerShape,
					{
						aimEndShape : tmp.left.DataShape,
					});
					mother.right = tmp.left;
				}
				Canvas.cmd("FadeOut", tmp.LeftPointerShape);
				Canvas.cmd("EndParallel");
			}
			else  //删除的节点有左右两个儿子
			{
				leftMaxNode = tmp.left;    //查找删除节点左子树最大的节点
				leftMaxNodeMother = tmp;
				while(leftMaxNode.right != null)  
				{
					leftMaxNodeMother = leftMaxNode;
					leftMaxNode = leftMaxNode.right;
				}
				//交换删除节点和左子树最大节点的值
				var swapvalue = tmp.value;
				tmp.value = leftMaxNode.value;
				leftMaxNode.value = swapvalue;
				Canvas.cmd("StartParallel");
				var tmpValueShape = new Label
				Canvas.cmd("Move",)
				//将左子树最大节点的父母指向null
				if(leftMaxNodeMother.left == leftMaxNode)
				{
					Canvas.cmd("FadeOut",leftMaxNodeMother.LeftPointerShape);
					leftMaxNodeMother.left = null;
				}
				else
				{
					Canvas.cmd("FadeOut",RightMaxNodeMother.LeftPointerShape);
					leftMaxNodeMother.Right = null;
				}
				//将删除节点的父母指向左子树最大节点
				if(mother.left == tmp)
				{
					Canvas.cmd("Move", mother.LeftPointerShape,
					{
						aimEndShape : leftMaxNode.DataShape,
					});
					mother.left = leftMaxNode;
				}
				else
				{
					Canvas.cmd("Move", mother.RightPointerShape,
					{
						aimEndShape : leftMaxNode.DataShape,
					});
					mother.right = leftMaxNode;
				}
				//将左子树最大节点的左右孩子指向删除节点的左右孩子
				Canvas.cmd("Move",leftMaxNode.LeftPointerShape,{
					aimEndShape : tmp.left.DataShape,
				});
				leftMaxNode.left = tmp.left;
				Canvas.cmd("Move",leftMaxNode.RightPointerShape,{
					aimEndShape : tmp.right.DataShape,
				});
				leftMaxNode.right = tmp.right;
				
				Canvas.cmd("FadeOut",tmp.LeftPointerShape);
				Canvas.cmd("FadeOut",tmp.RightPointerShape);
			}
			break;
		}
	}
	Canvas.cmd("Other",function()
	{
		$(".controler").removeAttr("disabled");		//启用所有控制元素
	});
	Canvas.cmd("End");
}
BST.prototype.find = function( value )
{
	this.disableControlBar();

	Canvas.cmd("Setup");
	var findNode = new this.node( value );
	Canvas.cmd
	(
		"Draw", findNode.DataShape,
		{
			x : BST.DATASHAPE_INSERT_X,
			y : BST.DATASHAPE_INSERT_Y,
		}
	);
	var tmp = this.root;
	while(1)
	{
		Canvas.cmd("Delay");
		if(tmp == null)			//没有找到
		{
			Canvas.cmd
			(
				"Other", function(){
					alert("很抱歉，我们没能在BST里找到 " + value);
				}
			);
			Canvas.cmd("FadeOut", findNode.DataShape);
			break;
		}

		Canvas.cmd
		(
			"Move", findNode.DataShape,
			{
				aim_x : tmp.DataShape.x,
				aim_y : tmp.DataShape.y + BST.DATASHAPE_GAP_Y,
			}
		);
		
		if(value < tmp.value)
			tmp = tmp.left;
		else if(value > tmp.value)
			tmp = tmp.right;
		else		//找到了
		{
			Canvas.cmd("Other",function(){
				alert("恭喜你，我们在BST里找到了 " + value);
			});
			Canvas.cmd
			(
				"Move", findNode.DataShape,
				{
					aim_x : tmp.DataShape.x,
					aim_y : tmp.DataShape.y,
				}
			);
			Canvas.cmd("Delete", findNode.DataShape);
			break;
		}
	}
	Canvas.cmd("Other",function()
	{
		$(".controler").removeAttr("disabled");		//启用所有控制元素
	});
	Canvas.cmd("End");
}
BST.prototype.addControls = function(obj)
{
	$("#AlgorithmName").html(BST.ALGORITHM_NAME);
	this.TextInput = this.addControlBar("text","");
	this.CreatBSTButton = this.addControlBar("button","Delete");
	this.CreatBSTButton.onclick = function(){
		var value = obj.TextInput.value;
		value = parseFloat(value);
		obj.delete( value );
		obj.TextInput.value = "";
	}

	this.PushButton = this.addControlBar("button","Insert");
	this.PushButton.onclick = function(){
		var value = obj.TextInput.value;
		value = parseFloat(value);
		obj.insert(value);	
		obj.TextInput.value = "";
	}

	this.PopButton = this.addControlBar("button","Find");
	this.PopButton.onclick = function(){
		var value = obj.TextInput.value;
		value = parseFloat(value);
		obj.find( value );
		obj.TextInput.value = "";
	}
}
