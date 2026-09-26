function loadCreateDossierPage() {

    setPageHeader(
        'Khởi tạo hồ sơ',
        'Nhập thông tin khách hàng và khoản vay'
    );

    const pageContent = document.getElementById('page-content');

    pageContent.innerHTML = `

        <section class="content">

            <div class="content-card">

                <div class="dossier-form">

                    <div class="dossier-person-row">

                        <div class="dossier-card">

                            <div class="dossier-card-header">

                                <div class="dossier-section-icon">
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <circle cx="12" cy="8" r="3.5"></circle>
                                        <path d="M5 20c.8-3.5 3.4-5.5 7-5.5s6.2 2 7 5.5"></path>
                                    </svg>
                                </div>

                                <div class="dossier-card-title">
                                    <h3>Thông tin khách hàng</h3>
                                    <p>Thông tin định danh và liên hệ của khách hàng</p>
                                </div>

                            </div>

                            <div class="dossier-card-body">

                                <div class="dossier-fields">

                                    <div class="dossier-field">
                                        <label for="cif" class="dossier-label required">
                                            CIF
                                        </label>
                                        <input
                                            type="text"
                                            id="cif"
                                            class="dossier-input"
                                            placeholder="Nhập CIF khách hàng"
                                        >
                                    </div>

                                    <div class="dossier-field">
                                        <label for="legalDocType" class="dossier-label required">
                                            Loại giấy tờ
                                        </label>
                                        <select
                                            id="legalDocType"
                                            class="dossier-select"
                                        >
                                            <option value="">Chọn loại giấy tờ</option>
                                            <option value="CCCD">CCCD</option>
                                            <option value="CMND">CMND</option>
                                            <option value="HC">Hộ chiếu</option>
                                        </select>
                                    </div>

                                    <div class="dossier-field">
                                        <label for="legalDocNumber" class="dossier-label required">
                                            Số giấy tờ
                                        </label>
                                        <input
                                            type="text"
                                            id="legalDocNumber"
                                            class="dossier-input"
                                            placeholder="Nhập số giấy tờ"
                                        >
                                    </div>

                                    <div class="dossier-field">
                                        <label for="fullName" class="dossier-label required">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            class="dossier-input"
                                            placeholder="Nhập họ và tên"
                                        >
                                    </div>

                                    <div class="dossier-field">
                                        <label for="birthday" class="dossier-label required">
                                            Ngày sinh
                                        </label>
                                        <input
                                            type="text"
                                            id="birthday"
                                            class="dossier-input"
                                            placeholder="dd/MM/yyyy"
                                        >
                                    </div>

                                    <div class="dossier-field">
                                        <label for="phone" class="dossier-label required">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="text"
                                            id="phone"
                                            class="dossier-input"
                                            placeholder="Nhập số điện thoại"
                                        >
                                    </div>

                                    <div class="dossier-field">
                                        <label for="email" class="dossier-label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            class="dossier-input"
                                            placeholder="Nhập email"
                                        >
                                    </div>

                                    <div class="dossier-field">
                                        <label for="address" class="dossier-label required">
                                            Địa chỉ
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            class="dossier-input"
                                            placeholder="Nhập địa chỉ"
                                        >
                                    </div>

                                </div>

                            </div>

                        </div>


                        <div class="dossier-card">

                            <div class="dossier-card-header">

                                <div class="dossier-section-icon">
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <circle cx="9" cy="8" r="3"></circle>
                                        <circle cx="17" cy="9" r="2.5"></circle>
                                        <path d="M3 20c.7-3.5 2.8-5.5 6-5.5s5.3 2 6 5.5"></path>
                                        <path d="M15 15c2.8.2 4.5 1.8 5 4.5"></path>
                                    </svg>
                                </div>

                                <div class="dossier-card-title">
                                    <h3>Thông tin vợ / chồng</h3>
                                    <p>Thông tin người liên quan của khách hàng</p>
                                </div>

                            </div>

                            <div class="dossier-card-body">

                                <div class="dossier-fields">

                                    <div class="dossier-field">
                                        <label for="spouseCif" class="dossier-label">
                                            CIF vợ / chồng
                                        </label>
                                        <input
                                            type="text"
                                            id="spouseCif"
                                            class="dossier-input"
                                            placeholder="Nhập CIF"
                                        >
                                    </div>

                                    <div class="dossier-field">
                                        <label for="spouseLegalDocType" class="dossier-label">
                                            Loại giấy tờ
                                        </label>
                                        <select
                                            id="spouseLegalDocType"
                                            class="dossier-select"
                                        >
                                            <option value="">Chọn loại giấy tờ</option>
                                            <option value="CCCD">CCCD</option>
                                            <option value="CMND">CMND</option>
                                            <option value="HC">Hộ chiếu</option>
                                        </select>
                                    </div>

                                    <div class="dossier-field">
                                        <label for="spouseLegalDocNumber" class="dossier-label">
                                            Số giấy tờ
                                        </label>
                                        <input
                                            type="text"
                                            id="spouseLegalDocNumber"
                                            class="dossier-input"
                                            placeholder="Nhập số giấy tờ"
                                        >
                                    </div>

                                    <div class="dossier-field">
                                        <label for="spouseFullName" class="dossier-label">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            id="spouseFullName"
                                            class="dossier-input"
                                            placeholder="Nhập họ và tên"
                                        >
                                    </div>

                                    <div class="dossier-field">
                                        <label for="spousePhone" class="dossier-label">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="text"
                                            id="spousePhone"
                                            class="dossier-input"
                                            placeholder="Nhập số điện thoại"
                                        >
                                    </div>

                                    <div class="dossier-field">
                                        <label for="spouseEmail" class="dossier-label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="spouseEmail"
                                            class="dossier-input"
                                            placeholder="Nhập email"
                                        >
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    <div class="dossier-card">

                        <div class="dossier-card-header">

                            <div class="dossier-section-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="14"
                                        rx="2"
                                    ></rect>
                                    <path d="M3 10h18"></path>
                                    <path d="M7 15h4"></path>
                                </svg>
                            </div>

                            <div class="dossier-card-title">
                                <h3>Thông tin khoản vay</h3>
                                <p>Thông tin phục vụ chấm điểm tín dụng</p>
                            </div>

                        </div>

                        <div class="dossier-card-body">

                            <div class="dossier-loan-fields">

                                <div class="dossier-field">
                                    <label for="loanPurpose" class="dossier-label required">
                                        Mục đích vay
                                    </label>
                                    <select
                                        id="loanPurpose"
                                        class="dossier-select"
                                    >
                                        <option value="">Chọn mục đích vay</option>
                                        <option value="MUA_NHA">Mua nhà</option>
                                        <option value="MUA_XE">Mua xe</option>
                                        <option value="TIEU_DUNG">Tiêu dùng</option>
                                        <option value="KINH_DOANH">Kinh doanh</option>
                                        <option value="KHAC">Khác</option>
                                    </select>
                                </div>

                                <div class="dossier-field">
                                    <label for="loanTerm" class="dossier-label required">
                                        Thời hạn vay
                                    </label>
                                    <select
                                        id="loanTerm"
                                        class="dossier-select"
                                    >
                                        <option value="">Chọn thời hạn vay</option>
                                        <option value="6">6 tháng</option>
                                        <option value="12">12 tháng</option>
                                        <option value="24">24 tháng</option>
                                        <option value="36">36 tháng</option>
                                        <option value="48">48 tháng</option>
                                        <option value="60">60 tháng</option>
                                    </select>
                                </div>

                            </div>

                        </div>

                    </div>


                    <div class="dossier-actions">

                        <button
                            type="button"
                            id="btnResetDossier"
                            class="dossier-action-button dossier-reset-button"
                        >
                            Làm mới
                        </button>

                        <button
                            type="button"
                            id="btnCreateDossier"
                            class="dossier-action-button dossier-submit-button"
                        >
                            Khởi tạo hồ sơ
                        </button>

                    </div>

                </div>

            </div>


            <div id="toastCreateDossier" class="toast hidden">
                <span id="toastCreateDossierMessage"></span>
            </div>

        </section>

    `;

    registerCreateDossierEvents();
}

