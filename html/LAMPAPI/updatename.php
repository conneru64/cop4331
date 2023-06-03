
<?php

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
		$stmt1 = $conn->prepare("select Email,Phone FROM Contacts WHERE Email=? AND Phone =?");
		$stmt1->bind_param("ss", $inData["Email"], $inData["Phone"]);
		$stmt1->execute();
		$result = $stmt1->get_result();

		if( $row = $result->fetch_assoc()  )
		{
            $stmt = $conn->prepare("UPDATE Contacts SET Name=? Where Phone=?");
		    $stmt->bind_param("ss", $inData["Name"], $inData["Phone"]);
		    $stmt->execute();
            echo "records updated";
		}
		else
		{
            returnuseralreadyexists("cannot update contact");
            
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
