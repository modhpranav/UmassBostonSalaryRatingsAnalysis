gsap.registerPlugin(ScrollTrigger);

gsap.fromTo([".chart1 #lowest5Chart", ".chart1 #top5Chart" ], {
    opacity: 0, // start fully transparent
}, {
    duration: 2,
    opacity: 1, // end fully visible
    ease: "none",
    scrollTrigger: {
        trigger: ".chart1",
        toggleActions: "restart none restart reset"
    }
});

gsap.fromTo(".dropdown", {
    opacity: 0, // start fully transparent
}, {
    duration: 0.5,
    opacity: 1, // end fully visible
    y: 20,
    x: 20,
    ease: "none",
    scrollTrigger: {
        trigger: ".chart1",
        toggleActions: "restart none none reset"
    }
});

// Create a GSAP timeline
tl = gsap.timeline({
    repeat: -1,
    yoyo: true,
  });
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

tl.to('#stats', {
    x: '100vh',
    duration: 10,
    color: function() { return getRandomColor(); }, // Add this line to make the text color change every second
    ease: 'none',
    repeatRefresh: true
});

// Function to animate the bars using GSAP
function animateBars(view) {
    // Get the data array containing the bar values
    const data = view.data('table');
  
    // Iterate over the data array and animate each bar
    data.forEach((d, i) => {
        // Get the height of the ith bar from the data
        const height = view.scale('y', d.value);

        // Animate the height of the bar to its actual value
        gsap.fromTo(`#bar${i}`, { scaleY: 0 }, { scaleY: 1, duration: 5, delay: i * 0.2, transformOrigin: "bottom" });
    });
  }


// Define the total number of stars
const totalStars = 500;

// Function to create a random star position
function randomPosition() {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight
  };
}

// Create the stars
for (let i = 0; i < totalStars; i++) {
  const starPosition = randomPosition();
  const star = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  star.setAttribute("cx", starPosition.x);
  star.setAttribute("cy", starPosition.y);
  star.setAttribute("r", Math.random() * 1.5); // Random radius
  star.setAttribute("fill", "white");
  star.setAttribute("opacity", 0); // Initially hidden

  document.getElementById("starrySky").appendChild(star);

  // Animate the star
  gsap.to(star, {
    opacity: 1,
    duration: Math.random() * 3 + 1, // Random duration between 1 and 4 seconds
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
    delay: Math.random() * 3 // Random initial delay
  });
}

// Create a GSAP timeline
const tl1 = gsap.timeline();

let loopTimeout; // Variable to store the timeout ID
let loopCount = 0; // Variable to keep track of the loop count

// Function to create the top 5 timeline
function createTop5timeline(data) {
    const ratingStatsElement = document.getElementById("ratingStats");
    const salaryStatsElement = document.getElementById("salaryStats");
    ratingStatsElement.innerHTML = "";
    salaryStatsElement.innerHTML = "";

    // Clear the previous timeout before starting a new one
    clearTimeout(loopTimeout);
    loopCount = 0; // Reset the loop count

    // Function to run the loop
    function runLoop() {
        // Display employee names with a delay of 2 seconds between each name
        if (loopCount < 10) { // Limit the loop to 10 times
            let i = loopCount; // Use loopCount as the index
            let emoji = data[i].RATING > 3 ? "🎉" : data[i].RATING === 3 ? "⭐" : "😞";
            ratingStatsElement.textContent = "Professor: " + data[i].FULL_NAME + " is rated " + data[i].RATING + " on RATE MY PROFESSOR " + emoji;
            ratingStatsElement.style.color = getRandomColor();
            let salaryemoji = data[i].ANNUAL_RATE > 100000 ? " 💰" : data[i].ANNUAL_RATE > 80000 ? " 🤑" : " 😢";
            salaryStatsElement.textContent = "Annual Salary: $ " + data[i].ANNUAL_RATE + salaryemoji;

            loopCount++; // Increment the loop count after each loop

            // Call runLoop again after a delay
            loopTimeout = setTimeout(runLoop, 7000);
        }
    }

    // Start the loop
    runLoop();
}
