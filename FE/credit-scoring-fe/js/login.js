const LOGIN_API_URL = 'http://localhost:8080/users/api/v1/users/login';

document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');

    // =========================
    // LOGIN
    // =========================

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // =========================
    // TOGGLE PASSWORD
    // =========================

    if (togglePassword) {
        togglePassword.addEventListener('click', togglePasswordVisibility);
    }
});


/**
 * Handle login
 */
async function handleLogin(event) {

    event.preventDefault();

    const userNameInput = document.getElementById('userName');
    const passwordInput = document.getElementById('password');

    const userName = userNameInput.value.trim();
    const password = passwordInput.value;

    // Clear previous error
    hideLoginError();

    // =========================
    // VALIDATE INPUT
    // =========================

    if (!userName) {
        showLoginError('Vui lòng nhập tên đăng nhập.');
        userNameInput.focus();
        return;
    }

    if (!password) {
        showLoginError('Vui lòng nhập mật khẩu.');
        passwordInput.focus();
        return;
    }

    // =========================
    // SHOW LOADING
    // =========================

    setLoginLoading(true);

    try {

        const response = await fetch(LOGIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: userName,
                password: password
            })
        });

        // =========================
        // CHECK HTTP RESPONSE
        // =========================

        if (!response.ok) {
            throw new Error(
                `Login API returned HTTP ${response.status}`
            );
        }

        const user = await response.json();

        console.log('Login response:', user);

        // =========================
        // CHECK LOGIN RESULT
        // =========================

        if (!user || !user.userName) {

            showLoginError(
                'Tên đăng nhập hoặc mật khẩu không chính xác.'
            );

            passwordInput.value = '';
            passwordInput.focus();

            return;
        }

        // =========================
        // LOGIN SUCCESS
        // =========================

        const currentUser = {
            userName: user.userName,
            roleGroup: user.roleGroup,
            email: user.email,
            fullName: user.fullName
        };

        // Save logged-in user
        localStorage.setItem(
            'credit_scoring_user',
            JSON.stringify(currentUser)
        );

        console.log('Login successful:', currentUser);

        // =========================
        // REDIRECT HOME
        // =========================

        window.location.href = 'index.html';

    } catch (error) {

        console.error('Login error:', error);

        showLoginError(
            'Không thể kết nối đến hệ thống. Vui lòng thử lại sau.'
        );

    } finally {

        setLoginLoading(false);
    }
}


/**
 * Show login error
 */
function showLoginError(message) {

    const errorContainer =
        document.getElementById('loginError');

    const errorMessage =
        document.getElementById('loginErrorMessage');

    if (errorMessage) {
        errorMessage.textContent = message;
    }

    if (errorContainer) {
        errorContainer.style.display = 'flex';
    }
}


/**
 * Hide login error
 */
function hideLoginError() {

    const errorContainer =
        document.getElementById('loginError');

    if (errorContainer) {
        errorContainer.style.display = 'none';
    }
}


/**
 * Set login button loading state
 */
function setLoginLoading(loading) {

    const loginButton =
        document.getElementById('loginButton');

    const loginButtonText =
        document.getElementById('loginButtonText');

    const loginArrow =
        document.getElementById('loginArrow');

    const loginSpinner =
        document.getElementById('loginSpinner');

    if (!loginButton) {
        return;
    }

    if (loading) {

        loginButton.disabled = true;

        if (loginButtonText) {
            loginButtonText.textContent = 'Đang đăng nhập...';
        }

        if (loginArrow) {
            loginArrow.style.display = 'none';
        }

        if (loginSpinner) {
            loginSpinner.style.display = 'inline-block';
        }

    } else {

        loginButton.disabled = false;

        if (loginButtonText) {
            loginButtonText.textContent = 'Đăng nhập';
        }

        if (loginArrow) {
            loginArrow.style.display = 'block';
        }

        if (loginSpinner) {
            loginSpinner.style.display = 'none';
        }
    }
}


/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {

    const passwordInput =
        document.getElementById('password');

    if (!passwordInput) {
        return;
    }

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}


function checkLoginAuthentication() {

    const userData = localStorage.getItem('credit_scoring_user');

    // Chưa đăng nhập → ở lại trang login
    if (!userData) {
        return false;
    }

    let user;

    try {

        user = JSON.parse(userData);

    } catch (error) {

        console.error(
            'Invalid credit_scoring_user data:',
            error
        );

        localStorage.removeItem('credit_scoring_user');

        return false;
    }

    if (
        !user ||
        typeof user !== 'object' ||
        Array.isArray(user)
    ) {

        localStorage.removeItem('credit_scoring_user');

        return false;
    }

    const requiredFields = [
        'userName',
        'roleGroup',
        'email',
        'fullName'
    ];

    const isInvalid = requiredFields.some(function (field) {

        const value = user[field];

        return (
            value === null ||
            value === undefined ||
            String(value).trim() === ''
        );

    });

    if (isInvalid) {

        localStorage.removeItem('credit_scoring_user');

        return false;
    }

    // Đã đăng nhập và user hợp lệ
    window.location.href = 'index.html';

    return true;
}