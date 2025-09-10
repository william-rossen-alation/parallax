

---

## 1. Create a React Component

Create a new file, e.g. `components/GradientText.js`:

```jsx
"use client";
import { useRef, useEffect } from "react";
import "./gradientText.css"; // CSS in separate file

export default function GradientText({ text }) {
  const containerRef = useRef(null);

  // Helper: run forward animation
  const animateForward = () => {
    const letters = containerRef.current.querySelectorAll(".letter");
    letters.forEach((letter, i) => {
      setTimeout(() => {
        letter.classList.add("active");
      }, i * 200);
    });
  };

  // Helper: run reverse animation
  const animateReverse = () => {
    const letters = containerRef.current.querySelectorAll(".letter");
    const total = letters.length;
    letters.forEach((letter, i) => {
      setTimeout(() => {
        letter.classList.remove("active");
      }, i * 200);
    });
  };

  // Build the letters when text changes
  useEffect(() => {
    const container = containerRef.current;
    container.innerHTML = ""; // clear old text

    text.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.classList.add("letter");

      // Assign gradient slice
      const percent = (i / (text.length - 1)) * 100;
      span.style.background = `linear-gradient(to right, darkorange ${percent}%, orange ${percent + 10}%)`;

      container.appendChild(span);
    });
  }, [text]);

  return (
    <div>
      <h1 id="text" ref={containerRef}></h1>

      <div className="buttons">
        <button onClick={animateForward}>Fade In (Forward)</button>
        <button onClick={animateReverse}>Fade Out (Reverse)</button>
      </div>
    </div>
  );
}
```

---

## 2. Create the CSS (`components/gradientText.css`)

```css
#text {
  font-size: 3rem;
  font-weight: bold;
  display: inline-block;
  white-space: pre; /* preserve spaces */
}

.letter {
  display: inline-block;
  background: linear-gradient(to right, darkorange, orange);
  -webkit-background-clip: text;
  background-clip: text; /* Firefox */
  -webkit-text-fill-color: black; /* start black */
  color: black;
  transition: -webkit-text-fill-color 1s ease;
}

.letter.active {
  -webkit-text-fill-color: transparent; /* reveal gradient */
  color: transparent;
}

.buttons {
  margin-top: 1rem;
}
```

---

## 3. Use it in a Page

In your Next.js app (assuming `app/` router):

```jsx
import GradientText from "@/components/GradientText";

export default function HomePage() {
  return (
    <main className="p-8">
      <GradientText text="Animate this string" />
    </main>
  );
}
```

---

## 🔑 How It Works

* The component **splits the input string into `<span>`s** and assigns each letter a slice of a linear gradient.
* Each letter starts as black (`-webkit-text-fill-color: black`).
* Adding `.active` makes it fade to transparent, revealing the gradient behind.
* Two functions:

  * `animateForward()` → black → gradient left-to-right.
  * `animateReverse()` → gradient → black right-to-left.
* Buttons are included for demo, but you could also expose these functions via props, refs, or custom triggers if you don’t want buttons.

---

👉 Do you want me to also show you how to make the **fade functions callable from the parent component** (e.g. trigger forward/reverse from anywhere in your app), instead of just having buttons inside the component?
