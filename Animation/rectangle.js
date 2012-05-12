canvas = function(width,height)
{
	this.w = width;
	this.h = height;
	this.Shape = new Array(); //用于保存画板上存在的图形对象
}
canvas.prototype.exist = function(obj)  //判断obj图形对象是否在画板上存在
{
	for(i=0;i<this.Shape.length;i++)
		if(this.Shape[i] == obj)
			return true;
	return false;
}
canvas.prototype.save = function(obj) //保存obj图形对象到Shape数组
{
	this.Shape.push(obj);
}
canvas.prototype.restore = function() //将Shape里的所有图形对象重绘
{
	for(i=0;i<this.Shape.length;i++)
		if(this.Shape[i])
			this.Shape[i].draw();
}
canvas.prototype.del = function(obj) //从Shape里删除一个图形对象
{
	for(i=0;i<this.Shape.length;i++)
		if(this.Shape[i] == obj)
		{
			this.Shape[i] = null;
			break;
		}
}
canvas.prototype.clear = function() //清空画板
{
	ctx.clearRect(0,0,this.w,this.h);
}

Rectangle = function(width,height,x,y,color) //矩形长、宽，位置，颜色
{
	this.id = this;
	this.color = color;
	this.w = width;
	this.h = height;
	this.x = x;
	this.y = y;
}
Rectangle.prototype.draw = function(x,y) //矩形左上角所在位置
{
	if(!canvas.exist(this)) //每在画板上画一个图形对象，都要将该对象保存到画板的Shape里 
		canvas.save(this);
	if(x && y)   //更新当前位置
	{
		this.x = x;
		this.y = y;
	}
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x,this.y,this.w,this.h);  //画一个实体矩形
//	this.ctx.strokeRect(this.x,this.y,this.w,this.h); //勾画出矩形边框
//	this.ctx.clearRect(this.x,this.y,this.w,this.h);  //清空内部，只留边框	
}
Rectangle.prototype.clear = function() //橡皮擦擦掉矩形
{
	this.ctx.clearRect(this.x,this.y,this.w,this.h);
}
Rectangle.prototype.move = function(x,y,speed,action) //移动一个巨型
{
	if(x && y)  //设置目标位置
	{
		this.aimX = x;
		this.aimY = y;
	}
	else
		return;
	if(speed)  //设置移动速度
		this.speed = speed;
	else
		this.speed = 24;
	if(action)  //设置移动路线
		this.action = action;
	else
		this.action = "line";

	var me = this;  //setInterval 里不能直接调用this.draw,所以使用变量作用域解决这个问题
	
	
	//默认沿着两点间的直线路径移动
	if(me.x != me.aimX)
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
			canvas.clear();
			//把要移动的图形对象从画布上删除
			canvas.del(me);
			//重画画布上的图形
			canvas.restore();
			//绘制移动图形
			me.x++;
			me.y = me.k*me.x + me.b;
			me.draw(me.x,me.y);
			//判断是否到达目标位置
			if(me.aimX == me.x)
				clearInterval(me.timer);
		},me.speed);
	}
	else if(this.aimX < this.x)   // 原图形左侧运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			canvas.clear();
			//把要移动的图形对象从画布上删除
			canvas.del(me);
			//重画画布上的图形
			canvas.restore();
			//绘制移动图形
			me.x--;
			me.y = me.k*me.x + me.b;
			me.draw(me.x,me.y);
			//判断是否到达目标位置
			if(me.aimX == me.x)
				clearInterval(me.timer);
		},me.speed);
	}
	else if(this.aimY < this.y)   // 原图形正上方运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			canvas.clear();
			//把要移动的图形对象从画布上删除
			canvas.del(me);
			//重画画布上的图形
			canvas.restore();
			//绘制移动图形
			me.y--;
			me.draw(me.x,me.y);
			//判断是否到达目标位置
			if(me.aimY == me.y)
				clearInterval(me.timer);
		},me.speed);
	}
	else if(this.aimY > this.y)   // 原图形正下方运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			canvas.clear();
			//把要移动的图形对象从画布上删除
			canvas.del(me);
			//重画画布上的图形
			canvas.restore();
			//绘制移动图形
			me.y++;
			me.draw(me.x,me.y);
			//判断是否到达目标位置
			if(me.aimY == me.y)
				clearInterval(me.timer);
		},me.speed);
	}
}
