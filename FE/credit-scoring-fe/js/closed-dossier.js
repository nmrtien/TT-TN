let closedDossiers = [];

let closedCurrentPageDossier = 1;

let closedPageSizeDossier = 5;


function loadClosedDossiersPage() {

    shell(
        'closed-dossiers',
        'Hồ sơ đã đóng',
        'Quản lý danh sách hồ sơ đã đóng'
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
                    <h3>Danh sách hồ sơ đã đóng</h3>
                    <span>
                        Tổng số:
                        <strong id="closedDossierCount">0</strong>
                        hồ sơ
                    </span>
                </div>

                <button
                    type="button"
                    class="btn-secondary"
                    id="btnRefreshClosedDossier">
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

                    <tbody id="closedDossierTableBody">
                        <tr>
                            <td colspan="9" class="loading-cell">
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>

            <div
                id="closedDossierEmptyState"
                class="empty-state"
                style="display: none;">
                Không có hồ sơ đã đóng
            </div>

            <div
                class="pagination"
                id="closedDossierPagination">
            </div>

        </div>
    `;

    registerClosedDossierEvents();

    loadClosedDossiers();
}



function registerClosedDossierEvents() {

    const btnRefresh = document.getElementById(
        'btnRefreshClosedDossier'
    );

    if (btnRefresh) {
        btnRefresh.addEventListener(
            'click',
            loadClosedDossiers
        );
    }
}


async function loadClosedDossiers() {

    const tableBody = document.getElementById(
        'closedDossierTableBody'
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
            status: 'CLOSED'
        };

        console.log(
            'Call closed dossiers:',
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

        console.log('Call CLOSED dossiers');

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

            closedDossiers = [];

        } else {

            const data = JSON.parse(message);

            closedDossiers = Array.isArray(data)
                ? data
                : [];
        }

        closedCurrentPageDossier = 1;

        renderClosedDossiers();

    } catch (error) {

        console.error(
            'Load closed dossiers error:',
            error
        );

        closedDossiers = [];

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

        updateClosedDossierCount();
        renderClosedDossierPagination();
    }
}


function renderClosedDossiers() {

    const tableBody = document.getElementById(
        'closedDossierTableBody'
    );

    const emptyState = document.getElementById(
        'closedDossierEmptyState'
    );

    if (!tableBody) {
        return;
    }

    updateClosedDossierCount();

    if (
        !closedDossiers ||
        closedDossiers.length === 0
    ) {

        tableBody.innerHTML = '';

        if (emptyState) {
            emptyState.style.display = 'block';
        }

        renderClosedDossierPagination();

        return;
    }

    if (emptyState) {
        emptyState.style.display = 'none';
    }

    const startIndex =
        (closedCurrentPageDossier - 1) *
        closedPageSizeDossier;

    const endIndex =
        startIndex +
        closedPageSizeDossier;

    const pageDossiers =
        closedDossiers.slice(
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
                                onclick="viewClosedDossier('${escapeJs(dossier.id)}')">
                                Xem chi tiết
                            </button>

                        </td>

                    </tr>
                `;

            })
            .join('');

    renderClosedDossierPagination();
}

function viewClosedDossier(applicationId) {

    const dossier = closedDossiers.find(
        item => item.id === applicationId
    );

    if (!dossier) {
        console.error(
            'Không tìm thấy hồ sơ đã đóng:',
            applicationId
        );
        return;
    }

    console.log(
        'Closed Application ID:',
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

function updateClosedDossierCount() {

    const countElement =
        document.getElementById(
            'closedDossierCount'
        );

    if (!countElement) {
        return;
    }

    countElement.textContent =
        closedDossiers.length;
}


function renderClosedDossierPagination() {

    const pagination =
        document.getElementById(
            'closedDossierPagination'
        );

    if (!pagination) {
        return;
    }

    const totalPages =
        Math.ceil(
            closedDossiers.length /
            closedPageSizeDossier
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
                closedCurrentPageDossier === 1
                    ? 'disabled'
                    : ''
            }
            onclick="changeClosedDossierPage(${closedCurrentPageDossier - 1})">
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
                    page === closedCurrentPageDossier
                        ? 'active'
                        : ''
                }"
                onclick="changeClosedDossierPage(${page})">
                ${page}
            </button>
        `;
    }

    html += `
        <button
            type="button"
            class="page-btn"
            ${
                closedCurrentPageDossier === totalPages
                    ? 'disabled'
                    : ''
            }
            onclick="changeClosedDossierPage(${closedCurrentPageDossier + 1})">
            ›
        </button>
    `;

    pagination.innerHTML = html;
}


function changeClosedDossierPage(page) {

    const totalPages =
        Math.ceil(
            closedDossiers.length /
            closedPageSizeDossier
        );

    if (
        page < 1 ||
        page > totalPages
    ) {
        return;
    }

    closedCurrentPageDossier = page;

    renderClosedDossiers();
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