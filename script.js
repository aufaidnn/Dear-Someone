/* =========================================
   DEAR, SOMEONE.
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   SUPABASE CONFIG
========================================= */

const SUPABASE_URL =
    "https://pjodyqougqjoedyexkue.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_JYYQcjpe_hNI85P22XgnRQ_J6A-FgjF";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================
   ADMIN CONTACT
========================================= */

/*
    GANTI NOMOR INI DENGAN NOMOR WHATSAPP ADMIN.

    Format:
    628xxxxxxxxxx

    Jangan gunakan:
    +62
    08xxxxxxxxxx
    spasi
    tanda -
*/

const ADMIN_WHATSAPP =
    "6281957231265";


/* =========================================
   GLOBAL STATE
========================================= */

let confessions = [];

let currentConfession = null;

let isLoadingConfessions = false;


/* =========================================
   DOM ELEMENTS
========================================= */

const pageLoader =
    document.getElementById("pageLoader");

const navbar =
    document.getElementById("navbar");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mobileMenu =
    document.getElementById("mobileMenu");


/* Home */

const tonightLetter =
    document.getElementById("tonightLetter");

const tonightNumber =
    document.getElementById("tonightNumber");

const tonightDate =
    document.getElementById("tonightDate");

const tonightContent =
    document.getElementById("tonightContent");

const tonightButton =
    document.getElementById("tonightButton");


/* Write */

const confessionForm =
    document.getElementById("confessionForm");

const letterInput =
    document.getElementById("letterInput");

const characterCount =
    document.getElementById("characterCount");


/* Seal */

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


/* Share */

const shareOverlay =
    document.getElementById("shareOverlay");

const closeShareOverlay =
    document.getElementById("closeShareOverlay");

const shareForm =
    document.getElementById("shareForm");

const sharePlatform =
    document.getElementById("sharePlatform");

const shareRecipient =
    document.getElementById("shareRecipient");

const shareNote =
    document.getElementById("shareNote");

const sharePreviewContent =
    document.getElementById("sharePreviewContent");


/* Share success */

const shareSuccessOverlay =
    document.getElementById("shareSuccessOverlay");

const closeShareSuccess =
    document.getElementById("closeShareSuccess");


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


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


async function initialize() {

    setupNavigation();

    setupMobileMenu();

    setupCharacterCounter();

    setupConfessionForm();

    setupSealOverlay();

    setupShareForm();

    setupReadPage();

    setupPaperInteraction();

    setupKeyboardShortcut();

    setupFooter();

    setupScrollNavbar();

    await loadConfessions();

    initializePageFromHash();

    revealElements();

    setTimeout(() => {

        if (pageLoader) {
            pageLoader.classList.add("loaded");
        }

    }, 500);
}


/* =========================================
   LOAD CONFESSIONS
========================================= */

async function loadConfessions() {

    if (isLoadingConfessions) {
        return;
    }

    isLoadingConfessions = true;

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


        updateTonightFess();

        showRandomConfession();


    } catch (error) {

        console.error(
            "Failed to load confessions:",
            error
        );


        confessions = [];


        if (tonightContent) {

            tonightContent.textContent =
                "The words are quiet right now. Try again later.";

        }

    } finally {

        isLoadingConfessions = false;

    }
}


/* =========================================
   INSERT CONFESSION
========================================= */

async function insertConfession(content) {

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
}


/* =========================================
   NAVIGATION
========================================= */

function setupNavigation() {

    const pageLinks =
        document.querySelectorAll(
            "[data-page]"
        );


    pageLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const page =
                    link.dataset.page;

                navigateToPage(page);

            }
        );

    });

}


function navigateToPage(page) {

    const sections =
        document.querySelectorAll(
            ".page-section"
        );


    sections.forEach(section => {

        section.classList.remove(
            "active-section"
        );

    });


    const target =
        document.getElementById(page);


    if (!target) {
        return;
    }


    target.classList.add(
        "active-section"
    );


    const links =
        document.querySelectorAll(
            ".nav-link"
        );


    links.forEach(link => {

        link.classList.toggle(
            "active",
            link.dataset.page === page
        );

    });


    closeMobileMenu();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (page === "read") {

        if (!currentConfession) {
            showRandomConfession();
        }

    }


    revealElements();

}


