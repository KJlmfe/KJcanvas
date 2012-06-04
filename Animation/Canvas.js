KJcanvas = function(cfg) //画板类(cfg为参数对象)
{	
	//进行参数默认设置

	//得到DOM里canvas对象
	this.Canvas = document.getElementsByTagName("canvas")[0];
	//设置画板大小,边框
	this.width = KJcanvas.WIDTH;
	this.height = KJcanvas.HEIGHT;
	this.border = KJcanvas.BORDER;
	//设置动画速度（0-KJcanvas.MAX_ANIMATION_SPEED）如果为x,表示为默认速度的x倍
	this.animationSpeed = KJcanvas.ANIMATION_SPEED; 
	this.maxAnimationSpeed = KJcanvas.MAX_ANIMATION_SPEED; //最大动画速度倍率
	this.cmdRefreshTime = KJcanvas.CMD_REFRESH_TIME; //动画控制器刷新间隔时间

	this.ShapeOnCanvas = new Array(); 	//初始化保存画板上存在的图形对象

	this.setArguments(cfg);
}
KJcanvas.prototype.setArguments = function(cfg)
{
	for(var x in cfg)   //设置用户指定的参数
		this[x] = cfg[x];

	//初始化canvas的2d上下文
	this.ctx = this.Canvas.getContext("2d"); 
	
	//初始化DOM里canvas样式 
	this.Canvas.width = this.width;
	this.Canvas.height = this.height;
	$(this.Canvas).css("border",this.border);
	
	//根据动画速度，计算延迟速度(例如:用户设置的是延迟5秒,但动画速度为2(正常速度的两倍),则实际延迟时间为2.5秒)
	if(this.animationSpeed < 1)  
		this.delaySpeed = this.maxAnimationSpeed * (1 - this.animationSpeed);
	else
		this.delaySpeed = 1 - (this.animationSpeed - 1) / (this.maxAnimationSpeed - 1);
}
KJcanvas.prototype.cmd = function()  //动画命令控制器 
{
	if(arguments[0] == "Setup")  //动画开始
	{
		this.cmdQueue = new Array(); 		//初始化保存动画命令的队列
		this.rear = 0;			//队列首尾指针复位
		this.front = 0;
		this.cmdRunning = 0;        //正在运行的动画命令个数
		this.pauseSignal = false;   //动画暂停信号 true表示暂停
		this.parallelSignal = false;  //并行动画型号  true表示开始并行动画
		var me = this;
		this.cmdTimer = setInterval(function()   //启动动画控制器
		{
			if(me.cmdRunning == 0 && me.front < me.rear && me.pauseSignal == false)  //表示之前的动画命令执行结束了并且存在尚未运行的动画命令且无暂停信号
			{
				var k = 0;
				while(me.cmdQueue[me.front][k] != null)
				{
					if(me.cmdQueue[me.front][k] == "Delay")  //画面静止
					{	
						if(typeof(me.cmdQueue[me.front][k+1]) == "number")
						{
							me.delay(me.cmdQueue[me.front][k+1]);
							k += 2;
						}
						else
						{
							me.delay();
							k += 1;
						}
					}
					else if(me.cmdQueue[me.front][k] == "END")  //停止动画控制器
					{
						clearInterval(me.cmdTimer);
						break;
					}
					else if(me.cmdQueue[me.front][k] == "Other")  //停止动画控制器
					{
						var command = me.cmdQueue[me.front][k+1];
						command();
						k += 2;
					}
					else
					{
						if(typeof(me.cmdQueue[me.front][k+2]) == "object")
						{
							me.cmdQueue[me.front][k+1].dispatcher(me.cmdQueue[me.front][k], me.cmdQueue[me.front][k+2]);
							k += 3;
						}
						else
						{
							me.cmdQueue[me.front][k+1].dispatcher(me.cmdQueue[me.front][k]);
							k += 2;	
						}
					}
				}
				me.front++;
			}
		}, me.cmdRefreshTime);
	}
	else if(arguments[0] == "Pause")  //动画暂停
	{
		this.pauseSignal = true;
	}
	else if(arguments[0] == "Continue")  //动画继续
	{
		this.pauseSignal = false;
	}
	else if(arguments[0] == "StartParallel") //开始并行动画
	{
		this.parallelSignal = true;	
		this.parallelArguments = new Array();  //并行动画命令存储器
	}
	else 
	{
		if(arguments[0] == "EndParallel")  //并行动画结束
		{
			this.parallelSignal = false;
			arguments = this.parallelArguments;  //将之前的所有并行动画命令转换为一条串行动画命令
		}
		if(this.parallelSignal)
		{
			for(var i=0;i<arguments.length;i++)
			{
				this.parallelArguments.push(arguments[i]);   //将并行动画命令暂时存储
			}
		}
		else
		{
			this.cmdQueue[this.rear++] = arguments;  //动画命令存入队列
		}
	}
}
KJcanvas.prototype.save = function(obj) //保存obj图形对象到ShapeOnCanvas数组
{
	this.ShapeOnCanvas.push(obj);
}
KJcanvas.prototype.del = function(obj) //从ShapeOnCanvas里删除一个图形对象
{
	if(obj == null)   //如果无参数,默认清空所有对象
	{
		this.ShapeOnCanva = new Array();
	}
	else
	{
		for(var i=0; i<this.ShapeOnCanvas.length; i++)
			if(this.ShapeOnCanvas[i] == obj)
			{
				this.ShapeOnCanvas[i] = null;
				break;
			}
	}
}
KJcanvas.prototype.exist = function(obj)  //判断obj图形对象是否在画板上存在
{
	for(var i=0; i<this.ShapeOnCanvas.length; i++)
		if(this.ShapeOnCanvas[i] == obj)
			return true;
	return false;
}
KJcanvas.prototype.restore = function() //将ShapeOnCanvas里的所有图形对象重绘
{
	this.clear();
	for(var i=0; i<this.ShapeOnCanvas.length; i++)
		if(this.ShapeOnCanvas[i] != null)
			this.ShapeOnCanvas[i].draw();
}
KJcanvas.prototype.clear = function() //清空画板(并没有删除画板上的图形,所以重绘后,那些图形又出现了)
{
	this.ctx.clearRect(0,0,this.width,this.height);
}
KJcanvas.prototype.init = function()  //新建一个干净的画板
{
	this.ShapeOnCanvas = new Array();  
	this.clear();
}
KJcanvas.prototype.delay = function(delayTime)
{
	this.cmdRunning++;			
	delayTime = delayTime == null ? KJcanvas.DELAY_TIME : delayTime;
	delayTime *= this.delaySpeed;
	var me = this;
	setTimeout(function()
	{
		me.cmdRunning--;
	}, delayTime);
}
