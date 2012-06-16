function init()
{
	Canvas = new KJcanvas();  //用上面的canvas初始化一个全局画板对象(Canvas)
	
	DataStructure = new BFS(); 		   //初始化一个数据结构对象
	DataStructure.addControls(DataStructure);  //给该数据结构演示动画添加用户界面控制器
}

BFS = function()
{}

BFS.ALGORITHM_NAME = "广度优先搜索(邻接矩阵存储)"; 			//动画名称

//DATASHAPE ---> 堆栈元素矩形

BFS.MAP_VERTEX_WIDTH = 30;     //宽度
BFS.MAP_VERTEX_HEIGHT = 30;   //长度

BFS.MAP_START_X= 50;  //邻接矩阵MapShape[0][0]的位置
BFS.MAP_START_Y = 250;

BFS.VISITED_START_X = 50;  //访问标志VisitedShape[0]的位置
BFS.VISITED_START_Y = 150;

BFS.VISITED_VERTEX_WIDTH = 40;
BFS.VISITED_VERTEX_HEIGHT = 40;

BFS.VERTEX_SHAPE_START_X = 20
BFS.VERTEX_SHAPE_START_Y = 20;
BFS.VERTEX_SHAPE_WIDTH  = 30;
BFS.VERTEX_SHAPE_HEIGHT  = 30;

BFS.QUEUE_START_X = 50;
BFS.QUEUE_START_Y = 20;

BFS.POINTER_LENGTH = 50;

BFS.prototype = new Algorithm();

