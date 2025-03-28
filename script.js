document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    //Get form data
    const name = document.getElementById("name").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const email = document.getElementById("email").value.trim();
    const contact = document.getElementById("contact").value.trim();

    // console.log(name, studentId, email, contact);

    //Validate inputs
    if(!validateInputs(studentId, name, email, contact)) {
        return;
    }

    //get student details from local storage
    let students = getStoredStudents();

    //Checks for duplicate data
    if (students.some(student => student.studentId === studentId)) {
        alert("Student ID already exists");
        return;
    }

    if (students.some(student => student.email === email)) {
        alert("Email already exists");
        return;
    }

    if (students.some(student => student.contact === contact)) {
        alert("Contact number already exists");
        return;
    }

    const newStudent = { studentId, name, email, contact };
    students.push(newStudent);
    localStorage.setItem("students", JSON.stringify(students));

    addStudentToTable(newStudent);

    document.getElementById("registrationForm").reset();
});

//Validate inputs function
function validateInputs(studentId, name, email, contact) {
    const idPattern = /^\d{1,3}$/;      //Only numbers and max 3 digits
    const namePattern = /^[A-Za-z'.\s]+$/;      //Only alphabets and some special characters(apsotrophe, dot and space)
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;    //Common email regex
    const contactPattern = /^\d{10}$/;          //Only 10 digit number

    if (!name || !studentId || !email || !contact) {
        alert("All fields need to be filled");
        return false;
    }
    if (!idPattern.test(studentId)) {
        alert("Student ID can only contain numbers and max 3 digits");
        return false;
    }
    if (!namePattern.test(name)) {
        alert("Name can only contain alphabets and some special characters");
        return false;
    }
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email ID");
        return false;
    }
    if (!contactPattern.test(contact)) {
        alert("Contact number has to be a 10 digit number");
        return false;
    }
    return true;
}


//Get students from local storage function
function getStoredStudents() {
    return JSON.parse(localStorage.getItem("students")) || [];
}

//Add student to table function
function addStudentToTable(student) {

    //Get table body
    const tableBody = document.getElementById("studentTableBody");

    //Create new row
    const newRow = document.createElement("tr");
    newRow.classList.add("bg-gray-50", "hover:bg-gray-100");
    //Add row data
    newRow.innerHTML = `
    <td class="p-3">${student.studentId}</td>
    <td class="p-3">${student.name}</td>
    <td class="p-3">${student.email}</td>
    <td class="p-3">${student.contact}</td>
    <td class="p-3 space-x-2">
        <button onclick="editRow(this)" class="px-3 py-1 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600">Edit</button>
        <button onclick="deleteRow(this)" class="px-3 py-1 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">Delete</button>
    </td>`;

    //Append row to table
    tableBody.appendChild(newRow);

}

//Delete student record function
function deleteRow(button) {
    const row = button.parentElement.parentElement;
    const studentId = row.cells[0].textContent;

    let students = getStoredStudents().filter(student => student.studentId !== studentId);
    localStorage.setItem("students", JSON.stringify(students));
    row.remove();
}

//Edit student record function
function editRow(button) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll("td");

    //Convert the cells to input fields
    const studentId = cells[0].textContent;
    const name = cells[1].textContent;
    const email = cells[2].textContent;
    const contact = cells[3].textContent;

    cells[0].innerHTML = `<input type="text" value="${studentId}" id="editStudentId" class="mt-1 block w-full px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">`;
    cells[1].innerHTML = `<input type="text" value="${name}" id="editName" class="mt-1 block w-full px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">`;
    cells[2].innerHTML = `<input type="email" value="${email}" id="editEmail" class="mt-1 block w-full px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">`;
    cells[3].innerHTML = `<input type="tel" value="${contact}" id="editContact" class="mt-1 block w-full px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">`;

    //Replace Edit and Delete buttons with Save
    cells[4].innerHTML = `<button onclick="saveRow(this, '${studentId}', '${email}', '${contact}')" class="px-3 py-1 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">Save</button>`;
}

//Save edited row function
function saveRow(button, oldStudentId, oldEmail, oldContact) {
    const row = button.parentElement.parentElement;
    const newStudentId = row.querySelector("#editStudentId").value.trim();
    const newName = row.querySelector("#editName").value.trim();
    const newEmail = row.querySelector("#editEmail").value.trim();
    const newContact = row.querySelector("#editContact").value.trim();

    //Validate inputs
    if (!validateInputs(newStudentId, newName, newEmail, newContact)) {
        return;
    }

    let students = getStoredStudents();

    //Checks for duplicate data
    if (newStudentId !== oldStudentId && students.some(student => student.studentId === newStudentId)) {
        alert("Student ID already exists");
        return;
    }
    if (newEmail !== oldEmail && students.some(student => student.email === newEmail)) {
        alert("Email already exists");
        return;
    }
    if (newContact !== oldContact && students.some(student => student.contact === newContact)) {
        alert("Contact number already exists");
        return;
    }

    students = students.map(student => 
        student.studentId === oldStudentId ? { studentId: newStudentId, name: newName, email: newEmail, contact: newContact } : student
    );

    localStorage.setItem("students", JSON.stringify(students));

    //Update row with new data
    row.innerHTML = `
    <td class="p-3">${newStudentId}</td>
    <td class="p-3">${newName}</td>
    <td class="p-3">${newEmail}</td>
    <td class="p-3">${newContact}</td>
    <td class="p-3 space-x-2">
        <button onclick="editRow(this)" class="px-3 py-1 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600">Edit</button>
        <button onclick="deleteRow(this)" class="px-3 py-1 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">Delete</button>    
    </td>`;
}

//Load students from local storage and populate in table function
function loadStudentsFromStorage() {
    getStoredStudents().forEach(addStudentToTable);
}

document.addEventListener("DOMContentLoaded", loadStudentsFromStorage);