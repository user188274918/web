// ===== Waste Reduction in Malaysia: script.js =====


// ---------- SMALL HELPERS (used by many parts of the page) ----------
// Shows a message. type is "good" (green), "bad" (red) or "" (normal)
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = "result " + type;
}

// Checks what was typed in a number box: not empty, not negative, no decimals
function isWholeNumber(text) {
    let number = Number(text);
    return text != "" && number >= 0 && Number.isInteger(number);
}


// ---------- TABS ----------
// Hides every tab, then shows the one with the id tabName
function showTab(tabName) {
    // check this now, before the old tab gets hidden
    let pressedTabButton = document.activeElement.classList.contains("tab-button");

    let tabs = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }

    let buttons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
        buttons[i].removeAttribute("aria-current");
    }

    document.getElementById(tabName).classList.add("active");
    document.getElementById("btn-" + tabName).classList.add("active");
    document.getElementById("btn-" + tabName).setAttribute("aria-current", "page");

    // go back to the top of the page
    window.scrollTo(0, 0);

    // buttons like "Next" are hidden now, so keyboard users start at the new heading
    if (!pressedTabButton) {
        document.querySelector("#" + tabName + " h1").focus();
    }

    // the recycling chart bars grow when you open that tab
    if (tabName == "recycling") {
        growBars();
    }
}


// ---------- DARK MODE / LIGHT MODE ----------
function toggleTheme() {
    document.documentElement.classList.toggle("dark");

    let theme = "light";
    if (document.documentElement.classList.contains("dark")) {
        theme = "dark";
    }

    // remember the choice for next time
    try {
        localStorage.setItem("theme", theme);
    } catch (error) {
        // could not save, but the button still works
    }

    updateThemeButton();
}

// changes the button's label so screen readers say what it will do
function updateThemeButton() {
    let button = document.getElementById("theme-toggle");
    if (document.documentElement.classList.contains("dark")) {
        button.setAttribute("aria-label", "Switch to light mode");
        button.title = "Switch to light mode";
    } else {
        button.setAttribute("aria-label", "Switch to dark mode");
        button.title = "Switch to dark mode";
    }
}


// ---------- HOME: GUESS THE NUMBER ----------
function checkGuess(button, isRight) {
    let guessButtons = document.getElementsByClassName("guess-button");
    for (let i = 0; i < guessButtons.length; i++) {
        guessButtons[i].disabled = true;
    }

    let result = document.getElementById("guess-result");

    if (isRight) {
        button.classList.add("right");
        showMessage(result, "Correct! It was about 6,000 tonnes of good food every day. Find out more in the Food Waste tab.", "good");
    } else {
        button.classList.add("wrong");
        showMessage(result, "Not quite. The answer is about 6,000 tonnes every day. Find out more in the Food Waste tab.", "bad");
    }
}


// ---------- PLEDGES (saved in the browser) ----------
let pledges = [];

// load pledges saved from last time
try {
    let saved = localStorage.getItem("pledges");
    if (saved != null) {
        pledges = JSON.parse(saved);
    }
} catch (error) {
    // some browsers block saving, so we just start with an empty list
    pledges = [];
}

function savePledges() {
    try {
        localStorage.setItem("pledges", JSON.stringify(pledges));
    } catch (error) {
        // could not save, but the page still works
    }
}

function togglePledge(button) {
    let tip = button.getAttribute("data-tip");

    if (pledges.includes(tip)) {
        // remove it from the list
        pledges.splice(pledges.indexOf(tip), 1);
    } else {
        pledges.push(tip);
    }

    savePledges();
    updatePledges();
}

function clearPledges() {
    pledges = [];
    savePledges();
    updatePledges();
}

