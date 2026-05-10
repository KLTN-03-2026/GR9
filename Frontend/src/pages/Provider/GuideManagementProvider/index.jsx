import React, { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import DialogGuide from "./DialogGuide";
import toast from "react-hot-toast";
import {
  createGuide,
  deleteGuideById,
  getGuides,
  updateGuideById,
} from "@/services/api/guide";
import { uploadImagesApi } from "@/services/api/image";
import TableGuide from "./TableGuide";
import { Input } from "@/components/ui/input";
import DialogDeleteGuide from "./DialogDeleteGuide";
import PageHero from "@/components/shared/page-hero";

const GuideManagementProvider = () => {
  const [guides, setGuides] = useState([]);
  const [searchGuide, setSearchGuide] = useState("");

  const cards = useMemo(
    () => [
      { label: "Total Guides", value: guides.length },
      {
        label: "Active Now",
        value: guides.filter((guide) => guide.isActive).length,
      },
      {
        label: "Assigned Tours",
        value: guides.reduce((total, guide) => total + (guide.assignedTourCount || 0), 0),
      },
      {
        label: "Active Bookings",
        value: guides.reduce((total, guide) => total + (guide.activeBookingCount || 0), 0),
      },
    ],
    [guides],
  );

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [gender, setGender] = useState("OTHER");
  const [loading, setLoading] = useState(false);
  const [debounced, setDebounced] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [title, setTitle] = useState("");
  const [guideId, setGuideId] = useState("");

  const checkAvatar = () => {
    if (avatarUrl) {
      return avatarUrl;
    }

    if (gender === "OTHER") {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuD0BfviMsRmGSM1xnCOiLAjEB-Xdb5zdVkaJer9i8EJDmcHyk3B_cx3NNEUzYZx5eeXLb3knh4GSyKV1fU2pKt6dX7NkkJOM-qqssY1oLkNGpRLgm3AiSVVcnGdAVSqgMJeL-mStHglR2Rc9V12kuRO9iwN7ZjrDqchBTD7BWXOm-mCLk6H7Q8mnXUOH5vIX9avqy2wQ7x_g34-VVu4BanY1QQ1qVm-2_PkEjdf_nz1PHmI3pTuP8jQkRkJa9qDZRvYGjv8ySp5VHSG";
    } else if (gender === "MALE") {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuCmFH0khJGsP3WF6jo0oP4Up6txGVXUjwbxkoBRe2qFZ9NP8n_B-_80zR4xgC-vwZ_xJe2jD3yxC9KW8cyn8HuxuY-m-ekx94ordv9ow5y-sDLRAdBGsB-OC2Uyyau8cibT2F0jzjHlYpzF_nMlW7A_kIkMB_qLguTW_xUfzNx7x_eMdw7YkJmmZ7pgRU7wmfY_PAl3VPBTX6JWkhI3N348TMBzsWN7E0IK29Nx4-CbsyPt-G-lE2US0DWxwyFKjDAQaxsbtZOU1-zk";
    } else if (gender === "FEMALE") {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuCjmyV2fEdfowObNUQEdEUCUjeAXT79-_C1jZFWRB2e808-3tfGL8OV3UZfpYigH8sBJeWe0C2e3P1qLxDCO3yK0XTt0uNcvOGtejqDTA6iXikPbUpa_Ov0qZ8nEKDCNhqX_NSvoRSK-sQTzgMTEaIeitqPG-OO3E1RqoYPLIMkw8pL0O56WtrqhWKVtkf0K9TxW89oGMhxYUmy8ubas4ZLOLKTQoJw0RZsUtFqYwdXmhDagMfIONiDIwWBhSWQXZB_tYDq7xio3vl6";
    }

    return avatarUrl;
  };

  const buildGuidePayload = (nextAvatarUrl) => {
    return {
      fullName,
      email,
      phone,
      specialty,
      isActive,
      gender,
      avatarUrl: nextAvatarUrl,
    };
  };

  const resetGuideForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setSpecialty("");
    setIsActive(true);
    setGender("OTHER");
    setAvatarUrl("");
    setAvatarFile(null);
    setAvatarPreview("");
    setGuideId("");
  };

  const handleAddGuide = async () => {
    try {
      setLoading(true);
      const nextAvatarUrl = checkAvatar();
      setAvatarUrl(nextAvatarUrl);
      const response = await createGuide(buildGuidePayload(nextAvatarUrl));
      const newGuideId = response?.data?.data?._id;

      if (avatarFile && newGuideId) {
        await uploadImagesApi([avatarFile], "GUIDE", newGuideId);
      }

      toast.success("thêm mới thành công");
    } catch (error) {
      toast.error("Lỗi khi thêm mới guide");
    } finally {
      setLoading(false);
      setOpen(false);
      resetGuideForm();
      handleGetGuides();
    }
  };

  const handleUpdateGuide = async () => {
    try {
      setLoading(true);
      const nextAvatarUrl = checkAvatar();
      setAvatarUrl(nextAvatarUrl);
      await updateGuideById(guideId, buildGuidePayload(nextAvatarUrl));

      if (avatarFile) {
        await uploadImagesApi([avatarFile], "GUIDE", guideId);
      }

      toast.success("Cập nhật guide thành công");
    } catch (error) {
      toast.error("Lỗi khi cập nhật guide");
    } finally {
      setLoading(false);
      setOpen(false);
      resetGuideForm();
      handleGetGuides();
    }
  };

  const handleGetGuides = async () => {
    try {
      setLoading(true);
      const guides = await getGuides();
      setGuides(guides.data.data);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách guide");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuides = async () => {
    try {
      setLoading(true);
      await deleteGuideById(guideId);
      toast.success("Xóa guide thành công");
    } catch (error) {
      toast.error("Lỗi khi xóa guide");
    } finally {
      setLoading(false);
      setOpenDelete(false);
      handleGetGuides();
    }
  };

  const dataGuides = useMemo(() => {
    return guides.filter((guide) =>
      guide.fullName.toLowerCase().includes(searchGuide.toLowerCase()),
    );
  }, [debounced, guides]);
  const handleOpen = () => {
    resetGuideForm();
    setTitle("Add new guide");
    setOpen(true);
  };
  const handleDialogOpenChange = (nextOpen) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetGuideForm();
    }
  };
  const handleDelete = (_id) => {
    setTitle("Delete the guide");
    const guide = guides.find((guide) => guide._id === _id);
    setFullName(guide.fullName);
    setGuideId(_id);
    setOpenDelete(!openDelete);
  };
  const handleUpdate = (_id) => {
    const guide = guides.find((guide) => guide._id === _id);
    setFullName(guide.fullName);
    setEmail(guide.email);
    setPhone(guide.phone);
    setSpecialty(guide.specialty);
    setIsActive(guide.isActive);
    setGender(guide.gender);
    setAvatarUrl(guide.avatarUrl);
    setAvatarFile(null);
    setAvatarPreview(guide.avatarUrl || "");
    setGuideId(_id);
    setTitle("Update the guide");
    setOpen(true);
  };

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(avatarUrl || "");
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile, avatarUrl]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(searchGuide);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchGuide]);

  useEffect(() => {
    handleGetGuides();
  }, []);

  return (
    <div className="space-y-8 text-slate-900 font-sans">
      <PageHero
        eyebrow="Team Directory"
        heading={
          <>
            Guide{" "}
            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
              Management
            </span>
          </>
        }
        description="Review active guides, update assignments, and keep your operating team ready for upcoming departures."
        actions={
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                onChange={(e) => setSearchGuide(e.target.value)}
                placeholder="Search guides..."
                className="pl-9 h-10 rounded-xl bg-white border-none text-primary"
              />
            </div>
            <Button
              onClick={() => handleOpen()}
              className="gap-2 bg-teal-600 hover:bg-teal-700 text-white shadow-md p-5"
            >
              <Plus className="size-4" />
              Add Guide
            </Button>
          </div>
        }
      />
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {c.label}
            </p>
            <span className="text-3xl font-extrabold text-slate-900">
              {c.value}
            </span>
          </div>
        ))}
      </section>

      {/* BẢNG DỮ LIỆU */}
      <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <TableGuide
            guides={dataGuides}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          />
        </div>
      </section>
      <DialogGuide
        open={open}
        onOpenChange={handleDialogOpenChange}
        fullName={fullName}
        email={email}
        phone={phone}
        specialty={specialty}
        isActive={isActive}
        gender={gender}
        setFullName={setFullName}
        setEmail={setEmail}
        setPhone={setPhone}
        setSpecialty={setSpecialty}
        setIsActive={setIsActive}
        setGender={setGender}
        loading={loading}
        handleAddGuide={handleAddGuide}
        handleUpdateGuide={handleUpdateGuide}
        title={title}
        avatarFile={avatarFile}
        avatarPreview={avatarPreview}
        setAvatarFile={setAvatarFile}
      />

      <DialogDeleteGuide
        open={openDelete}
        onOpenChange={setOpenDelete}
        title={title}
        fullName={fullName}
        loading={loading}
        handleDeleteGuides={handleDeleteGuides}
      />
    </div>
  );
};

export default GuideManagementProvider;
