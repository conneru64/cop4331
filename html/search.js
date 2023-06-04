function searchSubmit() {
	const query = getVal("search-field");

	// TODO: actual query.
	const response = {
		results: [
			{Name: "Firstname Lastname", Phone: "555-555-5555", Email: "firstlast@example.com"},
			{Name: "Firstname Smith", Phone: "555-123-4567", Email: "firstsmith@example.com"},
			{Name: "John Lastname", Phone: "555-987-6543", Email: "johnlast@example.com"},
		]
	};


	const template = document.getElementById("contact-template").content;
	const contactsTable = document.getElementById("contacts-table");

	// Delete current contact nodes.
	while (contactsTable.childElementCount > 0) {
		contactsTable.removeChild(contactsTable.children[0]);
	}

	for (const person of response.results) {
		// Simulated search functionality until we hook up real search.
		if (person.Name.search(query) == -1) continue;

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

function editSubmit() {
	const name = getVal("edit-name");
	const phone = getVal("edit-phone");
	const email = getVal("edit-email");

	console.log("Pretending to edit: ", name, phone, email);

	// Refresh contacts list.
	searchSubmit();
}

function addSumit() {
	const name = getVal("add-name");
	const phone = getVal("add-phone");
	const email = getVal("add-email");

	console.log("Pretending to add: ", name, phone, email);

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

function deleteContactButton(contactJson) {
	console.log("Pretending to delete: ", contactJson);
	// TODO
}


function getVal(elementId) {
	return document.getElementById(elementId).value;
}