function initializePageFromHash() {

    const hash =
        window.location.hash
            .replace("#", "")
            .trim();


    const validPages = [
        "home",
        "write",
        "read",
        "about"
    ];


    if (
        hash &&
        validPages.includes(hash)
    ) {

        navigateToPage(hash);

    } else {

        navigateToPage("home");

    }

}


/* =========================================
   MOBILE MENU
========================================= */

function setupMobileMenu() {

    if (!mobileMenuButton) {
        return;
    }


    mobileMenuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileMenuButton.classList.toggle(
                    "open"
                );


            mobileMenu.classList.toggle(
                "open",
                isOpen
            );


            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );

}


function closeMobileMenu() {

    if (!mobileMenuButton) {
        return;
    }


    mobileMenuButton.classList.remove(
        "open"
    );


    mobileMenu.classList.remove(
        "open"
    );


    mobileMenuButton.setAttribute(
        "aria-expanded",
        "false"
    );

}


/* =========================================
   CHARACTER COUNTER
========================================= */

function setupCharacterCounter() {

    if (!letterInput || !characterCount) {
        return;
    }


    function updateCounter() {

        const length =
            letterInput.value.length;


        characterCount.textContent =
            `${length} / 1000`;


        if (length >= 900) {

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


/* =========================================
   CONFESSION FORM
========================================= */

function setupConfessionForm() {

    if (!confessionForm) {
        return;
    }


    confessionForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const content =
                letterInput.value.trim();


            if (!content) {

                letterInput.focus();

                return;

            }


            if (content.length > 1000) {

                alert(
                    "Your fess is too long. Maximum 1000 characters."
                );

                return;

            }


            const submitButton =
                confessionForm.querySelector(
                    ".seal-button"
                );


            const originalText =
                submitButton
                    ? submitButton.textContent
                    : "";


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Uploading...";

            }


            try {

                const newConfession =
                    await insertConfession(
                        content
                    );


                /*
                    Add new confession
                    to local in-memory list.
                */

                confessions.unshift(
                    newConfession
                );


                currentConfession =
                    newConfession;


                letterInput.value = "";

                updateCharacterCount();


                showSealOverlay(
                    newConfession
                );


            } catch (error) {

                console.error(
                    "Failed to upload fess:",
                    error
                );


                alert(
                    "Your fess couldn't be uploaded right now. Please try again."
                );


            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        originalText ||
                        "Upload This Fess";

                }

            }

        }
    );

}


/* =========================================
   CHARACTER COUNT HELPER
========================================= */

function updateCharacterCount() {

    if (!letterInput || !characterCount) {
        return;
    }


    characterCount.textContent =
        `${letterInput.value.length} / 1000`;

}


/* =========================================
   SEAL OVERLAY
========================================= */

function setupSealOverlay() {

    if (closeSealOverlay) {

        closeSealOverlay.addEventListener(
            "click",
            closeSeal
        );

    }


    if (keepLetterButton) {

        keepLetterButton.addEventListener(
            "click",
            () => {

                closeSeal();

                navigateToPage("read");

            }
        );

    }


    if (readAfterSealButton) {

        readAfterSealButton.addEventListener(
            "click",
            () => {

                closeSeal();

                openShareOverlay(
                    currentConfession
                );

            }
        );

    }


    if (sealOverlay) {

        sealOverlay
            .querySelector(
                ".overlay-backdrop"
            )
            ?.addEventListener(
                "click",
                closeSeal
            );

    }

}


function showSealOverlay(confession) {

    if (!sealOverlay) {
        return;
    }


    currentConfession =
        confession;


    if (sealedPreview) {

        sealedPreview.innerHTML = `
            <span class="preview-label">
                YOUR FESS IS LIVE
            </span>

            <p>
                Your words are now out there.
            </p>
        `;

    }


    envelope?.classList.remove(
        "open"
    );


    sealOverlay.classList.add(
        "active"
    );


    sealOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(() => {

        envelope?.classList.add(
            "open"
        );

    }, 500);

}


function closeSeal() {

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


    document.body.style.overflow =
        "";

}


/* =========================================
   SHARE OVERLAY
========================================= */