// updates the pledge buttons and the list on the Home tab
function updatePledges() {
    let buttons = document.getElementsByClassName("pledge-button");
    for (let i = 0; i < buttons.length; i++) {
        let tip = buttons[i].getAttribute("data-tip");
        if (pledges.includes(tip)) {
            buttons[i].textContent = "Pledged";
            buttons[i].classList.add("pledged");
        } else {
            buttons[i].textContent = "I'll try this";
            buttons[i].classList.remove("pledged");
        }
    }

    let list = document.getElementById("pledge-list");
    let summary = document.getElementById("pledge-summary");
    let clearButton = document.getElementById("clear-pledges");
    list.innerHTML = "";

    if (pledges.length == 0) {
        summary.textContent = "You haven't picked any habits yet. Every topic tab has tips you can pledge to try.";
        clearButton.classList.add("hidden");
    } else {
        if (pledges.length == 1) {
            summary.textContent = "You've pledged to try 1 habit:";
        } else {
            summary.textContent = "You've pledged to try " + pledges.length + " habits:";
        }
        for (let i = 0; i < pledges.length; i++) {
            let item = document.createElement("li");
            item.textContent = pledges[i];
            list.appendChild(item);
        }
        clearButton.classList.remove("hidden");
    }
}


// ---------- FOOD WASTE: LEFTOVER RESCUE ----------
function rescueLeftovers() {
    let rice = document.getElementById("lf-rice").checked;
    let egg = document.getElementById("lf-egg").checked;
    let bread = document.getElementById("lf-bread").checked;
    let banana = document.getElementById("lf-banana").checked;
    let veg = document.getElementById("lf-veg").checked;
    let chicken = document.getElementById("lf-chicken").checked;

    let result = document.getElementById("rescue-result");
    let dish = "";

    // check the combinations first, then single foods
    if (rice && egg) {
        dish = "Egg fried rice! Cold, day-old rice is great for frying.";
    } else if (rice && chicken) {
        dish = "Chicken fried rice!";
    } else if (rice && veg) {
        dish = "Vegetable fried rice!";
    } else if (rice) {
        dish = "Fried rice or rice porridge!";
    } else if (bread && egg) {
        dish = "French toast!";
    } else if (banana && egg) {
        dish = "Banana pancakes!";
    } else if (banana) {
        dish = "Banana fritters or a banana smoothie! Brown bananas are sweeter.";
    } else if (chicken && veg) {
        dish = "Chicken and vegetable soup!";
    } else if (bread) {
        dish = "Toast, or bread pudding!";
    } else if (veg) {
        dish = "Vegetable soup or a quick stir-fry!";
    } else if (chicken) {
        dish = "A chicken sandwich or wrap!";
    } else if (egg) {
        dish = "An omelette!";
    }

    if (dish == "") {
        showMessage(result, "Tick at least one food first.", "bad");
    } else {
        showMessage(result, "Try making: " + dish, "good");
    }
}


// ---------- PLASTIC WASTE: MY PLASTIC DAY ----------
function togglePlastic(button) {
    button.classList.toggle("selected");

    let items = document.getElementsByClassName("plastic-item");
    let swapList = document.getElementById("swap-list");
    let countText = document.getElementById("plastic-count");
    let count = 0;
    swapList.innerHTML = "";

    for (let i = 0; i < items.length; i++) {
        if (items[i].classList.contains("selected")) {
            count = count + 1;
            let swap = document.createElement("li");
            swap.textContent = items[i].getAttribute("data-swap");
            swapList.appendChild(swap);
        }
    }

    if (count == 0) {
        showMessage(countText, "You haven't picked anything yet.", "");
    } else {
        let perYear = count * 365;
        let itemWord = "items";
        if (count == 1) {
            itemWord = "item";
        }
        showMessage(countText, "You used " + count + " single-use plastic " + itemWord + " today. If you did that every day, that's " + perYear.toLocaleString("en-MY") + " items a year. Try these swaps:", "bad");
    }
}

