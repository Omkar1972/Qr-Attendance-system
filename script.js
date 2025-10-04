window.onload = function () {
  // Auto-fill Date from system
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // yyyy-mm-dd
  document.getElementById("date").value = formattedDate;

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  document.getElementById("outTime").value = getCurrentTime();

  // Handle form submit
  document.getElementById("attendanceForm").addEventListener("submit", function (e) {
    e.preventDefault();   // stop reload
    e.stopPropagation();  // extra safety

    const name = document.getElementById("name").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;
    const inTime = document.getElementById("inTime").value;
    const outTime = getCurrentTime();
    const topic = document.getElementById("topic").value;
    const status = "Out";

    // Send data to Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbwpatqHSU7XTeRS7Hpstwj7k_1U_xSrHI1klUfB3p4LSQCvoRKsZ4JJZ88t0bDUVgQ/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, mobile, email, date, inTime, topic, status }),
    }).then(() => {
      // ✅ Always show message
      const msg = document.getElementById("message");
      msg.innerText = "Submitted Successfully!";
      msg.style.display = "block";
      msg.scrollIntoView({ behavior: "smooth", block: "center" }); // force visible

      // reset form
      document.getElementById("attendanceForm").reset();
      document.getElementById("date").value = formattedDate;
      document.getElementById("outTime").value = getCurrentTime();
    });
  });
};
