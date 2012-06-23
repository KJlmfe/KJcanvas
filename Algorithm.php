<html>
	<head>
		<title><?=$_GET['name']?></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" href="ThirdLibrary/PageStyle.css">
		
		<script src="ThirdLibrary/jquery-1.7.2.min.js"></script>
		<script src="Animation/Canvas.js"></script>
		<script src="Animation/ShapeObject.js"></script>
		<script src="Animation/AnimateArguments.js"></script>
		<script src="Animation/Rectangle.js"></script>
		<script src="Animation/Label.js"></script>
		<script src="Animation/Line.js"></script>
		<script src="Algorithm/AlgorithmObject.js"></script>
		
		<script src="Algorithm/<?=$_GET['name']?>.js"></script>
	</head>
	<body onload="init();">
		<div id="wrapper">
			<div id="header">
				<h3 id="AlgorithmName"></h3>
<?php
	if($_GET['debug']=="true")
	{
		echo "<script src='ThirdLibrary/debug.js'></script>";
		echo "<input id='x-coord' class='debug' type=text><input id='y-coord' class='debug' type=text>"; 
	}
?>
			</div>
			<div id="body">
				<div id="AlgorithmControlBar"></div>
				<canvas></canvas>
			</div>
			<div id="footer">
				<div id="author">Author:<a href="http://blog.freepanda.me/about">KJlmfe</a></div>
				<div id="copyright">Copyright &copy; 2012 - 2012 <a href="http://www.freepanda.me">FreePanda.</a> All Rights Reserved</div>
			</div>
		</div>
	</body>
</html>

