const urlGenres =
  "https://deezer-proxy2-6076a9afa64d.herokuapp.com/deezer/genre";
const headers = {
  "X-RapidAPI-Key": "3d4cd5d545msha4ba409edb6935dp18b77cjsna53631f43917",
  "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
};
const urlSearch = "https://deezerdevs-deezer.p.rapidapi.com/search";
window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container-genres");
  fetch(urlGenres, {
    headers
  })
    .then((res) => {
      if (res) {
        return res.json();
      } else throw new Error("Generic Fetching error");
    })
    .then((genresObj) => {
      const searchInput = document.getElementsByTagName("input")[0];
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          // Cancel the default action, if needed
          e.preventDefault();
          // Trigger the button element with a click
          console.log(e.target.value);
          fetch(urlSearch + `?q=${e.target.value}`, {
            headers: {
              "X-RapidAPI-Key":
                "3d4cd5d545msha4ba409edb6935dp18b77cjsna53631f43917",
              "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
            }
          })
            .then((res) => {
              if (res) {
                return res.json();
              } else throw new Error("Generic Fetching error");
            })
            .then((searchResObj) => {
              console.log(searchResObj);
              Array.from(searchResObj.data).forEach((result) => {
                if (
                  result.artist.name.toLowerCase() ===
                  e.target.value.toLowerCase()
                ) {
                  const resultDiv = document.querySelector("#search-result");
                  resultDiv.style.display = "flex";

                  const artistImg = document.querySelector(
                    "#search-column #search-result img"
                  );
                  const artistName = document.querySelector(
                    "#search-column #search-result h3"
                  );

                  const resutsH3 = document.getElementById("title-result");
                  resutsH3.style.display = "block";
                  const otherResutsH3 =
                    document.getElementById("other-results");
                  otherResutsH3.style.display = "block";
                  const typeResult = document.querySelector(
                    "#search-column #search-result span"
                  );
                  artistImg.setAttribute("src", result.artist.picture_xl);
                  typeResult.innerText = result.artist.type.toUpperCase();
                  artistName.innerText = result.artist.name;
                }
              });
              const divSongs = document.querySelector(
                "#search-column #search-result > .divs-result:last-of-type"
              );
              divSongs.innerHTML = "";
              container.style.display = "none";

              creationSongs(divSongs, searchResObj, 0, 5);
              document.getElementById("row-2").innerHTML = "";
              document.getElementById("row-2").style.display = "flex";

              renderData();
            })
            .catch((error) => {
              console.log("CATCH BLOCK", error);
            });
        }
      });
      console.log(genresObj);
      const divRow = document.createElement("div");
      container.appendChild(divRow);
      divRow.className = "row";
      Array.from(genresObj.data).forEach((genre) => {
        const colDiv = document.createElement("div");
        const colInnerDiv = document.createElement("div");
        colDiv.className =
          "col-4 col-md-3 col-xl-2 g-2 position-relative flex-start";
        colInnerDiv.className = "position-relative box-genre ps-2 pt-2";
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        console.log(randomColor);
        colInnerDiv.style.backgroundColor = "#" + randomColor;
        divRow.appendChild(colDiv);
        colDiv.appendChild(colInnerDiv);
        colInnerDiv.innerText = genre.name;

        setInterval(() => {
          const width = colInnerDiv.offsetWidth.toString();
          colInnerDiv.style.height = width + "px";
          colInnerDiv.style.fontSize = parseInt(width) / 6 + "px";
        }, 5);

        const playlistPhoto = document.createElement("img");
        colInnerDiv.appendChild(playlistPhoto);
        playlistPhoto.setAttribute("src", genre.picture_xl);
        playlistPhoto.style.width = "65%";
        playlistPhoto.style.height = "65%";
        playlistPhoto.className = "position-absolute";
      });
    })
    .catch((error) => {
      console.log("CATCH BLOCK", error);
    });
});

const creationSongs = (divSongs, songsObj, from, to) => {
  console.log(songsObj.data.length);
  for (let i = from; i < to; i++) {
    if (songsObj.data.length > i) {
      const divOneSong = document.createElement("div");
      divSongs.appendChild(divOneSong);
      divOneSong.className =
        "d-flex flex-row mt-2 justify-content-between align-items-center";
      const imgSong = document.createElement("img");
      const genericDiv = document.createElement("div");
      divOneSong.appendChild(genericDiv);
      genericDiv.appendChild(imgSong);
      genericDiv.className = "d-flex gap-3";

      imgSong.setAttribute("src", songsObj.data[i].album.cover);
      const nameSongSpan = document.createElement("span");
      nameSongSpan.style.width = "118px";
      nameSongSpan.style.marginTop = "auto";
      nameSongSpan.style.marginBottom = "auto";
      nameSongSpan.style.overflow = "hidden";
      nameSongSpan.style.textOverflow = "ellipsis";
      nameSongSpan.style.whiteSpace = "nowrap";
      nameSongSpan.innerText = songsObj.data[i].title;
      nameSongSpan.gro;
      genericDiv.appendChild(nameSongSpan);
      const durationSpan = document.createElement("span");
      const durationMMSS = new Date(songsObj.data[i].duration * 1000)
        .toISOString()
        .slice(14, 19);
      durationSpan.innerText = durationMMSS;
      divOneSong.appendChild(durationSpan);
    }
  }
};
const getRandomSongs = async (numOfSongs) => {
  let urlRandomSongs = `https://deezer-proxy2-6076a9afa64d.herokuapp.com/deezer/songs/random-song/${numOfSongs}`;

  const getSongs = await fetch(urlRandomSongs);
  const result = await getSongs.json();

  return result;
};

const renderSongsMedium = (song) => {
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
    document.getElementById("row-2").appendChild(renderSongsMedium(song))
  );
};
const renderSongs = async () => {
  let songTitles = await getRandomSongs(30);
  songTitles.forEach((title) =>
    document.getElementById("playlist").appendChild(renderTitles(title))
  );
};

renderSongs();
