

// ===============================
// STATE
// ===============================

let models = [];
let questionsForModel = [];
let selectedModel = null;
let formModeModel = null;

function loadModelsPage() {

    setPageHeader(
        'Quản lý mô hình',
        'Quản lý danh sách mô hình chấm điểm tín dụng'
    );

    document.getElementById('page-content').innerHTML = `
        <section class="content">

    <!-- Page title -->

    <div class="page-title">

        <div class="page-actions">

            <button
                type="button"
                id="btnCreateModel"
                class="btn btn-primary">

                <span class="btn-icon-text">＋</span>

                Tạo mô hình

            </button>

        </div>

    </div>


    <!-- =================================================
         LIST CARD
         ================================================= -->

    <div class="content-card">

        <div class="card-header">

            <div>
                <h2>Danh sách mô hình</h2>

                <p>
                    Tổng số:
                    <strong id="ModelCount">0</strong>
                    mô hình
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

            <table class="model-table">

                <thead>

                <tr>

                    <th class="col-stt">
                        STT
                    </th>

                    <th class="col-id">
                        ID
                    </th>

                    <th class="col-code">
                        Mã mô hình
                    </th>

                    <th>
                        Tên mô hình
                    </th>

                    <th class="col-model">
                        Cấp mô hình
                    </th>

                    <th class="col-action">
                        Thao tác
                    </th>

                </tr>

                </thead>

                <tbody id="ModelTableBody">

                <!-- JavaScript render -->

                </tbody>

            </table>

        </div>


        <!-- =================================================
             EMPTY STATE
             ================================================= -->

        <div
            id="emptyState"
            class="empty-state hidden">

            <div class="empty-icon">
                ?
            </div>

            <div class="empty-title">
                Chưa có mô hình
            </div>

            <div class="empty-description">
                Hiện tại chưa có mô hình nào trong hệ thống.
            </div>

        </div>


        <!-- =================================================
             PAGINATION
             ================================================= -->

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
<div
    id="ModelFormModal"
    class="modal-overlay hidden">

<div
    class="modal Model-modal"
    role="dialog">

    <div class="modal-header">

        <div>

            <h2 id="formModalTitle">
                Tạo mô hình
            </h2>

            <p id="formModalDescription">
                Nhập thông tin mô hình mới
            </p>

        </div>

        <button
            type="button"
            class="modal-close"
            id="btnCloseModelFormModal">

            ×

        </button>

    </div>


    <form id="ModelForm">

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
                    id="ModelId"
                    class="form-control readonly"
                    disabled>

            </div>


            <!-- Model Code -->

            <div class="form-group">

                <label
                    for="modelCode"
                    class="form-label">

                    Mã mô hình
                    <span class="required">*</span>

                </label>

                <input
                    type="text"
                    id="modelCode"
                    name="modelCode"
                    class="form-control"
                    maxlength="50"
                    autocomplete="off"
                    placeholder="Ví dụ: Q005">

                <span
                    id="modelCodeHelp"
                    class="form-help">

                    Mã mô hình phải là duy nhất.
                </span>
            </div>


            <!-- Model Name -->
            <div class="form-group">
                <label
                    for="modelName"
                    class="form-label">

                    Tên mô hình
                    <span class="required">*</span>

                </label>
                <textarea
                    id="modelName"
                    name="modelName"
                    class="form-control Model-name-input"
                    maxlength="500"
                    rows="4"
                    placeholder="Nhập nội dung mô hình..."></textarea>

                <span class="form-help">
                    Nhập nội dung mô hình sử dụng trong hệ thống.
                </span>
            </div>


            <!-- Model Level -->
<div class="form-group">

    <label
        for="modelLevel"
        class="form-label">

        Cấp mô hình
        <span class="required">*</span>

    </label>

    <input
        type="number"
        id="modelLevel"
        name="modelLevel"
        class="form-control"
        min="1"
        max="3"
        step="1"
        placeholder="Nhập cấp mô hình từ 1 đến 3">

    <span class="form-help">
        Cấp mô hình chỉ được phép từ 1 đến 3.
    </span>

</div>

<div class="form-group">
    <label class="form-label">
        Danh sách câu hỏi <span class="required">*</span>
    </label>

    <div id="questionSelection" class="question-model-selection">
        <div class="question-model-loading">
            Đang tải danh sách câu hỏi...
        </div>
    </div>
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
                id="btnSubmitModel"
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

<div id="ModelDetailModal" class="modal-overlay hidden">
    <div class="modal">

        <div class="modal-header">
            <div>
                <h2>Chi tiết mô hình</h2>
                <p>Xem và cập nhật thông tin mô hình</p>
            </div>

            <button
                type="button"
                class="modal-close"
                id="btnCloseModelDetailModal">
                ×
            </button>
        </div>

        <div class="modal-body">

            <div id="detailLoading">
                Đang tải thông tin mô hình...
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
    <label for="detailmodelCode">Mã mô hình</label>
    <input
        type="text"
        id="detailModelCode"
        class="form-control readonly-field"
        readonly>
</div>

<div class="form-group">
    <label for="detailmodelName">Tên mô hình</label>
    <textarea
        id="detailModelName"
        class="form-control"
        rows="4"></textarea>
</div>

<div class="form-group">
    <label for="detailModelLevel" class="form-label">
        Cấp mô hình <span class="required">*</span>
    </label>

    <input
        type="number"
        id="detailModelLevel"
        class="form-control"
        min="1"
        max="3"
        step="1"
        placeholder="Nhập cấp mô hình từ 1 đến 3"
    >

    <span class="form-help">
        Cấp mô hình chỉ được phép từ 1 đến 3.
    </span>
</div>

<div class="form-group">
    <label class="form-label">
        Danh sách câu hỏi <span class="required">*</span>
    </label>

    <div id="detailQuestionSelection" class="question-model-selection">
        <div class="question-model-loading">
            Đang tải danh sách câu hỏi...
        </div>
    </div>
</div>

            </div>

        </div>

        <div class="modal-footer">

            <button
                type="button"
                id="btnCloseModelDetail"
                class="btn btn-secondary">
                Đóng
            </button>

            <button
                type="button"
                id="btnSaveModelDetail"
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

    registerModelEvents();

    loadModels();
}


function renderDetailQuestionSelection(selectedQuestions) {
    const container = document.getElementById('detailQuestionSelection');

    if (!container) return;

    if (!questionsForModel || questionsForModel.length === 0) {
        container.innerHTML = `
            <div class="question-model-empty">
                Chưa có câu hỏi nào
            </div>
        `;
        return;
    }

    const selectedQuestionIds = new Set(
        (selectedQuestions || []).map(question =>
            String(question.id)
        )
    );

    container.innerHTML = questionsForModel.map(question => {
        const checked = selectedQuestionIds.has(
            String(question.id)
        );

        return `
            <label class="question-model-option">
                <input
                    type="checkbox"
                    class="detail-question-model-checkbox"
                    value="${escapeHtml(question.id)}"
                    ${checked ? 'checked' : ''}
                >

                <div class="question-model-option-content">
                    <div class="question-model-header">
                        <span class="question-model-code">
                            ${escapeHtml(question.questionCode || '')}
                        </span>

                        <span class="question-model-name">
                            ${escapeHtml(question.questionName || '')}
                        </span>
                    </div>
                </div>
            </label>
        `;
    }).join('');
}

// ===============================
// DOM EVENTS
// ===============================

function registerModelEvents() {

    // ==========================================
    // NÚT TẠO mô hình
    // ==========================================
    const btnCreateModel =
        document.getElementById('btnCreateModel');

    if (btnCreateModel) {
        btnCreateModel.addEventListener(
            'click',
            openCreateModelModal
        );
    }


    // ==========================================
    // FORM TẠO / CẬP NHẬT mô hình
    // ==========================================
    const ModelForm =
        document.getElementById('ModelForm');

    if (ModelForm) {
        ModelForm.addEventListener(
            'submit',
            handleModelFormSubmit
        );
    }


    // ==========================================
    // MODAL FORM - NÚT X
    // ==========================================
    const btnCloseModelFormModal =
        document.getElementById('btnCloseModelFormModal');

    if (btnCloseModelFormModal) {
        btnCloseModelFormModal.addEventListener(
            'click',
            closeModelFormModal
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
            closeModelFormModal
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
            loadModels
        );
    }


    // ==========================================
    // MODAL DETAIL - NÚT X
    // ==========================================
    const btnCloseModelDetailModal =
        document.getElementById('btnCloseModelDetailModal');

    if (btnCloseModelDetailModal) {
        btnCloseModelDetailModal.addEventListener(
            'click',
            closeModelDetailModal
        );
    }


    // ==========================================
    // MODAL DETAIL - NÚT ĐÓNG
    // ==========================================
    const btnCloseModelDetail =
        document.getElementById('btnCloseModelDetail');

    if (btnCloseModelDetail) {
        btnCloseModelDetail.addEventListener(
            'click',
            closeModelDetailModal
        );
    }


    // ==========================================
    // MODAL DETAIL - NÚT CẬP NHẬT
    // ==========================================
    const btnSaveModelDetail =
    document.getElementById('btnSaveModelDetail');

if (btnSaveModelDetail) {
    btnSaveModelDetail.addEventListener(
        'click',
        handleModelDetailSave
    );
}


    // ==========================================
    // CLICK RA NGOÀI MODAL FORM
    // ==========================================
    const ModelFormModal =
        document.getElementById('ModelFormModal');

    if (ModelFormModal) {

        ModelFormModal.addEventListener(
            'click',
            function (event) {

                if (event.target === ModelFormModal) {
                    closeModelFormModal();
                }

            }
        );
    }


    // ==========================================
    // CLICK RA NGOÀI MODAL DETAIL
    // ==========================================
    const ModelDetailModal =
        document.getElementById('ModelDetailModal');

    if (ModelDetailModal) {

        ModelDetailModal.addEventListener(
            'click',
            function (event) {

                if (event.target === ModelDetailModal) {
                    closeModelDetailModal();
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
                    'ModelFormModal'
                );

            const detailModal =
                document.getElementById(
                    'ModelDetailModal'
                );

            if (
                formModal &&
                formModal.classList.contains('show')
            ) {
                closeModelFormModal();
            }

            if (
                detailModal &&
                detailModal.classList.contains('show')
            ) {
                closeModelDetailModal();
            }

        }
    );
}


async function handleModelDetailSave() {
    if (!selectedModel) return;

    const id = document.getElementById('detailId').value;
    const modelCode = document
        .getElementById('detailModelCode')
        .value
        .trim();

    const modelName = document
        .getElementById('detailModelName')
        .value
        .trim();

    const modelLevelInput =
        document.getElementById('detailModelLevel');

    const modelLevel = Number(modelLevelInput.value);

    if (!modelCode) {
        showModelToast('Vui lòng nhập mã mô hình', 'error');
        return;
    }

    if (!modelName) {
        showModelToast('Vui lòng nhập tên mô hình', 'error');
        return;
    }

    if (
        !Number.isInteger(modelLevel) ||
        modelLevel < 1 ||
        modelLevel > 3
    ) {
        showModelToast(
            'Cấp mô hình phải là số nguyên từ 1 đến 3',
            'error'
        );
        return;
    }

    const selectedQuestions = getSelectedDetailQuestions();

    if (selectedQuestions.length === 0) {
        showModelToast(
            'Vui lòng chọn ít nhất một câu hỏi',
            'error'
        );
        return;
    }

    try {
        const btnSaveModelDetail =
            document.getElementById('btnSaveModelDetail');

        if (btnSaveModelDetail) {
            btnSaveModelDetail.disabled = true;
            btnSaveModelDetail.textContent = 'Đang lưu...';
        }

        console.log('UPDATE DETAIL MODEL:', {
            id,
            modelCode,
            modelName,
            modelLevel,
            questions: selectedQuestions
        });

        await updateModel(
            id,
            modelCode,
            modelName,
            modelLevel,
            selectedQuestions
        );

        selectedModel.modelCode = modelCode;
        selectedModel.modelName = modelName;
        selectedModel.modelLevel = modelLevel;
        selectedModel.questions = selectedQuestions;

        closeModelDetailModal();

        await loadModels();

        showModelToast('Cập nhật mô hình thành công', 'success');

    } catch (error) {
        console.error('Update Model error:', error);

        showModelToast(
            error.message || 'Cập nhật mô hình thất bại',
            'error'
        );

    } finally {
        const btnSaveModelDetail =
            document.getElementById('btnSaveModelDetail');

        if (btnSaveModelDetail) {
            btnSaveModelDetail.disabled = false;
            btnSaveModelDetail.textContent = 'Lưu thay đổi';
        }
    }
}

// ===============================
// GET ALL ModelS
// ===============================

async function loadModels() {

const tableBody = document.getElementById('ModelTableBody');

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
        `${API_BASE_URL}/configs/api/v1/configs/models`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    if (!response.ok) {
        throw new Error(
            `Không thể lấy danh sách mô hình. HTTP ${response.status}`
        );
    }
    const data = await response.json();
    console.log('models: '+data)
    // Backend trả trực tiếp array
    models = Array.isArray(data) ? data : [];
    renderConfigModels();
} catch (error) {

    console.error('Load Models error:', error);

    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="table-empty">
                    Không thể tải danh sách mô hình
                </td>
            </tr>
        `;
    }

    showModelToast(
        error.message || 'Có lỗi xảy ra khi tải danh sách mô hình',
        'error'
    );
}

}

