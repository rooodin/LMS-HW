const API = "http://localhost:3000/api";

// Helper function to decode a JWT (without verifying)
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  if (!token) {
    // If no token is found, redirect to the login page.
    window.location.href = "/login";
    return;
  }

  // Decode the token to get the user's role
  const decoded = parseJwt(token);
  if (!decoded || !decoded.role) {
    console.error("Unable to determine user role from token.");
    window.location.href = "/login";
    return;
  }
  const role = decoded.role; // e.g., "admin", "instructor", or "student"
  console.log("User role from token:", role);

  // Build the correct dashboard endpoint URL based on the role
  const dashboardEndpoint = `${API}/dashboard/${role}`;

  try {
    // Fetch the dashboard data from the corresponding endpoint
    const response = await fetch(dashboardEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Send the token for authentication
      },
      // If you're using cookies or other credentials, include them:
      credentials: "include",
    });

    if (!response.ok) {
      // Handle 401/403 errors if needed
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      throw new Error("Failed to fetch dashboard data");
    }

    const data = await response.json();

    // Render the dashboard based on the user role
    switch (role) {
      case "admin":
        console.log("data admin= ", data);
        renderAdminDashboard(data);
        break;
      case "instructor":
        console.log("data in= ", data);
        renderInstructorDashboard(data);
        break;
      case "student":
        console.log("data student= ", data);
        renderStudentDashboard(data);
        break;
      default:
        alert("Invalid role");
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    alert("Error fetching dashboard data");
  }

  function renderAdminDashboard(data) {
    // Render the main admin dashboard content inside #dashboard
    document.getElementById("dashboard").innerHTML = `
      <h2>Admin Dashboard</h2>
      <h3>Courses</h3>
      <ul>
        ${data.courses
          .map(
            (course) =>
              `<li>${course.title} - Instructor: ${course.instructor.username}</li>`
          )
          .join("")}
      </ul>
      <h3>Student Statistics</h3>
      ${Object.keys(data.studentStats)
        .map(
          (courseTitle) => `
          <details>
            <summary>${courseTitle}</summary>
            <ul>
              ${data.studentStats[courseTitle]
                .map(
                  (studentStat) => `
                  <li>Student: ${studentStat.student} - Progress: ${studentStat.progress}%</li>
                `
                )
                .join("")}
            </ul>
          </details>
        `
        )
        .join("")}
    `;
  }

  // Function to render the Instructor dashboard
  function renderInstructorDashboard(data) {
    document.getElementById("dashboard").innerHTML = `
      <h2>Instructor Dashboard</h2>
      <h3>Courses and Enrolled Students</h3>
      <ul>
        ${data.courses
          .map(
            (course) => `
            <li>
              <details>
                <summary>${course.title}</summary>
                <h4>Enrolled Students:</h4>
                <ul>
                  ${data.enrollments
                    .filter(
                      (enrollment) => enrollment.course.title === course.title
                    )
                    .map(
                      (enrollment) => `
                      <li>${enrollment.user.username} </li>
                    `
                    )
                    .join("")}
                </ul>
              </details>
            </li>
          `
          )
          .join("")}
      </ul>
    `;
    // Hide the course-list container if present
    document.getElementById("course-list").style.display = "none";
  }

  // Function to render the Student dashboard
  function renderStudentDashboard(data) {
    document.getElementById("dashboard").innerHTML = `
      <h2>Student Dashboard</h2>
      <h3>Your Enrolled Courses</h3>
      <ul>
        ${data.enrollments
          .map(
            (enrollment) => `
            <li>
              ${enrollment.course.title} - Progress: ${enrollment.progress}%<br>
              Description: ${enrollment.course.description}
            </li>
          `
          )
          .join("")}
      </ul>
    `;
    // Hide the course-list container if present
    document.getElementById("course-list").style.display = "none";
  }
});
