/* ==========================================
   SUPABASE CONFIGURATION
========================================== */

// TODO: Replace these with your own values from
// Supabase Dashboard → Settings → API
// The app will NOT work until both values below are set.

const SUPABASE_URL = "https://ybzmspumaybllrzrxnkk.supabase.co"; // TODO: set this

const SUPABASE_ANON_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inliem1zcHVtYXlibGxyenJ4bmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNDc2MzcsImV4cCI6MjA5OTYyMzYzN30.yc1dwmBf7pRyljBIbQYE8aQa9yAAMqQcXSsT4U0WITo"; // TODO: set this

/* ==========================================
   CREATE CLIENT
========================================== */

// Supabase library is loaded from the CDN
// included in your HTML pages.

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

window.supabaseClient = supabaseClient;

/* ==========================================
   AUTH HELPERS
========================================== */

/**
 * Returns the current logged-in user.
 */
async function getCurrentUser() {

    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
        console.error(error.message);
        return null;
    }

    return data?.user || null;
}
/**
 * Returns true if the user is logged in.
 */
async function isLoggedIn() {

    const user = await getCurrentUser();

    return user !== null;
}

/**
 * Logout current user.
 */
async function logout() {

    const { error } = await supabaseClient.auth.signOut();

    if (error) {

        alert(error.message);
        return;

    }

    window.location.href = "login.html";

}

/* ==========================================
   DATABASE HELPERS
========================================== */

/**
 * Fetch all quotes.
 */
async function getQuotes() {

    const { data, error } = await supabaseClient

        .from("quotes")

        .select("*")

        .order("created_at", { ascending: false });

    if (error) {

        console.error(error.message);

        return [];

    }

    return data;

}

/**
 * Fetch one quote.
 */
async function getQuote(id) {

    const { data, error } = await supabaseClient

        .from("quotes")

        .select("*")

        .eq("id", id)

        .single();

    if (error) {

        console.error(error.message);

        return null;

    }

    return data;

}

/**
 * Add a new quote.
 * (Admin use)
 */
async function addQuote(content) {

    const { error } = await supabaseClient

        .from("quotes")

        .insert({

            content: content

        });

    if (error) {

        console.error(error.message);

        return false;

    }

    return true;

}

/* ==========================================
   REACTION HELPERS
========================================== */

/**
 * Like / Dislike
 *
 * reaction = "like"
 * reaction = "dislike"
 */
async function reactToQuote(quoteId, reaction) {

    const user = await getCurrentUser();

    if (!user) {

        alert("Please login first.");

        return;

    }

    const { error } = await supabaseClient

        .from("quote_reactions")

        .upsert({

            quote_id: quoteId,

            user_id: user.id,

            reaction: reaction

        });

    if (error) {

        console.error(error.message);

        return false;

    }

    return true;

}

/**
 * Total Likes
 */
async function getLikes(quoteId) {

    const { count } = await supabaseClient

        .from("quote_reactions")

        .select("*", {

            count: "exact",

            head: true

        })

        .eq("quote_id", quoteId)

        .eq("reaction", "like");

    return count || 0;

}

/**
 * Total Dislikes
 */
async function getDislikes(quoteId) {

    const { count } = await supabaseClient

        .from("quote_reactions")

        .select("*", {

            count: "exact",

            head: true

        })

        .eq("quote_id", quoteId)

        .eq("reaction", "dislike");

    return count || 0;

}

/**
 * Current user's reaction
 */
async function getMyReaction(quoteId) {

    const user = await getCurrentUser();

    if (!user) return null;

    const { data } = await supabaseClient

        .from("quote_reactions")

        .select("reaction")

        .eq("quote_id", quoteId)

        .eq("user_id", user.id)

        .maybeSingle();

    return data?.reaction || null;

}

/* ==========================================
   REALTIME
========================================== */

/**
 * Listen for reaction changes.
 */
function subscribeToReactions(callback) {

    supabaseClient

        .channel("quote-reactions")

        .on(

            "postgres_changes",

            {

                event: "*",

                schema: "public",

                table: "quote_reactions"

            },

            callback

        )

        .subscribe();

}

/* ==========================================
   SESSION WATCHER
========================================== */

supabaseClient.auth.onAuthStateChange((event) => {

    console.log("Auth Event:", event);

});

/* ==========================================
   GLOBAL ACCESS
========================================== */

window.supabaseClient = supabaseClient;

window.getCurrentUser = getCurrentUser;
window.isLoggedIn = isLoggedIn;
window.logout = logout;

window.getQuotes = getQuotes;
window.getQuote = getQuote;
window.addQuote = addQuote;

window.reactToQuote = reactToQuote;
window.getLikes = getLikes;
window.getDislikes = getDislikes;
window.getMyReaction = getMyReaction;

window.subscribeToReactions = subscribeToReactions;
