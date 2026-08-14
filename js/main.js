/**
 * Main Interactive Logic for The 30-Day Productivity Reset Landing Page
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Populate dynamic values from CONFIG
    if (typeof CONFIG !== 'undefined') {
        // Price tags
        const priceElements = document.querySelectorAll('.dynamic-price');
        priceElements.forEach(el => {
            el.textContent = `${CONFIG.CURRENCY_SYMBOL}${CONFIG.PRICE}`;
        });

        // Author name
        const authorElements = document.querySelectorAll('.dynamic-author');
        authorElements.forEach(el => {
            el.textContent = CONFIG.AUTHOR_NAME;
        });

        // Product Title
        const titleElements = document.querySelectorAll('.dynamic-title');
        titleElements.forEach(el => {
            el.textContent = CONFIG.PRODUCT_NAME;
        });

        // Cover Images (Single source of truth: CONFIG.BOOK_COVER)
        const coverImages = document.querySelectorAll('.dynamic-cover-img');
        coverImages.forEach(img => {
            img.src = CONFIG.BOOK_COVER || 'assets/ebook-cover.jpg';
        });
    }

    // 2. Optional Preview Images Error Handling (Gracefully hide if missing/404)
    const previewCards = document.querySelectorAll('.preview-thumb');
    previewCards.forEach(thumb => {
        const img = thumb.querySelector('img');
        if (img) {
            img.addEventListener('error', () => {
                thumb.style.display = 'none';
            });
        }
    });

    // 3. Payment Button Click Handler - Every Buy button opens exact Cashfree Payment URL
    const buyButtons = document.querySelectorAll('.js-buy-btn');
    buyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        const paymentUrl =
            (typeof CONFIG !== 'undefined' && CONFIG.CASHFREE_PAYMENT_URL)
                ? CONFIG.CASHFREE_PAYMENT_URL
                : "https://payments.cashfree.com/links?code=Hark9ad4a950_AAAAAAASvY";

        // Google Ads conversion + then Cashfree
        if (typeof gtag_report_conversion === 'function') {
            gtag_report_conversion(paymentUrl);
        } else {
            window.location.href = paymentUrl;
        }
    });
});

    // 4. FAQ Accordion Handler
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 5. Preview Modal Handler
    previewCards.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const img = thumb.querySelector('img');
            if (img && img.style.display !== 'none' && thumb.style.display !== 'none') {
                openPreviewModal(img.src);
            }
        });
    });
});

/**
 * Handles redirecting directly to the Cashfree Payment URL
 */
function handleCheckoutRedirect() {
    if (typeof CONFIG !== 'undefined' && CONFIG.CASHFREE_PAYMENT_URL) {
        window.location.href = CONFIG.CASHFREE_PAYMENT_URL;
    } else {
        window.location.href = "https://payments.cashfree.com/links?code=Hark9ad4a950_AAAAAAASvY";
    }
}

/**
 * Creates a lightweight modal preview overlay
 */
function openPreviewModal(imgSrc) {
    let modal = document.getElementById('preview-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'preview-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.85);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            backdrop-filter: blur(8px);
            cursor: pointer;
        `;
        modal.innerHTML = `
            <div style="position: relative; max-width: 800px; max-height: 90vh;">
                <img id="modal-img" src="" style="width: 100%; height: auto; max-height: 85vh; border-radius: 12px; box-shadow: 0 20px 48px rgba(0,0,0,0.5); object-fit: contain;">
                <div style="position: absolute; top: -16px; right: -16px; background: #FFF; color: #000; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">✕</div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    const modalImg = modal.querySelector('#modal-img');
    modalImg.src = imgSrc;
    modal.style.display = 'flex';
}