// ===============================
// RENDER TABLE
// ===============================

function renderConfigModels() {

const tableBody = document.getElementById('ModelTableBody');

const ModelCount = document.getElementById('ModelCount');

if (!tableBody) {
    return;
}

if (ModelCount) {
    ModelCount.textContent = models.length;
}

if (!models || models.length === 0) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="table-empty">
                Không có dữ liệu
            </td>
        </tr>
    `;

    return;
}

tableBody.innerHTML = models.map((Model, index) => {

    return `
        <tr>

            <td class="text-center">
                ${index + 1}
            </td>

            <td>
                <span class="id-text">
                    ${escapeHtml(Model.id)}
                </span>
            </td>

            <td>
                <strong>
                    ${escapeHtml(Model.modelCode)}
                </strong>
            </td>

            <td>
                ${escapeHtml(Model.modelName)}
            </td>

            <td>
                ${
        Model.modelLevel !== null &&
        Model.modelLevel !== undefined
            ? `<span class="model-badge">
                   Cấp ${Model.modelLevel}
               </span>`
            : `<span class="text-muted">-</span>`
    }
            </td>

            <td>
                <div class="table-actions">

                    <button
                        type="button"
                        class="btn-icon btn-view"
                        title="Cập nhật"
                        onclick="viewModel('${escapeJs(Model.id)}')">
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

async function viewModel(id) {
    const modal = document.getElementById('ModelDetailModal');

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
            `${API_BASE_URL}/configs/api/v1/configs/models/${encodeURIComponent(id)}`,
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
                message || `Không thể lấy thông tin mô hình. HTTP ${response.status}`
            );
        }

        const Model = await response.json();

        console.log('========== Model DETAIL ==========');
        console.log('API response:', Model);

        selectedModel = Model;

        // Load danh sách câu hỏi hợp lệ`${API_BASE_URL}/configs/api/v1/configs/models/${encodeURIComponent(id)}`
        const apiUrl = `${API_BASE_URL}/configs/api/v1/configs/questions/detail/${encodeURIComponent(Model.modelCode)}`;
