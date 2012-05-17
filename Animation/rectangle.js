canvas = function(width,height)
{
	this.w = width;
	this.h = height;
	this.Shape = new Array(); //用于保存画板上存在的图形对象
	this.queue = new Array(); //用于保存动画命令
	this.animate_timer = 0;   //动画命令计时器
}
function addAlgorithmControlBar(type,value)
{
	var element = document.createElement("input");
	element.setAttribute("type",type);
	element.setAttribute("value",value);
	element.setAttribute("class","controler");

	var father = document.getElementById("AlgorithmControlBar");
	
	father.appendChild(element);
	return element;
}
function disabledAlgorithmControlBar()
{
	var father = document.getElementById("AlgorithmControlBar");

}
canvas.prototype.cmd = function()  //动画命令控制器 
{
	var me = this;
	if(arguments[0] == "Setup")       
	{
		this.animate_timer = 0;
		this.rear = 0;
		this.front = 0;
	}
    else if(arguments[0] == "Delay")
	{
		this.animate_timer += arguments[1];
	}
	else
	{
		this.queue[this.rear++] = arguments;

		if(arguments[0] == "Draw")
		{
			setTimeout(function(){
				me.queue[me.front][1].draw(me.queue[me.front][2],me.queue[me.front][3]);
				me.front++;
			},me.animate_timer);
		}
		else if(arguments[0] == "Move")
		{
			setTimeout(function(){
				me.queue[me.front][1].move(me.queue[me.front][2],me.queue[me.front][3],me.queue[me.front][4]);
				me.front++;
			},me.animate_timer);
			this.animate_timer += arguments[1].timeOfMove(arguments[2],arguments[3],arguments[4]);
		}
		else if(arguments[0] == "Delete")
		{
			setTimeout(function(){
				me.queue[me.front][1].del();
				me.front++;
			},me.animate_timer);
		}
	}
	
	return this.animate_timer;
}
canvas.prototype.exist = function(obj)  //判断obj图形对象是否在画板上存在
{
	for(i=0;i<this.Shape.length;i++)
		if(this.Shape[i] == obj)
			return true;
	return false;
}
canvas.prototype.save = function(obj) //保存obj图形对象到Shape数组
{
	this.Shape.push(obj);
}
canvas.prototype.restore = function() //将Shape里的所有图形对象重绘
{
	this.clear();
	for(i=0;i<this.Shape.length;i++)
		if(this.Shape[i])
			this.Shape[i].draw();
}
canvas.prototype.del = function(obj) //从Shape里删除一个图形对象
{
	for(i=0;i<this.Shape.length;i++)
		if(this.Shape[i] == obj)
		{
			this.Shape[i] = null;
			break;
		}
}
canvas.prototype.clear = function() //清空画板
{
	ctx.clearRect(0,0,this.w,this.h);
}

Rectangle = function(width,height,x,y,text) //矩形长、宽，位置
{
	this.text = text;      //矩形填充的文本内容
	this.backColor = "abc";  //背景色
	this.edgeColor = "000";  //边框颜色
	this.textColor = "f00";  //文本颜色
	this.w = width;
	this.h = height;
	this.x = x;
	this.y = y;
}
Rectangle.prototype.draw = function(x,y) //矩形左上角所在位置
{
	if(!canvas.exist(this)) //每在画板上画一个图形对象，都要将该对象保存到画板的Shape里 
		canvas.save(this);
	if(x && y)   //更新当前位置
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
Rectangle.prototype.move = function(x,y,speed,action) //移动一个巨型
{
	//设置目标位置
	this.aimX = x;
	this.aimY = y;
	if(speed)  //设置移动速度
		this.speed = speed;
	else
		this.speed = 5;
	if(action)  //设置移动路线
		this.action = action;
	else
		this.action = "line";

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
		},24);

		return Math.ceil( (this.aimX - this.x) / this.speed ) * 24;
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
		},24);
		
		return Math.ceil( (this.x - this.aimX) / this.speed ) * 24;
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
		},24);
		
		return Math.ceil( (this.y - this.aimY) / this.speed ) * 24;
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
		},24);
		
		return Math.ceil( (this.aimY - this.y) / this.speed ) * 24;
	}
}

Rectangle.prototype.timeOfMove = function(x,y,speed) //计算移动一个巨型的动画时间
{
	//设置目标位置
	this.aimX = x;
	this.aimY = y;
	this.speed = speed;

	if(this.aimX > this.x)   // 原图形右侧运动
	{
		return Math.ceil( (this.aimX - this.x) / this.speed ) * 24;
	}
	else if(this.aimX < this.x)   // 原图形左侧运动
	{
		return Math.ceil( (this.x - this.aimX) / this.speed ) * 24;
	}
	else if(this.aimY < this.y)   // 原图形正上方运动
	{
		return Math.ceil( (this.y - this.aimY) / this.speed ) * 24;
	}
	else if(this.aimY > this.y)   // 原图形正下方运动
	{
		return Math.ceil( (this.aimY - this.y) / this.speed ) * 24;
	}
}
