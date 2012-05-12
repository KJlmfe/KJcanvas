var Shape = new Array();
function canvasSave(obj)
{
	Shape.push(obj);
}
function canvasRestore()
{
	for(i=0;i<Shape.length;i++)
		Shape[i].draw(1);
}
function Rectangle(ctx,width,height,x,y,color) //矩形的宽和高
{
	this.id = this;
	this.color = color;
    this.ctx = ctx;
	this.w = width;
	this.h = height;
	this.x = x;
	this.y = y;
}
Rectangle.prototype.draw = function(x,y) //矩形左上角所在位置
{
	if(x && y)
	{
		this.x = x;
		this.y = y;
	}
	this.ctx.fillStyle = this.color;
	this.ctx.fillRect(this.x,this.y,this.w,this.h);  //画一个实体矩形
//	this.ctx.strokeRect(this.x,this.y,this.w,this.h); //勾画出矩形边框
//	this.ctx.clearRect(this.x,this.y,this.w,this.h);  //清空内部，只留边框	
}
Rectangle.prototype.clear = function() //橡皮擦擦掉矩形
{
	this.ctx.clearRect(this.x,this.y,this.w,this.h);
}
Rectangle.prototype.move = function(x,y) //移动一个巨型
{
	//清楚canvas
	//把之前的每个对象都重画
	//画当前正在移动的图像的下一个位置
	//如果位置到了，则保存该图像到存在画面上的链表
	//

	var me = this;  //setInterval 里不能直接调用this.draw,所以使用变量作用域解决这个问题
	//默认沿着两点间的直线路径移动
	if(me.x != x)
	{
	
		k = (me.y - y) / (me.x - x);  
		b = me.y - k*me.x;
		IDD = setInterval(function(){
			//擦干净画布
			me.ctx.clearRect(0,0,canvas.width,canvas.height);
			//把要移动的图形对象从画布上删除

			//重画画布上的图形
			canvasRestore();	
			//绘制移动图形
			me.x++;
			y = k*me.x + b;
			me.draw(me.x,y);
			//判断是否到达目标位置
			if(x == me.x)
				clearInterval(IDD);
		},24);

	}
	else
	{	
		x = me.x;
		IDD = setInterval(function(){
			me.clear();
		//	me.ctx.save();
			me.draw(x,++me.y);
			if(y == me.y)
				clearInterval(IDD);
		//	me.ctx.restore();	
		},22);
	}
}