await loadQuestionsForModel(apiUrl);

// Render thông tin detail
renderModelDetail(Model);

        // Ẩn loading
        if (loading) {
            loading.classList.add('hidden');
        }

        // Hiện nội dung
        if (content) {
            content.classList.remove('hidden');
        }

    } catch (error) {
        console.error('Load Model detail error:', error);

        if (loading) {
            loading.textContent =
                error.message || 'Không thể tải thông tin mô hình';
        }

        showModelToast(
            error.message || 'Không thể tải thông tin mô hình',
            'error'
        );
    }
}


function getSelectedDetailQuestions() {
    const checkboxes = document.querySelectorAll(
        '#detailQuestionSelection .detail-question-model-checkbox:checked'
    );

    return Array.from(checkboxes)
        .map(checkbox => {
            return questionsForModel.find(
                question =>
                    String(question.id) === String(checkbox.value)
            );
        })
        .filter(Boolean);
}

// ===============================
// RENDER DETAIL
// ===============================

function renderModelDetail(Model) {
    const detailId = document.getElementById('detailId');
    const detailModelCode = document.getElementById('detailModelCode');
    const detailModelName = document.getElementById('detailModelName');
    const detailModelLevel = document.getElementById('detailModelLevel');

    if (detailId) {
        detailId.value = Model.id || '';
    }

    if (detailModelCode) {
        detailModelCode.value = Model.modelCode || '';
    }

    if (detailModelName) {
        detailModelName.value = Model.modelName || '';
    }

    if (detailModelLevel) {
        detailModelLevel.value =
            Model.modelLevel !== null && Model.modelLevel !== undefined
                ? Model.modelLevel
                : '';
    }

    renderDetailQuestionSelection(Model.questions || []);
}

