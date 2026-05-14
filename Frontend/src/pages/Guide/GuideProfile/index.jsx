import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import AuthContext from "@/context/authContext";
import { getGuideDashboard } from "@/services/api/guide";
import {
  changeMyPassword,
  getMyProfile,
  updateMyProfile,
} from "@/services/api/user";
import GuideCertifications from "./GuideCertifications";
import GuideExpertise from "./GuideExpertise";
import GuideProfileHero from "./GuideProfileHero";
import GuideReviewRegion from "./GuideReviewRegion";
import GuideSecurity from "./GuideSecurity";
import GuideStats from "./GuideStats";
import { useI18n } from "@/i18n/I18nProvider";

export default function GuideProfile() {
  const { t } = useI18n();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const { syncUserProfile } = useContext(AuthContext);

  const loadProfile = async () => {
    try {
      const [profileResponse, dashboardResponse] = await Promise.all([
        getMyProfile(),
        getGuideDashboard(),
      ]);

      setProfile(profileResponse.data.data);
      setStats(dashboardResponse.data.data?.guideStats || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || t("guidePages.profile.loadError"));
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
      toast.success(t("guidePages.profile.updateSuccess"));
    } catch (error) {
      toast.error(error?.response?.data?.message || t("guidePages.profile.updateError"));
      throw error;
    }
  };

  const handleChangePassword = async (payload) => {
    try {
      await changeMyPassword(payload);
      toast.success(t("guidePages.profile.passwordSuccess"));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || t("guidePages.profile.passwordError"),
      );
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1e7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <GuideProfileHero
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
        />
        <GuideStats stats={stats} profile={profile} />

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <GuideExpertise profile={profile} />
          </div>
          <div className="space-y-6 lg:col-span-5">
            <GuideCertifications />
            <GuideSecurity onChangePassword={handleChangePassword} />
          </div>
        </div>

        <GuideReviewRegion />
      </div>
    </div>
  );
}
