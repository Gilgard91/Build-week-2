const params = new URLSearchParams(window.location.search);
const albumId = params.get("id");

const url = "https://deezerdevs-deezer.p.rapidapi.com/album/" + albumId;
let trackCounter = 0;

const min = 90471;
const max = 150000;

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "f630d064ffmsh84bb2040185bd5ap14cc66jsn4c8ffa25bc80",
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

const renderTitles = (song) => {
  const playlistHTML = `<p>${song.title}</p>`;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = playlistHTML;

  return tempDiv.firstElementChild;
};

const getRandomSongs = async (numOfSongs) => {
  let randomNumber = Math.floor(Math.random() * 26);
  let randomLetter = String.fromCharCode(97 + randomNumber);

  let urlRandomSongs = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${randomLetter}&order=RANKING`;
  const getSongs = await fetch(urlRandomSongs);
  let result = await getSongs.json();
  result = result.data.filter((song) => song.title.length > 1);
  const randomSongs = new Set();
  console.log(result);
  while (randomSongs.size < numOfSongs) {
    let randomIndex = Math.round(Math.random() * (result.length - 1));

    randomSongs.add(result[randomIndex]);
  }
  console.log(randomSongs);
  return randomSongs;
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
        console.log(obj);

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
          if (
            (rankWithoutDot.length - i - 1) % 3 === 0 &&
            i !== rankWithoutDot.length - 1
          ) {
            rankWithDot += ".";
          }
        }
        pViews.innerText = rankWithDot;
        const pDuration = document.createElement("p");
        pDuration.className = "track-length col-2";
        totDuration = JSON.stringify(obj.duration);
        const minutes = Math.floor(totDuration / 60);
        const seconds = totDuration % 60;
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
  let playlist = new Set();
  while (playlist.size < 20) {
    const a = await getRandomSongs(12);
    a.forEach((song) => playlist.add(song));
  }
  playlist.forEach((song) =>
    document.getElementById("playlist").appendChild(renderTitles(song))
  );
};

renderSongs();
