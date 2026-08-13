// =========================================================================
// CENTRAL CONFIGURATION — The 30-Day Productivity Reset Website
// =========================================================================
// After deploying the website, set the Cashfree Redirect URL
// to the live URL of thank-you.html in the Cashfree dashboard.
// =========================================================================

const CONFIG = {
    PRODUCT_NAME: "The 30-Day Productivity Reset",
    SUBTITLE: "A Practical 30-Day System to Build Better Habits, Improve Focus, Manage Your Time, and Get More Done",
    AUTHOR_NAME: "Ayush Prajapati",
    PRICE: 199,
    CURRENCY: "INR",
    CURRENCY_SYMBOL: "₹",
    PAGES: 65,
    FORMAT: "Digital PDF eBook",

    // eBook Cover Image (Single source of truth)
    BOOK_COVER: "assets/ebook-cover.jpg",

    // Exact Cashfree Payment URL for all BUY NOW buttons
    CASHFREE_PAYMENT_URL: "https://payments.cashfree.com/links?code=Hark9ad4a950_AAAAAAASvY",

    // Success / Return Page
    SUCCESS_PAGE_URL: "thank-you.html",

    // eBook PDF File (Delivered on thank-you.html and viewed in read.html)
    PDF_FILE: "The_30-Day_Productivity_Reset_Ayush_Prajapati_FINAL_v2.pdf",

    // Support Email
    SUPPORT_EMAIL: "support@ayushprajapati.com"
};
