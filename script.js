/* =========================================================
   DEAR, SOMEONE.
   Main JavaScript
========================================================= */


/* =========================================================
   01. DUMMY LETTER DATABASE
========================================================= */

const defaultLetters = [

    {
        id: 1,
        category: "Seseorang yang Kurindukan",
        text: `Aku tidak tahu apakah aku merindukanmu,
atau hanya merindukan diriku yang dulu
ketika kamu masih ada.`
    },

    {
        id: 2,
        category: "Cinta",
        text: `Aku pernah berharap kita bertemu
di waktu yang lebih baik.

Bukan karena aku tidak bahagia mengenalmu,
tetapi karena mungkin kita berdua
memang belum tahu cara menjaga sesuatu
yang begitu kita inginkan.`
    },

    {
        id: 3,
        category: "Pengakuan",
        text: `Aku sebenarnya masih menyimpan
pesan yang tidak pernah kukirim.

Bukan karena aku tidak tahu harus berkata apa.

Aku hanya takut setelah mengirimnya,
tidak ada lagi alasan untuk kembali.`
    },

    {
        id: 4,
        category: "Persahabatan",
        text: `Terima kasih sudah pernah menjadi
tempat paling nyaman untuk pulang.

Mungkin sekarang kita sudah tidak
sesering dulu berbicara.

Tapi aku masih berharap hidup
memperlakukanmu dengan baik.`
    },

    {
        id: 5,
        category: "Terima Kasih",
        text: `Aku tidak pernah bilang ini sebelumnya.

Terima kasih.

Untuk semua hal kecil yang mungkin
bahkan sudah kamu lupakan,
tetapi pernah membuat hari-hariku
sedikit lebih mudah.`
    },

    {
        id: 6,
        category: "Penyesalan",
        text: `Seandainya waktu bisa diulang,
aku tidak akan meminta kita kembali.

Aku hanya ingin kesempatan
untuk mengatakan sesuatu
yang dulu terlalu gengsi untuk kukatakan:

aku salah.`
    },

    {
        id: 7,
        category: "Perpisahan",
        text: `Aku kira mengucapkan selamat tinggal
berarti berhenti menyayangi seseorang.

Ternyata tidak.

Kadang kita tetap menyayangi seseorang,
hanya saja akhirnya belajar
untuk tidak lagi tinggal.`
    },

    {
        id: 8,
        category: "Hanya Seseorang",
        text: `Aku tidak tahu siapa kamu.

Mungkin kita bahkan tidak akan pernah bertemu.

Tapi kalau suatu hari kamu membaca ini,
semoga kamu tahu bahwa di suatu tempat,
pernah ada seseorang yang berharap
kamu baik-baik saja.`
    },

    {
        id: 9,
        category: "Cinta",
        text: `Aku tidak pernah benar-benar
berhenti menyukaimu.

Aku hanya berhenti mencari alasan
untuk membuatmu tahu.`
    },

    {
        id: 10,
        category: "Seseorang yang Kurindukan",
        text: `Ada hari-hari ketika aku baik-baik saja.

Lalu tiba-tiba ada lagu,
tempat, atau aroma tertentu
yang mengingatkanku kepadamu.

Dan untuk beberapa menit,
aku kembali menjadi seseorang
yang masih menunggumu.`
    },

    {
        id: 11,
        category: "Pengakuan",
        text: `Aku pernah membuka profilmu
hanya untuk memastikan
kamu masih ada.

Lucu ya.

Padahal aku sendiri yang memilih
untuk pergi.`
    },

    {
        id: 12,
        category: "Terima Kasih",
        text: `Mungkin kamu tidak sadar,
tetapi kamu datang di waktu
ketika aku benar-benar membutuhkan
seseorang.

Terima kasih sudah pernah ada.`
    },

    {
        id: 13,
        category: "Penyesalan",
        text: `Maaf karena waktu itu aku memilih diam.

Aku pikir diam akan membuat semuanya
menjadi lebih mudah.

Ternyata diam hanya membuat
penyesalan bertahan lebih lama.`
    },

    {
        id: 14,
        category: "Perpisahan",
        text: `Kalau ini benar-benar terakhir kalinya,
aku cuma ingin bilang:

jaga dirimu.

Aku tidak akan meminta kamu kembali.

Semoga kali ini kita sama-sama
menemukan hidup yang lebih tenang.`
    },

    {
        id: 15,
        category: "Persahabatan",
        text: `Kita mungkin tidak lagi menjadi
dua orang yang selalu tahu
apa yang terjadi dalam hidup masing-masing.

Tapi aku masih menyimpan
semua cerita kita.

Tidak semuanya harus kembali
untuk tetap berarti.`
    },

    {
        id: 16,
        category: "Hanya Seseorang",
        text: `Untuk seseorang yang mungkin
tidak pernah tahu namaku:

semoga malam ini kamu tidur
tanpa memikirkan hal-hal
yang membuatmu sedih.`
    }

];


