
  <?php

   if (isset($_POST["user"])) {



      $user = addslashes($_POST['user']);

      // Create connection
      $conn = new mysqli("eu-cdbr-west-03.cleardb.net", "b630bdd6b6e1b9", "d159c434","heroku_195f706910a16f0");

      // Check connection
      if ($conn->connect_error) {
         die("Connection failed: " . $conn->connect_error);
      }


      $userinfo = mysqli_fetch_array(mysqli_query($conn, "SELECT * from players where player_id='$user' "));

      $schoolcontrol = mysqli_fetch_array(mysqli_query($conn, "SELECT * from enviroments where player_FK='$user' and title='school'"));

      if ($schoolcontrol) {
         $school = 1;
      } else {
         $school = 0;
      }


      $gardencontrol = mysqli_fetch_array(mysqli_query($conn, "SELECT * from enviroments where player_FK='$user' and title='garden'"));

      if ($gardencontrol) {
         $garden = 1;
      } else {
         $garden = 0;
      }


      $marketcontrol = mysqli_fetch_array(mysqli_query($conn, "SELECT * from enviroments where player_FK='$user' and title='market'"));

      if ($marketcontrol) {
         $market = 1;
      } else {
         $market = 0;
      }

      echo $userinfo["first_name"] . ',' . $userinfo["last_name"] . ',' . $userinfo["gander"] . ',' . $school . ',' . $garden . ',' . $market;
   }

   ?>
