window.onload = function () {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  document.getElementById("date").value = formattedDate;

  // Function to get current time (for Out-Time)
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  document.getElementById("outTime").value = getCurrentTime();

  const messageBox = document.getElementById("message");
  const savedUser = JSON.parse(localStorage.getItem("userData"));
  const lastSubmission = JSON.parse(localStorage.getItem("lastSubmission"));

  // --- Auto-fill saved user info every day ---
  if (savedUser) {
    document.getElementById("name").value = savedUser.name;
    document.getElementById("mobile").value = savedUser.mobile;
    document.getElementById("email").value = savedUser.email;
    document.getElementById("name").disabled = true;
    document.getElementById("mobile").disabled = true;
    document.getElementById("email").disabled = true;
  }

  // --- Check if already submitted today ---
  if (lastSubmission && lastSubmission.date === formattedDate) {
    messageBox.innerText = "You have already submitted today's attendance!";
    messageBox.style.display = "block";
    document.getElementById("attendanceForm").style.display = "none";
    return;
  } else {
    // New day — show form again
    document.getElementById("attendanceForm").style.display = "block";

    // Auto-fill only saved user info
    if (savedUser) {
      document.getElementById("name").value = savedUser.name;
      document.getElementById("mobile").value = savedUser.mobile;
      document.getElementById("email").value = savedUser.email;
      document.getElementById("name").disabled = true;
      document.getElementById("mobile").disabled = true;
      document.getElementById("email").disabled = true;
    }

    // Clear manual fields (in-time & topic) for the new day
    document.getElementById("inTime").value = "";
    document.getElementById("topic").value = "";
  }

  // --- Handle Submit ---
  document
    .getElementById("attendanceForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const name = document.getElementById("name").value;
      const mobile = document.getElementById("mobile").value;
      const email = document.getElementById("email").value;
      const date = document.getElementById("date").value;
      const inTime = document.getElementById("inTime").value;
      const outTime = getCurrentTime();
      const topic = document.getElementById("topic").value;
      const status = "Out";

      // Save user info for auto-fill next day
      localStorage.setItem("userData", JSON.stringify({ name, mobile, email }));

      // --- Send data to Google Sheets ---
      fetch(
        "https://script.google.com/macros/s/AKfycbwpatqHSU7XTeRS7Hpstwj7k_1U_xSrHI1klUfB3p4LSQCvoRKsZ4JJZ88t0bDUVgQ/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            mobile,
            email,
            date,
            inTime,
            outTime,
            topic,
            status,
          }),
        }
      ).then(() => {
        // Save today’s submission date
        localStorage.setItem("lastSubmission", JSON.stringify({ date }));

        // Success message
        messageBox.innerText = "✅ Submitted Successfully!";
        messageBox.style.display = "block";

        // Hide form after submission
        document.getElementById("attendanceForm").style.display = "none";
      });
    });
};
