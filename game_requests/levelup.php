
  <?php

         if(isset($_POST["user"])){



$user = addslashes($_POST['user']);
$level = addslashes($_POST['level']);
$where = addslashes($_POST['where']);
            // Create connection
            $conn = new mysqli("localhost", "root", "","anees_DB");

            // Check connection
            if ($conn->connect_error) {
               die("Connection failed: " . $conn->connect_error);
            }

mysqli_query($conn,"UPDATE enviroments set progress='$level' where title='$where' and player_FK='$user' ");
echo $user;
		 }

      ?>