function setupShareForm() {

    if (!shareForm) {
        return;
    }


    if (closeShareOverlay) {

        closeShareOverlay.addEventListener(
            "click",
            closeShare
        );

    }


    shareOverlay
        ?.querySelector(
            ".overlay-backdrop"
        )
        ?.addEventListener(
            "click",
            closeShare
        );


    shareForm.addEventListener(
        "submit",
        handleShareRequest
    );


    if (closeShareSuccess) {

        closeShareSuccess.addEventListener(
            "click",
            () => {

                closeShareSuccessOverlay();

                navigateToPage("home");

            }
        );

    }


    shareSuccessOverlay
        ?.querySelector(
            ".overlay-backdrop"
        )
        ?.addEventListener(
            "click",
            closeShareSuccessOverlay
        );

}


function openShareOverlay(confession) {

    if (!shareOverlay) {
        return;
    }


    if (!confession) {

        alert(
            "Please upload a fess first."
        );

        return;

    }


    currentConfession =
        confession;


    if (sharePreviewContent) {

        sharePreviewContent.textContent =
            confession.content;

    }


    if (shareForm) {
        shareForm.reset();
    }


    if (sharePreviewContent) {

        sharePreviewContent.textContent =
            confession.content;

    }


    shareOverlay.classList.add(
        "active"
    );


    shareOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


function closeShare() {

    if (!shareOverlay) {
        return;
    }


    shareOverlay.classList.remove(
        "active"
    );


    shareOverlay.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================
   SHARE REQUEST
========================================= */

async function handleShareRequest(event) {

    event.preventDefault();


    if (!currentConfession) {

        alert(
            "We couldn't find the fess you're trying to send."
        );

        return;

    }


    const platform =
        sharePlatform.value.trim();


    const recipient =
        shareRecipient.value.trim();


    const note =
        shareNote.value.trim();


    if (!platform) {

        sharePlatform.focus();

        return;

    }


    if (!recipient) {

        shareRecipient.focus();

        return;

    }


    /*
        At this stage, we don't create
        another Supabase table.

        Instead, the website prepares
        a WhatsApp message for the admin.
    */


    const fess =
        currentConfession.content;


    const confessionId =
        currentConfession.id;


    const message =
`DEAR, SOMEONE. — SHARE REQUEST

Fess ID:
${confessionId}

Fess:
"${fess}"

Recipient:
${recipient}

Platform:
${platform}

Note:
${note || "-"}

Please review and handle this request.`;


    const encodedMessage =
        encodeURIComponent(
            message
        );


    const whatsappURL =
        `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`;


    /*
        Open WhatsApp in a new tab.
    */

    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );


    closeShare();


    setTimeout(() => {

        openShareSuccessOverlay();

    }, 250);

}


/* =========================================
   SHARE SUCCESS
========================================= */

function openShareSuccessOverlay() {

    if (!shareSuccessOverlay) {
        return;
    }


    shareSuccessOverlay.classList.add(
        "active"
    );


    shareSuccessOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


function closeShareSuccessOverlay() {

    if (!shareSuccessOverlay) {
        return;
    }


    shareSuccessOverlay.classList.remove(
        "active"
    );


    shareSuccessOverlay.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================
   READ PAGE
========================================= */

function setupReadPage() {

    if (nextLetterButton) {

        nextLetterButton.addEventListener(
            "click",
            showRandomConfession
        );

    }


    if (tonightButton) {

        tonightButton.addEventListener(
            "click",
            showRandomConfession
        );

    }

}


function showRandomConfession() {

    if (!readingContent) {
        return;
    }


    if (
        !confessions ||
        confessions.length === 0
    ) {

        const body =
            readingContent.querySelector(
                ".reading-body p"
            );


        if (body) {

            body.textContent =
                "There are no fess to read yet.";

        }


        if (readingNumber) {

            readingNumber.textContent =
                "---";

        }


        return;

    }


    let selected;


    if (confessions.length === 1) {

        selected =
            confessions[0];

    } else {

        const available =
            confessions.filter(
                confession =>
                    !currentConfession ||
                    confession.id !== currentConfession.id
            );


        selected =
            available[
                Math.floor(
                    Math.random() *
                    available.length
                )
            ];

    }


    currentConfession =
        selected;


    const body =
        readingContent.querySelector(
            ".reading-body p"
        );


    if (!body) {
        return;
    }


    body.classList.remove(
        "fade-in-content"
    );


    void body.offsetWidth;


    body.classList.add(
        "fade-in-content"
    );


    body.textContent =
        selected.content;


    if (readingNumber) {

        readingNumber.textContent =
            getConfessionNumber(
                selected
            );

    }

}


function updateTonightFess() {

    if (
        !tonightContent ||
        confessions.length === 0
    ) {
        return;
    }


    const selected =
        confessions[0];


    if (tonightContent) {

        tonightContent.textContent =
            selected.content;

    }


    if (tonightNumber) {

        tonightNumber.textContent =
            getConfessionNumber(
                selected
            );

    }


    if (tonightDate) {

        tonightDate.textContent =
            formatDate(
                selected.created_at
            );

    }

}


/* =========================================
   CONFESSION NUMBER
========================================= */

function getConfessionNumber(confession) {

    if (!confession) {
        return "---";
    }


    /*
        Supabase UUIDs are not ideal
        for a pretty public number.

        For now we use the position
        inside the loaded list.
    */

    const index =
        confessions.findIndex(
            item =>
                item.id === confession.id
        );


    if (index === -1) {

        return "---";

    }


    return String(
        confessions.length - index
    ).padStart(
        3,
        "0"
    );

}


/* =========================================
   DATE FORMAT
========================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "---";
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "---";

    }


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================================
   PAPER INTERACTION
========================================= */

function setupPaperInteraction() {

    const papers =
        document.querySelectorAll(
            ".tonight-paper, .writing-paper, .reading-paper"
        );


    papers.forEach(paper => {

        paper.addEventListener(
            "mousemove",
            event => {

                if (
                    window.innerWidth <= 600
                ) {
                    return;
                }


                const rect =
                    paper.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const rotateX =
                    ((y / rect.height) - 0.5) * -1.5;


                const rotateY =
                    ((x / rect.width) - 0.5) * 1.5;


                paper.style.transform =
                    `perspective(900px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)`;

            }
        );


        paper.addEventListener(
            "mouseleave",
            () => {

                if (
                    paper.classList.contains(
                        "tonight-paper"
                    )
                ) {

                    paper.style.transform =
                        "rotate(-0.35deg)";

                } else if (
                    paper.classList.contains(
                        "writing-paper"
                    )
                ) {

                    paper.style.transform =
                        "rotate(0.25deg)";

                } else {

                    paper.style.transform =
                        "rotate(0.2deg)";

                }

            }
        );

    });

}


/* =========================================
   KEYBOARD SHORTCUT
========================================= */

function setupKeyboardShortcut() {

    document.addEventListener(
        "keydown",
        event => {

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

                    confessionForm?.requestSubmit();

                }

            }


            if (event.key === "Escape") {

                closeSeal();

                closeShare();

                closeShareSuccessOverlay();

                closeMobileMenu();

            }

        }
    );

}


/* =========================================
   NAVBAR SCROLL
========================================= */

function setupScrollNavbar() {

    function updateNavbar() {

        if (!navbar) {
            return;
        }


        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );

    }


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive: true
        }
    );


    updateNavbar();

}


