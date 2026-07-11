import { useDispatch } from "react-redux";
import useAuth from "../hooks/useAuth";
import client from "../api/client";
import { updateProfile } from "../store/auth";
import NewUserForm from "../components/profile/NewUserForm";


export default function UpdateProfile() {
  const dispatch = useDispatch();
  const { profile } = useAuth();

  const handleSubmit = async (formData: FormData) => {
    const { data } = await client.put("/auth/profile", formData);
    dispatch(updateProfile(data.profile));
  };

  return (
    <NewUserForm
      name={profile?.name}
      avatar={profile?.avatar}
      title="Update Profile"
      onSubmit={handleSubmit}
      btnTitle="Update Profile"
    />
  );
}
