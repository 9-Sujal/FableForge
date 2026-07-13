import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import client from "../api/client";
import { debounce, parseError } from "../utils/helper";
import EpubReader from "../components/reader";

interface BookAPIRes {
  settings: Settings;
  url: string;
}

type Highlight = {
  selection: string;
  fill: string;
};

type Settings = {
  highlights: Highlight[];
  lastLocation: string;
};

const updateLastLocation = (bookId: string, lastLocation: string) => {
  client.post("/history", {
    bookId,
    lastLocation,
    remove: false,
  });
};

const debounceUpdateLastLocation = debounce(updateLastLocation, 500);

export default function ReadingPage() {
  const [url, setUrl] = useState("");
  const [settings, setSettings] = useState<Settings>({
    highlights: [],
    lastLocation: "",
  });
  const { slug } = useParams();
  const [searchParam] = useSearchParams();
  const title = searchParam.get("title");
  const bookId = searchParam.get("id");

  const handleOnHighlightSelection = (data: Highlight) => {
    try {
      setSettings(prev => ({ ...prev, highlights: [...prev.highlights, data] }));
      client.post("/history", {
        bookId,
        highlights: [data],
        remove: false,
      });
    } catch (error) {
      parseError(error);
    }
  };

  const handleOnHighlightClear = (cfi: string) => {
    try {
      const newHighlights = settings.highlights.filter(
        (item) => item.selection !== cfi
      );

      setSettings(prev => ({ ...prev, highlights: newHighlights }));
      client.post("/history", {  
        bookId,
        highlights: [{ selection: cfi, fill: "" }],
        remove: true,
      });
    } catch (error) {
      parseError(error);
    }
  };
const bookIdRef = useRef(bookId);
useEffect(() => {
  bookIdRef.current = bookId;
}, [bookId]);
  const handleLocationChanged = useCallback(
    (location: string) => {
      try {
        if (bookIdRef.current) debounceUpdateLastLocation(bookIdRef.current, location);
      } catch (error) {
        parseError(error);
      }
    },
    []
  );

  const urlRef = useRef(""); 
  useEffect(() => {
    if (!slug || urlRef.current) return;

    const fetchBookUrl = async () => {
      try {
        const { data } = await client.get<BookAPIRes>(`/book/read/${slug}`);
       
        urlRef.current = data.url;
        setUrl(data.url);
        setSettings(data.settings);
       
      } catch (error) {
        parseError(error);
      }
    };

    fetchBookUrl();
  }, [slug]);

  return (
   
      <EpubReader
        url={url}
        title={title || ""}
        highlights={settings.highlights}
        lastLocation={settings.lastLocation}
        onHighlight={handleOnHighlightSelection}
        onHighlightClear={handleOnHighlightClear}
        onLocationChanged={handleLocationChanged}
      />
   
  );
};

