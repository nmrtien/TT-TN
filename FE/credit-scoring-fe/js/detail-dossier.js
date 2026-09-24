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

            <div class="detail-loading" id="detailLoading">
                Đang tải thông tin hồ sơ...
            </div>

            <div
                id="detailContent"
                style="display: none;"
            >

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


                    <!-- THÔNG TIN KHÁCH HÀNG -->

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


                    <!-- THÔNG TIN VỢ / CHỒNG -->

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


                    <!-- THÔNG TIN KHOẢN VAY -->

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

                    <button
                        type="button"
                        class="btn-secondary"
                        id="btnBackDossier">
                        ← Quay lại
                    </button>

                    <button
                        type="button"
                        class="btn-primary"
                        id="btnCompleteDossier">
                        Hoàn thành
                    </button>

                </div>

            </div>

        </div>
    `;

    registerDetailDossierEvents();

    await loadDetailDossier(applicationId);
}


/**
 * Gọi API lấy chi tiết task
 */
async function loadDetailDossier(applicationId) {

    try {

        // const response = await fetch(
        //     `${API_BASE_URL}/scoring/api/v1/scoring/${encodeURIComponent(taskId)}/tasks`,
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

        detailApplication = data.application;

        detailModels = Array.isArray(data.models)
            ? data.models
            : [];

        console.log(
            'Detail task:',
            detailTask
        );

        console.log(
            'Application:',
            detailApplication
        );

        console.log(
            'Models:',
            detailModels
        );

        renderApplication();

        renderModels();

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

                                                ${
                                                    questions
                                                        .map(
                                                            (
                                                                question,
                                                                questionIndex
                                                            ) => `
                                                                <tr>

                                                                    <td>
                                                                        ${
                                                                            questionIndex + 1
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
                                                                            class="question-answer"
                                                                            data-question-id="${escapeHtml(
                                                                                question.id || ''
                                                                            )}"
                                                                            value="${escapeHtml(
                                                                                question.questionAnswer || ''
                                                                            )}"
                                                                            placeholder="Nhập câu trả lời"
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
function registerDetailDossierEvents() {

    const btnBack =
        document.getElementById('btnBackDossier');

    if (btnBack) {

        btnBack.addEventListener(
            'click',
            function () {

                loadInprogressDossiersPage();

            }
        );
    }


    const btnComplete =
        document.getElementById('btnCompleteDossier');

    if (btnComplete) {

        btnComplete.addEventListener(
            'click',
            async function () {

                await completeDossier();

            }
        );
    }
}


async function completeDossier() {

    collectQuestionAnswers();
    if (!detailTask) {

        showToast(
            'Không tìm thấy thông tin task để hoàn thành.',
            'error'
        );

        return;
    }

    const btnComplete =
        document.getElementById('btnCompleteDossier');

    try {

        // Disable button để tránh click nhiều lần
        if (btnComplete) {
            btnComplete.disabled = true;
            btnComplete.textContent = 'Đang hoàn thành...';
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


        const message = await response.text();

        let body = null;

        if (message) {

            try {

                body = JSON.parse(message);

            } catch (error) {

                console.error(
                    'Complete task response không phải JSON:',
                    error
                );

            }
        }


        // =====================================================
        // HTTP STATUS KHÁC 200
        // =====================================================

        if (response.status !== 200) {

            const errorMessage =
                body?.errorMsg ||
                body?.message ||
                body?.error ||
                `Không thể hoàn thành hồ sơ. HTTP ${response.status}`;

            showToast(
                errorMessage,
                'error'
            );

            return;
        }


        // =====================================================
        // HTTP 200 NHƯNG BODY KHÔNG HỢP LỆ
        // =====================================================

        if (!body || !body.id) {

            const errorMessage =
                body?.errorMsg ||
                'Hoàn thành hồ sơ không thành công.';

            showToast(
                errorMessage,
                'error'
            );

            return;
        }


        // =====================================================
        // COMPLETE THÀNH CÔNG
        // =====================================================

        showToast(
            'Hoàn thành hồ sơ thành công.',
            'success'
        );


        // Đợi một chút để user nhìn thấy toast
        setTimeout(function () {

            window.location.reload();

        }, 500);


    } catch (error) {

        console.error(
            'Complete dossier error:',
            error
        );

        showToast(
            error.message ||
            'Có lỗi xảy ra khi hoàn thành hồ sơ.',
            'error'
        );

    } finally {

        if (btnComplete) {

            btnComplete.disabled = false;

            btnComplete.textContent =
                'Hoàn thành';

        }
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