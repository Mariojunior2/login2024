<?php

session_start();
if(!isset($_SESSION['user_id'])) {
    header("Location: ../../login.html");
    exit();
}

?>

<?php
session_start();
$conn = mysqli_connect("localhost", "root", "", "task_manager");
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $passoword = md5($_POST['password']);

    $query = "SELECT * FROM users WHERE username='$username' AND password='$passoword'";
    $result = mysqli_query($conn, $query);


    if(mysqli_num_rows($result) == 1) {
        $user = mysqli_fetch_assoc($result);
        $_SESSION['user_id'] = $user['id'];
        header("Location: ../../dashboard.html");
    } else {
        echo "Usuário ou senha incorretos.";
    }
}
?>

