const params = new URLSearchParams(window.location.search);
const artistId = params.get("id");
const idProvvisorio = 413;
const urlArtista =
  "https://deezerdevs-deezer.p.rapidapi.com/artist/" + artistId;
console.log(urlArtista);
const min = 90471;
const max = 150000;

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "2800f46700msh59f96c5e03ffa07p183fe6jsn4a41162d104c",
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
      divImage.style.backgroundImage = `url(${artistObj.picture_big})`;
      const title = document.getElementsByTagName("h1")[0];
      const listenersSpan = document.querySelector(
        "#artist-column #image-div span:last-of-type"
      );
      let germanformatter = new Intl.NumberFormat("de-DE");
      listenersSpan.innerText =
        germanformatter.format(artistObj.nb_fan) + " ascolti mensili";
      title.innerText = artistObj.name;
      const ImglikedSongsDiv = document.querySelectorAll(
        "#artist-column .liked-songs img"
      );
      const ImglikedSongsSpan = document.querySelectorAll(
        "#artist-column .liked-songs span>span"
      );

      Array.from(ImglikedSongsSpan).forEach((span) => {
        span.innerText = artistObj.name;
      });
      Array.from(ImglikedSongsDiv).forEach((img) => {
        img.setAttribute("src", artistObj.picture_big);
      });
      const tracklist = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=10`;
      fetch(tracklist, {})
        .then((res) => {
          if (res) {
            return res.json();
          } else throw new Error("Generic Fetching error");
        })
        .then((songsObj) => {
          const divPopularSongs =
            document.getElementsByClassName("popular-songs")[0];
          console.log(songsObj);
          creationPopularSongs(divPopularSongs, songsObj, 0, 5);
          if (songsObj.data.length > 5) {
            const visualizeOtherButton = document.createElement("a");
            visualizeOtherButton.innerText = "VISUALIZZA ALTRO";
            visualizeOtherButton.className =
              "visualize-other btn btn-link mt-2";
            divPopularSongs.appendChild(visualizeOtherButton);
            visualizeOtherButton.addEventListener("click", () => {
              creationPopularSongs(divPopularSongs, songsObj, 5, 10);
            });
          }
        })
        .catch((error) => {
          console.log("CATCH BLOCK", error);
        });
    })
    .catch((error) => {
      console.log("CATCH BLOCK", error);
    });
});

const creationPopularSongs = (divPopularSongs, songsObj, from, to) => {
  if (songsObj.data.length > 0) {
    const popularTitle = document.getElementById("popular-songs-title");
    popularTitle.style.display = "block";
  } else {
    const likedSongs = document.querySelectorAll("#artist-column .liked-songs");
    Array.from(likedSongs).forEach((div) => {
      div.className = "d-none";
    });
  }
  console.log(songsObj.data.length);
  for (let i = from; i < to; i++) {
    if (songsObj.data.length > i) {
      const songDiv = document.createElement("div");
      songDiv.className =
        "song mt-2 align-items-center justify-content-between";
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
      let germanformatter = new Intl.NumberFormat("de-DE");
      visualSpan.innerText = germanformatter.format(songsObj.data[i].rank);
      songDiv.appendChild(visualSpan);
      const durationSpan = document.createElement("span");
      const durationMMSS = new Date(songsObj.data[i].duration * 1000)
        .toISOString()
        .slice(14, 19);
      durationSpan.innerText = durationMMSS;
      songDiv.appendChild(durationSpan);
    }
  }

  if (from === 5) {
    const visualizeOtherButton =
      document.getElementsByClassName("visualize-other")[0];
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

let navBar = document.getElementById("controls-artist");
let scrollDiv = document.getElementById("artist-column");

scrollDiv.addEventListener("scroll", function () {
  let scroll = scrollDiv.scrollTop;
  console.log(scroll);
  if (scroll >= 300) {
    navBar.classList.add("controls-down-index");
  } else {
    navBar.classList.remove("controls-down-index");
  }
});

// const getRandomSongs = async (numOfSongs) => {
//   let randomNumber = Math.floor(Math.random() * 26);
//   let randomLetter = String.fromCharCode(97 + randomNumber);

//   let urlRandomSongs = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${randomLetter}&order=RANKING`;
//   const getSongs = await fetch(urlRandomSongs);
//   let result = await getSongs.json();
//   result = result.data.filter((song) => song.title.length > 1);
//   const randomSongs = new Set();
//   console.log(result);
//   while (randomSongs.size < numOfSongs) {
//     let randomIndex = Math.round(Math.random() * (result.length - 1));

//     randomSongs.add(result[randomIndex]);
//   }
//   console.log(randomSongs);
//   return randomSongs;
// };

const getRandomSongs = async (numOfSongs) => {
  let urlRandomSongs = `https://deezer-proxy2-6076a9afa64d.herokuapp.com/deezer/songs/random-song/${numOfSongs}`;

  const getSongs = await fetch(urlRandomSongs);
  const result = await getSongs.json();

  return result;
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
        <p class="card-text">${
          song.title.length > 15 ? song.title_short : song.title
        }</p>
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

const renderData = async () => {
  let songs = await getRandomSongs(12);
  songs.forEach((song) =>
    document.getElementById("row-2").appendChild(renderSongs(song))
  );

  let songTitles = await getRandomSongs(30);
  songTitles.forEach((title) =>
    document.getElementById("playlist").appendChild(renderTitles(title))
  );

  // let songs = await getRandomSongs(8);
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

  // let playlist = new Set();
  // while (playlist.size < 20) {
  //   const a = await getRandomSongs(12);
  //   a.forEach((song) => playlist.add(song));
  // }
  // playlist.forEach((song) =>
  //   document.getElementById("playlist").appendChild(renderTitles(song))
  // );
};

renderData();
