import { useSearchParams, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/auth";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Verify() {
   const [searchPrams] = useSearchParams();
  const profileInfoString = searchPrams.get("profile");
  const dispatch = useDispatch();

  let navigationTarget: string | null = null;

  if (profileInfoString) {
    try {
      const profile = JSON.parse(profileInfoString);
      if (!profile.signedUp) navigationTarget = "/new-user";
      else {
        dispatch(updateProfile(profile));
        navigationTarget = "/";
      }
    } catch (error) {
        console.error(error)
        navigationTarget = "/not-found";
    }
  }

  if (navigationTarget) return <Navigate to={navigationTarget} />;
  return <LoadingSpinner />;
};