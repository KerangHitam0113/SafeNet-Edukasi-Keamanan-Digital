/* =========================
   MENU NAVIGATION
========================= */

const menuBtn = document.getElementById("menuBtn");
const menuOverlay = document.getElementById("menuOverlay");
const menuLinks = document.querySelectorAll(".menu-content a");
const container = document.getElementById("horizontalContainer");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    menuOverlay.classList.toggle("show");
});

function closeMenu() {
    menuBtn.classList.remove("active");
    menuOverlay.classList.remove("show");
}

menuLinks.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();

        const target = document.querySelector(link.getAttribute("href"));

        container.scrollTo({
            left: target.offsetLeft,
            behavior: "smooth"
        });

        closeMenu();
    });
});


/* =========================
   HORIZONTAL PAGE SCROLL
========================= */

// Scroll mouse ke kanan/kiri
container.addEventListener("wheel", event => {

    if (event.target.closest(".gallery-track") ||
        event.target.closest(".uploaded-gallery")) {
        return;
    }

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();

        container.scrollBy({
            left: event.deltaY,
            behavior: "auto"
        });
    }
}, { passive: false });


// Keyboard navigation
document.addEventListener("keydown", event => {

    if (menuOverlay.classList.contains("show") ||
        document.querySelector(".lightbox.show")) {
        return;
    }

    if (event.key === "ArrowRight") {
        container.scrollBy({
            left: window.innerWidth,
            behavior: "smooth"
        });
    }

    if (event.key === "ArrowLeft") {
        container.scrollBy({
            left: -window.innerWidth,
            behavior: "smooth"
        });
    }

    if (event.key === "Escape") {
        closeMenu();
        closeLightbox();
    }
});


/* =========================
   GALLERY SLIDER
========================= */

const galleryTrack = document.getElementById("galleryTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const galleryCounter = document.getElementById("galleryCounter");

function getGalleryStep() {
    const card = galleryTrack.querySelector(".gallery-card");

    if (!card) return 300;

    return card.offsetWidth + 22;
}

nextBtn.addEventListener("click", () => {
    galleryTrack.scrollBy({
        left: getGalleryStep(),
        behavior: "smooth"
    });
});

prevBtn.addEventListener("click", () => {
    galleryTrack.scrollBy({
        left: -getGalleryStep(),
        behavior: "smooth"
    });
});

function updateGallery() {

    const maxScroll =
        galleryTrack.scrollWidth - galleryTrack.clientWidth;

    const currentScroll = galleryTrack.scrollLeft;

    let progress = maxScroll > 0
        ? (currentScroll / maxScroll) * 100
        : 100;

    progressBar.style.width = progress + "%";

    const cards = galleryTrack.querySelectorAll(".gallery-card");

    let currentIndex = 1;

    if (cards.length) {
        currentIndex = Math.min(
            cards.length,
            Math.floor(
                (currentScroll + 10) / getGalleryStep()
            ) + 1
        );
    }

    galleryCounter.innerText =
        String(currentIndex).padStart(2, "0") +
        " / " +
        String(cards.length).padStart(2, "0");
}

galleryTrack.addEventListener("scroll", updateGallery);

window.addEventListener("resize", updateGallery);

updateGallery();


/* =========================
   DRAG GALLERY WITH MOUSE
========================= */

let isDragging = false;
let startX = 0;
let startScroll = 0;

galleryTrack.addEventListener("mousedown", event => {

    if (event.target.closest("button")) return;

    isDragging = true;
    startX = event.pageX;
    startScroll = galleryTrack.scrollLeft;

    galleryTrack.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
    isDragging = false;
    galleryTrack.style.cursor = "grab";
});

galleryTrack.addEventListener("mousemove", event => {

    if (!isDragging) return;

    event.preventDefault();

    const distance = event.pageX - startX;

    galleryTrack.scrollLeft =
        startScroll - distance;
});


/* =========================
   IMAGE UPLOAD
========================= */

const imageUpload = document.getElementById("imageUpload");
const uploadedGallery = document.getElementById("uploadedGallery");

imageUpload.addEventListener("change", event => {

    const files = Array.from(event.target.files);

    files.forEach(file => {

        if (!file.type.startsWith("image/")) return;

        const imageURL = URL.createObjectURL(file);

        const item = document.createElement("div");
        item.className = "uploaded-item";

        const image = document.createElement("img");
        image.src = imageURL;
        image.alt = file.name;

        image.addEventListener("click", () => {
            openLightbox(imageURL, file.name);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-photo";
        deleteBtn.innerText = "×";
        deleteBtn.title = "Hapus foto";

        deleteBtn.addEventListener("click", () => {
            URL.revokeObjectURL(imageURL);
            item.remove();
        });

        item.appendChild(image);
        item.appendChild(deleteBtn);

        uploadedGallery.appendChild(item);
    });

    // Memungkinkan file yang sama diunggah kembali
    imageUpload.value = "";
});


/* =========================
   LIGHTBOX
========================= */

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightboxBtn = document.getElementById("closeLightbox");

function openLightbox(src, caption) {

    lightboxImage.src = src;
    lightboxCaption.innerText = caption;

    lightbox.classList.add("show");
}

function closeLightbox() {

    lightbox.classList.remove("show");

    lightboxImage.src = "";
}

closeLightboxBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});


// Klik foto bawaan gallery
galleryTrack.addEventListener("click", event => {

    if (isDragging) return;

    const card = event.target.closest(".gallery-card");

    if (!card) return;

    const image = card.querySelector("img");
    const title = card.querySelector("h3");

    openLightbox(image.src, title.innerText);
});


/* =========================
   THANK YOU BUTTON
========================= */

const thankBtn = document.getElementById("thankBtn");
const thankMessage = document.getElementById("thankMessage");

thankBtn.addEventListener("click", () => {

    thankMessage.innerText =
        "💙 Terima kasih sudah menjadi bagian dari SafeNet!";

    thankMessage.style.animation =
        "fadeIn .7s ease";
});
