<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
	<title><?=$_GET['name']?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="KJlmfe">

    <!-- Le styles -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
	<link rel="stylesheet" href="css/jquery.slider.min.css" type="text/css">
    <style>
      body {
        padding-top: 50px; /* 60px to make the container go all the way to the bottom of the topbar */
        padding-bottom: 40px;
      }
    </style>
    <link href="css/bootstrap-responsive.min.css" rel="stylesheet">
	<link type="text/css" rel="stylesheet"  href="css/shCoreDefault.css"/>
		
	<link rel="stylesheet" href="css/PageStyle.css">

    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons -->
    <link rel="shortcut icon" href="../assets/ico/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="../assets/ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="../assets/ico/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="../assets/ico/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="../assets/ico/apple-touch-icon-57-precomposed.png">
  </head>

  <body onload="init()">

    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#">Live Algorithm</a>
          <div class="nav-collapse">
            <ul class="nav">
              <li class="active"><a href="#">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container">
		<div class='row'>
			<div class='span12'>
				<h2><?=$_GET['name']?></h2>
<?php
		if($_GET['debug']=="true")
		{
			echo "<script src='js/debug.js'></script>";
			echo "<input id='x-coord' class='debug' type=text><input id='y-coord' class='debug' type=text>"; 
		}
?>
				<div id="AlgorithmControlBar">
					<div id="CanvasControlBar">
			 			<div id="SpeedBar"></div>
					</div>
				</div>
			</div>
		</div>
		<div class='row'>
			<div class='span7-fluid'>
				<div id="WarmBed">
					<canvas></canvas>
				</div>
			</div>
			<div class="span5">
				<pre class="brush: c; toolbar: false">
<?php
$sourceCode = file_get_contents("src/".$_GET['name'].".c");
echo $sourceCode;
?>
				</pre>
			</div>
		</div>
      
	  <hr>

<footer>
	<p>Copyright &copy; 2012 - 2012 <a href="http://www.freepanda.me">FreePanda.</a> All Rights Reserved</p>
</footer>

    </div> <!-- /container -->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
	<script type="text/javascript" src="js/jquery-1.7.2.min.js"></script>
	<script type="text/javascript" src="js/jquery.slider.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/shCore.js"></script>
	<script type="text/javascript" src="js/shBrushCpp.js"></script>
	<script type="text/javascript">SyntaxHighlighter.all();</script>
	<script type="text/javascript" src="Animation/Canvas.js"></script>
	<script type="text/javascript" src="Animation/ShapeObject.js"></script>
	<script type="text/javascript" src="Animation/AnimateArguments.js"></script>
	<script type="text/javascript" src="Animation/Rectangle.js"></script>
	<script type="text/javascript" src="Animation/Label.js"></script>
	<script type="text/javascript" src="Animation/Line.js"></script>
	<script type="text/javascript" src="Algorithm/AlgorithmObject.js"></script>
	<script src="Algorithm/<?=$_GET['name']?>.js"></script>
    
  </body>

</html>

