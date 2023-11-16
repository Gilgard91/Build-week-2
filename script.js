const min = 90471;
const max = 150000;

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "2800f46700msh59f96c5e03ffa07p183fe6jsn4a41162d104c",
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
  }
};

const getRandomAlbum = async () => {
  let random = Math.round(Math.random() * (max - min) + min);
  let urlRandomAlbum = `https://deezerdevs-deezer.p.rapidapi.com/album/${random}`;

  const getAlbum = await fetch(urlRandomAlbum, options);
  const result = await getAlbum.json();
  if (result !== undefined && result.id) {
    return result;
  }
  return getRandomAlbum;
};

const getRandomGenre = async () => {
  let urlRandomGenre = "https://deezer-proxy2-6076a9afa64d.herokuapp.com/deezer/genre";

  const getGenre = await fetch(urlRandomGenre);
  const result = await getGenre.json();
  console.log(result);
  const randomGenres = new Set();
  while (randomGenres.size < 6) {
    let randomNumber = Math.round(Math.random() * (result.data.length - 1));
    randomGenres.add(result.data[randomNumber]);
  }

  return randomGenres;
};

const getRandomSongs = async (numOfSongs) => {
  let urlRandomSongs = `https://deezer-proxy2-6076a9afa64d.herokuapp.com/deezer/songs/random-song/${numOfSongs}`;

  const getSongs = await fetch(urlRandomSongs);
  const result = await getSongs.json();

  return result;
};

const renderMainAlbum = async () => {
  const album = await getRandomAlbum();
  console.log(album);
  const albumLargeImg = document.getElementById("album-large-img");
  const albumLargeTitle = document.getElementById("album-large-title");
  const albumLargeContributors = document.getElementById("album-large-contributors");
  const albumLargeDescription = document.getElementById("album-large-description");

  albumLargeImg.src = album.cover_medium;
  //   albumLargeTitle.textContent = album.title;
  albumLargeTitle.innerHTML = `<a style="text-decoration:none; color: #f5f5f5;" href="./album.html?id=${album.id}">${album.title}</a>`;
  albumLargeContributors.innerHTML =
    album.contributors.length > 1
      ? `<a style="text-decoration:none; color: #f5f5f5;" href="./artist.html?id=${album.artist.id}">${album.contributors[0].name}, ${album.contributors[1].name}</a>`
      : `<a style="text-decoration:none; color: #f5f5f5;" href="./artist.html?id=${album.artist.id}">${album.contributors[0].name}</a>`;
  if (album.contributors[0].name.toLowerCase() === "artisti vari") {
    albumLargeDescription.textContent = `Ascolta il nuovo singolo di ${album.artist.name}`;
  } else {
    albumLargeDescription.textContent =
      album.contributors.length > 1
        ? `Ascolta il nuovo singolo di ${album.contributors[0].name} e ${album.contributors[1].name}`
        : `Ascolta il nuovo singolo di ${album.contributors[0].name}`;
  }
};

const renderGenres = (genre) => {
  const genreHtml = `<div class="col-6 col-sm-6 col-lg-4">
      <div class="album-small-card card d-flex flex-row align-items-center">
        <img class="card-img" src="${genre.picture_medium}" alt="" style="width: 100px" />
        <div class="card-body">
          <p class="card-text">${genre.name}</p>
        </div>
      </div>
    </div>`;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = genreHtml;

  return tempDiv.firstElementChild;
};

const renderSongs = (song) => {
  const songsHtml = `<div class="col-md-6 col-lg-3">
    <div class="album-medium-card card d-flex flex-column" >
    <div class="medium-temp-div ">  
    <img
        class="card-img-top"
        src="${song.album.cover_medium}" 
        alt="Card image cap"
      />
      <div class="card-body">
        <p class="card-text">${song.title.length > 15 ? song.title_short : song.title}</p>
      </div>
      </div>
      <div class="album-medium-mobile-icons align-items-center justify-content-between"
                  >
                    <div class="d-flex align-items-center gap-4">
                      <img
                        src="./assets/img/heart.png"
                        style="width: 40px"
                        alt=""
                      />
                      <i
                        class="bi bi-three-dots-vertical"
                        style="font-size: 40px; color: #b2b2b2"
                      ></i>
                    </div>
                    <div>
                      <i
                        class="fas fa-play"
                        style="
                          font-size: 24px;
                          color: #f5f5f5;
                          background-color: rgb(36 36 36);
                          padding: 16px;
                          border-radius: 100%;
                        "
                      ></i>
                    </div>
                  </div>
    </div>
  </div>`;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = songsHtml;

  return tempDiv.firstElementChild;
};

const renderTitles = (song) => {
  const playlistHTML = `<p>${song.title}</p>`;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = playlistHTML;

  return tempDiv.firstElementChild;
};

const renderAlbums = async () => {
  renderMainAlbum();

  const genres = await getRandomGenre();
  genres.forEach((genre) => document.getElementById("row-1").appendChild(renderGenres(genre)));

  let songs = await getRandomSongs(12);
  songs.forEach((song) => document.getElementById("row-2").appendChild(renderSongs(song)));

  let songTitles = await getRandomSongs(30);
  songTitles.forEach((title) => document.getElementById("playlist").appendChild(renderTitles(title)));

  // let songs = await getRandomSongs(12);
  // songs.forEach((song) =>
  //   document.getElementById("row-2").appendChild(renderSongs(song))
  // );

  // let playlist = new Set();
  // for (let i = 0; i < 3; i++) {
  //   const a = await getRandomSongs(8);
  //   a.forEach((song) => playlist.add(song));
  // }

  // playlist.forEach((song) =>
  //   document.getElementById("playlist").appendChild(renderTitles(song))
  // );

  // for (let z = 0; z < 1; z++) {
  //   renderTitles().then((data) =>
  //     document.getElementById("playlist").appendChild(data)
  //   );
  // }

  // for (let j = 0; j < 6; j++) {
  //   renderSmallAlbums().then((data) =>
  //     document.getElementById("row-1").appendChild(data)
  //   );
  // }

  // for (let i = 0; i < 8; i++) {
  //   renderMediumAlbums().then((data) =>
  //     document.getElementById("row-2").appendChild(data)
  //   );
  // }
};

renderAlbums();
