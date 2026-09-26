let detailTask = null;

let detailApplication = null;

let detailModels = [];

let currentTaskAction = null;

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
<!-- APPROVED BANNER -->
<!-- ========================= -->

<div
    id="approvedApplicationBanner"
    class="approved-application-banner"
    style="display: none;"
>
    <div class="approved-application-banner-icon">
        ✓
    </div>

    <div class="approved-application-banner-content">
        <div class="approved-application-banner-title">
            Hồ sơ đã được phê duyệt
        </div>

        <div
            class="approved-application-banner-message"
            id="approvedApplicationMessage">
            Hồ sơ này đã được phê duyệt.
        </div>
    </div>
</div>


<!-- ========================= -->
<!-- REJECTED BANNER -->
<!-- ========================= -->

<div
    id="rejectedApplicationBanner"
    class="rejected-application-banner"
    style="display: none;"
>
    <div class="rejected-application-banner-icon">
        !
    </div>

    <div class="rejected-application-banner-content">
        <div class="rejected-application-banner-title">
            Hồ sơ đã bị từ chối
        </div>

        <div
            class="rejected-application-banner-message"
            id="rejectedApplicationMessage">
            Hồ sơ này đã bị từ chối.
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
                            Đóng hồ sơ
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
<!-- MODAL THAO TÁC TASK -->
<!-- ========================= -->

<div
    class="detail-modal-overlay"
    id="taskActionModal"
    style="display: none;">

    <div class="detail-modal">

        <div class="detail-modal-header">

            <div>

                <h3 id="taskActionModalTitle">
                    Đóng hồ sơ
                </h3>

                <span id="taskActionModalSubtitle">
                    Vui lòng nhập lý do đóng hồ sơ
                </span>

            </div>

            <button
                type="button"
                class="detail-modal-close"
                id="btnCloseTaskActionModal">
                ×
            </button>

        </div>


        <div class="detail-modal-body">

            <div class="form-group">

                <label for="taskActionReason">

                    <span id="taskActionReasonLabel">
                        Lý do đóng hồ sơ
                    </span>

                    <span class="required">*</span>

                </label>

                <textarea
                    id="taskActionReason"
                    class="detail-modal-textarea"
                    rows="5"
                    maxlength="1000"
                    placeholder="Yêu cầu nhập lý do">
                </textarea>

                <div
                    class="detail-modal-error"
                    id="taskActionReasonError"
                    style="display: none;">
                    Vui lòng nhập lý do.
                </div>

            </div>

        </div>


        <div class="detail-modal-footer">

            <button
                type="button"
                class="btn-secondary"
                id="btnCancelTaskAction">
                Hủy
            </button>

            <button
                type="button"
                class="btn-task-action"
                id="btnConfirmTaskAction">
                Xác nhận
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
        const roleGroup = user?.roleGroup;

        // TODO: FIX CODE TO TEST
        // const roleGroup = 'RB_RM';

        if (!userName || !roleGroup) {
            throw new Error(
                'Thông tin userName hoặc roleGroup không hợp lệ.'
            );
        }

        const requestBody = {
            applicationId: applicationId,
            userName: userName,
            roleGroup: roleGroup
        };

        console.log(
            'Call detail task:',
            requestBody
        );

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

        let data;

        try {

            data = JSON.parse(message);

        } catch (error) {

            throw new Error(
                'API trả về dữ liệu chi tiết hồ sơ không hợp lệ.'
            );
        }

        if (!data) {
            throw new Error(
                'API không trả về dữ liệu chi tiết hồ sơ.'
            );
        }

        // =====================================================
        // Lưu dữ liệu detail
        // =====================================================

        detailTask = data;

        detailApplication =
            data.application || null;

        detailModels =
            Array.isArray(data.models)
                ? data.models
                : [];

        console.log(
            'Detail task:',
            detailTask
        );

        console.log(
            'Detail application:',
            detailApplication
        );

        console.log(
            'Detail models:',
            detailModels
        );

        // =====================================================
        // Render dữ liệu
        // =====================================================

        renderApplication();

        renderModels();

        // Update button theo task status + role
        updateDetailActionButtons();

        // Check trạng thái cuối của hồ sơ:
        // CLOSED / APPROVED / REJECTED
        checkApplicationFinalStatus();

        // =====================================================
        // Hiển thị content
        // =====================================================

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
                        error?.message ||
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
    if (btnComplete) {
        btnComplete.style.display = 'none';
    }

    if (btnClose) {
        btnClose.style.display = 'none';
    }

    if (btnApprove) {
        btnApprove.style.display = 'none';
    }

    if (btnReject) {
        btnReject.style.display = 'none';
    }


    if (!detailTask) {
        return;
    }


    // =====================================================
    // APPLICATION FINAL STATUS
    // =====================================================

    const applicationStatus =
        getApplicationStatus();

    if (
        applicationStatus === 'CLOSED' ||
        applicationStatus === 'APPROVED' ||
        applicationStatus === 'REJECTED'
    ) {
        return;
    }


    // =====================================================
    // TASK STATUS
    // =====================================================

    const taskStatus =
        String(detailTask.status || '')
            .trim()
            .toUpperCase();

    if (taskStatus !== 'IN_PROGRESS') {
        return;
    }


    // =====================================================
    // USER ROLE
    // =====================================================

    let user = {};

    try {

        user =
            JSON.parse(
                localStorage.getItem(
                    'credit_scoring_user'
                ) || '{}'
            );

    } catch (error) {

        console.error(
            'Không parse được credit_scoring_user:',
            error
        );

        return;
    }


    const roleGroup =
        String(user?.roleGroup || '')
            .trim()
            .toUpperCase();


    // =====================================================
    // RB_RM / RB_CA
    // =====================================================

    if (
        roleGroup === 'RB_RM' ||
        roleGroup === 'RB_CA'
    ) {

        if (btnComplete) {
            btnComplete.style.display =
                'inline-flex';
        }

        if (btnClose) {
            btnClose.style.display =
                'inline-flex';
        }

    }

    // =====================================================
    // RB_AM
    // =====================================================

    else if (roleGroup === 'RB_AM') {

        if (btnApprove) {
            btnApprove.style.display =
                'inline-flex';
        }

        if (btnReject) {
            btnReject.style.display =
                'inline-flex';
        }
    }
}

