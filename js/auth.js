/* ==========================================
   AUTH.JS
========================================== */

/*
    This file is shared by:

    ✔ login.html
    ✔ signup.html
*/

/* ==========================================
   LOGIN CHECK
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const currentUser = await getCurrentUser();

    const page = window.location.pathname.split("/").pop();

    // If already logged in, don't show login/signup again
    if (
        currentUser &&
        (page === "login.html" || page === "signup.html")
    ) {
        window.location.href = "dashboard.html";
        return;
    }

});

/* ==========================================
   LOGIN
========================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document
            .getElementById("email")
            .value
            .trim();

        const password = document
            .getElementById("password")
            .value;

        if (!email || !password) {

            alert("Please fill all fields.");

            return;

        }

        const { error } = await supabaseClient.auth.signInWithPassword({

            email,
            password

        });

        if (error) {

            alert(error.message);

            return;

        }

        alert("Login Successful!");

        window.location.href = "dashboard.html";

    });

}

/* ==========================================
   SIGNUP
========================================== */

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const fullname = document
            .getElementById("fullname")
            .value
            .trim();

        const username = document
            .getElementById("username")
            .value
            .trim();

        const email = document
            .getElementById("email")
            .value
            .trim();

        const password = document
            .getElementById("password")
            .value;

        const confirmPassword = document
            .getElementById("confirmPassword")
            .value;

        /* Validation */

        if (
            !fullname ||
            !username ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            alert("Please fill all fields.");

            return;

        }

        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;

        }

        if (password.length < 6) {

            alert("Password must contain at least 6 characters.");

            return;

        }

        const { error } = await supabaseClient.auth.signUp({

            email,

            password,

            options: {

                data: {

                    full_name: fullname,

                    username: username

                }

            }

        });

        if (error) {

            alert(error.message);

            return;

        }

        alert(
            "Account created successfully!\n\nPlease verify your email before logging in."
        );

        window.location.href = "login.html";

    });

}

/* ==========================================
   GOOGLE LOGIN (Placeholder)
========================================== */

const googleButtons = document.querySelectorAll(".google-btn");

googleButtons.forEach((button) => {

    button.addEventListener("click", async () => {

        alert(
            "Google Sign-In will be enabled after configuring it in Supabase Authentication."
        );

    });

});

/* ==========================================
   LOGOUT
========================================== */

const logoutButton = document.getElementById("logoutBtn");

if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        if (!confirm("Do you want to logout?")) {

            return;

        }

        await logout();

    });

}

/* ==========================================
   PASSWORD VALIDATION
========================================== */

const passwordInput = document.getElementById("password");

if (passwordInput) {

    passwordInput.addEventListener("input", () => {

        const password = passwordInput.value;

        if (password.length >= 6) {

            passwordInput.style.border = "2px solid #22c55e";

        } else {

            passwordInput.style.border = "2px solid #ef4444";

        }

    });

}

/* ==========================================
   EMAIL VALIDATION
========================================== */

const emailInput = document.getElementById("email");

if (emailInput) {

    emailInput.addEventListener("blur", () => {

        const value = emailInput.value.trim();

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (value && !regex.test(value)) {

            alert("Please enter a valid email address.");

            emailInput.focus();

        }

    });

}

/* ==========================================
   SESSION WATCHER
========================================== */

supabaseClient.auth.onAuthStateChange((event) => {

    console.log("Authentication Event:", event);

});
