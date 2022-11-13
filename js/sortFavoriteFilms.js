export function sortFavoriteFilms(films) {
    return films.filter(({isFavourite})=>isFavourite).sort((a, b)=>b.id-a.id); 
}