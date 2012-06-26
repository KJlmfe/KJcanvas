function init()
{
	Canvas = new KJcanvas();  //用上面的canvas初始化一个全局画板对象(Canvas)
	DataStructure = new DFS(); 		   //初始化一个数据结构对象
}

DFS = function()
{
	DFS.ALGORITHM_NAME = "Depth-first search(Adjacency matrix storage)"; 			//动画名称
	DFS.SIZE = 7;	
	//DATASHAPE ---> 堆栈元素矩形

	DFS.MAP_VERTEX_WIDTH = 33;     //宽度
	DFS.MAP_VERTEX_HEIGHT = 33;   //长度
	DFS.MAP_VERTEX_X = 200;  //邻接矩阵MapShape[0][0]的位置
	DFS.MAP_VERTEX_Y = 160;
	DFS.MAP_VERTEX_BACKCOLOR = "FFF";
	DFS.MAP_VERTEX_EDGECOLOR = "000";
	DFS.MAP_VERTEX_TEXTCOLOR = "#F00";
	DFS.MAP_VERTEX_FONT = "18px sans-serif";
	DFS.MAP_VERTEX_EDGEWIDTH = 1;

	DFS.MAP_SERIAL_NUMBER_FONT = "16px sans-serif";
	DFS.MAP_SERIAL_NUMBER_TEXTCOLOR = "000";


	DFS.VISITED_VERTEX_WIDTH = 33;
	DFS.VISITED_VERTEX_HEIGHT = 33;
	DFS.VISITED_VERTEX_X = 200;  //访问标志VisitedShape[0]的位置
	DFS.VISITED_VERTEX_Y = 60;
	DFS.VISITED_VERTEX_BACKCOLOR = "FFF";
	DFS.VISITED_VERTEX_TRUE_BACKCOLOR = "FF0";
	DFS.VISITED_VERTEX_EDGECOLOR = "000";
	DFS.VISITED_VERTEX_TEXTCOLOR = "#F00";
	DFS.VISITED_VERTEX_TRUE_TEXTCOLOR = "#00f";
	DFS.VISITED_VERTEX_FONT = "12px sans-serif";
	DFS.VISITED_VERTEX_EDGEWIDTH = 1;

	DFS.VISITED_SERIAL_NUMBER_FONT = "16px sans-serif";
	DFS.VISITED_SERIAL_NUMBER_TEXTCOLOR = "000";


	DFS.VERTEX_SHAPE_X = 20;
	DFS.VERTEX_SHAPE_Y = 20;
	DFS.VERTEX_SHAPE_FONT = "22px sans-serif";
	DFS.VERTEX_SHAPE_TEXTCOLOR = "#ee1289";
	DFS.VERTEX_SHAPE_MOVESPEED = 5;


	DFS.STACK_X = 500;
	DFS.STACK_Y = 360;
	DFS.STACK_GAP = 23;
	DFS.STACK_POINTER_X = DFS.STACK_X + 100;
	DFS.STACK_POINTER_Y = DFS.STACK_Y;
	DFS.STACK_POINTER_LINEWIDTH = 2;
	DFS.STACK_POINTER_LINECOLOR = "#1E90FF";
	DFS.STACK_POINTER_TEXTCOLOR = "#FF7F00";
	DFS.STACK_POINTER_FONT ="18px sans-serif";
	DFS.STACK_POINTER_MOVESPEED = 2;


	DFS.END_VERTEX_SHAPE_FONT = "22px sans-serif";
	DFS.END_VERTEX_SHAPE_TEXTCOLOR = "#698b69";
	DFS.END_VERTEX_SHAPE_MOVESPEED = 1;


	DFS.SCAN_MAP_LINE_LINECOLOR = "#8B008B";
	DFS.SCAN_MAP_LINE_LINEWIDTH = 2;
	DFS.SCAN_MAP_LINE_MOVESPEED = 3;

	DFS.SCAN_VISITED_LINE_LINECOLOR = "#32CD32";
	DFS.SCAN_VISITED_LINE_LINEWIDTH = 2;
	DFS.SCAN_VISITED_LINE_MOVESPEED = 3;

	DFS.POP_SHAPE_X = 600;
	DFS.POP_SHAPE_Y = 50;
	DFS.POP_SHAPE_GAP = 25;
	DFS.POP_SHAPE_FONT = "22px sans-serif";
	DFS.POP_SHAPE_TEXTCOLOR = "#228B22";
	DFS.POP_SHAPE_MOVESPEED = 4;

	this.addControls(); //给该数据结构演示动画添加用户界面控制器
	thisDFS = this;
}
DFS.prototype = new Algorithm();
DFS.prototype.create = function(size)  //初始化堆栈,并绘制该堆栈
{
	this.size = DFS.SIZE;
	if(Positive_Integer.test(size))
		this.size = parseInt(size);
	
	this.map = new Array();
	this.visited = new Array();
	this.PopVertexShape = new Array();
	this.popCnt = 0;

	for(var i=0; i<this.size; i++)  //初始化一个随机邻接矩阵
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
				width : DFS.MAP_VERTEX_WIDTH,
				height : DFS.MAP_VERTEX_HEIGHT,
				x : DFS.MAP_VERTEX_X+j*DFS.MAP_VERTEX_WIDTH,
				y : DFS.MAP_VERTEX_Y+i*DFS.MAP_VERTEX_HEIGHT,
				backColor : DFS.MAP_VERTEX_BACKCOLOR,
				edgeColor : DFS.MAP_VERTEX_EDGECOLOR,
				textColor : DFS.MAP_VERTEX_TEXTCOLOR,
				font : DFS.MAP_VERTEX_FONT,
				edgeWidth : DFS.MAP_VERTEX_EDGEWIDTH
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
			x : this.MapShape[i][0].x - DFS.MAP_VERTEX_WIDTH, 
			y : this.MapShape[i][0].y,
			font :	DFS.MAP_SERIAL_NUMBER_FONT,
			textColor :	DFS.MAP_SERIAL_NUMBER_TEXTCOLOR
		});
		Canvas.cmd("Draw", vertexShape);
		var vertexShape = new Label
		({
			Canvas : Canvas,
			text : i,
			x : this.MapShape[0][i].x, 
			y : this.MapShape[0][i].y - DFS.MAP_VERTEX_HEIGHT,
			font :	DFS.MAP_SERIAL_NUMBER_FONT,
			textColor :	DFS.MAP_SERIAL_NUMBER_TEXTCOLOR
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
			width : DFS.VISITED_VERTEX_WIDTH,
			height : DFS.VISITED_VERTEX_HEIGHT,
			x : DFS.VISITED_VERTEX_X+i*DFS.VISITED_VERTEX_WIDTH,
			y : DFS.VISITED_VERTEX_Y,
			backColor : DFS.VISITED_VERTEX_BACKCOLOR,
			edgeColor : DFS.VISITED_VERTEX_EDGECOLOR,
			textColor : DFS.VISITED_VERTEX_TEXTCOLOR,
			font : DFS.VISITED_VERTEX_FONT,
			edgeWidth : DFS.VISITED_VERTEX_EDGEWIDTH
		});
		var vertexShape = new Label
		({
			Canvas : Canvas,
			text : i,
			x : this.VisitedShape[i].x,
			y : this.VisitedShape[i].y - DFS.VISITED_VERTEX_HEIGHT,
			font : DFS.VISITED_SERIAL_NUMBER_FONT,
			textColor : DFS.VISITED_SERIAL_NUMBER_TEXTCOLOR
		});
		Canvas.cmd("Draw",this.VisitedShape[i],"Draw", vertexShape);
	}

	this.dfsStack = new Array(); //初始化堆栈
	this.top = 0;

	this.StackShape = new Array();  //绘制堆栈
	this.TopPointer = new Line
	({
		Canvas : Canvas,
		start_x : DFS.STACK_X+20,
		start_y : DFS.STACK_Y,
		end_x : DFS.STACK_POINTER_X-20,
		end_y : DFS.STACK_POINTER_Y,
		lineWidth : DFS.STACK_POINTER_LINEWIDTH,
		lineColor : DFS.STACK_POINTER_LINECOLOR,
		moveSpeed : DFS.STACK_POINTER_MOVESPEED
	});
	this.TopShape = new Label
	({
		Canvas : Canvas,
		text : "top",
		x : DFS.STACK_POINTER_X,
		y : DFS.STACK_POINTER_Y,
		textColor : DFS.STACK_POINTER_TEXTCOLOR,
		font : DFS.STACK_POINTER_FONT,
		moveSpeed : DFS.STACK_POINTER_MOVESPEED
	});
	Canvas.cmd("Draw",this.TopPointer,"Draw",this.TopShape);
	
	Canvas.cmd("EndParallel");
	Canvas.cmd("Other", function()
	{
		thisDFS.enableControlBar();
	});
	Canvas.cmd("End");
}
DFS.prototype.dfs = function(vertex)  //从vertex点开始dfs
{
	this.disableControlBar();
	if(!(NonNegative_Integer.test(vertex) && parseInt(vertex) < this.size))
	{
		alert("Please enter a depth-first search starting vertex(from 0 - "+(this.size-1)+").");
		this.enableControlBar();
		return;
	}
	vertex = parseInt(vertex);

	Canvas.cmd("Setup");
	var StartVertexShape = new Label
	({
		Canvas : Canvas,
		text : vertex,
		x : DFS.VERTEX_SHAPE_X,
		y : DFS.VERTEX_SHAPE_Y,
		font : DFS.VERTEX_SHAPE_FONT,
		textColor : DFS.VERTEX_SHAPE_TEXTCOLOR,
		moveSpeed : DFS.VERTEX_SHAPE_MOVESPEED
	});
	Canvas.cmd("Move", StartVertexShape,
	{
		aim_x : this.VisitedShape[vertex].x,
		aim_y :	this.VisitedShape[vertex].y +  DFS.VISITED_VERTEX_HEIGHT,
	});
	if(this.visited[vertex] == false)
	{
		Canvas.cmd("FadeIn", this.VisitedShape[vertex], 
		{
			text : "true",
			backColor : DFS.VISITED_VERTEX_TRUE_BACKCOLOR,
			textColor : DFS.VISITED_VERTEX_TRUE_TEXTCOLOR
		});
		this.visited[vertex] = true;

		this.StackShape[this.top] = StartVertexShape;
		Canvas.cmd("Move", this.StackShape[this.top],
		{
			aim_x : DFS.STACK_X,
			aim_y : DFS.STACK_Y - this.top * 20,
		});
		this.dfsStack[this.top++] = vertex; //入堆
		Canvas.cmd
		(
			"Move", this.TopShape, 
			{
				aim_y : DFS.STACK_Y - this.top * DFS.STACK_GAP
			},
			"Move",this.TopPointer,
			{
				aimStart_y : DFS.STACK_Y - this.top * DFS.STACK_GAP,
				aimEnd_y   : DFS.STACK_Y - this.top * DFS.STACK_GAP,
			}
		);
	}
	else
		alert("Depth-first search is finished.");
	
	while(this.top > 0)  //堆栈非空
	{
		Canvas.cmd("Delay");
		this.top--;   //弹栈
		var StartVertexShape = this.StackShape[this.top];
		var vertex = this.dfsStack[this.top]; 
		this.PopVertexShape[this.popCnt] = new Label
		({
			Canvas : Canvas,
			text : vertex,
			x : DFS.STACK_X,
			y : DFS.STACK_Y - this.top * DFS.STACK_GAP,
			aim_x : DFS.POP_SHAPE_X + this.popCnt * DFS.POP_SHAPE_GAP,
			aim_y : DFS.POP_SHAPE_Y,	
			font : DFS.POP_SHAPE_FONT,
			textColor : DFS.POP_SHAPE_TEXTCOLOR,
			moveSpeed : DFS.POP_SHAPE_MOVESPEED
		});
		Canvas.cmd
		(
			"Move", this.TopShape, 
			{
				aim_y : DFS.STACK_Y - this.top * DFS.STACK_GAP
			},
			"Move",this.TopPointer,
			{
				aimStart_y : DFS.STACK_Y - this.top * DFS.STACK_GAP,
				aimEnd_y   : DFS.STACK_Y - this.top * DFS.STACK_GAP,
			}
		);
		Canvas.cmd
		(
			"Move", StartVertexShape,
			{
				aim_x : this.MapShape[vertex][0].x - 2 * DFS.MAP_VERTEX_WIDTH,
				aim_y :	this.MapShape[vertex][0].y
			},
			"Move", this.PopVertexShape[this.popCnt]
		);
		this.popCnt++;
		//扫描与它相邻的边
		var EndVertexShape = new Label
		({
			Canvas:Canvas,
			x : this.MapShape[0][0].x, 
			y : this.MapShape[0][0].y - 2 * DFS.MAP_VERTEX_HEIGHT,
			font : DFS.END_VERTEX_SHAPE_FONT,
			textColor : DFS.END_VERTEX_SHAPE_TEXTCOLOR,
			moveSpeed : DFS.END_VERTEX_SHAPE_MOVESPEED
		});
		var ScanMapLine = new Line
		({
			Canvas : Canvas,
			StartShape : EndVertexShape,
			EndShape : this.MapShape[vertex][0],
			lineColor : DFS.SCAN_MAP_LINE_LINECOLOR,
			lineWidth : DFS.SCAN_MAP_LINE_LINEWIDTH,
			moveSpeed : DFS.SCAN_MAP_LINE_MOVESPEED
		});
		var	ScanVisitedLine = new Line
		({
			Canvas : Canvas,
			StartShape : EndVertexShape,
			EndShape : this.VisitedShape[0],
			lineColor : DFS.SCAN_VISITED_LINE_LINECOLOR,
			lineWidth : DFS.SCAN_VISITED_LINE_LINEWIDTH,
			moveSpeed : DFS.SCAN_VISITED_LINE_MOVESPEED
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
					aim_y : this.MapShape[0][i].y - 2 * DFS.MAP_VERTEX_HEIGHT,
				},
				"Move", ScanMapLine, {aimEndShape : this.MapShape[vertex][i]},
				"Move", ScanVisitedLine, {aimEndShape : this.VisitedShape[i]}
			);
			Canvas.cmd("Delay");
			if(this.map[vertex][i] == 1 && this.visited[i]==false)  //vertex到i有边 且i未访问过
			{
				this.visited[i] = true;	//i标记为访问过
				Canvas.cmd("FadeIn", this.VisitedShape[i], 
				{
					text : "true",
					backColor : DFS.VISITED_VERTEX_TRUE_BACKCOLOR,
					textColor : DFS.VISITED_VERTEX_TRUE_TEXTCOLOR
				});		
				this.StackShape[this.top] =  new Label
				({
					Canvas : Canvas,
					text : i,
					x : this.MapShape[0][i].x, 
					y : this.MapShape[0][i].y - 2 * DFS.MAP_VERTEX_HEIGHT,
					font : DFS.VERTEX_SHAPE_FONT,
					textColor : DFS.VERTEX_SHAPE_TEXTCOLOR,
					moveSpeed : DFS.VERTEX_SHAPE_MOVESPEED
				});
				Canvas.cmd("Move", this.StackShape[this.top],
				{
					aim_x : DFS.STACK_X,
					aim_y : DFS.STACK_Y - this.top * DFS.STACK_GAP,
				});
				this.dfsStack[this.top++] = i; //入堆
				Canvas.cmd
				(
					"Move", this.TopShape, 
					{
						aim_y : DFS.STACK_Y - this.top * DFS.STACK_GAP
					},
					"Move",this.TopPointer,
					{
						aimStart_y : DFS.STACK_Y - this.top * DFS.STACK_GAP,
						aimEnd_y   : DFS.STACK_Y - this.top * DFS.STACK_GAP,
					}
				);
			}
		}
		Canvas.cmd("Delete", StartVertexShape, "Delete", EndVertexShape, "Delete", ScanMapLine,"Delete", ScanVisitedLine);
	}
	Canvas.cmd("Other", function()
	{
		thisDFS.enableControlBar();
	});
	Canvas.cmd("End");
}
DFS.prototype.addControls = function()
{
	var obj = this;
	$("#AlgorithmName").html(DFS.ALGORITHM_NAME);
	
	this.TextInput = this.addControlBar("text", "");
	this.CreatNewMapButton = this.addControlBar("button", "Creat New Map");
	this.RunDFSButton = this.addControlBar("button", "Run DFS");
	
	this.CreatNewMapButton.onclick = function()
	{
		var value = obj.TextInput.value;
		obj.create(value);
		obj.TextInput.value = "";
	}
	this.RunDFSButton.onclick = function()
	{
		var value = obj.TextInput.value;
		obj.dfs(value);	
		obj.TextInput.value = "";
	}
	
	this.RunDFSButton.disabled = true;
}
