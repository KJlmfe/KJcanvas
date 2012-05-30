Label = function(cfg) //文本标签类
{
	this.argument = new Array(1000);
	this.saveArgumentsFlag = false;
	this.setArguments(cfg);
}
Label.prototype = new Shape;  //继承图形父类
Label.prototype.drawMethod = function() //绘画文本标签的方法
{
	this.canvas.ctx.fillStyle = this.textColor;      
	this.canvas.ctx.textAlign = this.textAlign;
	this.canvas.ctx.font = this.font;
	this.canvas.ctx.textBaseline = this.textBaseline;
	this.canvas.ctx.fillText(this.text,this.x,this.y);  
}
