import React, { useRef, MutableRefObject } from "react";

type Callback = (isFull: boolean) => void;

interface UseFullscreen {
  element: MutableRefObject<HTMLDivElement | null>;
  triggerFull: () => void;
  exitFull: () => void;
}

// 벤더 프리픽스를 포함한 타입 선언
interface FullscreenDocument extends Document {
  mozCancelFullScreen?: () => Promise<void>;
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface FullscreenElement extends HTMLElement {
  mozRequestFullScreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

const useFullscreen = (callback?: Callback): UseFullscreen => {
  const element = useRef<HTMLDivElement | null>(null);

  const runCb = (isFull: boolean) => {
    if (callback && typeof callback === "function") {
      callback(isFull);
    }
  };

  const triggerFull = () => {
    const el = element.current as FullscreenElement;
    if (el) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
      runCb(true);
    }
  };

  const exitFull = () => {
    const doc = document as FullscreenDocument;
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
    runCb(false);
  };

  return { element, triggerFull, exitFull };
};

export default useFullscreen;
