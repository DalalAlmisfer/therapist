
  <?php

         if(isset($_POST["user"])){



$user = addslashes($_POST['user']);

            // Create connection
            $conn = new mysqli("localhost", "root", "","anees_DB");

            // Check connection
            if ($conn->connect_error) {
               die("Connection failed: " . $conn->connect_error);
            }



$schoolcontrol = mysqli_fetch_array(mysqli_query($conn,"SELECT * from enviroments where player_FK='$user' and title='school'"));

			if($schoolcontrol){$school=1;}	else {$school=0;}	

$gardencontrol = mysqli_fetch_array(mysqli_query($conn,"SELECT * from enviroments where player_FK='$user' and title='garden'"));

			if($gardencontrol){$garden=1;}	else {$garden=0;}	


$marketcontrol = mysqli_fetch_array(mysqli_query($conn,"SELECT * from enviroments where player_FK='$user' and title='market'"));

			if($marketcontrol){$market=1;}	else {$market=0;}

echo $school.','.$garden.','.$market;	
		 }

      ?>
