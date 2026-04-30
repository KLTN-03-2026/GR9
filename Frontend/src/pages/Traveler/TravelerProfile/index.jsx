import { useContext, useEffect, useState } from "react";
import {
  changeMyPassword,
  getMyProfile,
  updateMyProfile,
} from "@/services/api/user";
import AuthContext from "@/context/authContext";
import toast from "react-hot-toast";

import TravelerProfileDetails from "./TravelerProfileDetails";
import TravelerProfileHeader from "./TravelerProfileHeader";
import TravelerSecurity from "./TravelerSecurity";
import TravelerStats from "./TravelerStats";

export default function TravelerProfile() {
  const [profile, setProfile] = useState(null);
  const { syncUserProfile } = useContext(AuthContext);

  const loadProfile = async () => {
    try {
      const response = await getMyProfile();
      setProfile(response.data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to load profile.",
      );
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
      toast.error(
        error?.response?.data?.message || "Unable to update profile.",
      );
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
    <div className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <TravelerProfileHeader
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
        />
        <TravelerStats />

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <TravelerProfileDetails profile={profile} />
          </div>
          <div className="space-y-6 lg:col-span-5">
            <TravelerSecurity onChangePassword={handleChangePassword} />
          </div>
        </div>
      </div>
    </div>
  );
}
