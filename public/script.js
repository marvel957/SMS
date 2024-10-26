// Define fetchStudents function outside of the event listener
async function fetchStudents() {
  try {
    const response = await fetch("/api/students");
    const students = await response.json();
    const studentList = document.getElementById("student-list");

    studentList.innerHTML = students
      .map(
        (student) => `
          <div class="student-item" data-id="${student._id}">
            <div class="student-info">
              <p><strong>Name:</strong> ${student.name}</p>
              <p><strong>Email:</strong> ${student.email}</p>
              <p><strong>GPA:</strong> ${student.gpa}</p>
            </div>
            <div>
              <button class="edit" onclick="editStudent('${student._id}')">Edit</button>
              <button class="delete" onclick="deleteStudent('${student._id}')">Delete</button>
            </div>
          </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchStudents(); // Initial fetch to populate list

  const createForm = document.getElementById("create-student-form");
  const showCreateFormButton = document.getElementById("show-create-form");
  const createStudentButton = document.getElementById("create-student");

  // Toggle the create form visibility
  showCreateFormButton.addEventListener("click", () => {
    createForm.style.display =
      createForm.style.display === "none" ? "block" : "none";
  });

  // Create new student
  createStudentButton.addEventListener("click", async () => {
    const name = document.getElementById("new-student-name").value;
    const email = document.getElementById("new-student-email").value;
    const gpa = document.getElementById("new-student-gpa").value;

    if (name && email && gpa) {
      try {
        await fetch("/api/students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, gpa: parseFloat(gpa) }),
        });
        fetchStudents(); // Refresh the list
        createForm.style.display = "none"; // Hide the form after submission
      } catch (error) {
        console.error("Error creating student:", error);
      }
    } else {
      alert("Please fill out all fields.");
    }
  });
});

// Delete student
async function deleteStudent(id) {
  try {
    await fetch(`/api/students/${id}`, { method: "DELETE" });
    fetchStudents(); // Refresh list after deletion
  } catch (error) {
    console.error("Error deleting student:", error);
  }
}

// Edit student
async function editStudent(id) {
  const newName = prompt("Enter new name:");
  const newEmail = prompt("Enter new email:");
  const newGpa = prompt("Enter new GPA:");

  if (newName && newEmail && newGpa) {
    try {
      await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          gpa: parseFloat(newGpa),
        }),
      });
      fetchStudents(); // Refresh list after editing
    } catch (error) {
      console.error("Error updating student:", error);
    }
  }
}
