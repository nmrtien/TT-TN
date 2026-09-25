let detailTask = null;

let detailApplication = null;

let detailModels = [];


/**
 * Load màn hình chi tiết hồ sơ
 */
async function loadDetailDossierPage(applicationId) {

    if (!applicationId) {
        console.error('Không có applicationId');

        alert('Không tìm thấy thông tin task của hồ sơ.');

        return;
    }

    shell(
        'processing-dossiers',
        'Chi tiết hồ sơ',
        'Thông tin chi tiết và câu hỏi chấm điểm tín dụng'
    );

    const pageContent =
        document.getElementById('page-content');

    if (!pageContent) {
        console.error('Không tìm thấy #page-content');
        return;
    }

    pageContent.innerHTML = `
        <div class="detail-dossier-container">

            <!-- ========================= -->
            <!-- LOADING -->
            <!-- ========================= -->

            <div class="detail-loading" id="detailLoading">
                Đang tải thông tin hồ sơ...
            </div>


            <div
                id="detailContent"
                style="display: none;"
            >

                <!-- ========================= -->
                <!-- CLOSED BANNER -->
                <!-- ========================= -->

                <div
                    id="closedApplicationBanner"
                    class="closed-application-banner"
                    style="display: none;"
                >
                    <div class="closed-application-banner-icon">
                        !
                    </div>

                    <div class="closed-application-banner-content">
                        <div class="closed-application-banner-title">
                            Hồ sơ đã đóng
                        </div>

                        <div
                            class="closed-application-banner-message"
                            id="closedApplicationMessage">
                            Hồ sơ này đã được đóng và không thể tiếp tục xử lý.
                        </div>
                    </div>
                </div>


                <!-- ========================= -->
                <!-- THÔNG TIN HỒ SƠ -->
                <!-- ========================= -->

                <div class="detail-card">

                    <div class="detail-card-header">

                        <div>
                            <h3>Thông tin hồ sơ</h3>

                            <span>
                                Thông tin hồ sơ chấm điểm tín dụng
                            </span>
                        </div>

                        <div class="task-info">

                            <div class="task-info-item">
                                <span class="task-info-label">
                                    Nhóm xử lý
                                </span>

                                <span
                                    class="task-info-value"
                                    id="taskRoleGroup">
                                </span>
                            </div>


                            <div class="task-info-item">
                                <span class="task-info-label">
                                    Người xử lý
                                </span>

                                <span
                                    class="task-info-value"
                                    id="taskAssignee">
                                </span>
                            </div>


                            <div
                                class="status-badge"
                                id="applicationStatus">
                            </div>

                        </div>

                    </div>


                    <!-- ========================= -->
                    <!-- THÔNG TIN KHÁCH HÀNG -->
                    <!-- ========================= -->

                    <div class="section-title">
                        Thông tin khách hàng
                    </div>

                    <div class="form-grid">

                        <div class="form-group">
                            <label>CIF</label>

                            <input
                                type="text"
                                id="cif"
                                readonly
                            >
                        </div>

                        <div class="form-group">
                            <label>Loại giấy tờ</label>

                            <input
                                type="text"
                                id="legalDocType"
                                readonly
                            >
                        </div>

                        <div class="form-group">
                            <label>Số giấy tờ</label>

                            <input
                                type="text"
                                id="legalDocNumber"
                                readonly
                            >
                        </div>

                        <div class="form-group">
                            <label>Họ và tên</label>

                            <input
                                type="text"
                                id="fullName"
                                readonly
                            >
                        </div>

                        <div class="form-group">
                            <label>Ngày sinh</label>

                            <input
                                type="text"
                                id="birthday"
                                readonly
                            >
                        </div>

                        <div class="form-group">
                            <label>Số điện thoại</label>

                            <input
                                type="text"
                                id="phone"
                                readonly
                            >
                        </div>

                        <div class="form-group">
                            <label>Email</label>

                            <input
                                type="text"
                                id="email"
                                readonly
                            >
                        </div>

                        <div class="form-group form-group-full">
                            <label>Địa chỉ</label>

                            <input
                                type="text"
                                id="address"
                                readonly
                            >
                        </div>

                    </div>


                    <!-- ========================= -->
                    <!-- VỢ / CHỒNG / NGƯỜI LIÊN QUAN -->
                    <!-- ========================= -->

                    <div class="section-title">
                        Thông tin vợ / chồng / người liên quan
                    </div>

                    <div class="form-grid">

                        <div class="form-group">
                            <label>CIF</label>

                            <input
                                type="text"
                                id="spouseCif"
                                readonly
                            >
                        </div>

                        <div class="form-group">
                            <label>Loại giấy tờ</label>

                            <input
                                type="text"
                                id="spouseLegalDocType"
                                readonly
                            >
                        </div>

                        <div class="form-group">
                            <label>Số giấy tờ</label>

                            <input
                                type="text"
                                id="spouseLegalDocNumber"
                                readonly
                            >
                        </div>

                        <div class="form-group">
                            <label>Họ và tên</label>

                            <input
                                type="text"
                                id="spouseFullName"
                                readonly
                            >
                        </div>

                        <div class="form-group">
                            <label>Số điện thoại</label>

                            <input
                                type="text"
                                id="spousePhone"
                                readonly
                            >
                        </div>

                        <div class="form-group">
                            <label>Email</label>

                            <input
                                type="text"
                                id="spouseEmail"
                                readonly
                            >
                        </div>

                    </div>


                    <!-- ========================= -->
                    <!-- THÔNG TIN KHOẢN VAY -->
                    <!-- ========================= -->

                    <div class="section-title">
                        Thông tin khoản vay
                    </div>

                    <div class="form-grid">

                        <div class="form-group">
                            <label>Mục đích vay</label>

                            <input
                                type="text"
                                id="loanPurpose"
                                readonly
                            >
                        </div>

                        <div class="form-group">
                            <label>Thời hạn vay</label>

                            <div class="input-with-suffix">

                                <input
                                    type="text"
                                    id="loanTerm"
                                    readonly
                                >

                                <span>tháng</span>

                            </div>

                        </div>

                    </div>

                </div>


                <!-- ========================= -->
                <!-- CÂU HỎI CHẤM ĐIỂM -->
                <!-- ========================= -->

                <div
                    id="modelsContainer"
                    class="models-container">
                </div>


                <!-- ========================= -->
                <!-- ACTION -->
                <!-- ========================= -->

                <div class="detail-actions">


                    <div class="detail-action-right">

                        <button
                            type="button"
                            class="btn-task-action btn-task-complete"
                            id="btnCompleteDossier"
                            style="display: none;">
                            Hoàn thành
                        </button>


                        <button
                            type="button"
                            class="btn-task-action btn-task-close"
                            id="btnCloseDossier"
                            style="display: none;">
                            Đóng
                        </button>


                        <button
                            type="button"
                            class="btn-task-action btn-task-approve"
                            id="btnApproveDossier"
                            style="display: none;">
                            Phê duyệt
                        </button>


                        <button
                            type="button"
                            class="btn-task-action btn-task-reject"
                            id="btnRejectDossier"
                            style="display: none;">
                            Từ chối
                        </button>

                    </div>

                </div>

            </div>


            <!-- ========================= -->
            <!-- MODAL ĐÓNG HỒ SƠ -->
            <!-- ========================= -->

            <div
                class="detail-modal-overlay"
                id="closeDossierModal"
                style="display: none;">

                <div class="detail-modal">

                    <div class="detail-modal-header">

                        <div>
                            <h3>Đóng hồ sơ</h3>

                            <span>
                                Vui lòng nhập lý do đóng hồ sơ
                            </span>
                        </div>

                        <button
                            type="button"
                            class="detail-modal-close"
                            id="btnCloseDossierModal">
                            ×
                        </button>

                    </div>


                    <div class="detail-modal-body">

                        <div class="form-group">

                            <label for="closeDossierReason">
                                Lý do đóng hồ sơ
                                <span class="required">*</span>
                            </label>

                            <textarea
                                id="closeDossierReason"
                                class="detail-modal-textarea"
                                rows="5"
                                maxlength="1000"
                                placeholder="Yêu cầu nhập lý do Đóng hồ sơ">
                            </textarea>

                            <div
                                class="detail-modal-error"
                                id="closeDossierReasonError"
                                style="display: none;">
                                Yêu cầu nhập lý do Đóng hồ sơ.
                            </div>

                        </div>

                    </div>


                    <div class="detail-modal-footer">

                        <button
                            type="button"
                            class="btn-secondary"
                            id="btnCancelCloseDossier">
                            Hủy
                        </button>

                        <button
                            type="button"
                            class="btn-task-action btn-task-close"
                            id="btnConfirmCloseDossier">
                            Xác nhận đóng
                        </button>

                    </div>

                </div>

            </div>

        </div>
    `;

    /*
     * Đăng ký event trước khi load data.
     */
    registerDetailDossierEvents();

    /*
     * Load detail.
     */
    await loadDetailDossier(applicationId);
}


