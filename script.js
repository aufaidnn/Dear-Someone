/* =========================================================
   DEAR, SOMEONE.
   Anonymous Confession Wall
   Supabase Edition
   ========================================================= */


/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL =
    "https://pjodyqougqjoedyexkue.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_JYYQcjpe_hNI85P22XgnRQ_J6A-FgjF";


/* =========================================================
   SUPABASE CLIENT
========================================================= */

let supabaseClient = null;

if (window.supabase) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
} else {
    console.error(
        "Supabase library tidak ditemukan."
    );
}


/* =========================================================
   CONFIG
========================================================= */

const MAX_LENGTH = 1000;


/* =========================================================
   STATE
========================================================= */

let confessions = [];
let currentConfession = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

/* General */

const pageLoader =
    document.getElementById("pageLoader");

const navbar =
    document.getElementById("navbar");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mobileMenu =
    document.getElementById("mobileMenu");

const navLinks =
    document.querySelectorAll("[data-page]");

const mobileNavLinks =
    document.querySelectorAll(".mobile-nav-link");


/* Home */

const tonightLetter =
    document.getElementById("tonightLetter");

const tonightNumber =
    document.getElementById("tonightNumber");

const tonightDate =
    document.getElementById("tonightDate");

const tonightButton =
    document.getElementById("tonightButton");


/* Write */

const confessionForm =
    document.getElementById("confessionForm");

const letterInput =
    document.getElementById("letterInput");

const characterCount =
    document.getElementById("characterCount");


/* Seal Overlay */

const sealOverlay =
    document.getElementById("sealOverlay");

const closeSealOverlay =
    document.getElementById("closeSealOverlay");

const sealedPreview =
    document.getElementById("sealedPreview");

const envelope =
    document.getElementById("envelope");

const keepLetterButton =
    document.getElementById("keepLetterButton");

const readAfterSealButton =
    document.getElementById("readAfterSealButton");


/* Read */

const readingContent =
    document.getElementById("readingContent");

const readingNumber =
    document.getElementById("readingNumber");

const nextLetterButton =
    document.getElementById("nextLetterButton");


/* Footer */

const currentYear =
    document.getElementById("currentYear");


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeSite
);


async function initializeSite() {

    setupLoader();
    setupNavigation();
    setupMobileMenu();
    setupNavbarScroll();

    setupCharacterCounter();
    setupConfessionForm();

    setupSealOverlay();
    setupTonightConfession();
    setupReading();

    setupRevealAnimations();
    setupKeyboardShortcuts();
    setupFooterYear();
    setupPaperInteraction();

    /*
     * Ambil confess dari database
     * saat website dibuka.
     */
    await loadConfessions();

    /*
     * Setelah data selesai dimuat,
     * tampilkan konten yang sesuai.
     */
    showTonightConfession();
    showRandomConfession();
}


/* =========================================================
   DATABASE
========================================================= */

/**
 * Mengambil semua confess dari Supabase.
 */
async function loadConfessions() {

    if (!supabaseClient) {
        showDatabaseError();
        return;
    }

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("confessions")
            .select(
                "id, content, created_at"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            )
            .limit(500);


        if (error) {
            throw error;
        }


        confessions =
            Array.isArray(data)
                ? data
                : [];


        console.log(
            `DEAR, SOMEONE.: ${confessions.length} confess loaded.`
        );


    } catch (error) {

        console.error(
            "Gagal mengambil confess:",
            error
        );

        confessions = [];

        showDatabaseError();
    }
}


/**
 * Mengirim confess baru ke Supabase.
 */
async function saveConfession(content) {

    if (!supabaseClient) {
        return null;
    }

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("confessions")
            .insert({
                content: content
            })
            .select(
                "id, content, created_at"
            )
            .single();


        if (error) {
            throw error;
        }


        return data;


    } catch (error) {

        console.error(
            "Gagal menyimpan confess:",
            error
        );

        return null;
    }
}


/* =========================================================
   DATABASE ERROR
========================================================= */

