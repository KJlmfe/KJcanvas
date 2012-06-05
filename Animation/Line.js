Line = function(cfg)	//线段类 
{
	this.setArguments(cfg);
}
Line.prototype = new Shape;      //继承图形父类
Line.prototype.updatePosition = function()
{
	//设置线段的起始位置
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
}
Line.prototype.draw = function() //绘画线段的方法
{
	this.startAnimation();
	this.updatePosition();	

	this.Canvas.ctx.globalAlpha = this.alpha;
	this.Canvas.ctx.beginPath();
	this.Canvas.ctx.lineWidth = this.lineWidth;
	this.Canvas.ctx.moveTo(this.start_x,this.start_y);
	this.Canvas.ctx.lineTo(this.end_x,this.end_y);
	this.Canvas.ctx.strokeStyle = this.lineColor;
	this.Canvas.ctx.stroke();

	this.endAnimation();
}
Line.prototype.move = function() //移动线段
{
	this.startAnimation();
	this.updatePosition();	
	
	//设置移动目标线段的起始位置
	if(this.aimStartShape != null)
	{
		this.aimStart_x = this.aimStartShape.x;
		this.aimStart_y = this.aimStartShape.y;	
	}
	else 
	{
		this.aimStart_x = this.aimStart_x == null ? this.start_x : this.aimStart_x;
		this.aimStart_y = this.aimStart_y == null ? this.start_y : this.aimStart_y;
		this.aimStartShape = this.StartShape;
	}
	
	if(this.aimEndShape != null)
	{
		this.aimEnd_x = this.aimEndShape.x;
		this.aimEnd_y = this.aimEndShape.y;
	}
	else 
	{
		this.aimEnd_x = this.aimEnd_x == null ? this.end_x : this.aimEnd_x;
		this.aimEnd_y = this.aimEnd_y == null ? this.end_y : this.aimEnd_y;
		this.aimEndShape = this.EndShape;
	}

	this.StartShape = null;
	this.EndShape = null;

	var me = this;	
	this.moveTimer = setInterval(function()
	{
		me.Canvas.clear();	//擦干净画布
		me.del();			//把要移动的图形对象从画布上删除
		//设置当前的新位置
		var start_position = me.nextPosition(me.start_x,me.start_y,me.aimStart_x,me.aimStart_y,me.moveSpeed);
		var end_position = me.nextPosition(me.end_x,me.end_y,me.aimEnd_x,me.aimEnd_y,me.moveSpeed);
		me.start_x = start_position.x;
		me.start_y = start_position.y;
		me.end_y = end_position.y;
		me.end_x = end_position.x;
		me.draw();	//绘制移动图形
		if(start_position.arrive && end_position.arrive)  //到达目标位置
		{
			me.StartShape = me.aimStartShape;
			me.EndShape = me.aimEndShape;
			me.endAnimation();
			clearInterval(me.moveTimer);			
		}
	}, me.Canvas.refreshTime);
}	