function calculateBags() {
    let bagInput = document.getElementById("bag-input").value;
    let bags = Number(bagInput);
    let result = document.getElementById("bag-result");

    if (!isWholeNumber(bagInput)) {
        showMessage(result, "Please type a whole number that is 0 or more.", "bad");
        return;
    }

    // 20 sen per bag, 52 weeks in a year
    let ringgit = bags * 0.20 * 52;
    let bagsPerYear = bags * 52;

    if (bags == 0) {
        showMessage(result, "Great! Your family doesn't pay anything for plastic bags.", "good");
    } else {
        showMessage(result, "That's " + bagsPerYear.toLocaleString("en-MY") + " bags and RM" + ringgit.toFixed(2) + " a year, just on plastic bags. A reusable bag saves that money.", "bad");
    }
}


// ---------- RECYCLING: BAR CHART ----------
function growBars() {
    let bars = document.getElementsByClassName("bar-fill");
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.width = "0%";
    }
    // wait a tiny bit so the bars start from 0 and grow
    setTimeout(function () {
        for (let i = 0; i < bars.length; i++) {
            bars[i].style.width = bars[i].getAttribute("data-value") + "%";
        }
    }, 100);
}


// ---------- RECYCLING: SORTING GAME ----------
let sortItems = [
    { name: "Newspaper", bin: "blue", reason: "Newspaper is paper, so it goes in the blue bin." },
    { name: "Glass sauce bottle", bin: "brown", reason: "Glass bottles go in the brown bin. Rinse it first!" },
    { name: "Drink can", bin: "orange", reason: "Aluminium cans go in the orange bin with plastic and tins." },
    { name: "Used tissue", bin: "general", reason: "Used tissue is dirty paper, so it can't be recycled." },
    { name: "Plastic water bottle", bin: "orange", reason: "Plastic bottles go in the orange bin." },
    { name: "Cardboard box", bin: "blue", reason: "Cardboard is paper, so it goes in the blue bin. Flatten it first." },
    { name: "Glass jam jar", bin: "brown", reason: "Glass jars go in the brown bin." },
    { name: "Banana peel", bin: "general", reason: "Food waste can't go in recycling bins. Even better, put it in a compost bin." },
    { name: "Milk powder tin", bin: "orange", reason: "Tins go in the orange bin." },
    { name: "Old exercise book", bin: "blue", reason: "Exercise books are paper, so they go in the blue bin." }
];

let currentItem = 0;
let score = 0;

function startGame() {
    currentItem = 0;
    score = 0;
    document.getElementById("play-again").classList.add("hidden");
    showItem();
}

function showItem() {
    document.getElementById("sort-item").textContent = sortItems[currentItem].name;
    document.getElementById("sort-count").textContent = "Item " + (currentItem + 1) + " of " + sortItems.length;
    document.getElementById("sort-score").textContent = "Score: " + score;
    document.getElementById("sort-feedback").textContent = "";
    document.getElementById("next-item").classList.add("hidden");
    setBinsDisabled(false);
}

function setBinsDisabled(isDisabled) {
    let bins = document.getElementsByClassName("bin-button");
    for (let i = 0; i < bins.length; i++) {
        bins[i].disabled = isDisabled;
    }
}

function chooseBin(bin) {
    setBinsDisabled(true);

    let item = sortItems[currentItem];
    let feedback = document.getElementById("sort-feedback");

    if (bin == item.bin) {
        score = score + 1;
        showMessage(feedback, "Correct! " + item.reason, "good");
    } else {
        showMessage(feedback, "Not quite. " + item.reason, "bad");
    }

    document.getElementById("sort-score").textContent = "Score: " + score;

    if (currentItem < sortItems.length - 1) {
        document.getElementById("next-item").classList.remove("hidden");
    } else {
        finishGame();
    }
}

function nextItem() {
    currentItem = currentItem + 1;
    showItem();
}

