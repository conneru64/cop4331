
<?php
	session_start();
	$inData = getRequestInfo();
	
	$id = 0;
	$Name = "";
	$Phone = "";
    $Email = "";
    $UserID = "";


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt1 = $conn->prepare("select Name,Phone FROM Contacts WHERE Name=? AND Phone =?");
		$stmt1->bind_param("ss", $inData["Name"], $inData["Phone"]);
		$stmt1->execute();
		$result = $stmt1->get_result();

		if( $row = $result->fetch_assoc()  )
		{
            returnuseralreadyexists("Contact exists");
		}
		else
		{
            $stmt = $conn->prepare("INSERT INTO Contacts (Name,Phone,Email,UserID) values (?, ?, ?, ?)");
		    $stmt->bind_param("ssss", $inData["Name"], $inData["Phone"], $inData["Email"], $_SESSION['user_id']);
		    $stmt->execute();
            echo "New records created successfully";
            
		}
        $stmt1->close();
		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
    function returnuseralreadyexists( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