function showDatabaseError() {

    if (tonightLetter) {

        tonightLetter.textContent =
            "Confess belum dapat dimuat sekarang. Coba buka kembali website beberapa saat lagi.";

        tonightNumber.textContent =
            "—";

        tonightDate.textContent =
            "connection error";
    }


    if (readingContent) {

        readingContent.textContent =
            "Confess belum dapat dimuat sekarang.\n\nCoba buka kembali website beberapa saat lagi.";

        readingNumber.textContent =
            "—";
    }
}


/* =========================================================
   LOADER
========================================================= */

function setupLoader() {

    window.addEventListener(
        "load",
        () => {

            setTimeout(
                () => {
                    pageLoader?.classList.add(
                        "hidden"
                    );
                },
                500
            );
        }
    );


    /*
     * Fallback apabila load event
     * tidak berjalan seperti yang diharapkan.
     */
    setTimeout(
        () => {

            pageLoader?.classList.add(
                "hidden"
            );

        },
        2500
    );
}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    navLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        !targetId.startsWith("#")
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();

                    closeMobileMenu();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            );
        }
    );


    /*
     * Active navigation ketika
     * section sedang terlihat.
     */

    const sections =
        document.querySelectorAll(
            ".page-section[id]"
        );


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        updateActiveNavigation(
                            entry.target.id
                        );
                    }
                );

            },
            {
                threshold: 0.25,
                rootMargin:
                    "-10% 0px -55% 0px"
            }
        );


    sections.forEach(
        (section) => {
            observer.observe(
                section
            );
        }
    );
}


function updateActiveNavigation(
    sectionId
) {

    document
        .querySelectorAll("[data-page]")
        .forEach(
            (link) => {

                const page =
                    link.getAttribute(
                        "data-page"
                    );


                link.classList.toggle(
                    "active",
                    page === sectionId
                );
            }
        );
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    if (!mobileMenuButton) {
        return;
    }


    mobileMenuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileMenu?.classList.toggle(
                    "open"
                );


            mobileMenuButton.classList.toggle(
                "open",
                Boolean(isOpen)
            );


            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(Boolean(isOpen))
            );


            document.body.classList.toggle(
                "menu-open",
                Boolean(isOpen)
            );
        }
    );


    mobileNavLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );
        }
    );


    /*
     * Klik di luar mobile menu
     * akan menutup menu.
     */

    document.addEventListener(
        "click",
        (event) => {

            if (
                !mobileMenu?.classList.contains(
                    "open"
                )
            ) {
                return;
            }


            const clickedInsideMenu =
                mobileMenu.contains(
                    event.target
                );


            const clickedButton =
                mobileMenuButton.contains(
                    event.target
                );


            if (
                !clickedInsideMenu &&
                !clickedButton
            ) {

                closeMobileMenu();
            }
        }
    );
}


function closeMobileMenu() {

    mobileMenu?.classList.remove(
        "open"
    );


    mobileMenuButton?.classList.remove(
        "open"
    );


    mobileMenuButton?.setAttribute(
        "aria-expanded",
        "false"
    );


    document.body.classList.remove(
        "menu-open"
    );
}


/* =========================================================
   NAVBAR SCROLL
========================================================= */

function setupNavbarScroll() {

    const handleScroll = () => {

        navbar?.classList.toggle(
            "scrolled",
            window.scrollY > 35
        );
    };


    handleScroll();


    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );
}


/* =========================================================
   CHARACTER COUNTER
========================================================= */

function setupCharacterCounter() {

    if (
        !letterInput ||
        !characterCount
    ) {
        return;
    }


    function updateCounter() {

        const length =
            letterInput.value.length;


        characterCount.textContent =
            length;


        /*
         * Peringatan visual saat
         * mendekati batas maksimal.
         */

        if (
            length >= MAX_LENGTH * 0.9
        ) {

            characterCount.style.color =
                "var(--burgundy)";

        } else {

            characterCount.style.color =
                "";
        }
    }


    letterInput.addEventListener(
        "input",
        updateCounter
    );


    updateCounter();
}


/* =========================================================
   CONFESSION FORM
========================================================= */

function setupConfessionForm() {

    if (!confessionForm) {
        return;
    }


    confessionForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            await submitConfession();
        }
    );
}