function registerCreateDossierEvents() {

    // ===============================
    // LÀM MỚI FORM
    // ===============================

    document
        .getElementById('btnResetDossier')
        ?.addEventListener('click', function () {

            document
                .querySelectorAll(
                    '.dossier-form input, .dossier-form select'
                )
                .forEach(function (element) {
                    element.value = '';
                });

        });


    // ===============================
    // KHỞI TẠO HỒ SƠ
    // ===============================

    document
        .getElementById('btnCreateDossier')
        ?.addEventListener('click', async function () {

            console.log('CLICK KHỞI TẠO HỒ SƠ');


            // ===============================
            // LẤY USER ĐĂNG NHẬP
            // ===============================

            let currentUser = {};

            try {

                currentUser = JSON.parse(
                    localStorage.getItem('credit_scoring_user') || '{}'
                );

            } catch (error) {

                console.error(
                    'Không parse được thông tin user đăng nhập:',
                    error
                );

            }


            const createBy =
                String(currentUser?.userName || '').trim();


            // ===============================
            // TẠO REQUEST
            // ===============================

            const dossier = {

                // Người khởi tạo hồ sơ
                createBy: createBy,

                // ===============================
                // THÔNG TIN KHÁCH HÀNG
                // ===============================

                cif: document
                    .getElementById('cif')
                    .value
                    .trim(),

                legalDocType: document
                    .getElementById('legalDocType')
                    .value,

                legalDocNumber: document
                    .getElementById('legalDocNumber')
                    .value
                    .trim(),

                fullName: document
                    .getElementById('fullName')
                    .value
                    .trim(),

                birthday: document
                    .getElementById('birthday')
                    .value
                    .trim(),

                address: document
                    .getElementById('address')
                    .value
                    .trim(),

                phone: document
                    .getElementById('phone')
                    .value
                    .trim(),

                email: document
                    .getElementById('email')
                    .value
                    .trim(),


                // ===============================
                // THÔNG TIN VỢ / CHỒNG
                // ===============================

                spouseCif: document
                    .getElementById('spouseCif')
                    .value
                    .trim(),

                spouseLegalDocType: document
                    .getElementById('spouseLegalDocType')
                    .value,

                spouseLegalDocNumber: document
                    .getElementById('spouseLegalDocNumber')
                    .value
                    .trim(),

                spouseFullName: document
                    .getElementById('spouseFullName')
                    .value
                    .trim(),

                spousePhone: document
                    .getElementById('spousePhone')
                    .value
                    .trim(),

                spouseEmail: document
                    .getElementById('spouseEmail')
                    .value
                    .trim(),


                // ===============================
                // THÔNG TIN KHOẢN VAY
                // ===============================

                loanPurpose: document
                    .getElementById('loanPurpose')
                    .value,

                loanTerm: document
                    .getElementById('loanTerm')
                    .value
            };


            console.log('USER ĐĂNG NHẬP:', currentUser);
            console.log('CREATE BY:', dossier.createBy);
            console.log('DOSSIER:', dossier);


            // ===============================
            // VALIDATE
            // ===============================

            if (!dossier.createBy) {

                showCreateDossierToast(
                    'Không xác định được người đăng nhập',
                    'error'
                );

                return;
            }


            if (!dossier.cif) {

                console.log('VALIDATE CIF');

                showCreateDossierToast(
                    'Vui lòng nhập CIF khách hàng',
                    'error'
                );

                return;
            }


            if (!dossier.legalDocType) {

                showCreateDossierToast(
                    'Vui lòng chọn loại giấy tờ',
                    'error'
                );

                return;
            }


            if (!dossier.legalDocNumber) {

                showCreateDossierToast(
                    'Vui lòng nhập số giấy tờ',
                    'error'
                );

                return;
            }


            if (!dossier.fullName) {

                showCreateDossierToast(
                    'Vui lòng nhập họ và tên',
                    'error'
                );

                return;
            }


            if (!dossier.birthday) {

                showCreateDossierToast(
                    'Vui lòng nhập ngày sinh',
                    'error'
                );

                return;
            }


            if (!dossier.phone) {

                showCreateDossierToast(
                    'Vui lòng nhập số điện thoại',
                    'error'
                );

                return;
            }


            if (!dossier.address) {

                showCreateDossierToast(
                    'Vui lòng nhập địa chỉ',
                    'error'
                );

                return;
            }


            if (!dossier.loanPurpose) {

                showCreateDossierToast(
                    'Vui lòng chọn mục đích vay',
                    'error'
                );

                return;
            }


            if (!dossier.loanTerm) {

                showCreateDossierToast(
                    'Vui lòng chọn thời hạn vay',
                    'error'
                );

                return;
            }


            // ===============================
            // SUBMIT
            // ===============================

            const submitButton =
                document.getElementById('btnCreateDossier');


            try {

                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        'Đang khởi tạo...';

                }


                const response =
                    await createDossier(dossier);


                // ===============================
                // HTTP 200 NHƯNG NGHIỆP VỤ THẤT BẠI
                // ===============================

                if (!response || response.id === null) {

                    showCreateDossierToast(
                        response?.errorMsg ||
                        'Khởi tạo hồ sơ thất bại',
                        'error'
                    );

                    return;
                }


                // ===============================
                // KHỞI TẠO THÀNH CÔNG
                // ===============================

                showCreateDossierToast(
                    'Khởi tạo hồ sơ thành công',
                    'success'
                );


                // ===============================
                // RESET FORM
                // ===============================

                document
                    .querySelectorAll(
                        '.dossier-form input, .dossier-form select'
                    )
                    .forEach(function (element) {

                        element.value = '';

                    });


            } catch (error) {

                console.error(
                    'Create dossier error:',
                    error
                );


                showCreateDossierToast(
                    error.message ||
                    'Khởi tạo hồ sơ thất bại',
                    'error'
                );


            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        'Khởi tạo hồ sơ';

                }

            }

        });
}


function showCreateDossierToast(message, type = 'info') {
    const toast = document.getElementById('toastCreateDossier');
    const toastCreateDossierMessage = document.getElementById('toastCreateDossierMessage');

    if (!toast) {
        return;
    }

    // Clear timer cũ
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }

    // Set message
    if (toastCreateDossierMessage) {
        toastCreateDossierMessage.textContent = message;
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

// ===============================
// CREATE DOSSIER
// ===============================

async function createDossier(dossierData) {

    const response = await fetch(
        `${API_BASE_URL}/scoring/api/v1/scoring`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dossierData)
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
            `Khởi tạo hồ sơ thất bại. HTTP ${response.status}`
        );
    }

    if (!message) {
        return null;
    }

    try {
        return JSON.parse(message);
    } catch (error) {
        return message;
    }
}