function init()
{
	Canvas = new KJcanvas();  //用上面的canvas初始化一个全局画板对象(Canvas)
	
	DataStructure = new DFS(); 		   //初始化一个数据结构对象
}

DFS = function()
{
	this.addControls(); //给该数据结构演示动画添加用户界面控制器
}

DFS.ALGORITHM_NAME = "深度优先搜索(邻接矩阵存储)"; 			//动画名称

//DATASHAPE ---> 堆栈元素矩形

DFS.MAP_VERTEX_WIDTH = 30;     //宽度
DFS.MAP_VERTEX_HEIGHT = 30;   //长度

DFS.MAP_START_X= 100;  //邻接矩阵MapShape[0][0]的位置
DFS.MAP_START_Y = 250;

DFS.VISITED_START_X = 100;  //访问标志VisitedShape[0]的位置
DFS.VISITED_START_Y = 150;

DFS.VISITED_VERTEX_WIDTH = 40;
DFS.VISITED_VERTEX_HEIGHT = 40;

DFS.VERTEX_SHAPE_START_X = 20
DFS.VERTEX_SHAPE_START_Y = 20;
DFS.VERTEX_SHAPE_WIDTH  = 30;
DFS.VERTEX_SHAPE_HEIGHT  = 30;

DFS.STACK_START_X = 600;
DFS.STACK_START_Y = 400;

DFS.POINTER_LENGTH = 50;

DFS.prototype = new Algorithm();

