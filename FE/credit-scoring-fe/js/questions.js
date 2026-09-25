let questions = [];
let selectedQuestion = null;
let formMode = null;

let currentPageQuestion = 1;
let pageSizeQuestion = 5;


function loadQuestionsPage() {
    setPageHeader(
        'Quản lý câu hỏi',
        'Quản lý danh sách câu hỏi chấm điểm tín dụng'
    );
    document.getElementById('page-content').innerHTML = `
        <section class="content">
    <div class="page-title">
        <div class="page-actions">
            <button
                type="button"
                id="btnCreateQuestion"
                class="btn btn-primary">
                <span class="btn-icon-text">＋</span>
                Tạo câu hỏi
            </button>
        </div>
    </div>

    <div class="content-card">
        <div class="card-header">
            <div>
                <h2>Danh sách câu hỏi</h2>
                <p>
                    Tổng số:
                    <strong id="questionCount">0</strong>
                    câu hỏi
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
        <!-- =================================================
             TABLE
             ================================================= -->
        <div class="table-wrapper">
            <table class="question-table">
                <thead>
                <tr>
                    <th class="col-stt">
                        STT
                    </th>
                    <th class="col-id">
                        ID
                    </th>
                    <th class="col-code">
                        Mã câu hỏi
                    </th>
                    <th>
                        Tên câu hỏi
                    </th>
                    <th class="col-model">
                        Mô hình
                    </th>
                    <th class="col-action">
                        Thao tác
                    </th>
                </tr>
                </thead>
                <tbody id="questionTableBody">
                <!-- JavaScript render -->
                </tbody>
            </table>
        </div>
        <div
            id="emptyState"
            class="empty-state hidden">
            <div class="empty-icon">
                ?
            </div>
            <div class="empty-title">
                Chưa có câu hỏi
            </div>
            <div class="empty-description">
                Hiện tại chưa có câu hỏi nào trong hệ thống.
            </div>
        </div>

        <div
    id="questionPagination"
    class="pagination">
    <div
        id="questionPaginationList"
        class="pagination-list">
    </div>
</div>

    </div>

</section> 
<div
    id="questionFormModal"
    class="modal-overlay hidden">

<div
    class="modal question-modal"
    role="dialog">

    <div class="modal-header">

        <div>

            <h2 id="formModalTitle">
                Tạo câu hỏi
            </h2>

            <p id="formModalDescription">
                Nhập thông tin câu hỏi mới
            </p>

        </div>

        <button
            type="button"
            class="modal-close"
            id="btnCloseQuestionFormModal">

            ×

        </button>

    </div>


    <form id="questionForm">

        <div class="modal-body">

            <!-- Error -->

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
                    id="questionId"
                    class="form-control readonly"
                    disabled>

            </div>


            <!-- Question Code -->

            <div class="form-group">

                <label
                    for="questionCode"
                    class="form-label">

                    Mã câu hỏi
                    <span class="required">*</span>

                </label>

                <input
                    type="text"
                    id="questionCode"
                    name="questionCode"
                    class="form-control"
                    maxlength="50"
                    autocomplete="off"
                    placeholder="Ví dụ: Q005">

                <span
                    id="questionCodeHelp"
                    class="form-help">

                    Mã câu hỏi phải là duy nhất.

                </span>

            </div>


            <!-- Question Name -->

            <div class="form-group">

                <label
                    for="questionName"
                    class="form-label">

                    Tên câu hỏi
                    <span class="required">*</span>

                </label>

                <textarea
                    id="questionName"
                    name="questionName"
                    class="form-control question-name-input"
                    maxlength="500"
                    rows="4"
                    placeholder="Nhập nội dung câu hỏi..."></textarea>

                <span class="form-help">
                    Nhập nội dung câu hỏi sử dụng trong hệ thống.
                </span>

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
                id="btnSubmitQuestion"
                class="btn btn-primary">

                Tạo mới

            </button>

        </div>

    </form>

</div>

</div>

<!-- =========================================================
     DETAIL MODAL
     ========================================================= -->

<div id="questionDetailModal" class="modal-overlay hidden">
    <div class="modal">

        <div class="modal-header">
            <div>
                <h2>Chi tiết câu hỏi</h2>
                <p>Xem và cập nhật thông tin câu hỏi</p>
            </div>

            <button
                type="button"
                class="modal-close"
                id="btnCloseQuestionDetailModal">
                ×
            </button>
        </div>

        <div class="modal-body">

            <div id="detailLoading">
                Đang tải thông tin câu hỏi...
            </div>

            <div id="detailContent" class="hidden">

                <div class="form-group">
    <label for="detailId">ID</label>
    <input
        type="text"
        id="detailId"
        class="form-control readonly-field"
        readonly>
</div>

<div class="form-group">
    <label for="detailQuestionCode">Mã câu hỏi</label>
    <input
        type="text"
        id="detailQuestionCode"
        class="form-control readonly-field"
        readonly>
</div>

<div class="form-group">
    <label for="detailQuestionName">Tên câu hỏi</label>
    <textarea
        id="detailQuestionName"
        class="form-control"
        rows="4"></textarea>
</div>

            </div>

        </div>

        <div class="modal-footer">

            <button
                type="button"
                id="btnCloseQuestionDetail"
                class="btn btn-secondary">
                Đóng
            </button>

            <button
                type="button"
                id="btnSaveQuestionDetail"
                class="btn btn-primary">
                Lưu thay đổi
            </button>

        </div>

    </div>
</div>
<!-- =========================================================
     TOAST
     ========================================================= -->

<div
    id="toast"
    class="toast hidden">

<span id="toastMessage"></span>

</div>

    `;

    registerQuestionEvents();

    loadQuestions();
}


