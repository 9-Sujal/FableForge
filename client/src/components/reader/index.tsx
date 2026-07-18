import { useEffect, useState } from "react";
import type { BookNavList } from "./TableOfContents";
import { Book, Rendition} from "epubjs";
import type { ThemeModes } from "./ThemeOptions";
import type { LocationChangedEvent, RelocatedEvent } from "./types";
import { debounce } from "../../utils/helper";
import LoadingIndicator from "./LoadingIndicator";
import ThemeOptions from "./ThemeOptions";
import FontOptions from "./FontOptions";
import { Button, Link } from "@heroui/react";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import Navigator from "./Navigator";
import TableOfContents from "./TableOfContents";
import HighlightOptions from "./HighlightOptions";
import NotesModal from "./NotesModal";
import { FaBackward } from "react-icons/fa";



interface Props {
  url: string;
  title?: string;
  lastLocation?: string;
  highlights: Highlight[];
  onHighlight(data: Highlight): void;
  onLocationChanged(location: string): void;
  onHighlightClear(selection: string): void;
  
}
export type Highlight = {
  selection: string;
  fill: string;
};
const container = "epub_container";
const wrapper = "epub_wrapper";

const DARK_THEME = {
  body: {
    color: "#f8f8ea !important",
    background: "#2B2B2B !important",
  },
  a: {
    color: "#f8f8ea !important",
  },
};
const LIGHT_THEME = {
  body: {
    color: "#000 !important",
    background: "#fff !important",
  },
  a: {
    color: "blue !important",
  },
};

const selectTheme = (rendition: Rendition, mode: ThemeModes) => {
  if (mode === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }

  rendition.themes.select(mode);
};

const getElementSize = (id: string) => {
  const elm = document.getElementById(id);
  let width = 0;
  let height = 0;

  if (elm) {
    const result = elm.getBoundingClientRect();
    width = result.width;
    height = result.height;
  }

  return { width, height };
};
const filterHref = (spineHrefList: string[], href: string) => {
  const foundItem = spineHrefList.find((spineHref) => {
    const regex = new RegExp("[^/]+/([^/]+.xhtml)");
    const list = regex.exec(spineHref);
    if (list) {
      if (href.startsWith(list[1])) {
        return true;
      }
    }
  });

  return foundItem || href;
};

const loadTableOfContent = async (book: Book) => {
  const [nav, spine] = await Promise.all([
    book.loaded.navigation,
    book.loaded.spine,
  ]);

  let spineHref: string[] = [];
  if (!Array.isArray(spine)) {
    const { spineByHref } = spine as { spineByHref: { [key: string]: number } };
    const entires = Object.entries(spineByHref);
    entires.sort((a, b) => a[1] - b[1]);
    spineHref = entires.map(([key]) => key);
  }

  const { toc } = nav;

  const navLabels: BookNavList[] = [];
  toc.forEach((item) => {
    if (item.subitems?.length) {
      navLabels.push({
        label: { title: item.label, href: filterHref(spineHref, item.href) },
        subItems: item.subitems.map(({ href, label }) => {
          return {
            href: filterHref(spineHref, href),
            title: label,
          };
        }),
      });
    } else {
      navLabels.push({
        label: { title: item.label, href: filterHref(spineHref, item.href) },
        subItems: [],
      });
    }
  });

  return navLabels;
};

