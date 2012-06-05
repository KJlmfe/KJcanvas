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
}
Shape.prototype.setArguments = function(cfg)  //设置参数
{
	for(var x in cfg)
		this[x] = cfg[x];
}
Shape.prototype.startAnimation = function()	//开始动画的准备工作
{
	this.Canvas.cmdRunning++;       //正在执行的动画个数++
	if(!this.Canvas.exist(this))    //每在画板上变换一个图形对象，都要将该对象保存到画板的ShapeOnCanvas叔祖里 	
		this.Canvas.save(this);
	this.Canvas.ctx.save();		    //保存当前画笔状态
}
Shape.prototype.endAnimation = function() //结束动画的收尾工作
{
	this.Canvas.ctx.restore();	//恢复之前画笔状态
	this.Canvas.cmdRunning--;	//正在执行的动画个数--
}
Shape.prototype.dispatcher = function(cmd, cfg)	//动画命令调度器 cmd动画指令 cfg为参数
{
	this.setArguments(cfg);		//先设置参数
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
	this.startAnimation();
	this.Canvas.del(this);
	this.Canvas.restore();
	this.endAnimation();
}
Shape.prototype.fade = function(action)  //淡入/淡出图形
{	
	this.startAnimation();
	if(action == "FadeIn")	//淡入
	{
		var factor = 1;
		this.alpha = this.startAlpha;
	}
	else if(action == "FadeOut")	//淡出
	{
		var factor = -1;
		this.alpha = this.endAlpha;
	}

	var me = this;
	this.fadeTimer = setInterval(function()	
	{
		me.alpha += me.fadeSpeed * factor;	
		if(me.alpha >= me.endAlpha)
			me.alpha = me.endAlpha;
		if(me.alpha <= me.startAlpha)
			me.alpha = me.startAlpha;
		me.del();
		me.draw();
		if(me.alpha == me.endAlpha || me.alpha == me.startAlpha)
		{
			me.endAnimation();
			clearInterval(me.fadeTimer);
		}
	}, me.Canvas.refreshTime);
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
	this.startAnimation();
	this.aim_x = this.aim_x == null ? this.x : this.aim_x;		//设置目标位置
	this.aim_y = this.aim_y == null ? this.y : this.aim_y;

	var me = this;  //setInterval里不能直接调用this,所以使用变量作用域解决这个问题
	this.moveTimer = setInterval(function()
	{
		me.Canvas.clear();	//擦干净画布
		me.del();			//把要移动的图形对象从画布上删除
		var position = me.nextPosition(me.x, me.y, me.aim_x, me.aim_y, me.moveSpeed); 
		me.x = position.x;	//设置移动图形当前新位置
		me.y = position.y;
		me.draw();			//绘制移动图形
		if(position.arrive)	//如果到达目标位置
		{
			me.endAnimation();
			clearInterval(me.moveTimer);			
		}
	}, me.Canvas.refreshTime);
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