async function submitConfession() {

    /*
     * Ambil isi textarea.
     */

    const content =
        letterInput.value.trim();


    /*
     * Validasi kosong.
     */

    if (!content) {

        showFormError();

        return;
    }


    /*
     * Validasi panjang.
     */

    if (
        content.length > MAX_LENGTH
    ) {

        showFormError();

        return;
    }


    /*
     * Tombol submit.
     */

    const submitButton =
        confessionForm.querySelector(
            ".seal-button"
        );


    setSubmitButtonLoading(
        submitButton,
        true
    );


    /*
     * Kirim langsung ke database.
     */

    const newConfession =
        await saveConfession(
            content
        );


    setSubmitButtonLoading(
        submitButton,
        false
    );


    /*
     * Kalau database gagal.
     */

    if (!newConfession) {

        alert(
            "Confess belum berhasil dititipkan. Periksa koneksi atau konfigurasi Supabase, lalu coba lagi."
        );

        return;
    }


    /*
     * Tambahkan ke state saat ini.
     *
     * Ini BUKAN localStorage.
     * Data permanennya tetap berada
     * di Supabase.
     */

    confessions.unshift(
        newConfession
    );


    currentConfession =
        newConfession;


    /*
     * Tampilkan isi confess
     * di envelope.
     */

    if (sealedPreview) {

        sealedPreview.textContent =
            content;
    }


    /*
     * Buka overlay.
     */

    openSealOverlay();


    /*
     * Jalankan animasi envelope.
     */

    setTimeout(
        () => {

            envelope?.classList.add(
                "open"
            );


            setTimeout(
                () => {

                    envelope?.classList.add(
                        "delivered"
                    );

                },
                650
            );

        },
        180
    );


    /*
     * Perbarui bagian home.
     */

    showTonightConfession();
}


function setSubmitButtonLoading(
    button,
    loading
) {

    if (!button) {
        return;
    }


    button.disabled =
        loading;


    if (loading) {

        button.dataset.originalText =
            button.innerHTML;


        button.innerHTML =
            `
                <span class="seal-button-icon">⋯</span>
                <span>Menitipkan...</span>
            `;

    } else {

        button.innerHTML =
            button.dataset.originalText ||
            `
                <span class="seal-button-icon">✦</span>
                <span>Titipkan Confess</span>
                <span class="seal-button-arrow">→</span>
            `;
    }
}


function showFormError() {

    confessionForm?.classList.remove(
        "shake"
    );


    /*
     * Memaksa reflow supaya animasi
     * bisa dimainkan berulang kali.
     */

    void confessionForm?.offsetWidth;


    confessionForm?.classList.add(
        "shake"
    );


    letterInput?.focus();
}


/* =========================================================
   SEAL OVERLAY
========================================================= */

function setupSealOverlay() {

    /*
     * Tombol X.
     */

    closeSealOverlay?.addEventListener(
        "click",
        closeSealOverlayAndReset
    );


    /*
     * Kembali ke beranda.
     */

    keepLetterButton?.addEventListener(
        "click",
        () => {

            closeSealOverlayAndReset();

            scrollToSection(
                "home"
            );
        }
    );


    /*
     * Langsung ke confess yang baru
     * saja dikirim.
     */

    readAfterSealButton?.addEventListener(
        "click",
        () => {

            closeSealOverlayAndReset();

            scrollToSection(
                "read"
            );


            setTimeout(
                () => {

                    if (
                        currentConfession
                    ) {

                        updateReadingUI(
                            currentConfession
                        );

                    } else {

                        showRandomConfession();
                    }

                },
                450
            );
        }
    );


    /*
     * Klik backdrop untuk menutup.
     */

    sealOverlay?.addEventListener(
        "click",
        (event) => {

            const backdrop =
                sealOverlay.querySelector(
                    ".overlay-backdrop"
                );


            if (
                event.target ===
                backdrop
            ) {

                closeSealOverlayAndReset();
            }
        }
    );
}


function openSealOverlay() {

    if (!sealOverlay) {
        return;
    }


    sealOverlay.classList.add(
        "active"
    );


    sealOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "menu-open"
    );
}


