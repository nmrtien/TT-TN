let rejectedDossiers = [];

let rejectedCurrentPageDossier = 1;

let rejectedPageSizeDossier = 5;


function loadRejectedDossiersPage() {

    shell(
        'rejected-dossiers',
        'Hồ sơ bị từ chối phê duyệt',
        'Quản lý danh sách hồ sơ bị từ chối phê duyệt'
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
                    <h3>Danh sách hồ sơ bị từ chối phê duyệt</h3>
                    <span>
                        Tổng số:
                        <strong id="rejectedDossierCount">0</strong>
                        hồ sơ
                    </span>
                </div>

                <button
                    type="button"
                    class="btn-secondary"
                    id="btnRefreshRejectedDossier">
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

                    <tbody id="rejectedDossierTableBody">
                        <tr>
                            <td colspan="9" class="loading-cell">
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>

            <div
                id="rejectedDossierEmptyState"
                class="empty-state"
                style="display: none;">
                Không có hồ sơ bị từ chối phê duyệt
            </div>

            <div
                class="pagination"
                id="rejectedDossierPagination">
            </div>

        </div>
    `;

    registerRejectedDossierEvents();

    loadRejectedDossiers();
}


function registerRejectedDossierEvents() {

    const btnRefresh = document.getElementById(
        'btnRefreshRejectedDossier'
    );

    if (btnRefresh) {
        btnRefresh.addEventListener(
            'click',
            loadRejectedDossiers
        );
    }
}


async function loadRejectedDossiers() {

    const tableBody = document.getElementById(
        'rejectedDossierTableBody'
    );

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = `
        <tr>
            <td colspan="9" class="loading-cell">
                Đang tải dữ liệu...
            </td>
        </tr>
    `;

    try {

        const userJson = localStorage.getItem(
            'credit_scoring_user'
        );

        if (!userJson) {
            throw new Error(
                'Không tìm thấy thông tin đăng nhập của người dùng.'
            );
        }

        const user = JSON.parse(userJson);

        const userName = user?.userName;

        // TODO: bỏ hard-code sau khi test xong
        const roleGroup = user?.roleGroup;
        // const roleGroup = 'RB_RM';

        if (!userName || !roleGroup) {
            throw new Error(
                'Thông tin userName hoặc roleGroup không hợp lệ.'
            );
        }

        const requestBody = {
            userName: userName,
            roleGroup: roleGroup,
            status: 'REJECTED'
        };

        console.log(
            'Call rejected dossiers:',
            requestBody
        );

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

        console.log('Call REJECTED dossiers');

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

            rejectedDossiers = [];

        } else {

            const data = JSON.parse(message);

            rejectedDossiers = Array.isArray(data)
                ? data
                : [];
        }

        rejectedCurrentPageDossier = 1;

        renderRejectedDossiers();

    } catch (error) {

        console.error(
            'Load rejected dossiers error:',
            error
        );

        rejectedDossiers = [];

        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="error-cell">
                    ${escapeHtml(
                        error.message ||
                        'Không thể tải danh sách hồ sơ'
                    )}
                </td>
            </tr>
        `;

        updateRejectedDossierCount();

        renderRejectedDossierPagination();
    }
}


function renderRejectedDossiers() {

    const tableBody = document.getElementById(
        'rejectedDossierTableBody'
    );

    const emptyState = document.getElementById(
        'rejectedDossierEmptyState'
    );

    if (!tableBody) {
        return;
    }

    updateRejectedDossierCount();

    if (
        !rejectedDossiers ||
        rejectedDossiers.length === 0
    ) {

        tableBody.innerHTML = '';

        if (emptyState) {
            emptyState.style.display = 'block';
        }

        renderRejectedDossierPagination();

        return;
    }

    if (emptyState) {
        emptyState.style.display = 'none';
    }

    const startIndex =
        (rejectedCurrentPageDossier - 1) *
        rejectedPageSizeDossier;

    const endIndex =
        startIndex +
        rejectedPageSizeDossier;

    const pageDossiers =
        rejectedDossiers.slice(
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

                        <td>
                            ${stt}
                        </td>

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
                                class="btn-view-dossier"
                                title="Xem chi tiết"
                                onclick="viewRejectedDossier('${escapeJs(dossier.id)}')">
                                Xem chi tiết
                            </button>

                        </td>

                    </tr>
                `;

            })
            .join('');

    renderRejectedDossierPagination();
}


function viewRejectedDossier(applicationId) {

    const dossier = rejectedDossiers.find(
        item => item.id === applicationId
    );

    if (!dossier) {
        console.error(
            'Không tìm thấy hồ sơ bị từ chối phê duyệt:',
            applicationId
        );
        return;
    }

    console.log(
        'Rejected Application ID:',
        dossier.id
    );

    console.log(
        'Latest Task ID:',
        dossier.latestTaskId
    );

    loadDetailDossierPage(
        dossier.id
    );
}


function updateRejectedDossierCount() {

    const countElement =
        document.getElementById(
            'rejectedDossierCount'
        );

    if (!countElement) {
        return;
    }

    countElement.textContent =
        rejectedDossiers.length;
}


function renderRejectedDossierPagination() {

    const pagination =
        document.getElementById(
            'rejectedDossierPagination'
        );

    if (!pagination) {
        return;
    }

    const totalPages =
        Math.ceil(
            rejectedDossiers.length /
            rejectedPageSizeDossier
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
            ${
                rejectedCurrentPageDossier === 1
                    ? 'disabled'
                    : ''
            }
            onclick="changeRejectedDossierPage(${rejectedCurrentPageDossier - 1})">
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
                class="page-btn ${
                    page === rejectedCurrentPageDossier
                        ? 'active'
                        : ''
                }"
                onclick="changeRejectedDossierPage(${page})">
                ${page}
            </button>
        `;
    }

    html += `
        <button
            type="button"
            class="page-btn"
            ${
                rejectedCurrentPageDossier === totalPages
                    ? 'disabled'
                    : ''
            }
            onclick="changeRejectedDossierPage(${rejectedCurrentPageDossier + 1})">
            ›
        </button>
    `;

    pagination.innerHTML = html;
}


function changeRejectedDossierPage(page) {

    const totalPages =
        Math.ceil(
            rejectedDossiers.length /
            rejectedPageSizeDossier
        );

    if (
        page < 1 ||
        page > totalPages
    ) {
        return;
    }

    rejectedCurrentPageDossier = page;

    renderRejectedDossiers();
}


function formatRejectedLoanPurpose(value) {

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