/**
 * Gọi API lấy chi tiết task
 */
async function loadDetailDossier(applicationId) {

    try {
        const userJson = localStorage.getItem('credit_scoring_user');

        if (!userJson) {
            throw new Error(
                'Không tìm thấy thông tin đăng nhập của người dùng.'
            );
        }

        const user = JSON.parse(userJson);

        const userName = user?.userName;
        // const roleGroup = user?.roleGroup;
        //TODO: FIX CODE TO TEST
        const roleGroup = 'RB_RM';

        if (!userName || !roleGroup) {
            throw new Error(
                'Thông tin userName hoặc roleGroup không hợp lệ.'
            );
        }
        // Request body
        const requestBody = {
            applicationId: applicationId,
            userName: userName,
            roleGroup: roleGroup
        };

        console.log('Call unassign tasks:', requestBody);

        const response = await fetch(
            `${API_BASE_URL}/scoring/api/v1/scoring/tasks/detail`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );

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
                `Không thể tải chi tiết hồ sơ. HTTP ${response.status}`
            );
        }

        if (!message) {
            throw new Error(
                'API không trả về dữ liệu chi tiết hồ sơ'
            );
        }

        const data = JSON.parse(message);

        detailTask = data;

        detailApplication =
            data.application || null;

        detailModels =
            Array.isArray(data.models)
                ? data.models
                : [];

        renderApplication();
        renderModels();

        // Update action
        updateDetailActionButtons();

        // Nếu application đã CLOSED
        checkClosedApplication();

        const loading =
            document.getElementById('detailLoading');

        const content =
            document.getElementById('detailContent');

        if (loading) {
            loading.style.display = 'none';
        }

        if (content) {
            content.style.display = 'block';
        }

    } catch (error) {

        console.error(
            'Load detail dossier error:',
            error
        );

        const loading =
            document.getElementById('detailLoading');

        if (loading) {

            loading.innerHTML = `
                <div class="detail-error">
                    ${escapeHtml(
                error.message ||
                'Không thể tải thông tin hồ sơ'
            )}
                </div>
            `;
        }
    }
}