// ===============================
// DOM EVENTS
// ===============================

function registerQuestionEvents() {

    // ==========================================
    // NÚT TẠO CÂU HỎI
    // ==========================================
    const btnCreateQuestion =
        document.getElementById('btnCreateQuestion');

    if (btnCreateQuestion) {
        btnCreateQuestion.addEventListener(
            'click',
            openCreateQuestionModal
        );
    }


    // ==========================================
    // FORM TẠO / CẬP NHẬT CÂU HỎI
    // ==========================================
    const questionForm =
        document.getElementById('questionForm');

    if (questionForm) {
        questionForm.addEventListener(
            'submit',
            handleQuestionFormSubmit
        );
    }


    // ==========================================
    // MODAL FORM - NÚT X
    // ==========================================
    const btnCloseQuestionFormModal =
        document.getElementById('btnCloseQuestionFormModal');

    if (btnCloseQuestionFormModal) {
        btnCloseQuestionFormModal.addEventListener(
            'click',
            closeQuestionFormModal
        );
    }


    // ==========================================
    // MODAL FORM - NÚT HỦY
    // ==========================================
    const btnCancelForm =
        document.getElementById('btnCancelForm');

    if (btnCancelForm) {
        btnCancelForm.addEventListener(
            'click',
            closeQuestionFormModal
        );
    }


    // ==========================================
    // NÚT REFRESH
    // ==========================================
    const btnRefresh =
        document.getElementById('btnRefresh');

    if (btnRefresh) {
        btnRefresh.addEventListener(
            'click',
            loadQuestions
        );
    }


    // ==========================================
    // MODAL DETAIL - NÚT X
    // ==========================================
    const btnCloseQuestionDetailModal =
        document.getElementById('btnCloseQuestionDetailModal');

    if (btnCloseQuestionDetailModal) {
        btnCloseQuestionDetailModal.addEventListener(
            'click',
            closeQuestionDetailModal
        );
    }


    // ==========================================
    // MODAL DETAIL - NÚT ĐÓNG
    // ==========================================
    const btnCloseQuestionDetail =
        document.getElementById('btnCloseQuestionDetail');

    if (btnCloseQuestionDetail) {
        btnCloseQuestionDetail.addEventListener(
            'click',
            closeQuestionDetailModal
        );
    }


    // ==========================================
    // MODAL DETAIL - NÚT CẬP NHẬT
    // ==========================================
    const btnSaveQuestionDetail =
    document.getElementById('btnSaveQuestionDetail');

if (btnSaveQuestionDetail) {
    btnSaveQuestionDetail.addEventListener(
        'click',
        handleQuestionDetailSave
    );
}


    // ==========================================
    // CLICK RA NGOÀI MODAL FORM
    // ==========================================
    const questionFormModal =
        document.getElementById('questionFormModal');

    if (questionFormModal) {

        questionFormModal.addEventListener(
            'click',
            function (event) {

                if (event.target === questionFormModal) {
                    closeQuestionFormModal();
                }

            }
        );
    }


    // ==========================================
    // CLICK RA NGOÀI MODAL DETAIL
    // ==========================================
    const questionDetailModal =
        document.getElementById('questionDetailModal');

    if (questionDetailModal) {

        questionDetailModal.addEventListener(
            'click',
            function (event) {

                if (event.target === questionDetailModal) {
                    closeQuestionDetailModal();
                }

            }
        );
    }


    // ==========================================
    // ESC ĐỂ ĐÓNG MODAL
    // ==========================================
    document.addEventListener(
        'keydown',
        function (event) {

            if (event.key !== 'Escape') {
                return;
            }

            const formModal =
                document.getElementById(
                    'questionFormModal'
                );

            const detailModal =
                document.getElementById(
                    'questionDetailModal'
                );

            if (
                formModal &&
                formModal.classList.contains('show')
            ) {
                closeQuestionFormModal();
            }

            if (
                detailModal &&
                detailModal.classList.contains('show')
            ) {
                closeQuestionDetailModal();
            }

        }
    );
}


