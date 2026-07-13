
import { useEffect, useState, type ChangeEventHandler } from "react";
import { parseError } from "../utils/helper";
import ErrorList from "./common/ErrorList";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  
  Input,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { genreList, genres, languageList, languages } from "../utils/data";
import { z } from "zod";
import PosterSelector from "./PosterSelector";
import RichEditor from "./rich-editor";


export interface InitialBookToUpdate {
  slug: string;
  title: string;
  status: string;
  description: string;
  genre: string;
  language: string;
  cover?: string;
  price: { mrp: string; sale: string };
  publicationName: string;
  publishedAt: string;
}

interface BookProps {
  title: string;
  submitBtnTitle: string;
  initialState?: InitialBookToUpdate;
  onSubmit(formData: FormData, file?: File | null): Promise<void>;
}

interface DefaultForm {
  file?: File | null;
  cover?: File;
  title: string;
  description: string;
  publicationName: string;
  publishedAt?: string;
  genre: string;
  language: string;
  mrp: string;
  sale: string;
  status: string;
}

const defaultBookInfo = {
  title: "",
  description: "",
  language: "",
  genre: "",
  mrp: "",
  publicationName: "",
  sale: "",
  status: "published",
};

// const parseDate = (dateString: string): Date | null => {
//   const date = new Date(dateString);
//   return Number.isNaN(date.getTime()) ? null : date;
// };

interface BookToSubmit {
  title: string;
  status: string;
  description: string;
  uploadMethod: "aws" | "local";
  language: string;
  publishedAt?: string;
  slug?: string;
  publicationName: string;
  genre: string;
  price: { mrp: number; sale: number };
  fileInfo?: { type: string; name: string; size: number };
}

const commonBookSchema = {
  title: z.string().trim().min(5, "Title must be at least 5 characters!"),
  description: z.string().trim().min(20, "Description is too short!"),
  genre: z.enum(genreList, { message: "Please select a genre!" }),
  language: z.enum(languageList, { message: "Please select a language!" }),
  publicationName: z.string().trim().min(3, "Publication name is too short!"),
  uploadMethod: z.enum(["aws", "local"], { message: "Upload method is missing!" }),
  publishedAt: z
    .string()
    .trim()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid publish date!"),
  price: z
    .object({
      mrp: z.number().positive("MRP must be greater than 0!"),
      sale: z.number().positive("Sale price must be greater than 0!").nonnegative(),
    })
    .refine((price) => price.sale <= price.mrp, {
      message: "Sale price cannot exceed MRP!",
      path: ["sale"],
    }),
};

const fileInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "File name is missing!")
    .refine((val) => val.endsWith(".epub"), "Only .epub files are allowed!"),
  type: z
    .string()
    .refine((val) => val === "application/epub+zip", "Invalid file type — only epub is accepted!"),
  size: z
    .number()
    .positive("File size must be greater than 0!")
    .max(50 * 1024 * 1024, "File size cannot exceed 50MB!"),
});

const newBookSchema = z.object({ ...commonBookSchema, fileInfo: fileInfoSchema });
const updateBookSchema = z.object({ ...commonBookSchema, fileInfo: fileInfoSchema.optional() });

// ─── Section label ────────────────────────────────────────────────────────────
const SectionLabel = ({ children }: { children: string }) => (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 h-px bg-default-200" />
    <span className="text-[10px] font-medium tracking-widest uppercase text-default-400">
      {children}
    </span>
    <div className="flex-1 h-px bg-default-200" />
  </div>
);

// ─── Field wrapper ────────────────────────────────────────────────────────────
const Field = ({ label, required, children, error }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string[] | undefined;
}) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-medium tracking-widest uppercase text-default-400">
      {label}
      {required && <span className="text-amber-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <ErrorList errors={error} />}
  </div>
);

