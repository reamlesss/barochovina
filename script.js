/* ========================================================= */
/* MESSAGE CARD REVEAL */
/* ========================================================= */

const messageCard = document.querySelector(".message-card");

if (messageCard) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },

    {
      threshold: 0.25,
    },
  );

  observer.observe(messageCard);
}

/* ========================================================= */
/* FLOATING HEARTS */
/* ========================================================= */

const heartsContainer = document.querySelector(".hearts");

function createHeart() {
  if (!heartsContainer) return;

  const heart = document.createElement("div");

  heart.classList.add("heart");

  heart.innerHTML = "♥";

  heart.style.left = Math.random() * 100 + "%";

  heart.style.fontSize = Math.random() * 14 + 8 + "px";

  heart.style.animationDuration = Math.random() * 8 + 7 + "s";

  heart.style.animationDelay = Math.random() * 2 + "s";

  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 15000);
}

setInterval(createHeart, 900);

/* ========================================================= */
/* MOUSE PARALLAX */
/* ========================================================= */

document.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;

  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  const glows = document.querySelectorAll(".glow");

  glows.forEach((glow, index) => {
    const strength = (index + 1) * 8;

    glow.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  });
});

/* ========================================================= */
/* MOVIES */
/* ========================================================= */

/*
    ZATÍM JS DATA.

    Později tuto část napojíme na Firebase.
    Struktura dat už je připravená tak, aby se
    dala jednoduše přesunout do databáze.
*/

let movies = [
  {
    id: 1,
    title: "Pomocnice 2",
    type: "movie",
    year: "2027",
    note: "",
    watched: false,
  },

  {
    id: 2,
    title: "Šestý smysl",
    type: "movie",
    year: "1999",
    note: "",
    watched: false,
  },

  {
    id: 3,
    title: "Game of Thrones",
    type: "series",
    year: "2011",
    note: "",
    watched: true,
  },
];

let currentMovieFilter = "all";

/* Render movies */

function renderMovies() {
  const moviesList = document.getElementById("moviesList");

  if (!moviesList) return;

  moviesList.innerHTML = "";

  const filteredMovies = movies.filter((movie) => {
    if (currentMovieFilter === "all") {
      return true;
    }

    if (currentMovieFilter === "watched") {
      return movie.watched;
    }

    return movie.type === currentMovieFilter;
  });

  if (filteredMovies.length === 0) {
    moviesList.innerHTML = `
            <div class="empty-state">
                <div>♡</div>
                <p>Zatím tu nic není.</p>
                <span>Přidej něco na náš seznam.</span>
            </div>
        `;

    return;
  }

  filteredMovies.forEach((movie) => {
    const card = document.createElement("article");

    card.className = `item-card ${movie.watched ? "is-watched" : ""}`;

    card.innerHTML = `

            <div class="item-card-top">

                <div class="item-icon">
                    ${movie.type === "movie" ? "🎬" : "📺"}
                </div>

                <button
                    class="delete-button"
                    onclick="deleteMovie(${movie.id})"
                    title="Odstranit"
                >
                    ×
                </button>

            </div>


            <div class="item-type">

                ${movie.type === "movie" ? "FILM" : "SERIÁL"}

                ${movie.year ? ` · ${movie.year}` : ""}

            </div>


            <h3>
                ${escapeHtml(movie.title)}
            </h3>


            ${movie.note ? `<p>${escapeHtml(movie.note)}</p>` : ""}


            <button
                class="status-button"
                onclick="toggleMovieWatched(${movie.id})"
            >

                ${movie.watched ? "❤️ Viděno" : "♡ Označit jako viděné"}

            </button>

        `;

    moviesList.appendChild(card);
  });
}

/* Delete movie */

function deleteMovie(id) {
  movies = movies.filter((movie) => movie.id !== id);

  renderMovies();
}

/* Mark movie as watched */

function toggleMovieWatched(id) {
  const movie = movies.find((movie) => movie.id === id);

  if (!movie) return;

  movie.watched = !movie.watched;

  renderMovies();
}

/* Movie filters */

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.classList.remove("active");
    });

    button.classList.add("active");

    currentMovieFilter = button.dataset.filter;

    renderMovies();
  });
});

/* Add movie */

const movieForm = document.getElementById("movieForm");

if (movieForm) {
  movieForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("movieTitle").value.trim();

    const type = document.getElementById("movieType").value;

    const year = document.getElementById("movieYear").value;

    const note = document.getElementById("movieNote").value.trim();

    movies.push({
      id: Date.now(),

      title,

      type,

      year,

      note,

      watched: false,
    });

    renderMovies();

    movieForm.reset();

    closeModal("movieModal");
  });
}

/* ========================================================= */
/* TRAVEL BUCKET LIST */
/* ========================================================= */

let travelPlaces = [
  {
    id: 1,
    name: "Řím",
    country: "Itálie",
    note: "",
    status: "visited",
  },

  {
    id: 2,
    name: "Vánoční New York",
    country: "USA",
    note: "",
    status: "planned",
  },

  {
    id: 3,
    name: "Laponsko",
    country: "Finsko",
    note: "",
    status: "planned",
  },
];

let currentTravelFilter = "all";

/* Render travel */

