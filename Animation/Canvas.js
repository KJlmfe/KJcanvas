KJcanvas = function(cfg)	//画板类(cfg为参数对象)
{	
	//进行参数默认设置

	this.Canvas = document.getElementsByTagName("canvas")[0];	//得到DOM里canvas对象
	//设置画板大小,边框
	this.width = KJcanvas.WIDTH;
	this.height = KJcanvas.HEIGHT;
	this.border = KJcanvas.BORDER;
	//设置动画速度（0-KJcanvas.MAX_ANIMATION_SPEED）如果为x,表示为默认速度的x倍
	this.animationSpeed = KJcanvas.ANIMATION_SPEED; 
	this.maxAnimationSpeed = KJcanvas.MAX_ANIMATION_SPEED;	//最大动画速度倍率
	this.cmdRefreshTime = KJcanvas.CMD_REFRESH_TIME;	//动画控制器刷新间隔时间
	this.refreshTime = KJcanvas.REFRESH_TIME;        //画面刷新时间

	//初始化canvas的2d上下文
	this.ctx = this.Canvas.getContext("2d"); 
	
	//初始化DOM里canvas样式 
	this.Canvas.width = this.width;
	this.Canvas.height = this.height;
	$(this.Canvas).css("border", this.border);

	this.ShapeOnCanvas = new Array();	//初始化ShapeOnCanvas(用于保存画板上存在的图形对象)

	this.setArguments(cfg);
	this.addControls();
}
KJcanvas.prototype.setArguments = function(cfg)		//参数设置(cfg为参数对象)
{
	for(var x in cfg)	//设置用户指定的参数
		this[x] = cfg[x];
	
	//根据动画速度，计算延迟速度(例如:用户设置的是延迟5秒,但动画速度为2(正常速度的两倍),则实际延迟时间为2.5秒)
	if(this.animationSpeed < 1)  
		this.delaySpeed = this.maxAnimationSpeed * (1 - this.animationSpeed);
	else
		this.delaySpeed = 1 - (this.animationSpeed - 1) / (this.maxAnimationSpeed - 1);
}
KJcanvas.prototype.cmd = function()		//动画命令控制器 
{
	if(arguments[0] == "Setup")		//动画开始
	{
		this.cmdQueue = new Array();	//初始化cmdQueue(用于保存动画命令的队列)
		this.rear = 0;			    	//队列首尾指针复位
		this.front = 0;
		this.cmdRun = false;       		 //是否有命令在执行 false表示没有
		this.pauseSignal = false;       //动画暂停信号 true表示暂停
		this.PauseButton.disabled = false;  //启用暂停按钮
		this.parallelSignal = false;    //并行动画信号 true表示开始并行动画
		
		var me = this;
		this.cmdTimer = setInterval(function()		//启动动画控制器
		{
			//表示之前的动画命令执行结束了并且存在尚未运行的动画命令且无暂停信号
			if(me.cmdRun == false && me.front < me.rear) 
			{
				if(me.cmdQueue[me.front][0] == "Delay")		//画面静止
					me.delay(me.cmdQueue[me.front][1]);
				else if(me.cmdQueue[me.front][0] == "End")		//动画结束
				{
					me.PauseButton.disabled = true;   //禁用暂停按钮
					clearInterval(me.cmdTimer);		//停止动画控制器
				}
				else 		
					me.refresh(me.cmdQueue[me.front]);  //根据动画命令刷新画板
				me.front++;
			}
		}, me.cmdRefreshTime);
	}
	else if(arguments[0] == "Pause")  //动画暂停
		this.pauseSignal = true;
	else if(arguments[0] == "Continue")  //动画继续
		this.pauseSignal = false;
	else if(arguments[0] == "StartParallel")	//开始输入并行动画
	{
		this.parallelSignal = true;	
		this.parallelArguments = new Array();	//并行动画命令存储器
	}
	else 
	{
		if(arguments[0] == "EndParallel")	//并行动画输入结束
		{
			this.parallelSignal = false;
			arguments = this.parallelArguments;  //将之前的所有并行动画命令转换为一条串行动画命令
		}
		if(this.parallelSignal)		//当前的指令为属于并行动画指令
			for(var i=0;i<arguments.length;i++)
				this.parallelArguments.push(arguments[i]);   //将并行动画命令暂时存储
		else		//当前的指令属于串行动画指令
			this.cmdQueue[this.rear++] = arguments;		//动画命令存入队列
	}
}
KJcanvas.prototype.refresh = function(command)
{
	this.cmdRun = true;  	//正在刷新页面 执行动画命令
	var runStatus = [];		 	//用于存储当前执行的所有动画命令的运行状态
	for(var i=0; i<command.length; i++)	//初始化所有的动画命令状态为new 表示第一次执行
		runStatus[i] = "new";

	var me = this;
	this.refreshTimer = setInterval(function()  //每24ms刷新一次画板
	{
		if(me.pauseSignal == true)
			return;
		var j = 0;
		var allStop = true;		//判断是否执行完了当前所有的动画命令
		while(command[j] != null)
		{
			if(command[j] == "Other")	//非动画指令
			{
				if(runStatus[j] == "new" || runStatus[j] == "run")
				{	
					var functionString = command[j+1];
					functionString();
					runStatus[j] = "stop";
					allStop = false;
				}
				j += 2;
			}
			else if(typeof(command[j+2]) == "object")	//有参数对象的动画指令
			{
				if(runStatus[j] == "new" || runStatus[j] == "run")
				{
					command[j+1].animationStatus[command[j]] = runStatus[j];
					command[j+1].dispatcher(command[j], command[j+2]);
					runStatus[j] = command[j+1].animationStatus[command[j]];
					allStop = false;
				}
				j += 3;
			}
			else	//无参数的动画指令
			{
				if(runStatus[j] == "new" || runStatus[j] == "run")
				{
					command[j+1].animationStatus[command[j]] = runStatus[j];
					command[j+1].dispatcher(command[j]);
					runStatus[j] = command[j+1].animationStatus[command[j]];
					allStop = false;
				}
				j += 2;	
			}
		}
		me.restore();
		if(allStop)
		{
			me.cmdRun = false;
			clearInterval(me.refreshTimer);
		}
	}, this.refreshTime);
}
KJcanvas.prototype.save = function(obj)		//保存obj图形对象到ShapeOnCanvas数组
{
	this.ShapeOnCanvas.push(obj);
}
KJcanvas.prototype.del = function(obj)		//从ShapeOnCanvas里删除一个图形对象
{
	if(obj == null)   //如果无参数,默认清空所有对象
	{
		this.ShapeOnCanvas = [];
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
KJcanvas.prototype.exist = function(obj)	//判断obj图形对象是否在画板上存在
{
	for(var i=0; i<this.ShapeOnCanvas.length; i++)
		if(this.ShapeOnCanvas[i] == obj)
			return true;
	return false;
}
KJcanvas.prototype.restore = function()		//将ShapeOnCanvas里的所有图形对象重绘
{
	this.clear();	//先擦干净画板
	for(var i=0; i<this.ShapeOnCanvas.length; i++)
		if(this.ShapeOnCanvas[i] != null)
			this.ShapeOnCanvas[i].draw();	//绘制画板上的所有图形
}
KJcanvas.prototype.clear = function()	//clear画板(并没有删除画板上的图形,所以重绘后,那些图形又出现了)
{
	this.ctx.clearRect(0,0,this.width,this.height);
}
KJcanvas.prototype.init = function()	//新建一个干净的画板
{
	this.del();		//清空之前画板上的所有图形对象
	this.restore();	//clear画板
}
KJcanvas.prototype.delay = function(delayTime)		//画板禁止delayTime无变化
{
	this.cmdRun = true;  	//正在刷新页面 执行动画命令
	delayTime = delayTime == null ? KJcanvas.DELAY_TIME : delayTime;
	delayTime *= this.delaySpeed;
	var me = this;
	setTimeout(function()
	{
		me.cmdRun = false;			
	}, delayTime);
}
KJcanvas.prototype.addControlBar = function(type,value,id)
{
	var element = document.createElement("input");
	element.setAttribute("type",type);
	element.setAttribute("value",value);
	element.setAttribute("id",id);
	element.setAttribute("class","CanvasControler");

	var father = document.getElementById("CanvasControlBar");
	if(type=="slider")
		var father = document.getElementById("SpeedBar");
	
	father.appendChild(element);
	return element;
}
KJcanvas.prototype.addControls = function()
{
	var obj = this;

	this.PauseButton = this.addControlBar("button","Pause","Pause");
	this.SpeedBar = this.addControlBar("slider","50","SliderSingle");

	//添加动画速度控制滑动条
	jQuery("#SliderSingle").slider({
		from: 0, 
		to: 100, 
		step: 1,
		round: 2,
		scale: ["Slow","Normal","Fast"],
		skin: "plastic",
		onstatechange: function( value ){
			if(value >=50 )
				var speed = (value - 50)/50*(obj.maxAnimationSpeed-1)+1;
   			else
				var speed = (value - 0)/50*(1-0.01)+0.01;
			obj.setArguments({animationSpeed : speed});
		}
	});

	this.PauseButton.onclick = function()
	{
		if(obj.pauseSignal == true)	
		{
			this.value="Pause";
			obj.cmd("Continue");
		}
		else
		{
			this.value="Play";
			obj.cmd("Pause");
		}
	}
	
	this.PauseButton.disabled = true;
}
