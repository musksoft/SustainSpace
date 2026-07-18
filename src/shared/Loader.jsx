import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const t1 = gsap.timeline({
        delay: 0.3,
        defaults: { ease: "hop" },
        onComplete: () => {
          setHide(true);
          onComplete?.();
        },
      });

      const counts = document.querySelectorAll(".count");

      counts.forEach((count, index) => {
        const digits = count.querySelectorAll(".digit h1");

        t1.to(digits, { y: "0%", duration: 1, stagger: 0.075 }, index * 1);

        if (index < counts.length) {
          t1.to(
            digits,
            { y: "-100%", duration: 1, stagger: 0.075 },
            index * 1 + 1
          );
        }
      });

      t1.to(".spinner", { opacity: 0, duration: 0.3 });
      t1.to(".word h1", { y: "0%", duration: 1 }, "<");

      t1.to(".divider", {
        scaleY: 1,
        duration: 1,
        onComplete: () =>
          gsap.to(".divider", { opacity: 0, duration: 0.4 }),
      });

      t1.to("#word-1 h1", { y: "100%", duration: 1 });
      t1.to("#word-2 h1", { y: "-100%", duration: 1 }, "<");

      t1.to(".block", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
      });
    }, loaderRef);

    return () => ctx.revert();
  }, []);

  if (hide) return null;

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[9999] bg-black">
      <div className="loader">
        <div className="overlay">
          <div className="block"></div>
          <div className="block"></div>
        </div>

        <div className="intro-logo">
          <div className="word" id="word-1">
            <h1>
              <span>Sustain</span>
            </h1>
          </div>
          <div className="word" id="word-2">
            <h1>Space</h1>
          </div>
        </div>

        <div className="divider"></div>

        <div className="spinner-container">
          <div className="spinner"></div>
        </div>

        <div className="counter">
          <div className="count">
            <div className="digit"><h1>0</h1></div>
            <div className="digit"><h1>2</h1></div>
          </div>
          <div className="count">
            <div className="digit"><h1>2</h1></div>
            <div className="digit"><h1>7</h1></div>
          </div>
        </div>
      </div>
    </div>
  );
}