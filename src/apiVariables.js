import { config } from "./config.js";

const apiKey = config.apiKey;

// Querying for basic API config info, base_url, and size used for finding images
let secure_base_url, size;
const apiConfigRequest = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;
fetch(apiConfigRequest)
  .then((response) => response.json())
  .then((data) => {
    secure_base_url = data.images.secure_base_url;
    size = data.images.backdrop_sizes[0];
  })
  .catch(console.log);

// Get mapping of genre ids for en-US, store into genreMapping in (id, name) format
let genreMapping = new Map();
const apiGenreRequest = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
fetch(apiGenreRequest)
  .then((response) => response.json())
  .then((data) => {
    data.genres.forEach(function (genrePair) {
      genreMapping.set(genrePair.id, genrePair.name);
    });
  })
  .catch(console.log);

export { secure_base_url, size, genreMapping };
