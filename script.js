const min = 90471;
const max = 150000;

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "633bef796fmshdbc2bfa48ac9ed9p1af420jsn04383590067a",
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
  return getRandomAlbum();
};

const renderMainAlbum = async () => {
  const album = await getRandomAlbum();
  console.log(album);
  const albumLargeImg = document.getElementById("album-large-img");
  const albumLargeTitle = document.getElementById("album-large-title");
  const albumLargeContributors = document.getElementById(
    "album-large-contributors"
  );
  const albumLargeDescription = document.getElementById(
    "album-large-description"
  );

  albumLargeImg.src = album.cover_medium;
  //   albumLargeTitle.textContent = album.title;
  albumLargeTitle.innerHTML = `<a style="text-decoration:none; color: white;" href="./album.html?id=${album.id}">${album.title}</a>`;
  albumLargeContributors.textContent =
    album.contributors.length > 1
      ? `${album.contributors[0].name}, ${album.contributors[1].name}`
      : album.contributors[0].name;
  if (album.contributors[0].name.toLowerCase() === "artisti vari") {
    albumLargeDescription.textContent = `Ascolta il nuovo singolo di ${album.artist.name}`;
  } else {
    albumLargeDescription.textContent =
      album.contributors.length > 1
        ? `Ascolta il nuovo singolo di ${album.contributors[0].name} e ${album.contributors[1].name}`
        : `Ascolta il nuovo singolo di ${album.contributors[0].name}`;
  }
};

const renderSmallAlbums = async () => {
  const album = await getRandomAlbum();
  const albumHtml = `<div class="col-6 col-sm-6 col-lg-4">
      <div class="album-small-card card d-flex flex-row align-items-center">
        <img class="card-img" src="${
          album.cover_medium
        }" alt="" style="width: 100px" />
        <div class="card-body">
          <p class="card-text">${
            album.title.length > 35
              ? album.title.substring(0, 32) + "..."
              : album.title
          }</p>
        </div>
      </div>
    </div>`;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = albumHtml;

  return tempDiv.firstElementChild;
};

const renderMediumAlbums = async () => {
  const album = await getRandomAlbum();
  const albumHtml = `<div class="col-md-6 col-lg-3">
    <div class="album-medium-card card d-flex flex-column" >
    <div class="medium-temp-div ">  
    <img
        class="card-img-top"
        src="${album.cover_medium}" 
        alt="Card image cap"
      />
      <div class="card-body">
        <p class="card-text">${
          album.title.length > 26
            ? album.title.substring(0, 23) + "..."
            : album.title
        }</p>
      </div>
      </div>
      
    </div>
  </div>`;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = albumHtml;

  return tempDiv.firstElementChild;
};

const renderTitles = async () => {
  const album = await getRandomAlbum();
  const playlistHTML = `<p>${album.title}</p>`;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = playlistHTML;

  return tempDiv.firstElementChild;
  
};

const renderAlbums = () => {
  renderMainAlbum();

  for (let z = 0; z < 40; z++){
    renderTitles().then((data) => document.getElementById("playlist").appendChild(data))
  }

  for (let j = 0; j < 6; j++) {
    renderSmallAlbums().then((data) =>
      document.getElementById("row-1").appendChild(data)
    );
  }

  for (let i = 0; i < 8; i++) {
    renderMediumAlbums().then((data) =>
      document.getElementById("row-2").appendChild(data)
    );
  }
};

renderAlbums();
