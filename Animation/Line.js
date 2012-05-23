Line = function(start_x,start_y,end_x,end_y,lineColor) //
{
	this.x = start_x == null ? this.x : start_x;
	this.y = start_y == null ? this.y : start_y;
	this.end_x = end_x == null ? this.end_x : end_x;
	this.end_y = end_y == null ? this.end_y : end_y;
		
	this.lineColor = lineColor == null ? this.lineColor : lineColor;
}
Line.prototype = new Shape;  //继承图形父类
Line.prototype.drawMethod = function() //绘画矩形的方法
{
	this.canvas.ctx.beginPath();
	this.canvas.ctx.lineWidth = this.lineWidth;
	this.canvas.ctx.moveTo(this.x,this.y);
	this.canvas.ctx.lineTo(this.end_x,this.end_y);
	this.canvas.ctx.strokeStyle = this.lineColor;
	this.canvas.ctx.stroke();
}
Line.prototype.clear = function() //橡皮擦擦掉矩形内部
{
	this.canvas.ctx.clearRect(this.x,this.y,this.w,this.h);
}
