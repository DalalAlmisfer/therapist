<?php

if(isset($_POST["user"])){



$user = addslashes($_POST['user']);
$level = addslashes($_POST['level']);
$where = addslashes($_POST['where']);
   // Create connection
   $conn = new mysqli("eu-cdbr-west-03.cleardb.net", "b630bdd6b6e1b9", "d159c434","heroku_195f706910a16f0");

   // Check connection
   if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
   }

mysqli_query($conn,"UPDATE enviroments set progress='$level' where title='$where' and player_FK='$user' ");
echo $user;
}

?>