/* =========================================================
   02. LOCAL STORAGE
========================================================= */

const STORAGE_KEY = "dearSomeoneLetters";


function getLetters() {

    const storedLetters =
        localStorage.getItem(STORAGE_KEY);

    if (!storedLetters) {
        return [...defaultLetters];
    }

    try {

        const parsedLetters =
            JSON.parse(storedLetters);

        if (!Array.isArray(parsedLetters)) {
            return [...defaultLetters];
        }

        return [
            ...defaultLetters,
            ...parsedLetters
        ];

    } catch (error) {

        console.error(
            "Gagal membaca localStorage:",
            error
        );

        return [...defaultLetters];
    }
}


function saveUserLetter(letter) {

    const storedLetters =
        localStorage.getItem(STORAGE_KEY);

    let userLetters = [];

    try {

        userLetters =
            storedLetters
                ? JSON.parse(storedLetters)
                : [];

    } catch {

        userLetters = [];
    }


    userLetters.push(letter);


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(userLetters)
    );
}


/* =========================================================
   03. GLOBAL STATE
========================================================= */

let letters = getLetters();

let currentFilter = "Semua";

let currentLetterIndex = -1;

let selectedCategory = "Cinta";


/* =========================================================
   04. DOM ELEMENTS
========================================================= */

const pageLoader =
    document.getElementById("pageLoader");

const navbar =
    document.querySelector(".navbar");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mobileMenu =
    document.getElementById("mobileMenu");

const letterInput =
    document.getElementById("letterInput");

const characterCount =
    document.getElementById("characterCount");

const sealButton =
    document.getElementById("sealButton");

const sealOverlay =
    document.getElementById("sealOverlay");

const sealedPreview =
    document.getElementById("sealedPreview");

const keepLetterButton =
    document.getElementById("keepLetterButton");

const readAfterSealButton =
    document.getElementById("readAfterSealButton");

const readingCard =
    document.getElementById("readingCard");

const readingContent =
    document.getElementById("readingContent");

const readingCategory =
    document.getElementById("readingCategory");

const readingNumber =
    document.getElementById("readingNumber");

const nextLetterButton =
    document.getElementById("nextLetterButton");

const tonightLetter =
    document.getElementById("tonightLetter");

const tonightCategory =
    document.getElementById("tonightCategory");

const tonightButton =
    document.getElementById("tonightButton");

const tonightDate =
    document.getElementById("tonightDate");


/* =========================================================
   05. PAGE LOADER
========================================================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        pageLoader.classList.add("loaded");

    }, 700);

});


/* =========================================================
   06. NAVBAR SCROLL
========================================================= */

function handleNavbarScroll() {

    if (window.scrollY > 40) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

}


window.addEventListener(
    "scroll",
    handleNavbarScroll
);

handleNavbarScroll();


/* =========================================================
   07. MOBILE MENU
========================================================= */

function toggleMobileMenu() {

    const isOpen =
        mobileMenu.classList.toggle("open");

    mobileMenuButton.classList.toggle(
        "open",
        isOpen
    );

    document.body.style.overflow =
        isOpen ? "hidden" : "";

}


mobileMenuButton.addEventListener(
    "click",
    toggleMobileMenu
);


/* =========================================================
   08. PAGE NAVIGATION
========================================================= */

const navigationElements =
    document.querySelectorAll(
        "[data-page]"
    );


navigationElements.forEach(element => {

    element.addEventListener(
        "click",
        event => {

            const targetPage =
                element.dataset.page;

            const target =
                document.getElementById(
                    targetPage
                );

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });


            /* Close mobile menu */

            if (
                mobileMenu.classList.contains(
                    "open"
                )
            ) {

                mobileMenu.classList.remove(
                    "open"
                );

                mobileMenuButton.classList.remove(
                    "open"
                );

                document.body.style.overflow =
                    "";

            }

        }
    );

});


