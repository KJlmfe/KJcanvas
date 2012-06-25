<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Live Algorithm Update</title>
</head>
<body>
<?php
	$current_dir = dirname(__FILE__);
	$url = "https://nodeload.github.com/KJlmfe/KJcanvas/zipball/master";
	$dir = $current_dir."/latestKJcanvas.zip";
	$file = file_get_contents("$url");
	$fp = fopen($dir, "wb");
	fwrite($fp, $file); 
	fclose($fp);
	exec("unzip latestKJcanvas.zip -d ".$current_dir."/latestKJcanvas");
	exec('ls | grep -v "update.php\|latestKJcanvas" | xargs rm -rf');
	exec("cp -rf latestKJcanvas/*/* ".$current_dir);
	echo "Update is successful";
?>
</body>
</html>
