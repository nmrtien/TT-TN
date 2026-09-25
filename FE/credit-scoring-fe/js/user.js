let users = [];
let selectedUser = null;
let formModeUser = null;

function loadUsersPage() {

    setPageHeader(
        'Quản lý người dùng',
        'Quản lý danh sách người dùng chấm điểm tín dụng'
    );

    document.getElementById('page-content').innerHTML = `

        <section class="content">

            <div class="page-title">
                <div class="page-actions">

                    <button
                        type="button"
                        id="btnCreateUser"
                        class="btn btn-primary">

                        <span class="btn-icon-text">＋</span>
                        Tạo người dùng

                    </button>

                </div>
            </div>


            <div class="content-card">

                <!-- HEADER -->
                <div class="card-header">

                    <div>

                        <h2>Danh sách người dùng</h2>

                        <p>
                            Tổng số:
                            <strong id="userCount">0</strong>
                            người dùng
                        </p>

                    </div>


                    <div class="card-header-actions">

                        <button
                            type="button"
                            id="btnRefresh"
                            class="btn btn-secondary btn-sm">

                            ↻
                            Làm mới

                        </button>

                    </div>

                </div>


                <!-- TABLE -->
                <div class="table-wrapper">

                    <table class="user-table">

                        <thead>

                            <tr>

                                <th class="col-stt">
                                    STT
                                </th>

                                <th class="col-id">
                                    ID
                                </th>

                                <th>
                                    Tên đăng nhập
                                </th>

                                <th>
                                    Họ và tên
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Số điện thoại
                                </th>

                                <th>
                                    Nhóm quyền
                                </th>

                                <th>
                                    Trạng thái
                                </th>

                                <th class="col-action">
                                    Thao tác
                                </th>

                            </tr>

                        </thead>


                        <tbody id="userTableBody">
                            <!-- JavaScript render -->
                        </tbody>

                    </table>

                </div>


                <!-- EMPTY STATE -->
                <div
                    id="emptyState"
                    class="empty-state hidden">

                    <div class="empty-icon">
                        ?
                    </div>

                    <div class="empty-title">
                        Chưa có người dùng
                    </div>

                    <div class="empty-description">
                        Hiện tại chưa có người dùng nào trong hệ thống.
                    </div>

                </div>


                <!-- PAGINATION -->
                <div class="pagination">

                    <div class="pagination-list">

                        <button
                            type="button"
                            class="page-btn"
                            disabled>

                            ‹

                        </button>


                        <button
                            type="button"
                            class="page-btn active">

                            1

                        </button>


                        <button
                            type="button"
                            class="page-btn"
                            disabled>

                            ›

                        </button>

                    </div>

                </div>

            </div>

        </section>


        <!-- =====================================================
             CREATE / UPDATE MODAL
             ===================================================== -->

        <div
            id="userFormModal"
            class="modal-overlay hidden">

            <div
                class="modal user-modal"
                role="dialog">

                <div class="modal-header">

                    <div>

                        <h2 id="formModalTitle">
                            Tạo người dùng
                        </h2>

                        <p id="formModalDescription">
                            Nhập thông tin người dùng mới
                        </p>

                    </div>


                    <button
                        type="button"
                        class="modal-close"
                        id="btnCloseUserFormModal">

                        ×

                    </button>

                </div>


                <form id="userForm">

                    <div class="modal-body">

                        <div
                            id="formError"
                            class="alert alert-danger hidden">
                        </div>


                        <!-- ID -->

                        <div
                            id="idFormGroup"
                            class="form-group hidden">

                            <label class="form-label">
                                ID
                            </label>

                            <input
                                type="text"
                                id="userId"
                                class="form-control readonly-field"
                                readonly>

                        </div>


                        <!-- USERNAME -->

                        <div class="form-group">

                            <label
                                for="userName"
                                class="form-label">

                                Tên đăng nhập
                                <span class="required">*</span>

                            </label>

                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                class="form-control"
                                maxlength="100"
                                autocomplete="off"
                                placeholder="Ví dụ: tiennv9"
                                required>

                        </div>


                        <!-- FULL NAME -->

                        <div class="form-group">

                            <label
                                for="fullName"
                                class="form-label">

                                Họ và tên
                                <span class="required">*</span>

                            </label>

                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                class="form-control"
                                maxlength="255"
                                placeholder="Ví dụ: Nguyen Van Tien"
                                required>

                        </div>


                        <!-- EMAIL -->

                        <div class="form-group">

                            <label
                                for="email"
                                class="form-label">

                                Email
                                <span class="required">*</span>

                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                class="form-control"
                                maxlength="255"
                                placeholder="Ví dụ: tiennv9@gmail.com"
                                required>

                        </div>


                        <!-- PHONE -->

                        <div class="form-group">

                            <label
                                for="phone"
                                class="form-label">

                                Số điện thoại
                                <span class="required">*</span>

                            </label>

                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                class="form-control"
                                maxlength="20"
                                placeholder="Ví dụ: 0965563883"
                                required>

                        </div>


                        <!-- BIRTHDAY -->

                        <div class="form-group">

                            <label
                                for="birthday"
                                class="form-label">

                                Ngày sinh
                                <span class="required">*</span>

                            </label>

                            <input
                                type="text"
                                id="birthday"
                                name="birthday"
                                class="form-control"
                                maxlength="10"
                                placeholder="dd/MM/yyyy"
                                required>

                        </div>


                        <!-- POSITION -->

                        <div class="form-group">

                            <label
                                for="position"
                                class="form-label">

                                Chức vụ
                                <span class="required">*</span>

                            </label>

                            <input
                                type="text"
                                id="position"
                                name="position"
                                class="form-control"
                                maxlength="255"
                                placeholder="Ví dụ: Director"
                                required>

                        </div>


                
                        <!-- ROLE GROUP -->

                        <div class="form-group">

                            <label
                                for="roleGroup"
                                class="form-label">

                                Nhóm quyền
                                <span class="required">*</span>

                            </label>

                            <select
                                id="roleGroup"
                                name="roleGroup"
                                class="form-control"
                                required>

                                <option value="RB_RM">
                                    RB_RM
                                </option>

                                <option value="RB_CA">
                                    RB_CA
                                </option>

                                <option value="RB_AM">
                                    RB_AM
                                </option>

                            </select>

                    </div>


                        <!-- STATUS -->

                        <div class="form-group">

                            <label
                                for="status"
                                class="form-label">

                                Trạng thái
                                <span class="required">*</span>

                            </label>

                            <select
                                id="status"
                                name="status"
                                class="form-control"
                                required>

                                <option value="A">
                                    Hoạt động
                                </option>

                                <option value="I">
                                    Không hoạt động
                                </option>

                            </select>

                        </div>

                    </div>


                    <div class="modal-footer">

                        <button
                            type="button"
                            id="btnCancelForm"
                            class="btn btn-secondary">

                            Hủy

                        </button>


                        <button
                            type="submit"
                            id="btnSubmitUser"
                            class="btn btn-primary">

                            Tạo mới

                        </button>

                    </div>

                </form>

            </div>

        </div>


        <!-- =====================================================
             DETAIL MODAL
             ===================================================== -->

        <div
            id="userDetailModal"
            class="modal-overlay hidden">

            <div class="modal user-modal">

                <div class="modal-header">

                    <div>

                        <h2>
                            Chi tiết người dùng
                        </h2>

                        <p>
                            Xem và cập nhật thông tin người dùng
                        </p>

                    </div>


                    <button
                        type="button"
                        class="modal-close"
                        id="btnCloseUserDetailModal">

                        ×

                    </button>

                </div>


                <div class="modal-body">

                    <div id="detailLoading">
                        Đang tải thông tin người dùng...
                    </div>


                    <div
                        id="detailContent"
                        class="hidden">


                        <!-- ID -->

                        <div class="form-group">

                            <label for="detailId">
                                ID
                            </label>

                            <input
                                type="text"
                                id="detailId"
                                class="form-control readonly-field"
                                readonly>

                        </div>


                        <!-- USERNAME -->

                        <div class="form-group">

                            <label for="detailUserName">
                                Tên đăng nhập
                            </label>

                            <input
                                type="text"
                                id="detailUserName"
                                class="form-control readonly-field"
                                readonly>

                        </div>


                        <!-- FULL NAME -->

                        <div class="form-group">

                            <label for="detailFullName">
                                Họ và tên
                            </label>

                            <input
                                type="text"
                                id="detailFullName"
                                class="form-control">

                        </div>


                        <!-- EMAIL -->

                        <div class="form-group">

                            <label for="detailEmail">
                                Email
                            </label>

                            <input
                                type="email"
                                id="detailEmail"
                                class="form-control">

                        </div>


                        <!-- PHONE -->

                        <div class="form-group">

                            <label for="detailPhone">
                                Số điện thoại
                            </label>

                            <input
                                type="text"
                                id="detailPhone"
                                class="form-control">

                        </div>


                        <!-- BIRTHDAY -->

                        <div class="form-group">

                            <label for="detailBirthday">
                                Ngày sinh
                            </label>

                            <input
                                type="text"
                                id="detailBirthday"
                                class="form-control"
                                placeholder="dd/MM/yyyy">

                        </div>


                        <!-- POSITION -->

                        <div class="form-group">

                            <label for="detailPosition">
                                Chức vụ
                            </label>

                            <input
                                type="text"
                                id="detailPosition"
                                class="form-control">

                        </div>


                        <!-- ROLE GROUP -->

                        <div class="form-group">

                            <label for="detailRoleGroup">
                                Nhóm quyền
                            </label>

                            <select
                                id="detailRoleGroup"
                                class="form-control">

                                <option value="RB_RM">
                                    RB_RM
                                </option>

                                <option value="RB_CA">
                                    RB_CA
                                </option>

                                <option value="RB_AM">
                                    RB_AM
                                </option>

                            </select>

                        </div>


                        <!-- STATUS -->

                        <div class="form-group">

                            <label for="detailStatus">
                                Trạng thái
                            </label>

                            <select
                                id="detailStatus"
                                class="form-control">

                                <option value="A">
                                    Hoạt động
                                </option>

                                <option value="I">
                                    Không hoạt động
                                </option>

                            </select>

                        </div>

                    </div>

                </div>


                <div class="modal-footer">

                    <button
                        type="button"
                        id="btnCloseUserDetail"
                        class="btn btn-secondary">

                        Đóng

                    </button>


                    <button
                        type="button"
                        id="btnSaveUserDetail"
                        class="btn btn-primary">

                        Lưu thay đổi

                    </button>

                </div>

            </div>

        </div>


        <!-- =====================================================
             TOAST
             ===================================================== -->

        <div
            id="toast"
            class="toast hidden">

            <span id="toastMessage"></span>

        </div>

    `;

    registerUserEvents();

    loadUsers();
}


