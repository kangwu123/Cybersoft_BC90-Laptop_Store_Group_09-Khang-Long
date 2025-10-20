(() => {
  // Back to Top enhanced visibility logic
  const backTop = document.querySelector(".js-cd-top");
  const scrollThreshold = 300; // Show button after scrolling this many pixels
  let isScrolling = false;

  if (!backTop) return;

  const checkScrollPosition = () => {
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(() => {
        const scrollPosition =
          window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );

        // Show the button when scrolled down AND not at the bottom
        const isNotAtBottom =
          documentHeight - (scrollPosition + windowHeight) > 50;

        if (scrollPosition > scrollThreshold && isNotAtBottom) {
          backTop.classList.add("cd-top--is-visible");
          backTop.classList.remove("cd-top--fade-out");
        } else {
          backTop.classList.remove("cd-top--is-visible");
          backTop.classList.add("cd-top--fade-out");
        }

        isScrolling = false;
      });
    }
  };

  // Smooth scroll to top
  const scrollToTop = (duration = 700) => {
    const start = window.scrollY || document.documentElement.scrollTop;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth deceleration
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      window.scrollTo(0, start * (1 - easeOut(progress)));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Event Listeners
  window.addEventListener("scroll", checkScrollPosition, { passive: true });
  window.addEventListener("resize", checkScrollPosition, { passive: true });

  backTop.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToTop();
  });

  // Initial check
  checkScrollPosition();
})();