function finishGame() {
    let message = "";
    if (score == sortItems.length) {
        message = "Perfect! You got " + score + " out of " + sortItems.length + ". You're a recycling expert!";
    } else if (score >= 7) {
        message = "Well done! You got " + score + " out of " + sortItems.length + ".";
    } else {
        message = "You got " + score + " out of " + sortItems.length + ". Read the facts and try again!";
    }

    document.getElementById("sort-item").textContent = "Game over";
    let feedback = document.getElementById("sort-feedback");
    feedback.textContent = feedback.textContent + " " + message;
    document.getElementById("play-again").classList.remove("hidden");
}


// ---------- TEXTILE WASTE: OLD CLOTHES HELPER ----------
let clothesStep = 1;

function clothesAnswer(answer) {
    let question = document.getElementById("clothes-question");

    if (clothesStep == 1) {
        if (answer == "yes") {
            showClothesResult("Keep wearing it! The clothes you already own are the most eco-friendly ones.");
        } else {
            clothesStep = 2;
            question.textContent = "Is it still in good condition?";
        }
    } else if (clothesStep == 2) {
        if (answer == "yes") {
            showClothesResult("Give it a second life. Donate it, swap it with a friend, or sell it second-hand.");
        } else {
            clothesStep = 3;
            question.textContent = "Can it be fixed, like a small hole or a missing button?";
        }
    } else if (clothesStep == 3) {
        if (answer == "yes") {
            showClothesResult("Fix it! Sew the hole or the button, or ask someone at home to help you.");
        } else {
            showClothesResult("Cut it into cleaning cloths, or take it to a clothes recycling point so it doesn't end up in a landfill.");
        }
    }
}

function showClothesResult(text) {
    showMessage(document.getElementById("clothes-result"), text, "good");
    document.getElementById("clothes-buttons").classList.add("hidden");
    document.getElementById("clothes-restart").classList.remove("hidden");
}

function restartClothes() {
    clothesStep = 1;
    document.getElementById("clothes-question").textContent = "Do you still wear it?";
    document.getElementById("clothes-result").textContent = "";
    document.getElementById("clothes-buttons").classList.remove("hidden");
    document.getElementById("clothes-restart").classList.add("hidden");
}


// ---------- TEXTILE WASTE: T-SHIRT WATER CALCULATOR ----------
function calculateWater() {
    let shirtInput = document.getElementById("shirt-input").value;
    let shirts = Number(shirtInput);
    let result = document.getElementById("water-result");

    if (!isWholeNumber(shirtInput)) {
        showMessage(result, "Please type a whole number that is 0 or more.", "bad");
        return;
    }

    // about 2,700 litres for one cotton T-shirt (WWF),
    // which is about 2.5 years of drinking water for one person
    let litres = shirts * 2700;
    let years = shirts * 2.5;

    if (shirts == 0) {
        showMessage(result, "No new T-shirts this year. Well done!", "good");
    } else {
        let shirtWord = "T-shirts";
        if (shirts == 1) {
            shirtWord = "T-shirt";
        }
        showMessage(result, "Making " + shirts + " cotton " + shirtWord + " can take about " + litres.toLocaleString("en-MY") + " litres of water. That's enough drinking water for one person for about " + years + " years!", "bad");
    }
}


// ---------- MY OWN DROPDOWNS ----------
// There are two: "facts" on the Home tab and "fav" in the feedback form.
// name is the first part of the ids, for example "fav" for fav-button and fav-list.
function getOptions(name) {
    return document.getElementById(name + "-list").getElementsByClassName("dropdown-option");
}

function toggleDropdown(name) {
    let list = document.getElementById(name + "-list");
    let button = document.getElementById(name + "-button");
    list.classList.toggle("hidden");

    if (list.classList.contains("hidden")) {
        button.setAttribute("aria-expanded", "false");
    } else {
        button.setAttribute("aria-expanded", "true");
        // focus the chosen option so the keyboard can be used
        list.querySelector(".chosen").focus();
    }
}

