"use client";

import { useState } from "react";

const VIDEO_TITLE = "I Had Everything. So Why Wasn’t I Happy?";

export default function AboutVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="about-introduction__video-frame">
      {playing ? (
        <iframe
          src="https://www.youtube-nocookie.com/embed/CSfprXiny98?autoplay=1"
          title={`${VIDEO_TITLE} — Caroline introduces You Matter (YouTube video)`}
          referrerPolicy="strict-origin-when-cross-origin"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="about-video__play"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${VIDEO_TITLE} on YouTube`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about-video-preview.jpg"
            alt=""
            width={960}
            height={540}
            loading="lazy"
          />
          <span className="about-video__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M9 6.5v11l9-5.5z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