/* =========================================================
   09. ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll(
        ".page-section"
    );


const navLinks =
    document.querySelectorAll(
        ".nav-menu a"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }

                const id =
                    entry.target.id;

                navLinks.forEach(link => {

                    link.classList.toggle(
                        "active",
                        link.dataset.page === id
                    );

                });

            });

        },
        {
            threshold: 0.35
        }
    );


sections.forEach(section => {

    observer.observe(section);

});


/* =========================================================
   10. CHARACTER COUNTER
========================================================= */

if (letterInput) {

    letterInput.addEventListener(
        "input",
        () => {

            const length =
                letterInput.value.length;

            characterCount.textContent =
                length;

            if (length >= 900) {

                characterCount.style.color =
                    "var(--burgundy)";

            } else {

                characterCount.style.color =
                    "";

            }

        }
    );

}


/* =========================================================
   11. CATEGORY SELECTION — WRITE
========================================================= */

const categoryButtons =
    document.querySelectorAll(
        ".category-pill"
    );


categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            categoryButtons.forEach(
                item => {
                    item.classList.remove(
                        "active"
                    );
                }
            );


            button.classList.add(
                "active"
            );


            selectedCategory =
                button.dataset.category;

        }
    );

});


/* =========================================================
   12. HELPER — RANDOM LETTER
========================================================= */

function getRandomLetter(
    sourceLetters,
    excludeId = null
) {

    if (!sourceLetters.length) {
        return null;
    }


    if (sourceLetters.length === 1) {
        return sourceLetters[0];
    }


    let available =
        sourceLetters.filter(
            letter =>
                letter.id !== excludeId
        );


    if (!available.length) {
        available = sourceLetters;
    }


    const randomIndex =
        Math.floor(
            Math.random() *
            available.length
        );


    return available[randomIndex];

}


/* =========================================================
   13. FORMAT LETTER TEXT
========================================================= */

function formatLetterText(text) {

    return text
        .split("\n")
        .map(paragraph => {

            if (!paragraph.trim()) {
                return "";
            }

            return `<p>${escapeHTML(
                paragraph
            )}</p>`;

        })
        .join("");

}


/* =========================================================
   14. ESCAPE HTML
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================================
   15. SURAT MALAM INI
========================================================= */