function closeDropdown(name) {
    document.getElementById(name + "-list").classList.add("hidden");
    document.getElementById(name + "-button").setAttribute("aria-expanded", "false");
}

// marks one option as chosen and shows its text on the button
function chooseOption(name, option) {
    let options = getOptions(name);
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove("chosen");
    }
    option.classList.add("chosen");
    document.getElementById(name + "-text").textContent = option.textContent;
}

// keyboard: Escape and Tab close it, up and down arrows open it and move between options
function dropdownKeys(event, name) {
    let options = getOptions(name);
    let current = Array.from(options).indexOf(document.activeElement);
    let isClosed = document.getElementById(name + "-list").classList.contains("hidden");

    if (event.key == "Escape") {
        closeDropdown(name);
        document.getElementById(name + "-button").focus();
    } else if (event.key == "Tab") {
        closeDropdown(name);
    } else if (event.key == "ArrowDown" && isClosed) {
        event.preventDefault();
        toggleDropdown(name);
    } else if (event.key == "ArrowDown" && current < options.length - 1) {
        event.preventDefault();
        options[current + 1].focus();
    } else if (event.key == "ArrowUp" && current > 0) {
        event.preventDefault();
        options[current - 1].focus();
    }
}

document.getElementById("facts-dropdown").addEventListener("keydown", function (event) {
    dropdownKeys(event, "facts");
});

document.getElementById("fav-dropdown").addEventListener("keydown", function (event) {
    dropdownKeys(event, "fav");
});

// close a dropdown when you click somewhere else
document.addEventListener("click", function (event) {
    if (!document.getElementById("facts-dropdown").contains(event.target)) {
        closeDropdown("facts");
    }
    if (!document.getElementById("fav-dropdown").contains(event.target)) {
        closeDropdown("fav");
    }
});


// ---------- HOME: WASTE FACTS LABEL ----------
// The facts for each choice in the dropdown. They are the same facts as on the topic tabs.
let wasteFacts = {
    all: [
        { name: "Food wasted", note: "by each person in a year", value: "81 kg" },
        { name: "Plastic packaging used", note: "by each person in a year", value: "16.78 kg" },
        { name: "Recycling rate", note: "in 2023", value: "35.38%" },
        { name: "Textile waste thrown away", note: "every day, says Kloth Cares", value: "2,000+ tonnes" }
    ],
    food: [
        { name: "Food wasted", note: "by each person in a year", value: "81 kg" },
        { name: "World average", note: "by each person in a year", value: "79 kg" },
        { name: "Extra food waste expected", note: "during Ramadan 2023", value: "75,000 tonnes" },
        { name: "Food wasted around the world", note: "in 2022", value: "1.05 billion tonnes" },
        { name: "Share that came from homes", note: "around the world in 2022", value: "60%" }
    ],
    plastic: [
        { name: "Plastic packaging used", note: "by each person in a year", value: "16.78 kg" },
        { name: "Charge for a plastic bag", note: "in Selangor, since 1 January 2017", value: "20 sen" },
        { name: "Goal to stop single-use plastics", note: "in Malaysia's roadmap", value: "by 2030" }
    ],
    recycling: [
        { name: "Recycling rate", note: "in 2015", value: "15.7%" },
        { name: "Recycling rate", note: "in 2021", value: "31.52%" },
        { name: "Recycling rate", note: "in 2023", value: "35.38%" },
        { name: "Target", note: "for 2025", value: "40%" },
        { name: "Cost of not recycling", note: "in 2023 alone", value: "RM291 million" }
    ],
    textile: [
        { name: "Textile waste thrown away", note: "every day, says Kloth Cares", value: "2,000+ tonnes" },
        { name: "A smaller number", note: "in a year, from a UiTM article", value: "195,300 tonnes" },
        { name: "Material recycled into new clothes", note: "around the world", value: "less than 1%" },
        { name: "Water to make one cotton T-shirt", note: "about", value: "2,700 litres" }
    ]
};

