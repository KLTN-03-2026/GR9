import React, { useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import DialogGuide from "./DialogGuide";
import toast from "react-hot-toast";
import { createGuide } from "@/services/api/guide";

const GuideManagementProvider = () => {
  const [guides] = useState([
    {
      id: "tran-thi-mai-chau",
      name: "Tran Thi Mai Chau",
      specialty: "Coastal & culture operations",
      email: "chau.tran@voyager.vn",
      phone: "+84 905 987 654",
      bookingTitle: "Da Nang 3D2N: Coastal Elegance",
      bookingCode: "VGR-240330-DN",
      status: "active",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD0BfviMsRmGSM1xnCOiLAjEB-Xdb5zdVkaJer9i8EJDmcHyk3B_cx3NNEUzYZx5eeXLb3knh4GSyKV1fU2pKt6dX7NkkJOM-qqssY1oLkNGpRLgm3AiSVVcnGdAVSqgMJeL-mStHglR2Rc9V12kuRO9iwN7ZjrDqchBTD7BWXOm-mCLk6H7Q8mnXUOH5vIX9avqy2wQ7x_g34-VVu4BanY1QQ1qVm-2_PkEjdf_nz1PHmI3pTuP8jQkRkJa9qDZRvYGjv8ySp5VHSG",
    },
    {
      id: "pham-my-linh",
      name: "Pham My Linh",
      specialty: "Food & luxury guest care",
      email: "linh.pham@voyager.vn",
      phone: "+84 905 000 111",
      bookingTitle: "Da Nang 3D2N: Coastal Elegance",
      bookingCode: "VGR-240330-DN",
      status: "active",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCmFH0khJGsP3WF6jo0oP4Up6txGVXUjwbxkoBRe2qFZ9NP8n_B-_80zR4xgC-vwZ_xJe2jD3yxC9KW8cyn8HuxuY-m-ekx94ordv9ow5y-sDLRAdBGsB-OC2Uyyau8cibT2F0jzjHlYpzF_nMlW7A_kIkMB_qLguTW_xUfzNx7x_eMdw7YkJmmZ7pgRU7wmfY_PAl3VPBTX6JWkhI3N348TMBzsWN7E0IK29Nx4-CbsyPt-G-lE2US0DWxwyFKjDAQaxsbtZOU1-zk",
    },
    {
      id: "le-hoang-nam",
      name: "Le Hoang Nam",
      specialty: "Adventure transfers",
      email: "nam.le@voyager.vn",
      phone: "+84 912 345 678",
      bookingTitle: "Da Nang 3D2N: Coastal Elegance",
      bookingCode: "VGR-240330-DN",
      status: "inactive",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCjmyV2fEdfowObNUQEdEUCUjeAXT79-_C1jZFWRB2e808-3tfGL8OV3UZfpYigH8sBJeWe0C2e3P1qLxDCO3yK0XTt0uNcvOGtejqDTA6iXikPbUpa_Ov0qZ8nEKDCNhqX_NSvoRSK-sQTzgMTEaIeitqPG-OO3E1RqoYPLIMkw8pL0O56WtrqhWKVtkf0K9TxW89oGMhxYUmy8ubas4ZLOLKTQoJw0RZsUtFqYwdXmhDagMfIONiDIwWBhSWQXZB_tYDq7xio3vl6",
    },
  ]);

  // ================= THỐNG KÊ =================
  const totalGuides = guides.length;
  const activeNow = useMemo(
    () => guides.filter((g) => g.status === "active").length,
    [guides],
  );
  const assignedBookings = activeNow;

  const cards = useMemo(
    () => [
      { label: "Total Guides", value: String(totalGuides) },
      { label: "Active Now", value: String(activeNow) },
      { label: "Assigned Bookings", value: String(assignedBookings) },
      { label: "Avg Rating", value: "4.8" },
    ],
    [activeNow, assignedBookings, totalGuides],
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
          <Table className="w-full text-left border-collapse">
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Guide
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Contact Info
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Assigned Booking
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-100">
              {guides.map((g) => {
                const statusClasses =
                  g.status === "active"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-500 border border-slate-200";

                return (
                  <TableRow
                    key={g.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 shrink-0">
                          <img
                            alt={g.name}
                            className="w-full h-full object-cover"
                            src={g.avatar}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{g.name}</p>
                          <p className="text-xs text-slate-500">
                            {g.specialty}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <div className="text-sm">
                        <p className="text-slate-900 font-medium">{g.email}</p>
                        <p className="text-slate-500 text-xs mt-1">{g.phone}</p>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <div className="text-sm">
                        <p className="font-semibold text-slate-900">
                          {g.bookingTitle}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          {g.bookingCode}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${statusClasses}`}
                      >
                        {g.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-500 hover:text-teal-600 bg-slate-50"
                        >
                          <PencilLine className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-500 hover:text-red-600 bg-slate-50"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
