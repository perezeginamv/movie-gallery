import { filmsMock } from "./filmsMock.js";
import { fromStorage } from "./js/fromStorage.js";
import { toStorage } from "./js/toStorage.js";
import { sortAllFilmsByisFavorite } from "./js/sortAllFilmsByisFavorite.js";
import { sortFavoriteFilms } from "./js/sortFavoriteFilms.js";

const ALL_FILMS = "ALL_FILMS";
const FAVORITE_FILMS = "FAVORITE_FILMS";
if (!fromStorage(ALL_FILMS)) {
  toStorage(ALL_FILMS, filmsMock);
}

//Рисуем список фильмов
renderFilmsList(fromStorage(ALL_FILMS), ALL_FILMS);

//Функция рендера списка фильмов
function renderFilmsList(filmsList, listType) {
  const favoriteFilmsBtnHTML = document.querySelector(
    ".film-cards-container__favourite-films"
  );

  favoriteFilmsBtnHTML.insertAdjacentHTML(
    "afterend",
    `<div id="${listType}" class ="film-cards-container"></div>`
  );

  const filmsContainerHTML = document.querySelector(".film-cards-container");

  //Отрисовка карточек фильмов
  if (filmsList.length) {
    filmsList.forEach((film) => renderFilmCard(film, filmsContainerHTML));
    
  } else {
    filmsContainerHTML.innerHTML = "<div>Список фильмов пуст</div>";
    
  }

  //Слушатели, добавление фильмов в избранное
  const likeBtns = document.querySelectorAll(".film-card__button");
  likeBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => handleLikeBtnClick(listType, index));
  });

  //Слушатели, открытие/закрытие модального окна
  const filmTitles = document.querySelectorAll(".film-card__title");
  filmTitles.forEach((title, index) => {
    title.addEventListener("click", () => {
      const clickedFilm = filmsList[index];
      renderFilmModal(clickedFilm, filmsContainerHTML);

      const closeModalBtnHTML = document.querySelector(".close-modal");
      closeModalBtnHTML.addEventListener(
        "click",
        () => {
          const modal = document.querySelector(".modal");
          modal.remove();
        },
        { once: true }
      );
    });
  });
}

//Функция отрисовки карточки фильма
function renderFilmCard(film, targetContainer) {
  const { imgUrl, movieName, releaseYear, isFavourite } = film;
  const btnImg = isFavourite ? "favourite.png" : "notFavourite.png";
  targetContainer.insertAdjacentHTML(
    "beforeend",
    `<div class="film-card">
        <img class="film-card__poster" src="${imgUrl}">
        <div class="film-card__title">${movieName}</div>
        <div class="film-card__year">${releaseYear}</div>
        <button class="film-card__button">
            <img class="film-card__button-img" src="assets/img/${btnImg}">
        </button>
    </div>`
  );
}

//Функция отрисовки моального окна с фильмом
function renderFilmModal(clickedFilm, targetContainer) {
  const { imgUrl, movieName, releaseYear, isFavourite, description } =
    clickedFilm;
  const btnImg = isFavourite ? "favourite.png" : "notFavourite.png";

  targetContainer.insertAdjacentHTML(
    "afterEnd",
    `<div class="modal">
    <div class="modal-content">
      <div class="close-modal">
        <img class="close-modal-icon" src="assets/img/cross.png">
      </div>
      <img class="film-card__poster" src="${imgUrl}">
      <div class="film-card__title">${movieName}</div>
      <div class="film-card__year">${releaseYear}</div>
      <div class="film-card__description">${description}</div>
      <button class="film-card__button">
      <img class="film-card__button-img" src="assets/img/${btnImg}">
        </button>
    </div>
  </div>`
  );
}

const favoriteFilmsBtnHTML = document.querySelector(
  ".film-cards-container__favourite-films"
);
favoriteFilmsBtnHTML.addEventListener("click", () =>
  handleFilmsListSwitch(favoriteFilmsBtnHTML)
);

//Функция-свитчер списков
function handleFilmsListSwitch(switcherBtn) {
  const filmsContainerHTML = document.querySelector(".film-cards-container");
  const filmsCardContainerTitleHTML = document.querySelector(
    ".film-cards-container__title"
  );

  const favoriteFilms = fromStorage(ALL_FILMS).filter(
    ({ isFavourite }) => isFavourite
  );
  switch (filmsContainerHTML.id) {
    case ALL_FILMS:
      filmsCardContainerTitleHTML.innerHTML = "Favorite Film";
      switcherBtn.innerHTML = "See All Films";
      filmsContainerHTML.remove();   
      renderFilmsList(favoriteFilms, FAVORITE_FILMS);
      return;
    case FAVORITE_FILMS:
      filmsCardContainerTitleHTML.innerHTML = "All Films";
      switcherBtn.innerHTML = "See Favorite Films";
      filmsContainerHTML.remove();
      renderFilmsList(fromStorage(ALL_FILMS), ALL_FILMS);
      
      return;
    default:
      return;
  }
}

function handleLikeBtnClick(listTipe, filmNumber) {
  const allFilms = fromStorage(ALL_FILMS);
  allFilms[filmNumber].isFavourite = !allFilms[filmNumber].isFavourite;

  const sortedAllFilms = sortAllFilmsByisFavorite(allFilms);
  toStorage(ALL_FILMS, sortedAllFilms);

  const filmsListContainerHTML = document.getElementById(listTipe);
  filmsListContainerHTML.remove();

  switch (listTipe) {
    case ALL_FILMS:
      renderFilmsList(sortedAllFilms, listTipe);
      return;
    case FAVORITE_FILMS:
      renderFilmsList(sortFavoriteFilms(allFilms), listTipe);
      return;
    default:
      return;
  }  
}