const applyHighlights = async (
  rendition: Rendition,
  highlights: Highlight[]
) => {
  highlights.forEach(({ selection, fill }) => {
    rendition.annotations.remove(selection, "highlight");
    rendition.annotations.highlight(
      selection,
      undefined,
      undefined,
      undefined,
      {
        fill,
      }
    );
  });
};
export default function EpubReader({ url, title, lastLocation, highlights, onHighlight, onLocationChanged, onHighlightClear }: Props) {

 const [loading, setLoading] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [locationBeforeNoteOpen, setLocationBeforeNoteOpen] = useState("");
  const [showHighlightOption, setShowHighlightOptions] = useState(false);
  const [selectedCfi, setSelectedCfi] = useState("");
  const [showToc, setShowToc] = useState(false);
  const [tableOfContent, setTableOfContent] = useState<BookNavList[]>([]);
  const [rendition, setRendition] = useState<Rendition>();
  const [book, setBook] = useState<Book | null>(null);
  const [settings, setSettings] = useState({
    fontSize: 22,
    currentLocation: "",
  });
    const [progress,setProgress]=useState(0);
const [downloaded,setDownloaded]=useState(0);
const [totalSize, setTotalSize] = useState(0);
  const [page, setPage] = useState({
    start: 0,
    end: 0,
    total: 0,
  });

  const updatePageCounts = (rendition: Rendition) => {
    const location = rendition.currentLocation() as unknown as RelocatedEvent;
    const start = location.start.displayed.page;
    const end = location.end.displayed.page;
    const total = location.start.displayed.total;
    setPage({ start, end, total });
  };

  const handleOnHighlightClear = () => {
    if (!rendition) return;

    rendition.annotations.remove(selectedCfi, "highlight");
    setShowHighlightOptions(false);
    onHighlightClear(selectedCfi);
  };

  const handleHighlightSelection = (fill: string) => {
    if (!rendition) return;

    const newHighlight = { fill, selection: selectedCfi };
    applyHighlights(rendition, [newHighlight]);
    setShowHighlightOptions(false);
    onHighlight(newHighlight);
  };

  const handleNavigation = (href: string) => {
    rendition?.display(href);
  };

  const handleThemeSelection = (mode: ThemeModes) => {
    if (!rendition) return;

    selectTheme(rendition, mode);
  };

  const handleFontSizeUpdate = (mode: "increase" | "decrease") => {
    if (!rendition) return;

    let { fontSize } = settings;
    if (mode === "increase") {
      fontSize += 2;
    } else {
      fontSize -= 2;
    }
    rendition.themes.fontSize(fontSize + "px");
    setSettings({ ...settings, fontSize });
    updatePageCounts(rendition);
  };

  const toggleToc = () => {
    setShowToc(!showToc);
  };

  const hideToc = () => {
    setShowToc(false);
  };

  const handleOnNotesClick = (path: string) => {
    if (!locationBeforeNoteOpen)
      setLocationBeforeNoteOpen(settings.currentLocation);
    handleNavigation(path);
  };

  useEffect(() => {
    if (!rendition) return;
    // basic book styling
    rendition.themes.fontSize(settings.fontSize + "px");

rendition.on("locationChanged", () => {
  if (highlights.length > 0) { // ← only run if there are highlights
    applyHighlights(rendition, highlights);
  }
});

    rendition.on("relocated", (evt: RelocatedEvent) => {
      setSettings((old) => ({ ...old, currentLocation: evt.start.cfi }));
    });
  }, [rendition, highlights, settings.fontSize]);

  useEffect(() => {
    if (!url) return;

  
  let epubBook: Book | null = null;

  const loadBook = async () => {
    try {
      setLoading(true);

      const response = await axios.get(url, {
        responseType: "arraybuffer",
        onDownloadProgress: (event) => {
          if (!event.total) return;

          setProgress(Math.round((event.loaded * 100) / event.total));
          setDownloaded(event.loaded);
          setTotalSize(event.total);
        },
      });

      epubBook = new Book(response.data);

      setBook(epubBook);

      //............................
      
    const { height, width } = getElementSize(wrapper);
    const rendition = epubBook.renderTo(container, {
      width,
      height,
    });

    if (lastLocation) rendition.display(lastLocation);
    else rendition.display();

   
    rendition.themes.register("light", LIGHT_THEME);
    rendition.themes.register("dark", DARK_THEME);

    const debounceSetShowHighlightOption = debounce(
      setShowHighlightOptions,
      3000
    );
    const debounceUpdateLoading = debounce(setLoading, 500);

    rendition.on("resized", () => {
      debounceUpdateLoading(false);
    });

  
    rendition.on("click", () => {
      hideToc();
    });

    // Let's listen to the text selection
    rendition.on("selected", (cfi: string) => {
      setShowHighlightOptions(true);
      setSelectedCfi(cfi);
      debounceSetShowHighlightOption(false);
    });

    // Let's listen to the highlight click
    rendition.on("markClicked", (cfi: string) => {
      setShowHighlightOptions(true);
      setSelectedCfi(cfi);
      debounceSetShowHighlightOption(false);
    });

    rendition.on("displayed", () => {
      updatePageCounts(rendition);
    });
    rendition.on("locationChanged", (evt: LocationChangedEvent) => {
      onLocationChanged(evt.start);
      updatePageCounts(rendition);
    });

     await loadTableOfContent(epubBook)
        .then(setTableOfContent)
        .finally(() => {
          setLoading(false);
        });

      setRendition(rendition);

      let touchStartX = 0;

      const viewer = document.getElementById(container);

      viewer?.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
      });

      viewer?.addEventListener("touchend", (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;

        if (Math.abs(diff) < 60) return;

        if (diff > 0) rendition.next();
        else rendition.prev();
      });

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  loadBook();

  return () => {
    epubBook?.destroy();
  };
}, [url, lastLocation, onLocationChanged]);

  // to handle window resize or resize the book container

  useEffect(() => {
    if (!rendition) return;

    const handleResize = () => {
      setLoading(true);

      const { height, width } = getElementSize(wrapper);
 
      rendition.resize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [rendition]);

    useEffect(() => {
    if (!rendition) return;

    const handleKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight")
            rendition.next();

        if (e.key === "ArrowLeft")
            rendition.prev();
    };

    window.addEventListener("keydown", handleKey);

    return () =>
        window.removeEventListener("keydown", handleKey);

}, [rendition]);


  return (
     <div className="h-screen overflow-hidden flex flex-col group dark:bg-book-dark dark:text-book-dark">
        <LoadingIndicator
    visible={loading}
    progress={progress}
    downloaded={downloaded}
    total={totalSize}
/>

      <div className="flex items-center h-14 shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
        <div>
            <Button className="  p-2 text-slate-950 dark:text-slate-100" >
                <Link href="/">
                    <FaBackward/>
                </Link>
            </Button>
        </div>
        <div className="max-w-3xl md:mx-auto md:pl-0 pl-5">
          <h1 className="line-clamp-1 font-semibold text-large">{title}</h1>
        </div>

        <div className="ml-auto">
          <div className="flex items-center justify-center space-x-3">
            {/* Theme Options */}
            <ThemeOptions onThemeSelect={handleThemeSelection} />
            {/* Font Options */}
            <FontOptions
              onFontDecrease={() => handleFontSizeUpdate("decrease")}
              onFontIncrease={() => handleFontSizeUpdate("increase")}
            />
            {/* Display Notes */}
            <Button
              onPress={() => setShowNotes(true)}
              variant="light"
              isIconOnly
            >
              <MdOutlineStickyNote2 size={30} />
            </Button>

            <Button onClick={toggleToc} variant="light" isIconOnly>
              <IoMenu size={30} />
            </Button>
          </div>
        </div>
      </div>

      <div id={wrapper} className="h-full relative">
        <div id={container} />

        <Navigator
          side="left"
          onClick={() => {
            rendition?.prev();
            hideToc();
          }}
          className="opacity-0 group-hover:opacity-100"
        />
        <Navigator
          side="right"
          onClick={() => {
            rendition?.next();
            hideToc();
          }}
          className="opacity-50 group-hover:opacity-200"
        />
      </div>

      <TableOfContents
        visible={showToc}
        data={tableOfContent}
        onClick={handleNavigation}
      />

      <HighlightOptions
        visible={showHighlightOption}
        onSelect={handleHighlightSelection}
        onClear={handleOnHighlightClear}
      />

      <NotesModal
        book={book}
        notes={highlights.map(({ selection }) => selection)}
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
        onNoteClick={handleOnNotesClick}
      />

  <div className="h-10 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100">
        <div className="flex-1 text-center">
          <p>Page {`${page.start} - ${page.total}`}</p>
        </div>

        {locationBeforeNoteOpen ? (
          <button
            onClick={() => {
              setLocationBeforeNoteOpen("");
              handleNavigation(locationBeforeNoteOpen);
            }}
          >
            Go to Previous Location
          </button>
        ) : null}

        {page.start === page.end ? null : (
          <div className="flex-1 text-center">
            <p>Page {`${page.end} - ${page.total}`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

