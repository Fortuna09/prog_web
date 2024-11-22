// Login functionality
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    } else {
      errorMessage.textContent = 'Incorrect email or password. Please try again.';
    }
  });
}

// Register functionality
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    if (password.length < 8) {
      errorMessage.textContent = 'Password must be at least 8 characters long.';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the email is already registered
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      errorMessage.textContent = 'This email is already registered.';
      return;
    }

    // Add the new user
    users.push({ email, password, role });
    localStorage.setItem('users', JSON.stringify(users));

    successMessage.textContent = 'User registered successfully!';
    errorMessage.textContent = '';

    // Clear the form
    registerForm.reset();

    // Redirect to login after 2 seconds
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  });
}