/**
 * Hiển thị button action theo status task và roleGroup
 */
function updateDetailActionButtons() {

    const btnComplete =
        document.getElementById('btnCompleteDossier');

    const btnClose =
        document.getElementById('btnCloseDossier');

    const btnApprove =
        document.getElementById('btnApproveDossier');

    const btnReject =
        document.getElementById('btnRejectDossier');

    // Hide tất cả trước
    if (btnComplete) btnComplete.style.display = 'none';
    if (btnClose) btnClose.style.display = 'none';
    if (btnApprove) btnApprove.style.display = 'none';
    if (btnReject) btnReject.style.display = 'none';

    if (!detailTask) {
        return;
    }

    // Nếu APPLICATION đã CLOSED thì không cho thao tác
    if (getApplicationStatus() === 'CLOSED') {
        return;
    }

    // Task phải đang IN_PROGRESS mới được thao tác
    const taskStatus = String(
        detailTask.status || ''
    )
        .trim()
        .toUpperCase();

    if (taskStatus !== 'IN_PROGRESS') {
        return;
    }

    const user =
        JSON.parse(
            localStorage.getItem('credit_scoring_user') || '{}'
        );

    // TODO: sau này lấy trực tiếp từ user
    const roleGroup = 'RB_RM';

    if (roleGroup === 'RB_RM' || roleGroup === 'RB_CA') {

        if (btnComplete) {
            btnComplete.style.display = 'inline-flex';
        }

        if (btnClose) {
            btnClose.style.display = 'inline-flex';
        }

    } else if (roleGroup === 'RB_AM') {

        if (btnApprove) {
            btnApprove.style.display = 'inline-flex';
        }

        if (btnReject) {
            btnReject.style.display = 'inline-flex';
        }
    }
}