function showApprovedApplicationBanner(reason) {

    const banner =
        document.getElementById(
            'approvedApplicationBanner'
        );

    const message =
        document.getElementById(
            'approvedApplicationMessage'
        );

    if (!banner) {
        return;
    }

    if (message) {

        message.innerHTML = `
            <div>
                Hồ sơ này đã được phê duyệt và không thể tiếp tục xử lý.
            </div>

            <div class="approved-application-reason">
                <strong>Ý kiến phê duyệt hồ sơ:</strong>
                <span>
                    ${escapeHtml(
                        String(reason || '').trim() ||
                        'Không có lý do phê duyệt hồ sơ.'
                    )}
                </span>
            </div>
        `;
    }

    banner.style.display = 'flex';
}


function showRejectedApplicationBanner(reason) {

    const banner =
        document.getElementById(
            'rejectedApplicationBanner'
        );

    const message =
        document.getElementById(
            'rejectedApplicationMessage'
        );

    if (!banner) {
        return;
    }

    if (message) {

        message.innerHTML = `
            <div>
                Hồ sơ này đã bị từ chối và không thể tiếp tục xử lý.
            </div>

            <div class="rejected-application-reason">
                <strong>Lý do từ chối hồ sơ:</strong>
                <span>
                    ${escapeHtml(
                        String(reason || '').trim() ||
                        'Không có lý do từ chối hồ sơ.'
                    )}
                </span>
            </div>
        `;
    }

    banner.style.display = 'flex';
}


