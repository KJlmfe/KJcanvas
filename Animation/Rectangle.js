Rectangle = function(width,height,text,backColor,edgeColor,textColor,font) //矩形类
{
	this.w = width == null ? this.w : width;
	this.h = height == null ? this.h : height;
	
	this.text = text == null ? this.text : text;
	this.font = font == null ? this.font : font;
		
	this.backColor = backColor == null ? this.backColor : backColor;
	this.edgeColor = edgeColor == null ? this.edgeColor : edgeColor;
	this.textColor = textColor == null ? this.textColor : textColor;
	
}
Rectangle.prototype = new Shape;  //继承图形父类
Rectangle.prototype.drawMethod = function() //绘画矩形的方法
{
	this.canvas.ctx.fillStyle = this.backColor;  
	this.canvas.ctx.fillRect(this.x,this.y,this.w,this.h);  //画一个实体矩形

	this.canvas.ctx.fillStyle = this.edgeColor;
	this.canvas.ctx.strokeRect(this.x,this.y,this.w,this.h); //勾画出矩形边框

	this.canvas.ctx.fillStyle = this.textColor;      //在矩形中间绘制文本
	this.canvas.ctx.textAlign = this.textAlign;
	this.canvas.ctx.font = this.font;
	this.canvas.ctx.textBaseline = this.textBaseline; 
	this.canvas.ctx.fillText(this.text,this.x+this.w/2,this.y+this.h/2);  
}
Rectangle.prototype.clear = function() //橡皮擦擦掉矩形内部
{
	this.canvas.ctx.clearRect(this.x,this.y,this.w,this.h);
}
