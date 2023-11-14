const params = new URLSearchParams(window.location.search);
const albumId = params.get("albumId");

const url = "https://deezerdevs-deezer.p.rapidapi.com/album/100458";

window.onload = () => {
  fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "b60efbc5d2msh47390c13a7f4aa8p13443djsn54de8feb08c4",
      "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
    }
  })
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
      const year = document.getElementById("year-tag");
      year.innerText = " · " + albumObj.release_date.substring(0, 4) + " · ";
      const trackNr = document.getElementById("tracks-nr-tag");
      trackNr.innerText = JSON.stringify(albumObj.nb_tracks) + " Brani,";
      const year2 = document.getElementById("year-tag-2");
      year2.innerText = " · " + albumObj.release_date.substring(0, 4);
      const totMin = document.getElementById("tot-min");
      totMinDur = JSON.stringify(albumObj.duration);
      const minutes = Math.floor(totMinDur / 60);
      const seconds = totMinDur % 60;
      totMin.innerText = minutes + " min " + seconds + " sec.";
      albumObj;
    });
};
