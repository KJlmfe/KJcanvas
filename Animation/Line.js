Line = function(startObject,endObject,lineColor) //
{
	this.startObject = startObject;
	this.endObject = endObject;
		
	this.lineColor = lineColor == null ? this.lineColor : lineColor;
}
Line.prototype = new Shape;  //继承图形父类
Line.prototype.drawMethod = function() //绘画矩形的方法
{
	this.start_x = this.startObject.getPosition_X();
	this.start_y = this.startObject.getPosition_Y();
	this.end_x = this.endObject.getPosition_X();
	this.end_y = this.endObject.getPosition_Y();
	
	this.canvas.ctx.beginPath();
	this.canvas.ctx.lineWidth = this.lineWidth;
	this.canvas.ctx.moveTo(this.start_x,this.start_y);
	this.canvas.ctx.lineTo(this.end_x,this.end_y);
	this.canvas.ctx.strokeStyle = this.lineColor;
	this.canvas.ctx.stroke();
}
Line.prototype.clear = function() //橡皮擦擦掉矩形内部
{
	this.canvas.ctx.clearRect(this.x,this.y,this.w,this.h);
}
