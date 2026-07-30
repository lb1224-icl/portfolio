(function () {
  function initGallery(gallery) {
    var items = Array.prototype.slice.call(gallery.querySelectorAll(".gallery-grid__item"));
    if (!items.length) return;

    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Close">' +
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg>' +
      "</button>" +
      '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous item">' +
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>' +
      "</button>" +
      '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next item">' +
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>' +
      "</button>" +
      '<figure class="lightbox__figure">' +
      '<img class="lightbox__img" alt="" />' +
      '<video class="lightbox__video" controls playsinline></video>' +
      '<figcaption class="lightbox__caption"></figcaption>' +
      "</figure>";
    document.body.appendChild(lightbox);

    var imgEl = lightbox.querySelector(".lightbox__img");
    var videoEl = lightbox.querySelector(".lightbox__video");
    var captionEl = lightbox.querySelector(".lightbox__caption");
    var closeBtn = lightbox.querySelector(".lightbox__close");
    var prevBtn = lightbox.querySelector(".lightbox__nav--prev");
    var nextBtn = lightbox.querySelector(".lightbox__nav--next");
    var currentIndex = 0;
    var lastFocused = null;

    function isVideo(item) {
      return item.getAttribute("data-type") === "video";
    }

    function show(index) {
      currentIndex = (index + items.length) % items.length;
      var item = items[currentIndex];
      var fullSrc = item.getAttribute("data-full") || item.querySelector("img,video").getAttribute("src");
      var caption = item.getAttribute("data-caption") || "";

      videoEl.pause();
      if (isVideo(item)) {
        imgEl.style.display = "none";
        videoEl.style.display = "block";
        videoEl.src = fullSrc;
      } else {
        videoEl.style.display = "none";
        videoEl.removeAttribute("src");
        imgEl.style.display = "block";
        imgEl.src = fullSrc;
        imgEl.alt = item.querySelector("img").alt;
      }
      captionEl.textContent = caption;
    }

    function open(index) {
      lastFocused = document.activeElement;
      show(index);
      lightbox.classList.add("is-open");
      closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
    }

    function close() {
      videoEl.pause();
      lightbox.classList.remove("is-open");
      document.removeEventListener("keydown", onKeydown);
      if (lastFocused) lastFocused.focus();
    }

    function onKeydown(e) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(currentIndex - 1);
      if (e.key === "ArrowRight") show(currentIndex + 1);
    }

    items.forEach(function (item, index) {
      item.addEventListener("click", function () {
        open(index);
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () {
      show(currentIndex - 1);
    });
    nextBtn.addEventListener("click", function () {
      show(currentIndex + 1);
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
  }

  document.querySelectorAll(".gallery-grid").forEach(initGallery);
})();