// remembers the choice, so the button under the label knows which tab to open
let factsTopic = "all";

function showFacts(topic) {
    factsTopic = topic;
    let facts = wasteFacts[topic];
    let rows = document.getElementById("facts-rows");
    rows.innerHTML = "";

    // build one row for each fact: name and note on the left, number on the right
    for (let i = 0; i < facts.length; i++) {
        let row = document.createElement("div");
        row.className = "label-row";

        let name = document.createElement("span");
        name.textContent = facts[i].name;
        let note = document.createElement("small");
        note.textContent = facts[i].note;
        name.appendChild(note);

        let value = document.createElement("b");
        value.textContent = facts[i].value;

        row.appendChild(name);
        row.appendChild(value);
        rows.appendChild(row);
    }
}

function pickFacts(option, topic) {
    chooseOption("facts", option);
    showFacts(topic);

    // the button under the label opens the tab that has the sources
    let openButton = document.getElementById("facts-open");
    if (topic == "all") {
        openButton.classList.add("hidden");
    } else {
        openButton.textContent = "Open " + option.textContent;
        openButton.classList.remove("hidden");
    }

    closeDropdown("facts");
    document.getElementById("facts-button").focus();
}


// ---------- FEEDBACK: FAVOURITE TAB DROPDOWN ----------
function setFavourite(option) {
    chooseOption("fav", option);
    // the hidden input is what gets sent with the form
    document.getElementById("fb-favourite").value = option.textContent;
}

function pickFavourite(option) {
    setFavourite(option);
    closeDropdown("fav");
    document.getElementById("fav-button").focus();
}


// ---------- FEEDBACK FORM (sent to my email with Formspree) ----------
// The Formspree link is in the form's action in index.html.
// If JavaScript is off, the form still sends the normal way.
function sendFeedback(event) {
    // stop the page from reloading
    event.preventDefault();

    let name = document.getElementById("fb-name").value.trim();
    let message = document.getElementById("fb-message").value.trim();
    let status = document.getElementById("fb-status");
    let submitButton = document.getElementById("fb-submit");

    if (name == "") {
        showMessage(status, "Please type your name.", "bad");
        document.getElementById("fb-name").focus();
        return;
    }

    if (message == "") {
        showMessage(status, "Please write some feedback before sending.", "bad");
        document.getElementById("fb-message").focus();
        return;
    }

    let form = document.getElementById("feedback-form");
    let formData = new FormData(form);

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    status.textContent = "";

    // send it to Formspree without leaving the page
    fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
    })
    .then(function (response) {
        if (response.ok) {
            showMessage(status, "Thank you, " + name + "! Your feedback was sent.", "good");
            form.reset();
            // reset() doesn't know about my own dropdown, so put it back to the first option
            setFavourite(getOptions("fav")[0]);
        } else {
            // Formspree sends back a list of what went wrong
            return response.json().then(function (data) {
                if (data.errors) {
                    let messages = [];
                    for (let i = 0; i < data.errors.length; i++) {
                        messages.push(data.errors[i].message);
                    }
                    showMessage(status, "Sorry, your feedback wasn't sent: " + messages.join(", "), "bad");
                } else {
                    showMessage(status, "Sorry, something went wrong. Please try again.", "bad");
                }
            });
        }
    })
    .catch(function () {
        showMessage(status, "Sorry, your feedback couldn't be sent. Check your internet connection and try again.", "bad");
    })
    .finally(function () {
        submitButton.disabled = false;
        submitButton.textContent = "Send feedback";
    });
}


// ---------- RUN WHEN THE PAGE LOADS ----------
updatePledges();
startGame();
updateThemeButton();


// open a tab straight from a link, for example index.html#recycling
let startTab = window.location.hash.replace("#", "");
if (document.getElementById("btn-" + startTab) != null) {
    showTab(startTab);
}
