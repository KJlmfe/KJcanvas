﻿<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Live Algorithm</title>
<script type="text/javascript" src="js/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="js/scrollpagination.js"></script>
<link href="css/scrollpagination_demo.css" rel="stylesheet" media="screen" />
<script type="text/javascript">
$(function(){
	$('#content').scrollPagination({
<?php 
	if($_GET['iframe']=='true')
	echo "'contentPage': 'AlgorithmList(iframe).html', // the page where you are searching for results";
	else
	echo "'contentPage': 'AlgorithmList.html', // the page where you are searching for results";
?>
		'contentData': {}, // you can pass the children().size() to know where is the pagination
		'scrollTarget': $(window), // who gonna scroll? in this example, the full window
		'heightOffset': 10, // how many pixels before reaching end of the page would loading start? positives numbers only please
		'beforeLoad': function(){ // before load, some function, maybe display a preloader div
			$('#loading').fadeIn();	
		},
		'afterLoad': function(elementsLoaded){ // after loading, some function to animate results and hide a preloader div
			 $('#loading').fadeOut();
			 var i = 0;
			 $(elementsLoaded).fadeInWithDelay();
			 if ($('#content').children().size() > 88){ // if more than 100 results loaded stop pagination (only for test)
			 	$('#nomoreresults').fadeIn();
				$('#content').stopScrollPagination();
			 }
		}
	});
	
	// code for fade in element by element with delay
	$.fn.fadeInWithDelay = function(){
		var delay = 0;
		return this.each(function(){
			$(this).delay(delay).animate({opacity:1}, 200);
			delay += 100;
		});
	};
		   
});
</script>
</head>
<body>
<div id="scrollpaginationdemo">
<?php
	if(!$_GET['iframe']=='true')
		echo "
    <div class='about'>
        <h2><a href='index.html'>Live Algorithm</a></h1>
 	<h3>Author:<a href='http://www.freepanda.me'>KJlmfe</a><h3>
    </div>";
?>
     <div class="about">
    	<h1>Learn algorithm by See Play Think</h1>
    </div>
	<ul id="content">
    	</ul>
    <div class="loading" id="loading">Wait a moment... it's loading!</div>
    <div class="loading" id="nomoreresults">Sorry, no more results for your pagination demo.</div>
</div>
</body>
</html>