function hideAllApplicationBanners() {

    const bannerIds = [
        'closedApplicationBanner',
        'approvedApplicationBanner',
        'rejectedApplicationBanner'
    ];

    bannerIds.forEach(id => {

        const banner =
            document.getElementById(id);

        if (banner) {
            banner.style.display = 'none';
        }
    });
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
/**
 * Render danh sách model và câu hỏi
 *
 * Rule nhập câu trả lời:
 * 1. Task phải IN_PROGRESS
 * 2. Model phải có roleGroup
 * 3. Model.roleGroup phải giống user.roleGroup
 *
 * Nếu không thỏa -> readonly
 */
function renderModels() {

    const container =
        document.getElementById('modelsContainer');

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

    // =========================
    // USER ĐĂNG NHẬP
    // =========================

    let currentUser = {};

    try {

        currentUser =
            JSON.parse(
                localStorage.getItem('credit_scoring_user') || '{}'
            );

    } catch (error) {

        console.error(
            'Không parse được credit_scoring_user:',
            error
        );

        currentUser = {};
    }

    const userRoleGroup =
        String(
            currentUser?.roleGroup || ''
        )
            .trim()
            .toUpperCase();


    // =========================
    // TASK STATUS
    // =========================

    const taskStatus =
        String(
            detailTask?.status || ''
        )
            .trim()
            .toUpperCase();

    const taskInProgress =
        taskStatus === 'IN_PROGRESS';


    console.log(
        'Render Models - Task status:',
        taskStatus
    );

    console.log(
        'Render Models - User roleGroup:',
        userRoleGroup
    );


    // =========================
    // RENDER MODELS
    // =========================

    container.innerHTML =
        detailModels
            .map((model, modelIndex) => {

                const questions =
                    Array.isArray(model.questions)
                        ? model.questions
                        : [];


                // =========================
                // ROLE GROUP CỦA MODEL
                // =========================

                const modelRoleGroup =
                    String(
                        model?.roleGroup || ''
                    )
                        .trim()
                        .toUpperCase();


                // =========================
                // CHECK QUYỀN NHẬP
                // =========================

                const canEditModel =
                    taskInProgress &&
                    !!modelRoleGroup &&
                    !!userRoleGroup &&
                    modelRoleGroup === userRoleGroup;


                console.log(
                    `Model ${model.modelCode || modelIndex + 1}:`,
                    {
                        modelRoleGroup,
                        userRoleGroup,
                        taskStatus,
                        canEditModel
                    }
                );


                return `
                    <div class="detail-card model-card">

                        <!-- =========================
                             MODEL HEADER
                             ========================= -->

                        <div class="model-header">

                            <div>
                                <span class="model-index">
                                    Mô hình ${modelIndex + 1}
                                </span>
                            </div>

                            <span class="model-role-group">
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


                        <!-- =========================
                             QUESTIONS
                             ========================= -->

                        ${
                            questions.length === 0
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
                                                        ) => {

                                                            const questionAnswer =
                                                                question.questionAnswer || '';


                                                            return `
                                                                <tr>

                                                                    <!-- STT -->
                                                                    <td>
                                                                        ${questionIndex + 1}
                                                                    </td>


                                                                    <!-- MÃ CÂU HỎI -->
                                                                    <td>
                                                                        <span class="question-code">
                                                                            ${escapeHtml(
                                                                                question.questionCode || ''
                                                                            )}
                                                                        </span>
                                                                    </td>


                                                                    <!-- CÂU HỎI -->
                                                                    <td>
                                                                        <div class="question-name">
                                                                            ${escapeHtml(
                                                                                question.questionName || ''
                                                                            )}
                                                                        </div>
                                                                    </td>


                                                                    <!-- CÂU TRẢ LỜI -->
                                                                    <td>

                                                                        <div
                                                                            class="question-answer-wrapper"
                                                                        >

                                                                            <input
                                                                                type="text"
                                                                                class="question-answer ${
                                                                                    canEditModel
                                                                                        ? ''
                                                                                        : 'question-answer-readonly'
                                                                                }"
                                                                                data-question-id="${escapeHtml(
                                                                                    question.id || ''
                                                                                )}"
                                                                                data-model-role-group="${escapeHtml(
                                                                                    modelRoleGroup
                                                                                )}"
                                                                                value="${escapeHtml(
                                                                                    questionAnswer
                                                                                )}"
                                                                                placeholder="${
                                                                                    canEditModel
                                                                                        ? 'Nhập câu trả lời'
                                                                                        : 'Không có quyền nhập'
                                                                                }"
                                                                                title="${
                                                                                    canEditModel
                                                                                        ? 'Nhập câu trả lời'
                                                                                        : 'Bạn không có quyền nhập câu trả lời cho mô hình này'
                                                                                }"
                                                                                ${
                                                                                    canEditModel
                                                                                        ? ''
                                                                                        : 'readonly'
                                                                                }
                                                                            >

                                                                            ${
                                                                                canEditModel
                                                                                    ? ''
                                                                                    : `
                                                                                        <span
                                                                                            class="question-readonly-icon"
                                                                                            title="Không có quyền nhập"
                                                                                        >
                                                                                            🔒
                                                                                        </span>
                                                                                    `
                                                                            }

                                                                        </div>

                                                                    </td>

                                                                </tr>
                                                            `;
                                                        }
                                                    )
                                                    .join('')}

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


    // =========================
    // MODAL TASK ACTION
    // =========================

    const btnCloseTaskActionModal =
        document.getElementById('btnCloseTaskActionModal');

    const btnCancelTaskAction =
        document.getElementById('btnCancelTaskAction');

    const btnConfirmTaskAction =
        document.getElementById('btnConfirmTaskAction');

    const taskActionReason =
        document.getElementById('taskActionReason');


    // =========================
    // HOÀN THÀNH
    // =========================

    btnCompleteDossier?.addEventListener(
        'click',
        async function () {

            await completeDossier('COMPLETED');

        }
    );


    // =========================
    // ĐÓNG
    // =========================

    btnCloseDossier?.addEventListener(
        'click',
        function () {

            openTaskActionModal('CLOSED');

        }
    );


    // =========================
    // PHÊ DUYỆT
    // =========================

    btnApproveDossier?.addEventListener(
        'click',
        function () {

            openTaskActionModal('APPROVED');

        }
    );


    // =========================
    // TỪ CHỐI
    // =========================

    btnRejectDossier?.addEventListener(
        'click',
        function () {

            openTaskActionModal('REJECTED');

        }
    );


    // =========================
    // ĐÓNG MODAL
    // =========================

    btnCloseTaskActionModal?.addEventListener(
        'click',
        function () {

            closeTaskActionModal();

        }
    );


    // =========================
    // HỦY
    // =========================

    btnCancelTaskAction?.addEventListener(
        'click',
        function () {

            closeTaskActionModal();

        }
    );


    // =========================
    // XÁC NHẬN
    // =========================

    btnConfirmTaskAction?.addEventListener(
        'click',
        async function () {

            await confirmTaskAction();

        }
    );


    // =========================
    // CTRL + ENTER
    // =========================

    taskActionReason?.addEventListener(
        'keydown',
        async function (event) {

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key === 'Enter'
            ) {

                event.preventDefault();

                await confirmTaskAction();

            }

        }
    );


    // =========================
    // NHẬP LÝ DO
    // =========================

    taskActionReason?.addEventListener(
        'input',
        function () {

            const errorElement =
                document.getElementById(
                    'taskActionReasonError'
                );

            if (
                errorElement &&
                String(this.value || '').trim()
            ) {

                errorElement.textContent = '';

                errorElement.style.display =
                    'none';
            }

        }
    );
}


/**
 * Xác nhận thao tác CLOSED / APPROVED / REJECTED
 */
async function confirmTaskAction() {

    if (!currentTaskAction) {
        console.error('Không xác định được task action.');
        return;
    }

    const reasonInput = document.getElementById('taskActionReason');
    const reasonError = document.getElementById('taskActionReasonError');

    if (!reasonInput) {
        console.error('Không tìm thấy #taskActionReason.');
        return;
    }

    const reason = String(reasonInput.value || '').trim();

    // Reset error
    if (reasonError) {
        reasonError.style.display = 'none';
    }

    // Bắt buộc nhập lý do
    if (!reason) {

        if (reasonError) {
            reasonError.textContent =
                'Vui lòng nhập lý do ' +
                (
                    currentTaskAction === 'CLOSED'
                        ? 'Đóng hồ sơ.'
                        : currentTaskAction === 'APPROVED'
                            ? 'Phê duyệt hồ sơ.'
                            : 'Từ chối hồ sơ.'
                );

            reasonError.style.display = 'block';
        }

        reasonInput.focus();
        return;
    }

    if (!detailTask) {
        console.error('Không có detailTask.');
        alert('Không tìm thấy thông tin task.');
        return;
    }

    // Gán lý do vào task để gửi xuống backend
    detailTask.comment = reason;

    console.log('Task action:', currentTaskAction);
    console.log('Task comment:', detailTask.comment);

    // Gọi API complete
    const success = await completeDossier(currentTaskAction);

    // Chỉ đóng modal khi API thành công
    if (success) {
        closeTaskActionModal();
    }
}


function openTaskActionModal(action) {

    const modal =
        document.getElementById('taskActionModal');

    const title =
        document.getElementById(
            'taskActionModalTitle'
        );

    const subtitle =
        document.getElementById(
            'taskActionModalSubtitle'
        );

    const reasonLabel =
        document.getElementById(
            'taskActionReasonLabel'
        );

    const reasonInput =
        document.getElementById(
            'taskActionReason'
        );

    const errorElement =
        document.getElementById(
            'taskActionReasonError'
        );

    const confirmButton =
        document.getElementById(
            'btnConfirmTaskAction'
        );


    if (!modal) {
        console.error(
            'Không tìm thấy #taskActionModal'
        );

        return;
    }


    // Lưu action hiện tại
    currentTaskAction = action;


    // Reset
    if (reasonInput) {
        reasonInput.value = '';
    }

    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }


    // =========================
    // ĐÓNG
    // =========================

    if (action === 'CLOSED') {

        if (title) {
            title.textContent =
                'Đóng hồ sơ';
        }

        if (subtitle) {
            subtitle.textContent =
                'Vui lòng nhập lý do đóng hồ sơ';
        }

        if (reasonLabel) {
            reasonLabel.textContent =
                'Lý do đóng hồ sơ';
        }

        if (reasonInput) {
            reasonInput.placeholder =
                'Yêu cầu nhập lý do Đóng hồ sơ';
        }

        if (errorElement) {
            errorElement.textContent =
                'Vui lòng nhập lý do Đóng hồ sơ.';
        }

        if (confirmButton) {
            confirmButton.textContent =
                'Xác nhận đóng';

            confirmButton.className =
                'btn-task-action btn-task-close';
        }

    }


    // =========================
    // PHÊ DUYỆT
    // =========================

    else if (action === 'APPROVED') {

        if (title) {
            title.textContent =
                'Phê duyệt hồ sơ';
        }

        if (subtitle) {
            subtitle.textContent =
                'Vui lòng nhập lý do phê duyệt hồ sơ';
        }

        if (reasonLabel) {
            reasonLabel.textContent =
                'Lý do phê duyệt';
        }

        if (reasonInput) {
            reasonInput.placeholder =
                'Yêu cầu nhập lý do Phê duyệt hồ sơ';
        }

        if (errorElement) {
            errorElement.textContent =
                'Vui lòng nhập lý do Phê duyệt hồ sơ.';
        }

        if (confirmButton) {
            confirmButton.textContent =
                'Xác nhận phê duyệt';

            confirmButton.className =
                'btn-task-action btn-task-approve';
        }

    }


    // =========================
    // TỪ CHỐI
    // =========================

    else if (action === 'REJECTED') {

        if (title) {
            title.textContent =
                'Từ chối hồ sơ';
        }

        if (subtitle) {
            subtitle.textContent =
                'Vui lòng nhập lý do từ chối hồ sơ';
        }

        if (reasonLabel) {
            reasonLabel.textContent =
                'Lý do từ chối';
        }

        if (reasonInput) {
            reasonInput.placeholder =
                'Yêu cầu nhập lý do Từ chối hồ sơ';
        }

        if (errorElement) {
            errorElement.textContent =
                'Vui lòng nhập lý do Từ chối hồ sơ.';
        }

        if (confirmButton) {
            confirmButton.textContent =
                'Xác nhận từ chối';

            confirmButton.className =
                'btn-task-action btn-task-reject';
        }

    }


    // Hiển thị modal
    modal.style.display = 'flex';


    // Focus textarea
    setTimeout(() => {

        reasonInput?.focus();

    }, 100);
}

function closeTaskActionModal() {

    const modal =
        document.getElementById(
            'taskActionModal'
        );

    const reasonInput =
        document.getElementById(
            'taskActionReason'
        );

    const errorElement =
        document.getElementById(
            'taskActionReasonError'
        );


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


    currentTaskAction = null;
}



function closeTaskActionModal() {

    const modal =
        document.getElementById(
            'taskActionModal'
        );

    const reasonInput =
        document.getElementById(
            'taskActionReason'
        );

    const errorElement =
        document.getElementById(
            'taskActionReasonError'
        );


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


    currentTaskAction = null;
}


// function openCloseDossierModal() {

//     const modal = document.getElementById('closeDossierModal');
//     const reasonInput = document.getElementById('closeDossierReason');
//     const errorElement = document.getElementById('closeDossierReasonError');

//     if (!modal) {
//         console.error('Không tìm thấy #closeDossierModal');
//         return;
//     }

//     if (reasonInput) {
//         reasonInput.value = '';
//     }

//     if (errorElement) {
//         errorElement.textContent = '';
//         errorElement.style.display = 'none';
//     }

//     modal.style.display = 'flex';

//     setTimeout(() => {
//         reasonInput?.focus();
//     }, 100);
// }


// function closeCloseDossierModal() {

//     const modal = document.getElementById('closeDossierModal');
//     const reasonInput = document.getElementById('closeDossierReason');
//     const errorElement = document.getElementById('closeDossierReasonError');

//     if (modal) {
//         modal.style.display = 'none';
//     }

//     if (reasonInput) {
//         reasonInput.value = '';
//     }

//     if (errorElement) {
//         errorElement.textContent = '';
//         errorElement.style.display = 'none';
//     }
// }


// async function confirmCloseDossier() {

//     const reasonInput = document.getElementById('closeDossierReason');
//     const errorElement = document.getElementById('closeDossierReasonError');

//     if (!reasonInput) {
//         console.error('Không tìm thấy #closeDossierReason');
//         return;
//     }

//     const reason = String(reasonInput.value || '').trim();

//     // Validate lý do
//     if (!reason) {

//         if (errorElement) {
//             errorElement.textContent =
//                 'Vui lòng nhập lý do Đóng hồ sơ.';
//             errorElement.style.display = 'block';
//         }

//         reasonInput.focus();

//         return;
//     }

//     if (!detailTask) {
//         alert('Không tìm thấy thông tin task.');
//         return;
//     }

//     // Xóa error
//     if (errorElement) {
//         errorElement.textContent = '';
//         errorElement.style.display = 'none';
//     }

//     /*
//      * Quan trọng:
//      * Gán lý do trực tiếp vào detailTask
//      */
//     detailTask.comment = reason;

//     /*
//      * completeDossier() sẽ tiếp tục gán:
//      *
//      * detailTask.completeType = 'CLOSED';
//      *
//      * và gửi toàn bộ detailTask lên backend.
//      */
//     const success = await completeDossier('CLOSED');

//     /*
//      * Chỉ đóng modal khi API thành công.
//      * Nếu API lỗi thì giữ modal để user có thể sửa/thử lại.
//      */
//     if (success) {
//         closeCloseDossierModal();
//     }
// }

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



function checkApplicationFinalStatus() {

    if (!detailApplication) {
        return false;
    }

    const status =
        getApplicationStatus();

    hideAllApplicationBanners();


    // =====================================================
    // CLOSED
    // =====================================================

    if (status === 'CLOSED') {

        const reason =
            detailApplication?.comment ||
            detailTask?.comment ||
            '';

        showClosedApplicationBanner(reason);

        hideAllTaskActions();

        return true;
    }


    // =====================================================
    // APPROVED
    // =====================================================

    if (status === 'APPROVED') {

        const reason =
            detailApplication?.comment ||
            detailTask?.comment ||
            '';

        showApprovedApplicationBanner(reason);

        hideAllTaskActions();

        return true;
    }


    // =====================================================
    // REJECTED
    // =====================================================

    if (status === 'REJECTED') {

        const reason =
            detailApplication?.comment ||
            detailTask?.comment ||
            '';

        showRejectedApplicationBanner(reason);

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

    // =====================================================
    // VALIDATE LÝ DO
    // CLOSED / APPROVED / REJECTED đều bắt buộc có lý do
    // =====================================================

    const reasonRequiredMessages = {
        CLOSED: 'Vui lòng nhập lý do Đóng hồ sơ.',
        APPROVED: 'Vui lòng nhập lý do Phê duyệt hồ sơ.',
        REJECTED: 'Vui lòng nhập lý do Từ chối hồ sơ.'
    };

    if (reasonRequiredMessages[completeType]) {

        const reason =
            String(detailTask.comment || '').trim();

        if (!reason) {

            alert(
                reasonRequiredMessages[completeType]
            );

            return false;
        }

        // Gửi comment đã trim
        detailTask.comment = reason;
    }


    // =====================================================
    // THU THẬP CÂU TRẢ LỜI
    // =====================================================

    collectQuestionAnswers();


    // =====================================================
    // GÁN COMPLETE TYPE
    // =====================================================

    detailTask.completeType = completeType;


    console.log(
        '========== COMPLETE TASK REQUEST =========='
    );

    console.log(
        'Complete type:',
        completeType
    );

    console.log(
        'Request:',
        detailTask
    );

    console.log(
        '==========================================='
    );


    // =====================================================
    // DISABLE TOÀN BỘ ACTION BUTTON
    // =====================================================

    const buttons = [
        document.getElementById('btnCompleteDossier'),
        document.getElementById('btnCloseDossier'),
        document.getElementById('btnApproveDossier'),
        document.getElementById('btnRejectDossier')
    ];

    buttons.forEach(button => {

        if (button) {
            button.disabled = true;
        }

    });


    const completeButton =
        document.getElementById(
            'btnCompleteDossier'
        );

    const closeButton =
        document.getElementById(
            'btnCloseDossier'
        );

    const approveButton =
        document.getElementById(
            'btnApproveDossier'
        );

    const rejectButton =
        document.getElementById(
            'btnRejectDossier'
        );


    // =====================================================
    // LƯU TEXT BAN ĐẦU
    // =====================================================

    const oldTexts = {

        complete:
            completeButton?.textContent,

        close:
            closeButton?.textContent,

        approve:
            approveButton?.textContent,

        reject:
            rejectButton?.textContent

    };


    try {

        // =================================================
        // UPDATE BUTTON TEXT
        // =================================================

        if (
            completeType === 'COMPLETED' &&
            completeButton
        ) {

            completeButton.textContent =
                'Đang hoàn thành...';

        }


        if (
            completeType === 'CLOSED' &&
            closeButton
        ) {

            closeButton.textContent =
                'Đang đóng...';

        }


        if (
            completeType === 'APPROVED' &&
            approveButton
        ) {

            approveButton.textContent =
                'Đang phê duyệt...';

        }


        if (
            completeType === 'REJECTED' &&
            rejectButton
        ) {

            rejectButton.textContent =
                'Đang từ chối...';

        }


        // =================================================
        // CALL API
        // =================================================

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


        const responseText =
            await response.text();


        console.log(
            'Complete task HTTP status:',
            response.status
        );

        console.log(
            'Complete task response:',
            responseText
        );


        // =================================================
        // PARSE RESPONSE
        // =================================================

        let responseData = null;

        if (responseText) {

            try {

                responseData =
                    JSON.parse(responseText);

            } catch (error) {

                console.error(
                    'Không parse được response JSON:',
                    error
                );

            }
        }


        // =================================================
        // HTTP ERROR
        // =================================================

        if (!response.ok) {

            const errorMessage =
                responseData?.errorMsg ||
                responseData?.message ||
                responseData?.error ||
                responseText ||
                `HTTP ${response.status}`;

            throw new Error(errorMessage);
        }


        // =================================================
        // EMPTY RESPONSE
        // =================================================

        if (!responseData) {

            throw new Error(
                'API không trả về dữ liệu task.'
            );
        }


        // =================================================
        // BACKEND BUSINESS ERROR
        // =================================================

        if (responseData.errorMsg) {

            throw new Error(
                responseData.errorMsg
            );
        }


        // =================================================
        // UPDATE DATA
        // =================================================

        detailTask =
            responseData;

        detailApplication =
            responseData.application ||
            detailApplication;

        detailModels =
            Array.isArray(responseData.models)
                ? responseData.models
                : detailModels;


        console.log(
            'detailTask sau khi complete:',
            detailTask
        );

        console.log(
            'detailApplication sau khi complete:',
            detailApplication
        );


        // =================================================
        // RENDER LẠI UI
        // =================================================

        renderApplication();

        renderModels();

        updateDetailActionButtons();

        /*
         * Quan trọng:
         * checkApplicationFinalStatus() sẽ tự xử lý:
         *
         * CLOSED
         * APPROVED
         * REJECTED
         *
         * và tự hide action button.
         */
        checkApplicationFinalStatus();


        // =================================================
        // SUCCESS MESSAGE
        // =================================================

        let successMessage =
            'Thực hiện thành công.';

        if (completeType === 'COMPLETED') {

            successMessage =
                'Hoàn thành task thành công.';

        } else if (completeType === 'CLOSED') {

            successMessage =
                'Đóng hồ sơ thành công.';

        } else if (completeType === 'APPROVED') {

            successMessage =
                'Phê duyệt hồ sơ thành công.';

        } else if (completeType === 'REJECTED') {

            successMessage =
                'Từ chối hồ sơ thành công.';
        }


        alert(successMessage);


        return true;


    } catch (error) {

        console.error(
            '========== COMPLETE TASK ERROR =========='
        );

        console.error(
            'Error object:',
            error
        );

        console.error(
            'Error message:',
            error?.message
        );

        console.error(
            'Error stack:',
            error?.stack
        );

        console.error(
            'Complete type:',
            completeType
        );

        console.error(
            'Detail task:',
            detailTask
        );

        console.error(
            '=========================================='
        );


        alert(
            error?.message ||
            'Không thể thực hiện thao tác.'
        );


        return false;


    } finally {

        // =================================================
        // RESTORE BUTTON
        // =================================================

        if (completeButton) {

            completeButton.disabled = false;

            completeButton.textContent =
                oldTexts.complete ||
                'Hoàn thành';
        }


        if (closeButton) {

            closeButton.disabled = false;

            closeButton.textContent =
                oldTexts.close ||
                'Đóng';
        }


        if (approveButton) {

            approveButton.disabled = false;

            approveButton.textContent =
                oldTexts.approve ||
                'Phê duyệt';
        }


        if (rejectButton) {

            rejectButton.disabled = false;

            rejectButton.textContent =
                oldTexts.reject ||
                'Từ chối';
        }


        /*
         * Sau khi restore button,
         * kiểm tra lại trạng thái cuối.
         *
         * Nếu CLOSED / APPROVED / REJECTED
         * thì checkApplicationFinalStatus()
         * sẽ hide chúng lại.
         */
        checkApplicationFinalStatus();
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