Label = function(cfg) //文本标签类
{
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
Label.prototype.clear = function() //橡皮擦擦掉该文本标签
{
	this.canvas.ctx.clearRect("",this.x,this.y);
}
