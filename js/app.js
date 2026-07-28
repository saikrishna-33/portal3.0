/* ==========================================
   APP.JS
   Quote Community Landing Page
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();

    initializeSmoothScroll();

    initializeRevealAnimation();

    initializeCounterAnimation();

    initializeQuoteCardEffects();

});

/* ==========================================
   NAVIGATION
========================================== */

function initializeNavigation() {

    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 80) {

            header.style.background =
                "rgba(8,12,30,.95)";

            header.style.boxShadow =
                "0 10px 30px rgba(0,0,0,.35)";

        }

        else {

            header.style.background =
                "rgba(10,10,25,.25)";

            header.style.boxShadow =
                "none";

        }

    });

}

/* ==========================================
   SMOOTH SCROLL
========================================== */

function initializeSmoothScroll() {

    document.querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", function(e){

                const target =
                    document.querySelector(
                        this.getAttribute("href")
                    );

                if(!target) return;

                e.preventDefault();

                target.scrollIntoView({

                    behavior:"smooth"

                });

            });

        });

}

/* ==========================================
   REVEAL ANIMATION
========================================== */

function initializeRevealAnimation(){

    const sections=document.querySelectorAll(

        ".community,.trending,#features,.cta"

    );

    const observer=new IntersectionObserver(

        entries=>{

            entries.forEach(entry=>{

                if(entry.isIntersecting){

                    entry.target.style.opacity="1";

                    entry.target.style.transform="translateY(0)";

                }

            });

        },

        {

            threshold:.15

        }

    );

    sections.forEach(section=>{

        section.style.opacity="0";

        section.style.transform="translateY(40px)";

        section.style.transition=".8s";

        observer.observe(section);

    });

}

/* ==========================================
   COUNTER ANIMATION
========================================== */

function initializeCounterAnimation(){

    const counters=document.querySelectorAll(".box h3");

    let started=false;

    window.addEventListener("scroll",()=>{

        const section=document.querySelector(".community");

        if(!section) return;

        const top=section.offsetTop;

        if(window.scrollY>top-500 && !started){

            started=true;

            counters.forEach(counter=>{

                const target=parseInt(

                    counter.innerText.replace(/\D/g,"")

                );

                const suffix=

                    counter.innerText.replace(/[0-9]/g,"");

                let count=0;

                const speed=Math.ceil(target/80);

                const timer=setInterval(()=>{

                    count+=speed;

                    if(count>=target){

                        count=target;

                        clearInterval(timer);

                    }

                    counter.innerText=

                        count+suffix;

                },20);

            });

        }

    });

}

/* ==========================================
   QUOTE CARD EFFECT
========================================== */

function initializeQuoteCardEffects(){

    const cards=document.querySelectorAll(

        ".quote-card,.quote-box,.feature"

    );

    cards.forEach(card=>{

        card.addEventListener("mouseenter",()=>{

            card.style.transform="translateY(-10px)";

        });

        card.addEventListener("mouseleave",()=>{

            card.style.transform="translateY(0px)";

        });

    });

}

/* ==========================================
   ACTIVE NAV LINK
========================================== */

window.addEventListener("scroll",()=>{

    const sections=document.querySelectorAll("section");

    const navLinks=document.querySelectorAll("nav a");

    let current="";

    sections.forEach(section=>{

        const top=section.offsetTop-150;

        const height=section.clientHeight;

        if(window.scrollY>=top){

            current=section.getAttribute("id");

        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        const href=link.getAttribute("href");

        if(href && href==="#"+current){

            link.classList.add("active");

        }

    });

});

/* ==========================================
   PARALLAX EFFECT
========================================== */

window.addEventListener("mousemove",(e)=>{

    const cards=document.querySelectorAll(".quote-card");

    const x=e.clientX/window.innerWidth;

    const y=e.clientY/window.innerHeight;

    cards.forEach((card,index)=>{

        const moveX=(x-0.5)*(10+index*3);

        const moveY=(y-0.5)*(10+index*3);

        card.style.transform=

            `translate(${moveX}px,${moveY}px)`;

    });

});

/* ==========================================
   CTA BUTTON
========================================== */

const cta=document.querySelector(".cta .primary");

if(cta){

    cta.addEventListener("click",()=>{

        console.log("CTA Clicked");

    });

}

/* ==========================================
   PAGE LOADER
========================================== */

window.addEventListener("load",()=>{

    document.body.style.opacity="1";

});

/* ==========================================
   PREVENT DOUBLE CLICK
========================================== */

document.querySelectorAll("button").forEach(btn=>{

    btn.addEventListener("click",()=>{

        btn.disabled=true;

        setTimeout(()=>{

            btn.disabled=false;

        },600);

    });

});

/* ==========================================
   END
========================================== */

console.log("Quote Community Loaded Successfully 🚀");
