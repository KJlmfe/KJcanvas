Line = function(cfg) 
{
	this.setArguments(cfg);
}
Line.prototype = new Shape;  //继承图形父类
Line.prototype.drawMethod = function() //绘画矩形的方法
{
	if(this.startObject != null)
	{
		this.start_x = this.startObject.x;
		this.start_y = this.startObject.y;
	}
	if(this.endObject != null)
	{
		this.end_x = this.endObject.x;
		this.end_y = this.endObject.y;
	}

	this.canvas.ctx.beginPath();
	this.canvas.ctx.lineWidth = this.lineWidth;
	this.canvas.ctx.moveTo(this.start_x,this.start_y);
	this.canvas.ctx.lineTo(this.end_x,this.end_y);
	this.canvas.ctx.strokeStyle = this.lineColor;
	this.canvas.ctx.stroke();
}
Line.prototype.move = function() //移动
{
	var me = this;  //setInterval 里不能直接调用this.draw,所以使用变量作用域解决这个问题
	
	//默认沿着两点间的直线路径移动
	if(me.start_x != me.aim_x)   //求出直线方程的k与b
	{
		me.k = (me.start_y - me.aim_y) / (me.start_x - me.aim_x);  
		me.start_b = me.start_y - me.k*me.start_x;
		me.end_b = me.end_y - me.k*me.end_x;
	}
	else
	{
		me.k = 0;
		me.start_b = 0;
		me.end_b = 0;
	}
	
	if(this.aim_x > this.start_x)   // 原图形右侧运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			me.canvas.clear();
			//把要移动的图形对象从画布上删除
			me.canvas.del(me);
			//重画画布上的图形
			me.canvas.restore();
			//绘制移动图形
			me.start_x += me.move_speed;
			me.start_y = me.k*me.start_x + me.start_b;
			me.end_x += me.move_speed;
			me.end_y = me.k*me.end_x + me.end_b;
			if(me.start_x >= me.aim_x)
			{
				me.start_x = me.aim_x;
				me.start_y = me.aim_y;
				me.end_x -= me.start_x -me.aim_x;
				me.end_y = me.k*me.end_x + me.end_b;
			}
			me.draw();
			//判断是否到达目标位置
			if(me.aim_x == me.start_x)
				clearInterval(me.timer);
		},me.canvas.refresh_time);
	}
	else if(this.aim_x < this.start_x)   // 原图形左侧运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			me.canvas.clear();
			//把要移动的图形对象从画布上删除
			me.canvas.del(me);
			//重画画布上的图形
			me.canvas.restore();
			//绘制移动图形
			me.start_x -= me.move_speed;
			me.end_x -= me.move_speed;
			me.start_y = me.k*me.start_x + me.start_b;
			me.end_y = me.k*me.end_x + me.end_b;
			if(me.start_x <= me.aim_x)
			{
				me.start_x = me.aim_x;
				me.start_y = me.aim_y;
				me.end_x -= me.start_x -me.aim_x;
				me.end_y = me.k*me.end_x + me.end_b;
			}
			me.draw();
			//判断是否到达目标位置
			if(me.aim_x == me.start_x)
				clearInterval(me.timer);
		},me.canvas.refresh_time);
	}
	else if(this.aim_y < this.start_y)   // 原图形正上方运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			me.canvas.clear();
			//把要移动的图形对象从画布上删除
			me.canvas.del(me);
			//重画画布上的图形
			me.canvas.restore();
			//绘制移动图形
			me.start_y -= me.move_speed;
			me.end_y -= me.move_speed;
			if(me.start_y < me.aim_y)
			{
				me.start_y = me.aim_y;
				me.end_y += me.aim_y-me.start_y;
			}
			me.draw();
			//判断是否到达目标位置
			if(me.aim_y == me.start_y)
				clearInterval(me.timer);
		},me.canvas.refresh_time);
	}
	else if(this.aim_y > this.start_y)   // 原图形正下方运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			me.canvas.clear();
			//把要移动的图形对象从画布上删除
			me.canvas.del(me);
			//重画画布上的图形
			me.canvas.restore();
			//绘制移动图形
			me.start_y += me.move_speed;
			me.end_y += me.move_speed;
			if(me.start_y > me.aim_y)
			{
				me.start_y = me.aim_y;
				me.end_y += me.aim_y-me.start_y;
			}
			me.draw();
			//判断是否到达目标位置
			if(me.aim_y ==  me.start_y)
				clearInterval(me.timer);
		},me.canvas.refresh_time);
	}
}
Line.prototype.timeOfMove = function() //计算移动矩形的动画时间
{
	if(this.aim_x > this.start_x)   // 原图形右侧运动
	{
		return Math.ceil( (this.aim_x - this.start_x) / this.move_speed ) * this.canvas.refresh_time;
	}
	else if(this.aim_x < this.start_x)   // 原图形左侧运动
	{
		return Math.ceil( (this.start_x - this.aim_x) / this.move_speed ) * this.canvas.refresh_time;
	}
	else if(this.aim_y < this.start_y)   // 原图形正上方运动
	{
		return Math.ceil( (this.start_y - this.aim_y) / this.move_speed ) * this.canvas.refresh_time;
	}
	else if(this.aim_y > this.start_y)   // 原图形正下方运动
	{
		return Math.ceil( (this.aim_y - this.start_y) / this.move_speed ) * this.canvas.refresh_time;
	}
}