async function handleQuestionDetailSave() {

    if (!selectedQuestion) {
        return;
    }

    const id =
        document.getElementById('detailId').value;

    const questionCode =
        document.getElementById('detailQuestionCode')
            .value.trim();

    const questionName =
        document.getElementById('detailQuestionName')
            .value.trim();

    if (!questionCode) {
        showQuestionToast(
            'Vui lòng nhập mã câu hỏi',
            'error'
        );
        return;
    }

    if (!questionName) {
        showQuestionToast(
            'Vui lòng nhập tên câu hỏi',
            'error'
        );
        return;
    }

    try {

        const btnSaveQuestionDetail =
            document.getElementById('btnSaveQuestionDetail');

        if (btnSaveQuestionDetail) {
            btnSaveQuestionDetail.disabled = true;
            btnSaveQuestionDetail.textContent = 'Đang lưu...';
        }

        await updateQuestion(
            id,
            questionCode,
            questionName
        );

        // Cập nhật object hiện tại
        selectedQuestion.questionCode =
            questionCode;

        selectedQuestion.questionName =
            questionName;

        // Đóng modal
        closeQuestionDetailModal();

        // Load lại danh sách
        await loadQuestions();

        // Thông báo
        showQuestionToast(
            'Cập nhật câu hỏi thành công',
            'success'
        );

    } catch (error) {

        console.error(
            'Update question error:',
            error
        );

        showQuestionToast(
            error.message ||
            'Cập nhật câu hỏi thất bại',
            'error'
        );

    } finally {

        const btnSaveQuestionDetail =
            document.getElementById('btnSaveQuestionDetail');

        if (btnSaveQuestionDetail) {
            btnSaveQuestionDetail.disabled = false;
            btnSaveQuestionDetail.textContent =
                'Lưu thay đổi';
        }
    }
}

// ===============================
// GET ALL QUESTIONS
// ===============================

async function loadQuestions() {

const tableBody = document.getElementById('questionTableBody');

if (tableBody) {
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="table-loading">
                Đang tải dữ liệu...
            </td>
        </tr>
    `;
}

try {

    const response = await fetch(
        `${API_BASE_URL}/configs/api/v1/configs/questions`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            `Không thể lấy danh sách câu hỏi. HTTP ${response.status}`
        );
    }

    const data = await response.json();

    // Backend trả trực tiếp array
    questions = Array.isArray(data) ? data : [];

    renderQuestions();

} catch (error) {

    console.error('Load questions error:', error);

    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="table-empty">
                    Không thể tải danh sách câu hỏi
                </td>
            </tr>
        `;
    }

    showQuestionToast(
        error.message || 'Có lỗi xảy ra khi tải danh sách câu hỏi',
        'error'
    );
}

}

// ===============================
// RENDER TABLE
// ===============================

function renderQuestions() {
    const tableBody =
        document.getElementById('questionTableBody');

    const questionCount =
        document.getElementById('questionCount');

    if (!tableBody) {
        return;
    }

    if (questionCount) {
        questionCount.textContent = questions.length;
    }

    if (!questions || questions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="table-empty">
                    Không có dữ liệu
                </td>
            </tr>
        `;

        renderQuestionPagination();
        return;
    }

    const totalPages =
        Math.ceil(
            questions.length / pageSizeQuestion
        );

    if (currentPageQuestion > totalPages) {
        currentPageQuestion = totalPages;
    }

    const startIndex =
        (currentPageQuestion - 1) * pageSizeQuestion;

    const endIndex =
        startIndex + pageSizeQuestion;

    const pageQuestions =
        questions.slice(startIndex, endIndex);

    tableBody.innerHTML = pageQuestions
        .map((question, index) => {
            return `
                <tr>
                    <td class="text-center">
                        ${startIndex + index + 1}
                    </td>

                    <td>
                        <span class="id-text">
                            ${escapeHtml(question.id)}
                        </span>
                    </td>

                    <td>
                        <strong>
                            ${escapeHtml(question.questionCode)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(question.questionName)}
                    </td>

                    <td>
                        ${
                            question.modelCode
                                ? `
                                    <span class="model-badge">
                                        ${escapeHtml(question.modelCode)}
                                    </span>
                                  `
                                : `
                                    <span class="text-muted">
                                        -
                                    </span>
                                  `
                        }
                    </td>

                    <td>
                        <div class="table-actions">
                            <button
                                type="button"
                                class="btn-icon btn-view"
                                title="Cập nhật"
                                onclick="viewQuestion('${escapeJs(question.id)}')">
                                ✎
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        })
        .join('');

    renderQuestionPagination();
}


