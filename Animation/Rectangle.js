var SHAPE_BACKCOLOR = "ABC";  //默认图形填充背景色
var SHAPE_EDGECOLOR = "000";  //默认图形边框颜色
var SHAPE_TEXTCOLOR = "F00";  //默认图形填充文本颜色
var SHAPE_TEXT = "shape";    //默认图新填充的文本内容
var SHAPE_WIDTH = 50;       //默认图形宽度
var SHAPE_HEIGHT = 50;      //默认图形高度
var SHAPE_START_X = 0;           //默认图新位置
var SHAPE_START_Y = 0;
var SHAPE_END_X = 500;      //默认图新移动目标位置
var SHAPE_END_Y = 500;
var SHAPE_MOVE_SPEED = 5;  //默认图新移动速度
var SHAPE_MOVE_PATH = "LINE"; //默认图新移动方式(直线)
var REFRESH_TIME = 24; //默认画面刷新时间

Rectangle = function(width,height,x,y,text) //矩形类(宽，高，位置，填充的文本内容)
{
	this.x = SHAPE_START_X;  //位置
	this.y = SHAPE_START_Y;
	
	this.w = SHAPE_WIDTH;  //大小
	this.h = SHAPE_HEIGHT;
	
	this.text = SHAPE_TEXT;  //填充内容
	
	this.backColor = SHAPE_BACKCOLOR;  //颜色
	this.edgeColor = SHAPE_EDGECOLOR;  
	this.textColor = SHAPE_TEXTCOLOR;  
	
	if(width!=null && height!=null)
	{
		this.w = width;
		this.h = height;
	}
	if(x!=null && y!=null)
	{
		this.x = x;
		this.y = y;
	}
	if(text!=null)
	{
		this.text = text;
	}
}
Rectangle.prototype.draw = function(x,y) //在x,y地方画出该矩形
{
	if(!canvas.exist(this))    //每在画板上画一个图形对象，都要将该对象保存到画板的Shape里 
		canvas.save(this);

	if(x!=null && y!=null)   //更新当前位置
	{
		this.x = x;
		this.y = y;
	}

	ctx.fillStyle = this.backColor;  
	ctx.fillRect(this.x,this.y,this.w,this.h);  //画一个实体矩形

	ctx.fillStyle = this.edgeColor;
	ctx.strokeRect(this.x,this.y,this.w,this.h); //勾画出矩形边框

	ctx.fillStyle = this.textColor;      //在矩形中间绘制文本内容
	ctx.textAlign = 'center';
	ctx.font         = '10px sans-serif';
	ctx.textBaseline   = 'middle'; 
	ctx.lineWidth = 1;
	ctx.fillText(this.text,this.x+this.w/2,this.y+this.h/2);  
}
Rectangle.prototype.clear = function() //橡皮擦擦掉矩形内部
{
	ctx.clearRect(this.x,this.y,this.w,this.h);
}
Rectangle.prototype.del = function()  //从画板上删除该矩形
{
	canvas.del(this);
	canvas.restore();
}
Rectangle.prototype.move = function(x,y,speed,path) //移动一个巨型
{
	//设置目标位置、移动速度、移动路径
	this.aimX = SHAPE_END_X;
	this.aimY = SHAPE_END_Y;
	if(x!=null && y!=null)
	{
		this.aimX = x;
		this.aimY = y;
	}
	this.speed = SHAPE_MOVE_SPEED;
	this.path = SHAPE_MOVE_PATH;
	if(speed != null) 
		this.speed = speed;
	if(path != null) 
		this.path = path;

	var me = this;  //setInterval 里不能直接调用this.draw,所以使用变量作用域解决这个问题
	
	//默认沿着两点间的直线路径移动
	if(me.x != me.aimX)
	{
		me.k = (me.y - me.aimY) / (me.x - me.aimX);  
		me.b = me.y - me.k*me.x;
	}
	else
	{
		me.k = 0;
		me.b = 0;
	}
	if(this.aimX > this.x)   // 原图形右侧运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			canvas.clear();
			//把要移动的图形对象从画布上删除
			canvas.del(me);
			//重画画布上的图形
			canvas.restore();
			//绘制移动图形
			me.x += me.speed;
			me.y = me.k*me.x + me.b;
			if(me.x >= me.aimX)
			{
				me.x = me.aimX;
				me.y = me.aimY;
			}
			me.draw(me.x,me.y);
			//判断是否到达目标位置
			if(me.aimX == me.x)
				clearInterval(me.timer);
		},REFRESH_TIME);
	}
	else if(this.aimX < this.x)   // 原图形左侧运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			canvas.clear();
			//把要移动的图形对象从画布上删除
			canvas.del(me);
			//重画画布上的图形
			canvas.restore();
			//绘制移动图形
			me.x -= me.speed;
			me.y = me.k*me.x + me.b;
			if(me.x <= me.aimX)
			{
				me.x = me.aimX;
				me.y = me.aimY;
			}
			me.draw(me.x,me.y);
			//判断是否到达目标位置
			if(me.aimX == me.x)
				clearInterval(me.timer);
		},REFRESH_TIME);
	}
	else if(this.aimY < this.y)   // 原图形正上方运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			canvas.clear();
			//把要移动的图形对象从画布上删除
			canvas.del(me);
			//重画画布上的图形
			canvas.restore();
			//绘制移动图形
			me.y -= me.speed;
			if(me.y < me.aimY)
				me.y = me.aimY;
			me.draw(me.x,me.y);
			//判断是否到达目标位置
			if(me.aimY == me.y)
				clearInterval(me.timer);
		},REFRESH_TIME);
	}
	else if(this.aimY > this.y)   // 原图形正下方运动
	{
		this.timer = setInterval(function(){
			//擦干净画布
			canvas.clear();
			//把要移动的图形对象从画布上删除
			canvas.del(me);
			//重画画布上的图形
			canvas.restore();
			//绘制移动图形
			me.y += me.speed;
			if(me.y > me.aimY)
				me.y = me.aimY;
			me.draw(me.x,me.y);
			//判断是否到达目标位置
			if(me.aimY ==  me.y)
				clearInterval(me.timer);
		},REFRESH_TIME);
	}
}
Rectangle.prototype.timeOfMove = function(x,y,speed) //计算移动矩形的动画时间
{
	//设置目标位置
	this.aimX = x;
	this.aimY = y;

	this.speed = SHAPE_MOVE_SPEED;
	if(speed!=null)
		this.speed = speed;

	if(this.aimX > this.x)   // 原图形右侧运动
	{
		return Math.ceil( (this.aimX - this.x) / this.speed ) * REFRESH_TIME;
	}
	else if(this.aimX < this.x)   // 原图形左侧运动
	{
		return Math.ceil( (this.x - this.aimX) / this.speed ) * REFRESH_TIME;
	}
	else if(this.aimY < this.y)   // 原图形正上方运动
	{
		return Math.ceil( (this.y - this.aimY) / this.speed ) * REFRESH_TIME;
	}
	else if(this.aimY > this.y)   // 原图形正下方运动
	{
		return Math.ceil( (this.aimY - this.y) / this.speed ) * REFRESH_TIME;
	}
}
