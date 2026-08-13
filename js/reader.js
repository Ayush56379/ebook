/**
 * Simple Static Online PDF Reader powered by PDF.js with fallback embed
 */

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.2;

const canvas = document.getElementById('pdf-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

document.addEventListener('DOMContentLoaded', () => {
    let pdfUrl = (typeof CONFIG !== 'undefined' && CONFIG.PDF_FILE) 
        ? CONFIG.PDF_FILE 
        : "The_30-Day_Productivity_Reset_Ayush_Prajapati_FINAL_v2.pdf";

    // Set download link
    const downloadLink = document.getElementById('download-link');
    if (downloadLink) {
        downloadLink.href = pdfUrl;
    }

    // Set Title
    const titleEl = document.getElementById('reader-title');
    if (titleEl && typeof CONFIG !== 'undefined') {
        titleEl.textContent = `${CONFIG.PRODUCT_NAME} — By ${CONFIG.AUTHOR_NAME}`;
    }

    // Initialize PDF.js if available
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        pdfjsLib.getDocument(pdfUrl).promise.then(doc => {
            pdfDoc = doc;
            document.getElementById('page-count').textContent = doc.numPages;
            renderPage(pageNum);
        }).catch(err => {
            console.warn("PDF.js render notice. Falling back to iframe viewer:", err);
            activateFallback(pdfUrl);
        });
    } else {
        activateFallback(pdfUrl);
    }

    // Controls
    document.getElementById('prev-page').addEventListener('click', onPrevPage);
    document.getElementById('next-page').addEventListener('click', onNextPage);
    
    document.getElementById('zoom-in').addEventListener('click', () => {
        scale += 0.15;
        updateZoomLabel();
        queueRenderPage(pageNum);
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        if (scale > 0.6) {
            scale -= 0.15;
            updateZoomLabel();
            queueRenderPage(pageNum);
        }
    });

    const pageInput = document.getElementById('page-num');
    pageInput.addEventListener('change', (e) => {
        const val = parseInt(e.target.value);
        if (pdfDoc && val >= 1 && val <= pdfDoc.numPages) {
            pageNum = val;
            queueRenderPage(pageNum);
        }
    });
});

function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        const renderTask = page.render(renderContext);

        renderTask.promise.then(() => {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });

    document.getElementById('page-num').value = num;
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
}

function updateZoomLabel() {
    document.getElementById('zoom-level').textContent = `${Math.round(scale * 100)}%`;
}

function activateFallback(pdfUrl) {
    if (canvas) canvas.style.display = 'none';
    const iframe = document.getElementById('pdf-fallback');
    if (iframe) {
        iframe.src = pdfUrl;
        iframe.style.display = 'block';
    }
}