// ===============================
// OPEN CREATE
// ===============================

function openCreateModelModal() {
    formModeModel = 'create';
    selectedModel = null;

    const modal = document.getElementById('ModelFormModal');
    const form = document.getElementById('ModelForm');
    const modalTitle = document.getElementById('formModalTitle');
    const modelCode = document.getElementById('modelCode');
    const modelName = document.getElementById('modelName');
    const modelLevel = document.getElementById('modelLevel');
    if (form) {
        form.reset();
    }
    if (modalTitle) {
        modalTitle.textContent = 'Tạo mô hình';
    }
    if (modelCode) {
        modelCode.disabled = false;
        modelCode.value = '';
    }
    if (modelName) {
        modelName.value = '';
    }
    if (modelLevel) {
        modelLevel.value = '';
    }

    const apiUrl = `${API_BASE_URL}/configs/api/v1/configs/questions/valid`;
 loadQuestionsForModel(apiUrl);

    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('show');
    }
    if (modelCode) {
        modelCode.focus();
    }
}


// ===============================
// OPEN UPDATE
// ===============================

function editModel(id) {

const Model = models.find(
    item => String(item.id) === String(id)
);

if (!Model) {

    showModelToast(
        'Không tìm thấy mô hình',
        'error'
    );

    return;
}

openModelUpdateModal(Model);

}

