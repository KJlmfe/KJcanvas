var canvas;    //全局画板对象
var ctx;       //全局画板2d对象
var MAX_ANIMATE_SPEED = 5;  //最大动画速度
var CANVAS_WIDTH = 1000;  //默认画板宽度
var CANVAS_HEIGHT = 550;  //默认画板高度
var DELAY_TIME = 600; //默认延迟时间

canvas = function(myCanvas,width,height) //画板类(myCanvas为DOM里canvas对象)
{
	//设置画板大小
	if(width!=null && height!=null)
	{
		this.w = width;
		this.h = height;
	}
	else
	{
		this.w = CANVAS_WIDTH;
		this.h = CANVAS_HEIGHT;
	}
	myCanvas.width = this.w;
	myCanvas.height = this.h;

	ctx = myCanvas.getContext("2d"); //得到该画板的2d对象		
	this.Shape = new Array(); //用于保存画板上存在的图形对象
	this.queue = new Array(); //用于保存动画命令的队列
	this.animate_timer = 0;   //动画命令计时器
	this.animate_speed = 1;  //动画速度（0-MAX_ANIMATE_SPEED）如果为x,表示为默认速度的x倍
}
canvas.prototype.cmd = function()  //动画命令控制器 
{
	var me = this;
	if(arguments[0] == "Setup")  //新的一轮动画开始
	{
		this.animate_timer = 0;
		this.rear = 0;
		this.front = 0;
	}
    else if(arguments[0] == "Delay")  //延迟，该期间画面静止无变化
	{
		//根据动画速度，计算延迟速度
		if(this.animate_speed < 1)
			this.delay_speed = MAX_ANIMATE_SPEED * (1 - this.animate_speed);
		else
			this.delay_speed = 1 - (this.animate_speed-1) / (MAX_ANIMATE_SPEED-1);
		this.animate_timer += arguments[1]* this.delay_speed;
	}
	else
	{
		this.queue[this.rear++] = arguments;  //动画命令存入队列

		if(arguments[0] == "Draw")   //画一个图形
		{
			setTimeout(function(){
				me.queue[me.front][1].draw(me.queue[me.front][2],me.queue[me.front][3]);
				me.front++;
			},me.animate_timer);
		}
		else if(arguments[0] == "Move")  //移动一个图形
		{
			setTimeout(function(){
				me.queue[me.front][1].move(me.queue[me.front][2],me.queue[me.front][3],me.queue[me.front][4]*me.animate_speed);
				me.front++;
			},me.animate_timer);
			this.animate_timer += arguments[1].timeOfMove(arguments[2],arguments[3],arguments[4]);
		}
		else if(arguments[0] == "Delete")  //删除一个图形
		{
			setTimeout(function(){
				me.queue[me.front][1].del();
				me.front++;
			},me.animate_timer);
		}
	}
	
	return this.animate_timer;  //返回动画耗时时间
}
canvas.prototype.save = function(obj) //保存obj图形对象到Shape数组
{
	this.Shape.push(obj);
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
canvas.prototype.exist = function(obj)  //判断obj图形对象是否在画板上存在
{
	for(i=0;i<this.Shape.length;i++)
		if(this.Shape[i] == obj)
			return true;
	return false;
}
canvas.prototype.restore = function() //将Shape里的所有图形对象重绘
{
	this.clear();
	for(i=0;i<this.Shape.length;i++)
		if(this.Shape[i])
			this.Shape[i].draw();
}
canvas.prototype.clear = function() //清空画板
{
	ctx.clearRect(0,0,this.w,this.h);
}
