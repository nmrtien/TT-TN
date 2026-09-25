let approvedDossiers = [];

let approvedCurrentPageDossier = 1;

let approvedPageSizeDossier = 5;


function loadApprovedDossiersPage() {

    shell(
        'approved-dossiers',
        'Hồ sơ được chấp nhận phê duyệt',
        'Quản lý danh sách hồ sơ được chấp nhận phê duyệt'
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
                    <h3>Danh sách hồ sơ được chấp nhận phê duyệt</h3>
                    <span>
                        Tổng số:
                        <strong id="approvedDossierCount">0</strong>
                        hồ sơ
                    </span>
                </div>

                <button
                    type="button"
                    class="btn-secondary"
                    id="btnRefreshApprovedDossier">
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

                    <tbody id="approvedDossierTableBody">
                        <tr>
                            <td colspan="9" class="loading-cell">
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>

            <div
                id="approvedDossierEmptyState"
                class="empty-state"
                style="display: none;">
                Không có hồ sơ được chấp nhận phê duyệt
            </div>

            <div
                class="pagination"
                id="approvedDossierPagination">
            </div>

        </div>
    `;

    registerApprovedDossierEvents();

    loadApprovedDossiers();
}


function registerApprovedDossierEvents() {

    const btnRefresh = document.getElementById(
        'btnRefreshApprovedDossier'
    );

    if (btnRefresh) {
        btnRefresh.addEventListener(
            'click',
            loadApprovedDossiers
        );
    }
}


async function loadApprovedDossiers() {

    const tableBody = document.getElementById(
        'approvedDossierTableBody'
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
        // const roleGroup = user?.roleGroup;
        const roleGroup = 'RB_RM';

        if (!userName || !roleGroup) {
            throw new Error(
                'Thông tin userName hoặc roleGroup không hợp lệ.'
            );
        }

        const requestBody = {
            userName: userName,
            roleGroup: roleGroup,
            status: 'APPROVED'
        };

        console.log(
            'Call approved dossiers:',
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

        console.log('Call APPROVED dossiers');

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

            approvedDossiers = [];

        } else {

            const data = JSON.parse(message);

            approvedDossiers = Array.isArray(data)
                ? data
                : [];
        }

        approvedCurrentPageDossier = 1;

        renderApprovedDossiers();

    } catch (error) {

        console.error(
            'Load approved dossiers error:',
            error
        );

        approvedDossiers = [];

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

        updateApprovedDossierCount();

        renderApprovedDossierPagination();
    }
}


function renderApprovedDossiers() {

    const tableBody = document.getElementById(
        'approvedDossierTableBody'
    );

    const emptyState = document.getElementById(
        'approvedDossierEmptyState'
    );

    if (!tableBody) {
        return;
    }

    updateApprovedDossierCount();

    if (
        !approvedDossiers ||
        approvedDossiers.length === 0
    ) {

        tableBody.innerHTML = '';

        if (emptyState) {
            emptyState.style.display = 'block';
        }

        renderApprovedDossierPagination();

        return;
    }

    if (emptyState) {
        emptyState.style.display = 'none';
    }

    const startIndex =
        (approvedCurrentPageDossier - 1) *
        approvedPageSizeDossier;

    const endIndex =
        startIndex +
        approvedPageSizeDossier;

    const pageDossiers =
        approvedDossiers.slice(
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
                                onclick="viewApprovedDossier('${escapeJs(dossier.id)}')">
                                Xem chi tiết
                            </button>

                        </td>

                    </tr>
                `;

            })
            .join('');

    renderApprovedDossierPagination();
}


function viewApprovedDossier(applicationId) {

    const dossier = approvedDossiers.find(
        item => item.id === applicationId
    );

    if (!dossier) {
        console.error(
            'Không tìm thấy hồ sơ được chấp nhận phê duyệt:',
            applicationId
        );
        return;
    }

    console.log(
        'Approved Application ID:',
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


function updateApprovedDossierCount() {

    const countElement =
        document.getElementById(
            'approvedDossierCount'
        );

    if (!countElement) {
        return;
    }

    countElement.textContent =
        approvedDossiers.length;
}


function renderApprovedDossierPagination() {

    const pagination =
        document.getElementById(
            'approvedDossierPagination'
        );

    if (!pagination) {
        return;
    }

    const totalPages =
        Math.ceil(
            approvedDossiers.length /
            approvedPageSizeDossier
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
                approvedCurrentPageDossier === 1
                    ? 'disabled'
                    : ''
            }
            onclick="changeApprovedDossierPage(${approvedCurrentPageDossier - 1})">
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
                    page === approvedCurrentPageDossier
                        ? 'active'
                        : ''
                }"
                onclick="changeApprovedDossierPage(${page})">
                ${page}
            </button>
        `;
    }

    html += `
        <button
            type="button"
            class="page-btn"
            ${
                approvedCurrentPageDossier === totalPages
                    ? 'disabled'
                    : ''
            }
            onclick="changeApprovedDossierPage(${approvedCurrentPageDossier + 1})">
            ›
        </button>
    `;

    pagination.innerHTML = html;
}


function changeApprovedDossierPage(page) {

    const totalPages =
        Math.ceil(
            approvedDossiers.length /
            approvedPageSizeDossier
        );

    if (
        page < 1 ||
        page > totalPages
    ) {
        return;
    }

    approvedCurrentPageDossier = page;

    renderApprovedDossiers();
}


function formatApprovedLoanPurpose(value) {

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