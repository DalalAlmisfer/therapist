  <?php
         if(isset($_POST["isim"])){
                                      include("ayar.php");



$isim = addslashes($_POST['isim']);
$sifre = md5($_POST['sifre']);
            // Create connection
            $conn = new mysqli($servername, $username, $password, $dbname);

            // Check connection
            if ($conn->connect_error) {
               die("Connection failed: " . $conn->connect_error);
            }



$kontrol = mysqli_fetch_array(mysqli_query($conn,"SELECT * from users where Name='$isim' "));

			if(!$kontrol){

            $sql = "INSERT INTO users(Name,Password) VALUES ('".$isim."','".$sifre."')";

            if (mysqli_query($conn, $sql)) {
				$kontrol = mysqli_fetch_array(mysqli_query($conn,"SELECT * from users where Name='$isim'  "));



               echo $kontrol['id'];
            } else {
               echo "0";
            }
            $conn->close();
         }		 else {
			 if($kontrol['Name']==$email){ echo "0";}else {echo "0";}
			}

		 }

      ?>
