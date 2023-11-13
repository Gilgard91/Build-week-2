const min = 90471;
const max = 150000;

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "eae5630ea0mshf3a32107d506899p1f0c5fjsn983f002173c2",
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

getRandomAlbum().then((data) => console.log(data));

const renderMainAlbum = async () => {
    
}

const renderAlbums = async () => {

}