<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>The Animation Algorithm of KJcanvas</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="KJlmfe">

    <!-- Le styles -->
    <link href="css/prettify.css" rel="stylesheet">
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <style type="text/css">
      body {
        padding-top: 60px;
        padding-bottom: 40px;
      }
    </style>
    <link href="css/bootstrap-responsive.min.css" rel="stylesheet">

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

  <body onload="prettyPrint()">

    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#">KJcanvas</a>
          <div class="nav-collapse">
            <ul class="nav">
    		  <li><a href="#1.Draw A Rectangle">1.Draw A Rectangle</a></li>
      		  <li><a href="#2.Create A Rectangle Class">2.Create A Rectangle Class</a></li>
              <li><a href="#3.Move A Rectangle">3.Move A Rectangle</a></li>
              <li><a href="#4.Where is my red rectangle?">4.Where is my red rectangle?</a></li>
              <li><a href="#5.Create An Animation Controller">5.Create An Animation Controller</a></li>
              <li><a href="#6.Serial Animation">6.Serial Animation</a></li>            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Main hero unit for a primary marketing message or call to action -->
      <div class="hero-unit">
        <h1>Animation Principles of KJcanvas</h1>
        <p>I will use the "rectangle" and "move" as an example to tell you the algorithm of animation on canvas(HTML5).</p>
		<p>Please leave a message to me if you have any questions.</p>
        <p><a target="_blank" class="btn btn-primary btn-large" href="http://blog.freepanda.me/about">Leave a message to me</a></p>
      </div>
<?php
$step = Array("1.Draw A Rectangle","2.Create A Rectangle Class","3.Move A Rectangle","4.Where is my red rectangle?","5.Create An Animation Controller","6.Serial Animation");
for($i=0;$i<6;$i++)
{
$title = $step[$i];
$urlName = rawurlencode($title);
$preface = file_get_contents("preface/".$title.".txt");
$codeFile = file_get_contents("demo/".$title.".html");
$codeString = htmlspecialchars($codeFile);

echo"
	<section id='$title' style='padding-top:40px'>
      <div class='row'>
        <div class='span12'>
          <h2>$title</h2>       
		 	$preface 
		  </div>
	  </div>
      
	  <div class='row'>
	  	<div class='span12'>
           <pre class='prettyprint linenums'>
$codeString
		  </pre>
        </div>
      </div>

	  <div class='row'>
	  	<div class='span12'>
			<h1>Demo</h1>
			<iframe	src='demo/$urlName.html' frameborder=0 width='100%' scrolling='no' height='466px'>
			</iframe>
		</div>
	  </div>

      <hr>
	  </section>
";
}
?>
      <footer>
        <p>Copyright &copy; 2012 - 2012 <a target="_blank" href="http://www.freepanda.me">FreePanda.</a></p>
      </footer>

    </div> <!-- /container -->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="js/jquery-1.7.2.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/prettify.js"></script>

  </body>
</html>

