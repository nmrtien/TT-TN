let newDossiers = [];

let newCurrentPageDossier = 1;

let newPageSizeDossier = 5;


function loadUnassignedDossiersPage() {

    shell(
        'unassigned-dossiers',
        'Hồ sơ chưa phân công',
        'Quản lý danh sách hồ sơ chưa được phân công'
    );

    const pageContent = document.getElementById('page-content');

    if (!pageContent) {
        console.error('Không tìm thấy #page-content');
        return;
    }

    pageContent.innerHTML = `
        <div class="content-card">

            <div class="card-header">
                <div>
                    <h3>Danh sách hồ sơ chưa phân công</h3>
                    <span>
                        Tổng số:
                        <strong id="newDossierCount">0</strong>
                        hồ sơ
                    </span>
                </div>

                <button
                    type="button"
                    class="btn-secondary"
                    id="btnRefreshNewDossier">
                    ↻ Làm mới
                </button>
            </div>

            <div class="table-wrapper">
                <table class="user-table">

                    <thead>
    <tr>
        <th>STT</th>
        <th>ID</th>
        <th>CIF</th>
        <th>Loại giấy tờ</th>
        <th>Số giấy tờ</th>
        <th>Họ và tên</th>
        <th>Mục đích vay</th>
        <th>Thời hạn vay</th>
        <th>Thao tác</th>
    </tr>
</thead>

                    <tbody id="dossierTableBody">
                        <tr>
                            <td colspan="9" class="loading-cell">
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>

            <div
                id="dossierEmptyState"
                class="empty-state"
                style="display: none;">
                Không có hồ sơ chưa phân công
            </div>

            <div
                class="pagination"
                id="dossierNewPagination">
            </div>

            <div
    id="toastNewDossier"
    class="toast hidden">
    <span id="toastNewDossierMessage"></span>
</div>

        </div>
    `;

    registerUnassignedDossierEvents();

    loadUnassignedDossiers();
}



function registerUnassignedDossierEvents() {

    const btnRefreshNew = document.getElementById(
        'btnRefreshNewDossier'
    );

    if (btnRefreshNew) {
        btnRefreshNew.addEventListener(
            'click',
            loadUnassignedDossiers
        );
    }
}


