const BASE = "http://cop4331-group5.com";

async function searchSubmit() {
	const query = getVal("search-field");

	const response = await fetch(BASE + "/LAMPAPI/search_contacts.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
		},
		body: `{"search": "${query}"}`,
	});

	// TODO: actual query.
	const json = await response.json();


	const template = document.getElementById("contact-template").content;
	const contactsTable = document.getElementById("contacts-table");

	// Delete current contact nodes.
	while (contactsTable.childElementCount > 0) {
		contactsTable.removeChild(contactsTable.children[0]);
	}

	// If error.
	if (!response.ok || !Array.isArray(json)) {
		// Possible TODO: make a proper error screen.

		console.error("search_contacts response error: ", json);
		return;
	}

	for (const person of json) {
		const elem = template.cloneNode(true);

		elem.querySelector(".contact-name").innerText = person.Name;
		elem.querySelector(".contact-phone").innerText = person.Phone;
		elem.querySelector(".contact-email").innerText = person.Email;

		elem.querySelector(".contact-listing").setAttribute("data-json", JSON.stringify(person));

		// Setup the buttons to work.
		elem.querySelector(".contact-edit").addEventListener("click", e=>{
			const jsonStr = e.target.parentElement.getAttribute("data-json");
			editContactButton(JSON.parse(jsonStr));
		});
		elem.querySelector(".contact-delete").addEventListener("click", e=>{
			const jsonStr = e.target.parentElement.getAttribute("data-json");
			deleteContactButton(JSON.parse(jsonStr));
		});

		contactsTable.appendChild(elem);
	}
}

async function editSubmit() {
	const originalContact = JSON.parse(document.getElementById("edit-dialog").getAttribute("data-original"));
	const newName = getVal("edit-name");
	const newPhone = getVal("edit-phone");
	const newEmail = getVal("edit-email");

	const nameResponse = await fetch(BASE + "/LAMPAPI/updatename.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
		},
		body: `{"Name": "${newName}", "Phone": "${originalContact.Phone}", "Email": "${originalContact.Email}"}`,
	});
	if (!nameResponse.ok) {
		console.error("Error updating name: ", nameResponse);
		return;
	}
	const phoneResponse = await fetch(BASE + "/LAMPAPI/updatephone.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
		},
		body: `{"Name": "${newName}", "Phone": "${newPhone}", "Email": "${originalContact.Email}"}`,
	});
	if (!phoneResponse.ok) {
		console.error("Error updating name: ", phoneResponse);
		return;
	}
	const emailResponse = await fetch(BASE + "/LAMPAPI/updateemail.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
		},
		body: `{"Name": "${newName}", "Phone": "${newPhone}", "Email": "${newEmail}"}`,
	});
	if (!emailResponse.ok) {
		console.error("Error updating name: ", emailResponse);
		return;
	}

	// Refresh contacts list.
	searchSubmit();
}

async function addSubmit() {
	const name = getVal("add-name");
	const phone = getVal("add-phone");
	const email = getVal("add-email");

	const response = await fetch(BASE + "/LAMPAPI/createcontact.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
		},
		body: `{"Name": "${name}", "Phone": "${phone}", "Email": "${email}"}`,
	});

	if (!response.ok) {
		console.error("createcontact error: ", response);
	}

	// Refresh contacts list.
	searchSubmit();
}

/// Called by the edit button next to contacts.
function editContactButton(contactJson) {
	const dialog = document.getElementById("edit-dialog");

	dialog.setAttribute("data-original", JSON.stringify(contactJson));

	document.getElementById("edit-name").value = contactJson.Name;
	document.getElementById("edit-phone").value = contactJson.Phone;
	document.getElementById("edit-email").value = contactJson.Email;

	dialog.showModal();
}

async function deleteContactButton(contactJson) {
	const response = await fetch(BASE + "/LAMPAPI/deletecontact.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
		},
		body: JSON.stringify(contactJson),
	});

	if (!response.ok) {
		console.error("deletecontact error: ", response);
	}

	// Refresh contacts list/
	searchSubmit();
}


function getVal(elementId) {
	return document.getElementById(elementId).value;
}
