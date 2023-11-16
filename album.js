const params = new URLSearchParams(window.location.search);
const albumId = params.get("id");

const url = "https://deezerdevs-deezer.p.rapidapi.com/album/" + albumId;
let trackCounter = 0;

const min = 90471;
const max = 150000;

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "2800f46700msh59f96c5e03ffa07p183fe6jsn4a41162d104c",
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
  }
};

const getRandomSongs = async (numOfSongs) => {
  let urlRandomSongs = `https://deezer-proxy2-6076a9afa64d.herokuapp.com/deezer/songs/random-song/${numOfSongs}`;

  const getSongs = await fetch(urlRandomSongs);
  const result = await getSongs.json();

  return result;
};

const renderTitles = (song) => {
  const playlistHTML = `<p>${song.title}</p>`;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = playlistHTML;

  return tempDiv.firstElementChild;
};

window.onload = () => {
  fetch(url, options)
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("API Error");
      }
      return resp.json();
    })
    .then((albumObj) => {
      console.log(albumObj);
      const albumImg = document.getElementById("album-img");
      albumImg.src = albumObj.cover_medium;

      const h1 = document.getElementById("h1");
      h1.innerText = albumObj.title;
      const artistImg = document.getElementById("artist-img");
      artistImg.src = albumObj.artist.picture_medium;

      const artist = document.getElementById("artist-tag");
      artist.innerText = albumObj.artist.name;
      artist.href = "./artist.html?id=" + albumObj.artist.id;
      const year = document.getElementById("year-tag");
      year.innerText = " · " + albumObj.release_date.substring(0, 4) + " · ";
      const trackNr = document.getElementById("tracks-nr-tag");
      trackNr.innerText = JSON.stringify(albumObj.nb_tracks) + " Brani,";
      const year2 = document.getElementById("year-tag-2");
      year2.innerText = " · " + albumObj.release_date.substring(0, 4);
      const totMin = document.getElementById("tot-min");
      const totMinDur = JSON.stringify(albumObj.duration);
      const minutes = Math.floor(totMinDur / 60);
      const seconds = totMinDur % 60;
      totMin.innerText = minutes + " min " + seconds + " sec.";
      albumObj.tracks.data.forEach((obj) => {
        trackCounter = trackCounter + 1;
        const tracksContainer = document.getElementById("tracks");
        const trackDiv = document.createElement("div");
        trackDiv.className = "tracks row align-items-center mt-3";
        const trackNum = document.createElement("p");
        trackNum.innerText = trackCounter;
        trackNum.className = "track-num col-1";
        const titleDiv = document.createElement("div");
        titleDiv.className = "list-title col-5";
        const pTitle = document.createElement("p");
        pTitle.innerText = obj.title;
        pTitle.className = "track-title";
        const pArtist = document.createElement("p");
        pArtist.className = "track-artist";
        pArtist.innerText = obj.artist.name;
        const pViews = document.createElement("p");
        pViews.className = "track-views col-4";

        // Add a dot before every group of three digits
        const rankWithoutDot = JSON.stringify(obj.rank); // Assuming obj.rank is a string
        let rankWithDot = "";
        for (let i = 0; i < rankWithoutDot.length; i++) {
          rankWithDot += rankWithoutDot[i];
          if ((rankWithoutDot.length - i - 1) % 3 === 0 && i !== rankWithoutDot.length - 1) {
            rankWithDot += ".";
          }
        }
        pViews.innerText = rankWithDot;
        const pDuration = document.createElement("p");
        pDuration.className = "track-length col-2";
        totDuration = JSON.stringify(obj.duration);
        const minutes = Math.floor(totDuration / 60);
        // minutes = minutes < 10 ? "0" + minutes : minutes;
        const seconds = totDuration % 60;
        // seconds = seconds < 10 ? "0" + seconds : seconds;
        pDuration.innerText = minutes + ":" + seconds;

        // APPEND

        titleDiv.appendChild(pTitle);
        titleDiv.appendChild(pArtist);
        trackDiv.appendChild(trackNum);
        trackDiv.appendChild(titleDiv);
        trackDiv.appendChild(pViews);
        trackDiv.appendChild(pDuration);
        tracksContainer.appendChild(trackDiv);
      });
    });
};

const renderSongs = async () => {
  let songTitles = await getRandomSongs(30);
  songTitles.forEach((title) => document.getElementById("playlist").appendChild(renderTitles(title)));
};

renderSongs();

let navBar = document.getElementById("controls");
let scrollDiv = document.getElementById("album");
console.log(scrollDiv);

function updateStyle() {
  if (document.body.scrollTop >= 10 || scrollDiv.scrollTop >= 10) {
    navBar.classList.add("controls-down");
  } else {
    navBar.classList.remove("controls-down");
  }
}

window.onscroll = function () {
  updateStyle();
};

function getColor(imageElem, ratio) {
  const canvas = document.createElement("canvas");
  let width = (canvas.width = imageElem.naturalWidth);
  let height = (canvas.height = imageElem.naturalHeight);

  const context = canvas.getContext("2d");
  context.drawImage(imageElem, 0, 0);

  let data, length;
  let i = -4,
    count = 0;
  try {
    data = context.getImageData(0, 0, width, height);
    length = data.data.length;
  } catch (err) {
    console.error(err);
    return {
      R: 0,
      G: 0,
      B: 0
    };
  }
  let R, G, B;
  R = G = B = 0;
  while ((i += ratio * 4) < length) {
    ++count;

    R += data.data[i];
    G += data.data[i + 1];
    B += data.data[i + 2];
    console.log(R, G, B);
  }
  R = Math.floor(R / count);
  G = Math.floor(G / count);
  B = Math.floor(B / count);

  console.log(R, G, B);
  return {
    R,
    G,
    B
  };
}

const image = document.getElementById("immagine");
console.log(image);
image.onload = function () {
  const { R, G, B } = getColor(image, 4);
  document.getElementById("album").style.background = `radial-gradient(rgb(${R},${G},${B}), #333)`;
  console.log(R, G, B);
};
