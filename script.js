/* =========================================================
   DEAR, SOMEONE.
   Anonymous Confession Wall
   No Default Confessions
   ========================================================= */

const STORAGE_KEY = "dearSomeoneConfessions";
const MAX_LENGTH = 1000;

let confessions = [];
let currentConfession = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const pageLoader = document.getElementById("pageLoader");

const navbar = document.getElementById("navbar");

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


/* Overlay */

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

document.addEventListener("DOMContentLoaded", () => {
    initializeSite();
});


function initializeSite() {
    loadConfessions();

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

    showTonightConfession();
    showRandomConfession();
}


/* =========================================================
   STORAGE
========================================================= */

function loadConfessions() {
    confessions = getStoredConfessions();
}


function getStoredConfessions() {
    try {
        const rawData =
            localStorage.getItem(STORAGE_KEY);

        if (!rawData) {
            return [];
        }

        const parsedData =
            JSON.parse(rawData);

        if (!Array.isArray(parsedData)) {
            return [];
        }

        return parsedData.filter(isValidConfession);

    } catch (error) {
        console.error(
            "Gagal membaca confess:",
            error
        );

        return [];
    }
}


function isValidConfession(confession) {
    return (
        confession &&
        typeof confession === "object" &&
        typeof confession.content === "string" &&
        confession.content.trim().length > 0
    );
}


function saveConfession(confession) {
    try {
        const stored =
            getStoredConfessions();

        stored.push(confession);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(stored)
        );

        return true;

    } catch (error) {
        console.error(
            "Gagal menyimpan confess:",
            error
        );

        return false;
    }
}


/* =========================================================
   ID
========================================================= */

function generateConfessionId() {
    const timestamp =
        Date.now().toString(36);

    const random =
        Math.random()
            .toString(36)
            .slice(2, 8);

    return `${timestamp}-${random}`;
}


/* =========================================================
   LOADER
========================================================= */

function setupLoader() {
    window.addEventListener("load", () => {
        setTimeout(() => {
            pageLoader?.classList.add("hidden");
        }, 600);
    });

    setTimeout(() => {
        pageLoader?.classList.add("hidden");
    }, 1800);
}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {
    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                !targetId.startsWith("#")
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            closeMobileMenu();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });


    const sections =
        document.querySelectorAll(".page-section");


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    updateActiveNavigation(
                        entry.target.id
                    );
                });

            },
            {
                threshold: 0.25,
                rootMargin: "-10% 0px -55% 0px"
            }
        );


    sections.forEach((section) => {
        observer.observe(section);
    });
}


function updateActiveNavigation(sectionId) {
    document
        .querySelectorAll("[data-page]")
        .forEach((link) => {

            const page =
                link.getAttribute("data-page");

            link.classList.toggle(
                "active",
                page === sectionId
            );
        });
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
                mobileMenu?.classList.toggle("open");

            mobileMenuButton.classList.toggle(
                "open",
                isOpen
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


    mobileNavLinks.forEach((link) => {
        link.addEventListener(
            "click",
            closeMobileMenu
        );
    });


    document.addEventListener(
        "click",
        (event) => {

            if (
                !mobileMenu?.classList.contains("open")
            ) {
                return;
            }

            const insideMenu =
                mobileMenu.contains(event.target);

            const insideButton =
                mobileMenuButton.contains(event.target);

            if (!insideMenu && !insideButton) {
                closeMobileMenu();
            }
        }
    );
}


function closeMobileMenu() {
    mobileMenu?.classList.remove("open");

    mobileMenuButton?.classList.remove("open");

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
        { passive: true }
    );
}


/* =========================================================
   CHARACTER COUNTER
========================================================= */

function setupCharacterCounter() {
    if (!letterInput || !characterCount) {
        return;
    }

    const updateCounter = () => {

        const length =
            letterInput.value.length;

        characterCount.textContent =
            length;


        if (length >= MAX_LENGTH * 0.9) {
            characterCount.style.color =
                "var(--burgundy)";
        } else {
            characterCount.style.color = "";
        }
    };


    letterInput.addEventListener(
        "input",
        updateCounter
    );

    updateCounter();
}


/* =========================================================
   WRITE CONFESSION
========================================================= */

function setupConfessionForm() {
    if (!confessionForm) {
        return;
    }

    confessionForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            submitConfession();
        }
    );
}


function submitConfession() {
    const content =
        letterInput.value.trim();


    if (!content) {
        showFormError();
        return;
    }


    if (content.length > MAX_LENGTH) {
        showFormError();
        return;
    }


    const newConfession = {
        id: generateConfessionId(),
        content,
        createdAt: new Date().toISOString()
    };


    const saved =
        saveConfession(newConfession);


    if (!saved) {
        alert(
            "Confess belum dapat disimpan. Coba lagi."
        );

        return;
    }


    confessions.push(newConfession);

    currentConfession =
        newConfession;


    if (sealedPreview) {
        sealedPreview.textContent =
            content;
    }


    openSealOverlay();


    setTimeout(() => {

        envelope?.classList.add("open");

        setTimeout(() => {
            envelope?.classList.add("delivered");
        }, 650);

    }, 180);


    /*
     * Setelah confess pertama dibuat,
     * langsung perbarui bagian "Confess Malam Ini".
     */
    showTonightConfession();
}


function showFormError() {
    confessionForm?.classList.remove("shake");

    void confessionForm?.offsetWidth;

    confessionForm?.classList.add("shake");

    letterInput?.focus();
}


