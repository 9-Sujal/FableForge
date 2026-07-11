import { Input } from "@heroui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";

export default function SearchForm()  {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

//   const handleSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
//     evt.preventDefault();
//     if (query.trim().length >= 3) navigate("/search?title=" + query);
//     else toast.error("Invalid search query!");
//   };
const handleSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
  evt.preventDefault();

 if (query.trim().length >= 3) navigate("/search?title=" + query);
    else toast.error("Invalid search query!");
};

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <Input
        variant="bordered"
        placeholder="Search your book..."
        endContent={
          <button className="focus:outline-none" type="submit">
            <IoMdSearch size={24} />
          </button>
        }
        className="w-full"
        value={query}
        onChange={({ target }) => setQuery(target.value)}
      />
    </form>
  );
};
