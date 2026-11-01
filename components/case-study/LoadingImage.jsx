"use client";

import Image from "next/image";

// next/image for CaseImage, with a loading state on its frame (the image's
// parent): `data-loading` while the file is still on its way (the frame shows
// a skeleton and the image fades in once it's there), then `data-loaded`,
// which also clears the skeleton so it can't show through transparent images.
// An image that's already complete (cached, or loaded before hydration) is
// marked loaded straight away, without a fade. Without JS nothing is marked
// and the image simply paints over the skeleton.
export default function LoadingImage({ alt, ...props }) {
  const done = (img) => {
    const frame = img.parentElement;
    if (!frame) return;
    delete frame.dataset.loading;
    frame.dataset.loaded = "";
  };

  return (
    <Image
      {...props}
      alt={alt}
      ref={(img) => {
        if (!img) return;
        if (img.complete && img.naturalWidth) done(img);
        else img.parentElement?.setAttribute("data-loading", "");
      }}
      onLoad={(event) => done(event.currentTarget)}
      onError={(event) => done(event.currentTarget)}
    />
  );
}
