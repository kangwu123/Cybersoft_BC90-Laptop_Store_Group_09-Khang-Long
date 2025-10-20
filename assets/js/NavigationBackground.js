  // Create comets
      function createComets() {
        const starsContainer = document.querySelector(".stars");
        const numberOfComets = 3;

        for (let i = 0; i < numberOfComets; i++) {
          const comet = document.createElement("div");
          comet.className = "comet";

          // Random starting positions and delays
          comet.style.top = `${Math.random() * 50}%`;
          comet.style.left = `${Math.random() * 50}%`;
          comet.style.animationDelay = `${Math.random() * 8}s`;

          starsContainer.appendChild(comet);
        }
      }

      // Create stars
      function createStars() {
        const starsContainer = document.querySelector(".stars");
        const numberOfStars = 200;

        for (let i = 0; i < numberOfStars; i++) {
          const star = document.createElement("div");
          star.className = "star";

          // Random position
          star.style.left = `${Math.random() * 100}%`;
          star.style.top = `${Math.random() * 100}%`;

          // Random animation duration
          star.style.setProperty("--duration", `${2 + Math.random() * 4}s`);

          starsContainer.appendChild(star);
        }
      }

      // Initialize stars and comets on load
      createStars();
      createComets();