document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginErrorDiv = document.getElementById('login-error');
    const registerErrorDiv = document.getElementById('register-error');
    const dashboardErrorDiv = document.getElementById('dashboard-error'); // Ny div för dashboard-fel


    // Funktion för att visa felmeddelande
    const showError = (element, message) => {
        element.textContent = message;
        element.style.display = 'block';
    };

    // Funktion för att dölja felmeddelande
    const hideError = (element) => {
        element.style.display = 'none';
    };

    // Funktion för att hantera åtkomst till dashboard
    const accessDashboard = async () => {
        const sessionId = sessionStorage.getItem('sessionId');
        console.log('sessionId:', sessionId);
        try {
            await fetch('/dashboard', {
                headers: { 'x-session-id': sessionId },
            }).then(response => {
                if (response.ok) {
                    return response.text(); // Om det är okej, visa dashboarden
                } else {
                    const errorData = response.text();
                    showError(dashboardErrorDiv, errorData || 'Otillåten access, du måste logga in.');
                    window.location.href = '/';
                }
            })
                .then(async (htmlContent) => {
                    document.body.innerHTML = htmlContent; // Sätt den hämtade dashboarden

                    // Dynamiskt ladda och exekvera externa script
                    const scriptResponse = await fetch('/js/dashboard.js', {
                        headers: { 'x-session-id': sessionId },
                    });

                    if (scriptResponse.ok) {
                        const scriptContent = await scriptResponse.text();
                        const scriptTag = document.createElement('script');
                        scriptTag.textContent = scriptContent;
                        document.body.appendChild(scriptTag);
                    } else {
                        throw new Error('Kunde inte ladda JavaScript.');
                    }

                    history.pushState({ page: 'dashboard' }, 'Dashboard', '/dashboard');
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        } catch (error) {
            showError(dashboardErrorDiv, 'Ett fel inträffade vid åtkomst. Försök igen.');
        }
    };



    // Inloggningsformulär
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError(loginErrorDiv);

        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const { sessionId, username } = await response.json();
                sessionStorage.setItem('sessionId', sessionId);
                sessionStorage.setItem('username', username);
                await accessDashboard();

            } else {
                const errorData = await response.text();
                showError(loginErrorDiv, errorData);
            }
        } catch (error) {
            showError(loginErrorDiv, 'Ett fel inträffade. Försök igen.');
        }
    });

    // Registreringsformulär
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError(registerErrorDiv);

        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                registerForm.reset();
                showError(registerErrorDiv, 'Registrering lyckades!');
                registerErrorDiv.style.color = 'green';
            } else {
                const errorData = await response.text();
                showError(registerErrorDiv, errorData);
                registerErrorDiv.style.color = 'red';
            }
        } catch (error) {
            showError(registerErrorDiv, 'Ett fel inträffade. Försök igen.');
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        const loginErrorDiv = document.getElementById('login-error');
        const registerErrorDiv = document.getElementById('register-error');

        // Funktion för att visa felmeddelande
        const showError = (element, message) => {
            element.textContent = message;
            element.style.display = 'block';
        };

        // Funktion för att dölja felmeddelande
        const hideError = (element) => {
            element.style.display = 'none';
        };

        // // Inloggningsformulär
        // loginForm.addEventListener('submit', async (e) => {
        //     e.preventDefault();
        //     hideError(loginErrorDiv); // Dölj eventuellt tidigare felmeddelande

        //     const username = document.getElementById('loginUsername').value;
        //     const password = document.getElementById('loginPassword').value;

        //     try {
        //         const response = await fetch('/login', {
        //             method: 'POST',
        //             headers: { 'Content-Type': 'application/json' },
        //             body: JSON.stringify({ username, password }),
        //         });

        //         if (response.ok) {
        //             const data = await response.json();
        //             sessionStorage.setItem('sessionId', data.sessionId); // Spara sessionId i sessionStorage
        //             window.location.href = '/dashboard'; // Navigera till en skyddad sida
        //         } else {
        //             const errorData = await response.text();
        //             showError(loginErrorDiv, errorData);
        //         }
        //     } catch (error) {
        //         showError(loginErrorDiv, 'Ett fel inträffade. Försök igen.');
        //     }
        // });

        // Registreringsformulär
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideError(registerErrorDiv); // Dölj eventuellt tidigare felmeddelande

            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    // Återställ formuläret och visa ett framgångsmeddelande
                    registerForm.reset();
                    showError(registerErrorDiv, 'Registrering lyckades!');
                    registerErrorDiv.style.color = 'green'; // Gör meddelandet grönt
                } else {
                    const errorData = await response.text();
                    showError(registerErrorDiv, errorData);
                    registerErrorDiv.style.color = 'red'; // Se till att det är rött vid fel
                }
            } catch (error) {
                showError(registerErrorDiv, 'Ett fel inträffade. Försök igen.');
            }
        });

        // När användaren försöker komma åt dashboard, skicka med sessionId som header
        // if (window.location.pathname === '/dashboard') {
        //     const sessionId = sessionStorage.getItem('sessionId');

        //     // Skicka en GET-begäran till servern med sessionId i headern
        //     fetch('/dashboard', {
        //         method: 'GET',
        //         headers: {
        //             'x-session-id': sessionId // Skicka sessionId här
        //         }
        //     })
        //         .then(response => {
        //             if (response.ok) {
        //                 return response.text(); // Om det är okej, visa dashboarden
        //             } else {
        //                 window.location.href = '/'; // Om inte, omdirigera till index
        //             }
        //         })
        //         .then(htmlContent => {
        //             document.body.innerHTML = htmlContent; // Sätt den hämtade dashboarden
        //         })
        //         .catch(error => {
        //             console.error('Error:', error);
        //         });
        // }
    });
});