function closeSealOverlayAndReset() {

    if (!sealOverlay) {
        return;
    }


    sealOverlay.classList.remove(
        "active"
    );


    sealOverlay.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "menu-open"
    );


    /*
     * Reset envelope.
     */

    envelope?.classList.remove(
        "open",
        "delivered"
    );


    /*
     * Reset form.
     *
     * currentConfession sengaja tidak
     * dihapus agar tombol "Baca
     * confess lain" tetap bisa
     * menampilkan confess terakhir.
     */

    setTimeout(
        () => {

            confessionForm?.reset();


            if (characterCount) {
                characterCount.textContent =
                    "0";
            }


            if (sealedPreview) {
                sealedPreview.textContent =
                    "";
            }

        },
        350
    );
}


/* =========================================================
   CONFESS MALAM INI
========================================================= */

function setupTonightConfession() {

    tonightButton?.addEventListener(
        "click",
        () => {

            scrollToSection(
                "read"
            );


            setTimeout(
                () => {

                    showRandomConfession();

                },
                450
            );
        }
    );
}


function showTonightConfession() {

    if (!tonightLetter) {
        return;
    }


    /*
     * Database masih kosong.
     */

    if (!confessions.length) {

        tonightLetter.textContent =
            "Belum ada confess malam ini. Mungkin kamu bisa menjadi yang pertama.";

        tonightNumber.textContent =
            "—";

        tonightDate.textContent =
            "waiting for someone";

        return;
    }


    /*
     * Ambil salah satu confess.
     */

    const confession =
        getRandomConfession();


    if (!confession) {
        return;
    }


    tonightLetter.textContent =
        confession.content;


    tonightNumber.textContent =
        formatConfessionNumber(
            confession
        );


    tonightDate.textContent =
        formatRelativeDate(
            confession.created_at
        );


    animateLetterChange(
        tonightLetter
    );
}


/* =========================================================
   READ CONFESSION
========================================================= */

function setupReading() {

    nextLetterButton?.addEventListener(
        "click",
        () => {

            if (!confessions.length) {

                showEmptyReadingState();

                return;
            }


            showRandomConfession();
        }
    );
}


function showRandomConfession() {

    if (!readingContent) {
        return;
    }


    /*
     * Database kosong.
     */

    if (!confessions.length) {

        showEmptyReadingState();

        return;
    }


    /*
     * Pilih confess random.
     */

    const nextConfession =
        getRandomConfession(
            currentConfession?.id
        );


    if (!nextConfession) {

        showEmptyReadingState();

        return;
    }


    currentConfession =
        nextConfession;


    updateReadingUI(
        nextConfession
    );
}


function showEmptyReadingState() {

    readingContent.textContent =
        "Belum ada confess yang bisa dibaca.\n\nJadilah seseorang pertama yang meninggalkan kata-kata di sini.";

    readingNumber.textContent =
        "—";


    readingContent.classList.remove(
        "fade-out-content"
    );


    readingContent.classList.add(
        "fade-in-content"
    );
}


function updateReadingUI(
    confession
) {

    if (!readingContent) {
        return;
    }


    /*
     * Fade out.
     */

    readingContent.classList.remove(
        "fade-in-content"
    );

    readingContent.classList.add(
        "fade-out-content"
    );


    setTimeout(
        () => {

            /*
             * Tampilkan confess baru.
             */

            readingContent.textContent =
                confession.content;


            readingNumber.textContent =
                formatConfessionNumber(
                    confession
                );


            /*
             * Fade in.
             */

            readingContent.classList.remove(
                "fade-out-content"
            );


            void readingContent.offsetWidth;


            readingContent.classList.add(
                "fade-in-content"
            );

        },
        180
    );
}


/* =========================================================
   RANDOM CONFESSION
========================================================= */

function getRandomConfession(
    excludeId = null
) {

    if (!confessions.length) {
        return null;
    }


    /*
     * Hindari menampilkan confess
     * yang sama dua kali berturut-turut
     * kalau masih ada pilihan lain.
     */

    let available =
        confessions.filter(
            (confession) =>
                confession.id !==
                excludeId
        );


    /*
     * Kalau hanya ada satu confess,
     * tetap gunakan confess tersebut.
     */

    if (!available.length) {

        available =
            confessions;
    }


    const randomIndex =
        Math.floor(
            Math.random() *
            available.length
        );


    return available[
        randomIndex
    ];
}


/* =========================================================
   CONFESSION NUMBER
========================================================= */

