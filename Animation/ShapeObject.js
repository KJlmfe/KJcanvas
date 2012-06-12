Shape = function()	//图形类(所有图形的父类)
{
	//大小
	this.width = Shape.WIDTH;	//宽	
	this.height = Shape.HEIGHT;	//高
	this.radius = Shape.RADIUS;	//半径
	//位置
 	this.x = Shape.X;	 //矩形的中心  圆的圆心  线段的中点
	this.y = Shape.Y;	
	this.start_x = Shape.START_X;   //线段的起始位置
	this.start_y = Shape.START_Y;
	this.end_x = Shape.END_X;      //线段的末尾位置
	this.end_y = Shape.END_Y;
	//文本
	this.text = Shape.TEXT;                 //文本内容
	this.textAlign = Shape.TEXTALIGN;       //文本对其方式
	this.textBaseline = Shape.TEXTBASELINE;
	this.font = Shape.FONT;                 //字体
	//颜色
	this.backColor = Shape.BACKCOLOR;  //矩形 圆 背景色
	this.edgeColor = Shape.EDGECOLOR;  //矩形 圆 边框色
	this.textColor = Shape.TEXTCOLOR;  //文本色
	this.lineColor = Shape.LINECOLOR;  //线段 线条色	
	//宽度
	this.edgeWidth = Shape.EDGEWIDTH;   //矩形 圆 边框宽度
	this.lineWidth = Shape.LINEWIDTH;   //线段宽度
	//速度
	this.moveSpeed = Shape.MOVE_SPEED; //移动速度 
	this.fadeSpeed = Shape.FADE_SPEED; //淡入淡出速度
	//透明度
	this.alpha = Shape.ALPHA;		 		//透明度	
	this.startAlpha = Shape.START_ALPHA;    //淡入的起始透明度/淡出的末尾透明度
	this.endAlpha = Shape.END_ALPHA;        //淡入的末尾透明度/淡出的起始透明度
	
	this.animationStatus = new Array();		//各个动画的运行状态  new第一次运行 run正在运行 stop结束了
}
Shape.prototype.setArguments = function(cfg)  //设置参数
{
	for(var x in cfg)
		this[x] = cfg[x];
}
Shape.prototype.dispatcher = function(cmd, cfg)	//动画命令调度器 cmd动画指令 cfg为参数
{
	if(this.animationStatus[cmd] == "new")
	{
		this.setArguments(cfg);		//先设置参数
		if(!this.Canvas.exist(this))    //每在画板上变换一个图形对象，都要将该对象保存到画板的ShapeOnCanvas叔祖里 	
		this.Canvas.save(this);
	}
	switch (cmd)
	{
		case "Draw":
			this.draw();
			break;	
		case "FadeIn":
			this.fade("FadeIn");
			break;
		case "FadeOut":
			this.fade("FadeOut");
			break;
		case "Move":
			this.move();
			break;
		case "Delete":
			this.del();
			break;
	}	
}
Shape.prototype.del = function()  //从画板上删除该图形
{
	this.Canvas.del(this);
	this.Canvas.restore();
	this.animationStatus["Delete"] = "stop";
}
Shape.prototype.fade = function(action)  //淡入/淡出图形
{	
	if(this.animationStatus[action] == "new")
	{
		if(action == "FadeIn")	//淡入
		{
			this.alphaFactor = 1;
			this.alpha = this.startAlpha;
		}
		else if(action == "FadeOut")	//淡出
		{
			this.alphaFactor = -1;
			this.alpha = this.endAlpha;
		}
		this.animationStatus[action] = "run";
	}
	else if(this.animationStatus[action] == "run")
	{
		this.alpha += this.fadeSpeed * this.alphaFactor;	
		if(this.alpha >= this.endAlpha)
		{
			this.alpha = this.endAlpha;
			this.animationStatus[action] = "stop"
		}
		if(this.alpha <= this.startAlpha)
		{
			this.alpha = this.startAlpha;
			this.animationStatus[action] = "stop"
		}
	}
}
Shape.prototype.nextPosition = function(x1,y1,x2,y2,speed)  //(x1,x2)移动到(默认以两点间直线移动)(x2,y2)且x(或y)每次变化speed的下一为位置
{
	speed = speed == null ? this.moveSpeed : speed;
	if(Math.abs(x1 - x2) <= speed && Math.abs(y1 - y2) <= speed)	//到达目标位置
	{
		x1 = x2;
		y1 = y2;
		var	arrive = true;
	}
	else	//计算下一个位置
	{
		if(x1 != x2)   //求出直线方程的k与b
		{
			var k = (y1 - y2) / (x1 - x2);  
			var b = y1 - k * x1;
			x1 += speed * (x2 - x1) / Math.abs(x2 - x1);
			y1 = k * x1 + b;
		}
		else
		{
			if(y2 != y1)
				y1 += speed * (y2 - y1) / Math.abs(y2 - y1);
		}	
		var	arrive = false;
	}
	return {x : x1, y : y1, arrive : arrive};	//返回下一个位置和抵达信号
}	
Shape.prototype.move = function() //移动图形
{
	if(this.animationStatus["Move"] == "new")
	{
		this.aim_x = this.aim_x == null ? this.x : this.aim_x;		//设置目标位置
		this.aim_y = this.aim_y == null ? this.y : this.aim_y;
		this.animationStatus["Move"] = "run";
	}
	else if(this.animationStatus["Move"] == "run")
	{
		var position = this.nextPosition(this.x,this.y,this.aim_x, this.aim_y, this.moveSpeed); 
		this.x = position.x;	//设置移动图形当前新位置
		this.y = position.y;
		if(position.arrive)	//如果到达目标位置
		{
			this.animationStatus["Move"] = "stop";
		}
	}
}

/*Shape.prototype.saveArguments = function()*/
//{
	//for(var x in this)
	//{
		//var type = typeof(this[x]);
		//if(type == "number" || type == "string" || type == "object")
			//this.argument[x] = this[x];
	//}
	//this.saveArgumentsFlag = true;
//}
//Shape.prototype.restoreArguments = function(cfg)
//{
	//for(var x in this)
	//{
		//var type = typeof(this[x]);
		//if(type == "number" || type == "string" || type == "object")
			//this[x] = this.argument[x];
	//}
	//this.saveArgumentsFlag = false;

/*}*/

