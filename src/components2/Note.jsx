import { useEffect, useRef, useState } from "react";
import "./Note.css"

export default function NoteMarquee() {
  const marqueeRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);

  /* ---------------------------------------
     MOBILE MENU TOGGLE + OUTSIDE CLICK
  ----------------------------------------*/
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        menuButtonRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  /* ---------------------------------------
     MARQUEE CONTINUOUS SCROLL LOGIC
  ----------------------------------------*/
  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const TOTAL_DURATION = 120; // seconds
    const now = Date.now();

    const savedPosition = localStorage.getItem("marqueeScrollPosition");
    const savedTimestamp = localStorage.getItem("marqueeTimestamp");

    if (
      savedPosition &&
      savedTimestamp &&
      now - Number(savedTimestamp) < 5000
    ) {
      marquee.style.animation = `marquee ${TOTAL_DURATION}s linear infinite`;
      marquee.style.animationDelay = `-${Math.abs(
        Number(savedPosition)
      )}s`;
    } else {
      marquee.style.animation = `marquee ${TOTAL_DURATION}s linear infinite`;
      marquee.style.animationDelay = "0s";
    }

    marquee.style.opacity = "1";
    marquee.style.visibility = "visible";
    marquee.style.display = "inline-block";

    const interval = setInterval(() => {
      const style = window.getComputedStyle(marquee);
      const matrix = new DOMMatrixReadOnly(style.transform);
      localStorage.setItem("marqueeScrollPosition", matrix.m41);
      localStorage.setItem("marqueeTimestamp", Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------------------------------
     PAUSE / RESUME ON HOVER + CLICK
  ----------------------------------------*/
  const togglePause = () => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    marquee.style.animationPlayState =
      marquee.style.animationPlayState === "paused"
        ? "running"
        : "paused";
  };

  /* ---------------------------------------
     SMOOTH ANCHOR SCROLL
  ----------------------------------------*/
  useEffect(() => {
    const anchors = document.querySelectorAll('a[href^="#"]');

    const handleAnchorClick = (e) => {
      e.preventDefault();
      const target = document.querySelector(
        e.currentTarget.getAttribute("href")
      );
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setMenuOpen(false);
      }
    };

    anchors.forEach((a) => a.addEventListener("click", handleAnchorClick));
    return () =>
      anchors.forEach((a) =>
        a.removeEventListener("click", handleAnchorClick)
      );
  }, []);

  /* ---------------------------------------
     SAVE POSITION BEFORE UNLOAD
  ----------------------------------------*/
  useEffect(() => {
    const handleUnload = () => {
      const marquee = marqueeRef.current;
      if (!marquee) return;

      const style = window.getComputedStyle(marquee);
      const matrix = new DOMMatrixReadOnly(style.transform);

      localStorage.setItem("marqueeScrollPosition", matrix.m41);
      localStorage.setItem("marqueeTimestamp", Date.now());
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      {/* <button
        ref={menuButtonRef}
        id="mobile-menu-button"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        Menu
      </button> */}

      {/* MOBILE MENU */}
      {/* <div
        ref={menuRef}
        id="mobile-menu"
        className={menuOpen ? "" : "hidden"}
      >
        Mobile Menu Content
      </div> */}

      {/* NOTE MARQUEE */}
      <div className="note-box">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="note-wrapper">
            <div className="info-icon">i</div>

            <div className="note-content marquee-container">
              <div
                ref={marqueeRef}
                id="continuous-marquee"
                className="marquee-content scrolling-note"
                onMouseEnter={() =>
                  (marqueeRef.current.style.animationPlayState = "paused")
                }
                onMouseLeave={() =>
                  (marqueeRef.current.style.animationPlayState = "running")
                }
                onClick={togglePause}
              >
                {" "}
                {Array(9).fill(
                  "We are pleased to introduce the novice and exciting trading plateform. You can utilize your assets to the new module by staking it. Important==> Need to trade first in the new module before staking !!"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
