function init()
{
	Canvas = new KJcanvas();  //用上面的canvas初始化一个全局画板对象(Canvas)
	
	DataStructure = new BST(); 		   //初始化一个数据结构对象
	DataStructure.addControls(DataStructure);  //给该数据结构演示动画添加用户界面控制器
	DataStructure.calcShapeCoord();
//	DataStructure.create();
}

BST = function()
{}

BST.ALGORITHM_NAME = "二分查找树"; 			//动画名称

//DATASHAPE ---> 堆栈元素矩形

BST.DATASHAPE_WIDTH = 30;     //宽度
BST.DATASHAPE_HEIGHT = 30;   //长度

BST.DATASHAPE_ROOT_X = 500;  //表头(栈顶)的位置
BST.DATASHAPE_ROOT_Y = 20;
BST.DATASHAPE_GAP_Y = 40;  //彼此之间的横向间隔
BST.DATASHAPE_INSERT_X = 20;  //入栈元素的位置
BST.DATASHAPE_INSERT_Y = 20;
BST.DATASHAPE_BROTHER_GAP = 1.2;

BST.prototype = new Algorithm();

BST.prototype.calcShapeCoord = function()
{
	this.coord = new Array();
	for(this.n=0;;this.n++)
	{
		var maxLen = Math.pow(2,this.n-1)*BST.DATASHAPE_WIDTH + (Math.pow(2,this.n-1)+1)*BST.DATASHAPE_BROTHER_GAP*BST.DATASHAPE_WIDTH;
		if(maxLen >= Canvas.width)
		{
			this.n-1;
			break;
		}
	}
	var n = Canvas.height / BST.DATASHAPE_HEIGHT - 1;
	this.n = n < this.n ? n : this.n;
	var minChildGap = Canvas.width / (Math.pow(2,this.n-1)+BST.DATASHAPE_BROTHER_GAP*(Math.pow(2,this.n-1)+1));
	var motherChildGap = Canvas.height / (this.n + 2);

	for(var i=this.n;i>=0;i--)
	{
		this.coord[i] = new Array();
		for(var j=1;j<=Math.pow(2,i);j++)
		{
			this.coord[i][j] = new Array();
			if(i==this.n)
			{
				if(j==1) 
					this.coord[i][j]['x'] = 0;
				else if(j%2 == 1)
					this.coord[i][j]['x'] = this.coord[i][j-1]['x'] + BST.DATASHAPE_BROTHER_GAP * minChildGap;
				else
					this.coord[i][j]['x'] = this.coord[i][j-1]['x'] + minChildGap;
			}
			else
				this.coord[i][j]['x'] = (this.coord[i+1][2*j-1]['x'] + this.coord[i+1][2*j]['x']) / 2;
			this.coord[i][j]['y'] = motherChildGap*(i+1);
		}
	}
}
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
BST.prototype.create = function()
{
	var me = this;
	setInterval(function(){
		me.insert(Math.floor(Math.random()*100));
	},3000);
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
			aim_x : this.coord[0][1]['x'],
			aim_y : this.coord[0][1]['y'],
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
		var level_i = 1;
		var level_j = 1;
		while(1)
		{
			Canvas.cmd("Delay");
			Canvas.cmd("Move", insertNode.DataShape, {
				aim_x : tmp.DataShape.x,
				aim_y : tmp.DataShape.y + BST.DATASHAPE_GAP_Y,
			});	
			if(value < tmp.value)
			{
				level_j = (level_j-1)*2+1;
				if(tmp.left == null)
				{	
					Canvas.cmd
					(
						"Move", insertNode.DataShape,  
						{
							aim_x : this.coord[level_i][level_j]['x'],
							aim_y : this.coord[level_i][level_j]['y'],
						},
						"Move", tmp.LeftPointerShape,
						{
							alpha : 1,
							EndShape : tmp.DataShape,
							aimEnd_x : this.coord[level_i][level_j]['x'],
							aimEnd_y : this.coord[level_i][level_j]['y'],
						}
					);
					tmp.left = insertNode;
					break;
				}
				else
					tmp = tmp.left;
			}
			else if(value > tmp.value)
			{
				level_j *= 2;
				if(tmp.right == null)
				{
					Canvas.cmd
					(
						"Move", insertNode.DataShape,   
						{
							aim_x : this.coord[level_i][level_j]['x'],
							aim_y : this.coord[level_i][level_j]['y'],
						},
						"Move", tmp.RightPointerShape,
						{
							alpha : 1,
							EndShape : tmp.DataShape,
							aimEnd_x : this.coord[level_i][level_j]['x'],
							aimEnd_y : this.coord[level_i][level_j]['y'],
						}
					);
					tmp.right = insertNode;
					break;
				}
				else
					tmp = tmp.right;
			}
			else
			{
				Canvas.cmd("Other", function(){
					alert(value + " 已经在BST里存在, 插入失败!");
				});
				Canvas.cmd("FadeOut", insertNode.DataShape);
				break;
			}
			level_i++;
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
					Canvas.cmd("Move", deleteMotherNode.LeftPointerShape,{aimEndShape : deleteNode.left.DataShape});
					Canvas.cmd("FadeOut", deleteNode.DataShape, "FadeOut", deleteNode.LeftPointerShape);
				}
				else if(deleteNode.right != null)
				{
					deleteMotherNode.left = deleteNode.right;
					Canvas.cmd("Move", deleteMotherNode.LeftPointerShape,{aimEndShape : deleteNode.right.DataShape});
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
					Canvas.cmd("Move", deleteMotherNode.RightPointerShape,{aimEndShape : deleteNode.left.DataShape});
					Canvas.cmd("FadeOut", deleteNode.DataShape, "FadeOut", deleteNode.LeftPointerShape);
				}
				else if(deleteNode.right != null)
				{
					deleteMotherNode.right = deleteNode.right;
					Canvas.cmd("Move", deleteMotherNode.RightPointerShape,{aimEndShape : deleteNode.right.DataShape});
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
	this.InsertButton = this.addControlBar("button","Insert");
	this.DeleteButton = this.addControlBar("button","Delete");
	this.FindButton = this.addControlBar("button","Find");
	
	this.InsertButton.onclick = function(){
		var value = obj.TextInput.value;
		value = parseFloat(value);
		obj.insert(value);	
		obj.TextInput.value = "";
	}

	this.DeleteButton.onclick = function(){
		var value = obj.TextInput.value;
		value = parseFloat(value);
		obj.delete( value );
		obj.TextInput.value = "";
	}

	this.FindButton.onclick = function(){
		var value = obj.TextInput.value;
		value = parseFloat(value);
		obj.find( value );
		obj.TextInput.value = "";
	}
}
