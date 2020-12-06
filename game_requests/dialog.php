
  <?php

         if(isset($_POST["user"])){



$user = addslashes($_POST['user']);
$table = addslashes($_POST['table']);

            // Create connection
            $conn = new mysqli("localhost", "root", "","anees_DB");

            // Check connection
            if ($conn->connect_error) {
               die("Connection failed: " . $conn->connect_error);
            }

$control = mysqli_fetch_array(mysqli_query($conn,"SELECT * from enviroments where player_FK='".$user."' "));

$count = 1+ $control["$table"];
mysqli_query($conn,"UPDATE enviroments set $table='$count' where  player_FK='$user' ");
echo $user;
		 }

      ?>
