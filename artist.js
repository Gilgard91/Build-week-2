const params = new URLSearchParams(window.location.search);
const artistId = params.get("id");
const idProvvisorio = 413;
const urlArtista = "https://deezerdevs-deezer.p.rapidapi.com/artist/" + artistId;
console.log(urlArtista);
const min = 90471;
const max = 150000;

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "2040a53eabmshd42238176446ab0p103fbcjsn8053e71ed3c9",
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
  }
};

window.addEventListener("DOMContentLoaded", () => {
  fetch(urlArtista, options)
    .then((res) => {
      if (res) {
        return res.json();
      } else throw new Error("Generic Fetching error");
    })
    .then((artistObj) => {
      const divImage = document.querySelector("#artist-column #image-div");
      divImage.style.backgroundImage = `url(${artistObj.picture_xl})`;
      const title = document.getElementsByTagName("h1")[0];
      const listenersSpan = document.querySelector("#artist-column #image-div span:last-of-type");
      let germanformatter = new Intl.NumberFormat("de-DE");
      listenersSpan.innerText = germanformatter.format(artistObj.nb_fan) + " ascolti mensili";
      title.innerText = artistObj.name;
      const ImglikedSongsDiv = document.querySelectorAll("#artist-column .liked-songs img");
      Array.from(ImglikedSongsDiv).forEach((img) => {
        img.setAttribute("src", artistObj.picture_xl);
      });
      const tracklist = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=10`;
      fetch(tracklist, {})
        .then((res) => {
          if (res) {
            return res.json();
          } else throw new Error("Generic Fetching error");
        })
        .then((songsObj) => {
          const divPopularSongs = document.getElementsByClassName("popular-songs")[0];
          console.log(songsObj);
          creationPopularSongs(divPopularSongs, songsObj, 0, 5);
          const visualizeOtherButton = document.createElement("a");
          visualizeOtherButton.innerText = "VISUALIZZA ALTRO";
          visualizeOtherButton.className = "visualize-other btn btn-link mt-2";
          divPopularSongs.appendChild(visualizeOtherButton);
          visualizeOtherButton.addEventListener("click", () => {
            creationPopularSongs(divPopularSongs, songsObj, 5, 10);
          });
        })
        .catch((error) => {
          console.log("CATCH BLOCK", error);
        });
    })
    .catch((error) => {
      console.log("CATCH BLOCK", error);
    });

  for (let z = 0; z < 5; z++) {
    renderTitles().then((data) => document.getElementById("playlist").appendChild(data));
  }
});

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

const renderTitles = async () => {
  const album = await getRandomAlbum();
  const playlistHTML = `<p>${album.title}</p>`;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = playlistHTML;

  return tempDiv.firstElementChild;
};

const creationPopularSongs = (divPopularSongs, songsObj, from, to) => {
  for (let i = from; i < to; i++) {
    const songDiv = document.createElement("div");
    songDiv.className = "song mt-2 align-items-center";
    divPopularSongs.appendChild(songDiv);
    const genericDiv = document.createElement("div");
    genericDiv.className = "align-items-center";
    songDiv.appendChild(genericDiv);
    const numbSpan = document.createElement("span");
    genericDiv.appendChild(numbSpan);
    numbSpan.innerText = i + 1;
    const imgSong = document.createElement("img");
    genericDiv.appendChild(imgSong);
    imgSong.setAttribute("src", songsObj.data[i].album.cover);
    const nameSongSpan = document.createElement("span");
    nameSongSpan.innerText = songsObj.data[i].title;
    genericDiv.appendChild(nameSongSpan);
    const visualSpan = document.createElement("span");
    visualSpan.innerText = songsObj.data[i].rank;
    songDiv.appendChild(visualSpan);
    const durationSpan = document.createElement("span");
    durationSpan.innerText = songsObj.data[i].duration;
    songDiv.appendChild(durationSpan);
  }
  if (from === 5) {
    const visualizeOtherButton = document.getElementsByClassName("visualize-other")[0];
    visualizeOtherButton.remove();
    const visualizeLessButton = document.createElement("a");
    visualizeLessButton.innerText = "VISUALIZZA MENO";
    visualizeLessButton.className = "visualize-other btn btn-link mt-2";
    divPopularSongs.appendChild(visualizeLessButton);
    visualizeLessButton.addEventListener("click", () => {
      const allSogs = document.getElementsByClassName("song");
      const arrayAllSongs = Array.from(allSogs);
      for (let i = arrayAllSongs.length; i > 5; i--) {
        arrayAllSongs[i - 1].style.display = "none";
      }
      visualizeLessButton.remove();
      const visualizeOtherButton = document.createElement("a");
      visualizeOtherButton.innerText = "VISUALIZZA ALTRO";
      visualizeOtherButton.className = "visualize-other btn btn-link mt-2";
      divPopularSongs.appendChild(visualizeOtherButton);
      visualizeOtherButton.addEventListener("click", () => {
        creationPopularSongs(divPopularSongs, songsObj, 5, 10);
      });
    });
  }
};
