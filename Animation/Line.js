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
	this.Canvas.ctx.save();		    //保存当前画笔状态
	this.updatePosition();	

	this.Canvas.ctx.globalAlpha = this.alpha;
	this.Canvas.ctx.beginPath();
	this.Canvas.ctx.lineWidth = this.lineWidth;
	this.Canvas.ctx.moveTo(this.start_x,this.start_y);
	this.Canvas.ctx.lineTo(this.end_x,this.end_y);
	this.Canvas.ctx.strokeStyle = this.lineColor;
	this.Canvas.ctx.stroke();

	this.Canvas.ctx.restore();	//恢复之前画笔状态
	this.animationStatus["Draw"] = "stop";
}
Line.prototype.setAimPosition = function()    //设置移动目标线段的起始位置
{	
	if(this.aimStartShape != null)   //指定了终点图形
	{
		this.aimStart_x = this.aimStartShape.x;
		this.aimStart_y = this.aimStartShape.y;	
	}
	else if(this.aimStart_x != null || this.aimStart_y != null)  //指定了起点坐标
	{
		this.aimStart_x = this.aimStart_x == null ? this.start_x : this.aimStart_x;
		this.aimStart_y = this.aimStart_y == null ? this.start_y : this.aimStart_y;
		this.aimStartShape = null;   
	}
	else //什么都没有指定,表示该点静止
	{
		this.aimStartShape = this.StartShape;  //把两种方式都设置为默认值
		this.aimStart_x = this.start_x;
		this.aimStart_y = this.start_y;
	}

	if(this.aimEndShape != null)   //指定了终点图形
	{
		this.aimEnd_x = this.aimEndShape.x;
		this.aimEnd_y = this.aimEndShape.y;	
	}
	else if(this.aimEnd_x != null || this.aimEnd_y != null)  //指定了终点坐标
	{
		this.aimEnd_x = this.aimEnd_x == null ? this.end_x : this.aimEnd_x;
		this.aimEnd_y = this.aimEnd_y == null ? this.end_y : this.aimEnd_y;
		this.aimEndShape = null;   
	}
	else //什么都没有指定,表示该点静止
	{
		this.aimEndShape = this.EndShape;  //把两种方式都设置为默认值
		this.aimEnd_x = this.start_x;
		this.aimEnd_y = this.start_y;
	}

	this.StartShape = null;
	this.EndShape = null;
}
Line.prototype.move = function() //移动线段
{
	if(this.animationStatus["Move"] == "new")
	{
		this.updatePosition();	
		this.setAimPosition();
		this.animationStatus["Move"] = "run";
	}
	else if(this.animationStatus["Move"] == "run")
	{
		//设置当前的新位置
		var start_position = this.nextPosition(this.start_x,this.start_y,this.aimStart_x,this.aimStart_y,this.moveSpeed);
		var end_position = this.nextPosition(this.end_x,this.end_y,this.aimEnd_x,this.aimEnd_y,this.moveSpeed);
		this.start_x = start_position.x;
		this.start_y = start_position.y;
		this.end_y = end_position.y;
		this.end_x = end_position.x;
		if(start_position.arrive && end_position.arrive)  //到达目标位置
		{
			this.StartShape = this.aimStartShape;
			this.EndShape = this.aimEndShape;
			this.animationStatus["Move"] = "stop";
		}
	}
}	