/* =========================================
   REVEAL ELEMENTS
========================================= */

function revealElements() {

    const elements =
        document.querySelectorAll(
            ".active-section .hero, " +
            ".active-section .tonight-wrapper, " +
            ".active-section .page-heading, " +
            ".active-section .writing-paper, " +
            ".active-section .read-header, " +
            ".active-section .reading-container, " +
            ".active-section .about-content"
        );


    elements.forEach(
        (element, index) => {

            element.classList.remove(
                "reveal-element",
                "revealed"
            );


            void element.offsetWidth;


            element.classList.add(
                "reveal-element"
            );


            setTimeout(() => {

                element.classList.add(
                    "revealed"
                );

            }, 80 + index * 70);

        }
    );

}


/* =========================================
   FOOTER
========================================= */

function setupFooter() {

    if (!currentYear) {
        return;
    }


    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================
   SHARE BUTTON FALLBACK
========================================= */

/*
    Allows the share action to be
    triggered from other parts of
    the website in the future.
*/

window.openShareThisFess =
    function () {

        openShareOverlay(
            currentConfession
        );

    };


/* =========================================
   ERROR HANDLING
========================================= */

window.addEventListener(
    "error",
    event => {

        console.error(
            "DEAR, SOMEONE. error:",
            event.error || event.message
        );

    }
);