function formatConfessionNumber(
    confession
) {

    /*
     * State kita berisi data terbaru
     * di posisi paling awal.
     *
     * Nomor di sini hanya identifier
     * visual, bukan ID database.
     */

    const index =
        confessions.findIndex(
            (item) =>
                item.id ===
                confession.id
        );


    if (index === -1) {
        return "—";
    }


    return `#${String(
        index + 1
    ).padStart(3, "0")}`;
}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatRelativeDate(
    dateString
) {

    if (!dateString) {
        return "anonymous";
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "anonymous";
    }


    const now =
        new Date();


    const difference =
        now.getTime() -
        date.getTime();


    const oneDay =
        24 * 60 * 60 * 1000;


    if (difference < oneDay) {
        return "hari ini";
    }


    if (
        difference <
        oneDay * 2
    ) {

        return "kemarin";
    }


    return date.toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}


/* =========================================================
   LETTER ANIMATION
========================================================= */

function animateLetterChange(
    element
) {

    if (!element) {
        return;
    }


    element.classList.remove(
        "fade-in-content"
    );


    void element.offsetWidth;


    element.classList.add(
        "fade-in-content"
    );
}


/* =========================================================
   SCROLL HELPER
========================================================= */

function scrollToSection(
    sectionId
) {

    const section =
        document.getElementById(
            sectionId
        );


    if (!section) {
        return;
    }


    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   REVEAL ANIMATION
========================================================= */

function setupRevealAnimations() {

    const elements =
        document.querySelectorAll(
            ".reveal-element"
        );


    if (!elements.length) {
        return;
    }


    /*
     * Pengguna yang memilih
     * reduced motion tidak perlu
     * menjalankan animasi.
     */

    if (
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        elements.forEach(
            (element) => {

                element.classList.add(
                    "revealed"
                );
            }
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            (
                entries,
                observerInstance
            ) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        entry.target.classList.add(
                            "revealed"
                        );


                        observerInstance.unobserve(
                            entry.target
                        );
                    }
                );

            },
            {
                threshold: 0.08,
                rootMargin:
                    "0px 0px -40px 0px"
            }
        );


    elements.forEach(
        (element) => {

            observer.observe(
                element
            );
        }
    );
}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        (event) => {

            /*
             * Escape
             */

            if (
                event.key ===
                "Escape"
            ) {

                if (
                    sealOverlay?.classList.contains(
                        "active"
                    )
                ) {

                    closeSealOverlayAndReset();
                }


                closeMobileMenu();
            }


            /*
             * Ctrl + Enter
             * Cmd + Enter
             */

            if (
                (
                    event.ctrlKey ||
                    event.metaKey
                ) &&
                event.key === "Enter"
            ) {

                if (
                    document.activeElement ===
                    letterInput
                ) {

                    event.preventDefault();

                    submitConfession();
                }
            }
        }
    );
}


/* =========================================================
   FOOTER YEAR
========================================================= */

function setupFooterYear() {

    if (!currentYear) {
        return;
    }


    currentYear.textContent =
        new Date().getFullYear();
}


/* =========================================================
   PAPER INTERACTION
========================================================= */

function setupPaperInteraction() {

    const formPaper =
        document.querySelector(
            ".form-paper"
        );


    if (!formPaper) {
        return;
    }


    /*
     * Sedikit efek 3D pada desktop.
     */

    formPaper.addEventListener(
        "mousemove",
        (event) => {

            if (
                window.innerWidth <= 900
            ) {
                return;
            }


            const rect =
                formPaper.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const rotateY =
                (
                    (x / rect.width) -
                    0.5
                ) * 1.4;


            const rotateX =
                (
                    (y / rect.height) -
                    0.5
                ) * -1.4;


            formPaper.style.transform =
                `perspective(1000px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-2px)`;
        }
    );


    formPaper.addEventListener(
        "mouseleave",
        () => {

            formPaper.style.transform =
                "";
        }
    );
}


/* =========================================================
   CONSOLE
========================================================= */

console.log(
    "%cDEAR, SOMEONE.",
    "font-family: Georgia, serif; font-size: 20px; font-weight: bold;"
);

console.log(
    "anonymous by design."
);
