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
  albumLargeTitle.innerHTML = `<a href="./album.html?id=${album.id}">${album.title}</a>`
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
  const albumHtml = `<div class="col-4">
      <div class="album-small-card card d-flex flex-row align-items-center">
        <img class="card-img" src="${album.cover_medium}" alt="" style="width: 100px" />
        <div class="card-body">
          <p class="card-text">${album.title}</p>
        </div>
      </div>
    </div>`;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = albumHtml;

  return tempDiv.firstElementChild;
};

const renderMediumAlbums = async () => {
  const album = await getRandomAlbum();
  const albumHtml = `<div class="col">
    <div class="album-medium-card card" style="max-width: 240px">
      <img
        class="card-img-top"
        src="${album.cover_medium}"
        alt="Card image cap"
      />
      <div class="card-body">
        <p class="card-text">${album.title}</p>
      </div>
    </div>
  </div>`;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = albumHtml;

  return tempDiv.firstElementChild;
};

const renderAlbums = () => {
  renderMainAlbum();

  for (let j = 0; j < 6; j++) {
    renderSmallAlbums().then(data => document.getElementById("row-1").appendChild(data))
    // document.getElementById("row-1").appendChild(renderSmallAlbums());
  }

  for (let i = 0; i < 5; i++) {
    // document.getElementById("row-2").appendChild(renderMediumAlbums());
    renderMediumAlbums().then(data => document.getElementById("row-2").appendChild(data))
  }
};

renderAlbums();
