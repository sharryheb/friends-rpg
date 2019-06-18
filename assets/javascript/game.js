
var gameCharacter = {
    name: "",
    image: "",
    health: 0,
    attack: 0,
    baseAttack: 0,
    counter: 0,

    makeCharacter: function(name, image, attack, health, counter)
    {
        this.name = name;
        this.image = image;
        this.baseAttack = attack;
        this.attack = attack;
        this.health = health;
        this.counter = counter;
    }
}

var rachel = Object.create(gameCharacter);
var joey = Object.create(gameCharacter);
var chandler = Object.create(gameCharacter);
var ross = Object.create(gameCharacter);
var phoebe = Object.create(gameCharacter);
var monica = Object.create(gameCharacter);

var characters = {
    rachel: rachel,
    chandler: chandler,
    ross: ross,
    joey: joey,
    monica: monica,
    phoebe: phoebe
}

var isCharacterChosen = false;
var isOpponentChosen = false;
var currentCharacter = null;
var currentOpponent = null;
var $characterCards = null;

function setCharacterStats()
{
    rachel.makeCharacter("Rachel", "assets/images/rachel.jpg", 4, 200, 3);
    chandler.makeCharacter("Chandler", "assets/images/chandler.jpg", 6, 180, 6);
    ross.makeCharacter("Ross", "assets/images/ross.jpg", 8, 160, 9);
    joey.makeCharacter("Joey", "assets/images/joey.jpg", 10, 140, 12);
    monica.makeCharacter("Monica", "assets/images/monica.jpg", 12, 120, 15);
    phoebe.makeCharacter("Phoebe", "assets/images/phoebe.jpg", 14, 100, 18);

    isCharacterChosen = false;
    isOpponentChosen = false;
    currentCharacter = null;
    currentOpponent = null;
    $characterCards = null;
}

function initUI()
{
    $characterCards = $(".character");
    $characterDeck = $("#remainingCharDeck");
    
    var i = 0; 
    for(var character in characters)
    {
        var $currentCard = $characterCards.eq(i);
        var iCharacter = characters[character];

        $currentCard.children("img").eq(0).attr("src", iCharacter.image);
        $currentCard.children("div").eq(0).children(".card-title").eq(0).text(iCharacter.name);
        $currentCard.children("div").eq(0).children(".card-text").eq(0).text(iCharacter.health);

        $characterCards.eq(i).css("display", "");
        $("#remainingCharDeck").append($characterCards.eq(i));
        i++;
    }
    $("#remainingCharAnchor").append($("#remainingCharDeck"));

    $("#remainingCharAnchor").css("display", "");

    $("#remainingCharDeck").css("display", "");
    
    $("#chooseWhich").css("display", "");
    
    $("#remainingOpp").children("h3").eq(0).css("display", "");
    $("#remainingOpp").css("display", "none");
    $("#remainingOpp").children("img").remove();

    $("#currentCharacter").css("display", "none");
    
    $("#currentOpponent").css("display", "none");
    
    $("#fightSection").css("display", "none");
    
    $("#buttons").css("display", "none");

    $("#messages").text("");

}

function initGame()
{
    setCharacterStats();

    initUI();
}

$(document).ready(function ()
{
    initGame();
});

$("#resetBtn").click(function()
{
    initGame();
});

$(".character").click(function()
{
    var $actualTarget = $(event.currentTarget);
    var $cardName = $actualTarget.children("div").eq(0).children(".card-title").eq(0).text().toLowerCase();
    var characterObj = characters[$cardName];

    if (!isCharacterChosen)
    {
        $("#currentCharacter").append($actualTarget);
        $("#currentCharacter").css("display", "");

        isCharacterChosen = true;
        currentCharacter = characterObj;

        $("#chooseWhich").css("display", "none");
        $("#currentOpponent").css("display", "");
        $("#remainingOpp").append($("#remainingCharDeck"));
        $("#remainingOpp").css("display", "");
        $("#remainingOpp").children("h3").eq(0).text("Remaining Opponents:");
    }
    else if (!isOpponentChosen)
    {
        if (characterObj.name !== currentCharacter.name)
        {
            $("#messages").text("");
            $("#currentOpponent").append($actualTarget);
            $("#currentOpponent").css("display", "");

            isOpponentChosen = true;
            currentOpponent = characterObj;

            $("#fightSection").css("display", "");
            $("#buttons").css("display", "");
            $("#attackBtn").attr("disabled", false);
            $("#resetBtn").attr("disabled", false);
        }
        else
        {
            $("#fightSection").css("display", "");
            $("#messages").text("You cannot choose your own player as an opponent.");
        }
    }

});


$("#attackBtn").click(function()
{
    currentOpponent.health = currentOpponent.health - currentCharacter.attack;
    currentCharacter.health = currentCharacter.health - currentOpponent.counter;
    currentCharacter.attack = currentCharacter.attack + currentCharacter.baseAttack;

    $("#currentCharacter").children("div").eq(0).children("div").eq(0).children(".card-text").eq(0).text(currentCharacter.health);
    $("#currentOpponent").children("div").eq(0).children("div").eq(0).children(".card-text").eq(0).text(currentOpponent.health);

    var message = "You attacked " + currentOpponent.name + " for " + currentCharacter.attack + " damage.<br>";
    message += currentOpponent.name + " counter-attacked you for " + currentOpponent.counter + " damage.<br>";
    $("#messages").prepend(message);

    if (currentCharacter.health <= 0)
    {
        $("#remainingOpp").append($("<img>").attr("src", "assets/images/loser.gif"));
        $("#remainingOpp").css("display", "");
        $("#remainingOpp").children("h3").eq(0).css("display", "none");
        $("#remainingCharDeck").css("display", "none");
        $("#currentOpponent").css("display", "none");
        $("#messages").text("You got your ass kicked by " + currentOpponent.name + "! Game over!");
        $("#attackBtn").attr("disabled", true);
    }
    else if (currentOpponent.health <= 0)
    {
        $("#currentOpponent").children("div").css("display", "none");
        var opponentsRemaining = $("#remainingOpp").children("div").eq(0).children("div:visible").length;
        
        if (opponentsRemaining <= 0)
        {
            currentOpponent = null;
            isOpponentChosen = false;
            $("#remainingOpp").append($("<img>").attr("src", "assets/images/TurkeyDance.gif"));
            $("#remainingOpp").css("display", "");
            $("#remainingOpp").children("h3").eq(0).css("display", "none");
            $("#remainingCharDeck").css("display", "none");
            $("#currentOpponent").css("display", "none");
            $("#messages").text("You kicked everyone's ass! Game over!");
            $("#attackBtn").attr("disabled", true);
        }
        else if (opponentsRemaining == 1)
        {
            var lastOpponent = $("#remainingOpp").children("div").eq(0).children("div").eq(0);
            $("#currentOpponent").append(lastOpponent);
            
            isOpponentChosen = true;
            currentOpponent = characters[lastOpponent.children("div").eq(0).children(".card-title").eq(0).text().toLowerCase()];

            $("#messages").text("You only have one opponent left - FIGHT!!");

            $("#remainingOpp").css("display", "none");
        }
        else
        {
            $("#remainingCharDeck").append($("#currentOpponent").children("div").eq(0));
            $("#remainingOpp").children("h3").eq(0).text("Choose next opponent:");
            $("#messages").text("You kicked " + currentOpponent.name + "'s ass!! Choose your next opponent.");
            currentOpponent = null;
            isOpponentChosen = false;
        }
        
    }
});
