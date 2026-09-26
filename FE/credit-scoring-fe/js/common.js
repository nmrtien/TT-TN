function goToPage(page) {
    const isInPages = window.location.pathname.includes('/pages/');
    location.href = isInPages ? page : `pages/${page}`;
}

function shell(active, title, subtitle) {

    // =========================================================
    // LẤY USER ĐANG LOGIN
    // =========================================================

    const userData =
        localStorage.getItem('credit_scoring_user');

    let user = {};

    try {

        user = userData
            ? JSON.parse(userData)
            : {};

    } catch (error) {

        console.error(
            'Không parse được credit_scoring_user:',
            error
        );

        user = {};
    }


    const roleGroup =
        String(user?.roleGroup || '')
            .trim()
            .toUpperCase();


    // =========================================================
    // PHÂN QUYỀN
    // =========================================================

    const isRBAM =
        roleGroup === 'RB_AM';

    const isRBRM =
        roleGroup === 'RB_RM';


    // =========================================================
    // CLICK CÁC MENU CẦN PHÂN QUYỀN
    // =========================================================

    function handleRestrictedClick(event) {

        event.preventDefault();
        event.stopPropagation();


        const target =
            event.currentTarget;

        if (!target) {
            return;
        }


        const targetType =
            target.dataset.permissionTarget;


        // =====================================================
        // NGƯỜI DÙNG
        // CHỈ RB_AM
        // =====================================================

        if (
            targetType === 'users' &&
            !isRBAM
        ) {

            showPermissionToast();

            return;
        }


        // =====================================================
        // KHỞI TẠO HỒ SƠ
        // CHỈ RB_RM
        // =====================================================

        if (
            targetType === 'create-dossier' &&
            !isRBRM
        ) {

            showPermissionToast();

            return;
        }


        // =====================================================
        // CÂU HỎI
        // CHỈ RB_AM
        // =====================================================

        if (
            targetType === 'questions' &&
            !isRBAM
        ) {

            showPermissionToast();

            return;
        }


        // =====================================================
        // MÔ HÌNH
        // CHỈ RB_AM
        // =====================================================

        if (
            targetType === 'models' &&
            !isRBAM
        ) {

            showPermissionToast();

            return;
        }


        // =====================================================
        // ĐƯỢC PHÉP THỰC HIỆN
        // =====================================================

        switch (targetType) {

            // -------------------------------------------------
            // NGƯỜI DÙNG
            // -------------------------------------------------

            case 'users':

                loadUsersPage();

                break;


            // -------------------------------------------------
            // KHỞI TẠO HỒ SƠ
            // -------------------------------------------------

            case 'create-dossier':

                loadCreateDossierPage();

                break;


            // -------------------------------------------------
            // CÂU HỎI
            // -------------------------------------------------

            case 'questions':

                loadQuestionsPage();

                break;


            // -------------------------------------------------
            // MÔ HÌNH
            // -------------------------------------------------

            case 'models':

                loadModelsPage();

                break;


            default:

                console.warn(
                    'Không xác định được permission target:',
                    targetType
                );

                break;
        }
    }


    // =========================================================
    // RENDER SIDEBAR + MAIN
    // =========================================================

    document.getElementById('app').innerHTML = `

        <aside class="sidebar">

            <div class="brand">
                CREDIT SCORING
            </div>


            <!-- =================================================
                 TỔNG QUAN
                 TẤT CẢ ROLE ĐỀU ĐƯỢC PHÉP
                 ================================================= -->

            <div
                class="nav-item ${
                    active === 'dashboard'
                        ? 'active'
                        : ''
                }"
                id="navDashboard"
                onclick="
                    event.stopPropagation();
                    window.location.href='../index.html'
                "
            >

                <span class="nav-icon">
                    ⌂
                </span>

                <span>
                    Tổng quan
                </span>

            </div>


            <!-- =================================================
                 HỒ SƠ CHẤM ĐIỂM
                 ================================================= -->

            <div
                class="nav-group ${
                    [
                        'create-dossier',
                        'unassigned-dossiers',
                        'processing-dossiers',
                        'approved-dossiers',
                        'rejected-dossiers',
                        'closed-dossiers'
                    ].includes(active)
                        ? 'open'
                        : ''
                }"
            >

                <div
                    class="nav-item nav-parent"
                    onclick="toggleGroup(this)"
                >

                    <span class="nav-icon">
                        ▤
                    </span>

                    <span class="nav-text">
                        Hồ sơ chấm điểm
                    </span>

                    <span class="nav-arrow">
                        ›
                    </span>

                </div>


                <div class="nav-children">


                    <!-- =================================================
                         KHỞI TẠO HỒ SƠ
                         CHỈ RB_RM
                         ================================================= -->

                    <div
                        class="nav-child ${
                            active === 'create-dossier'
                                ? 'active'
                                : ''
                        }"
                        data-permission-target="create-dossier"
                        id="navCreateDossier"
                    >

                        <span class="child-dot">
                            •
                        </span>

                        <span>
                            Khởi tạo Hồ sơ
                        </span>

                    </div>


                    <!-- =================================================
                         HỒ SƠ CHƯA PHÂN CÔNG
                         TẤT CẢ ROLE
                         ================================================= -->

                    <div
                        class="nav-child ${
                            active === 'unassigned-dossiers'
                                ? 'active'
                                : ''
                        }"
                        onclick="
                            event.stopPropagation();
                            loadUnassignedDossiersPage()
                        "
                    >

                        <span class="child-dot">
                            •
                        </span>

                        <span>
                            Hồ sơ Chưa phân công
                        </span>

                    </div>


                    <!-- =================================================
                         HỒ SƠ ĐANG XỬ LÝ
                         TẤT CẢ ROLE
                         ================================================= -->

                    <div
                        class="nav-child ${
                            active === 'processing-dossiers'
                                ? 'active'
                                : ''
                        }"
                        onclick="
                            event.stopPropagation();
                            loadInprogressDossiersPage()
                        "
                    >

                        <span class="child-dot">
                            •
                        </span>

                        <span>
                            Hồ sơ Đang xử lý
                        </span>

                    </div>


                    <!-- =================================================
                         HỒ SƠ ĐÃ ĐƯỢC DUYỆT
                         TẤT CẢ ROLE
                         ================================================= -->

                    <div
                        class="nav-child ${
                            active === 'approved-dossiers'
                                ? 'active'
                                : ''
                        }"
                        onclick="
                            event.stopPropagation();
                            loadApprovedDossiersPage()
                        "
                    >

                        <span class="child-dot">
                            •
                        </span>

                        <span>
                            Hồ sơ Đã được duyệt
                        </span>

                    </div>


                    <!-- =================================================
                         HỒ SƠ BỊ TỪ CHỐI
                         TẤT CẢ ROLE
                         ================================================= -->

                    <div
                        class="nav-child ${
                            active === 'rejected-dossiers'
                                ? 'active'
                                : ''
                        }"
                        onclick="
                            event.stopPropagation();
                            loadRejectedDossiersPage()
                        "
                    >

                        <span class="child-dot">
                            •
                        </span>

                        <span>
                            Hồ sơ Bị từ chối
                        </span>

                    </div>


                    <!-- =================================================
                         HỒ SƠ ĐÃ ĐÓNG
                         TẤT CẢ ROLE
                         ================================================= -->

                    <div
                        class="nav-child ${
                            active === 'closed-dossiers'
                                ? 'active'
                                : ''
                        }"
                        onclick="
                            event.stopPropagation();
                            loadClosedDossiersPage()
                        "
                    >

                        <span class="child-dot">
                            •
                        </span>

                        <span>
                            Hồ sơ Đã bị đóng
                        </span>

                    </div>

                </div>

            </div>


            <!-- =================================================
                 NGƯỜI DÙNG
                 CHỈ RB_AM
                 ================================================= -->

            <div
                class="nav-item ${
                    active === 'users'
                        ? 'active'
                        : ''
                }"
                data-permission-target="users"
                id="navUserManagement"
            >

                <span class="nav-icon">
                    🪪
                </span>

                <span>
                    Người dùng
                </span>

            </div>


            <!-- =================================================
                 CẤU HÌNH HỆ THỐNG
                 CHỈ RB_AM
                 ================================================= -->

            <div
                class="nav-group ${
                    active === 'questions' ||
                    active === 'models'
                        ? 'open'
                        : ''
                }"
            >

                <div
                    class="nav-item nav-parent"
                    onclick="toggleGroup(this)"
                >

                    <span class="nav-icon">
                        ⚙
                    </span>

                    <span class="nav-text">
                        Cấu hình hệ thống
                    </span>

                    <span class="nav-arrow">
                        ›
                    </span>

                </div>


                <div class="nav-children">


                    <!-- =================================================
                         CÂU HỎI
                         CHỈ RB_AM
                         ================================================= -->

                    <div
                        class="nav-child ${
                            active === 'questions'
                                ? 'active'
                                : ''
                        }"
                        data-permission-target="questions"
                        id="navQuestions"
                    >

                        <span class="child-dot">
                            •
                        </span>

                        <span>
                            Câu hỏi
                        </span>

                    </div>


                    <!-- =================================================
                         MÔ HÌNH
                         CHỈ RB_AM
                         ================================================= -->

                    <div
                        class="nav-child ${
                            active === 'models'
                                ? 'active'
                                : ''
                        }"
                        data-permission-target="models"
                        id="navModels"
                    >

                        <span class="child-dot">
                            •
                        </span>

                        <span>
                            Mô hình
                        </span>

                    </div>

                </div>

            </div>

        </aside>


        <!-- =====================================================
             MAIN
             ===================================================== -->

        <main class="main">

            <header class="topbar">

                <div class="user">

                    <span>
                        🔔
                    </span>


                    <div class="avatar">

                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >

                            <circle
                                cx="12"
                                cy="8"
                                r="4"
                            ></circle>

                            <path
                                d="M4 21c0-4 3.5-7 8-7s8 3 8 7"
                            ></path>

                        </svg>

                    </div>


                    <div>

                        <b id="userFullName"></b>

                        <small
                            id="userRoleGroup"
                            style="
                                display:block;
                                color:#71819a
                            "
                        ></small>

                    </div>


                    <button
                        type="button"
                        id="logoutButton"
                        class="logout-button"
                        title="Đăng xuất"
                        aria-label="Đăng xuất"
                    >

                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >

                            <path
                                d="M10 17l5-5-5-5"
                            ></path>

                            <path
                                d="M15 12H3"
                            ></path>

                            <path
                                d="
                                    M19 3h-6v2h6v14h-6v2h6
                                    c1.1 0 2-.9 2-2V5
                                    c0-1.1-.9-2-2-2z
                                "
                            ></path>

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


                <div id="page-content"></div>

            </section>

        </main>
    `;


    // =========================================================
    // HIỂN THỊ USER
    // =========================================================

    const fullNameElement =
        document.getElementById('userFullName');

    const roleGroupElement =
        document.getElementById('userRoleGroup');


    if (fullNameElement) {

        fullNameElement.textContent =
            user?.fullName || '';

    }


    if (roleGroupElement) {

        roleGroupElement.textContent =
            user?.roleGroup || '';

    }


    // =========================================================
    // REGISTER RESTRICTED EVENTS
    // =========================================================

    // Người dùng - chỉ RB_AM
    document
        .getElementById('navUserManagement')
        ?.addEventListener(
            'click',
            handleRestrictedClick
        );


    // Khởi tạo Hồ sơ - chỉ RB_RM
    document
        .getElementById('navCreateDossier')
        ?.addEventListener(
            'click',
            handleRestrictedClick
        );


    // Câu hỏi - chỉ RB_AM
    document
        .getElementById('navQuestions')
        ?.addEventListener(
            'click',
            handleRestrictedClick
        );


    // Mô hình - chỉ RB_AM
    document
        .getElementById('navModels')
        ?.addEventListener(
            'click',
            handleRestrictedClick
        );


    // =========================================================
    // LOGOUT
    // =========================================================

    document
        .getElementById('logoutButton')
        ?.addEventListener(
            'click',
            function () {

                localStorage.removeItem(
                    'credit_scoring_user'
                );

                window.location.href =
                    'login.html';

            }
        );
}


function isRoleAllowed(requiredRole) {

    try {

        const userData =
            localStorage.getItem('credit_scoring_user');

        if (!userData) {
            return false;
        }

        const user = JSON.parse(userData);

        const roleGroup =
            String(user?.roleGroup || '')
                .trim()
                .toUpperCase();

        return roleGroup === requiredRole;

    } catch (error) {

        console.error(
            'Không đọc được thông tin user:',
            error
        );

        return false;
    }
}


function showPermissionToast() {

    const existingToast =
        document.getElementById('permissionToast');

    if (existingToast) {
        existingToast.remove();
    }


    const toast =
        document.createElement('div');

    toast.id = 'permissionToast';

    toast.className =
        'permission-toast';


    toast.innerHTML = `
        <span class="permission-toast-icon">
            !
        </span>

        <span>
            Bạn không được cấp quyền để sử dụng các chức năng này
        </span>
    `;


    document.body.appendChild(toast);


    requestAnimationFrame(() => {

        toast.classList.add('show');

    });


    setTimeout(() => {

        toast.classList.remove('show');

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);
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