export default function BookForm({ initialState, title, submitBtnTitle, onSubmit }: BookProps) {
  const [bookInfo, setBookInfo] = useState<DefaultForm>(defaultBookInfo);
  const [cover, setCover] = useState("");
  const [busy, setBusy] = useState(false);
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] | undefined }>();

  const handleTextChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setBookInfo({ ...bookInfo, [target.name]: target.value });
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { files, name } = target;
    if (!files) return;
    const file = files[0];
    if (name === "cover") {
      try { setCover(URL.createObjectURL(file)); }
      catch { setCover(""); }
    }
    setBookInfo({ ...bookInfo, [name]: file });
  };

  const handleBookPublish = async () => {
    setBusy(true);
    try {
      const formData = new FormData();
      const { file, cover } = bookInfo;

      if (file?.type !== "application/epub+zip") {
        return setErrors({ ...errors, file: ["Please select a valid (.epub) file."] });
      } else setErrors({ ...errors, file: undefined });

      if (cover && !cover.type.startsWith("image/")) {
        return setErrors({ ...errors, cover: ["Please select a valid poster file."] });
      } else setErrors({ ...errors, cover: undefined });

      if (cover) formData.append("cover", cover);

      const bookToSend: BookToSubmit = {
        title: bookInfo.title,
        description: bookInfo.description,
        genre: bookInfo.genre,
        language: bookInfo.language,
        publicationName: bookInfo.publicationName,
        uploadMethod: "aws",
        publishedAt: bookInfo.publishedAt,
        status: bookInfo.status,
        price: { mrp: Number(bookInfo.mrp), sale: Number(bookInfo.sale) },
        fileInfo: { name: file.name, size: file.size, type: file.type },
      };

      const result = newBookSchema.safeParse(bookToSend);
      if (!result.success) return setErrors(result.error.flatten().fieldErrors);

      if (result.data.uploadMethod === "local") formData.append("book", file);

      for (const key in bookToSend) {
        type keyType = keyof typeof bookToSend;
        const value = bookToSend[key as keyType];
        if (typeof value === "string") formData.append(key, value);
        if (typeof value === "object") formData.append(key, JSON.stringify(value));
      }

      await onSubmit(formData, file);
      setBookInfo({ ...defaultBookInfo, file: null });
      setCover("");
    } catch (error) {
      parseError(error);
    } finally {
      setBusy(false);
    }
  };

  const handleBookUpdate = async () => {
    setBusy(true);
    try {
      const formData = new FormData();
      const { file, cover } = bookInfo;

      if (file && file?.type !== "application/epub+zip") {
        return setErrors({ ...errors, file: ["Please select a valid (.epub) file."] });
      } else setErrors({ ...errors, file: undefined });

      if (cover && !cover.type.startsWith("image/")) {
        return setErrors({ ...errors, cover: ["Please select a valid poster file."] });
      } else setErrors({ ...errors, cover: undefined });

      if (cover) formData.append("cover", cover);

      const bookToSend: BookToSubmit = {
        title: bookInfo.title,
        description: bookInfo.description,
        genre: bookInfo.genre,
        language: bookInfo.language,
        publicationName: bookInfo.publicationName,
        status: bookInfo.status,
        uploadMethod: "aws",
        publishedAt: bookInfo.publishedAt,
        slug: initialState?.slug,
        price: { mrp: Number(bookInfo.mrp), sale: Number(bookInfo.sale) },
      };

      if (file) bookToSend.fileInfo = { name: file.name, size: file.size, type: file.type };

      const result = updateBookSchema.safeParse(bookToSend);
      if (!result.success) return setErrors(result.error.flatten().fieldErrors);

      if (file && result.data.uploadMethod === "local") formData.append("book", file);

      for (const key in bookToSend) {
        type keyType = keyof typeof bookToSend;
        const value = bookToSend[key as keyType];
        if (typeof value === "string") formData.append(key, value);
        if (typeof value === "object") formData.append(key, JSON.stringify(value));
      }

      await onSubmit(formData, file);
    } catch (error) {
      parseError(error);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (isForUpdate) handleBookUpdate();
    else handleBookPublish();
  };

  useEffect(() => {
    if (initialState) {
      const { title, description, language, genre, publicationName, publishedAt, price, cover, status } = initialState;
      if (cover) setCover(cover);
      setBookInfo({ title, description, language, genre, publicationName, publishedAt, mrp: price.mrp, sale: price.sale, status });
      setIsForUpdate(true);
    }
  }, [initialState]);

  return (
    <div className="min-h-screen bg-default-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <p className="text-[11px] font-medium tracking-widest uppercase text-default-400 mb-1">
            Author Dashboard
          </p>
          <h1 className="text-3xl font-serif font-medium text-default-900">{title}</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-600 border border-default-200 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-8 space-y-6">

            {/* File upload */}
            <div>
              <p className="text-[11px] font-medium tracking-widest uppercase text-default-400 mb-2">
                Book File <span className="text-amber-500">*</span>
              </p>
              <label
                htmlFor="file"
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors
                  ${errors?.file
                    ? "border-danger-300 bg-danger-50"
                    : "border-default-200 hover:border-amber-400 hover:bg-amber-50/40 dark:hover:bg-amber-900/10"
                  }`}
              >
                <div className="w-10 h-10 rounded-xl bg-default-100 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 14v2h14v-2M10 3v9M7 6l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-default-400"/>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-default-700">
                    {bookInfo.file?.name ?? "Upload your epub file"}
                  </p>
                  <p className="text-xs text-default-400 mt-0.5">.epub only · max 50MB</p>
                </div>
                <input
                  accept="application/epub+zip"
                  type="file"
                  name="file"
                  id="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <ErrorList errors={errors?.file} />
            </div>

            {/* Cover */}
            <Field label="Cover Image" error={errors?.cover}>
              <PosterSelector
                src={cover}
                name="cover"
                fileName={bookInfo.cover?.name}
                isInvalid={!!errors?.cover}
                errorMessage={<ErrorList errors={errors?.cover} />}
                onChange={handleFileChange}
                
              />
            </Field>

            <SectionLabel >Book Details</SectionLabel>

            {/* Title */}
            <Input
              type="text"
              name="title"
              isRequired
              label=""
              labelPlacement="outside"
              placeholder="Add your title here"
              variant="bordered"
              classNames={{
                label: "text-[11px] font-medium tracking-widest uppercase text-default-400",
                inputWrapper: "border-slate-200 dark:bg-zinc-900 dark:border-white hover:border-amber-400  focus-within:!border-amber-500 ",
              }}
              value={bookInfo.title}
              onChange={handleTextChange}
              isInvalid={!!errors?.title}
              errorMessage={<ErrorList errors={errors?.title} />}
            />

            {/* Description */}
            <div>
              <p className=" text-[11px] font-medium tracking-widest uppercase text-default-400 mb-1.5">
                Description <span className="text-amber-500">*</span>
              </p>
              <RichEditor
                placeholder="What is this book about? (min. 20 characters)"
                isInvalid={!!errors?.description}
                errorMessage={<ErrorList errors={errors?.description} />}
                value={bookInfo.description}
                editable
                onChange={(description) => setBookInfo({ ...bookInfo, description })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Publication name */}
              <Input
                name="publicationName"
                type="text"
                label=""
                labelPlacement="outside"
                isRequired
                placeholder="Publication Name"
                variant="bordered"
                classNames={{
                  label: "text-[11px] font-medium tracking-widest uppercase text-default-400",
                  inputWrapper: "border-default-200 dark:bg-zinc-900 dark:border-white border-1 border-dotted hover:border-amber-400  focus-within:!border-amber-500 ",
                }}
                value={bookInfo.publicationName}
                onChange={handleTextChange}
                isInvalid={!!errors?.publicationName}
                errorMessage={<ErrorList errors={errors?.publicationName} />}
              />

              {/* Publish date */}
              <div>
                <p className="text-[11px] font-medium tracking-widest uppercase text-default-400 mb-1.5">
                  Publish Date <span className="text-amber-500">*</span>
                </p>
                {/* <DatePicker<CalendarDate>
                  value={bookInfo.publishedAt ? parseDate(bookInfo.publishedAt) : null}
  onChange={(date) => {
    if (!date) return;
                    setBookInfo((prev)=> ({
                      ...prev,
                      publishedAt: date.toString(), 
                    }));
                  }}
                 
                  showMonthAndYearPickers
                  isRequired
                  variant="bordered"
                  classNames={{
                    inputWrapper: "border-default-200 hover:border-amber-400 focus-within:!border-amber-500",
                  }}
                   calendarProps={{
    classNames: {
      base: "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl rounded-xl",
    },
  }}
  popoverProps={{
    classNames: {
      content: "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl rounded-xl p-0",
    },
  }}
                  isInvalid={!!errors?.publishedAt}
                  errorMessage={<ErrorList errors={errors?.publishedAt} />}
                /> */}
                <div>

  <Input
    type="date"
    value={bookInfo.publishedAt || ""}
    onChange={(e) =>
      setBookInfo((prev) => ({
        ...prev,
        publishedAt: e.target.value,
      }))
    }
    variant="bordered"
    isRequired
    isInvalid={!!errors?.publishedAt}
    errorMessage={<ErrorList errors={errors?.publishedAt} />}
    classNames={{
      inputWrapper:
        "border-default-200 hover:border-amber-400 focus-within:!border-amber-500",
    }}
  />
</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Language */}
              <Autocomplete
                label=""
                labelPlacement="outside"
                placeholder="Language"
                defaultSelectedKey={bookInfo.language}
                selectedKey={bookInfo.language}
                variant="bordered"
                onSelectionChange={(key = "") => setBookInfo({ ...bookInfo, language: key as string })}
                isInvalid={!!errors?.language}
                errorMessage={<ErrorList errors={errors?.language} />}
                isRequired
               
  popoverProps={{
    classNames: {
      content: "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl rounded-xl",
    },
  }}
              >
                {languages.map((item) => (
                  <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
                ))}
              </Autocomplete>

              {/* Genre */}
              <Autocomplete
                label=""
                labelPlacement="outside"
                placeholder="Select a genre"
                defaultSelectedKey={bookInfo.genre}
                selectedKey={bookInfo.genre}
                variant="bordered"
                onSelectionChange={(key = "") => setBookInfo({ ...bookInfo, genre: key as string })}
                isInvalid={!!errors?.genre}
                errorMessage={<ErrorList errors={errors?.genre} />}
                isRequired
             
  popoverProps={{
    classNames: {
      content: "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl rounded-xl",
    },
  }}
              >
                {genres.map((item) => (
                  <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
                ))}
              </Autocomplete>
            </div>

            <SectionLabel>Pricing</SectionLabel>

            {/* Price */}
            <div className="bg-default-50 dark:bg-default-200/30 border border-default-200 rounded-xl p-4 space-y-3">
              <p className="text-[11px] font-medium tracking-widest uppercase text-default-400">
                Price <span className="text-amber-500">*</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="mrp"
                  type="number"
                  label="MRP"
                  labelPlacement="outside-left"
                  isRequired
                  placeholder="0.00"
                  variant="bordered"
                  classNames={{
                    label: "text-[11px] font-medium tracking-widest uppercase text-default-400",
                    inputWrapper: "border-default-200 hover:border-amber-400 focus-within:!border-amber-500",
                  }}
                  value={bookInfo.mrp}
                  onChange={handleTextChange}
                  startContent={<span className="text-default-400 text-sm">Rs.</span>}
                  isInvalid={!!errors?.price}
                />
                <Input
                  name="sale"
                  type="number"
                  label="Sale Price"
                  labelPlacement="outside-left"
                  isRequired
                  placeholder="0.00"
                  variant="bordered"
                  classNames={{
                    label: "text-[11px] font-medium tracking-widest uppercase text-default-400",
                    inputWrapper: "border-default-200 hover:border-amber-400 focus-within:!border-amber-500",
                  }}
                  value={bookInfo.sale}
                  onChange={handleTextChange}
                  startContent={<span className="text-default-400 text-sm">Rs.</span>}
                  isInvalid={!!errors?.price}
                />
              </div>
              {errors?.price && (
                <div className="px-1">
                  <ErrorList errors={errors.price} />
                </div>
              )}
            </div>

            <SectionLabel>Status</SectionLabel>

            {/* Status */}
            <RadioGroup
              value={bookInfo.status}
              onValueChange={(status) => setBookInfo({ ...bookInfo, status })}
              orientation="horizontal"
              classNames={{ wrapper: "gap-4" }}
            >
              {[
                { value: "published", label: "Published" },
                { value: "unpublished", label: "Unpublished" },
              ].map(({ value, label }) => (
                <Radio
                  key={value}
                  value={value}
                  classNames={{
                    base: `border border-default-200 rounded-xl px-4 py-3 m-0 cursor-pointer transition-colors
                      data-[selected=true]:border-amber-400 data-[selected=true]:bg-amber-50
                      dark:data-[selected=true]:bg-amber-900/10`,
                    label: "text-sm font-medium",
                  }}
                >
                  {label}
                </Radio>
              ))}
            </RadioGroup>

          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-default-100 bg-default-50/50 flex gap-3">
            <Button
              variant="bordered"
              className="border-default-200 rounded-3xl bg-red-300 dark:bg-red-500 text-default-600"
              onPress={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              isLoading={busy}
              type="submit"
              className="flex-1 bg-slate-500 dark:bg-zinc-900 dark:text-amber-50 rounded-3xl w-auto text-amber-50 font-medium"
            >
              {submitBtnTitle}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}