function changeQuestionPage(page) {
    const totalPages =
        Math.ceil(
            questions.length / pageSizeQuestion
        );

    if (page < 1 || page > totalPages) {
        return;
    }

    currentPageQuestion = page;

    renderQuestions();
}

// ===============================
// DETAIL
// ===============================

async function viewQuestion(id) {
    const modal = document.getElementById('questionDetailModal');

    // Mở modal và hiển thị loading
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('show');
    }

    const loading = document.getElementById('detailLoading');
    const content = document.getElementById('detailContent');

    if (loading) {
        loading.classList.remove('hidden');
    }

    if (content) {
        content.classList.add('hidden');
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/configs/api/v1/configs/questions/${encodeURIComponent(id)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            const message = await response.text();
            throw new Error(
                message || `Không thể lấy thông tin câu hỏi. HTTP ${response.status}`
            );
        }

        const question = await response.json();

        console.log('========== QUESTION DETAIL ==========');
        console.log('API response:', question);

        selectedQuestion = question;

        // Render data
        renderQuestionDetail(question);

        // Ẩn loading
        if (loading) {
            loading.classList.add('hidden');
        }

        // Hiện nội dung
        if (content) {
            content.classList.remove('hidden');
        }

    } catch (error) {
        console.error('Load question detail error:', error);

        if (loading) {
            loading.textContent =
                error.message || 'Không thể tải thông tin câu hỏi';
        }

        showQuestionToast(
            error.message || 'Không thể tải thông tin câu hỏi',
            'error'
        );
    }
}

// ===============================
// RENDER DETAIL
// ===============================

function renderQuestionDetail(question) {

    const detailId =
        document.getElementById('detailId');

    const detailQuestionCode =
        document.getElementById('detailQuestionCode');

    const detailQuestionName =
        document.getElementById('detailQuestionName');

    if (detailId) {
        detailId.value = question.id || '';
    }

    if (detailQuestionCode) {
        detailQuestionCode.value =
            question.questionCode || '';
    }

    if (detailQuestionName) {
        detailQuestionName.value =
            question.questionName || '';
    }
}

// ===============================
// OPEN CREATE
// ===============================

function openCreateQuestionModal() {
    formMode = 'create';
    selectedQuestion = null;

    const modal =
        document.getElementById('questionFormModal');

    const form =
        document.getElementById('questionForm');

    const modalTitle =
        document.getElementById('formModalTitle');

    const questionCode =
        document.getElementById('questionCode');

    const questionName =
        document.getElementById('questionName');

    if (form) {
        form.reset();
    }

    if (modalTitle) {
        modalTitle.textContent = 'Tạo câu hỏi';
    }

    if (questionCode) {
        questionCode.disabled = false;
        questionCode.value = '';
    }

    if (questionName) {
        questionName.value = '';
    }

    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('show');
    }

    if (questionCode) {
        questionCode.focus();
    }
}


// ===============================
// OPEN UPDATE
// ===============================

function editQuestion(id) {

const question = questions.find(
    item => String(item.id) === String(id)
);

if (!question) {

    showQuestionToast(
        'Không tìm thấy câu hỏi',
        'error'
    );

    return;
}

openQuestionUpdateModal(question);

}

function openQuestionUpdateModal(question) {
formMode = 'update';
selectedQuestion = question;
const modal = document.getElementById('questionFormModal');
const modalTitle = document.getElementById('formModalTitle');
const questionCode = document.getElementById('questionCode');
const questionName = document.getElementById('questionName');
if (modalTitle) {
    modalTitle.textContent = 'Cập nhật câu hỏi';
}
if (questionCode) {
    questionCode.value = question.questionCode || '';
    // Update không cho sửa mã câu hỏi
    questionCode.disabled = true;
}
if (questionName) {
    questionName.value = question.questionName || '';
}
if (modal) {
    modal.classList.add('show');
}
if (questionName) {
    questionName.focus();
}
}

// ===============================
// SUBMIT CREATE / UPDATE
// ===============================

