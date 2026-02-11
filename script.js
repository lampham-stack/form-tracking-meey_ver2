// ===== URL PARAMETER TRACKING =====
// CRITICAL: Capture URL parameters IMMEDIATELY when script loads
// to prevent loss from redirects or URL changes

function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Capture source IMMEDIATELY (before any potential redirects)
let groupSource = 'direct'; // Default value

// Try to get from URL first
const urlSource = getURLParameter('source');
if (urlSource) {
    groupSource = urlSource;
    // Save to sessionStorage to persist across page interactions
    sessionStorage.setItem('trafficSource', urlSource);
    console.log('✅ Source captured from URL:', urlSource);
} else {
    // Check if we have it saved from before
    const savedSource = sessionStorage.getItem('trafficSource');
    if (savedSource) {
        groupSource = savedSource;
        console.log('✅ Source retrieved from sessionStorage:', savedSource);
    } else {
        console.log('⚠️ No source parameter found - using "direct"');
    }
}

// Debug logging
console.log('=== URL TRACKING DEBUG ===');
console.log('Full URL:', window.location.href);
console.log('Search params:', window.location.search);
console.log('All URL parameters:');
const allParams = new URLSearchParams(window.location.search);
for (let [key, value] of allParams.entries()) {
    console.log(`  ${key} = ${value}`);
}
console.log('FINAL Traffic Source:', groupSource);
console.log('======================');

// Add visual debug indicator
window.addEventListener('DOMContentLoaded', function() {
    const debugDiv = document.createElement('div');
    debugDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #ff6b6b; color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; z-index: 9999; font-family: monospace; box-shadow: 0 2px 8px rgba(0,0,0,0.2);';
    debugDiv.innerHTML = `<strong>Source:</strong> ${groupSource}`;
    document.body.appendChild(debugDiv);
    
    // Update debug div if source changes
    setInterval(() => {
        const currentSource = sessionStorage.getItem('trafficSource') || 'direct';
        debugDiv.innerHTML = `<strong>Source:</strong> ${currentSource}`;
    }, 1000);
});

// State management
let currentStep = 0; // Start from intro (step 0)

// DOM elements
const form = document.getElementById('surveyForm');
const successMessage = document.getElementById('successMessage');

// Step indicators
const stepIndicator0 = document.getElementById('stepIndicator0');
const stepIndicator1 = document.getElementById('stepIndicator1');
const stepIndicator2 = document.getElementById('stepIndicator2');

// Step 0: Info (Intro + Name + Phone)
const step0 = document.getElementById('step0');
const nextBtn0 = document.getElementById('nextBtn0');
const userName = document.getElementById('userName');
const userPhone = document.getElementById('userPhone');

// Step 1: Products
const step1 = document.getElementById('step1');
const prevBtn1 = document.getElementById('prevBtn1');
const productCheckboxes = document.querySelectorAll('input[name="products"]');
const productNone = document.getElementById('productNone');

// Step 0: Next button (validate name + phone)
nextBtn0.addEventListener('click', function () {
    if (!userName.value.trim()) {
        alert('Vui lòng nhập tên của bạn');
        userName.focus();
        return;
    }

    const phone = userPhone.value.trim();
    if (!phone) {
        alert('Vui lòng nhập số điện thoại');
        userPhone.focus();
        return;
    }

    if (phone.length < 9) {
        alert('Số điện thoại không hợp lệ. Vui lòng nhập ít nhất 9 chữ số');
        userPhone.focus();
        return;
    }

    goToStep(1);
});

// Step 1: Previous button
prevBtn1.addEventListener('click', function () {
    goToStep(0);
});

// Product selection logic - "Chưa xài sản phẩm nào" exclusive
productNone.addEventListener('change', function () {
    if (this.checked) {
        productCheckboxes.forEach(cb => {
            if (cb !== productNone) {
                cb.checked = false;
            }
        });
    }
});

// Other products uncheck "Chưa xài sản phẩm nào"
productCheckboxes.forEach(cb => {
    if (cb !== productNone) {
        cb.addEventListener('change', function () {
            if (this.checked) {
                productNone.checked = false;
            }
        });
    }
});

// Phone input validation - only numbers
userPhone.addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9]/g, '');
});

// Navigation function
function goToStep(stepNumber) {
    // Hide all steps
    step0.classList.remove('active');
    step1.classList.remove('active');

    // Reset all step indicators
    stepIndicator0.classList.remove('active', 'completed');
    stepIndicator1.classList.remove('active', 'completed');
    stepIndicator2.classList.remove('active', 'completed');

    if (stepNumber === 0) {
        step0.classList.add('active');
        stepIndicator0.classList.add('active');
        currentStep = 0;
    } else if (stepNumber === 1) {
        step1.classList.add('active');
        stepIndicator0.classList.add('completed');
        stepIndicator1.classList.add('active');
        currentStep = 1;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Form submission
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validate product selection (name and contact already validated in previous steps)
    const selectedProducts = Array.from(document.querySelectorAll('input[name="products"]:checked'));
    if (selectedProducts.length === 0) {
        alert('Vui lòng chọn ít nhất 1 sản phẩm');
        return;
    }

    // Collect data
    const phone = userPhone.value.trim();
    const productsValues = selectedProducts.map(cb => cb.value).join(', ');
    const fullPhone = phone ? `+84${phone}` : '';
    
    // Get the latest source value (in case it was updated)
    const finalSource = sessionStorage.getItem('trafficSource') || groupSource || 'direct';

    // Prepare form data
    const formData = {
        timestamp: new Date().toISOString(),
        name: userName.value.trim(),
        phone: fullPhone,
        products: productsValues,
        source: finalSource
    };
    
    // Debug: Log what we're about to send
    console.log('📤 SENDING TO GOOGLE SHEETS:');
    console.log('  Timestamp:', formData.timestamp);
    console.log('  Name:', formData.name);
    console.log('  Phone:', formData.phone);
    console.log('  Products:', formData.products);
    console.log('  Source:', formData.source);
    console.log('  Full payload:', JSON.stringify(formData, null, 2));

    // Disable submit button
    const submitBtn = e.submitter;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Đang gửi...';

    try {
        // Send to Google Sheets
        await sendToGoogleSheets(formData);

        // Show success message
        document.querySelector('.form-wrapper form').style.display = 'none';
        document.querySelector('.step-indicator').style.display = 'none';
        successMessage.style.display = 'block';

        // Update step indicator to completed
        stepIndicator1.classList.remove('active');
        stepIndicator1.classList.add('completed');
        stepIndicator2.classList.add('active');
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Có lỗi xảy ra khi gửi form. Vui lòng thử lại!');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Gửi Khảo Sát ✓';
    }
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to send data to Google Sheets
async function sendToGoogleSheets(data) {
    // ✅ URL Apps Script đã được cập nhật
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby5Kc-SZOhGIa431zbldsxgFip8pOuLy4GAX-Ms_BBRXUgYsatEQBaKyKF1kX9Cdj7J/exec';

    // Log to console
    console.log('Form Data:', data);
    console.log('---');
    console.log('Tên:', data.name);
    console.log('Số điện thoại:', data.phone);
    console.log('Sản phẩm quan tâm:', data.products);
    console.log('Nguồn:', data.source);

    // Send to Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    return true;
}
