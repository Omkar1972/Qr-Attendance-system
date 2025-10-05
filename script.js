window.onload = function () {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  document.getElementById("date").value = formattedDate;

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  document.getElementById("outTime").value = getCurrentTime();

  // --- Load saved data (localStorage instead of cookies) ---
  const savedData = JSON.parse(localStorage.getItem("userData"));
  if (savedData) {
    // Auto-fill only Name, Mobile, Email, Date
    document.getElementById("name").value = savedData.name;
    document.getElementById("mobile").value = savedData.mobile;
    document.getElementById("email").value = savedData.email;
    document.getElementById("date").value = formattedDate;

    // Lock them so user doesn't edit again
    document.getElementById("name").disabled = true;
    document.getElementById("mobile").disabled = true;
    document.getElementById("email").disabled = true;
  }

  // --- Handle Submit ---
  document.getElementById("attendanceForm").addEventListener("submit", function (e) {
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

    // --- Save only once (first submission) ---
    if (!localStorage.getItem("userData")) {
      localStorage.setItem("userData", JSON.stringify({ name, mobile, email }));
    }

    // --- Send to Google Sheets ---
    fetch("https://script.google.com/macros/s/AKfycbwpatqHSU7XTeRS7Hpstwj7k_1U_xSrHI1klUfB3p4LSQCvoRKsZ4JJZ88t0bDUVgQ/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, mobile, email, date, inTime, outTime, topic, status }),
    }).then(() => {
      const msg = document.getElementById("message");
      msg.innerText = "Submitted Successfully!";
      msg.style.display = "block";
      msg.scrollIntoView({ behavior: "smooth", block: "center" });

      // reset only in-time & topic for next entry
      document.getElementById("attendanceForm").reset();

      // restore locked fields again
      if (savedData || localStorage.getItem("userData")) {
        const user = JSON.parse(localStorage.getItem("userData"));
        document.getElementById("name").value = user.name;
        document.getElementById("mobile").value = user.mobile;
        document.getElementById("email").value = user.email;
        document.getElementById("name").disabled = true;
        document.getElementById("mobile").disabled = true;
        document.getElementById("email").disabled = true;
      }

      document.getElementById("date").value = formattedDate;
      document.getElementById("outTime").value = getCurrentTime();
    });
  });
};