/* =========================================================
   SEAL OVERLAY
========================================================= */

function setupSealOverlay() {

    closeSealOverlay?.addEventListener(
        "click",
        closeSealOverlayAndReset
    );


    keepLetterButton?.addEventListener(
        "click",
        () => {

            closeSealOverlayAndReset();

            scrollToSection("home");
        }
    );


    readAfterSealButton?.addEventListener(
        "click",
        () => {

            closeSealOverlayAndReset();

            scrollToSection("read");

            setTimeout(() => {
                showRandomConfession();
            }, 450);
        }
    );


    sealOverlay?.addEventListener(
        "click",
        (event) => {

            const backdrop =
                sealOverlay.querySelector(
                    ".overlay-backdrop"
                );

            if (event.target === backdrop) {
                closeSealOverlayAndReset();
            }
        }
    );
}


function openSealOverlay() {
    if (!sealOverlay) {
        return;
    }

    sealOverlay.classList.add("active");

    sealOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add("menu-open");
}


function closeSealOverlayAndReset() {

    if (!sealOverlay) {
        return;
    }

    sealOverlay.classList.remove("active");

    sealOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "menu-open"
    );


    envelope?.classList.remove(
        "open",
        "delivered"
    );


    setTimeout(() => {

        confessionForm?.reset();

        if (characterCount) {
            characterCount.textContent = "0";
        }

        if (sealedPreview) {
            sealedPreview.textContent = "";
        }

        currentConfession = null;

    }, 350);
}


/* =========================================================
   CONFESS MALAM INI
========================================================= */

function setupTonightConfession() {

    tonightButton?.addEventListener(
        "click",
        () => {

            scrollToSection("read");

            setTimeout(() => {
                showRandomConfession();
            }, 450);
        }
    );
}


function showTonightConfession() {

    if (!tonightLetter) {
        return;
    }


    if (!confessions.length) {

        tonightLetter.textContent =
            "Belum ada confess malam ini. Mungkin kamu bisa menjadi yang pertama.";

        tonightNumber.textContent =
            "—";

        tonightDate.textContent =
            "waiting for someone";

        return;
    }


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
            confession.createdAt
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


    if (!confessions.length) {
        showEmptyReadingState();
        return;
    }


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


function updateReadingUI(confession) {

    if (!readingContent) {
        return;
    }


    readingContent.classList.remove(
        "fade-in-content"
    );

    readingContent.classList.add(
        "fade-out-content"
    );


    setTimeout(() => {

        readingContent.textContent =
            confession.content;


        readingNumber.textContent =
            formatConfessionNumber(
                confession
            );


        readingContent.classList.remove(
            "fade-out-content"
        );

        void readingContent.offsetWidth;

        readingContent.classList.add(
            "fade-in-content"
        );

    }, 180);
}


/* =========================================================
   RANDOM
========================================================= */

function getRandomConfession(
    excludeId = null
) {

    if (!confessions.length) {
        return null;
    }


    let available =
        confessions.filter(
            (confession) =>
                confession.id !== excludeId
        );


    if (!available.length) {
        available = confessions;
    }


    const randomIndex =
        Math.floor(
            Math.random() *
            available.length
        );


    return available[randomIndex];
}


/* =========================================================
   NUMBER
========================================================= */

function formatConfessionNumber(
    confession
) {

    const index =
        confessions.findIndex(
            (item) =>
                item.id === confession.id
        );


    if (index === -1) {
        return "—";
    }


    return `#${String(index + 1).padStart(3, "0")}`;
}


/* =========================================================
   DATE
========================================================= */

function formatRelativeDate(dateString) {

    if (!dateString) {
        return "anonymous";
    }


    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {
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


    if (difference < oneDay * 2) {
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
   ANIMATION
========================================================= */

function animateLetterChange(element) {

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
   SCROLL
========================================================= */

function scrollToSection(sectionId) {

    const section =
        document.getElementById(sectionId);


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


    if (
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        elements.forEach(
            (element) => {
                element.classList.add("revealed");
            }
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach(
                    (entry) => {

                        if (!entry.isIntersecting) {
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
            observer.observe(element);
        }
    );
}


/* =========================================================
   KEYBOARD
========================================================= */

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        (event) => {

            /* Escape */

            if (event.key === "Escape") {

                if (
                    sealOverlay?.classList.contains(
                        "active"
                    )
                ) {
                    closeSealOverlayAndReset();
                }

                closeMobileMenu();
            }


            /* Ctrl + Enter / Cmd + Enter */

            if (
                (event.ctrlKey ||
                    event.metaKey) &&
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
   MULTI-TAB UPDATE
========================================================= */

window.addEventListener(
    "storage",
    (event) => {

        if (
            event.key !== STORAGE_KEY
        ) {
            return;
        }


        loadConfessions();

        showTonightConfession();

        /*
         * Tidak mengganti confess yang sedang
         * dibaca secara tiba-tiba.
         */
    }
);


/* =========================================================
   PAPER INTERACTION
========================================================= */

function setupPaperInteraction() {

    const formPaper =
        document.querySelector(".form-paper");


    if (!formPaper) {
        return;
    }


    formPaper.addEventListener(
        "mousemove",
        (event) => {

            if (window.innerWidth <= 900) {
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
                ((x / rect.width) - 0.5) * 1.4;


            const rotateX =
                ((y / rect.height) - 0.5) * -1.4;


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
            formPaper.style.transform = "";
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