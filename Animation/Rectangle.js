Rectangle = function(cfg)
{
	this.setArguments(cfg);
}
Rectangle.prototype = new Shape;  //继承图形父类
Rectangle.prototype.draw = function() //绘画矩形的方法
{
	this.startAnimation();
	
	this.Canvas.ctx.globalAlpha = this.alpha;
	this.Canvas.ctx.fillStyle = this.backColor;  
	this.Canvas.ctx.fillRect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);  //画一个实体矩形
	this.Canvas.ctx.strokeStyle = this.edgeColor;
	this.Canvas.ctx.lineWidth = this.edgeWidth;
	this.Canvas.ctx.strokeRect(this.x-this.width/2,this.y-this.height/2,this.width,this.height); //勾画出矩形边框

	this.Canvas.ctx.fillStyle = this.textColor;      //在矩形中间绘制文本
	this.Canvas.ctx.textAlign = this.textAlign;
	this.Canvas.ctx.font = this.font;
	this.Canvas.ctx.textBaseline = this.textBaseline; 
	this.Canvas.ctx.fillText(this.text,this.x,this.y);  
	
	this.endAnimation();
}
