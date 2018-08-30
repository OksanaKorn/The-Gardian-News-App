"use strict";
var currentPage = 2;
const numberOfPages = 1124;
getPage(2);

function getPage(currentPage) {
    checkPrevNextPageAvailability(currentPage);
    $.ajax({
        url: `http://content.guardianapis.com/search?page=${currentPage}&api-key=ab8aec74-4f1f-4e71-9bf0-fe1de0febcc3`,
        success: function(data){
        generateNews(data);
        },
        error: function() {
            var textnode = document.createTextNode("Sorry, we couldn't find news for you. Please try again later");
            $("#news-container").append(textnode);
            $("#news-container" ).css({"color": "red", "font-size": "24px", "text-align": "center"});
            $(".pagination").css("display", "none");
            $("#refresh-button").css("display", "none");
        }
    });
}

$("#refresh-button").click(function() {
    getPage(currentPage);
});

function generateNews(data) {
    var str = "";
    var disc;
    var resultArray = data.response.results;
    $.each(resultArray, function(index, element) {
        str += 
        `<div class="onenews">
            <div class="title accordion-${index}">
                <div>${element.webTitle}</div>
                <span class="arrow">&#x25BC;</span>
            </div>
            <div class="accordion-element description">${element.apiUrl}</div>
            <span class="url accordion-element"></span>
        </div>`
    })
    $("#news-container").html(str);
    accordion();
}

function accordion() {
    $(".title").click(function() {
        var curentElement = $(this);
        curentElement.toggleClass("checked");
        if($(this).hasClass("checked")) {
            $(this).children("span").html("&#x25B2;")
        } else {
            $(this).children("span").html("&#x25BC;");
        }
        
        var apiUrl = curentElement.siblings("div").text();
        var oneDescription;
        
        $.ajax({
        url: `${apiUrl}?show-blocks=body&api-key=ab8aec74-4f1f-4e71-9bf0-fe1de0febcc3`,
        success: function(description){
            oneDescription = description.response.content.blocks.body[0].bodyTextSummary;
                if(oneDescription.length > 300) {
                  oneDescription = oneDescription.substr(0, 300) + "...";
                }
            curentElement.siblings("div").text(oneDescription);
            curentElement.siblings("span").html(`<a href="${description.response.content.webUrl}" target="_blank">Read full News</a>`);
            }
        })
        curentElement.siblings().slideToggle();
    });
}

function changePageOnUserInput() {
    if(event.key === 'Enter') {
        var newPage = $(".current-page").val();
        if (newPage >= 1 && numberOfPages >= newPage) {
        currentPage = newPage;
        getPage(currentPage);
        } else {
            $(".current-page").val(currentPage);
        }
    }
}

$(".next-page").on("click", function() {
    currentPage = $(".current-page").val();
    nextPage(currentPage);
});

$(".prev-page").on("click", function() {
    currentPage = $(".current-page").val();
    prevPage(currentPage);
});

function prevPage(currentPage) {
    if (currentPage > 1) {
        currentPage--;
        $(".current-page").val(currentPage)
        getPage(currentPage);
    }
}

function nextPage(currentPage) {
    if (currentPage < numberOfPages) {
        currentPage++;
        $(".current-page").val(currentPage)
        getPage(currentPage);
    }
}

function checkPrevNextPageAvailability(currentPage) {
    if (currentPage == numberOfPages) {
        $(".next-page").prop("disabled", true);
    } else $(".next-page").prop("disabled", false);

    if (currentPage == 1) {
        $(".prev-page").prop("disabled", true);
    } else $(".prev-page").prop("disabled", false);
}