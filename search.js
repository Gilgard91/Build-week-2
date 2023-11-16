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