BFS.prototype.create = function( vertex )  //初始化堆栈,并绘制该堆栈
{
	this.vertex = vertex;  //顶点个数
	this.map = new Array();
	this.visited = new Array();

	for(var i=0; i<this.vertex; i++)
	{
		this.visited[i] = false;   //0代表没有访问过
		this.map[i] = new Array();
		for(var j=0; j<this.vertex; j++)
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
	for(var i=0; i<this.vertex; i++)
	{
		this.MapShape[i] = new Array();
		for(var j=0; j<this.vertex; j++)
		{
			this.MapShape[i][j] = new Rectangle({
				Canvas : Canvas,
				text : this.map[i][j],
				width : BFS.MAP_VERTEX_WIDTH,
				height : BFS.MAP_VERTEX_HEIGHT,
				x : BFS.MAP_START_X+j*BFS.MAP_VERTEX_WIDTH,
				y : BFS.MAP_START_Y+i*BFS.MAP_VERTEX_HEIGHT
			}); 
			Canvas.cmd("Draw", this.MapShape[i][j]);
		}
	}
	for(var i=0; i<this.vertex; i++)
	{
		var vertexShape = new Label({
			Canvas : Canvas,
			text : i,
			x : this.MapShape[i][0].x - BFS.MAP_VERTEX_WIDTH, 
			y : this.MapShape[i][0].y,
		});
		Canvas.cmd("Draw", vertexShape);
		var vertexShape = new Label({
			Canvas : Canvas,
			text : i,
			x : this.MapShape[0][i].x, 
			y : this.MapShape[0][i].y - BFS.MAP_VERTEX_HEIGHT,
		});
		Canvas.cmd("Draw", vertexShape);
	}
	
	//绘制访问标志数组
	this.VisitedShape = new Array();
	for(var i=0; i<this.vertex; i++)
	{
		this.VisitedShape[i] = new Rectangle(
		{
			Canvas : Canvas,
			text : this.visited[i],
			width : BFS.VISITED_VERTEX_WIDTH,
			height : BFS.VISITED_VERTEX_HEIGHT,
			x : BFS.VISITED_START_X+i*BFS.VISITED_VERTEX_WIDTH,
			y : BFS.VISITED_START_Y
		});
		var vertexShape = new Label({
			Canvas : Canvas,
			text : i,
			x : this.VisitedShape[i].x,
			y : this.VisitedShape[i].y - BFS.VISITED_VERTEX_HEIGHT
		});
		Canvas.cmd("Draw",this.VisitedShape[i],"Draw", vertexShape);
	}
	Canvas.cmd("EndParallel");
	Canvas.cmd("Other",function()
	{
		$(".controler").removeAttr("disabled");		//启用所有控制元素
	});
	Canvas.cmd("End");  //结束动画
}
BFS.prototype.bfs = function( vertex )  //从vertex点开始bfs
{
	this.disableControlBar();
	Canvas.cmd("Setup");
	
	this.QueueShape = new Array();

	this.FrontPointer = new Line({
		Canvas : Canvas,
		start_x : BFS.QUEUE_START_X,
		start_y : BFS.QUEUE_START_Y,
		end_x : BFS.QUEUE_START_X,
		end_y : BFS.QUEUE_START_Y + BFS.POINTER_LENGTH,
	});
	this.FrontShape = new Label({
		Canvas : Canvas,
		text : "front",
		x : BFS.QUEUE_START_X,
		y : BFS.QUEUE_START_Y + BFS.POINTER_LENGTH,
	});
	this.RearPointer = new Line({
		Canvas : Canvas,
		start_x : BFS.QUEUE_START_X,
		start_y : BFS.QUEUE_START_Y,
		end_x : BFS.QUEUE_START_X,
		end_y : BFS.QUEUE_START_Y + BFS.POINTER_LENGTH,
	});
	this.RearShape = new Label({
		Canvas : Canvas,
		text : "rear",
		x : BFS.QUEUE_START_X,
		y : BFS.QUEUE_START_Y + BFS.POINTER_LENGTH,
	});
	Canvas.cmd("Draw",this.FrontPointer,"Draw",this.FrontShape,"Draw",this.RearPointer,"Draw",this.RearShape);
	
	this.bfsQueue = new Array(); 
	this.front = 0;
	this.rear = 0;

	var StartVertexShape = new Label({
		Canvas : Canvas,
		text : vertex,
		width : BFS.VERTEX_SHAPE_WIDTH,
		height : BFS.VERTEX_SHAPE_HEIGHT,
		x : BFS.VERTEX_SHAPE_START_X,
		y : BFS.VERTEX_SHAPE_START_Y,
	});
	Canvas.cmd("Move",StartVertexShape,{
		aim_x : this.VisitedShape[vertex].x,
		aim_y :	this.VisitedShape[vertex].y - 2*BFS.VISITED_VERTEX_HEIGHT,
	});
	if(this.visited[vertex] == false)
	{
		Canvas.cmd("FadeIn",this.VisitedShape[vertex],{text:"true"});
		this.visited[vertex] = true;

		this.QueueShape[this.rear] = StartVertexShape;
		Canvas.cmd("Move",this.QueueShape[this.rear],{
			aim_x : BFS.QUEUE_START_X + this.rear * BFS.VERTEX_SHAPE_WIDTH,
			aim_y : BFS.QUEUE_START_Y,
		});
		this.bfsQueue[this.rear++] = vertex; //入队
		Canvas.cmd("Move",this.RearShape,{aim_x : BFS.QUEUE_START_X + this.rear * BFS.VERTEX_SHAPE_WIDTH});
		Canvas.cmd("Move",this.RearPointer,{
			aimStart_x : BFS.QUEUE_START_X + this.rear * BFS.VERTEX_SHAPE_WIDTH,
			aimEnd_x   : BFS.QUEUE_START_X + this.rear * BFS.VERTEX_SHAPE_WIDTH
		});
	}
	else
	{
		alert("bfs结束");
	}
	while(this.front < this.rear)  //队列非空
	{
		Canvas.cmd("Delay");
		var StartVertexShape = this.QueueShape[this.front];
		Canvas.cmd("StartParallel");	
		var vertex = this.bfsQueue[this.front++];  //出队
		Canvas.cmd("Move",this.FrontShape,{aim_x : BFS.QUEUE_START_X + this.front * BFS.VERTEX_SHAPE_WIDTH});
		Canvas.cmd("Move",this.FrontPointer,{
			aimStart_x : BFS.QUEUE_START_X + this.front * BFS.VERTEX_SHAPE_WIDTH,
			aimEnd_x   : BFS.QUEUE_START_X + this.front * BFS.VERTEX_SHAPE_WIDTH
		});
		Canvas.cmd("Move",StartVertexShape,{
			aim_x : this.MapShape[vertex][0].x - 2 * BFS.MAP_VERTEX_WIDTH,
			aim_y :	this.MapShape[vertex][0].y
		});
		Canvas.cmd("EndParallel");
		//扫描与它相邻的边
		var EndVertexShape = new Label({Canvas:Canvas,
			x : this.MapShape[0][0].x, 
			y : this.MapShape[0][0].y - 2 * BFS.MAP_VERTEX_HEIGHT,
		});
		var ScanMapLine = new Line({Canvas : Canvas,
			StartShape : EndVertexShape,
			EndShape : this.MapShape[vertex][0],
		});
		var	ScanVisitedLine = new Line({Canvas : Canvas,
			StartShape : EndVertexShape,
			EndShape : this.VisitedShape[0],
		});
		for(var i=0; i<this.vertex; i++)
		{
			Canvas.cmd("Delay");
			Canvas.cmd("Move",EndVertexShape,{
				text : i,
				aim_x : this.MapShape[0][i].x, 
				aim_y : this.MapShape[0][i].y - 2 * BFS.MAP_VERTEX_HEIGHT,
			},
			"Move",ScanMapLine,{aimEndShape : this.MapShape[vertex][i]},
			"Move",ScanVisitedLine,{aimEndShape : this.VisitedShape[i]});

			if(this.map[vertex][i] == 1 && this.visited[i]==false)  //vertex到i有边 且i未访问过
			{
				this.visited[i] = true;	//i标记为访问过
				Canvas.cmd("FadeIn",this.VisitedShape[i],{text:"true"});
				
				//i入队
				this.QueueShape[this.rear] = new Label({
					Canvas : Canvas,
					text : i,
					x : this.MapShape[0][i].x, 
					y : this.MapShape[0][i].y - 2 * BFS.MAP_VERTEX_HEIGHT,
				});
				Canvas.cmd("StartParallel");
				Canvas.cmd("Move",this.QueueShape[this.rear],{
					aim_x : BFS.QUEUE_START_X + this.rear * BFS.VERTEX_SHAPE_WIDTH,
					aim_y : BFS.QUEUE_START_Y,
				});
				this.bfsQueue[this.rear++] = i;  //i入队
				Canvas.cmd("Move",this.RearShape,{aim_x : BFS.QUEUE_START_X + this.rear * BFS.VERTEX_SHAPE_WIDTH});
				Canvas.cmd("Move",this.RearPointer,{
					aimStart_x : BFS.QUEUE_START_X + this.rear * BFS.VERTEX_SHAPE_WIDTH,
					aimEnd_x   : BFS.QUEUE_START_X + this.rear * BFS.VERTEX_SHAPE_WIDTH
				});
				Canvas.cmd("EndParallel");
			}
		}
		Canvas.cmd("Delete",StartVertexShape,"Delete",EndVertexShape,"Delete",ScanMapLine,"Delete",ScanVisitedLine);
	}
	Canvas.cmd("Other",function()
	{
		$(".controler").removeAttr("disabled");		//启用所有控制元素
	});
	Canvas.cmd("End");
}
BFS.prototype.addControls = function(obj)
{
	$("#AlgorithmName").html(BFS.ALGORITHM_NAME);
	this.TextInput = this.addControlBar("text","");
	this.CreatBFSButton = this.addControlBar("button","Creat BFS");
	
	this.CreatBFSButton.onclick = function(){
		var value = obj.TextInput.value;
		value = parseFloat(value);
		obj.create(value);
		obj.TextInput.value = "";
	}

	this.PushButton = this.addControlBar("button","Push");
	this.PushButton.onclick = function(){
		var value = obj.TextInput.value;
		value = parseFloat(value);
		obj.bfs(value);	
		obj.TextInput.value = "";
	}

	this.PopButton = this.addControlBar("button","Pop");
	this.PopButton.onclick = function(){
		obj.pop();
	}

	this.PushButton.disabled = true;
	this.PopButton.disabled = true;
}
