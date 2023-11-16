const urlGenres =
  "https://deezer-proxy2-6076a9afa64d.herokuapp.com/deezer/genre";
window.addEventListener("DOMContentLoaded", () => {
  fetch(urlGenres, {
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
    .then((genresObj) => {
      console.log(genresObj);
      const container = document.getElementById("container-genres");
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
