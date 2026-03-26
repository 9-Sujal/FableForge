import { useDispatch } from "react-redux";
import useAuth from "../hooks/useAuth";

import client from "../api/client";
import { updateProfile } from "../store/auth";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import type { AuthorInfo } from "../components/common/AuthorForm";
import AuthorForm from "../components/common/AuthorForm";

export default function NewAuthorRegistration() {
 const dispatch = useDispatch();
  const { profile } = useAuth();

  const isAuthor = profile?.role === "author";

  const handleSubmit = async (data: AuthorInfo) => {
    const res = await client.post("/author/register", data);
    if (res.data) {
      dispatch(updateProfile(res.data.user));
      toast.success(res.data.message);
    }
  };

  if (isAuthor) return <Navigate to="/profile" />;

  return <AuthorForm onSubmit={handleSubmit} btnTitle="Became an Author" />;
};