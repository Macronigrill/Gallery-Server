const template = document.getElementById("GalleryElement");

const Dashbutton = document.getElementById("Dashbutton");
const Categorybutton = document.getElementById("Categorybutton");

console.log(Categorybutton);

loadGallery("curated");

function loadGallery(type,search = null) {
  
  if(type == "curated") {
    Dashbutton.style.backgroundColor = "#fff";
    Categorybutton.style.backgroundColor = "#808080";
  }
  if(type == "search") {
    Dashbutton.style.backgroundColor = "#808080";
    Categorybutton.style.backgroundColor = "#fff";
  }
  
  deleteGallery();


  url = `/GetImages/${type}`;
    if (type == "search" && search) {
      url += `?query=${encodeURIComponent(search)}`
    }
    console.log(url);

  fetch(url)
    .then((response) => {
      if(response.ok) {
        return response.json()
      }
      else {
        console.error(`Network response was not ok: ${response.status}`);
      }
    })
    .then((data) => {
      console.log(data);
      Instantiate(data);
    })
    .catch((error) => {
      console.error("error fetching images:",error);
    });
}

function loadCategories() {
    
    Dashbutton.style.backgroundColor = "#808080";
    Categorybutton.style.backgroundColor = "#fff";
  
  
    deleteGallery();

    url = "/static/Json/Categories.json"

    fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        InstantiateCategories(data);
    })
    .catch((error) => {
        console.log(error);
    });
}


function Instantiate(Images) {
  for (i = 0; i < Images["per_page"]; i++) {
    createNewInstance(Images["photos"][i]);
  }
}
function InstantiateCategories(Images) {
  for (i = 0; i < Images["amount"]; i++) {
    createNewCategory(Images["photos"][i]);
  }
}

function createNewInstance(Image) {
  const template = document.getElementById("GalleryElement");
  const content = template.content;
  const newInstance = content.cloneNode(true);

  randomArray = RandomizeOrientation();

  classNameW = `w-${randomArray["w"]}`;
  classNameH = `h-${randomArray["h"]}`;
  newName = `gallery-container ${classNameH} ${classNameW}`;

  source = Image["src"][randomArray["src"]];
  photographer = Image["photographer"];
  photographerUrl = Image["photographer_url"];
  imageUrl = Image["url"];

  // Modify the new instance (if needed)
  const imgElement = newInstance.querySelector(".image img");
  imgElement.src = source;
  imgElement.alt = "static/Images/Fallback.png";

  const imgLink = newInstance.querySelector(".image a");
  const linkElement = newInstance.querySelector(".ImageInfo a");
  
  linkElement.textContent = photographer;
  linkElement.href = photographerUrl;
  imgLink.href = imageUrl;
  
  // Append the new instance to the container
  
  const container = document.getElementById("Gallery");
  containerClass = newInstance.getElementById("gallery-container");
  containerClass.className = newName;

  container.appendChild(newInstance);
  
}

function createNewCategory(Image) {
  const template = document.getElementById("CategoryElement");
  const content = template.content;
  const newInstance = content.cloneNode(true);

  randomArray = RandomizeOrientation();

  classNameW = `w-${randomArray["w"]}`;
  classNameH = `h-${randomArray["h"]}`;
  newName = `gallery-container ${classNameH} ${classNameW}`;

  source = Image["src"][randomArray["src"]];
  Category = Image["Category"];
  imageUrl = Image["url"];

  // Modify the new instance (if needed)
  const imgElement = newInstance.querySelector(".image img");
  imgElement.src = source;
  imgElement.alt = "static/Images/Fallback.png";

  imgContainer = newInstance.querySelector(".image");
  const linkElement = newInstance.querySelector(".ImageInfo a");
  
  //imgElement.addEventListener("click",function(){loadGallery("search",Category)});

  linkElement.textContent = Category;
  linkElement.addEventListener("click", function () {
    loadGallery("search", Image["Category"]);
  });
  imgElement.addEventListener("click", function () {
    loadGallery("search", Image["Category"]);
  });
  
  // Append the new instance to the container
  
  const container = document.getElementById("Gallery");
  containerClass = newInstance.getElementById("gallery-container");
  containerClass.className = newName;

  container.appendChild(newInstance);

}

function RandomizeOrientation() {
  randomId = Math.floor(Math.random() * 3);
  //randomSize = Math.floor(Math.random() * 2) + 1;
  const randomArray = [
    { src: "medium", w: 1, h: 1 },
    { src: "landscape", w: 2, h: 1 },
    { src: "portrait", w: 1, h: 2 },
  ];
  //randomArray[randomId]["w"] = randomArray[randomId]["w"] * randomSize;
  //randomArray[randomId]["h"] = randomArray[randomId]["h"] * randomSize;

  return randomArray[randomId];
}

function deleteGallery() {  
  GalleryInstances = document.querySelectorAll(".gallery-container");

  for(i = 0; i < GalleryInstances.length; i++) {
    GalleryInstances[i].remove();
  }
}