async function handleQuestionFormSubmit(event) {
    event.preventDefault();
    const questionCode = document.getElementById('questionCode').value.trim();
    const questionName = document.getElementById('questionName').value.trim();
    if (!questionCode) {
        showQuestionToast('Vui lòng nhập mã câu hỏi', 'error');
        return;
    }
    if (!questionName) {
        showQuestionToast('Vui lòng nhập tên câu hỏi', 'error');
        return;
    }
    const submitButton =
        document.getElementById('btnSubmitQuestion');
    try {
        setFormLoading(true);
        if (formMode === 'create') {
            await createQuestion(
                questionCode,
                questionName
            );
            // 200 OK
            closeQuestionFormModal();
            await loadQuestions();
            showQuestionToast(
                'THÀNH CÔNG',
                'success'
            );
        } else if (formMode === 'update') {
            await updateQuestion(
                selectedQuestion.id,
                questionCode,
                questionName
            );
            // 200 OK
            closeQuestionFormModal();
            await loadQuestions();
            showQuestionToast(
                'THÀNH CÔNG',
                'success'
            );
        }

    } catch (error) {
        console.error('Submit question error:', error);
        // 400 / 500...
        // Giữ nguyên modal để user sửa dữ liệu
        showQuestionToast(
            error.message || 'Có lỗi xảy ra',
            'error'
        );
    } finally {
        setFormLoading(false);
    }
}


async function createQuestion(questionCode, questionName) {
    const response = await fetch(
        `${API_BASE_URL}/configs/api/v1/configs/questions`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questionCode: questionCode,
                questionName: questionName
            })
        }
    );

    const message = await response.text();
    if (!response.ok) {
        throw new Error(
            message || `Tạo câu hỏi thất bại. HTTP ${response.status}`
        );
    }

    return message;
}

// ===============================
// PUT UPDATE
// PUT /api/v1/configs/question
// ===============================

async function updateQuestion(id, questionCode, questionName) {
    const response = await fetch(
        `${API_BASE_URL}/configs/api/v1/configs/questions`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                questionCode: questionCode,
                questionName: questionName
            })
        }
    );

const message = await response.text();
    if (!response.ok) {
        throw new Error(
            message || `Cập nhật câu hỏi thất bại. HTTP ${response.status}`
        );
    }

    return message;
}

// ===============================
// MODAL
// ===============================

function openDetailModal() {
    const modal =
        document.getElementById('questionDetailModal');

    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('show');
    }
}

function closeQuestionDetailModal() {
    const modal =
        document.getElementById('questionDetailModal');

    if (modal) {
        modal.classList.remove('show');
        modal.classList.add('hidden');
    }

    selectedQuestion = null;
}

function closeQuestionFormModal() {
    const modal =
        document.getElementById('questionFormModal');

    if (modal) {
        modal.classList.remove('show');
        modal.classList.add('hidden');
    }

    const form =
        document.getElementById('questionForm');

    if (form) {
        form.reset();
    }

    const questionCode =
        document.getElementById('questionCode');

    if (questionCode) {
        questionCode.disabled = false;
    }

    selectedQuestion = null;
    formMode = null;
}

// ===============================
// FORM LOADING
// ===============================

function setFormLoading(loading) {

const submitButton =
    document.getElementById('btnSubmitQuestion');

if (!submitButton) {
    return;
}

if (loading) {

    submitButton.disabled = true;
    submitButton.textContent = 'Đang xử lý...';

} else {

    submitButton.disabled = false;

    submitButton.textContent =
        formMode === 'update'
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

function showQuestionToast(message, type = 'info') {
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


function renderQuestionPagination() {
    const paginationList =
        document.getElementById('questionPaginationList');

    if (!paginationList) {
        return;
    }

    const totalPages =
        Math.ceil(
            questions.length / pageSizeQuestion
        );

    if (totalPages < 1) {
        paginationList.innerHTML = '';
        return;
    }

    let html = '';

    // Previous
    html += `
        <button
            type="button"
            class="page-btn ${currentPageQuestion === 1 ? 'pagination-disabled' : ''}"
            onclick="changeQuestionPage(${currentPageQuestion - 1})">
            ‹
        </button>
    `;

    // Các trang
    for (let page = 1; page <= totalPages; page++) {
        html += `
            <button
                type="button"
                class="page-btn ${page === currentPageQuestion ? 'active' : ''}"
                onclick="changeQuestionPage(${page})">
                ${page}
            </button>
        `;
    }

    // Next
    html += `
        <button
            type="button"
            class="page-btn ${currentPageQuestion === totalPages ? 'pagination-disabled' : ''}"
            onclick="changeQuestionPage(${currentPageQuestion + 1})">
            ›
        </button>
    `;

    paginationList.innerHTML = html;
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