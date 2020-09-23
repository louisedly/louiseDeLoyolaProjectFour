// Create app namespace to hold all methods
const flixBoxApp = {};
flixBoxApp.apikey = 'e4c618b1';
// When the page loads focus on the input field
$('input').focus();
$(".resetButton").hide();
//Event listeners
flixBoxApp.eventListener = function () {
    // Collect user input using a form to fill in search text
    $("form").on('submit', (e) => {
        e.preventDefault();
        let searchText = $('input').val();
        flixBoxApp.getMovieName(searchText);
        // Refreshes search output
        searchText = [];
        $('section').empty();
        flixBoxApp.scroll("section");
    })

    // Refreshes page and search field and scrolls back to top
    $('.resetButton').on('click', function () {
        $('form').trigger("reset");
        location.reload();
        $(".resetButton").hide();
        $('form').scrollTop(0);
    });
}
// AJAX call to get movie name and imdbID
flixBoxApp.getMovieName = function (search) {
    $.ajax({
    url: `https://www.omdbapi.com/?`,
    method: 'GET',
    dataType: 'json',
    data: {
        apikey: flixBoxApp.apikey,
        s: `${search}`
        }
    }).then((response) => {
        console.log(response);
        const Search = response.Search;
        flixBoxApp.displayMovie(Search);
    }).catch(error => {
        alert("Could not find movie. Please try again")
    })
}
// Append the movies on DOM 
flixBoxApp.displayMovie = function(data){
    // look through each object in the array
    // get the title, poster and imdbID
    // display these on the page in html elements using forEach
    data.forEach(function(movies) {
        const movieAll = 
    `
    <div class="movieAll">
    <a onclick="flixBoxApp.selectedMovie('${movies.imdbID}')" href= "#">
        <img src="${movies.Poster}">
        <h3>${movies.Title}</h3>
        <a onclick="flixBoxApp.selectedMovie('${movies.imdbID}')" href="#">Movie Details</a>
    </div>
    `
    $('section').append(movieAll);
    $(".resetButton").show();
    // Replace img source if not available
    $('img').on("error", function () {
    $(this).attr('src', './styles/assets/placeholder.png');
    });
    })
}

// function for <a onclick> to save session storage to movie.html
flixBoxApp.selectedMovie = function(id){
    sessionStorage.setItem('movieId', id);
    window.location = 'movie.html';
    return false;
}

// function for movie.html
// get imdbID for movie and display on DOM
flixBoxApp.getMovie = function(){
    //use session storage to get movie id
    let movieId = sessionStorage.getItem('movieId');
    $.ajax({
        url: `https://www.omdbapi.com/?`,
        method: 'GET',
        dataType: 'json',
        data: {
            apikey: flixBoxApp.apikey,
            i: `${movieId}`
        }
    }).then((response) => {
        // console.log(response);
        let movie = response;
        // display movie on DOM
        let output =`
        <div class="movie">
            <div class="movieImg">
                <h3>${movie.Title}</h3>
                <img src="${movie.Poster}">
            </div>
            <div class="movieDetails">
                <ul>
                    <li><span class="movieLabel">Genre:</span> ${movie.Genre}</li>
                    <li><span class="movieLabel">Released:</span> ${movie.Released}</li>
                    <li><span class="movieLabel">Rated:</span> ${movie.Rated}</li>
                    <li><span class="movieLabel">IMDB Rating:</span> ${movie.imdbRating}</li>
                    <li><span class="movieLabel">Director:</span> ${movie.Director}</li>
                    <li><span class="movieLabel">Writer:</span> ${movie.Writer}</li>
                    <li><span class="movieLabel">Actors:</span> ${movie.Actors}</li>
                </ul>
            </div>
            <div class="moviePlot">
                <div class="plotContainer">
                    <h3>Plot</h3>
                    ${movie.Plot}
                    <a href="http://imdb.com/title/${movie.imdbID}" target="_blank">IMDB</a>
                    <a href="index.html">Go Back to Search</a>
                </div>
            </div>
        </div>
        `
        $('section').append(output);
        // Replace img source if not available
        $('img').on("error", function () {
            $(this).attr('src', './styles/assets/placeholder.png');
        });
    }).catch(error => {
        console.log("There is an error for imdbID");
    })
}

//slow scroll 
flixBoxApp.scroll = function (element) {
    $('html').animate(
        {
            scrollTop: $(element).offset().top
        }, 1000
    );
};

flixBoxApp.init = function () {
    // flixBoxApp.collectInfo();
    flixBoxApp.eventListener();
}
//Document ready
$(function () {
    flixBoxApp.init();
});
