import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import AuthContext from "@/context/authContext";
import {
  changeMyPassword,
  getMyProfile,
  updateMyProfile,
} from "@/services/api/user";
import ProviderProfileCompanyDetails from "./ProviderProfileCompanyDetails";
import ProviderProfileContact from "./ProviderProfileContact";
import ProviderProfileHero from "./ProviderProfileHero";
import ProviderProfileSecurity from "./ProviderProfileSecurity";

export default function ProviderProfile() {
  const [profile, setProfile] = useState(null);
  const { syncUserProfile } = useContext(AuthContext);

  const loadProfile = async () => {
    try {
      const response = await getMyProfile();
      setProfile(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load profile.");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async (payload) => {
    try {
      const response = await updateMyProfile(payload);
      const updatedProfile = response.data.data;
      setProfile(updatedProfile);
      syncUserProfile(updatedProfile);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update profile.");
      throw error;
    }
  };

  const handleChangePassword = async (payload) => {
    try {
      await changeMyPassword(payload);
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to change password.",
      );
      throw error;
    }
  };

  return (
    <div className="relative overflow-hidden text-on-surface">
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary-fixed-dim/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-10 h-72 w-72 rounded-full bg-tertiary-fixed/20 blur-3xl" />

      <main className="mx-auto w-full max-w-6xl space-y-10 pb-10">
        <ProviderProfileHero
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
        />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 space-y-6 lg:col-span-7">
            <ProviderProfileCompanyDetails profile={profile} />
          </div>

          <div className="col-span-12 space-y-6 lg:col-span-5">
            <ProviderProfileContact profile={profile} />
            <ProviderProfileSecurity onChangePassword={handleChangePassword} />
          </div>
        </div>
      </main>
    </div>
  );
}