// ===============================
// DOM EVENTS
// ===============================

function registerUserEvents() {

    // ==========================================
    // TẠO NGƯỜI DÙNG
    // ==========================================

    const btnCreateUser =
        document.getElementById('btnCreateUser');

    if (btnCreateUser) {
        btnCreateUser.addEventListener(
            'click',
            openCreateUserModal
        );
    }


    // ==========================================
    // FORM TẠO / CẬP NHẬT
    // ==========================================

    const userForm =
        document.getElementById('userForm');

    if (userForm) {
        userForm.addEventListener(
            'submit',
            handleUserFormSubmit
        );
    }


    // ==========================================
    // ĐÓNG FORM - NÚT X
    // ==========================================

    const btnCloseUserFormModal =
        document.getElementById('btnCloseUserFormModal');

    if (btnCloseUserFormModal) {
        btnCloseUserFormModal.addEventListener(
            'click',
            closeUserFormModal
        );
    }


    // ==========================================
    // ĐÓNG FORM - NÚT HỦY
    // ==========================================

    const btnCancelForm =
        document.getElementById('btnCancelForm');

    if (btnCancelForm) {
        btnCancelForm.addEventListener(
            'click',
            closeUserFormModal
        );
    }


    // ==========================================
    // REFRESH
    // ==========================================

    const btnRefresh =
        document.getElementById('btnRefresh');

    if (btnRefresh) {
        btnRefresh.addEventListener(
            'click',
            loadUsers
        );
    }


    // ==========================================
    // DETAIL - NÚT X
    // ==========================================

    const btnCloseUserDetailModal =
        document.getElementById('btnCloseUserDetailModal');

    if (btnCloseUserDetailModal) {
        btnCloseUserDetailModal.addEventListener(
            'click',
            closeUserDetailModal
        );
    }


    // ==========================================
    // DETAIL - NÚT ĐÓNG
    // ==========================================

    const btnCloseUserDetail =
        document.getElementById('btnCloseUserDetail');

    if (btnCloseUserDetail) {
        btnCloseUserDetail.addEventListener(
            'click',
            closeUserDetailModal
        );
    }


    // ==========================================
    // DETAIL - LƯU THAY ĐỔI
    // ==========================================

    const btnSaveUserDetail =
        document.getElementById('btnSaveUserDetail');

    if (btnSaveUserDetail) {
        btnSaveUserDetail.addEventListener(
            'click',
            handleUserDetailSave
        );
    }


    // ==========================================
    // CLICK RA NGOÀI FORM MODAL
    // ==========================================

    const userFormModal =
        document.getElementById('userFormModal');

    if (userFormModal) {

        userFormModal.addEventListener(
            'click',
            function (event) {

                if (event.target === userFormModal) {
                    closeUserFormModal();
                }

            }
        );

    }


    // ==========================================
    // CLICK RA NGOÀI DETAIL MODAL
    // ==========================================

    const userDetailModal =
        document.getElementById('userDetailModal');

    if (userDetailModal) {

        userDetailModal.addEventListener(
            'click',
            function (event) {

                if (event.target === userDetailModal) {
                    closeUserDetailModal();
                }

            }
        );

    }


    // ==========================================
    // ESC - ĐÓNG MODAL
    // ==========================================

    document.addEventListener(
        'keydown',
        function (event) {

            if (event.key !== 'Escape') {
                return;
            }


            const formModal =
                document.getElementById('userFormModal');

            const detailModal =
                document.getElementById('userDetailModal');


            if (
                formModal &&
                formModal.classList.contains('show')
            ) {
                closeUserFormModal();
            }


            if (
                detailModal &&
                detailModal.classList.contains('show')
            ) {
                closeUserDetailModal();
            }

        }
    );

}


