
import useAuth from "../hooks/useAuth";
import { Avatar, Button } from "@heroui/react"
import { Navigate, useNavigate, Link } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";
import AuthorPublicationTable from "../components/AuthorPublicationTable";

export default function Profile() {
   const navigate = useNavigate();
  const { profile } = useAuth();

  if (!profile) return <Navigate to="/sign-up" />;

  const { role, avatar } = profile;

  const isAuthor = role === "author";

  return (
   
    <div className="relative min-h-screen overflow-hidden transition-colors duration-500
                    bg-[#f8fafc] text-slate-900
                    dark:bg-[#030303] dark:text-slate-100">
 
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] h-96 w-96 rounded-full
                        bg-blue-500/10 blur-[120px] dark:bg-cyan-500/20" />
        <div className="absolute -bottom-[10%] -left-[10%] h-96 w-96 rounded-full
                        bg-purple-500/10 blur-[120px] dark:bg-indigo-500/20" />
      </div>
 
      <div className="relative z-10 max-w-4xl mx-auto px-5 py-10 space-y-10">
 
        <div className="rounded-2xl border border-black/5 dark:border-white/10
                        bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6
                        flex items-center md:flex-row flex-col gap-5">
 
          <div className="relative">
            <div className="absolute inset-0 rounded-md blur-xl bg-cyan-500/20 dark:bg-cyan-500/30" />
            <Avatar
              src={avatar}
              className="relative md:w-20 md:h-20 w-16 h-16 ring-2 ring-white/40 dark:ring-white/10"
              radius="sm"
              name={profile?.name}
            />
          </div>
 
          <div className="flex-1 text-center md:text-left">
            <p className="md:text-xl text-base font-bold">{profile.name}</p>
            <p className="md:text-base text-sm text-slate-500 dark:text-slate-400 truncate">
              {profile.email}
            </p>
 
            <div className="flex justify-center md:justify-start items-center gap-3 mt-1">
              <p className="text-sm">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                                 bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300">
                  {profile.role.toUpperCase()}
                </span>
              </p>
 
              {!isAuthor ? (
                <Link
                  className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
                  to="/author-registration"
                >
                  Become an Author
                </Link>
              ) : (
                <Link
                  className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
                  to="/update-author"
                >
                  Update Author Bio
                </Link>
              )}
            </div>
          </div>
 
          <Button
            onPress={() => navigate("/update-profile")}
            className="md:ml-auto bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"
            variant="flat"
            isIconOnly
            radius="lg"
          >
            <BsPencilSquare size={18} />
          </Button>
        </div>
 
        <div className="h-px w-full bg-linear-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
 
        <AuthorPublicationTable visible={isAuthor} authorId={profile.authorId} />
      </div>
    </div>
     );
};
