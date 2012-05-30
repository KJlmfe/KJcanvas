Rectangle = function(cfg)
{
	this.argument = new Array(1000);
	this.saveArgumentsFlag = false;
	this.setArguments(cfg);
}
Rectangle.prototype = new Shape;  //继承图形父类
Rectangle.prototype.drawMethod = function() //绘画矩形的方法
{
	this.canvas.ctx.fillStyle = this.backColor;  
	this.canvas.ctx.fillRect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);  //画一个实体矩形
	this.canvas.ctx.strokeStyle = this.edgeColor;
	this.canvas.ctx.lineWidth = this.edgeWidth;
	this.canvas.ctx.strokeRect(this.x-this.width/2,this.y-this.height/2,this.width,this.height); //勾画出矩形边框

	this.canvas.ctx.fillStyle = this.textColor;      //在矩形中间绘制文本
	this.canvas.ctx.textAlign = this.textAlign;
	this.canvas.ctx.font = this.font;
	this.canvas.ctx.textBaseline = this.textBaseline; 
	this.canvas.ctx.fillText(this.text,this.x,this.y);  
}