/**
 * Render thông tin application
 */
function renderApplication() {

    if (!detailApplication) {
        return;
    }

    setInputValue(
        'cif',
        detailApplication.cif
    );

    setInputValue(
        'legalDocType',
        detailApplication.legalDocType
    );

    setInputValue(
        'legalDocNumber',
        detailApplication.legalDocNumber
    );

    setInputValue(
        'fullName',
        detailApplication.fullName
    );

    setInputValue(
        'birthday',
        detailApplication.birthday
    );

    setInputValue(
        'phone',
        detailApplication.phone
    );

    setInputValue(
        'email',
        detailApplication.email
    );

    setInputValue(
        'address',
        detailApplication.address
    );

    setInputValue(
        'spouseCif',
        detailApplication.spouseCif
    );

    setInputValue(
        'spouseLegalDocType',
        detailApplication.spouseLegalDocType
    );

    setInputValue(
        'spouseLegalDocNumber',
        detailApplication.spouseLegalDocNumber
    );

    setInputValue(
        'spouseFullName',
        detailApplication.spouseFullName
    );

    setInputValue(
        'spousePhone',
        detailApplication.spousePhone
    );

    setInputValue(
        'spouseEmail',
        detailApplication.spouseEmail
    );

    setInputValue(
        'loanPurpose',
        formatLoanPurpose(
            detailApplication.loanPurpose
        )
    );

    setInputValue(
        'loanTerm',
        detailApplication.loanTerm
    );


    // =========================
    // TASK INFORMATION
    // =========================

    const roleGroupElement =
        document.getElementById('taskRoleGroup');

    if (roleGroupElement) {

        roleGroupElement.textContent =
            detailTask?.roleGroup || '-';
    }


    const assigneeElement =
        document.getElementById('taskAssignee');

    if (assigneeElement) {

        assigneeElement.textContent =
            detailTask?.assignee || '-';
    }


    const statusElement =
        document.getElementById(
            'applicationStatus'
        );

    if (statusElement) {

        const status =
            detailTask?.status || '';

        statusElement.textContent =
            formatApplicationStatus(status);

        // Reset class cũ
        statusElement.className =
            'status-badge';

        // Thêm class theo trạng thái
        if (status === 'COMPLETED') {

            statusElement.classList.add(
                'status-completed'
            );

        } else if (status === 'IN_PROGRESS') {

            statusElement.classList.add(
                'status-in-progress'
            );

        } else if (status === 'NEW') {

            statusElement.classList.add(
                'status-new'
            );

        } else if (status === 'APPROVED') {

            statusElement.classList.add(
                'status-approved'
            );

        } else if (status === 'REJECTED') {

            statusElement.classList.add(
                'status-rejected'
            );

        } else if (status === 'CLOSED') {

            statusElement.classList.add(
                'status-closed'
            );
        }
    }


}


