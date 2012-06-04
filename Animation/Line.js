Line = function(cfg) 
{
	this.setArguments(cfg);
}
Line.prototype = new Shape;  //继承图形父类
Line.prototype.draw = function() //绘画矩形的方法
{
	this.startAnimation();
	
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

	this.endAnimation();
}
Line.prototype.move = function() //移动
{
	this.startAnimation();
	
	if(this.aim_StartShape != null)
	{
		this.aim_start_x = this.aim_StartShape.x;
		this.aim_start_y = this.aim_StartShape.y;	
	}
	else 
	{
		this.aim_start_x = this.aim_start_x == null ? this.start_x : this.aim_start_x;
		this.aim_start_y = this.aim_start_y == null ? this.start_y : this.aim_start_y;
		this.aim_StartShape = this.StartShape;
	}
	
	if(this.aim_EndShape != null)
	{
		this.aim_end_x = this.aim_EndShape.x;
		this.aim_end_y = this.aim_EndShape.y;
	}
	else 
	{
		this.aim_end_x = this.aim_end_x == null ? this.end_x : this.aim_end_x;
		this.aim_end_y = this.aim_end_y == null ? this.end_y : this.aim_end_y;
		this.aim_EndShape = this.EndShape;
	}

	this.StartShape = null;
	this.EndShape = null;

	//默认沿着两点间的直线路径移动
	if(this.start_x != this.aim_start_x)   //求出直线方程的k与b
	{
		var start_k = (this.start_y - this.aim_start_y) / (this.start_x - this.aim_start_x);  
		var start_b = this.start_y - start_k * this.start_x;
		var start_factor_y = 0;
		if(this.start_x < this.aim_start_x)
			var start_factor_x = 1;
		else
			var start_factor_x = -1;
	}
	else
	{
		var start_k = 0;
		var start_b = 0;
		var start_factor_x = 0;
		if(this.start_y < this.aim_start_y)
			var start_factor_y = 1;
		else if(this.start_y > this.aim_start_y)
		 	var start_factor_y = -1;
		else
			var start_factor_y = 1;
	}
	
	if(this.end_x != this.aim_end_x)   //求出直线方程的k与b
	{
		var end_k = (this.end_y - this.aim_end_y) / (this.end_x - this.aim_end_x);  
		var end_b = this.end_y - end_k * this.end_x;
		var end_factor_y = 0;
		if(this.end_x < this.aim_end_x)
			var end_factor_x = 1;
		else
			var end_factor_x = -1;
	}
	else
	{
		var end_k = 0;
		var end_b = 0;
		var end_factor_x = 0;
		if(this.end_y < this.aim_end_y)
			var end_factor_y = 1;
		else if(this.end_y > this.aim_end_y)
		 	var end_factor_y = -1;
		else
			var end_factor_y = 1;
	}

	var me = this;	
	this.moveTimer = setInterval(function()
	{
		//擦干净画布
		me.Canvas.clear();
		//把要移动的图形对象从画布上删除
		me.del();
		//绘制移动图形
		if(Math.abs(me.start_x- me.aim_start_x) <= me.moveSpeed && Math.abs(me.start_y- me.start_aim_y))
		{
			me.start_x = me.aim_start_x;
			me.start_y = me.aim_start_y;
			var start_flag = true;
		}
		else
		{
			me.start_x += me.moveSpeed * start_factor_x;
			if(start_k == 0 && start_b == 0)
			{
				me.start_y = start_k * me.start_x + start_b;
			}
			else
			{
				me.start_y +=  me.moveSpeed * start_factor_y;
			}
			var start_flag = false; 
		}
		if(Math.abs(me.end_x- me.aim_end_x) <= me.moveSpeed && Math.abs(me.end_y- me.end_aim_y))
		{
			me.end_x = me.aim_end_x;
			me.end_y = me.aim_end_y;
			var end_flag = true;
		}
		else
		{
			me.end_x += me.moveSpeed * end_factor_x;
			if(end_k == 0 && end_b == 0)
			{
				me.end_y = end_k * me.end_x + end_b;
			}
			else
			{
				me.end_y +=  me.moveSpeed * end_factor_y;
			}
			//me.end_y = end_k * me.end_x + end_b + me.moveSpeed * end_factor_y + me.end_y * Math.abs(end_factor_y);
			var end_flag = false;
		}
		if(start_flag && end_flag)
		{
			me.StartShape = me.aim_StartShape;
			me.EndShape = me.aim_EndShape;
			me.draw();
			me.endAnimation();
			clearInterval(me.moveTimer);			
		}
		else
			me.draw();
	}, me.Canvas.refreshTime);
}
