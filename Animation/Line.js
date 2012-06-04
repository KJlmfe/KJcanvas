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

	var me = this;	
	this.moveTimer = setInterval(function()
	{
		//擦干净画布
		me.Canvas.clear();
		//把要移动的图形对象从画布上删除
		me.del();
		//绘制移动图形
		var start_position = me.nextPosition(me.start_x,me.start_y,me.aim_start_x,me.aim_start_y,me.moveSpeed);
		var end_position = me.nextPosition(me.end_x,me.end_y,me.aim_end_x,me.aim_end_y,me.moveSpeed);
		me.start_x = start_position.x;
		me.start_y = start_position.y;
		me.end_y = end_position.y;
		me.end_x = end_position.x;
		me.draw();
		if(start_position.arrive && end_position.arrive)
		{
			me.StartShape = me.aim_StartShape;
			me.EndShape = me.aim_EndShape;
			me.endAnimation();
			clearInterval(me.moveTimer);			
		}
	}, me.Canvas.refreshTime);
}	

