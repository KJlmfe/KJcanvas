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

BST.DATASHAPE_ROOT_X = 500;  //表头(栈顶)的位置
BST.DATASHAPE_ROOT_Y = 20;
BST.DATASHAPE_GAP_Y = 50;  //彼此之间的横向间隔
BST.DATASHAPE_INSERT_X = 0;  //入栈元素的位置
BST.DATASHAPE_INSERT_Y = 0;
BST.DATASHAPE_GAP_CHILD_X = 200;
BST.DATASHAPE_GAP_CHILD_Y = 70;
BST.DATASHAPE_GAP_K = 20;

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
BST.prototype.insert = function( value )
{
	this.disableControlBar();

	Canvas.cmd("Setup");
	var insertNode = new this.node( value );
	Canvas.cmd("Draw", insertNode.DataShape, {
		x : BST.DATASHAPE_INSERT_X,
		y : BST.DATASHAPE_INSERT_Y,
	});
	if(this.root == null)    //BST不存在，插入的点作为根节点
	{
		Canvas.cmd("Move", insertNode.DataShape, {
			aim_x : BST.DATASHAPE_ROOT_X,
			aim_y : BST.DATASHAPE_ROOT_Y,
		});
		this.root = insertNode;
	}
	else		//插入的是非根节点
	{
		Canvas.cmd("Move", insertNode.DataShape, {
			aim_x : this.root.DataShape.x,
			aim_y : this.root.DataShape.y + BST.DATASHAPE_GAP_Y,
		});
		var tmp = this.root;
		var level = 1;
		while(1)
		{
			Canvas.cmd("Delay");
			Canvas.cmd("Move", insertNode.DataShape, {
				aim_x : tmp.DataShape.x,
				aim_y : tmp.DataShape.y + BST.DATASHAPE_GAP_Y,
			});		
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
							alpha : 1,
							EndShape : tmp.DataShape,
							aimEnd_x : tmp.DataShape.x - (BST.DATASHAPE_GAP_CHILD_X - level * BST.DATASHAPE_GAP_K),
							aimEnd_y : tmp.DataShape.y + BST.DATASHAPE_GAP_CHILD_Y,
						}
					);
					tmp.left = insertNode;
					break;
				}
				else
					tmp = tmp.left;
			else if(value > tmp.value)
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
					tmp = tmp.right;
			else
			{
				Canvas.cmd("Other", function(){
					alert(value + " 已经在BST里存在, 插入失败!");
				});
				Canvas.cmd("FadeOut", insertNode.DataShape);
				break;
			}
			level++;
		}
	}
	Canvas.cmd("Other",function(){
		$(".controler").removeAttr("disabled");		//启用所有控制元素
	});
	Canvas.cmd("End");
}
BST.prototype.delete = function( value )
{
	this.disableControlBar();
	
	Canvas.cmd("Setup");
	var deleteValueShape = new Label({Canvas : Canvas, text : value});
	Canvas.cmd("Draw", deleteValueShape, {
		x : BST.DATASHAPE_INSERT_X,
		y : BST.DATASHAPE_INSERT_Y,
	});

	var tmpNode = this.root;
	var tmpMotherNode = null;
	var deleteMotherNode = null, deleteNode = null, swapNode = null;

	while(tmpNode != null)   //查找要删除的节点
	{
		Canvas.cmd("Delay");
		Canvas.cmd("Move", deleteValueShape, {
			aim_x : tmpNode.DataShape.x,
			aim_y : tmpNode.DataShape.y + BST.DATASHAPE_GAP_Y,
		});
		if(value < tmpNode.value)
		{
			tmpMotherNode = tmpNode;
			tmpNode = tmpNode.left;
		}
		else if(value > tmpNode.value)
		{
			tmpMotherNode = tmpNode;
			tmpNode = tmpNode.right;
		}
		else		//找到了要删除的节点
			break;
	}

	if(tmpNode == null)  //删除节点不存在
	{
		Canvas.cmd
		(
			"Other", function(){
				alert("很抱歉，我们没能在BST里找到 " + value + " 删除失败");
			}
		);
		Canvas.cmd("FadeOut", deleteValueShape);
	}
	else      //删除节点存在
	{
		Canvas.cmd("Move", deleteValueShape, {
		 	aim_x : tmpNode.DataShape.x,
			aim_y : tmpNode.DataShape.y,
		});
		Canvas.cmd("Delete", deleteValueShape);

		if(tmpNode.left == null && tmpNode.right == null)  //删除的节点为叶子节点，直接删除该节点
		{
			swapNode = null;
			deleteNode = tmpNode;
			deleteMotherNode = tmpMotherNode;
		}
		else if(tmpNode.right == null)	//删除的节点只有左儿子,删除节点的值用左儿子值替换，然后删除左儿子
		{
			swapNode = tmpNode.left;
			deleteNode = tmpNode.left;
			deleteMotherNode = tmpNode;
		}
		else if(tmpNode.left == null)  //删除的节点只有右儿子，同上理
		{
			swapNode = tmpNode.right;
			deleteNode = tmpNode.right;
			deleteMotherNode = tmpNode;
		}
		else	//删除的节点有左右两个儿子，删除节点的值用左子树最大节点替换，然后删除左子树最大节点
		{
			var maxNode = tmpNode.left;  //查找删除节点左子树最大的节点
			var maxMotherNode = tmpNode;
			while(maxNode.right != null)
			{
				maxMotherNode = maxNode;
				maxNode = maxNode.right;
			}
		
			swapNode = maxNode;
			deleteNode = maxNode;
			deleteMotherNode = maxMotherNode;
		}
		
		if(swapNode != null)	//删除节点的值用swapNode节点的值替换
		{
			tmpNode.value = swapNode.value;
			var swapValueShape = new Label({Canvas : Canvas, text : swapNode.value});
			Canvas.cmd("Move", swapValueShape,{
				x : swapNode.DataShape.x,
				y : swapNode.DataShape.y,
				aim_x : tmpNode.DataShape.x,
				aim_y : tmpNode.DataShape.y,
			});
			Canvas.cmd("Draw", tmpNode.DataShape,{text : swapNode.value}, "Delete", swapValueShape);
		}
		if(deleteMotherNode != null)	//删除最终需要删除的节点(1.原删除节点2.原删除节点左儿子3.原删除节点右儿子4原删除节点左子树最大节点)
			if(deleteMotherNode.left == deleteNode)
				if(deleteNode.left != null)
				{
					deleteMotherNode.left = deleteNode.left;
					Canvas.cmd("Move", delteMotherNode.LeftPointerShape,{aimEndShape : deleteNode.left.DataShape});
					Canvas.cmd("FadeOut", deleteNode.DataShape, "FadeOut", deleteNode.LeftPointerShape);
				}
				else if(deleteNode.right != null)
				{
					deleteMotherNode.left = deleteNode.right;
					Canvas.cmd("Move", delteMotherNode.LeftPointerShape,{aimEndShape : deleteNode.right.DataShape});
					Canvas.cmd("FadeOut", deleteNode.DataShape, "FadeOut", deleteNode.RightPointerShape);
				}
				else
				{
					deleteMotherNode.left = null;
					Canvas.cmd("FadeOut", deleteNode.DataShape, "FadeOut", deleteMotherNode.LeftPointerShape);
				}
			else
				if(deleteNode.left != null)
				{
					deleteMotherNode.right = deleteNode.left;
					Canvas.cmd("Move", delteMotherNode.RightPointerShape,{aimEndShape : deleteNode.left.DataShape});
					Canvas.cmd("FadeOut", deleteNode.DataShape, "FadeOut", deleteNode.LeftPointerShape);
				}
				else if(deleteNode.right != null)
				{
					deleteMotherNode.right = deleteNode.right;
					Canvas.cmd("Move", delteMotherNode.RightPointerShape,{aimEndShape : deleteNode.right.DataShape});
					Canvas.cmd("FadeOut", deleteNode.DataShape, "FadeOut", deleteNode.RightPointerShape);
				}
				else
				{
					deleteMotherNode.right = null;
					Canvas.cmd("FadeOut", deleteNode.DataShape, "FadeOut", deleteMotherNode.RightPointerShape);
				}
		else	//删除的是根节点
		{
			this.root = null;
			Canvas.cmd("FadeOut", deleteNode.DataShape);
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
	var findValueShape = new Label({Canvas : Canvas, text : value});
	Canvas.cmd("Draw", findValueShape, {
		x : BST.DATASHAPE_INSERT_X,
		y : BST.DATASHAPE_INSERT_Y,
	});

	var tmpNode = this.root;
	while(tmpNode != null)   //查找节点
	{
		Canvas.cmd("Delay");
		Canvas.cmd("Move", findValueShape, {
			aim_x : tmpNode.DataShape.x,
			aim_y : tmpNode.DataShape.y + BST.DATASHAPE_GAP_Y,
		});
		if(value < tmpNode.value)
			tmpNode = tmpNode.left;
		else if(value > tmpNode.value)
			tmpNode = tmpNode.right;
		else		//找到了节点
			break;
	}
	
	if(tmpNode == null)  //查找节点不存在
	{
		Canvas.cmd("Other", function() {
				alert("很抱歉，我们没能在BST里找到 " + value + " 删除失败");
		});
		Canvas.cmd("FadeOut", findValueShape);
	}
	else      //查找节点存在
	{
		Canvas.cmd("Other",function(){
			alert("恭喜你，我们在BST里找到了 " + value);
		});
		Canvas.cmd("Move", findValueShape, {
		 	aim_x : tmpNode.DataShape.x,
			aim_y : tmpNode.DataShape.y,
		});
		Canvas.cmd("Delete", findValueShape);
	}

	Canvas.cmd("Other",function() {
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
