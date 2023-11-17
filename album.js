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

      const imgForAverage = new Image();
      imgForAverage.src = albumObj.cover_medium;
      const div = document.getElementById("scroll-container");
      const colorThief = new ColorThief();
      console.log(colorThief);

      imgForAverage.crossOrigin = "Anonymous";

      imgForAverage.addEventListener("load", function () {
        let averageColor = colorThief.getColor(imgForAverage);
        div.style.background = `linear-gradient(180deg, rgb( ${averageColor[0]} ${averageColor[1]} ${averageColor[2]} ) 24%, rgb( 42 42 42 ) 34%)`;
      });

      let navBar = document.getElementById("controls");
      let scrollDiv = document.getElementById("album");

      scrollDiv.addEventListener("scroll", function () {
        let averageColor = colorThief.getColor(imgForAverage);
        let scroll = scrollDiv.scrollTop;
        console.log(scroll);
        if (scroll >= 300) {
          navBar.style.backgroundColor = `rgb( ${averageColor[0]} ${averageColor[1]} ${averageColor[2]} / 40% )`;
          navBar.style.backdropFilter = "blur(3px)";
        } else {
          navBar.style.backgroundColor = "transparent";
        }
      });

      // if (imgForAverage.complete) {
      //   const averageColor = colorThief.getColor(imgForAverage);
      //   div.style.backgroundColor = `rgb(${averageColor[0]}, ${averageColor[1]}, ${averageColor[2]})`;
      // } else {
      //   imgForAverage.addEventListener("load", function () {
      //     colorThief.getColor(imgForAverage);
      //   });
      // }

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
  songTitles.forEach((title) =>
    document.getElementById("playlist").appendChild(renderTitles(title))
  );
};

renderSongs();
