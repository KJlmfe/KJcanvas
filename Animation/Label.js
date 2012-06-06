Label = function(cfg) 	//文本标签类
{
	this.setArguments(cfg);
}
Label.prototype = new Shape;  	  //继承图形父类
Label.prototype.draw = function() //绘画文本标签的方法
{
	this.Canvas.ctx.save();		    //保存当前画笔状态
	
	this.Canvas.ctx.globalAlpha = this.alpha;
	this.Canvas.ctx.fillStyle = this.textColor;      
	this.Canvas.ctx.textAlign = this.textAlign;
	this.Canvas.ctx.font = this.font;
	this.Canvas.ctx.textBaseline = this.textBaseline;
	this.Canvas.ctx.fillText(this.text,this.x,this.y);  
	
	this.Canvas.ctx.restore();	//恢复之前画笔状态
	this.animationStatus["Draw"] = "stop";
}
