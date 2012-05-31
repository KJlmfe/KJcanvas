Canvas = function(myCanvas,width,height,border,animate_speed,delay_time,refresh_time,max_animate_speed) //画板类(myCanvas为DOM里Canvas对象)
{
	//得到DOM里画板对象
	this.Canvas = myCanvas == null ? document.getElementsByTagName("Canvas")[0] : myCanvas;
	
	//初始化全局Canvas的2d上下文
	this.ctx = this.Canvas.getContext("2d"); 
	
	//设置画板大小,边框
	this.w = width == null ? Canvas.WIDTH : width;
	this.h = height == null ? Canvas.HEIGHT : height;
	this.border = border == null ? Canvas.BORDER : border;
	
	//初始化DOM里Canvas样式 
	this.Canvas.width = this.w;
	this.Canvas.height = this.h;
	$(this.Canvas).css("border",this.border);
	
	//设置动画速度（0-Canvas.MAX_ANIMATE_SPEED）如果为x,表示为默认速度的x倍
	this.animate_speed = animate_speed == null ? Canvas.ANIMATE_SPEED : animate_speed; 
	this.max_animate_speed = max_animate_speed == null ? Canvas.MAX_ANIMATE_SPEED : max_animate_speed;//最大动画速度倍率
	this.animate_timer = 0;   //初始化动画命令计时器
	
	this.refresh_time = refresh_time == null ? Canvas.REFRESH_TIME : refresh_time;  //动画页面刷新间隔时间
	this.delay_time = delay_time == null ? Canvas.DELAY_TIME : delay_time;  //动画延迟静止时间

	this.Shape = new Array(); //初始化保存画板上存在的图形对象
	this.queue = new Array(); //初始化保存动画命令的队列
	this.parallelSignal = false;
}
Canvas.prototype.cmd = function()  //动画命令控制器 
{
	var me = this;
	var tmp_shape = new Array();
	if(arguments[0] == "Setup")  //新的一轮动画开始
	{
		this.animate_timer = 0;  //动画计时器清零 
		this.rear = 0;			//队列首尾指针复位
		this.front = 0;
		this.animate_shape = new Array();
	}
    else if(arguments[0] == "Delay")  //延迟效果,该期间画面静止无变化
	{
		//根据动画速度，计算延迟速度(例如:用户设置的是延迟5秒,但动画速度为2(正常速度的两倍),则实际延迟时间为2.5秒)
		if(this.animate_speed < 1)
			this.delay_speed = Canvas.MAX_ANIMATE_SPEED * (1 - this.animate_speed);
		else
			this.delay_speed = 1 - (this.animate_speed-1) / (Canvas.MAX_ANIMATE_SPEED-1);
	
		arguments[1] = arguments[1] == null ? Canvas.DELAY_TIME : arguments[1]; //得到延迟时间
		this.animate_timer += arguments[1]* this.delay_speed; //累加动画时间
	}
	else if(arguments[0] == "END")
	{
		for(var i=0;i<this.animate_shape.length;i++)
		{
			this.animate_shape[i].restoreArguments();
		}
	}
	else if(arguments[0] == "StartParallel")
	{
		this.parallelSignal = true;	
		this.parallelArguments = new Array();
	}
	else 
	{
		if(arguments[0] == "EndParallel")
		{
			this.parallelSignal = false;
			arguments = this.parallelArguments;
		}
		if(this.parallelSignal)
		{
			for(var i=0;i<arguments.length;i++)
			{
				this.parallelArguments.push(arguments[i]);
			}
		}
		else
		{
		this.queue[this.rear++] = arguments;  //动画命令存入队列
		
		setTimeout(function(){     //处理多个图形并发移动情况
			var k = 0;
			while(me.queue[me.front][k] != null)
			{
				if(me.queue[me.front][k] == "Draw")
				{
					me.queue[me.front][k+1].setArguments(me.queue[me.front][k+2]);
					me.queue[me.front][k+1].draw();
				}
				else if(me.queue[me.front][k] == "FadeIn")
				{
					me.queue[me.front][k+1].setArguments(me.queue[me.front][k+2]);
					me.queue[me.front][k+1].fadeIn();
				}
				else if(me.queue[me.front][k] == "FadeOut")
				{
					me.queue[me.front][k+1].setArguments(me.queue[me.front][k+2]);
					me.queue[me.front][k+1].fadeOut();
				}
				else if(me.queue[me.front][k] == "Move")
				{
					me.queue[me.front][k+1].setArguments(me.queue[me.front][k+2]);
					me.queue[me.front][k+1].move();
				}
				else if(me.queue[me.front][k] == "Delete")
				{
					me.queue[me.front][k+1].setArguments(me.queue[me.front][k+2]);
					me.queue[me.front][k+1].del();
				}
				k++;
			}
			me.front++;
		},me.animate_timer);
	
		var max_timer = -1;
		var k = 0;
		
		while(arguments[k] != null)
		{
			var tmp_timer = 0;

			if(arguments[k] == "Draw")
			{
				if(arguments[k+1].saveArgumentsFlag == false)
				{
					arguments[k+1].saveArguments();
					this.animate_shape.push(arguments[k+1]);
				}
				arguments[k+1].setArguments(arguments[k+2]);
				tmp_timer = arguments[k+1].timeOfDraw();
			}
			else if(arguments[k] == "FadeIn")
			{
				if(arguments[k+1].saveArgumentsFlag == false)
				{
					arguments[k+1].saveArguments();
					this.animate_shape.push(arguments[k+1]);
				}
				arguments[k+1].setArguments(arguments[k+2]);
				tmp_timer = arguments[k+1].timeOfFadeIn();
			}
			else if(arguments[k] == "FadeOut")
			{
				if(arguments[k+1].saveArgumentsFlag == false)
				{
					arguments[k+1].saveArguments();
					this.animate_shape.push(arguments[k+1]);
				}
				arguments[k+1].setArguments(arguments[k+2]);
				tmp_timer = arguments[k+1].timeOfFadeOut();
			}
			else if(arguments[k] == "Move")
			{
				if(arguments[k+1].saveArgumentsFlag == false)
				{
					arguments[k+1].saveArguments();
					this.animate_shape.push(arguments[k+1]);
				}
				arguments[k+1].setArguments(arguments[k+2]);
				tmp_timer = arguments[k+1].timeOfMove();
			}
			else if(arguments[k] == "Delete")
			{
				if(arguments[k+1].saveArgumentsFlag == false)
				{
					arguments[k+1].saveArguments();
					this.animate_shape.push(arguments[k+1]);
				}
				arguments[k+1].setArguments(arguments[k+2]);
				tmp_timer = arguments[k+1].timeOfDelete();
			}

			max_timer = max_timer < tmp_timer ? tmp_timer : max_timer;
			k++;
		}

		this.animate_timer += max_timer;
		}
	}
	
	return this.animate_timer;  //返回动画耗时时间
}
Canvas.prototype.save = function(obj) //保存obj图形对象到Shape数组
{
	this.Shape.push(obj);
}
Canvas.prototype.del = function(obj) //从Shape里删除一个图形对象
{
	if(obj == null)   //如果无参数,默认清空所有对象
	{
		for(i=0;i<this.Shape.length;i++)
			this.Shape[i] = null;
	}
	else
	{
		for(i=0;i<this.Shape.length;i++)
			if(this.Shape[i] == obj)
			{
				this.Shape[i] = null;
				break;
			}
	}
}
Canvas.prototype.exist = function(obj)  //判断obj图形对象是否在画板上存在
{
	for(i=0;i<this.Shape.length;i++)
		if(this.Shape[i] == obj)
			return true;
	return false;
}
Canvas.prototype.restore = function() //将Shape里的所有图形对象重绘
{
	this.clear();
	for(i=0;i<this.Shape.length;i++)
		if(this.Shape[i])
			this.Shape[i].draw();
}
Canvas.prototype.clear = function() //清空画板
{
	this.ctx.clearRect(0,0,this.w,this.h);
}
Canvas.prototype.init = function()  //新建一个干净的画板
{
	this.Shape = new Array();  
	this.clear();
}