function openModelUpdateModal(Model) {
formModeModel = 'update';
selectedModel = Model;
const modal = document.getElementById('ModelFormModal');
const modalTitle = document.getElementById('formModalTitle');
const modelCode = document.getElementById('modelCode');
const modelName = document.getElementById('modelName');
if (modalTitle) {
    modalTitle.textContent = 'Cập nhật mô hình';
}
if (modelCode) {
    modelCode.value = Model.modelCode || '';
    // Update không cho sửa mã mô hình
    modelCode.disabled = true;
}
if (modelName) {
    modelName.value = Model.modelName || '';
}
if (modal) {
    modal.classList.add('show');
}
if (modelName) {
    modelName.focus();
}
}

// ===============================
// SUBMIT CREATE / UPDATE
// ===============================

async function handleModelFormSubmit(event) {
    event.preventDefault();
    const modelCode = document.getElementById('modelCode').value.trim();
    const modelName = document.getElementById('modelName').value.trim();
    if (!modelCode) {
        showModelToast('Vui lòng nhập mã mô hình', 'error');
        return;
    }
    if (!modelName) {
        showModelToast('Vui lòng nhập tên mô hình', 'error');
        return;
    }
    const modelLevelInput = document.getElementById('modelLevel');
    const modelLevel = Number(modelLevelInput.value);

    console.log('modelLevel: '+modelLevel);
    console.log('Number.isInteger(modelLevel): '+Number.isInteger(modelLevel));
if (!Number.isInteger(modelLevel) || modelLevel < 1 || modelLevel > 3) {
    showModelToast('Cấp mô hình phải là số nguyên từ 1 đến 3', 'error');
    return;
}
    const submitButton =
        document.getElementById('btnSubmitModel');
    try {
        const selectedQuestions = getSelectedQuestions();

console.log('selectedQuestions:', selectedQuestions);
if (selectedQuestions.length === 0) {
        showModelToast('Vui lòng chọn ít nhất một câu hỏi', 'error');
        return;
    }
        setFormLoading(true);
        if (formModeModel === 'create') {
            await createModel(
                modelCode,
                modelName, 
                modelLevel,
                selectedQuestions
            );
            // 200 OK
            closeModelFormModal();
            await loadModels();
            showModelToast(
                'THÀNH CÔNG',
                'success'
            );
        } else if (formModeModel === 'update') {
            await updateModel(
                selectedModel.id,
                modelCode,
                modelName, 
                modelLevel,
                selectedQuestions
            );
            // 200 OK
            closeModelFormModal();
            await loadModels();
            showModelToast(
                'THÀNH CÔNG',
                'success'
            );
        }

    } catch (error) {
        console.error('Submit Model error:', error);
        // 400 / 500...
        // Giữ nguyên modal để user sửa dữ liệu
        showModelToast(
            error.message || 'Có lỗi xảy ra',
            'error'
        );
    } finally {
        setFormLoading(false);
    }
}