/**
 * Render danh sách model và câu hỏi
 */
function renderModels() {

    const container =
        document.getElementById(
            'modelsContainer'
        );

    if (!container) {
        return;
    }

    if (
        !detailModels ||
        detailModels.length === 0
    ) {

        container.innerHTML = `
            <div class="detail-card">
                <div class="empty-model">
                    Không có mô hình chấm điểm
                </div>
            </div>
        `;

        return;
    }


    container.innerHTML =
        detailModels
            .map((model, modelIndex) => {

                const questions =
                    Array.isArray(model.questions)
                        ? model.questions
                        : [];

                return `
                    <div class="detail-card model-card">

                        <div class="model-header">

                            <div>
                                <span class="model-index">
                                    Mô hình ${modelIndex + 1}
                                </span>

                                
                            </div>

                            <span class="model-level">
                                <h4>
                                    ${escapeHtml(
                    model.modelCode || ''
                )}
                                    -
                                    ${escapeHtml(
                    model.modelName || ''
                )}
                                </h4>
                            </span>

                        </div>


                        ${questions.length === 0
                        ? `
                                    <div class="empty-model">
                                        Mô hình chưa có câu hỏi
                                    </div>
                                  `
                        : `
                                    <div class="question-table-wrapper">

                                        <table class="question-table">

                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Mã câu hỏi</th>
                                                    <th>Câu hỏi</th>
                                                    <th>Câu trả lời</th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                ${questions
                            .map(
                                (
                                    question,
                                    questionIndex
                                ) => `
                                                                <tr>

                                                                    <td>
                                                                        ${questionIndex + 1
                                    }
                                                                    </td>

                                                                    <td>
                                                                        <span class="question-code">
                                                                            ${escapeHtml(
                                        question.questionCode || ''
                                    )}
                                                                        </span>
                                                                    </td>

                                                                    <td>
                                                                        <div class="question-name">
                                                                            ${escapeHtml(
                                        question.questionName || ''
                                    )}
                                                                        </div>
                                                                    </td>

                                                                    <td>
                                                                        <input
    type="text"
    class="question-answer ${detailTask?.status === 'COMPLETED'
                                        ? 'question-answer-readonly'
                                        : ''
                                    }"
    data-question-id="${escapeHtml(
                                        question.id || ''
                                    )}"
    value="${escapeHtml(
                                        question.questionAnswer || ''
                                    )}"
    placeholder="Nhập câu trả lời"
    ${detailTask?.status === 'COMPLETED' ? 'readonly' : ''}
>
                                                                    </td>

                                                                </tr>
                                                            `
                            )
                            .join('')
                        }

                                            </tbody>

                                        </table>

                                    </div>
                                `
                    }

                    </div>
                `;

            })
            .join('');
}


/**
 * Đăng ký event
 */
/**
 * Đăng ký event
 */
