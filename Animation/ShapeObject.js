Shape = function() //图形类(所有图形的父类)
{
	this.width = Shape.WIDTH;   //矩形宽
	this.height = Shape.HEIGHT;		//矩形高
	this.radius = Shape.RADIUS;		//圆半径
	this.length= Shape.LENGTH;   //线段长度

 	this.x = Shape.X;	 //矩形的中心  圆的圆心  线段的中点
	this.y = Shape.Y;	
	this.aim_x = 0;
	this.aim_y = 0;
	this.start_x = Shape.START_X;   //线段的起始位置
	this.start_y = Shape.START_Y;
	this.end_x = Shape.END_X;      //线段的末尾位置
	this.end_y = Shape.END_Y;

	this.text = Shape.TEXT;  //文本内容
	this.textAlign = Shape.TEXTALIGN; //文本对其方式
	this.textBaseline = Shape.TEXTBASELINE;

	this.backColor = Shape.BACKCOLOR;  //矩形 圆 背景色
	this.edgeColor = Shape.EDGECOLOR;  //矩形 圆 边框色
	this.textColor = Shape.TEXTCOLOR;  //文本色
	this.lineColor = Shape.LINECOLOR;  //线段 线条色	
	this.font = Shape.FONT;  //字体
	 
	this.edgeWidth = Shape.EDGEWIDTH; //矩形 圆 边框宽度
	this.lineWidth = Shape.LINEWIDTH;  //线段宽度

	this.moveSpeed = Shape.MOVE_SPEED; //移动速度 
	this.fadeSpeed = Shape.FADE_SPEED; //淡入淡出速度
	this.alpha = Shape.ALPHA;		 //透明度	
	this.startAlpha = Shape.START_ALPHA;  //淡入淡出的起始透明度
	this.endAlpha = Shape.END_ALPHA;  //淡入淡出的末尾透明度
}
Shape.prototype.startAnimation = function() //开始动画的准备工作
{
	this.Canvas.cmdRunning++;   //正在执行的动画个数++
	if(!this.Canvas.exist(this))    //每在画板上变换一个图形对象，都要将该对象保存到画板的ShapeOnCanvas叔祖里 	
		this.Canvas.save(this);
	this.Canvas.ctx.save();		//保存当前画笔状态
}
Shape.prototype.endAnimation = function() //结束动画的收尾工作
{
	this.Canvas.ctx.restore();	//恢复之前画笔状态
	this.Canvas.cmdRunning--;	//正在执行的动画个数--
}
Shape.prototype.dispatcher = function(cmd,cfg) //动画命令调度器
{
	this.setArguments(cfg);
	switch (cmd)
	{
		case "Draw":
			this.draw();
			break;	
		case "FadeIn":
			this.fade("FadeIn");
			break;
		case "FadeOut":
			this.fade("FadeOut");
			break;
		case "Move":
			this.move();
			break;
		case "Delete":
			this.del();
			break;
	}	
}
Shape.prototype.del = function()  //从画板上删除该图形
{
	this.startAnimation();
	this.Canvas.del(this);
	this.Canvas.restore();
	this.endAnimation();
}
Shape.prototype.fade = function(action)  //淡入图形
{	
	this.startAnimation();
	if(action == "FadeIn")
	{
		var factor = 1;
		this.alpha = this.startAlpha;
	}
	else if(action == "FadeOut")
	{
		var factor = -1;
		this.alpha = this.endAlpha;
	}

	var me = this;
	this.fadeInTimer = setInterval(function()
	{
		me.alpha += me.fadeSpeed * factor;
		if(me.alpha >= me.endAlpha)
			me.alpha = me.endAlpha;
		if(me.alpha <= me.startAlpha)
			me.alpha = me.startAlpha;
		me.del();
		me.draw();
		if(me.alpha == me.endAlpha || me.alpha == me.startAlpha)
		{
			me.endAnimation();
			clearInterval(me.fadeInTimer);
		}
	}, me.Canvas.refreshTime);
}
Shape.prototype.move = function() //移动
{
	this.startAnimation();
	var me = this;  //setInterval 里不能直接调用this.draw,所以使用变量作用域解决这个问题
	
	//默认沿着两点间的直线路径移动
	if(this.x != this.aim_x)   //求出直线方程的k与b
	{
		var k = (this.y - this.aim_y) / (this.x - this.aim_x);  
		var b = this.y - k * this.x;
		var factor_y = 0;
		if(this.x < this.aim_x)
			var factor_x = 1;
		else
			var factor_x = -1;
	}
	else
	{
		var k = 0;
		var b = 0;
		var factor_x = 0;
		if(this.y < this.aim_y)
			var factor_y = 1;
		else
			var factor_y = -1;
	}	
	
	this.moveTimer = setInterval(function()
	{
		//擦干净画布
		me.Canvas.clear();
		//把要移动的图形对象从画布上删除
		me.del();
		//绘制移动图形
		me.x += me.moveSpeed * factor_x;
		me.y = k * me.x + b + me.moveSpeed * factor_y + me.y * Math.abs(factor_y);
		if(Math.abs(me.x- me.aim_x) <= me.moveSpeed && Math.abs(me.y- me.aim_y) <= me.moveSpeed)
		{
			me.x = me.aim_x;
			me.y = me.aim_y;
			me.draw();
			me.endAnimation();
			clearInterval(me.moveTimer);			
		}
		else
			me.dispatcher("Draw");
	}, me.Canvas.refreshTime);
}
Shape.prototype.setArguments = function(cfg)
{
	for(var x in cfg)
		this[x] = cfg[x];
}

/*Shape.prototype.saveArguments = function()*/
//{
	//for(var x in this)
	//{
		//var type = typeof(this[x]);
		//if(type == "number" || type == "string" || type == "object")
			//this.argument[x] = this[x];
	//}
	//this.saveArgumentsFlag = true;
//}
//Shape.prototype.restoreArguments = function(cfg)
//{
	//for(var x in this)
	//{
		//var type = typeof(this[x]);
		//if(type == "number" || type == "string" || type == "object")
			//this[x] = this.argument[x];
	//}
	//this.saveArgumentsFlag = false;

/*}*/

