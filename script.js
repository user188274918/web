// ===== Waste Reduction in Malaysia: script.js =====


// ---------- TABS ----------
// Hides every tab, then shows the one with the id tabName
function showTab(tabName) {
    let tabs = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }

    let buttons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active");
    document.getElementById("btn-" + tabName).classList.add("active");

    // go back to the top of the page
    window.scrollTo(0, 0);

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
        result.textContent = "Correct! It was about 6,000 tonnes of good food every day. Find out more in the Food Waste tab.";
        result.className = "result good";
    } else {
        button.classList.add("wrong");
        result.textContent = "Not quite. The answer is about 6,000 tonnes every day. Find out more in the Food Waste tab.";
        result.className = "result bad";
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
        result.textContent = "Tick at least one food first.";
        result.className = "result bad";
    } else {
        result.textContent = "Try making: " + dish;
        result.className = "result good";
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
        countText.textContent = "You haven't picked anything yet.";
        countText.className = "result";
    } else {
        let perYear = count * 365;
        let itemWord = "items";
        if (count == 1) {
            itemWord = "item";
        }
        countText.textContent = "You used " + count + " single-use plastic " + itemWord + " today. If you did that every day, that's " + perYear.toLocaleString() + " items a year. Try these swaps:";
        countText.className = "result bad";
    }
}

function calculateBags() {
    let bagInput = document.getElementById("bag-input").value;
    let bags = Number(bagInput);
    let result = document.getElementById("bag-result");

    if (bagInput == "" || bags < 0 || isNaN(bags)) {
        result.textContent = "Please type a number that is 0 or more.";
        result.className = "result bad";
        return;
    }

    // 20 sen per bag, 52 weeks in a year
    let ringgit = bags * 0.20 * 52;
    let bagsPerYear = bags * 52;

    if (bags == 0) {
        result.textContent = "Great! Your family doesn't pay anything for plastic bags.";
        result.className = "result good";
    } else {
        result.textContent = "That's " + bagsPerYear + " bags and RM" + ringgit.toFixed(2) + " a year, just on plastic bags. A reusable bag saves that money.";
        result.className = "result bad";
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
let answered = false;

function startGame() {
    currentItem = 0;
    score = 0;
    document.getElementById("play-again").classList.add("hidden");
    showItem();
}

function showItem() {
    answered = false;
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
    if (answered) {
        return;
    }
    answered = true;
    setBinsDisabled(true);

    let item = sortItems[currentItem];
    let feedback = document.getElementById("sort-feedback");

    if (bin == item.bin) {
        score = score + 1;
        feedback.textContent = "Correct! " + item.reason;
        feedback.className = "result good";
    } else {
        feedback.textContent = "Not quite. " + item.reason;
        feedback.className = "result bad";
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
    let result = document.getElementById("clothes-result");

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
    let result = document.getElementById("clothes-result");
    result.textContent = text;
    result.className = "result good";
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

    if (shirtInput == "" || shirts < 0 || isNaN(shirts)) {
        result.textContent = "Please type a number that is 0 or more.";
        result.className = "result bad";
        return;
    }

    // about 2,700 litres for one cotton T-shirt (WWF),
    // which is about 2.5 years of drinking water for one person
    let litres = shirts * 2700;
    let years = shirts * 2.5;

    if (shirts == 0) {
        result.textContent = "No new T-shirts this year. Well done!";
        result.className = "result good";
    } else {
        let shirtWord = "T-shirts";
        if (shirts == 1) {
            shirtWord = "T-shirt";
        }
        result.textContent = "Making " + shirts + " cotton " + shirtWord + " can take about " + litres.toLocaleString() + " litres of water. That's enough drinking water for one person for about " + years + " years!";
        result.className = "result bad";
    }
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
        status.textContent = "Please type your name.";
        status.className = "result bad";
        document.getElementById("fb-name").focus();
        return;
    }

    if (message == "") {
        status.textContent = "Please write some feedback before sending.";
        status.className = "result bad";
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
            status.textContent = "Thank you, " + name + "! Your feedback was sent.";
            status.className = "result good";
            form.reset();
        } else {
            // Formspree sends back a list of what went wrong
            return response.json().then(function (data) {
                if (data.errors) {
                    let messages = [];
                    for (let i = 0; i < data.errors.length; i++) {
                        messages.push(data.errors[i].message);
                    }
                    status.textContent = "Sorry, your feedback wasn't sent: " + messages.join(", ");
                } else {
                    status.textContent = "Sorry, something went wrong. Please try again.";
                }
                status.className = "result bad";
            });
        }
    })
    .catch(function () {
        status.textContent = "Sorry, your feedback couldn't be sent. Check your internet connection and try again.";
        status.className = "result bad";
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
