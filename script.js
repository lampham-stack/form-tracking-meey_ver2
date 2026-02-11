// ===== 1. TRACKING NGUỒN (SOURCE) & PHÍM TẮT DEBUG =====
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

let groupSource = 'direct';
const urlSource = getURLParameter('utm_source');
const urlCampaign = getURLParameter('utm_campaign') || 'no_campaign';
if (urlSource) {
    groupSource = urlSource;
    sessionStorage.setItem('trafficSource', urlSource);
} else {
    groupSource = sessionStorage.getItem('trafficSource') || 'direct';
}

// Hàm tạo ô Debug ẩn - Chỉ hiện khi gõ Shift + D
window.addEventListener('keydown', function(e) {
    if (e.shiftKey && e.key === 'D') {
        let debugDiv = document.getElementById('debug-mode-box');
        if (!debugDiv) {
            debugDiv = document.createElement('div');
            debugDiv.id = 'debug-mode-box';
            debugDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #ff6b6b; color: white; padding: 10px; border-radius: 4px; z-index: 9999; font-family: monospace;';
            document.body.appendChild(debugDiv);
        }
        debugDiv.style.display = debugDiv.style.display === 'none' ? 'block' : 'none';
        debugDiv.innerHTML = `<strong>Source:</strong> ${sessionStorage.getItem('trafficSource') || groupSource}`;
    }
});

// ===== 2. QUẢN LÝ CÁC BƯỚC (STEPS) =====
const step0 = document.getElementById('step0');
const step1 = document.getElementById('step1');
const nextBtn0 = document.getElementById('nextBtn0');
const prevBtn1 = document.getElementById('prevBtn1');
const userName = document.getElementById('userName');
const userPhone = document.getElementById('userPhone');

function goToStep(stepNumber) {
    step0.classList.toggle('active', stepNumber === 0);
    step1.classList.toggle('active', stepNumber === 1);
    
    document.getElementById('stepIndicator0').className = stepNumber === 0 ? 'step active' : 'step completed';
    document.getElementById('stepIndicator1').className = stepNumber === 1 ? 'step active' : 'step';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

nextBtn0.addEventListener('click', function() {
    if (!userName.value.trim() || userPhone.value.trim().length < 9) {
        alert('Vui lòng nhập đúng họ tên và số điện thoại');
        return;
    }
    goToStep(1);
});

prevBtn1.addEventListener('click', () => goToStep(0));

// Chỉ cho nhập số vào ô điện thoại
userPhone.addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
});

// Logic chọn sản phẩm độc quyền cho "Chưa xài sản phẩm nào"
const productCheckboxes = document.querySelectorAll('input[name="products"]');
const productNone = document.getElementById('productNone');

productNone.addEventListener('change', function() {
    if (this.checked) {
        productCheckboxes.forEach(cb => { if(cb !== productNone) cb.checked = false; });
    }
});

productCheckboxes.forEach(cb => {
    if (cb !== productNone) {
        cb.addEventListener('change', function() {
            if (this.checked) productNone.checked = false;
        });
    }
});

// ===== 3. GỬI DỮ LIỆU =====
const form = document.getElementById('surveyForm');

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const selectedProducts = Array.from(document.querySelectorAll('input[name="products"]:checked'));
    if (selectedProducts.length === 0) {
        alert('Vui lòng chọn ít nhất 1 sản phẩm');
        return;
    }

    // FIX LỖI SỐ ĐIỆN THOẠI THỪA SỐ 0
    let cleanPhone = userPhone.value.trim();
    if (cleanPhone.startsWith('0')) {
        cleanPhone = cleanPhone.substring(1);
    }
    const fullPhone = cleanPhone ? `+84${cleanPhone}` : '';

    const formData = {
        timestamp: new Date().toISOString(),
        name: userName.value.trim(),
        phone: fullPhone,
        products: selectedProducts.map(cb => cb.value).join(', '),
        source: sessionStorage.getItem('trafficSource') || groupSource,
        campaign: urlCampaign
    };

    const submitBtn = e.submitter;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Đang gửi...';

    try {
        await fetch('https://script.google.com/macros/s/AKfycby5Kc-SZOhGIa431zbldsxgFip8pOuLy4GAX-Ms_BBRXUgYsatEQBaKyKF1kX9Cdj7J/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        document.getElementById('surveyForm').style.display = 'none';
        document.querySelector('.step-indicator').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
    } catch (error) {
        alert('Lỗi gửi dữ liệu. Thử lại sau!');
        submitBtn.disabled = false;
    }
});
