function init()
{
	Canvas = new KJcanvas();  //用上面的canvas初始化一个全局画板对象(Canvas)
	DataStructure = new BST(); 		   //初始化一个数据结构对象
}

BST = function()
{
	BST.ALGORITHM_NAME = "Binary Search Tree"; 			//动画名称

	BST.DATASHAPE_WIDTH = 28;     //宽度
	BST.DATASHAPE_HEIGHT = 28;   //长度
	BST.DATASHAPE_BACKCOLOR = "#00FF00";  
	BST.DATASHAPE_EDGECOLOR = "#FF4500"; 
	BST.DATASHAPE_TEXTCOLOR = "#0044BB";
	BST.DATASHAPE_MOVESPEED = 6;
	BST.DATASHAPE_FONT = "18px sans-serif";
	BST.DATASHAPE_EDGEWIDTH = 1;

	BST.DATASHAPE_GAP_Y = 40;  //彼此之间的横向间隔
	BST.DATASHAPE_INSERT_X = 20;  //入栈元素的位置
	BST.DATASHAPE_INSERT_Y = 20;
	BST.DATASHAPE_BROTHER_GAP = 1.2;

	BST.DELETESHAPE_MOVESPEED = 2;
	BST.DELETESHAPE_BACKCOLOR = "#FF0000";

	BST.FINDSHAPE_FONT = "18px sans-serif";
	BST.FINDSHAPE_MOVESPEED = 6;
	BST.FINDSHAPE_TEXTCOLOR = "#242424";

	BST.LEFTPOINTERSHAPE_LINECOLOR = "#FF3030"; 
	BST.LEFTPOINTERSHAPE_MOVESPEED = 6;
	BST.LEFTPOINTERSHAPE_EDGEWIDTH = 1;

	BST.RIGHTPOINTERSHAPE_LINECOLOR = "#FFC125"; 
	BST.RIGHTPOINTERSHAPE_MOVESPEED = 6;
	BST.RIGHTPOINTERSHAPE_EDGEWIDTH = 1;

	BST.MAXNODESHAPE_BACKCOLOR = "0f0a03";

	this.addControls();  //给该数据结构演示动画添加用户界面控制器
	this.calcShapeCoord();
	thisBST = this;
}
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
		height : BST.DATASHAPE_HEIGHT,
		x :	Canvas.width/2,
		y :	BST.DATASHAPE_HEIGHT,
		backColor : BST.DATASHAPE_BACKCOLOR,  
		edgeColor : BST.DATASHAPE_EDGECOLOR,
		textColor : BST.DATASHAPE_TEXTCOLOR,
		moveSpeed : BST.DATASHAPE_MOVESPEED,
		font : BST.DATASHAPE_FONT,
		edgeWidth : BST.DATASHAPE_EDGEWIDTH
	});
	this.LeftPointerShape = new Line		//指针图形
	({
		Canvas : Canvas,
		StartShape : this.DataShape,
		EndShape : this.DataShape,
		lineColor : BST.LEFTPOINTERSHAPE_LINECOLOR,
		moveSpeed : BST.LEFTPOINTERSHAPE_MOVESPEED,
		edgeWidth :BST.LEFTPOINTERSHAPE_EDGEWIDTH
	});
	this.RightPointerShape = new Line		//指针图形
	({
		Canvas : Canvas,
		StartShape : this.DataShape,
		EndShape : this.DataShape,
		lineColor : BST.RIGHTPOINTERSHAPE_LINECOLOR,
		moveSpeed : BST.RIGHTPOINTERSHAPE_MOVESPEED,
		edgeWidth :BST.RIGHTPOINTERSHAPE_EDGEWIDTH
	});
}
BST.prototype.create = function(size)
{
	this.disableControlBar();
	if(!isNaN(size) && size!="" && size > 0 && size < Math.pow(2,this.n+1)-1)
		size = size;
	else
		size = Math.pow(2,this.n-1)-1;
	
	var value = parseInt(Math.random()*100);
	this.root = new this.node(value);
	size--;
	while(size)
	{
		var value = parseInt(Math.random()*100);
		var tmpNode = this.root;
		var level = 0;
		while(tmpNode && level < this.n)
		{
			if(value < tmpNode.value)
				if(tmpNode.left == null)
				{
					tmpNode.left = new this.node(value);
					size--;
					break;
				}
				else
					tmpNode = tmpNode.left;
			else if(value > tmpNode.value)
				if(tmpNode.right == null)
				{
					tmpNode.right = new this.node(value);
					size--;
					break;
				}
				else
					tmpNode = tmpNode.right;
			level++;
		}
	}
	Canvas.init();
	Canvas.cmd("Setup");
	this.print();
	Canvas.cmd("Other",function(){
		thisBST.enableControlBar();
	});
	Canvas.cmd("End");
}
BST.prototype.print = function()
{
	if(this.root == null)
		return;
	Canvas.cmd("StartParallel");
	var front = 0;
	var rear = 0;
	var queue = new Array();

	queue[rear++] = 
	{
		node : this.root,
		level_i : 0,
		level_j : 1
	};
	while(front < rear)
	{
		var dequeue = queue[front++];
		if(dequeue.node.left != null)
		{
			queue[rear++] =
			{
				node : dequeue.node.left,
				level_i : dequeue.level_i+1,
				level_j : 2*dequeue.level_j-1
			};
			Canvas.cmd("Draw", dequeue.node.LeftPointerShape,
			{
				EndShape : dequeue.node.left.DataShape
			});
		}
		if(dequeue.node.right != null)
		{
			queue[rear++] =
			{
				node : dequeue.node.right,
				level_i : dequeue.level_i+1,
				level_j : 2*dequeue.level_j
			};
			Canvas.cmd("Draw", dequeue.node.RightPointerShape,
			{
				EndShape : dequeue.node.right.DataShape
			});
		}
		Canvas.cmd("Move", dequeue.node.DataShape,
		{
			aim_x : this.coord[dequeue.level_i][dequeue.level_j]['x'],
			aim_y : this.coord[dequeue.level_i][dequeue.level_j]['y']
		});
	}
	Canvas.cmd("EndParallel");
}
BST.prototype.insert = function(value)
{
	if(isNaN(value) || value=="")
	{
		alert("Please enter a valid number.");
	 	return;
	}
	value = parseFloat(value);
	this.disableControlBar();

	Canvas.cmd("Setup");
	var insertNode = new this.node(value);
	Canvas.cmd("Draw", insertNode.DataShape, 
	{
		x : BST.DATASHAPE_INSERT_X,
		y : BST.DATASHAPE_INSERT_Y,
	});
	if(this.root == null)    //BST不存在，插入的点作为根节点
	{
		Canvas.cmd("Move", insertNode.DataShape, 
		{
			aim_x : this.coord[0][1]['x'],
			aim_y : this.coord[0][1]['y'],
		});
		this.root = insertNode;
	}
	else		//插入的是非根节点
	{
		Canvas.cmd("Move", insertNode.DataShape, 
		{
			aim_x : this.root.DataShape.x,
			aim_y : this.root.DataShape.y + BST.DATASHAPE_GAP_Y,
		});
		var tmp = this.root;
		var level_i = 1;
		var level_j = 1;
		while(1)
		{
			Canvas.cmd("Delay");
			Canvas.cmd("Move", insertNode.DataShape, 
			{
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
				Canvas.cmd("Other", function()
				{
					alert("Insert Failed, " + value + " is already in the tree.");
				});
				Canvas.cmd("FadeOut", insertNode.DataShape);
				break;
			}
			level_i++;
		}
	}
	Canvas.cmd("Other",function()
	{
		thisBST.enableControlBar();
	});
	Canvas.cmd("End");
}
BST.prototype.deleteNode = function(tmpNode,tmpMotherNode)
{
	Canvas.cmd("FadeIn", tmpNode.DataShape, {
	 	backColor : BST.DELETESHAPE_BACKCOLOR,
		fadeSpeed : 0.03
	});
	Canvas.cmd("Delay");

	if(tmpNode.left == null && tmpNode.right == null)  //删除的节点为叶子节点，直接删除该节点
		if(tmpMotherNode == null)		//删除的是根结点
		{
			this.root = null;
			Canvas.cmd("FadeOut",tmpNode.DataShape);	
		}
		else
			if(tmpMotherNode.left == tmpNode)
			{
				tmpMotherNode.left = null;
				Canvas.cmd("FadeOut",tmpMotherNode.LeftPointerShape,"FadeOut",tmpNode.DataShape);
			}
			else
			{
				tmpMotherNode.right = null;
				Canvas.cmd("FadeOut",tmpMotherNode.RightPointerShape,"FadeOut",tmpNode.DataShape);
			}
	else if(tmpNode.right == null)	//删除的节点只有左儿子,删除节点的值用左儿子值替换，然后删除左儿子
		if(tmpMotherNode == null)
		{
			this.root = tmpNode.left;
			Canvas.cmd("FadeOut",tmpNode.DataShape,"FadeOut",tmpNode.LeftPointerShape);
		}
		else
			if(tmpMotherNode.left == tmpNode)
			{
				tmpMotherNode.left = tmpNode.left;
				Canvas.cmd("Move",tmpMotherNode.LeftPointerShape,{
					aimEndShape : tmpMotherNode.left.DataShape,
				},
				"FadeOut",tmpNode.DataShape,
				"FadeOut",tmpNode.LeftPointerShape);
			}
			else
			{
				tmpMotherNode.right = tmpNode.left;
				Canvas.cmd("Move",tmpMotherNode.RightPointerShape,{
					aimEndShape : tmpMotherNode.right.DataShape
				},
				"FadeOut",tmpNode.DataShape,
				"FadeOut",tmpNode.LeftPointerShape);
			}
	else if(tmpNode.left == null)  //删除的节点只有右儿子，同上理
		if(tmpMotherNode == null)
		{
			this.root = tmpNode.right;
			Canvas.cmd("FadeOut",tmpNode.DataShape,"FadeOut",tmpNode.RightPointerShape);
		}
		else
			if(tmpMotherNode.left == tmpNode)
			{
				tmpMotherNode.left = tmpNode.right;
				Canvas.cmd("Move",tmpMotherNode.LeftPointerShape,{
					aimEndShape : tmpMotherNode.left.DataShape,
				},
				"FadeOut",tmpNode.DataShape,
				"FadeOut",tmpNode.RightPointerShape);
			}
			else
			{
				tmpMotherNode.right = tmpNode.right;
				Canvas.cmd("Move",tmpMotherNode.RightPointerShape,{
					aimEndShape : tmpMotherNode.right.DataShape
				},
				"FadeOut",tmpNode.DataShape,
				"FadeOut",tmpNode.RightPointerShape);
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
		tmpNode.value = maxNode.value;
		var copyMaxNode = new this.node(maxNode.value);	
		Canvas.cmd("FadeIn",maxNode.DataShape,{
			backColor : BST.MAXNODESHAPE_BACKCOLOR
		});
		Canvas.cmd("Delay");
		Canvas.cmd("Move",copyMaxNode.DataShape,
		{
			x : maxNode.DataShape.x,
			y : maxNode.DataShape.y,
			aim_x : tmpNode.DataShape.x,
			aim_y : tmpNode.DataShape.y,
			moveSpeed : BST.DELETESHAPE_MOVESPEED
		});
		Canvas.cmd("Draw",tmpNode.DataShape,
		{
			text : tmpNode.value,
			backColor : BST.DATASHAPE_BACKCOLOR
		},
		"FadeOut",copyMaxNode.DataShape);
		Canvas.cmd("Delay");
		this.deleteNode(maxNode,maxMotherNode);
	}
}
BST.prototype.delete = function(value)
{
	if(isNaN(value) || value=="")
	{
		alert("Please enter a valid number.");
	 	return;
	}
	value = parseFloat(value);
	this.disableControlBar();
	Canvas.cmd("Setup");
	
	var tmpNode = this.root;
	var tmpMotherNode = null;

	while(tmpNode != null)   //查找要删除的节点
	{
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
		alert("Delete failed! Can't find " + value + " in the tree.");
	else
	{
		this.deleteNode(tmpNode,tmpMotherNode);
		this.print();
	}
	Canvas.cmd("Other",function(){
		thisBST.enableControlBar();
	});
	Canvas.cmd("End");
}
BST.prototype.find = function( value )
{
	if(isNaN(value) || value=="")
	{
		alert("Please enter a valid number.");
	 	return;
	}
	value = parseFloat(value);
	this.disableControlBar();
	Canvas.cmd("Setup");
	var findValueShape = new Label
	({
		Canvas : Canvas, 
		text : value,
		font : BST.FINDSHAPE_FONT,
		moveSpeed :	BST.FINDSHAPE_MOVESPEED,
		textColor : BST.FINDSHAPE_TEXTCOLOR
	});
	Canvas.cmd("Draw", findValueShape, 
	{
		x : BST.DATASHAPE_INSERT_X,
		y : BST.DATASHAPE_INSERT_Y,
	});

	var tmpNode = this.root;
	while(tmpNode != null)   //查找节点
	{
		Canvas.cmd("Delay");
		Canvas.cmd("Move", findValueShape, 
		{
			aim_x : tmpNode.DataShape.x,
			aim_y : tmpNode.DataShape.y + BST.DATASHAPE_GAP_Y,
		});
		if(value < tmpNode.value)
			tmpNode = tmpNode.left;
		else if(value > tmpNode.value)
			tmpNode = tmpNode.right;
		else		//找到了节点this.InsertButton.onclick = function()
			break;
	}
	
	if(tmpNode == null)  //查找节点不存在
	{
		Canvas.cmd("Other", function() 
		{
			alert("Delete failed，Can't find " + value + " in Tree.");
		});
		Canvas.cmd("FadeOut", findValueShape);
	}
	else      //查找节点存在
	{
		Canvas.cmd("Other",function(){
			alert("Succeeded in finding " + value + " !");
		});
		Canvas.cmd("Move", findValueShape, 
		{
		 	aim_x : tmpNode.DataShape.x,
			aim_y : tmpNode.DataShape.y,
		});
		Canvas.cmd("Delete", findValueShape);
	}

	Canvas.cmd("Other",function() {
		thisBST.enableControlBar();	
	});
	Canvas.cmd("End");
}
BST.prototype.addControls = function()
{
	var obj = this;
	$("#AlgorithmName").html(BST.ALGORITHM_NAME);
	
	this.TextInput = this.addControlBar("text","");
	this.InsertButton = this.addControlBar("button","Insert");
	this.DeleteButton = this.addControlBar("button","Delete");
	this.FindButton = this.addControlBar("button","Find");
	this.CreateButton = this.addControlBar("button","Create a Random Tree");

	this.CreateButton.onclick = function()
	{
		var value = obj.TextInput.value;
		obj.create(value);	
		obj.TextInput.value = "";
	}
	this.InsertButton.onclick = function()
	{
		var value = obj.TextInput.value;
		obj.insert(value);	
		obj.TextInput.value = "";
	}
	this.DeleteButton.onclick = function()
	{
		var value = obj.TextInput.value;
		obj.delete( value );
		obj.TextInput.value = "";
	}
	this.FindButton.onclick = function()
	{
		var value = obj.TextInput.value;
		obj.find( value );
		obj.TextInput.value = "";
	}
}
