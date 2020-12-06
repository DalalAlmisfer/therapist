
  <?php

   if (isset($_POST["user"])) {



      $user = addslashes($_POST['user']);
      $password = ($_POST['password']);
      // Create connection
      $conn = new mysqli("localhost", "root", "password", "anees_DB");
      // Check connection
      if ($conn->connect_error) {
         die("Connection failed: " . $conn->connect_error);
      }



      $control = mysqli_fetch_array(mysqli_query($conn, "SELECT * from players where email='$user' and password='" . $password . "'"));
      if (!$control) {
         echo 0;
      } else {
         echo $control['player_id'];
         $update = mysqli_fetch_array(mysqli_query($conn, "UPDATE players SET islogged_in=1 where email='$user'"));
      }

      
   }

   ?>
