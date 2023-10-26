import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = "40169481-f0402a27955d707cb1705c374";
const API_URL = "https://pixabay.com/api/";
const RESULTS_PER_PAGE = 20;

const searchForm = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

let currentPage = 1;
let currentSearchQuery = "";

searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const searchQuery = event.target.searchQuery.value.trim();
  if (searchQuery === "") {
    return;
  }
  
  currentSearchQuery = searchQuery;
  currentPage = 1;
  await fetchImages(searchQuery, currentPage);
});

loadMoreBtn.addEventListener("click", async function () {
  currentPage++;
  await fetchImages(currentSearchQuery, currentPage);
});

async function fetchImages(query, page) {
  try {
    const response = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: RESULTS_PER_PAGE,
        page: page
      }
    });

    const images = response.data.hits;
    if (page === 1) {
      gallery.innerHTML = "";
    }
    if (images.length === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else {
      renderImages(images);
      if (images.length < RESULTS_PER_PAGE) {
        loadMoreBtn.style.display = "none";
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      } else {
        loadMoreBtn.style.display = "block";
      }
    }
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure("Oops! Something went wrong. Please try again later.");
  }
}

function renderImages(images) {
  images.forEach(image => {
    const photoCard = document.createElement("div");
    photoCard.classList.add("photo-card");

    const imageLink = document.createElement("a");
    imageLink.href = image.largeImageURL;
    imageLink.classList.add("lightbox");

    imageLink.innerHTML = `
       <img class="pic" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
       <div class="info">
        <p class="info-item likes">Likes ${image.likes}</p>
        <p class="info-item views">Views ${image.views}</p>
        <p class="info-item coments">Comments ${image.comments}</p>
        <p class="info-item downloads">Downloads ${image.downloads}</p>
      </div>
    `;

    photoCard.appendChild(imageLink);
    gallery.appendChild(photoCard);
  });

  const lightbox = new SimpleLightbox('.lightbox');
  lightbox.refresh();
}

loadMoreBtn.style.display = "none";