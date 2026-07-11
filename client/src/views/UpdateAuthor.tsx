import { useEffect, useState } from "react";
import type { AuthorInfo, InitialState } from "../components/common/AuthorForm";
import useAuth from "../hooks/useAuth";
import client from "../api/client";
import { toast } from "react-hot-toast";
import { parseError } from "../utils/helper";
import LoadingSpinner from "../components/common/LoadingSpinner";
import AuthorForm from "../components/common/AuthorForm";


export default function UpdateAuthor() {
   const [busy, setBusy] = useState(true);
  const [profileInfo, setProfileInfo] = useState<InitialState>();
  const { profile } = useAuth();

  const handleSubmit = async (data: AuthorInfo) => {
    const res = await client.patch("/author", data);
    if (res.data) {
      toast.success(res.data.message);
    }
  };

  useEffect(() => {
    const fetchAuthorInfo = async () => {
      try {
        const { data } = await client.get(`/author/${profile?.authorId}`);
        setProfileInfo(data);
      } catch (error) {
        parseError(error);
      } finally {
        setBusy(false);
      }
    };

    fetchAuthorInfo();
  }, [profile?.authorId]);

  if (busy) return <LoadingSpinner />;

  return (
    <AuthorForm
      onSubmit={handleSubmit}
      initialState={profileInfo}
      btnTitle="Update Bio"
    />
  );
};
