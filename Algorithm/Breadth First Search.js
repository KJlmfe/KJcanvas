function init()
{
	Canvas = new KJcanvas();  //用上面的canvas初始化一个全局画板对象(Canvas)
	DataStructure = new BFS(); 		   //初始化一个数据结构对象
}

BFS = function()
{
	BFS.ALGORITHM_NAME = "Breadth-first search(Adjacency matrix storage)"; 			//动画名称
	BFS.SIZE = 7;	

	BFS.MAP_VERTEX_WIDTH = 33;     //宽度
	BFS.MAP_VERTEX_HEIGHT = 33;   //长度
	BFS.MAP_VERTEX_X = 200;  //邻接矩阵MapShape[0][0]的位置
	BFS.MAP_VERTEX_Y = 160;
	BFS.MAP_VERTEX_BACKCOLOR = "FFF";
	BFS.MAP_VERTEX_EDGECOLOR = "000";
	BFS.MAP_VERTEX_TEXTCOLOR = "#F00";
	BFS.MAP_VERTEX_FONT = "18px sans-serif";
	BFS.MAP_VERTEX_EDGEWIDTH = 1;

	BFS.MAP_SERIAL_NUMBER_FONT = "16px sans-serif";
	BFS.MAP_SERIAL_NUMBER_TEXTCOLOR = "000";

	BFS.VISITED_VERTEX_WIDTH = 33;
	BFS.VISITED_VERTEX_HEIGHT = 33;
	BFS.VISITED_VERTEX_X = 200;  //访问标志VisitedShape[0]的位置
	BFS.VISITED_VERTEX_Y = 60;
	BFS.VISITED_VERTEX_BACKCOLOR = "FFF";
	BFS.VISITED_VERTEX_TRUE_BACKCOLOR = "FF0";
	BFS.VISITED_VERTEX_EDGECOLOR = "000";
	BFS.VISITED_VERTEX_TEXTCOLOR = "#F00";
	BFS.VISITED_VERTEX_TRUE_TEXTCOLOR = "#00f";
	BFS.VISITED_VERTEX_FONT = "12px sans-serif";
	BFS.VISITED_VERTEX_EDGEWIDTH = 1;

	BFS.VISITED_SERIAL_NUMBER_FONT = "16px sans-serif";
	BFS.VISITED_SERIAL_NUMBER_TEXTCOLOR = "000";

	BFS.VERTEX_SHAPE_X = 20;
	BFS.VERTEX_SHAPE_Y = 20;
	BFS.VERTEX_SHAPE_FONT = "22px sans-serif";
	BFS.VERTEX_SHAPE_TEXTCOLOR = "#ee1289";
	BFS.VERTEX_SHAPE_MOVESPEED = 5;

	BFS.QUEUE_X = 540;
	BFS.QUEUE_Y = 220;
	BFS.QUEUE_GAP = 23;	
	BFS.QUEUE_FRONT_POINTER_X = 540;
	BFS.QUEUE_FRONT_POINTER_Y = BFS.QUEUE_Y - 70;
	BFS.QUEUE_FRONT_POINTER_LINEWIDTH = 2; 
	BFS.QUEUE_FRONT_POINTER_LINECOLOR = "#1E90FF"
	BFS.QUEUE_FRONT_POINTER_MOVESPEED = 2;
	BFS.QUEUE_FRONT_POINTER_TEXTCOLOR = "#FF7F00";
	BFS.QUEUE_FRONT_POINTER_FONT = "16px sans-serif";

	BFS.QUEUE_REAR_POINTER_X = 540;
	BFS.QUEUE_REAR_POINTER_Y = BFS.QUEUE_Y + 70;
	BFS.QUEUE_REAR_POINTER_LINEWIDTH = 1; 
	BFS.QUEUE_REAR_POINTER_LINECOLOR = "f00"
	BFS.QUEUE_REAR_POINTER_MOVESPEED = 2;
	BFS.QUEUE_REAR_POINTER_TEXTCOLOR = "0f0";
	BFS.QUEUE_REAR_POINTER_FONT = "16px sans-serif";

	BFS.END_VERTEX_SHAPE_FONT = "22px sans-serif";
	BFS.END_VERTEX_SHAPE_TEXTCOLOR = "#698b69";
	BFS.END_VERTEX_SHAPE_MOVESPEED = 1;

	BFS.SCAN_MAP_LINE_LINECOLOR = "#8B008B";
	BFS.SCAN_MAP_LINE_LINEWIDTH = 2;
	BFS.SCAN_MAP_LINE_MOVESPEED = 3;

	BFS.SCAN_VISITED_LINE_LINECOLOR = "#32CD32";
	BFS.SCAN_VISITED_LINE_LINEWIDTH = 2;
	BFS.SCAN_VISITED_LINE_MOVESPEED = 3;

	BFS.DEQUEUE_SHAPE_X = 600;
	BFS.DEQUEUE_SHAPE_Y = 50;
	BFS.DEQUEUE_SHAPE_GAP = 25;
	BFS.DEQUEUE_SHAPE_FONT = "22px sans-serif";
	BFS.DEQUEUE_SHAPE_TEXTCOLOR = "#228B22";
	BFS.DEQUEUE_SHAPE_MOVESPEED = 1;

	this.addControls();  //给该数据结构演示动画添加用户界面控制器
	thisBFS = this;
}
BFS.prototype = new Algorithm();
BFS.prototype.create = function(size)  //初始化堆栈,并绘制该堆栈
{
	this.size = BFS.SIZE;
	if(Positive_Integer.test(size))
		this.size = parseInt(size);
	
	this.map = new Array();
	this.visited = new Array();
	this.DequeueVertexShape = new Array();
	this.dequeueCnt = 0;

	for(var i=0; i<this.size; i++)
	{
		this.visited[i] = false;   //0代表没有访问过
		this.map[i] = new Array();
		for(var j=0; j<this.size; j++)
			if(i==j)
				this.map[i][j] = 0;  //自己到自己无边
			else
				this.map[i][j] = Math.floor(Math.random()*100) % 2; //1表示从i到j有边
	}
	//绘制邻接矩阵
	Canvas.init();        //初始化一个洁白的画板
	Canvas.cmd("Setup");  //开始动画动作
	Canvas.cmd("StartParallel");
	this.MapShape = new Array();
	for(var i=0; i<this.size; i++)
	{
		this.MapShape[i] = new Array();
		for(var j=0; j<this.size; j++)
		{
			var text = this.map[i][j];
			text = text == 0 ? "" : text; 
			this.MapShape[i][j] = new Rectangle
			({
				Canvas : Canvas,
				text : text,
				width : BFS.MAP_VERTEX_WIDTH,
				height : BFS.MAP_VERTEX_HEIGHT,
				x : BFS.MAP_VERTEX_X+j*BFS.MAP_VERTEX_WIDTH,
				y : BFS.MAP_VERTEX_Y+i*BFS.MAP_VERTEX_HEIGHT,
				backColor : BFS.MAP_VERTEX_BACKCOLOR,
				edgeColor : BFS.MAP_VERTEX_EDGECOLOR,
				textColor : BFS.MAP_VERTEX_TEXTCOLOR,
				font : BFS.MAP_VERTEX_FONT,
				edgeWidth : BFS.MAP_VERTEX_EDGEWIDTH
			}); 
			Canvas.cmd("Draw", this.MapShape[i][j]);
		}
	}
	for(var i=0; i<this.size; i++)
	{
		var vertexShape = new Label
		({
			Canvas : Canvas,
			text : i,
			x : this.MapShape[i][0].x - BFS.MAP_VERTEX_WIDTH, 
			y : this.MapShape[i][0].y,
			font :	BFS.MAP_SERIAL_NUMBER_FONT,
			textColor :	BFS.MAP_SERIAL_NUMBER_TEXTCOLOR
		});
		Canvas.cmd("Draw", vertexShape);
		var vertexShape = new Label
		({
			Canvas : Canvas,
			text : i,
			x : this.MapShape[0][i].x, 
			y : this.MapShape[0][i].y - BFS.MAP_VERTEX_HEIGHT,
			font :	BFS.MAP_SERIAL_NUMBER_FONT,
			textColor :	BFS.MAP_SERIAL_NUMBER_TEXTCOLOR
		});
		Canvas.cmd("Draw", vertexShape);
	}
	
	//绘制访问标志数组
	this.VisitedShape = new Array();
	for(var i=0; i<this.size; i++)
	{
		this.VisitedShape[i] = new Rectangle
		({
			Canvas : Canvas,
			text : this.visited[i],
			width : BFS.VISITED_VERTEX_WIDTH,
			height : BFS.VISITED_VERTEX_HEIGHT,
			x : BFS.VISITED_VERTEX_X+i*BFS.VISITED_VERTEX_WIDTH,
			y : BFS.VISITED_VERTEX_Y,
			backColor : BFS.VISITED_VERTEX_BACKCOLOR,
			edgeColor : BFS.VISITED_VERTEX_EDGECOLOR,
			textColor : BFS.VISITED_VERTEX_TEXTCOLOR,
			font : BFS.VISITED_VERTEX_FONT,
			edgeWidth : BFS.VISITED_VERTEX_EDGEWIDTH
		});
		var vertexShape = new Label
		({
			Canvas : Canvas,
			text : i,
			x : this.VisitedShape[i].x,
			y : this.VisitedShape[i].y - BFS.VISITED_VERTEX_HEIGHT,
			font : BFS.VISITED_SERIAL_NUMBER_FONT,
			textColor : BFS.VISITED_SERIAL_NUMBER_TEXTCOLOR
		});
		Canvas.cmd("Draw", this.VisitedShape[i], "Draw", vertexShape);
	}

	this.QueueShape = new Array();
	this.FrontPointer = new Line
	({
		Canvas : Canvas,
		start_x : BFS.QUEUE_X,
		start_y : BFS.QUEUE_Y - 20,
		end_x : BFS.QUEUE_FRONT_POINTER_X,
		end_y : BFS.QUEUE_FRONT_POINTER_Y + 20,
		lineWidth : BFS.QUEUE_FRONT_POINTER_LINEWIDTH,
		lineColor : BFS.QUEUE_FRONT_POINTER_LINECOLOR,
		moveSpeed : BFS.QUEUE_FRONT_POINTER_MOVESPEED
	});
	this.FrontShape = new Label
	({
		Canvas : Canvas,
		text : "front",
		x : BFS.QUEUE_FRONT_POINTER_X,
		y : BFS.QUEUE_FRONT_POINTER_Y,
		textColor : BFS.QUEUE_FRONT_POINTER_TEXTCOLOR,
		font : BFS.QUEUE_FRONT_POINTER_FONT,
		moveSpeed : BFS.QUEUE_FRONT_POINTER_MOVESPEED
	});
	this.RearPointer = new Line
	({
		Canvas : Canvas,
		start_x : BFS.QUEUE_X,
		start_y : BFS.QUEUE_Y + 20,
		end_x : BFS.QUEUE_REAR_POINTER_X,
		end_y : BFS.QUEUE_REAR_POINTER_Y - 20,
		lineWidth : BFS.QUEUE_REAR_POINTER_LINEWIDTH,
		lineColor : BFS.QUEUE_REAR_POINTER_LINECOLOR,
		moveSpeed : BFS.QUEUE_REAR_POINTER_MOVESPEED
	});
	this.RearShape = new Label
	({
		Canvas : Canvas,
		text : "rear",
		x : BFS.QUEUE_REAR_POINTER_X,
		y : BFS.QUEUE_REAR_POINTER_Y,
		textColor : BFS.QUEUE_REAR_POINTER_TEXTCOLOR,
		font : BFS.QUEUE_REAR_POINTER_FONT,
		moveSpeed : BFS.QUEUE_REAR_POINTER_MOVESPEED
	});
	Canvas.cmd
	(
		"Draw", this.FrontPointer, 
		"Draw", this.FrontShape, 
		"Draw", this.RearPointer, 
		"Draw", this.RearShape
	);
	this.bfsQueue = new Array(); 
	this.front = 0;
	this.rear = 0;

	Canvas.cmd("EndParallel");
	Canvas.cmd("Other", function()
	{
		thisBFS.enableControlBar();
	});
	Canvas.cmd("End");
}
BFS.prototype.bfs = function(vertex)  //从vertex点开始bfs
{
	this.disableControlBar();
	if(!(NonNegative_Integer.test(vertex) && parseInt(vertex) < this.size))
	{
		alert("Please enter a breadth-first search starting vertex(from 0 - "+(this.size-1)+").");
		this.enableControlBar();
		return;
	}
	vertex = parseInt(vertex);

	Canvas.cmd("Setup");
	var StartVertexShape = new Label
	({
		Canvas : Canvas,
		text : vertex,
		x : BFS.VERTEX_SHAPE_X,
		y : BFS.VERTEX_SHAPE_Y,
		font : BFS.VERTEX_SHAPE_FONT,
		textColor : BFS.VERTEX_SHAPE_TEXTCOLOR,
		moveSpeed : BFS.VERTEX_SHAPE_MOVESPEED
	});
	Canvas.cmd("Move",StartVertexShape,
	{
		aim_x : this.VisitedShape[vertex].x,
		aim_y :	this.VisitedShape[vertex].y + BFS.VISITED_VERTEX_HEIGHT
	});
	if(this.visited[vertex] == false)
	{
		Canvas.cmd("FadeIn", this.VisitedShape[vertex], 
		{
			text : "true",
			backColor : BFS.VISITED_VERTEX_TRUE_BACKCOLOR,
			textColor : BFS.VISITED_VERTEX_TRUE_TEXTCOLOR
		});
		this.visited[vertex] = true;

		this.QueueShape[this.rear] = StartVertexShape;
		Canvas.cmd("Move", this.QueueShape[this.rear],
		{
			aim_x : BFS.QUEUE_X + this.rear * BFS.QUEUE_GAP,
			aim_y : BFS.QUEUE_Y
		});
		this.bfsQueue[this.rear++] = vertex; //入队
		Canvas.cmd
		(
			"Move", this.RearShape,
			{ 
				aim_x : BFS.QUEUE_X + this.rear * BFS.QUEUE_GAP,
			},
			"Move", this.RearPointer,
			{
				aimStart_x : BFS.QUEUE_X + this.rear * BFS.QUEUE_GAP,
				aimEnd_x   : BFS.QUEUE_X + this.rear * BFS.QUEUE_GAP
			}
		);
	}
	else
		alert("Breadth-first search is finished.");
	
	while(this.front < this.rear)  //队列非空
	{
		Canvas.cmd("Delay");
		var StartVertexShape = this.QueueShape[this.front];
		Canvas.cmd("StartParallel");	
		var vertex = this.bfsQueue[this.front++];  //出队
		this.DequeueVertexShape[this.dequeueCnt] = new Label
		({
			Canvas : Canvas,
			text : vertex,
			x : BFS.QUEUE_X + this.front * BFS.QUEUE_GAP,
			y : BFS.QUEUE_Y,
			aim_x : BFS.DEQUEUE_SHAPE_X + this.dequeueCnt * BFS.DEQUEUE_SHAPE_GAP,
			aim_y : BFS.DEQUEUE_SHAPE_Y,	
			font : BFS.DEQUEUE_SHAPE_FONT,
			textColor : BFS.DEQUEUE_SHAPE_TEXTCOLOR,
			moveSpeed : BFS.DEQUEUE_SHAPE_MOVESPEED
		});
		Canvas.cmd
		(
			"Move", this.FrontShape,
			{
				aim_x : BFS.QUEUE_X + this.front * BFS.QUEUE_GAP
			},
			"Move", this.FrontPointer,
			{
				aimStart_x : BFS.QUEUE_X + this.front * BFS.QUEUE_GAP,
				aimEnd_x   : BFS.QUEUE_X + this.front * BFS.QUEUE_GAP
			}
		);
		Canvas.cmd
		(
			"Move",StartVertexShape,
			{
				aim_x : this.MapShape[vertex][0].x - 2 * BFS.MAP_VERTEX_WIDTH,
				aim_y :	this.MapShape[vertex][0].y
			},
			"Move", this.DequeueVertexShape[this.dequeueCnt]	
		);
		this.dequeueCnt++;
		Canvas.cmd("EndParallel");
		//扫描与它相邻的边
		var EndVertexShape = new Label
		({
			Canvas:Canvas,
			x : this.MapShape[0][0].x, 
			y : this.MapShape[0][0].y - 2 * BFS.MAP_VERTEX_HEIGHT,
			font : BFS.END_VERTEX_SHAPE_FONT,
			textColor : BFS.END_VERTEX_SHAPE_TEXTCOLOR,
			moveSpeed : BFS.END_VERTEX_SHAPE_MOVESPEED
		});
		var ScanMapLine = new Line
		({
			Canvas : Canvas,
			StartShape : EndVertexShape,
			EndShape : this.MapShape[vertex][0],
			lineColor : BFS.SCAN_MAP_LINE_LINECOLOR,
			lineWidth : BFS.SCAN_MAP_LINE_LINEWIDTH,
			moveSpeed : BFS.SCAN_MAP_LINE_MOVESPEED
		});
		var	ScanVisitedLine = new Line
		({
			Canvas : Canvas,
			StartShape : EndVertexShape,
			EndShape : this.VisitedShape[0],
			lineColor : BFS.SCAN_VISITED_LINE_LINECOLOR,
			lineWidth : BFS.SCAN_VISITED_LINE_LINEWIDTH,
			moveSpeed : BFS.SCAN_VISITED_LINE_MOVESPEED
		});
		for(var i=0; i<this.size; i++)
		{
			Canvas.cmd("Delay");
 			Canvas.cmd
			(
				"Move", EndVertexShape,
				{
					text : i,
					aim_x : this.MapShape[0][i].x, 
					aim_y : this.MapShape[0][i].y - 2 * BFS.MAP_VERTEX_HEIGHT
				},
				"Move",ScanMapLine, {aimEndShape : this.MapShape[vertex][i]},
				"Move",ScanVisitedLine, {aimEndShape : this.VisitedShape[i]}
			);
			Canvas.cmd("Delay");
			if(this.map[vertex][i] == 1 && this.visited[i]==false)  //vertex到i有边 且i未访问过
			{
				this.visited[i] = true;	//i标记为访问过
				Canvas.cmd("FadeIn", this.VisitedShape[i], 
				{
					text : "true",
					backColor : BFS.VISITED_VERTEX_TRUE_BACKCOLOR,
					textColor : BFS.VISITED_VERTEX_TRUE_TEXTCOLOR
				});			
				//i入队
				this.QueueShape[this.rear] = new Label
				({
					Canvas : Canvas,
					text : i,
					x : this.MapShape[0][i].x, 
					y : this.MapShape[0][i].y - 2 * BFS.MAP_VERTEX_HEIGHT,
					font : BFS.VERTEX_SHAPE_FONT,
					textColor : BFS.VERTEX_SHAPE_TEXTCOLOR,
					moveSpeed : BFS.VERTEX_SHAPE_MOVESPEED
				});
				Canvas.cmd("Move",this.QueueShape[this.rear],
				{
					aim_x : BFS.QUEUE_X + this.rear * BFS.QUEUE_GAP,
					aim_y : BFS.QUEUE_Y
				});
				this.bfsQueue[this.rear++] = i;  //i入队
				Canvas.cmd
				(
					"Move",this.RearShape, {aim_x : BFS.QUEUE_X + this.rear * BFS.QUEUE_GAP},
					"Move",this.RearPointer,
					{
						aimStart_x : BFS.QUEUE_X + this.rear * BFS.QUEUE_GAP,
						aimEnd_x   : BFS.QUEUE_X + this.rear * BFS.QUEUE_GAP
					}
				);
			}
		}
		Canvas.cmd("Delete",StartVertexShape,"Delete",EndVertexShape,"Delete",ScanMapLine,"Delete",ScanVisitedLine);
	}
	Canvas.cmd("Other", function()
	{
		thisBFS.enableControlBar();
	});
	Canvas.cmd("End");
}
BFS.prototype.addControls = function()
{
	var obj = this;
	$("#AlgorithmName").html(BFS.ALGORITHM_NAME);
	
	this.TextInput = this.addControlBar("text","");
	this.CreatNewMapButton = this.addControlBar("button","Creat New Map");
	this.RunBFSButton = this.addControlBar("button","Run BFS");
	
	this.CreatNewMapButton.onclick = function()
	{
		var value = obj.TextInput.value;
		obj.create(value);
		obj.TextInput.value = "";
	}
	this.RunBFSButton.onclick = function()
	{
		var value = obj.TextInput.value;
		obj.bfs(value);	
		obj.TextInput.value = "";
	}

	this.RunBFSButton.disabled = true;
}
