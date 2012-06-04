Rectangle = function(cfg)
{
	//参数默认设置
	this.width = 80;   //矩形宽
	this.height = 40;		//矩形高

 	this.x = 500;	 //矩形的位置
	this.y = 300;
	
	this.end_x = 100;      //移动的末尾位置
	this.end_y = 300;

	this.backColor = "ff4a75";  //背景色
	this.edgeColor = "58435a";  //边框色
	 
	this.moveSpeed = 2; //移动速度 

	this.setArguments(cfg);  //设置用户指定参数
}
Rectangle.prototype.setArguments = function(cfg)
{
	for(var x in cfg)
		this[x] = cfg[x];
	this.start_x = this.x;   //移动的起始位置
	this.start_y = this.y;
}
Rectangle.prototype.draw = function() //绘画矩形的方法
{
	this.Canvas.cmdRunning++;
	if(!this.Canvas.exist(this))    //每在画板上画一个图形对象，都要将该对象保存到画板的Shape里 	
		this.Canvas.save(this);
	this.Canvas.ctx.save();
	
	this.Canvas.ctx.fillStyle = this.backColor;  
	this.Canvas.ctx.fillRect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);  //画一个实体矩形
	this.Canvas.ctx.strokeStyle = this.edgeColor;
	this.Canvas.ctx.strokeRect(this.x-this.width/2,this.y-this.height/2,this.width,this.height); //勾画出矩形边框
	
	this.Canvas.ctx.restore();
	this.Canvas.cmdRunning--;
}
Rectangle.prototype.move = function()
{
	this.Canvas.cmdRunning++;
	//默认沿着两点间的直线路径移动
	if(this.start_x != this.end_x)   //求出直线方程的k与b
	{
		this.k = (this.start_y - this.end_y) / (this.start_x - this.end_x);  
		this.b = this.start_y - this.k * this.start_x;
	}
	else
	{
		this.k = 0;
		this.b = 0;
	}
	this.x = this.start_x;
	this.y = this.start_y;
	
	var me = this;
	var moveTimer = setInterval(function()
	{
		//擦干净画布
		me.Canvas.clear();
		//把要移动的图形对象从画布上删除
		me.Canvas.del(me);
		//重画画布上的图形
		me.Canvas.restore();
		//计算图形位置
		if(me.end_x > me.x)
		{
			me.x += me.moveSpeed;
			me.y = me.k*me.x + me.b;
			if(me.end_x <= me.x)					
			{
				me.x = me.end_x;
				me.y = me.end_y;
			}
		}
		else if(me.end_x < me.x)
		{
			me.x -= me.moveSpeed;
			me.y = me.k*me.x + me.b;
			if(me.end_x >= me.x)
			{
				me.x = me.end_x;
				me.y = me.end_y;
			}
		}
		else if(me.end_y < me.y)
		{
			me.y -= me.moveSpeed;
			if(me.end_y >= me.y)
			{
				me.y = me.end_y;
			}
		}
		else if(me.end_y > me.y)
		{
			me.y += me.moveSpeed;
			if(me.end_y <= me.y)
			{
				me.y = me.end_y;
			}
		}
		//绘制图形
		me.draw();	
		//判断是否到达目标位置
		if(me.x == me.end_x && me.y == me.end_y)
		{
			me.Canvas.cmdRunning--;
			clearInterval(moveTimer);
		}
	},24);  //每24毫秒刷新一下画面
}
KJcanvas = function(cfg) //画板类(cfg为参数对象)
{	
	//进行参数默认设置

	//得到DOM里canvas对象
	this.Canvas = document.getElementsByTagName("canvas")[0];
	
	//设置画板大小,边框
	this.width = 800;
	this.height = 500;
	this.border = "2px solid #0AF";

	this.ShapeOnCanvas = new Array(); 	//初始化保存画板上存在的图形对象
	this.cmdQueue = new Array(); 		//初始化保存动画命令的队列

	this.setArguments(cfg);
}
KJcanvas.prototype.setArguments = function(cfg)
{
	for(var x in cfg)   //设置用户指定的参数
		this[x] = cfg[x];

	//初始化canvas的2d上下文
	this.ctx = this.Canvas.getContext("2d"); 
	
	//初始化DOM里canvas样式 
	this.Canvas.width = this.width;
	this.Canvas.height = this.height;
	$(this.Canvas).css("border",this.border);
	
}
KJcanvas.prototype.save = function(obj) //保存obj图形对象到ShapeOnCanvas数组
{
	this.ShapeOnCanvas.push(obj);
}
KJcanvas.prototype.exist = function(obj)  //判断obj图形对象是否在画板上存在
{
	for(var i=0; i<this.ShapeOnCanvas.length; i++)
		if(this.ShapeOnCanvas[i] == obj)
			return true;
	return false;
}
KJcanvas.prototype.del = function(obj) //从ShapeOnCanvas里删除一个图形对象
{
	for(var i=0; i<this.ShapeOnCanvas.length; i++)
		if(this.ShapeOnCanvas[i] == obj)
		{
			this.ShapeOnCanvas[i] = null;
			break;
		}
}
KJcanvas.prototype.restore = function() //将ShapeOnCanvas里的所有图形对象重绘
{
	this.clear();
	for(var i=0; i<this.ShapeOnCanvas.length; i++)
		if(this.ShapeOnCanvas[i] != null)
			this.ShapeOnCanvas[i].draw();
}
KJcanvas.prototype.clear = function() //清空画板(并没有删除画板上的图形,所以重绘后,那些图形又出现了)
{
	this.ctx.clearRect(0,0,this.width,this.height);
}
KJcanvas.prototype.cmd = function()  //动画命令控制器 
{
	if(arguments[0] == "Setup")  //动画开始
	{
		this.cmdQueue = new Array();  //存储动画命令的队列
		this.rear = 0;			//队列首尾指针复位
		this.front = 0;
		this.cmdRunning = 0;        //正在运行的动画命令个数
		this.parallelSignal = false;  //并行动画型号  true表示开始并行动画
		
		var me = this;
		this.cmdTimer = setInterval(function()   //启动动画控制器
		{
			if(me.cmdRunning == 0 && me.front < me.rear)  //表示之前的动画命令执行结束了并且存在尚未运行的动画命令且无暂停信号
			{
				var k = 0;
				while(me.cmdQueue[me.front][k] != null)
				{
					if(me.cmdQueue[me.front][k] == "Draw")    //瞬间绘制一个图形
					{
						me.cmdQueue[me.front][k+1].setArguments(me.cmdQueue[me.front][k+2]);  //先设置用户设定的该动画参数
						me.cmdQueue[me.front][k+1].draw();									 //执行该动画
					}
					else if(me.cmdQueue[me.front][k] == "Move")   //移动
					{
						me.cmdQueue[me.front][k+1].setArguments(me.cmdQueue[me.front][k+2]);
						me.cmdQueue[me.front][k+1].move();
					}
					else if(me.cmdQueue[me.front][k] == "END")  //停止动画控制器
					{
						clearInterval(me.cmdTimer);
					}
					k++;
				}
				me.front++;
			}
		},10);
	}
	else if(arguments[0] == "StartParallel") //开始并行动画
	{
		this.parallelSignal = true;	
		this.parallelArguments = new Array();  //并行动画命令存储器
	}
	else 
	{
		if(arguments[0] == "EndParallel")  //并行动画结束
		{
			this.parallelSignal = false;
			arguments = this.parallelArguments;  //将之前的所有并行动画命令转换为一条串行动画命令
		}
		if(this.parallelSignal)
		{
			for(var i=0;i<arguments.length;i++)
			{
				this.parallelArguments.push(arguments[i]);   //将并行动画命令暂时存储
			}
		}
		else
		{
			this.cmdQueue[this.rear++] = arguments;  //动画命令存入队列
		}
	}
}
