import React, { useCallback, useEffect, useMemo, useState } from "react";
import FilterSelect from "./FilterSelect";
import UserDataGrid from "./UserDataGrid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ShieldAlert, Sparkles } from "lucide-react";
import PageHero from "@/components/shared/page-hero";
import {
  deleteAdminUser,
  getAdminUsers,
  updateAdminUserStatus,
} from "@/services/api/admin";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import usePaginationScroll from "@/hooks/usePaginationScroll";

const formatRole = (role) =>
  String(role || "TRAVELER")
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());

const formatStatus = (status) =>
  String(status || "PENDING")
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const UserManagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    role: "all",
    status: "all",
    dateRange: "all",
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);

  const mappedUsers = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        name: user.fullName || user.email,
        email: user.email,
        role: formatRole(user.role),
        status: formatStatus(user.accountStatus),
        date: formatDate(user.createdAt),
        avatar: user.avatarUrl,
      })),
    [users],
  );

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers(filters);
      setUsers(res.data?.data?.users || []);
      setPagination(
        res.data?.data?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cannot load users");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setFilters((current) =>
      current.search === urlSearch
        ? current
        : { ...current, search: urlSearch, page: 1 },
    );
  }, [searchParams]);

  const handleFilterChange = (nextFilters) => {
    setFilters((current) => ({ ...current, ...nextFilters }));
    if (Object.prototype.hasOwnProperty.call(nextFilters, "search")) {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        if (String(nextFilters.search || "").trim()) {
          next.set("search", String(nextFilters.search).trim());
        } else {
          next.delete("search");
        }
        return next;
      }, { replace: true });
    }
  };

  const handlePageChange = (page) => {
    setFilters((current) => ({ ...current, page }));
  };

  usePaginationScroll([filters.page]);

  const handleUpdateStatus = async (id, accountStatus) => {
    try {
      await updateAdminUserStatus(id, accountStatus);
      toast.success("User status updated");
      await loadUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cannot update user status");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteAdminUser(id);
      toast.success("User deleted");
      await loadUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cannot delete user");
    }
  };

  return (
    <div className="pt-24 pb-12 max-w-[1600px] mx-auto space-y-8">
      <PageHero
        eyebrow="Identity Control"
        heading={
          <>
            User{" "}
            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
              Management
            </span>
          </>
        }
        description="Manage traveler, provider, and admin accounts with clearer filtering, moderation actions, and lifecycle controls."
      />
      <FilterSelect filters={filters} onFilterChange={handleFilterChange} />

      <UserDataGrid
        users={mappedUsers}
        pagination={pagination}
        loading={loading}
        onPageChange={handlePageChange}
        onUpdateStatus={handleUpdateStatus}
        onDeleteUser={handleDeleteUser}
      />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-8 flex flex-col justify-between h-full">
            <div className="flex items-center gap-3 mb-4 text-teal-600">
              <TrendingUp className="h-5 w-5" />
              <p className="text-[11px] font-bold uppercase tracking-wider">
                User Growth
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">Live</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Loaded from admin user records
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-8 flex flex-col justify-between h-full">
            <div className="flex items-center gap-3 mb-4 text-orange-600">
              <ShieldAlert className="h-5 w-5" />
              <p className="text-[11px] font-bold uppercase tracking-wider">
                Moderation
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                {pagination.total}
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Total matching users
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-3xl bg-teal-900 border-none text-white md:col-span-2 shadow-lg">
          <CardContent className="p-8 relative z-10 h-full flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-60">
                Account Lifecycle
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                Activate, ban, restore, or remove users
              </h2>
            </div>
            <div className="mt-6">
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl text-xs font-bold px-6 h-10 shadow-none"
              >
                Admin Controls Active
              </Button>
            </div>
          </CardContent>

          <Sparkles className="absolute -right-6 -bottom-6 size-40 text-white opacity-10 rotate-12" />
        </Card>
      </section>
    </div>
  );
};

export default UserManagementPage;