DFS.prototype.create = function( vertex )  //初始化堆栈,并绘制该堆栈
{
	this.vertex = vertex;  //顶点个数
	this.map = new Array();
	this.visited = new Array();

	for(var i=0; i<this.vertex; i++)  //初始化一个随机邻接矩阵
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
				width : DFS.MAP_VERTEX_WIDTH,
				height : DFS.MAP_VERTEX_HEIGHT,
				x : DFS.MAP_START_X+j*DFS.MAP_VERTEX_WIDTH,
				y : DFS.MAP_START_Y+i*DFS.MAP_VERTEX_HEIGHT
			}); 
			Canvas.cmd("Draw", this.MapShape[i][j]);
		}
	}
	for(var i=0; i<this.vertex; i++)
	{
		var vertexShape = new Label({
			Canvas : Canvas,
			text : i,
			x : this.MapShape[i][0].x - DFS.MAP_VERTEX_WIDTH, 
			y : this.MapShape[i][0].y,
		});
		Canvas.cmd("Draw", vertexShape);
		var vertexShape = new Label({
			Canvas : Canvas,
			text : i,
			x : this.MapShape[0][i].x, 
			y : this.MapShape[0][i].y - DFS.MAP_VERTEX_HEIGHT,
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
			width : DFS.VISITED_VERTEX_WIDTH,
			height : DFS.VISITED_VERTEX_HEIGHT,
			x : DFS.VISITED_START_X+i*DFS.VISITED_VERTEX_WIDTH,
			y : DFS.VISITED_START_Y
		});
		var vertexShape = new Label({
			Canvas : Canvas,
			text : i,
			x : this.VisitedShape[i].x,
			y : this.VisitedShape[i].y - DFS.VISITED_VERTEX_HEIGHT
		});
		Canvas.cmd("Draw",this.VisitedShape[i],"Draw", vertexShape);
	}

	this.dfsStack = new Array(); //初始化堆栈
	this.top = 0;

	this.StackShape = new Array();  //绘制堆栈
	this.TopPointer = new Line({
		Canvas : Canvas,
		start_x : DFS.STACK_START_X,
		start_y : DFS.STACK_START_Y,
		end_x : DFS.STACK_START_X + DFS.POINTER_LENGTH,
		end_y : DFS.STACK_START_Y,
	});
	this.TopShape = new Label({
		Canvas : Canvas,
		text : "top",
		x : this.TopPointer.end_x,
		y : this.TopPointer.end_y,
	});
	Canvas.cmd("Draw",this.TopPointer,"Draw",this.TopShape);
	
	Canvas.cmd("EndParallel");
	Canvas.cmd("Other",function()
	{
		$(".controler").removeAttr("disabled");		//启用所有控制元素
	});
	Canvas.cmd("End");  //结束动画
}
DFS.prototype.dfs = function( vertex )  //从vertex点开始dfs
{
	this.disableControlBar();
	Canvas.cmd("Setup");
	
	var StartVertexShape = new Label({
		Canvas : Canvas,
		text : vertex,
		width : DFS.VERTEX_SHAPE_WIDTH,
		height : DFS.VERTEX_SHAPE_HEIGHT,
		x : DFS.VERTEX_SHAPE_START_X,
		y : DFS.VERTEX_SHAPE_START_Y,
	});
	Canvas.cmd("Move",StartVertexShape,{
		aim_x : this.VisitedShape[vertex].x,
		aim_y :	this.VisitedShape[vertex].y - 2*DFS.VISITED_VERTEX_HEIGHT,
	});
	if(this.visited[vertex] == false)
	{
		Canvas.cmd("FadeIn",this.VisitedShape[vertex],{text:"true"});
		this.visited[vertex] = true;

		this.StackShape[this.top] = StartVertexShape;
		Canvas.cmd("Move",this.StackShape[this.top],{
			aim_x : DFS.STACK_START_X,
			aim_y : DFS.STACK_START_Y - this.top * DFS.VERTEX_SHAPE_WIDTH,
		});
		this.dfsStack[this.top++] = vertex; //入堆
		Canvas.cmd("Move",this.TopShape,{aim_y : DFS.STACK_START_Y - this.top * DFS.VERTEX_SHAPE_HEIGHT},
		"Move",this.TopPointer,{
			aimStart_y : DFS.STACK_START_Y - this.top * DFS.VERTEX_SHAPE_HEIGHT,
			aimEnd_y   : DFS.STACK_START_Y - this.top * DFS.VERTEX_SHAPE_HEIGHT,
		});
	}
	else
	{
		alert("dfs结束");
	}
	while(this.top > 0)  //堆栈非空
	{
		Canvas.cmd("Delay");
		this.top--;   //弹栈
		var StartVertexShape = this.StackShape[this.top];
		Canvas.cmd("StartParallel");	
		var vertex = this.dfsStack[this.top];  
		Canvas.cmd("Move",this.TopShape,{aim_y : DFS.STACK_START_Y - this.top * DFS.VERTEX_SHAPE_HEIGHT});
		Canvas.cmd("Move",this.TopPointer,{
			aimStart_y : DFS.STACK_START_Y - this.top * DFS.VERTEX_SHAPE_HEIGHT,
			aimEnd_y   : DFS.STACK_START_Y - this.top * DFS.VERTEX_SHAPE_HEIGHT,
		});
		Canvas.cmd("Move",StartVertexShape,{
			aim_x : this.MapShape[vertex][0].x - 2 * DFS.MAP_VERTEX_WIDTH,
			aim_y :	this.MapShape[vertex][0].y
		});
		Canvas.cmd("EndParallel");
		//扫描与它相邻的边
		var EndVertexShape = new Label({Canvas:Canvas,
			x : this.MapShape[0][0].x, 
			y : this.MapShape[0][0].y - 2 * DFS.MAP_VERTEX_HEIGHT,
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
				aim_y : this.MapShape[0][i].y - 2 * DFS.MAP_VERTEX_HEIGHT,
			},
			"Move",ScanMapLine,{aimEndShape : this.MapShape[vertex][i]},
			"Move",ScanVisitedLine,{aimEndShape : this.VisitedShape[i]});

			if(this.map[vertex][i] == 1 && this.visited[i]==false)  //vertex到i有边 且i未访问过
			{
				this.visited[i] = true;	//i标记为访问过
				Canvas.cmd("FadeIn",this.VisitedShape[i],{text:"true"});
				
				this.StackShape[this.top] =  new Label({
					Canvas : Canvas,
					text : i,
					x : this.MapShape[0][i].x, 
					y : this.MapShape[0][i].y - 2 * DFS.MAP_VERTEX_HEIGHT,
				});
				Canvas.cmd("Move",this.StackShape[this.top],{
					aim_x : DFS.STACK_START_X,
					aim_y : DFS.STACK_START_Y - this.top * DFS.VERTEX_SHAPE_HEIGHT,
				});
				this.dfsStack[this.top++] = i; //入堆
				Canvas.cmd("Move",this.TopShape,{aim_y : DFS.STACK_START_Y - this.top * DFS.VERTEX_SHAPE_HEIGHT},
				"Move",this.TopPointer,{
					aimStart_y : DFS.STACK_START_Y - this.top * DFS.VERTEX_SHAPE_HEIGHT,
					aimEnd_y   : DFS.STACK_START_Y - this.top * DFS.VERTEX_SHAPE_HEIGHT,
				});			
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
DFS.prototype.addControls = function()
{
	var obj = this;
	$("#AlgorithmName").html(DFS.ALGORITHM_NAME);
	
	this.TextInput = this.addControlBar("text","");
	this.CreatNewMapButton = this.addControlBar("button","Creat New Map");
	this.RunDFSButton = this.addControlBar("button","Run DFS");
	
	this.CreatNewMapButton.onclick = function(){
		var value = obj.TextInput.value;
		value = parseFloat(value);
		obj.create(value);
		obj.TextInput.value = "";
	}

	this.RunDFSButton.onclick = function(){
		var value = obj.TextInput.value;
		value = parseFloat(value);
		obj.dfs(value);	
		obj.TextInput.value = "";
	}
	
	this.RunDFSButton.disabled = true;
}
