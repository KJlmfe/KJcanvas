<html>
	<head>
		<title><?=$_GET['name']?></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" href="ThirdLibrary/PageStyle.css">
		<link rel="stylesheet" href="ThirdLibrary/jquery.slider.min.css" type="text/css">

		<script type="text/javascript" src="ThirdLibrary/jquery-1.7.2.min.js"></script>
		<script type="text/javascript" src="ThirdLibrary/jquery.slider.min.js"></script>
		<script type="text/javascript" src="Animation/Canvas.js"></script>
		<script type="text/javascript" src="Animation/ShapeObject.js"></script>
		<script type="text/javascript" src="Animation/AnimateArguments.js"></script>
		<script type="text/javascript" src="Animation/Rectangle.js"></script>
		<script type="text/javascript" src="Animation/Label.js"></script>
		<script type="text/javascript" src="Animation/Line.js"></script>
		<script type="text/javascript" src="Algorithm/AlgorithmObject.js"></script>
		
		<script src="Algorithm/<?=$_GET['name']?>.js"></script>
	</head>
	<body onload="init();">
		<div id="wrapper">
<?php
	if(!$_GET['header']=="no")
	{
		echo "
		<div id='header'>
				<h3 id='AlgorithmName'></h3>";
		if($_GET['debug']=="true")
		{
			echo "<script src='ThirdLibrary/debug.js'></script>";
			echo "<input id='x-coord' class='debug' type=text><input id='y-coord' class='debug' type=text>"; 
		}
		echo "
			</div>";
	}
?>
			<div id="body">
				<div id="AlgorithmControlBar">
			 		<div class="layout-slider">
    		 		 	<input id="SliderSingle" type="slider" name="price" value="50" />
   				 	</div>
				</div>
				<canvas></canvas>
			</div>
			<div id="footer">
				<div id="author">Author:<a href="http://blog.freepanda.me/about">KJlmfe</a></div>
				<div id="copyright">Copyright &copy; 2012 - 2012 <a href="http://www.freepanda.me">FreePanda.</a> All Rights Reserved</div>
			</div>
		</div>
	</body>
</html>