async function handleUserDetailSave() {

    if (!selectedUser) {
        return;
    }

    const id =
        document.getElementById('detailId').value;

    const userName =
        document.getElementById('detailUserName')
            .value.trim();

    const fullName =
        document.getElementById('detailFullName')
            .value.trim();

    const email =
        document.getElementById('detailEmail')
            .value.trim();

    const phone =
        document.getElementById('detailPhone')
            .value.trim();

    const birthday =
        document.getElementById('detailBirthday')
            .value.trim();

    const position =
        document.getElementById('detailPosition')
            .value.trim();

    const roleGroup =
        document.getElementById('detailRoleGroup')
            .value.trim();

    const status =
        document.getElementById('detailStatus').value;


    // ===============================
    // VALIDATE
    // ===============================

    if (!userName) {
        showUserToast(
            'Vui lòng nhập tên đăng nhập',
            'error'
        );
        return;
    }

    if (!fullName) {
        showUserToast(
            'Vui lòng nhập họ và tên',
            'error'
        );
        return;
    }

    if (!email) {
        showUserToast(
            'Vui lòng nhập email',
            'error'
        );
        return;
    }

    if (!phone) {
        showUserToast(
            'Vui lòng nhập số điện thoại',
            'error'
        );
        return;
    }

    if (!birthday) {
        showUserToast(
            'Vui lòng nhập ngày sinh',
            'error'
        );
        return;
    }

    if (!position) {
        showUserToast(
            'Vui lòng nhập chức vụ',
            'error'
        );
        return;
    }

    if (!roleGroup) {
        showUserToast(
            'Vui lòng nhập nhóm quyền',
            'error'
        );
        return;
    }


    // ===============================
    // SAVE
    // ===============================

    const btnSaveUserDetail =
        document.getElementById('btnSaveUserDetail');

    try {

        if (btnSaveUserDetail) {
            btnSaveUserDetail.disabled = true;
            btnSaveUserDetail.textContent = 'Đang lưu...';
        }

        await updateUser({
            id: id,
            userName: userName,
            fullName: fullName,
            email: email,
            phone: phone,
            birthday: birthday,
            position: position,
            roleGroup: roleGroup,
            status: status
        });


        // ===============================
        // CẬP NHẬT OBJECT HIỆN TẠI
        // ===============================

        selectedUser.userName = userName;
        selectedUser.fullName = fullName;
        selectedUser.email = email;
        selectedUser.phone = phone;
        selectedUser.birthday = birthday;
        selectedUser.position = position;
        selectedUser.roleGroup = roleGroup;
        selectedUser.status = status;


        // ===============================
        // ĐÓNG MODAL
        // ===============================

        closeUserDetailModal();


        // ===============================
        // LOAD LẠI DANH SÁCH
        // ===============================

        await loadUsers();


        // ===============================
        // THÔNG BÁO
        // ===============================

        showUserToast(
            'Cập nhật người dùng thành công',
            'success'
        );

    } catch (error) {

        console.error(
            'Update user error:',
            error
        );

        showUserToast(
            error.message ||
            'Cập nhật người dùng thất bại',
            'error'
        );

    } finally {

        if (btnSaveUserDetail) {
            btnSaveUserDetail.disabled = false;
            btnSaveUserDetail.textContent =
                'Lưu thay đổi';
        }
    }
}


