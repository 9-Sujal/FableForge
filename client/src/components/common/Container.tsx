import { Link } from "react-router-dom";
import HeadNavbar from "./Navbar";


interface Props {
  children: React.ReactNode;
}

export default function Container({ children }: Props) {
  return (

    <div className="min-h-screen max-w-5xl mx-auto flex flex-col ">
      <HeadNavbar />
      <div className="flex-1 bg-slate-300">{children} </div>
      <footer className="pb-10 px-4 text-center">
          <p>
            Made with love by{" "}
            <Link
              className="font-semibold hover:underline"
              target="_blank"
              to=""
            >
              Sujal Ghorse
            </Link>
          </p>
        </footer>
    </div>
  );
}