async function loadUnassignedDossiers() {

    const tableBody = document.getElementById(
        'dossierTableBody'
    );

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = `
        <tr>
            <td colspan="8" class="loading-cell">
                Đang tải dữ liệu...
            </td>
        </tr>
    `;

    try {

        // Lấy thông tin user đã login từ localStorage
        const userJson = localStorage.getItem('credit_scoring_user');

        if (!userJson) {
            throw new Error(
                'Không tìm thấy thông tin đăng nhập của người dùng.'
            );
        }

        const user = JSON.parse(userJson);

        const userName = user?.userName;
        const roleGroup = user?.roleGroup;
        //TODO: FIX CODE TO TEST
        // const roleGroup = 'RB_RM';

        if (!userName || !roleGroup) {
            throw new Error(
                'Thông tin userName hoặc roleGroup không hợp lệ.'
            );
        }

        // Request body
        const requestBody = {
            userName: userName,
            roleGroup: roleGroup,
            status: 'NEW'
        };

        console.log('Call unassign tasks:', requestBody);

        const response = await fetch(
            `${API_BASE_URL}/scoring/api/v1/scoring/applications/search`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );

        console.log('Call POST /tasks/unassign');

        const message = await response.text();
        if (!response.ok) {

            let errorMessage = message;

            try {

                const data = JSON.parse(message);

                if (typeof data === 'string') {

                    errorMessage = data;

                } else {

                    errorMessage =
                        data.message ||
                        data.error ||
                        data.detail ||
                        data.errorMsg ||
                        errorMessage;
                }

            } catch (error) {
                // Response không phải JSON
            }

            throw new Error(
                errorMessage ||
                `Không thể tải danh sách hồ sơ. HTTP ${response.status}`
            );
        }

        if (!message) {

            newDossiers = [];

        } else {

            const data = JSON.parse(message);

            newDossiers = Array.isArray(data)
                ? data
                : [];
        }

        newCurrentPageDossier = 1;

        renderUnassignedDossiers();

    } catch (error) {

        console.error(
            'Load unassigned newDossiers error:',
            error
        );

        newDossiers = [];

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="error-cell">
                    ${escapeHtml(
            error.message ||
            'Không thể tải danh sách hồ sơ'
        )}
                </td>
            </tr>
        `;

        updateNewDossierCount();
    }
}


function renderUnassignedDossiers() {

    const tableBody = document.getElementById(
        'dossierTableBody'
    );

    const emptyState = document.getElementById(
        'dossierEmptyState'
    );

    if (!tableBody) {
        return;
    }

    updateNewDossierCount();

    if (!newDossiers || newDossiers.length === 0) {

        tableBody.innerHTML = '';

        if (emptyState) {
            emptyState.style.display = 'block';
        }

        renderNewDossierPagination();

        return;
    }

    if (emptyState) {
        emptyState.style.display = 'none';
    }

    const startIndex =
        (newCurrentPageDossier - 1) *
        newPageSizeDossier;

    const endIndex =
        startIndex +
        newPageSizeDossier;

    const pageDossiers =
        newDossiers.slice(
            startIndex,
            endIndex
        );

    tableBody.innerHTML =
        pageDossiers
            .map((dossier, index) => {

                const stt =
                    startIndex + index + 1;

                return `
                    <tr>

                        <td>${stt}</td>

                        <td>
                            ${escapeHtml(
                    dossier.id || ''
                )}
                        </td>

                        <td>
                            ${escapeHtml(
                    dossier.cif || ''
                )}
                        </td>

                        <td>
                            ${escapeHtml(
                    dossier.legalDocType || ''
                )}
                        </td>

                        <td>
                            ${escapeHtml(
                    dossier.legalDocNumber || ''
                )}
                        </td>

                        <td>
                            ${escapeHtml(
                    dossier.fullName || ''
                )}
                        </td>

                        <td>
                            ${formatLoanPurpose(
                    dossier.loanPurpose
                )}
                        </td>

                        <td>
                            ${escapeHtml(
                    dossier.loanTerm
                        ? dossier.loanTerm + ' tháng'
                        : ''
                )}
                        </td>

                        <td>
                            <button
    type="button"
    class="btn-icon btn-claim"
    title="Nhận hồ sơ"
    onclick="claimDossier('${escapeJs(dossier.latestTaskId || '')}')">
    Nhận hồ sơ
</button>
                        </td>

                    </tr>
                `;

            })
            .join('');

    renderNewDossierPagination();
}


async function claimDossier(taskId) {

    if (!taskId) {
        showNewDossierToast(
            'Nhận việc không thành công',
            'error'
        );
        return;
    }

    try {

        // ==============================
        // Lấy thông tin user đăng nhập
        // ==============================

        const userJson =
            localStorage.getItem('credit_scoring_user');

        if (!userJson) {
            showNewDossierToast(
                'Nhận việc không thành công',
                'error'
            );
            return;
        }

        const user = JSON.parse(userJson);

        const userName = user?.userName;

        if (!userName) {
            showNewDossierToast(
                'Nhận việc không thành công',
                'error'
            );
            return;
        }


        // ==============================
        // Request body
        // ==============================

        const requestBody = {
            taskId: taskId,
            userName: userName
        };

        console.log(
            'POST /tasks/claim - request:',
            requestBody
        );


        // ==============================
        // Call API
        // ==============================

        const response = await fetch(
            `${API_BASE_URL}/scoring/api/v1/scoring/tasks/claim`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );

        const message =
            await response.text();

        console.log(
            'POST /tasks/claim - HTTP status:',
            response.status
        );

        console.log(
            'POST /tasks/claim - response:',
            message
        );


        // ==============================
        // HTTP khác 200
        // ==============================

        if (response.status !== 200) {

            showNewDossierToast(
                'Nhận việc không thành công',
                'error'
            );

            return;
        }


        // ==============================
        // HTTP 200
        // ==============================

        let data = null;

        try {

            data = message
                ? JSON.parse(message)
                : null;

        } catch (error) {

            console.error(
                'Parse claim response error:',
                error
            );

            showNewDossierToast(
                'Nhận việc không thành công',
                'error'
            );

            return;
        }


        // ==============================
        // HTTP 200 + ID có giá trị
        // ==============================

        if (data?.id) {

            await loadUnassignedDossiers();

            showNewDossierToast(
                'Nhận việc thành công',
                'success'
            );

            return;
        }


        // ==============================
        // HTTP 200 + ID null
        // → lấy errorMsg từ backend
        // ==============================

        showNewDossierToast(
            data?.errorMsg ||
            'Nhận việc không thành công',
            'error'
        );

    } catch (error) {

        console.error(
            'Claim dossier error:',
            error
        );

        showNewDossierToast(
            'Nhận việc không thành công',
            'error'
        );
    }
}

function showNewDossierToast(message, type = 'info') {
    console.log('1')
    const toast = document.getElementById('toastNewDossier');
    const toastNewDossierMessage = document.getElementById('toastNewDossierMessage');
console.log('2')
    if (!toast) {
        return;
    }
console.log('3')
    // Clear timer cũ
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }

    // Set message
    if (toastNewDossierMessage) {
        toastNewDossierMessage.textContent = message;
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


function updateNewDossierCount() {

    const countElement =
        document.getElementById(
            'newDossierCount'
        );

    if (!countElement) {
        return;
    }

    countElement.textContent =
        newDossiers.length;
}


function renderNewDossierPagination() {

    const pagination =
        document.getElementById(
            'dossierNewPagination'
        );

    if (!pagination) {
        return;
    }

    const totalPages =
        Math.ceil(
            newDossiers.length /
            newPageSizeDossier
        );

    if (totalPages < 1) {

        pagination.innerHTML = '';

        return;
    }

    let html = '';

    html += `
        <button
            type="button"
            class="page-btn"
            ${newCurrentPageDossier === 1 ? 'disabled' : ''}
            onclick="changeNewDossierPage(${newCurrentPageDossier - 1})">
            ‹
        </button>
    `;

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        html += `
            <button
                type="button"
                class="page-btn ${page === newCurrentPageDossier
                ? 'active'
                : ''
            }"
                onclick="changeNewDossierPage(${page})">
                ${page}
            </button>
        `;
    }

    html += `
        <button
            type="button"
            class="page-btn"
            ${newCurrentPageDossier === totalPages
            ? 'disabled'
            : ''
        }
            onclick="changeNewDossierPage(${newCurrentPageDossier + 1})">
            ›
        </button>
    `;

    pagination.innerHTML = html;
}


function changeNewDossierPage(page) {

    const totalPages =
        Math.ceil(
            newDossiers.length /
            newPageSizeDossier
        );

    if (
        page < 1 ||
        page > totalPages
    ) {
        return;
    }

    newCurrentPageDossier = page;

    renderUnassignedDossiers();
}


function formatLoanPurpose(value) {

    const purposeMap = {
        MUA_NHA: 'Mua nhà',
        MUA_XE: 'Mua xe',
        TIEU_DUNG: 'Tiêu dùng',
        KINH_DOANH: 'Kinh doanh',
        KHAC: 'Khác'
    };

    return escapeHtml(
        purposeMap[value] || value || ''
    );
}