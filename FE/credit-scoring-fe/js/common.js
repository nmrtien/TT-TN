function goToPage(page) {
    const isInPages = window.location.pathname.includes('/pages/');
    location.href = isInPages ? page : `pages/${page}`;
}

function shell(active, title, subtitle) {
    document.getElementById('app').innerHTML = `
        <aside class="sidebar">
            <div class="brand">CREDIT SCORING</div>

            <div class="nav-item ${active === 'dashboard' ? 'active' : ''}"
                 onclick="location.href='../index.html'">
                <span class="nav-icon">⌂</span>
                <span>Tổng quan</span>
            </div>

            <div class="nav-item ${active === 'users' ? 'active' : ''}" onclick="event.stopPropagation(); loadUsersPage()">
    <span class="nav-icon">🪪</span>
    <span>Người dùng</span>
</div>

            <!-- HỒ SƠ CHẤM ĐIỂM -->
            <div class="nav-group ${['create-dossier', 'unassigned-dossiers', 'processing-dossiers', 'approved-dossiers', 'rejected-dossiers', 'closed-dossiers'].includes(active) ? 'open' : ''}">

                <div class="nav-item nav-parent"
                     onclick="toggleGroup(this)">
                    <span class="nav-icon">▤</span>
                    <span class="nav-text">Hồ sơ chấm điểm</span>
                    <span class="nav-arrow">›</span>
                </div>

                <div class="nav-children">

                    <div class="nav-child ${active === 'create-dossier' ? 'active' : ''}"
                         onclick="event.stopPropagation(); loadCreateDossierPage()">
                        <span class="child-dot">•</span>
                        <span>Khởi tạo Hồ sơ</span>
                    </div>

                    <div class="nav-child ${active === 'unassigned-dossiers' ? 'active' : ''}"
                         onclick="event.stopPropagation(); loadUnassignedDossiersPage()">
                        <span class="child-dot">•</span>
                        <span>Hồ sơ Chưa phân công</span>
                    </div>

                    <div class="nav-child ${active === 'processing-dossiers' ? 'active' : ''}"
                         onclick="event.stopPropagation(); loadInprogressDossiersPage()">
                        <span class="child-dot">•</span>
                        <span>Hồ sơ Đang xử lý</span>
                    </div>

                    <div class="nav-child ${active === 'approved-dossiers' ? 'active' : ''}"
                         onclick="event.stopPropagation(); location.href='dossiers-approved.html'">
                        <span class="child-dot">•</span>
                        <span>Hồ sơ Đã được duyệt</span>
                    </div>

                    <div class="nav-child ${active === 'rejected-dossiers' ? 'active' : ''}"
                         onclick="event.stopPropagation(); location.href='dossiers-rejected.html'">
                        <span class="child-dot">•</span>
                        <span>Hồ sơ Bị từ chối</span>
                    </div>

                    <div class="nav-child ${active === 'closed-dossiers' ? 'active' : ''}"
                         onclick="event.stopPropagation(); location.href='dossiers-closed.html'">
                        <span class="child-dot">•</span>
                        <span>Hồ sơ Đã bị đóng</span>
                    </div>

                </div>
            </div>

                   

            <!-- CẤU HÌNH HỆ THỐNG -->
            <div class="nav-group ${active === 'questions' || active === 'models' ? 'open' : ''}">

                <div class="nav-item nav-parent"
                     onclick="toggleGroup(this)">
                    <span class="nav-icon">⚙</span>
                    <span class="nav-text">Cấu hình hệ thống</span>
                    <span class="nav-arrow">›</span>
                </div>

                <div class="nav-children">

                    <div class="nav-child ${active === 'questions' ? 'active' : ''}"
     onclick="event.stopPropagation(); loadQuestionsPage()">
    <span class="child-dot">•</span>
    <span>Câu hỏi</span>
</div>

                    <div class="nav-child ${active === 'models' ? 'active' : ''}"
                         onclick="event.stopPropagation(); loadModelsPage()">
                        <span class="child-dot">•</span>
                        <span>Mô hình</span>
                    </div>

                </div>
            </div>

     


        </aside>

        <main class="main">

            <header class="topbar">

            
                <div class="user">
                    <span>🔔</span>

                    <div class="avatar">
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"></path>
    </svg>
</div>

                    <div>
    <b id="userFullName"></b>

    <small
        id="userRoleGroup"
        style="display:block;color:#71819a"
    ></small>
</div>

<button
    type="button"
    id="logoutButton"
    class="logout-button"
    title="Đăng xuất"
    aria-label="Đăng xuất"
>
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 17l5-5-5-5"></path>
        <path d="M15 12H3"></path>
        <path d="M19 3h-6v2h6v14h-6v2h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
    </svg>
</button>
                </div>

            </header>

            <section class="content">

                <div class="page-title">
                    <div>
                        <h1></h1>
                        <p></p>
                    </div>
                </div>

                <div id="page-content">
                
                </div>


            </section>

            

        </main>
    `;

    const userData = localStorage.getItem('credit_scoring_user');

if (userData) {
    const user = JSON.parse(userData);

    document.getElementById('userFullName').textContent = user.fullName;
    document.getElementById('userRoleGroup').textContent = user.roleGroup;
}

document.getElementById('logoutButton')?.addEventListener('click', function () {
    localStorage.removeItem('credit_scoring_user');
    window.location.href = 'login.html';
});
}


