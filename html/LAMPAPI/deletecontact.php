
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
		$stmt1 = $conn->prepare("select Name FROM Contacts WHERE Name=?");
		$stmt1->bind_param("s", $inData["Name"]);
		$stmt1->execute();
		$result = $stmt1->get_result();

		if( $row = $result->fetch_assoc()  )
		{
            $stmt = $conn->prepare("DELETE FROM Contacts WHERE Name=?");
		    $stmt->bind_param("s", $inData["Name"]);
		    $stmt->execute();
		}
		else
		{
            echo "record does not exist";
            
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