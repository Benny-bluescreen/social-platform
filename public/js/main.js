// Hantera registrering
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert('User registered successfully!');
        } else {
            const error = await response.text();
            alert(`Error: ${error}`);
        }
    } catch (err) {
        console.error(err);
        alert('Something went wrong. Try again.');
    }
});

// Hantera inloggning
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert('Login successful!');
            window.location.href = '/protected'; // Navigera till skyddad sida
        } else {
            alert('Invalid username or password');
        }
    } catch (err) {
        console.error(err);
        alert('Something went wrong. Try again.');
    }
});
