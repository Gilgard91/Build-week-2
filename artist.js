const params = new URLSearchParams(window.location.search);
const artistId = params.get("id");
const idProvvisorio = 992824;
const urlArtista =
  "https://deezerdevs-deezer.p.rapidapi.com/artist/" + idProvvisorio;

window.addEventListener("DOMContentLoaded", () => {
  fetch(urlArtista, {
    headers: {
      "X-RapidAPI-Key": "7d5371cb6fmsh850599f723d118ap1c7305jsn7f07c92aefc1",
      "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
    }
  })
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
        img.setAttribute("src", artistObj.picture_xl);
      });
      const tracklist = `https://striveschool-api.herokuapp.com/api/deezer/artist/${idProvvisorio}/top?limit=10`;
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
  console.log(songsObj.data.length);
  for (let i = from; i < to; i++) {
    if (songsObj.data.length > i) {
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
