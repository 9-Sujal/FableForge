import { Button, Spinner } from "@heroui/react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

export default function ProfileOptions() {
  const { profile, status, signOut } = useAuth();


  if (status === "busy") return <Spinner size="sm" />;

  return profile ? (
    <ProfileMenu profile={profile} signOut={signOut} />
  ) : (
    <div className="flex items-center gap-2">
      <Button as={Link} to="/sign-up" variant="bordered" size="sm">
        Sign up
      </Button>
      <Button as={Link} to="/sign-in" variant="solid" size="sm">
        Sign in
      </Button>
    </div>
  );
}