async function createModel(modelCode, modelName, modelLevel, questions) {
    const requestBody = {
        modelCode: modelCode,
        modelName: modelName,
        modelLevel: modelLevel,
        questions: questions
    };

    console.log('CREATE MODEL REQUEST:', requestBody);
    const response = await fetch(
        `${API_BASE_URL}/configs/api/v1/configs/models`,
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
        throw new Error(
            message || `Tạo mô hình thất bại. HTTP ${response.status}`
        );
    }

    return message;
}

// ===============================
// PUT UPDATE
// PUT /api/v1/configs/Model
// ===============================

async function updateModel(id, modelCode, modelName, modelLevel, questions) {
    const requestBody = {
        id: id,
        modelCode: modelCode,
        modelName: modelName,
        modelLevel: modelLevel,
        questions: questions
    };

    console.log('UPDATE MODEL REQUEST:', requestBody);
    const response = await fetch(
        `${API_BASE_URL}/configs/api/v1/configs/models`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }
    );

const message = await response.text();
    if (!response.ok) {
        throw new Error(
            message || `Cập nhật mô hình thất bại. HTTP ${response.status}`
        );
    }

    return message;
}

// ===============================
// MODAL
// ===============================

function openDetailModal() {
    const modal =
        document.getElementById('ModelDetailModal');

    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('show');
    }
}

function closeModelDetailModal() {
    const modal =
        document.getElementById('ModelDetailModal');

    if (modal) {
        modal.classList.remove('show');
        modal.classList.add('hidden');
    }

    selectedModel = null;
}

function closeModelFormModal() {
    const modal =
        document.getElementById('ModelFormModal');

    if (modal) {
        modal.classList.remove('show');
        modal.classList.add('hidden');
    }

    const form =
        document.getElementById('ModelForm');

    if (form) {
        form.reset();
    }

    const modelCode =
        document.getElementById('modelCode');

    if (modelCode) {
        modelCode.disabled = false;
    }

    selectedModel = null;
    formModeModel = null;
}

// ===============================
// FORM LOADING
// ===============================

function setFormLoading(loading) {

const submitButton =
    document.getElementById('btnSubmitModel');

if (!submitButton) {
    return;
}

if (loading) {

    submitButton.disabled = true;
    submitButton.textContent = 'Đang xử lý...';

} else {

    submitButton.disabled = false;

    submitButton.textContent =
        formModeModel === 'update'
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

function showModelToast(message, type = 'info') {
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

async function loadQuestionsForModel(apiUrl) {
    const container = document.getElementById('questionSelection');

    if (container) {
        container.innerHTML = `
            <div class="question-model-loading">
                Đang tải danh sách câu hỏi...
            </div>
        `;
    }

    try {
        const response = await fetch(
            apiUrl,
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

        questionsForModel = Array.isArray(data) ? data : [];

        renderQuestionSelection();

    } catch (error) {
        console.error('loadQuestionsForModel error:', error);

        if (container) {
            container.innerHTML = `
                <div class="question-model-error">
                    Không thể tải danh sách câu hỏi
                </div>
            `;
        }

        showModelToast(error.message || 'Không thể tải danh sách câu hỏi', 'error');
    }
}


function renderQuestionSelection() {
    const container = document.getElementById('questionSelection');

    if (!container) return;

    if (!questionsForModel || questionsForModel.length === 0) {
        container.innerHTML = `
            <div class="question-model-empty">
                Chưa có câu hỏi nào
            </div>
        `;
        return;
    }

    const selectedQuestionIds = new Set(
        selectedModel?.questions?.map(question => question.id) || []
    );

    container.innerHTML = questionsForModel.map(question => {
        const checked = selectedQuestionIds.has(question.id);

        return `
            <label class="question-model-option">
    <input
        type="checkbox"
        class="question-model-checkbox"
        value="${escapeHtml(question.id)}"
        ${checked ? 'checked' : ''}
    >

    <div class="question-model-option-content">
        <div class="question-model-header">
            <span class="question-model-code">
                ${escapeHtml(question.questionCode || '')}
            </span>

            <span class="question-model-name">
                ${escapeHtml(question.questionName || '')}
            </span>
        </div>
    </div>
</label>
        `;
    }).join('');
}


function getSelectedQuestions() {
    const checkboxes = document.querySelectorAll(
        '#questionSelection .question-model-checkbox:checked'
    );

    return Array.from(checkboxes)
        .map(checkbox => {
            return questionsForModel.find(
                question => question.id === checkbox.value
            );
        })
        .filter(Boolean);
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