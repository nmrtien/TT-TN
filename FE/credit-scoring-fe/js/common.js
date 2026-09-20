function goToPage(page) {
    const isInPages = window.location.pathname.includes('/pages/');
    location.href = isInPages ? page : `pages/${page}`;
}

function shell(active, title, subtitle) {
    document.getElementById('app').innerHTML = `
        <aside class="sidebar">
            <div class="brand">CREDIT SCORING</div>

            <div class="nav-item ${active === 'dashboard' ? 'active' : ''}"
                 onclick="location.href='../index.html'">
                <span class="nav-icon">⌂</span>
                <span>Tổng quan</span>
            </div>

            <div class="nav-item ${active === 'users' ? 'active' : ''}">
    <span class="nav-icon">🪪</span>
    <span>Người dùng</span>
</div>

            <!-- HỒ SƠ CHẤM ĐIỂM -->
            <div class="nav-group ${['create-dossier', 'unassigned-dossiers', 'processing-dossiers', 'approved-dossiers', 'rejected-dossiers', 'closed-dossiers'].includes(active) ? 'open' : ''}">

                <div class="nav-item nav-parent"
                     onclick="toggleGroup(this)">
                    <span class="nav-icon">▤</span>
                    <span class="nav-text">Hồ sơ chấm điểm</span>
                    <span class="nav-arrow">›</span>
                </div>

                <div class="nav-children">

                    <div class="nav-child ${active === 'create-dossier' ? 'active' : ''}"
                         onclick="event.stopPropagation(); location.href='dossiers-create.html'">
                        <span class="child-dot">•</span>
                        <span>Khởi tạo Hồ sơ</span>
                    </div>

                    <div class="nav-child ${active === 'unassigned-dossiers' ? 'active' : ''}"
                         onclick="event.stopPropagation(); location.href='dossiers-unassigned.html'">
                        <span class="child-dot">•</span>
                        <span>Hồ sơ Chưa phân công</span>
                    </div>

                    <div class="nav-child ${active === 'processing-dossiers' ? 'active' : ''}"
                         onclick="event.stopPropagation(); location.href='dossiers-processing.html'">
                        <span class="child-dot">•</span>
                        <span>Hồ sơ Đang xử lý</span>
                    </div>

                    <div class="nav-child ${active === 'approved-dossiers' ? 'active' : ''}"
                         onclick="event.stopPropagation(); location.href='dossiers-approved.html'">
                        <span class="child-dot">•</span>
                        <span>Hồ sơ Đã được duyệt</span>
                    </div>

                    <div class="nav-child ${active === 'rejected-dossiers' ? 'active' : ''}"
                         onclick="event.stopPropagation(); location.href='dossiers-rejected.html'">
                        <span class="child-dot">•</span>
                        <span>Hồ sơ Bị từ chối</span>
                    </div>

                    <div class="nav-child ${active === 'closed-dossiers' ? 'active' : ''}"
                         onclick="event.stopPropagation(); location.href='dossiers-closed.html'">
                        <span class="child-dot">•</span>
                        <span>Hồ sơ Đã bị đóng</span>
                    </div>

                </div>
            </div>

                   

            <!-- CẤU HÌNH HỆ THỐNG -->
            <div class="nav-group ${active === 'questions' || active === 'models' ? 'open' : ''}">

                <div class="nav-item nav-parent"
                     onclick="toggleGroup(this)">
                    <span class="nav-icon">⚙</span>
                    <span class="nav-text">Cấu hình hệ thống</span>
                    <span class="nav-arrow">›</span>
                </div>

                <div class="nav-children">

                    <div class="nav-child ${active === 'questions' ? 'active' : ''}"
     onclick="event.stopPropagation(); loadQuestionsPage()">
    <span class="child-dot">•</span>
    <span>Câu hỏi</span>
</div>

                    <div class="nav-child ${active === 'models' ? 'active' : ''}"
                         onclick="event.stopPropagation(); loadModelsPage()">
                        <span class="child-dot">•</span>
                        <span>Mô hình</span>
                    </div>

                </div>
            </div>

     


        </aside>

        <main class="main">

            <header class="topbar">

            
                <div class="user">
                    <span>🔔</span>

                    <div class="avatar">NT</div>

                    <div>
                        <b>Nguyễn Văn Tiến</b>
                        <small style="display:block;color:#71819a">
                            Quản trị hệ thống
                        </small>
                    </div>
                </div>

            </header>

            <section class="content">

                <div class="page-title">
                    <div>
                        <h1>${title}</h1>
                        <p>${subtitle}</p>
                    </div>
                </div>

                <div id="page-content"></div>

            </section>

        </main>
    `;
}


function toggleGroup(element) {
    const group = element.closest('.nav-group');
    if (group) {
        group.classList.toggle('open');
    }
}


function toggleSystemConfig() {
    const group = document.querySelector('.nav-group');

    if (group) {
        group.classList.toggle('open');
    }
}


function statusBadge(status) {

    const map = {
        'Đang xử lý': 'orange',
        'Đã hoàn tất': 'green',
        'Đã phê duyệt': 'purple',
        'Đang chấm điểm': 'blue',
        'Bị đóng': 'red'
    };

    return `
        <span class="badge ${map[status] || 'blue'}">
            ● ${status}
        </span>
    `;
}


function setPageHeader(title, subtitle) {
    const titleElement = document.querySelector('.page-title h1');
    const subtitleElement = document.querySelector('.page-title p');

    if (titleElement) {
        titleElement.textContent = title;
    }

    if (subtitleElement) {
        subtitleElement.textContent = subtitle;
    }
}