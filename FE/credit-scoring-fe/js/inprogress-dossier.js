let inProgressDossiers = [];

let inProgressCurrentPageDossier = 1;

let inProgressPageSizeDossier = 5;


function loadInprogressDossiersPage() {

    shell(
        'processing-dossiers',
        'Hồ sơ đang xử lý',
        'Quản lý danh sách hồ sơ đang được xử lý'
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
                    <h3>Danh sách hồ sơ đang được xử lý</h3>
                    <span>
                        Tổng số:
                        <strong id="inProgressDossierCount">0</strong>
                        hồ sơ
                    </span>
                </div>

                <button
                    type="button"
                    class="btn-secondary"
                    id="btnRefreshInProgressDossier">
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
                Không có hồ sơ đang xử lý
            </div>

            <div
                class="pagination"
                id="dossierInProgressPagination">
            </div>

        </div>
    `;

    registerInprogressDossierEvents();

    loadInprogressDossiers();
}



function registerInprogressDossierEvents() {

    const btnRefreshInProgress = document.getElementById(
        'btnRefreshInProgressDossier'
    );

    if (btnRefreshInProgress) {
        btnRefreshInProgress.addEventListener(
            'click',
            loadInprogressDossiersPage
        );
    }
}


async function loadInprogressDossiers() {

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

        // const response = await fetch(
        //     `${API_BASE_URL}/scoring/api/v1/scoring/IN_PROGRESS/applications`,
        //     {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     }
        // );

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
            status: 'IN_PROGRESS'
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

        console.log('call IN_PROGRESS')
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
            inProgressDossiers = [];
        } else {

            const data = JSON.parse(message);

            inProgressDossiers = Array.isArray(data)
                ? data
                : [];
        }

        inProgressCurrentPageDossier = 1;

        renderDossiers();

    } catch (error) {

        console.error(
            'Load unassigned inProgressDossiers error:',
            error
        );

        inProgressDossiers = [];

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

        updateInProgressDossierCount();
    }
}


function renderDossiers() {

    const tableBody = document.getElementById(
        'dossierTableBody'
    );

    const emptyState = document.getElementById(
        'dossierEmptyState'
    );

    if (!tableBody) {
        return;
    }

    updateInProgressDossierCount();

    if (!inProgressDossiers || inProgressDossiers.length === 0) {

        tableBody.innerHTML = '';

        if (emptyState) {
            emptyState.style.display = 'block';
        }

        renderInProgressDossierPagination();

        return;
    }

    if (emptyState) {
        emptyState.style.display = 'none';
    }

    const startIndex =
        (inProgressCurrentPageDossier - 1) *
        inProgressPageSizeDossier;

    const endIndex =
        startIndex +
        inProgressPageSizeDossier;

    const pageDossiers =
        inProgressDossiers.slice(
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
    class="btn-view-dossier"
    title="Xem chi tiết"
    onclick="viewInProgressDossier('${escapeJs(dossier.id)}')">
    Xem chi tiết
</button>

                        </td>

                    </tr>
                `;

            })
            .join('');

    renderInProgressDossierPagination();
}

function viewInProgressDossier(applicationId) {

    const dossier = inProgressDossiers.find(
        item => item.id === applicationId
    );

    if (!dossier) {
        console.error(
            'Không tìm thấy hồ sơ:',
            applicationId
        );
        return;
    }

    // if (!dossier.latestTaskId) {
    //     alert('Hồ sơ chưa có task để xử lý.');
    //     return;
    // }

    console.log(
        'Application ID:',
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

function updateInProgressDossierCount() {

    const countElement =
        document.getElementById(
            'inProgressDossierCount'
        );

    if (!countElement) {
        return;
    }

    countElement.textContent =
        inProgressDossiers.length;
}


function renderInProgressDossierPagination() {

    const pagination =
        document.getElementById(
            'dossierInProgressPagination'
        );

    if (!pagination) {
        return;
    }

    const totalPages =
        Math.ceil(
            inProgressDossiers.length /
            inProgressPageSizeDossier
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
            ${inProgressCurrentPageDossier === 1 ? 'disabled' : ''}
            onclick="changeInProgressDossierPage(${inProgressCurrentPageDossier - 1})">
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
                class="page-btn ${page === inProgressCurrentPageDossier
                ? 'active'
                : ''
            }"
                onclick="changeInProgressDossierPage(${page})">
                ${page}
            </button>
        `;
    }

    html += `
        <button
            type="button"
            class="page-btn"
            ${inProgressCurrentPageDossier === totalPages
            ? 'disabled'
            : ''
        }
            onclick="changeInProgressDossierPage(${inProgressCurrentPageDossier + 1})">
            ›
        </button>
    `;

    pagination.innerHTML = html;
}


function changeInProgressDossierPage(page) {

    const totalPages =
        Math.ceil(
            inProgressDossiers.length /
            inProgressPageSizeDossier
        );

    if (
        page < 1 ||
        page > totalPages
    ) {
        return;
    }

    inProgressCurrentPageDossier = page;

    renderDossiers();
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