function renderTravel() {
  const travelList = document.getElementById("travelList");

  if (!travelList) return;

  travelList.innerHTML = "";

  const filteredPlaces = travelPlaces.filter((place) => {
    if (currentTravelFilter === "all") {
      return true;
    }

    return place.status === currentTravelFilter;
  });

  if (filteredPlaces.length === 0) {
    travelList.innerHTML = `
            <div class="empty-state">
                <div>🌍</div>
                <p>Zatím tu nic není.</p>
                <span>Přidej místo, kam spolu chceme jet.</span>
            </div>
        `;

    return;
  }

  filteredPlaces.forEach((place) => {
    const card = document.createElement("article");

    card.className = `item-card travel-card ${
      place.status === "visited" ? "is-watched" : ""
    }`;

    card.innerHTML = `

            <div class="item-card-top">

                <div class="item-icon">
                    🌍
                </div>

                <button
                    class="delete-button"
                    onclick="deleteTravelPlace(${place.id})"
                    title="Odstranit"
                >
                    ×
                </button>

            </div>


            <div class="item-type">

                ${place.status === "visited" ? "NAVŠTÍVENO" : "BUCKET LIST"}

            </div>


            <h3>
                ${escapeHtml(place.name)}
            </h3>


            ${
              place.country
                ? `
                        <div class="travel-country">
                            ${escapeHtml(place.country)}
                        </div>
                    `
                : ""
            }


            ${place.note ? `<p>${escapeHtml(place.note)}</p>` : ""}


            <button
                class="status-button"
                onclick="toggleTravelVisited(${place.id})"
            >

                ${
                  place.status === "visited"
                    ? "❤️ Navštíveno"
                    : "♡ Označit jako navštívené"
                }

            </button>

        `;

    travelList.appendChild(card);
  });
}

/* Delete travel place */

function deleteTravelPlace(id) {
  travelPlaces = travelPlaces.filter((place) => place.id !== id);

  renderTravel();
}

/* Toggle visited */

function toggleTravelVisited(id) {
  const place = travelPlaces.find((place) => place.id === id);

  if (!place) return;

  place.status = place.status === "visited" ? "planned" : "visited";

  renderTravel();
}

/* Travel filters */

document.querySelectorAll("[data-travel-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-travel-filter]").forEach((button) => {
      button.classList.remove("active");
    });

    button.classList.add("active");

    currentTravelFilter = button.dataset.travelFilter;

    renderTravel();
  });
});

/* Add travel place */

const travelForm = document.getElementById("travelForm");

if (travelForm) {
  travelForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("travelName").value.trim();

    const country = document.getElementById("travelCountry").value.trim();

    const note = document.getElementById("travelNote").value.trim();

    travelPlaces.push({
      id: Date.now(),

      name,

      country,

      note,

      status: "planned",
    });

    renderTravel();

    travelForm.reset();

    closeModal("travelModal");
  });
}

/* ========================================================= */
/* MODALS */
/* ========================================================= */

function openModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.classList.add("active");

  document.body.classList.add("modal-open");
}

function closeModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.classList.remove("active");

  document.body.classList.remove("modal-open");
}

/* Open movie modal */

const openMovieModal = document.getElementById("openMovieModal");

if (openMovieModal) {
  openMovieModal.addEventListener("click", () => {
    openModal("movieModal");
  });
}

/* Open travel modal */

const openTravelModal = document.getElementById("openTravelModal");

if (openTravelModal) {
  openTravelModal.addEventListener("click", () => {
    openModal("travelModal");
  });
}

/* Close buttons */

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(button.dataset.close);
  });
});

/* Close when clicking outside */

document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal(overlay.id);
    }
  });
});

/* Close with Escape */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  document.querySelectorAll(".modal-overlay.active").forEach((modal) => {
    closeModal(modal.id);
  });
});

/* ========================================================= */
/* BASIC HTML ESCAPE */
/* ========================================================= */

function escapeHtml(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

/* ========================================================= */
/* MEMORIES LIGHTBOX */
/* ========================================================= */

const memoryPhotos = document.querySelectorAll(".memory-photo");

const photoLightbox = document.getElementById("photoLightbox");

const lightboxImage = document.getElementById("lightboxImage");

const lightboxClose = document.getElementById("lightboxClose");

memoryPhotos.forEach((photo) => {
  photo.addEventListener("click", () => {
    const image = photo.querySelector("img");

    lightboxImage.src = image.src;

    lightboxImage.alt = image.alt;

    photoLightbox.classList.add("active");

    document.body.classList.add("modal-open");
  });
});

function closeLightbox() {
  photoLightbox.classList.remove("active");

  document.body.classList.remove("modal-open");
}

lightboxClose.addEventListener("click", closeLightbox);

photoLightbox.addEventListener("click", (event) => {
  if (event.target === photoLightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && photoLightbox.classList.contains("active")) {
    closeLightbox();
  }
});
/* ========================================================= */
/* LOVE TIMER */
/* ========================================================= */

const relationshipStart = new Date(2025, 9, 30, 0, 0, 0);

function updateLoveTimer() {
  const now = new Date();

  let months =
    (now.getFullYear() - relationshipStart.getFullYear()) * 12 +
    (now.getMonth() - relationshipStart.getMonth());

  let anniversary = new Date(
    relationshipStart.getFullYear(),
    relationshipStart.getMonth() + months,
    relationshipStart.getDate(),
    relationshipStart.getHours(),
    relationshipStart.getMinutes(),
    relationshipStart.getSeconds(),
  );

  if (anniversary > now) {
    months--;

    anniversary = new Date(
      relationshipStart.getFullYear(),
      relationshipStart.getMonth() + months,
      relationshipStart.getDate(),
      relationshipStart.getHours(),
      relationshipStart.getMinutes(),
      relationshipStart.getSeconds(),
    );
  }

  const remaining = now - anniversary;

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  document.getElementById("timerMonths").textContent = months;
  document.getElementById("timerDays").textContent = days;
  document.getElementById("timerHours").textContent = hours;
  document.getElementById("timerSeconds").textContent = seconds;
}

updateLoveTimer();
setInterval(updateLoveTimer, 1000);

/* ========================================================= */
/* INITIAL RENDER */
/* ========================================================= */

renderMovies();
renderTravel();