function displayTonightLetter(
    excludeId = null
) {

    const randomLetter =
        getRandomLetter(
            letters,
            excludeId
        );

    if (!randomLetter) return;


    tonightLetter.innerHTML =
        formatLetterText(
            randomLetter.text
        );


    tonightCategory.textContent =
        randomLetter.category;


    if (tonightDate) {

        const now =
            new Date();

        const date =
            now.toLocaleDateString(
                "id-ID",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        tonightDate.textContent =
            date;

    }

    tonightLetter.dataset.id =
        randomLetter.id;

}


/* First tonight letter */

displayTonightLetter();


/* Another tonight letter */

if (tonightButton) {

    tonightButton.addEventListener(
        "click",
        () => {

            const currentId =
                Number(
                    tonightLetter.dataset.id
                );

            const current =
                letters.find(
                    letter =>
                        letter.id === currentId
                );

            const next =
                getRandomLetter(
                    letters,
                    current?.id
                );

            if (!next) return;


            tonightLetter.style.opacity =
                "0";

            tonightLetter.style.transform =
                "rotate(-1deg) translateY(8px)";


            setTimeout(() => {

                tonightLetter.innerHTML =
                    formatLetterText(
                        next.text
                    );

                tonightCategory.textContent =
                    next.category;

                tonightLetter.dataset.id =
                    next.id;


                tonightLetter.style.opacity =
                    "";

                tonightLetter.style.transform =
                    "";

            }, 300);

        }
    );

}


/* =========================================================
   16. READ LETTER
========================================================= */

function getFilteredLetters() {

    if (currentFilter === "Semua") {
        return letters;
    }

    return letters.filter(
        letter =>
            letter.category === currentFilter
    );

}


function displayReadingLetter(
    letter,
    animate = true
) {

    if (!letter) return;


    if (animate) {

        readingCard.classList.add(
            "changing"
        );


        setTimeout(() => {

            updateReadingContent(letter);

            readingCard.classList.remove(
                "changing"
            );

        }, 350);

    } else {

        updateReadingContent(letter);

    }

}


function updateReadingContent(letter) {

    readingContent.innerHTML =
        formatLetterText(
            letter.text
        );


    readingCategory.textContent =
        letter.category;


    readingNumber.textContent =
        String(letter.id)
            .padStart(3, "0");


    readingCard.dataset.id =
        letter.id;

}


/* =========================================================
   17. GET NEXT READING LETTER
========================================================= */

function showRandomReadingLetter() {

    const filteredLetters =
        getFilteredLetters();

    if (!filteredLetters.length) {

        readingContent.innerHTML = `
            <p>
                Belum ada surat dalam
                kategori ini.
            </p>
        `;

        readingCategory.textContent =
            currentFilter;

        readingNumber.textContent =
            "—";

        return;
    }


    const currentId =
        Number(
            readingCard.dataset.id
        );


    const nextLetter =
        getRandomLetter(
            filteredLetters,
            currentId
        );


    currentLetterIndex =
        filteredLetters.findIndex(
            letter =>
                letter.id === nextLetter.id
        );


    displayReadingLetter(
        nextLetter,
        true
    );

}


/* =========================================================
   18. INITIAL READING LETTER
========================================================= */

const initialReadingLetter =
    getRandomLetter(letters);


if (initialReadingLetter) {

    displayReadingLetter(
        initialReadingLetter,
        false
    );

}


/* =========================================================
   19. READ CATEGORY FILTER
========================================================= */

const readCategoryButtons =
    document.querySelectorAll(
        ".read-category"
    );


readCategoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            readCategoryButtons.forEach(
                item => {
                    item.classList.remove(
                        "active"
                    );
                }
            );


            button.classList.add(
                "active"
            );


            currentFilter =
                button.dataset.filter;


            const filteredLetters =
                getFilteredLetters();


            if (!filteredLetters.length) {

                readingContent.innerHTML = `
                    <p>
                        Belum ada surat dalam
                        kategori ini.
                    </p>
                `;

                readingCategory.textContent =
                    currentFilter;

                readingNumber.textContent =
                    "—";

                return;

            }


            const randomLetter =
                getRandomLetter(
                    filteredLetters
                );


            displayReadingLetter(
                randomLetter,
                true
            );

        }
    );

});


/* =========================================================
   20. NEXT LETTER BUTTON
========================================================= */

if (nextLetterButton) {

    nextLetterButton.addEventListener(
        "click",
        showRandomReadingLetter
    );

}


/* =========================================================
   21. SEAL LETTER
========================================================= */

function openSealAnimation() {

    const text =
        letterInput.value.trim();


    /* Validation */

    if (!text) {

        letterInput.focus();

        letterInput.classList.add(
            "shake"
        );


        setTimeout(() => {

            letterInput.classList.remove(
                "shake"
            );

        }, 500);

        return;
    }


    /* Preview */

    sealedPreview.textContent =
        text.length > 230
            ? text.substring(0, 230) + "..."
            : text;


    /* Open animation */

    sealOverlay.classList.add(
        "active"
    );


    sealOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    /* Save letter */

    const newLetter = {

        id:
            Date.now(),

        category:
            selectedCategory,

        text:
            text

    };


    saveUserLetter(
        newLetter
    );


    letters = getLetters();

}


/* =========================================================
   22. SEAL BUTTON
========================================================= */

if (sealButton) {

    sealButton.addEventListener(
        "click",
        openSealAnimation
    );

}


/* =========================================================
   23. CLOSE SEAL OVERLAY
========================================================= */

function closeSealOverlay(
    goToRead = false
) {

    sealOverlay.classList.remove(
        "active"
    );


    sealOverlay.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    setTimeout(() => {

        letterInput.value = "";

        characterCount.textContent =
            "0";


        /* Reset category */

        categoryButtons.forEach(
            item => {

                item.classList.remove(
                    "active"
                );

            }
        );


        const firstCategory =
            document.querySelector(
                ".category-pill"
            );


        if (firstCategory) {

            firstCategory.classList.add(
                "active"
            );

            selectedCategory =
                firstCategory.dataset.category;

        }


        if (goToRead) {

            document
                .getElementById("read")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }

    }, 500);

}


/* =========================================================
   24. KEEP LETTER
========================================================= */

if (keepLetterButton) {

    keepLetterButton.addEventListener(
        "click",
        () => {

            closeSealOverlay(
                false
            );

            setTimeout(() => {

                document
                    .getElementById("home")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }, 550);

        }
    );

}