function registerDetailDossierEvents() {

    const btnCompleteDossier =
        document.getElementById('btnCompleteDossier');

    const btnCloseDossier =
        document.getElementById('btnCloseDossier');

    const btnApproveDossier =
        document.getElementById('btnApproveDossier');

    const btnRejectDossier =
        document.getElementById('btnRejectDossier');

    const btnCloseDossierModal =
        document.getElementById('btnCloseDossierModal');

    const btnCancelCloseDossier =
        document.getElementById('btnCancelCloseDossier');

    const btnConfirmCloseDossier =
        document.getElementById('btnConfirmCloseDossier');

    const closeDossierReason =
        document.getElementById('closeDossierReason');


    // =========================
    // Quay lại
    // =========================

    // btnBackDossier?.addEventListener('click', function () {

    //     goToPage('inprogress-dossiers');

    // });


    // =========================
    // Hoàn thành
    // =========================

    btnCompleteDossier?.addEventListener(
        'click',
        async function () {

            await completeDossier('COMPLETED');

        }
    );


    // =========================
    // Đóng hồ sơ
    // =========================

    btnCloseDossier?.addEventListener(
        'click',
        function () {

            openCloseDossierModal();

        }
    );


    // =========================
    // Phê duyệt
    // =========================

    btnApproveDossier?.addEventListener(
        'click',
        async function () {

            await completeDossier('APPROVED');

        }
    );


    // =========================
    // Từ chối
    // =========================

    btnRejectDossier?.addEventListener(
        'click',
        async function () {

            await completeDossier('REJECTED');

        }
    );


    // =========================
    // Modal đóng hồ sơ
    // =========================

    btnCloseDossierModal?.addEventListener(
        'click',
        function () {

            closeCloseDossierModal();

        }
    );


    btnCancelCloseDossier?.addEventListener(
        'click',
        function () {

            closeCloseDossierModal();

        }
    );


    btnConfirmCloseDossier?.addEventListener(
        'click',
        async function () {

            await confirmCloseDossier();

        }
    );


    // =========================
    // Ctrl + Enter để submit
    // =========================

    closeDossierReason?.addEventListener(
        'keydown',
        async function (event) {

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key === 'Enter'
            ) {

                event.preventDefault();

                await confirmCloseDossier();
            }
        }
    );


    // =========================
    // Khi nhập lý do -> ẩn error
    // =========================

    closeDossierReason?.addEventListener(
        'input',
        function () {

            const errorElement =
                document.getElementById(
                    'closeDossierReasonError'
                );

            if (
                errorElement &&
                String(this.value || '').trim()
            ) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        }
    );
}




function openCloseDossierModal() {

    const modal = document.getElementById('closeDossierModal');
    const reasonInput = document.getElementById('closeDossierReason');
    const errorElement = document.getElementById('closeDossierReasonError');

    if (!modal) {
        console.error('Không tìm thấy #closeDossierModal');
        return;
    }

    if (reasonInput) {
        reasonInput.value = '';
    }

    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    modal.style.display = 'flex';

    setTimeout(() => {
        reasonInput?.focus();
    }, 100);
}


function closeCloseDossierModal() {

    const modal = document.getElementById('closeDossierModal');
    const reasonInput = document.getElementById('closeDossierReason');
    const errorElement = document.getElementById('closeDossierReasonError');

    if (modal) {
        modal.style.display = 'none';
    }

    if (reasonInput) {
        reasonInput.value = '';
    }

    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}


async function confirmCloseDossier() {

    const reasonInput = document.getElementById('closeDossierReason');
    const errorElement = document.getElementById('closeDossierReasonError');

    if (!reasonInput) {
        console.error('Không tìm thấy #closeDossierReason');
        return;
    }

    const reason = String(reasonInput.value || '').trim();

    // Validate lý do
    if (!reason) {

        if (errorElement) {
            errorElement.textContent =
                'Vui lòng nhập lý do Đóng hồ sơ.';
            errorElement.style.display = 'block';
        }

        reasonInput.focus();

        return;
    }

    if (!detailTask) {
        alert('Không tìm thấy thông tin task.');
        return;
    }

    // Xóa error
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    /*
     * Quan trọng:
     * Gán lý do trực tiếp vào detailTask
     */
    detailTask.comment = reason;

    /*
     * completeDossier() sẽ tiếp tục gán:
     *
     * detailTask.completeType = 'CLOSED';
     *
     * và gửi toàn bộ detailTask lên backend.
     */
    const success = await completeDossier('CLOSED');

    /*
     * Chỉ đóng modal khi API thành công.
     * Nếu API lỗi thì giữ modal để user có thể sửa/thử lại.
     */
    if (success) {
        closeCloseDossierModal();
    }
}

