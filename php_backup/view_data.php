<?php
// Start the PHP block

// This line accesses your configuration file to get the connection settings 
// (server, username, password, database name) and establish the connection ($conn).
include 'php/config.php';

// Check if the connection established in config.php failed.
if ($conn->connect_error) {
    // If it failed, stop the script and display the error.
    die("Connection failed: " . $conn->connect_error);
}

// End the PHP block. The rest of the file will be HTML with embedded PHP.
?>