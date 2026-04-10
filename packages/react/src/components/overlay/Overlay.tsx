import { ReactNode, useState, useEffect } from "react";
import { createPortal } from "react-dom";

type OverlayPortalProps = {
  children: ReactNode;
  freezeNavigation?: boolean;
};

let freezeCount = 0;

function getOrCreateRoot(): HTMLElement {
  let root = document.getElementById("overlay-root");
  if (!root) {
    root = document.createElement("div");
    root.setAttribute("id", "overlay-root");
    document.body.appendChild(root);
  }
  return root;
}

function applyFreezeStyles(root: HTMLElement) {
  document.body.style.overflow = "hidden";
  root.style.position = "fixed";
  root.style.width = "100%";
  root.style.height = "100%";
  root.style.top = "0";
  root.style.left = "0";
  root.style.zIndex = "999";
  root.style.pointerEvents = "auto";
}

function removeFreezeStyles(root: HTMLElement) {
  document.body.style.overflow = "unset";
  root.style.position = "";
  root.style.width = "";
  root.style.height = "";
  root.style.top = "";
  root.style.left = "";
  root.style.zIndex = "";
  root.style.pointerEvents = "none";
}

function removeRootIfEmpty(root: HTMLElement) {
  if (root.parentNode && !root.children.length) {
    root.parentNode.removeChild(root);
  }
}

export const Overlay = ({ children, freezeNavigation }: OverlayPortalProps) => {
  const [overlayRoot, setOverlayRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const root = getOrCreateRoot();

    if (freezeNavigation) {
      freezeCount++;
      if (freezeCount === 1) {
        applyFreezeStyles(root);
      }
    } else {
      if (freezeCount === 0) {
        root.style.pointerEvents = "none";
      }
    }

    setOverlayRoot(root);

    return () => {
      if (freezeNavigation) {
        freezeCount--;
        if (freezeCount === 0) {
          removeFreezeStyles(root);
        }
      }
      removeRootIfEmpty(root);
    };
  }, [freezeNavigation]);

  if (!overlayRoot) return null;
  return <>{createPortal(children, overlayRoot)}</>;
};
