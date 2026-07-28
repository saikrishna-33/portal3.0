/* ==========================================
   DASHBOARD.JS
   Combined Version (Part 1 + Part 2)
========================================== */

let currentQuoteId = null;

/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    // Check login
    const user = await getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Display user email
    const userEmail = document.getElementById("userEmail");

    if (userEmail) {
        userEmail.textContent = user.email;
    }

    // Load dashboard
    await loadQuoteOfTheDay();
    await loadLatestQuotes();
    await highlightMyReaction();

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            await logout();
        });
    }
});

/* ==========================================
   QUOTE OF THE DAY
========================================== */

async function loadQuoteOfTheDay() {

    const quotes = await getQuotes();

    if (!quotes || quotes.length === 0) {

        document.getElementById("quoteText").textContent =
            "No quotes available.";

        return;
    }

    const quote = quotes[0];

    currentQuoteId = quote.id;

    document.getElementById("quoteText").textContent =
        quote.content;

    await refreshCurrentQuote();
}

/* ==========================================
   UPDATE LIKE/DISLIKE COUNTS
========================================== */

async function updateReactionCounts() {

    if (!currentQuoteId) return;

    const likes = await getLikes(currentQuoteId);
    const dislikes = await getDislikes(currentQuoteId);

    document.getElementById("likeCount").textContent = likes;
    document.getElementById("dislikeCount").textContent = dislikes;
}

/* ==========================================
   CURRENT USER REACTION
========================================== */

async function highlightMyReaction() {

    if (!currentQuoteId) return;

    const reaction = await getMyReaction(currentQuoteId);

    const likeBtn = document.getElementById("likeBtn");
    const dislikeBtn = document.getElementById("dislikeBtn");

    if (!likeBtn || !dislikeBtn) return;

    likeBtn.classList.remove("active");
    dislikeBtn.classList.remove("active");

    if (reaction === "like") {
        likeBtn.classList.add("active");
    }

    if (reaction === "dislike") {
        dislikeBtn.classList.add("active");
    }
}

/* ==========================================
   REFRESH CURRENT QUOTE
========================================== */

async function refreshCurrentQuote() {

    await updateReactionCounts();
    await highlightMyReaction();

}

/* ==========================================
   LATEST QUOTES
========================================== */

async function loadLatestQuotes() {

    const container = document.getElementById("quotesContainer");

    if (!container) return;

    const quotes = await getQuotes();

    renderQuoteCards(quotes);

}

/* ==========================================
   RENDER QUOTE CARDS
========================================== */

function renderQuoteCards(quotes) {

    const container = document.getElementById("quotesContainer");

    if (!container) return;

    container.innerHTML = "";

    quotes.forEach((quote) => {

        const card = document.createElement("div");

        card.className = "quote-box";

        const preview = document.createElement("p");

        preview.textContent = quote.content.length > 120
            ? quote.content.substring(0,120) + "..."
            : quote.content;

        const title = document.createElement("h3");
        title.textContent = "Quote";

        const readBtn = document.createElement("button");
        readBtn.className = "read-btn";
        readBtn.dataset.id = quote.id;
        readBtn.textContent = "Read More";

        card.appendChild(title);
        card.appendChild(preview);
        card.appendChild(readBtn);

        container.appendChild(card);

    });

}

/* ==========================================
   REACTION BUTTONS
========================================== */

const likeBtn = document.getElementById("likeBtn");

if (likeBtn) {

    likeBtn.addEventListener("click", async () => {

        if (!currentQuoteId) return;

        await reactToQuote(currentQuoteId, "like");

        await refreshCurrentQuote();

    });

}

const dislikeBtn = document.getElementById("dislikeBtn");

if (dislikeBtn) {

    dislikeBtn.addEventListener("click", async () => {

        if (!currentQuoteId) return;

        await reactToQuote(currentQuoteId, "dislike");

        await refreshCurrentQuote();

    });

}

/* ==========================================
   SEARCH
========================================== */

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", async () => {

        const keyword = searchInput.value
            .trim()
            .toLowerCase();

        const quotes = await getQuotes();

        const filtered = quotes.filter(q =>
            q.content.toLowerCase().includes(keyword)
        );

        renderQuoteCards(filtered);

    });

}

/* ==========================================
   CATEGORY FILTER
========================================== */

const categories = document.querySelectorAll(".category");

categories.forEach(category => {

    category.addEventListener("click", async () => {

        const name = category.innerText
            .replace(/[^\w\s]/g, "")
            .trim()
            .toLowerCase();

        const quotes = await getQuotes();

        const filtered = quotes.filter(q => {

            if (!q.category) return false;

            return q.category
                .toLowerCase()
                .includes(name);

        });

        renderQuoteCards(filtered);

    });

});

/* ==========================================
   TRENDING QUOTES
========================================== */

async function loadTrendingQuotes() {

    const quotes = await getQuotes();

    quotes.sort((a, b) =>
        (b.likes || 0) - (a.likes || 0)
    );

    renderQuoteCards(quotes.slice(0, 6));

}

/* ==========================================
   READ MORE
========================================== */

document.addEventListener("click", async (event) => {

    if (!event.target.classList.contains("read-btn")) return;

    const id = event.target.dataset.id;

    if (!id) return;

    const quote = await getQuote(id);

    alert(quote ? quote.content : "Quote not found.");

});

/* ==========================================
   REALTIME REACTION UPDATES
========================================== */

subscribeToReactions(async () => {

    await refreshCurrentQuote();

});
