var client = new XMLHttpRequest();
// Getting the search text and calling Flickr
function search(text) {
    if (text !='') {
        client.open("GET",
            "https://api.flickr.com/services/rest/?" +
            'method=flickr.photos.search'+
            '&&api_key=026391d26362e807abbf5040dd0bdf96' +
            '&&format=json'+
            '&&nojsoncallback=1' +
            '&&text=' + text,
            true);
            client.send();
            return false;       
    } 
};

// Create a connection to Flickr
client.onreadystatechange = function () {
    if (client.readyState === 4) {
        if (client.status === 200) {
            var jsonResponse = JSON.parse(client.responseText);
            if (jsonResponse.stat === "ok") {
                if (jsonResponse.photos && jsonResponse.photos.photo) {
                    setSearchResult(jsonResponse.photos.photo);
                }
            } else if (jsonResponse.stat === "fail") {
                document.getElementById("image-title").innerHTML = "Ett fel inträffade när bilderna skulle hämtas";
                document.getElementById("image-content").innerHTML = jsonResponse.message;
                document.getElementById("image").className += " visible";
            }
        }
    }
}


// Getting the serchresult from Flickr
var searchResult;
function setSearchResult(photos) {
    searchResult = new Array();
    var out = "";
    photos.forEach(function (photo) {
        searchResult[photo.id] = photo;
        var className = "result-image";
        var onclick = "addToGallery";
        if (images.hasOwnProperty(parseInt(photo.id))) {
            className += " result-image--selected";
            onclick = "removeFromGallery";
        }
        out += getPhotoTag(photo, className, onclick);
    });
    document.getElementById("search_result").innerHTML = out;
}

// Get the selected picture
function getPhotoTag(photo, className, onclick) {
    return '<div id="photo' +
            photo.id +
            '" class="' + className + '" onclick="' + onclick + '(' +
            photo.id +
            ')"><img src="https://farm' +
            photo.farm +
            '.staticflickr.com/' +
            photo.server +
            '/' +
            photo.id +
            '_' +
            photo.secret +
            '_q.jpg" /></div>';
}
var images = new Array();
var imagesCount = 0;

// Add the selected picture to the Gallery
function addToGallery(id) {
    if (!images.hasOwnProperty(id)) {
        images[id] = searchResult[id];
        imagesCount++;
        updateShowGalleryButtonText();
    }

    var photo = document.getElementById("photo" + id);
    photo.className = "result-image result-image--selected";
    photo.onclick = function () { removeFromGallery(id); }
}

// Remove the selected picture from the Gallery
function removeFromGallery(id) {
    if (images.hasOwnProperty(id)) {
        delete images[id];
        imagesCount--;
        updateShowGalleryButtonText();
    }

    var photo = document.getElementById("photo" + id);
    photo.className = "result-image";
    photo.onclick = function () { addToGallery(id); }
}

// Show the Gallery when the button "Visa galleri" is clicked
function showGallery() {
    var out = "";
    for (var propertyName in images) {
        var photo = images[propertyName];
        out += getPhotoTag(photo, "result-image result-image--gallery", "showOriginalImage");
    }
    document.getElementById("search_result").innerHTML = out;
}

// Update the text on the "Visa galleri" button
function updateShowGalleryButtonText() {
    var text = "Visa galleri ";
    if (imagesCount != 0) {
        text+="(" + imagesCount + " bild";
        if (imagesCount !== 1) {
            text += "er";
        }
        text += ")";
    }
    document.getElementById("galleryButton").value = text;
}

// Hide the larger picture
function hideImage() {
    document.getElementById("image").className = "image";
}

// Show the larger picture
function showOriginalImage(id) {
    var photo = images[id];
    document.getElementById("image-title").innerHTML = photo.title;
    document.getElementById("image-content").innerHTML =
        '<img src="https://farm' +
        photo.farm +
        '.staticflickr.com/' +
        photo.server +
        '/' +
        photo.id +
        '_' +
        photo.secret +
        '_z.jpg' +
        '" alt="' +
        photo.title +
        '"/>';
    document.getElementById("image").className += " visible";
}