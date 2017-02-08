/**
 * Created by zolta on 2017. 02. 07..
 */
var tiles = [],
    flips = ['tb', 'bt', 'lr', 'rl'],
    flippedTile = null,
    tileBeingFlippedId = null,
    tileImages = ['angular', 'd3', 'jenkins', 'postcss', 'react' ,'redux', 'sass', 'supercharge', 'ts', 'webpack'],
    tileAllocation = null,
    timer = 0,
    _interval = 100,
    tries = 0,
    size = 6,
    matches = 0,
    peekTime = 3000;

function getRandomImageForTile() {
    var randomImage = Math.floor((Math.random() * tileAllocation.length));
    var maxImageUse = 2;

    while(tileAllocation[randomImage] >= maxImageUse) {
        randomImage++;

        if(randomImage >= tileAllocation.length) {
            randomImage = 0;
        }
    }

    return randomImage;
}

function createTile(counter) {
    var curTile = new tile("tile" + counter);
    var randomImage = getRandomImageForTile();

    tileAllocation[randomImage]++;
    curTile.setFrontColor('tileColor');
    curTile.setStartAt(500 * Math.floor((Math.random() * 5) + 1));
    curTile.setFlipMethod(flips[Math.floor((Math.random() * 3) + 1)]);
    curTile.setBackContentImage("/assets/" + tileImages[(randomImage)] + ".png");
    return curTile;
}

function init(size) {
    tileAllocation = [];
    for(var i = 0; i < size / 2; i++) {
        tileAllocation.push(0);
    }
    tiles.length = 0;
    $('#board').empty();
    timer = 0;
}

function initTiles(size) {
    var curTile = null;

    init(size);

    for(var i = 0; i < size; i++) {
        curTile = createTile(i);
        $('#board').append(curTile.getHTML());
        $('#board').append('<div id="triesCount"></div>');
        $('#triesCount').html("Tries: " + tries);
        tiles.push(curTile);
    }
}

function hideTiles(callback) {
    for(var i = 0; i < tiles.length; i++) {
        tiles[i].revertFlip();
    }

    callback();
}

function revealTiles(callback) {
    var otherTileNotFlipped = false;

    for(var i = 0; i < tiles.length; i++) {
        if(!tiles[i].getFlipped()) {
            if(timer > tiles[i].getStartAt()) {
                tiles[i].flip();
            } else {
                otherTileNotFlipped = true;
            }
        }
    }

    timer += _interval;

    if(otherTileNotFlipped) {
        setTimeout("revealTiles(" + callback + ")" , _interval);
    } else {
        callback();
    }
}

function checkMatch() {
    if(flippedTile === null) {
        flippedTile = tileBeingFlippedId;
    } else {
        if(tiles[flippedTile].getBackContentImage() !== tiles[tileBeingFlippedId].getBackContentImage()) {
            setTimeout("tiles[" + flippedTile + "].revertFlip()", 2000);
            setTimeout("tiles[" + tileBeingFlippedId + "].revertFlip()", 2000);
        } else {
            matches++;
            if(matches === size / 2) {setTimeout("endGame();", 2000)}
        }
        flippedTile = null;
        tileBeingFlippedId = null;
        tries++;
        $('#triesCount').html("Tries: " + tries);
    }
}

function onPeekComplete() {
    $('div.tile').click(function() {
        tileBeingFlippedId = this.id.substring("tile".length);

        if(!tiles[tileBeingFlippedId].getFlipped()) {
            tiles[tileBeingFlippedId].addFlipCompleteCallback(function() {checkMatch();});
            tiles[tileBeingFlippedId].flip();
        }
    });
}

function onPeekStart() {
    setTimeout("hideTiles( function() {onPeekComplete();})", peekTime);
}

function endGame() {
    $('#board').empty();
    $('#board').html(
        '<div class="form-wrapper">' +
        '<div class="text-center"><h3>Wheeee! You won after ' + tries + ' tries! :)</h3></div>' +
        '<form class="form-inline text-center" method="post" id="submitScoreForm">' +
        '<div class="form-group">' +
        '<label for="name" class=sr-only">Name: </label>' +
        '<input required class="form-control" type="text" name="name" id="name">' +
        '</div>' +
        '<div class="form-group">' +
        '<button type="submit" class="btn btn-primary" id="submitScore">Submit score</button>' +
        '</div>' +
        '</form>' +
        '</div>'
    );
    $('#submitScoreForm').on('submit', function (e) {
        e.preventDefault();
        var name = $('#name').val();
        var values = {
            'name': name,
            'tries': tries,
            'size': size
        };

        $.ajax({
            url: '/',
            type: 'POST',
            cache: false,
            data: values,
            success: function(data) {
                $('#board').empty();
                $('#board').html(
                    '<div class="table-wrapper">' +
                    '<table id="highscores">' +
                    '<caption>Highscores</caption>' +
                    '<tr>' +
                    '<th>Place</th>' +
                    '<th>Name</th>' +
                    '<th>Score</th>' +
                    '<th>Table size</th>' +
                    '</tr>' +
                    '</table>' +
                    '</div>'
                );
                console.log(data);
                for(var i = 0; i < data.length; i++) {
                    $('#highscores').append(
                        '<tr>' +
                        '<td>' + (i+1) + '.</td>' +
                        '<td>' + data[i].name + '</td>' +
                        '<td>' + data[i].tries + '</td>' +
                        '<td>' + data[i].size + '</td>' +
                        '</tr>'
                    )
                }
            },
            error: function(jqXHR, textStatus, error) {
                console.log(jqXHR.responseText);
            }
        })
    })
}

$(document).ready(function(){
    initSize();
    $('#startGameButton').click(function () {
        initSize();
    });
});

function initSize() {
    $('#board').empty();
    $('#board').html(
        '<div class="form-wrapper">' +
        '<form class="form-inline text-center" method="post">' +
        '<div class="form-group">' +
        '<label for="boardSize" class=sr-only">Size (even number between 6 and 20): </label>' +
        '<input required class="form-control" type="number" name="boardSize" id="boardSize" min="6" max="20" step="2">' +
        '</div>' +
        '<div class="form-group">' +
        '<button type="submit" class="btn btn-primary" id="setDeckSizeButton">Set deck size</button>' +
        '</div>' +
        '</form>' +
        '</div>'
    );
    $('#setDeckSizeButton').click(function (e) {
        e.preventDefault();
        size = $('#boardSize').val();
        if(size >= 6 && size <= 20 && size % 2 === 0) {
            restart(size);
        }
    });
}

function restart(size) {
    tries = 0;
    matches = 0;
    initTiles(size);
    setTimeout("revealTiles(function() {onPeekStart();})", _interval);
}