function showClosedApplicationBanner(reason) {

    const banner =
        document.getElementById(
            'closedApplicationBanner'
        );

    const message =
        document.getElementById(
            'closedApplicationMessage'
        );

    if (!banner) {
        return;
    }

    if (message) {

        message.innerHTML = `
            <div>
                Hồ sơ này đã được đóng và không thể tiếp tục xử lý.
            </div>

            <div class="closed-application-reason">
                <strong>Lý do đóng hồ sơ:</strong>
                <span>
                    ${escapeHtml(
                        String(reason || '').trim() ||
                        'Không có lý do đóng hồ sơ.'
                    )}
                </span>
            </div>
        `;
    }

    banner.style.display = 'flex';
}


function hideAllTaskActions() {

    const buttonIds = [
        'btnCompleteDossier',
        'btnCloseDossier',
        'btnApproveDossier',
        'btnRejectDossier'
    ];

    buttonIds.forEach(id => {

        const button = document.getElementById(id);

        if (button) {
            button.style.display = 'none';
        }
    });
}



function checkClosedApplication() {

    const status = getApplicationStatus();

    if (status === 'CLOSED') {

        const reason =
            detailApplication?.comment ||
            detailTask?.comment ||
            '';

        showClosedApplicationBanner(reason);

        hideAllTaskActions();

        return true;
    }

    return false;
}

function getApplicationStatus() {

    return String(
        detailApplication?.status || ''
    )
        .trim()
        .toUpperCase();
}


async function completeDossier(completeType) {

    if (!detailTask) {
        alert('Không tìm thấy thông tin task.');
        return false;
    }

    // Nếu là CLOSED thì bắt buộc phải có lý do
    if (completeType === 'CLOSED') {
        const reason = String(detailTask.comment || '').trim();

        if (!reason) {
            alert('Vui lòng nhập lý do Đóng hồ sơ.');
            return false;
        }
    }

    // Thu thập câu trả lời mới nhất từ màn hình
    collectQuestionAnswers();

    // Gán completeType trực tiếp vào detailTask
    detailTask.completeType = completeType;

    console.log('Complete task request:', detailTask);

    // Disable toàn bộ action button
    const buttons = [
        document.getElementById('btnCompleteDossier'),
        document.getElementById('btnCloseDossier'),
        document.getElementById('btnApproveDossier'),
        document.getElementById('btnRejectDossier')
    ];

    buttons.forEach(btn => {
        if (btn) {
            btn.disabled = true;
        }
    });

    const completeButton = document.getElementById('btnCompleteDossier');
    const closeButton = document.getElementById('btnCloseDossier');
    const approveButton = document.getElementById('btnApproveDossier');
    const rejectButton = document.getElementById('btnRejectDossier');

    const oldTexts = {
        complete: completeButton?.textContent,
        close: closeButton?.textContent,
        approve: approveButton?.textContent,
        reject: rejectButton?.textContent
    };

    try {

        // Đổi text button theo loại action
        if (completeType === 'COMPLETED' && completeButton) {
            completeButton.textContent = 'Đang hoàn thành...';
        }

        if (completeType === 'CLOSED' && closeButton) {
            closeButton.textContent = 'Đang đóng...';
        }

        if (completeType === 'APPROVED' && approveButton) {
            approveButton.textContent = 'Đang phê duyệt...';
        }

        if (completeType === 'REJECTED' && rejectButton) {
            rejectButton.textContent = 'Đang từ chối...';
        }

        const response = await fetch(
            `${API_BASE_URL}/scoring/api/v1/scoring/tasks/complete`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(detailTask)
            }
        );

        const responseText = await response.text();

        console.log('Complete task response:', responseText);

        let responseData = null;

        if (responseText) {
            try {
                responseData = JSON.parse(responseText);
            } catch (e) {
                console.error('Không parse được response JSON:', e);
            }
        }

        // API trả lỗi
        if (!response.ok) {

            const errorMessage =
                responseData?.errorMsg ||
                responseData?.message ||
                responseData?.error ||
                responseText ||
                `HTTP ${response.status}`;

            throw new Error(errorMessage);
        }

        // Backend trả HTTP 200 nhưng DTO lỗi
        if (!responseData) {
            throw new Error('API không trả về dữ liệu task.');
        }

        if (responseData.errorMsg) {
            throw new Error(responseData.errorMsg);
        }

        // Cập nhật lại detailTask bằng response mới nhất
        detailTask = responseData;

        detailApplication =
            responseData.application ||
            detailApplication;

        detailModels =
            Array.isArray(responseData.models)
                ? responseData.models
                : detailModels;

        console.log('detailTask sau khi complete:', detailTask);
        console.log('detailApplication sau khi complete:', detailApplication);

        // Nếu đóng hồ sơ
        if (completeType === 'CLOSED') {

            const reason =
                detailTask?.comment ||
                detailApplication?.comment ||
                '';

            showClosedApplicationBanner(reason);
            hideAllTaskActions();

            closeCloseDossierModal();
        }

        // Render lại giao diện
        renderApplication();
        renderModels();
        updateDetailActionButtons();

        // Kiểm tra lại trạng thái hồ sơ
        checkClosedApplication();

        alert(
            completeType === 'COMPLETED'
                ? 'Hoàn thành task thành công.'
                : completeType === 'CLOSED'
                    ? 'Đóng hồ sơ thành công.'
                    : completeType === 'APPROVED'
                        ? 'Phê duyệt hồ sơ thành công.'
                        : completeType === 'REJECTED'
                            ? 'Từ chối hồ sơ thành công.'
                            : 'Thực hiện thành công.'
        );

        return true;

    } catch (error) {

        console.error('Lỗi complete task:', error);

        alert(
            error?.message ||
            'Không thể thực hiện thao tác.'
        );

        return false;

    } finally {

        // Restore button
        if (completeButton) {
            completeButton.disabled = false;
            completeButton.textContent =
                oldTexts.complete || 'Hoàn thành';
        }

        if (closeButton) {
            closeButton.disabled = false;
            closeButton.textContent =
                oldTexts.close || 'Đóng';
        }

        if (approveButton) {
            approveButton.disabled = false;
            approveButton.textContent =
                oldTexts.approve || 'Phê duyệt';
        }

        if (rejectButton) {
            rejectButton.disabled = false;
            rejectButton.textContent =
                oldTexts.reject || 'Từ chối';
        }

        // Nếu hồ sơ đã CLOSED thì vẫn phải hide action
        checkClosedApplication();
    }
}

