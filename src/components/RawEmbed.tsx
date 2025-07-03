import React, { useEffect, useRef } from "react";

export default function RawEmbed({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Optionally, re-run third-party JS here if needed
    // Example for Twitter:
    // if (window.twttr && window.twttr.widgets) {
    //   window.twttr.widgets.load(ref.current);
    // }
  }, []);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: code }} />;
} 