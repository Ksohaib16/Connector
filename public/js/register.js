const authManager = {
  start() {
    this.attachEventlistner();
  },
  attachEventlistner() {
    const signUpForm = document.querySelector("#signUpForm");
    const loginForm = document.querySelector("#loginForm");

    if (signUpForm) {
      signUpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.signupFormSubmit();
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.loginFormSubmit();
      });
    }

    document.getElementById("logout-btn").addEventListener("click", (e) => {
      e.preventDefault();
      console.log("logout button clicked");
      this.logout();
    });
  },

  async signupFormSubmit() {
    const email = document.querySelector("#signEmail").value;
    const password = document.querySelector("#signPassword").value;
    const username = document.querySelector("#signUsername").value;

    try {
      const response = await axios.post("/api/auth/signup", {
        email,
        password,
        username,
      });

      // Handle success
      if (response.data.success) {
        window.location.href = "/api/home"; // Redirect on success
      } else {
        // Handle error
        alert(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        // Handle backend validation errors
        alert(error.response.data.error);
      } else {
        // Handle network errors
        alert("Connection error. Please try again.");
      }
    }
  },

  async loginFormSubmit() {
    const email = document.querySelector("#loginEmail").value;
    const password = document.querySelector("#loginPassword").value;

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });
      if (response.data.success) {
        window.location.href = "/api/home";
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        // Handle backend validation errors
        alert(error.response.data.error);
      } else {
        // Handle network errors
        alert("Connection error. Please try again.");
      }
    }
  },

  async logout() {
    try {
      const res = await axios.post("/api/auth/logout");
      console.log("Print response message", res.data.message);
      if (res.data.success) {
        alert(res.data.message);
        window.location.href = "/api/auth/login";
      }
    } catch (error) {
      alert(error.response?.data?.message || "Logout failed");
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  authManager.start();
});
