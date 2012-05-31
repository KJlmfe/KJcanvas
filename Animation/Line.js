Line = function(cfg) 
{
	this.argument = new Array(1000);
	this.saveArgumentsFlag = false;
	this.setArguments(cfg);
}
Line.prototype = new Shape;  //继承图形父类
Line.prototype.drawMethod = function() //绘画矩形的方法
{
	if(this.StartShape != null)
	{
		this.start_x = this.StartShape.x;
		this.start_y = this.StartShape.y;
	}
	if(this.EndShape != null)
	{
		this.end_x = this.EndShape.x;
		this.end_y = this.EndShape.y;
	}

	this.Canvas.ctx.globalAlpha = this.alpha;
	this.Canvas.ctx.beginPath();
	this.Canvas.ctx.lineWidth = this.lineWidth;
	this.Canvas.ctx.moveTo(this.start_x,this.start_y);
	this.Canvas.ctx.lineTo(this.end_x,this.end_y);
	this.Canvas.ctx.strokeStyle = this.lineColor;
	this.Canvas.ctx.stroke();
}
Line.prototype.move = function() //移动
{
	if(this.aim_StartShape != null)
	{
		this.aim_start_x = this.aim_StartShape.x;
		this.aim_start_y = this.aim_StartShape.y;

		this.StartShape = null;
	}
	else 
	{
		if(this.aim_start_x == null)
			this.aim_start_x = this.start_x;
		if(this.aim_start_y == null)
			this.aim_start_y = this.start_y;
	}

	if(this.aim_EndShape != null)
	{
		this.aim_end_x = this.aim_EndShape.x;
		this.aim_end_y = this.aim_EndShape.y;

		this.EndShape =  null;
	}
	else 
	{
		if(this.aim_end_x == null)
			this.aim_end_x = this.end_x;
		if(this.aim_end_y == null)
			this.aim_end_y = this.end_y;
	}

	var me = this;  //setInterval 里不能直接调用this.draw,所以使用变量作用域解决这个问题
	
	//默认沿着两点间的直线路径移动
	if(me.start_x != me.aim_start_x)   //求出直线方程的k与b
	{
		me.start_k = (me.start_y - me.aim_start_y) / (me.start_x - me.aim_start_x);  
		me.start_b = me.start_y - me.start_k * me.start_x;
	}
	else
	{
		me.start_k = 0;
		me.start_b = 0;
	}
	
	if(me.end_x != me.aim_end_x)   //求出直线方程的k与b
	{
		me.end_k = (me.end_y - me.aim_end_y) / (me.end_x - me.aim_end_x);  
		me.end_b = me.end_y - me.end_k * me.end_x;
	}
	else
	{
		me.end_k = 0;
		me.end_b = 0;
	}
	
		this.timer = setInterval(function(){
			//擦干净画布
			me.Canvas.clear();
			//把要移动的图形对象从画布上删除
			me.Canvas.del(me);
			//重画画布上的图形
			me.Canvas.restore();
			//绘制移动图形
			if(me.aim_start_x > me.start_x)
			{
				me.start_x += me.moveSpeed;
				me.start_y = me.start_k*me.start_x + me.start_b;
				if(me.aim_start_x <= me.start_x)
				{
					me.start_x = me.aim_start_x;
					me.start_y = me.aim_start_y;
				}
			}
			else if(me.aim_start_x < me.start_x)
			{
				me.start_x -= me.moveSpeed;
				me.start_y = me.start_k*me.start_x + me.start_b;
				if(me.aim_start_x >= me.start_x)
				{
					me.start_x = me.aim_start_x;
					me.start_y = me.aim_start_y;
				}
			}
			else if(me.aim_start_y < me.start_y)
			{
				me.start_y -= me.moveSpeed;
				if(me.aim_start_y >= me.start_y)
				{
					me.start_y = me.aim_start_y;
				}
			}
			else if(me.aim_start_y > me.start_y)
			{
				me.start_y += me.moveSpeed;
				if(me.aim_start_y <= me.start_y)
				{
					me.start_y = me.aim_start_y;
				}
			}
			
			if(me.aim_end_x > me.end_x)
			{
				me.end_x += me.moveSpeed;
				me.end_y = me.end_k*me.end_x + me.end_b;
				if(me.aim_end_x <= me.end_x)
				{
					me.end_x = me.aim_end_x;
					me.end_y = me.aim_end_y;
				}
			}
			else if(me.aim_end_x < me.end_x)
			{
				me.end_x -= me.moveSpeed;
				me.end_y = me.end_k*me.end_x + me.end_b;
				if(me.aim_end_x >= me.end_x)
				{
					me.end_x = me.aim_end_x;
					me.end_y = me.aim_end_y;
				}
			}
			else if(me.aim_end_y < me.end_y)
			{
				me.end_y -= me.moveSpeed;
				if(me.aim_end_y >= me.end_y)
				{
					me.end_y = me.aim_end_y;
				}
			}
			else if(me.aim_end_y > me.end_y)
			{
				me.end_y += me.moveSpeed;
				if(me.aim_end_y <= me.end_y)
				{
					me.end_y = me.aim_end_y;
				}
			}	
			me.draw();
			//判断是否到达目标位置
			if(me.start_x == me.aim_start_x && me.start_y == me.aim_start_y  && me.end_x == me.aim_end_x && me.end_y == me.aim_end_y)
			{
				if(me.aim_StartShape != null)
					me.StartShape = me.aim_StartShape;
				if(me.aim_EndShape != null)
					me.EndShape = me.aim_EndShape;
				clearInterval(me.timer);
			}
		},me.Canvas.refresh_time);
}
Line.prototype.timeOfMove = function() //计算移动矩形的动画时间
{
	if(this.aim_start_x > this.start_x)   // 原图形右侧运动
	{
		var timer1 = Math.ceil( (this.aim_start_x - this.start_x) / this.moveSpeed ) * this.Canvas.refresh_time;
	}
	else if(this.aim_start_x < this.start_x)   // 原图形左侧运动
	{
		var timer1 =  Math.ceil( (this.start_x - this.aim_start_x) / this.moveSpeed ) * this.Canvas.refresh_time;
	}
	else if(this.aim_start_y < this.start_y)   // 原图形正上方运动
	{
		var timer1 =  Math.ceil( (this.start_y - this.aim_start_y) / this.moveSpeed ) * this.Canvas.refresh_time;
	}
	else if(this.aim_start_y > this.start_y)   // 原图形正下方运动
	{
		var timer1 =  Math.ceil( (this.aim_start_y - this.start_y) / this.moveSpeed ) * this.Canvas.refresh_time;
	}

	if(this.aim_end_x > this.end_x)   // 原图形右侧运动
	{
		var timer2 = Math.ceil( (this.aim_end_x - this.end_x) / this.moveSpeed ) * this.Canvas.refresh_time;
	}
	else if(this.aim_end_x < this.end_x)   // 原图形左侧运动
	{
		var timer2 =  Math.ceil( (this.end_x - this.aim_end_x) / this.moveSpeed ) * this.Canvas.refresh_time;
	}
	else if(this.aim_end_y < this.end_y)   // 原图形正上方运动
	{
		var timer2 =  Math.ceil( (this.end_y - this.aim_end_y) / this.moveSpeed ) * this.Canvas.refresh_time;
	}
	else if(this.aim_end_y > this.end_y)   // 原图形正下方运动
	{
		var timer2 =  Math.ceil( (this.aim_end_y - this.end_y) / this.moveSpeed ) * this.Canvas.refresh_time;
	}

	return timer1 > timer2 ? timer1 : timer2;
}