// ===============================
// GET ALL Users
// ===============================

async function loadUsers() {
    const tableBody =
        document.getElementById('userTableBody');

    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="table-loading">
                    Đang tải dữ liệu...
                </td>
            </tr>
        `;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/users/api/v1/users`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            const message =
                await getResponseErrorMessage(response);

            throw new Error(
                message ||
                `Không thể lấy danh sách người dùng. HTTP ${response.status}`
            );
        }

        const data = await response.json();

        // Backend trả trực tiếp array
        users = Array.isArray(data)
            ? data
            : [];

        renderUsers();

    } catch (error) {
        console.error(
            'Load users error:',
            error
        );

        users = [];

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="table-empty">
                        Không thể tải danh sách người dùng
                    </td>
                </tr>
            `;
        }

        const userCount =
            document.getElementById('userCount');

        if (userCount) {
            userCount.textContent = '0';
        }

        showUserToast(
            error.message ||
            'Có lỗi xảy ra khi tải danh sách người dùng',
            'error'
        );
    }
}

// ===============================
// RENDER TABLE
// ===============================

function renderUsers() {
    const tableBody =
        document.getElementById('userTableBody');

    const userCount =
        document.getElementById('userCount');

    if (!tableBody) {
        return;
    }

    // Cập nhật tổng số người dùng
    if (userCount) {
        userCount.textContent = users.length;
    }

    // Không có dữ liệu
    if (!users || users.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="table-empty">
                    Không có dữ liệu
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = users.map((user, index) => {
        return `
            <tr>
                <!-- STT -->
                <td class="text-center">
                    ${index + 1}
                </td>

                <!-- ID -->
                <td>
                    <span class="id-text">
                        ${escapeHtml(user.id)}
                    </span>
                </td>

                <!-- TÊN ĐĂNG NHẬP -->
                <td>
                    <strong>
                        ${escapeHtml(user.userName)}
                    </strong>
                </td>

                <!-- HỌ VÀ TÊN -->
                <td>
                    ${escapeHtml(user.fullName)}
                </td>

                <!-- EMAIL -->
                <td>
                    ${escapeHtml(user.email)}
                </td>

                <!-- SỐ ĐIỆN THOẠI -->
                <td>
                    ${escapeHtml(user.phone)}
                </td>

                <!-- NHÓM QUYỀN -->
                <td>
                    ${
                        user.roleGroup
                            ? `
                                <span class="model-badge">
                                    ${escapeHtml(user.roleGroup)}
                                </span>
                              `
                            : `
                                <span class="text-muted">
                                    -
                                </span>
                              `
                    }
                </td>

                <!-- TRẠNG THÁI -->
                <td>
                    ${
                        user.status === 'A'
                            ? `
                                <span class="status-badge status-active">
                                    Hoạt động
                                </span>
                              `
                            : `
                                <span class="status-badge status-inactive">
                                    Không hoạt động
                                </span>
                              `
                    }
                </td>

                <!-- THAO TÁC -->
                <td class="col-action">
                    <div class="table-actions">
                        <button
                            type="button"
                            class="btn-icon btn-view"
                            title="Xem chi tiết"
                            onclick="viewUser('${escapeJs(user.id)}')">
                            ✎
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ===============================
// DETAIL
// ===============================

async function viewUser(id) {
    const modal =
        document.getElementById('userDetailModal');

    const loading =
        document.getElementById('detailLoading');

    const content =
        document.getElementById('detailContent');

    // ===============================
    // MỞ MODAL
    // ===============================

    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('show');
    }

    // ===============================
    // HIỂN THỊ LOADING
    // ===============================

    if (loading) {
        loading.classList.remove('hidden');
        loading.textContent =
            'Đang tải thông tin người dùng...';
    }

    if (content) {
        content.classList.add('hidden');
    }

    try {
        // ===============================
        // CALL API
        // ===============================

        const response = await fetch(
            `${API_BASE_URL}/users/api/v1/users/${encodeURIComponent(id)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            const message =
                await getResponseErrorMessage(response);

            throw new Error(
                message ||
                `Không thể lấy thông tin người dùng. HTTP ${response.status}`
            );
        }

        const user =
            await response.json();

        console.log(
            '========== USER DETAIL =========='
        );

        console.log(
            'API response:',
            user
        );

        // ===============================
        // LƯU USER ĐANG CHỌN
        // ===============================

        selectedUser = user;

        // ===============================
        // RENDER DETAIL
        // ===============================

        renderUserDetail(user);

        // ===============================
        // ẨN LOADING
        // ===============================

        if (loading) {
            loading.classList.add('hidden');
        }

        // ===============================
        // HIỆN CONTENT
        // ===============================

        if (content) {
            content.classList.remove('hidden');
        }

    } catch (error) {
        console.error(
            'Load user detail error:',
            error
        );

        // Hiển thị lỗi trong modal
        if (loading) {
            loading.classList.remove('hidden');
            loading.textContent =
                error.message ||
                'Không thể tải thông tin người dùng';
        }

        if (content) {
            content.classList.add('hidden');
        }

        showUserToast(
            error.message ||
            'Không thể tải thông tin người dùng',
            'error'
        );
    }
}

// ===============================
// RENDER DETAIL
// ===============================

function renderUserDetail(user) {
    const detailId =
        document.getElementById('detailId');

    const detailUserName =
        document.getElementById('detailUserName');

    const detailFullName =
        document.getElementById('detailFullName');

    const detailEmail =
        document.getElementById('detailEmail');

    const detailPhone =
        document.getElementById('detailPhone');

    const detailBirthday =
        document.getElementById('detailBirthday');

    const detailPosition =
        document.getElementById('detailPosition');

    const detailRoleGroup =
        document.getElementById('detailRoleGroup');

    const detailStatus =
        document.getElementById('detailStatus');

    if (detailId) {
        detailId.value = user.id || '';
    }

    if (detailUserName) {
        detailUserName.value = user.userName || '';
    }

    if (detailFullName) {
        detailFullName.value = user.fullName || '';
    }

    if (detailEmail) {
        detailEmail.value = user.email || '';
    }

    if (detailPhone) {
        detailPhone.value = user.phone || '';
    }

    if (detailBirthday) {
        detailBirthday.value = user.birthday || '';
    }

    if (detailPosition) {
        detailPosition.value = user.position || '';
    }

    if (detailRoleGroup) {
        detailRoleGroup.value = user.roleGroup || 'RB_RM';
    }

    if (detailStatus) {
        detailStatus.value = user.status || 'A';
    }
}

// ===============================
// OPEN CREATE
// ===============================

function openCreateUserModal() {
    const modal =
        document.getElementById('userFormModal');

    const form =
        document.getElementById('userForm');

    const title =
        document.getElementById('userFormTitle');

    const userIdGroup =
        document.getElementById('userIdGroup');

    const userId =
        document.getElementById('userId');

    const userName =
        document.getElementById('userName');

    const fullName =
        document.getElementById('fullName');

    const email =
        document.getElementById('email');

    const phone =
        document.getElementById('phone');

    const birthday =
        document.getElementById('birthday');

    const position =
        document.getElementById('position');

    const roleGroup =
        document.getElementById('roleGroup');

    const status =
        document.getElementById('status');

    formModeUser = 'create';
    selectedUser = null;

    if (title) {
        title.textContent = 'Thêm người dùng';
    }

    if (form) {
        form.reset();
    }

    if (userId) {
        userId.value = '';
    }

    if (userIdGroup) {
        userIdGroup.classList.add('hidden');
    }

    if (userName) {
        userName.value = '';
    }


    if (fullName) {
        fullName.value = '';
    }

    if (email) {
        email.value = '';
    }

    if (phone) {
        phone.value = '';
    }

    if (birthday) {
        birthday.value = '';
    }

    if (position) {
        position.value = '';
    }

    if (roleGroup) {
        roleGroup.value = '';
    }

    if (status) {
        status.value = 'A';
    }

    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('show');
    }

    if (userName) {
        setTimeout(() => {
            userName.focus();
        }, 100);
    }
}


// ===============================
// OPEN UPDATE
// ===============================

function editUser(id) {
    const user = users.find(
        item => String(item.id) === String(id)
    );

    if (!user) {
        showUserToast(
            'Không tìm thấy người dùng',
            'error'
        );
        return;
    }

    openUserUpdateModal(user);
}

function openUserUpdateModal(user) {
    const modal =
        document.getElementById('userFormModal');

    const title =
        document.getElementById('userFormTitle');

    const userIdGroup =
        document.getElementById('userIdGroup');

    const userId =
        document.getElementById('userId');

    const userName =
        document.getElementById('userName');

    const fullName =
        document.getElementById('fullName');

    const email =
        document.getElementById('email');

    const phone =
        document.getElementById('phone');

    const birthday =
        document.getElementById('birthday');

    const position =
        document.getElementById('position');

    const roleGroup =
        document.getElementById('roleGroup');

    const status =
        document.getElementById('status');

    formModeUser = 'update';
    selectedUser = user;

    if (title) {
        title.textContent = 'Cập nhật người dùng';
    }

    if (userIdGroup) {
        userIdGroup.classList.remove('hidden');
    }

    if (userId) {
        userId.value = user.id || '';
    }

    if (userName) {
        userName.value = user.userName || '';
    }

    if (fullName) {
        fullName.value = user.fullName || '';
    }

    if (email) {
        email.value = user.email || '';
    }

    if (phone) {
        phone.value = user.phone || '';
    }

    if (birthday) {
        birthday.value = user.birthday || '';
    }

    if (position) {
        position.value = user.position || '';
    }

    if (roleGroup) {
        roleGroup.value = user.roleGroup || '';
    }

    if (status) {
        status.value = user.status || 'A';
    }

    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('show');
    }

    if (userName) {
        setTimeout(() => {
            userName.focus();
        }, 100);
    }
}

// ===============================
// SUBMIT CREATE / UPDATE
// ===============================

async function handleUserFormSubmit(event) {
    event.preventDefault();

    const id =
        document.getElementById('userId').value.trim();

    const userName =
        document.getElementById('userName').value.trim();


    const fullName =
        document.getElementById('fullName').value.trim();

    const email =
        document.getElementById('email').value.trim();

    const phone =
        document.getElementById('phone').value.trim();

    const birthday =
        document.getElementById('birthday').value.trim();

    const position =
        document.getElementById('position').value.trim();

    const roleGroup =
        document.getElementById('roleGroup').value.trim();

    const status =
        document.getElementById('status').value;

    if (!userName) {
        showUserToast(
            'Vui lòng nhập tên đăng nhập',
            'error'
        );
        return;
    }


    if (!fullName) {
        showUserToast(
            'Vui lòng nhập họ và tên',
            'error'
        );
        return;
    }

    if (!email) {
        showUserToast(
            'Vui lòng nhập email',
            'error'
        );
        return;
    }

    if (!phone) {
        showUserToast(
            'Vui lòng nhập số điện thoại',
            'error'
        );
        return;
    }

    if (!birthday) {
        showUserToast(
            'Vui lòng nhập ngày sinh',
            'error'
        );
        return;
    }

    if (!position) {
        showUserToast(
            'Vui lòng nhập chức vụ',
            'error'
        );
        return;
    }

    if (!roleGroup) {
        showUserToast(
            'Vui lòng nhập nhóm quyền',
            'error'
        );
        return;
    }

    const userData = {
        userName: userName,
        fullName: fullName,
        email: email,
        phone: phone,
        birthday: birthday,
        position: position,
        roleGroup: roleGroup,
        status: status
    };


    const submitButton =
        document.getElementById('btnSubmitUser');

    try {
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent =
                formModeUser === 'create'
                    ? 'Đang tạo...'
                    : 'Đang cập nhật...';
        }

        if (formModeUser === 'create') {
            await createUser(userData);

            showUserToast(
                'Tạo người dùng thành công',
                'success'
            );
        } else {
            await updateUser({
                id: id,
                ...userData
            });

            showUserToast(
                'Cập nhật người dùng thành công',
                'success'
            );
        }

        closeUserFormModal();
        await loadUsers();

    } catch (error) {
        console.error(
            'Save user error:',
            error
        );

        showUserToast(
            error.message ||
            'Lưu người dùng thất bại',
            'error'
        );

    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent =
                formModeUser === 'create'
                    ? 'Thêm người dùng'
                    : 'Lưu thay đổi';
        }
    }
}


async function createUser(userData) {
    const response = await fetch(
        `${API_BASE_URL}/users/api/v1/users`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }
    );

    const message = await response.text();
    if (!response.ok) {
        throw new Error(
            message || `Tạo mới người dùng thất bại. HTTP ${response.status}`
        );
    }

    return message;
}

// ===============================
// PUT UPDATE
// ===============================

async function updateUser(userData) {
    const response = await fetch(
        `${API_BASE_URL}/users/api/v1/users`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }
    );

    const message = await response.text();
    if (!response.ok) {
        throw new Error(
            message || `Cập nhật người dùng thất bại. HTTP ${response.status}`
        );
    }

    return message;
}

// ===============================
// MODAL
// ===============================

function openDetailModal(user) {
    const modal =
        document.getElementById('userDetailModal');

    if (!modal) {
        return;
    }

    selectedUser = user;

    renderUserDetail(user);

    const loading =
        document.getElementById('detailLoading');

    const content =
        document.getElementById('detailContent');

    if (loading) {
        loading.classList.add('hidden');
    }

    if (content) {
        content.classList.remove('hidden');
    }

    modal.classList.remove('hidden');
    modal.classList.add('show');
}

function closeUserDetailModal() {
    const modal =
        document.getElementById('userDetailModal');

    if (modal) {
        modal.classList.remove('show');
        modal.classList.add('hidden');
    }

    selectedUser = null;
}

function closeUserFormModal() {
    const modal =
        document.getElementById('userFormModal');

    const form =
        document.getElementById('userForm');

    const userId =
        document.getElementById('userId');

    if (modal) {
        modal.classList.remove('show');
        modal.classList.add('hidden');
    }

    if (form) {
        form.reset();
    }

    if (userId) {
        userId.value = '';
    }
    formModeUser = null;
    selectedUser = null;
}

// ===============================
// FORM LOADING
// ===============================

function setFormLoading(loading) {

const submitButton =
    document.getElementById('btnSubmitUser');

if (!submitButton) {
    return;
}

if (loading) {

    submitButton.disabled = true;
    submitButton.textContent = 'Đang xử lý...';

} else {

    submitButton.disabled = false;

    submitButton.textContent =
        formModeUser === 'update'
            ? 'Cập nhật'
            : 'Tạo mới';
}

}

// ===============================
// API RESPONSE
// ===============================

async function parseResponse(response) {

const text = await response.text();

if (!text) {
    return null;
}

try {
    return JSON.parse(text);
} catch (error) {
    return text;
}

}

async function getResponseErrorMessage(response) {

try {

    const data = await response.json();

    if (typeof data === 'string') {
        return data;
    }

    return (
        data.message ||
        data.error ||
        data.detail ||
        'Có lỗi xảy ra từ backend'
    );

} catch (error) {

    return `HTTP ${response.status}`;
}

}

// ===============================
// TOAST
// ===============================

function showUserToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    if (!toast) {
        return;
    }

    // Clear timer cũ
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }

    // Set message
    if (toastMessage) {
        toastMessage.textContent = message;
    } else {
        toast.textContent = message;
    }

    // Reset class
    toast.classList.remove('hidden');
    toast.classList.remove('show');
    toast.classList.remove('success');
    toast.classList.remove('error');
    toast.classList.remove('info');

    // Show
    toast.classList.add(type);
    toast.classList.add('show');

    // Tự đóng sau 5 giây
    window.toastTimeout = setTimeout(function () {
        toast.classList.remove('show');
        toast.classList.add('hidden');
    }, 5000);
}

// ===============================
// HTML ESCAPE
// ===============================

function escapeHtml(value) {

if (value === null || value === undefined) {
    return '';
}

return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}

// ===============================
// JAVASCRIPT STRING ESCAPE
// ===============================

function escapeJs(value) {

if (value === null || value === undefined) {
    return '';
}

return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');

}