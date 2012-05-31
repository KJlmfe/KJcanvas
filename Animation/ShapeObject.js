Shape = function() //图形类(所有图形的父类)
{
	this.w = Shape.WIDTH;   //矩形宽
	this.h = Shape.HEIGHT;		//矩形高
	this.r = Shape.RADIUS;		//圆半径
	this.length = Shape.LENGTH;   //线段长度

 	this.x = Shape.X;	 //矩形的中心  圆的圆心  线段的中点
	this.y = Shape.Y;
	
	this.start_x = Shape.START_X;   //线段的起始位置
	this.start_y = Shape.START_Y;
	this.end_x = Shape.END_X;      //线段的末尾位置
	this.end_y = Shape.END_Y;

	this.text = Shape.TEXT;  //文本内容
	this.textAlign = Shape.TEXTALIGN; //文本对其方式
	this.textBaseline = Shape.TEXTBASELINE;

	this.backColor = Shape.BACKCOLOR;  //矩形 圆 背景色
	this.edgeColor = Shape.EDGECOLOR;  //矩形 圆 边框色
	this.textColor = Shape.TEXTCOLOR;  //文本色
	this.lineColor = Shape.LINECOLOR;  //线段 线条色	
	this.font = Shape.FONT;  //字体
	 
	this.edgeWidth = Shape.EDGEWIDTH; //矩形 圆 边框宽度
	this.lineWidth = Shape.LINEWIDTH;  //线段 宽度

	this.move_speed = Shape.MOVE_SPEED; //移动速度 
	this.alpha = 1;	

}
Shape.prototype.del = function()  //从画板上删除该图形
{
	this.canvas.del(this);
	this.canvas.restore();
}
Shape.prototype.draw = function()  //在this.canvas画板上的x,y位置画出该图形
{
	if(!this.canvas.exist(this))    //每在画板上画一个图形对象，都要将该对象保存到画板的Shape里 	
		this.canvas.save(this);

	this.canvas.ctx.save();
	this.drawMethod();  //调用图形绘画方法
	this.canvas.ctx.restore();
}
Shape.prototype.fadeOut = function()  //在this.canvas画板上的x,y位置画出该图形
{
	if(!this.canvas.exist(this))    //每在画板上画一个图形对象，都要将该对象保存到画板的Shape里 	
		this.canvas.save(this);
	this.canvas.ctx.save();
	var me = this;
	this.drawTimer = setInterval(function(){
		me.alpha += me.drawSpeed;
		if(me.alpha >= me.aim_alpha)
			me.alpha = me.aim_alpha;
		me.drawMethod();
		if(me.alpha == me.aim_alpha)
		{
			me.canvas.ctx.restore();
			clearInterval(me.drawTimer);
		}
	},me.canvas.refresh_time);
}
Shape.prototype.move = function() //移动
{
	var me = this;  //setInterval 里不能直接调用this.draw,所以使用变量作用域解决这个问题
	if(this.aim_x == null)
		this.aim_x = this.x;
	if(this.aim_y == null)
		this.aim_y = this.y;
	//默认沿着两点间的直线路径移动
	if(me.x != me.aim_x)   //求出直线方程的k与b
	{
		me.k = (me.y - me.aim_y) / (me.x - me.aim_x);  
		me.b = me.y - me.k*me.x;
	}
	else
	{
		me.k = 0;
		me.b = 0;
	}
	
	if(this.aim_x > this.x)   // 原图形右侧运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			me.canvas.clear();
			//把要移动的图形对象从画布上删除
			me.canvas.del(me);
			//重画画布上的图形
			me.canvas.restore();
			//绘制移动图形
			me.x += me.move_speed;
			me.y = me.k*me.x + me.b;
			if(me.x >= me.aim_x)
			{
				me.x = me.aim_x;
				me.y = me.aim_y;
			}
			me.draw(me.canvas,me.x,me.y);
			//判断是否到达目标位置
			if(me.aim_x == me.x)
				clearInterval(me.timer);
		},me.canvas.refresh_time);
	}
	else if(this.aim_x < this.x)   // 原图形左侧运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			me.canvas.clear();
			//把要移动的图形对象从画布上删除
			me.canvas.del(me);
			//重画画布上的图形
			me.canvas.restore();
			//绘制移动图形
			me.x -= me.move_speed;
			me.y = me.k*me.x + me.b;
			if(me.x <= me.aim_x)
			{
				me.x = me.aim_x;
				me.y = me.aim_y;
			}
			me.draw(me.canvas,me.x,me.y);
			//判断是否到达目标位置
			if(me.aim_x == me.x)
				clearInterval(me.timer);
		},me.canvas.refresh_time);
	}
	else if(this.aim_y < this.y)   // 原图形正上方运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			me.canvas.clear();
			//把要移动的图形对象从画布上删除
			me.canvas.del(me);
			//重画画布上的图形
			me.canvas.restore();
			//绘制移动图形
			me.y -= me.move_speed;
			if(me.y < me.aim_y)
				me.y = me.aim_y;
			me.draw(me.canvas,me.x,me.y);
			//判断是否到达目标位置
			if(me.aim_y == me.y)
				clearInterval(me.timer);
		},me.canvas.refresh_time);
	}
	else if(this.aim_y > this.y)   // 原图形正下方运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			me.canvas.clear();
			//把要移动的图形对象从画布上删除
			me.canvas.del(me);
			//重画画布上的图形
			me.canvas.restore();
			//绘制移动图形
			me.y += me.move_speed;
			if(me.y > me.aim_y)
				me.y = me.aim_y;
			me.draw(me.canvas,me.x,me.y);
			//判断是否到达目标位置
			if(me.aim_y ==  me.y)
				clearInterval(me.timer);
		},me.canvas.refresh_time);
	}
}
Shape.prototype.timeOfMove = function() //计算移动矩形的动画时间
{
	if(this.aim_x > this.x)   // 原图形右侧运动
	{
		return Math.ceil( (this.aim_x - this.x) / this.move_speed ) * this.canvas.refresh_time;
	}
	else if(this.aim_x < this.x)   // 原图形左侧运动
	{
		return Math.ceil( (this.x - this.aim_x) / this.move_speed ) * this.canvas.refresh_time;
	}
	else if(this.aim_y < this.y)   // 原图形正上方运动
	{
		return Math.ceil( (this.y - this.aim_y) / this.move_speed ) * this.canvas.refresh_time;
	}
	else if(this.aim_y > this.y)   // 原图形正下方运动
	{
		return Math.ceil( (this.aim_y - this.y) / this.move_speed ) * this.canvas.refresh_time;
	}
}
Shape.prototype.timeOfDraw = function()
{
	return 0;
}
Shape.prototype.timeOfFadeOut = function()
{
	return (this.aim_alpha - this.alpha)/this.drawSpeed * this.canvas.refresh_time;
}
Shape.prototype.timeOfDelete = function()
{
	return 0;
}
Shape.prototype.saveArguments = function()
{
	for(var x in this)
	{
		var type = typeof(this[x]);
		if(type == "number" || type == "string" || type == "object")
			this.argument[x] = this[x];
	}
	this.saveArgumentsFlag = true;
}
Shape.prototype.restoreArguments = function(cfg)
{
	for(var x in this)
	{
		var type = typeof(this[x]);
		if(type == "number" || type == "string" || type == "object")
			this[x] = this.argument[x];
	}
	this.saveArgumentsFlag = false;

}
Shape.prototype.setArguments = function(cfg)
{
	for(var x in cfg)
		this[x] = cfg[x];
}

