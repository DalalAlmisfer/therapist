
  <?php

   if (isset($_POST["user"])) {



      $user = addslashes($_POST['user']);
      $password = ($_POST['password']);
      // Create connection
      $conn = new mysqli("eu-cdbr-west-03.cleardb.net", "b630bdd6b6e1b9", "d159c434", "heroku_195f706910a16f0");
      // Check connection
      if ($conn->connect_error) {
         die("Connection failed: " . $conn->connect_error);
      }



      $control = mysqli_fetch_array(mysqli_query($conn, "SELECT * from players where email='$user' and password='" . $password . "'"));
      if (!$control) {
         echo 0;
      } else {
         echo $control['player_id'];
         $update = mysqli_fetch_array(mysqli_query($conn, "UPDATE players where email='$user' and islogged_in=1"));
      }

      
   }

   ?>
