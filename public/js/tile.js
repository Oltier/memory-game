function tile(id) {
    this.id = id;
    this.frontColor = '#fcfcfc';
    this.backColor = '#fff';
    this.startAt = 1000;
    this.flipped = false;
    this.backContentImage = null;
    this.flipCompleteCallbacks = [];

    this.flip = function () {
        var tile = $("#" + this.id);

        tile.flip({
            direction: this.flipMethod,
            color: this.backColor,
            content: this.getBackContent(),
            onEnd: this.onFlipComplete()
        });


        $("#" + this.id + " img").show();

        this.flipped = true;
    };

    this.onFlipComplete = function() {
        while(this.flipCompleteCallbacks.length > 0) {
            this.flipCompleteCallbacks[this.flipCompleteCallbacks.length - 1]();
            this.flipCompleteCallbacks.pop();
        }
    };

    this.revertFlip = function () {
        $("#" + this.id).children("img").hide();
        $("#" + this.id).revertFlip();
        this.flipped = false;
    };

    this.setBackContentImage = function(backContentImage) {
        this.backContentImage = backContentImage;
    };

    this.setTileId = function(id) {
        this.id = id;
    };

    this.setStartAt = function(startAt) {
        this.startAt = startAt;
    };

    this.setFrontColor = function(frontColor) {
        this.frontColor = frontColor;
    };

    this.setBackColor = function(backColor) {
        this.backColor = backColor;
    };

    this.setFlipMethod = function(flipMethod) {
        this.flipMethod = flipMethod;
    };

    this.getHTML = function () {
        return '<div id="' + this.id + '" class = "tile ' + this.frontColor + '"></div>';
    };

    this.getStartAt = function () {
        return this.startAt;
    };

    this.getFlipped = function () {
        return this.flipped;
    };

    this.getBackContent = function () {
        return '<img src="' + this.backContentImage + '"/>';
    };

    this.getBackContentImage = function() {
        return this.backContentImage;
    };

    this.addFlipCompleteCallback = function(callback) {
        this.flipCompleteCallbacks.push(callback);
    };
}