/* =========================================================
   25. READ AFTER SEAL
========================================================= */

if (readAfterSealButton) {

    readAfterSealButton.addEventListener(
        "click",
        () => {

            closeSealOverlay(
                true
            );

            setTimeout(() => {

                const newestLetter =
                    letters[letters.length - 1];

                if (newestLetter) {

                    displayReadingLetter(
                        newestLetter,
                        false
                    );

                }

            }, 600);

        }
    );

}


/* =========================================================
   26. CLOSE OVERLAY WITH ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            sealOverlay.classList.contains(
                "active"
            )
        ) {

            closeSealOverlay(
                false
            );

        }

    }
);


/* =========================================================
   27. SHAKE ANIMATION
========================================================= */

const shakeStyle =
    document.createElement("style");


shakeStyle.textContent = `

    .shake {
        animation:
            shakeInput
            0.45s ease;
    }

    @keyframes shakeInput {

        0%,
        100% {
            transform: translateX(0);
        }

        20% {
            transform: translateX(-7px);
        }

        40% {
            transform: translateX(7px);
        }

        60% {
            transform: translateX(-5px);
        }

        80% {
            transform: translateX(5px);
        }

    }

`;


document.head.appendChild(
    shakeStyle
);


/* =========================================================
   28. LETTER HOVER PARALLAX
========================================================= */

const paperElements =
    document.querySelectorAll(
        ".tonight-letter, .form-paper, .reading-card"
    );


paperElements.forEach(paper => {

    paper.addEventListener(
        "mousemove",
        event => {

            if (
                window.innerWidth < 800
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


            const centerX =
                rect.width / 2;


            const centerY =
                rect.height / 2;


            const rotateX =
                ((y - centerY) /
                    centerY) *
                -1.5;


            const rotateY =
                ((x - centerX) /
                    centerX) *
                1.5;


            paper.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                rotateZ(0deg)
                translateY(-2px)
            `;

        }
    );


    paper.addEventListener(
        "mouseleave",
        () => {

            if (
                paper.classList.contains(
                    "tonight-letter"
                )
            ) {

                paper.style.transform =
                    "rotate(-0.5deg)";

            } else if (
                paper.classList.contains(
                    "reading-card"
                )
            ) {

                paper.style.transform =
                    "rotate(0.45deg)";

            } else {

                paper.style.transform =
                    "";

            }

        }
    );

});


/* =========================================================
   29. SMOOTH SECTION REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".section-heading, .tonight-letter, .page-intro, .form-paper, .reading-card, .about-content, .about-closing"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    !entry.isIntersecting
                ) {
                    return;
                }


                entry.target.classList.add(
                    "revealed"
                );


                revealObserver.unobserve(
                    entry.target
                );

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(
    element => {

        element.classList.add(
            "reveal-element"
        );

        revealObserver.observe(
            element
        );

    }
);


/* =========================================================
   30. REVEAL CSS
========================================================= */

const revealStyle =
    document.createElement("style");


revealStyle.textContent = `

    .reveal-element {
        opacity: 0;
        transform: translateY(35px);
        transition:
            opacity 0.9s ease,
            transform 0.9s
            cubic-bezier(
                0.22,
                1,
                0.36,
                1
            );
    }

    .reveal-element.revealed {
        opacity: 1;
        transform: translateY(0);
    }

`;


document.head.appendChild(
    revealStyle
);


/* =========================================================
   31. PREVENT ACCIDENTAL FORM SUBMISSION
========================================================= */

if (letterInput) {

    letterInput.addEventListener(
        "keydown",
        event => {

            /*
                Ctrl/Cmd + Enter
                = seal letter
            */

            if (
                (event.ctrlKey ||
                    event.metaKey) &&
                event.key === "Enter"
            ) {

                event.preventDefault();

                openSealAnimation();

            }

        }
    );

}


/* =========================================================
   32. UPDATE LETTER COUNT WHEN STORAGE CHANGES
========================================================= */

window.addEventListener(
    "storage",
    () => {

        letters = getLetters();

        displayTonightLetter();

    }
);


/* =========================================================
   33. CONSOLE MESSAGE
========================================================= */

console.log(`
────────────────────────────────────

        DEAR, SOMEONE.

        For all the things
        you never got to say.

        ♡

────────────────────────────────────
`);