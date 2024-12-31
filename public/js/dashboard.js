const logoutbtn = document.getElementById('logout');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const changePasswordForm = document.getElementById('changePasswordForm');
const passwordChangeForm = document.getElementById('passwordChangeForm');
const changePasswordErrorDiv = document.getElementById('change-password-error');
const logoutErrorDiv = document.getElementById('logout-error');
const headerText = document.getElementById('headerText');
const username = sessionStorage.getItem('username');

if (username) {
    headerText.textContent = `Välkommen ${username}!`;
} else {
    headerText.textContent = 'Välkommen!';
}

const showError = (element, message) => {
    element.textContent = message;
    element.style.display = 'block';
};

changePasswordBtn.addEventListener('click', () => {
    changePasswordForm.style.display = 'block';
});

passwordChangeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const sessionId = sessionStorage.getItem('sessionId');

    try {
        const response = await fetch('/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-id': sessionId,
            },
            body: JSON.stringify({ oldPassword, newPassword }),
        });

        if (response.ok) {
            alert('Lösenord ändrat');
            changePasswordForm.style.display = 'none';
        } else {
            const errorData = await response.text();
            showError(changePasswordErrorDiv, errorData);
        }
    } catch (error) {
        showError(changePasswordErrorDiv, 'Ett fel inträffade. Försök igen.');
    }
});

logoutbtn.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('Loggar ut...');
    const sessionId = sessionStorage.getItem('sessionId');

    await fetch('/logout', {
        method: 'POST',
        headers: { 'x-session-id': sessionId },
    }).then(response => {
        if (response.ok) {
            window.location.href = '/';
            sessionStorage.removeItem('sessionId');
            sessionStorage.removeItem('username');
        }
    })
        .catch(error => {
            console.error('Error:', error);
        });
});