function toggleGroup(element) {
    const group = element.closest('.nav-group');
    if (group) {
        group.classList.toggle('open');
    }
}


function toggleSystemConfig() {
    const group = document.querySelector('.nav-group');

    if (group) {
        group.classList.toggle('open');
    }
}


function statusBadge(status) {

    const map = {
        'Đang xử lý': 'orange',
        'Đã hoàn tất': 'green',
        'Đã phê duyệt': 'purple',
        'Đang chấm điểm': 'blue',
        'Bị đóng': 'red'
    };

    return `
        <span class="badge ${map[status] || 'blue'}">
            ● ${status}
        </span>
    `;
}


function setPageHeader(title, subtitle) {
    const titleElement = document.querySelector('.page-title h1');
    const subtitleElement = document.querySelector('.page-title p');

    if (titleElement) {
        titleElement.textContent = title;
    }

    if (subtitleElement) {
        subtitleElement.textContent = subtitle;
    }
}


function checkAuthentication() {

    const userData = localStorage.getItem('credit_scoring_user');

    // ========================================
    // 1. Chưa đăng nhập
    // ========================================

    if (!userData) {
        window.location.href = 'login.html';
        return false;
    }


    // ========================================
    // 2. Parse dữ liệu user
    // ========================================

    let user;

    try {

        user = JSON.parse(userData);

    } catch (error) {

        console.error(
            'Invalid credit_scoring_user data:',
            error
        );

        localStorage.removeItem('credit_scoring_user');

        window.location.href = 'login.html';

        return false;
    }


    // ========================================
    // 3. Kiểm tra user object
    // ========================================

    if (
        !user ||
        typeof user !== 'object' ||
        Array.isArray(user)
    ) {

        localStorage.removeItem('credit_scoring_user');

        window.location.href = 'login.html';

        return false;
    }


    // ========================================
    // 4. Các thông tin bắt buộc
    // ========================================

    const requiredFields = [
        'userName',
        'roleGroup',
        'email',
        'fullName'
    ];


    // ========================================
    // 5. Kiểm tra từng field
    // ========================================

    const isInvalid = requiredFields.some(function (field) {

        const value = user[field];

        return (
            value === null ||
            value === undefined ||
            String(value).trim() === ''
        );

    });


    // ========================================
    // 6. User không hợp lệ
    // ========================================

    if (isInvalid) {

        localStorage.removeItem('credit_scoring_user');

        window.location.href = 'login.html';

        return false;
    }


    // ========================================
    // 7. User hợp lệ
    // ========================================

    return true;
}


document.getElementById('logoutButton')?.addEventListener('click', function () {
    localStorage.removeItem('credit_scoring_user');
    window.location.href = 'login.html';
});