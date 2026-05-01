import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthContext from "@/context/authContext";
import { getMyProfile, updateMyProfile } from "@/services/api/user";
import AdminActivityLogs from "./AdminActivityLogs";
import AdminOverview from "./AdminOverview";
import AdminProfileHeader from "./AdminProfileHeader";
import AdminSecurity from "./AdminSecurity";

export default function AdminProfile() {
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

  return (
    <div className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <AdminProfileHeader
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
        />

        <Tabs defaultValue="overview" className="gap-4">
          <TabsList className="w-fit bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview profile={profile} />
          </TabsContent>

          <TabsContent value="security">
            <AdminSecurity />
          </TabsContent>

          <TabsContent value="activity">
            <AdminActivityLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