/**
 * Thu thập câu trả lời
 */
/**
 * Thu thập và cập nhật câu trả lời vào detailTask
 */
function collectQuestionAnswers() {

    if (!detailTask) {
        console.error(
            'Không có detailTask để cập nhật câu trả lời.'
        );
        return;
    }

    const answerInputs =
        document.querySelectorAll(
            '.question-answer'
        );

    answerInputs.forEach(input => {

        const questionId =
            input.dataset.questionId;

        const questionAnswer =
            input.value;

        if (!questionId) {
            return;
        }

        // Tìm question tương ứng trong tất cả model
        detailTask.models?.forEach(model => {

            model.questions?.forEach(question => {

                if (
                    String(question.id) ===
                    String(questionId)
                ) {

                    question.questionAnswer =
                        questionAnswer;
                }

            });

        });

    });

    console.log(
        'Detail task sau khi cập nhật câu trả lời:',
        detailTask
    );
}

/**
 * Set value cho input
 */
function setInputValue(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {
        return;
    }

    element.value =
        value === null ||
            value === undefined
            ? ''
            : value;
}



/**
 * Format trạng thái
 */
function formatApplicationStatus(
    status
) {

    const statusMap = {
        NEW: 'Mới',
        IN_PROGRESS: 'Đang xử lý',
        COMPLETED: 'Đã hoàn thành',
        APPROVED: 'Đã được duyệt',
        REJECTED: 'Bị từ chối',
        CLOSED: 'Đã bị đóng'
    };

    return statusMap[status] ||
        status ||
        '';
}