Shape = function() //图形类(所有图形的父类)
{
	//图形大小
	this.w = Shape.WIDTH;  
	this.h = Shape.HEIGHT;
	
	this.text = Shape.TEXT;  //文本内容
	this.textAlign = Shape.TEXTALIGN; //文本对其方式
	this.textBaseline = Shape.TEXTBASELINE;

	this.backColor = Shape.BACKCOLOR;  //背景色
	this.edgeColor = Shape.EDGECOLOR;  //边框色
	this.textColor = Shape.TEXTCOLOR;  //文本色
	
	this.font = Shape.FONT;  //字体
	 
 	this.x = Shape.START_X;	 //起始位置
	this.y = Shape.START_Y;
	this.aimX = Shape.END_X;  //目标位置
	this.aimY = Shape.END_Y;
	this.move_speed = Shape.MOVE_SPEED; //移动速度 
	this.move_path = Shape.MOVE_PATH;  //移动路线
}
Shape.prototype.del = function()  //从画板上删除该图形
{
	this.canvas.del(this);
	this.canvas.restore();
}
Shape.prototype.draw = function(canvas,x,y)  //在canvas画板上的x,y位置画出该图形
{
	this.canvas = canvas == null ? this.canvas : canvas;
	
	if(!this.canvas.exist(this))    //每在画板上画一个图形对象，都要将该对象保存到画板的Shape里 
		this.canvas.save(this);

	//更新当前位置
	this.x = this.x == null ? Shape.START_X : this.x;  
	this.y = this.y == null ? Shape.START_Y : this.y
	this.x = x == null ? this.x : x;
	this.y = y == null ? this.y : y;

	this.drawMethod();  //调用图形绘画方法
}
Shape.prototype.move = function(x,y,speed,path) //移动一个巨型
{
	//设置目标位置、移动速度、移动路径
	this.aimX = x == null ? Shape.END_X : x;
	this.aimY = y == null ? Shape.END_Y : y
	this.move_speed = speed == null ? Shape.MOVE_SPEED : speed;

	var me = this;  //setInterval 里不能直接调用this.draw,所以使用变量作用域解决这个问题
	
	//默认沿着两点间的直线路径移动
	if(me.x != me.aimX)   //求出直线方程的k与b
	{
		me.k = (me.y - me.aimY) / (me.x - me.aimX);  
		me.b = me.y - me.k*me.x;
	}
	else
	{
		me.k = 0;
		me.b = 0;
	}
	
	if(this.aimX > this.x)   // 原图形右侧运动
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
			if(me.x >= me.aimX)
			{
				me.x = me.aimX;
				me.y = me.aimY;
			}
			me.draw(me.canvas,me.x,me.y);
			//判断是否到达目标位置
			if(me.aimX == me.x)
				clearInterval(me.timer);
		},me.canvas.refresh_time);
	}
	else if(this.aimX < this.x)   // 原图形左侧运动
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
			if(me.x <= me.aimX)
			{
				me.x = me.aimX;
				me.y = me.aimY;
			}
			me.draw(me.canvas,me.x,me.y);
			//判断是否到达目标位置
			if(me.aimX == me.x)
				clearInterval(me.timer);
		},me.canvas.refresh_time);
	}
	else if(this.aimY < this.y)   // 原图形正上方运动
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
			if(me.y < me.aimY)
				me.y = me.aimY;
			me.draw(me.canvas,me.x,me.y);
			//判断是否到达目标位置
			if(me.aimY == me.y)
				clearInterval(me.timer);
		},me.canvas.refresh_time);
	}
	else if(this.aimY > this.y)   // 原图形正下方运动
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
			if(me.y > me.aimY)
				me.y = me.aimY;
			me.draw(me.canvas,me.x,me.y);
			//判断是否到达目标位置
			if(me.aimY ==  me.y)
				clearInterval(me.timer);
		},me.canvas.refresh_time);
	}
}
Shape.prototype.timeOfMove = function(canvas,x,y,speed) //计算移动矩形的动画时间
{
	this.canvas = canvas;
	//设置目标位置
	this.aimX = x == null ? Shape.END_X : x;
	this.aimY = y == null ? Shape.END_Y : y
	this.move_speed = speed == null ? Shape.MOVE_SPEED : speed;
	
	if(this.aimX > this.x)   // 原图形右侧运动
	{
		return Math.ceil( (this.aimX - this.x) / this.move_speed ) * this.canvas.refresh_time;
	}
	else if(this.aimX < this.x)   // 原图形左侧运动
	{
		return Math.ceil( (this.x - this.aimX) / this.move_speed ) * this.canvas.refresh_time;
	}
	else if(this.aimY < this.y)   // 原图形正上方运动
	{
		return Math.ceil( (this.y - this.aimY) / this.move_speed ) * this.canvas.refresh_time;
	}
	else if(this.aimY > this.y)   // 原图形正下方运动
	{
		return Math.ceil( (this.aimY - this.y) / this.move_speed ) * this.canvas.refresh_time;
	}
}
