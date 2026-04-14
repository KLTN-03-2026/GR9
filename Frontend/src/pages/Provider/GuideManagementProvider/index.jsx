import React, { use, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DialogGuide from "./DialogGuide";
import toast from "react-hot-toast";
import { createGuide, getGuides } from "@/services/api/guide";
import TableGuide from "./TableGuide";

const GuideManagementProvider = () => {
  const [guides, setGuides] = useState([]);

  // ================= THỐNG KÊ =================

  const cards = useMemo(
    () => [
      { label: "Total Guides", value: "1" },
      { label: "Active Now", value: "1" },
      { label: "Assigned Bookings", value: "2" },
      { label: "Avg Rating", value: "4.8" },
    ],
    [],
  );

  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };
  const handleAddGuide = async () => {
    try {
      setLoading(true);
      const newGuide = await createGuide({
        fullName,
        email,
        phone,
        specialty,
        isActive,
      });
      toast.success("thêm mới thành công");
    } catch (error) {
      toast.error("Lỗi khi thêm mới guide");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    handleGetGuides();
  }, []);

  return (
    <div className="space-y-8 text-slate-900 font-sans">
      {/* HEADER */}

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 text-left">
          Guide Management
        </h2>
        <Button
          onClick={() => handleOpen()}
          className="gap-2 bg-teal-600 hover:bg-teal-700 text-white shadow-md"
        >
          <Plus className="size-4" />
          Add Guide
        </Button>
      </div>

      {/* CARDS */}
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
          <TableGuide guides={guides} />
        </div>
      </section>
      <DialogGuide
        open={open}
        onOpenChange={setOpen}
        fullName={fullName}
        email={email}
        phone={phone}
        specialty={specialty}
        isActive={isActive}
        setFullName={setFullName}
        setEmail={setEmail}
        setPhone={setPhone}
        setSpecialty={setSpecialty}
        setIsActive={setIsActive}
        loading={loading}
        handleAddGuide={handleAddGuide}
      />
    </div>
  );
};

export default GuideManagementProvider;
