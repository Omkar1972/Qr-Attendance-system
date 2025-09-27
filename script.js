window.onload = function () {
  // Auto-fill Date from system
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // yyyy-mm-dd
  document.getElementById("date").value = formattedDate;

  // Handle form submit
  document.getElementById("attendanceForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;
    const inTime = document.getElementById("inTime").value;
    const topic = document.getElementById("topic").value;

    // Status fixed as "Out"
    const status = "Out";

    // Send to Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbwpatqHSU7XTeRS7Hpstwj7k_1U_xSrHI1klUfB3p4LSQCvoRKsZ4JJZ88t0bDUVgQ/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, mobile, email, date, inTime, topic, status }),
    })
      .then(() => {
        document.getElementById("message").innerText = "✅ Submitted Successfully!";
        document.getElementById("attendanceForm").reset();

        // Refill Date again after reset
        document.getElementById("date").value = formattedDate;
      })
      .catch((error) => {
        document.getElementById("message").innerText = "❌ Error: " + error;
      });
  });
};
