var dice = {};
var regex = /(\-)?(([0-9]+)?(d)([0-9]+)(\+|\-)?)+([0-9]+)?/i;
var log = "";

dice.isADieRoll = function (text) {
    try {
        var matching = regex.exec(text);
        return (matching !== null && matching.length > 0);
    } catch (err) {
        console.log(err);
        return false;
    }
};

dice.roll = function (input) {
    log = ''; // clear the logs
    log += 'Input:' + input + '\n';
    input = input.replace(' ', ''); // remove spaces
    input = input.replace(/d(?![ 0-9]+)/, '');// now remove any 'd's that aren't followed by numbers to avoid confusion in next replace
    var total = input.replace(/[^\-\+0-9d|D]+/g, '');// finally, remove everything that isn't a number, 'd', '+' or '-'
    var pluses = [];

    var splitPluses = total.split(/\+/); // split up on '+'

    pluses = splitPluses.slice();
    if(pluses[0].indexOf('-') > -1){
        pluses.shift(); // drop the first, since it'll get caught in the forEach below
    }

    var minuses = [], positive = 0, negative = 0;

    // iterate over the original array
    splitPluses.forEach(function (elem) {
        if (elem.indexOf('-') > -1) {
            var temp = elem.split(/\-/);
            if (temp[0] !== "") {
                // if we split on a minus and there was something ahead of it, the thing ahead was a '+'
                pluses.push(temp.shift());
            }
            minuses = minuses.concat(temp);
        }
    });

    if (pluses.length > 0) {
        positive = pluses.map(this.parseRoll)
            .reduce(function (a, b) {
                return a + b;
            });
    }
    if (minuses.length > 0) {
        negative = minuses.map(this.parseRoll)
            .reduce(function (a, b) {
                return a + b;
            });
    }
    if (negative > 0) {
        log += "Total: " + positive + " - " + negative + " = " + (positive - negative) + '\n';

    } else {
        log += "Total: " + positive + '\n';
    }
    console.log(log);
    return ({log: log, total: positive - negative });
};

dice.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

dice.parseValue = function (val) {
    return parseInt(val || "1");
};


dice.parseRoll = function (roll) {

    log += "Parsing " + roll + '\n';

    var parts = roll.split(/d|D/); // split up the dice
    var sum = 0;
    var limit = dice.parseValue(parts[1]); // if undefined, we get a 1
    for (var i = 0; i < dice.parseValue(parts[0]); i++) {
        if (limit > 0) {
            var got = dice.getRandomInt(1, limit);
            sum += got;

            if (roll.indexOf('d') > -1) { // if we're rolling a die
                log += "  From roll d" + limit + ", roll " + (i + 1) + " was " + got + ". Total: " + sum + '\n';
            } else if (i === dice.parseValue(parts[0]) - 1) { // if we're returning the final total of the '+'
                log += "  Bonus: " + sum + '\n';
            }
        }
    }
    return sum;
};

module.exports = dice;