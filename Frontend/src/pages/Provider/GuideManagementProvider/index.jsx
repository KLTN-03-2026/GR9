import React, { useMemo, useState } from "react";
import { Plus, PencilLine, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const createId = () => `guide_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const emptyGuideForm = {
  name: "",
  specialty: "",
  email: "",
  phone: "",
  bookingTitle: "",
  bookingCode: "",
  status: "active",
  avatar: "",
};

const GuideManagementProvider = () => {
  // ================= STATE DỮ LIỆU =================
  const [guides, setGuides] = useState([
    {
      id: "tran-thi-mai-chau",
      name: "Tran Thi Mai Chau",
      specialty: "Coastal & culture operations",
      email: "chau.tran@voyager.vn",
      phone: "+84 905 987 654",
      bookingTitle: "Da Nang 3D2N: Coastal Elegance",
      bookingCode: "VGR-240330-DN",
      status: "active",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0BfviMsRmGSM1xnCOiLAjEB-Xdb5zdVkaJer9i8EJDmcHyk3B_cx3NNEUzYZx5eeXLb3knh4GSyKV1fU2pKt6dX7NkkJOM-qqssY1oLkNGpRLgm3AiSVVcnGdAVSqgMJeL-mStHglR2Rc9V12kuRO9iwN7ZjrDqchBTD7BWXOm-mCLk6H7Q8mnXUOH5vIX9avqy2wQ7x_g34-VVu4BanY1QQ1qVm-2_PkEjdf_nz1PHmI3pTuP8jQkRkJa9qDZRvYGjv8ySp5VHSG",
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
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmFH0khJGsP3WF6jo0oP4Up6txGVXUjwbxkoBRe2qFZ9NP8n_B-_80zR4xgC-vwZ_xJe2jD3yxC9KW8cyn8HuxuY-m-ekx94ordv9ow5y-sDLRAdBGsB-OC2Uyyau8cibT2F0jzjHlYpzF_nMlW7A_kIkMB_qLguTW_xUfzNx7x_eMdw7YkJmmZ7pgRU7wmfY_PAl3VPBTX6JWkhI3N348TMBzsWN7E0IK29Nx4-CbsyPt-G-lE2US0DWxwyFKjDAQaxsbtZOU1-zk",
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
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjmyV2fEdfowObNUQEdEUCUjeAXT79-_C1jZFWRB2e808-3tfGL8OV3UZfpYigH8sBJeWe0C2e3P1qLxDCO3yK0XTt0uNcvOGtejqDTA6iXikPbUpa_Ov0qZ8nEKDCNhqX_NSvoRSK-sQTzgMTEaIeitqPG-OO3E1RqoYPLIMkw8pL0O56WtrqhWKVtkf0K9TxW89oGMhxYUmy8ubas4ZLOLKTQoJw0RZsUtFqYwdXmhDagMfIONiDIwWBhSWQXZB_tYDq7xio3vl6",
    },
  ]);

  // ================= THỐNG KÊ =================
  const totalGuides = guides.length;
  const activeNow = useMemo(() => guides.filter((g) => g.status === "active").length, [guides]);
  const assignedBookings = activeNow; 

  const cards = useMemo(
    () => [
      { label: "Total Guides", value: String(totalGuides) },
      { label: "Active Now", value: String(activeNow) },
      { label: "Assigned Bookings", value: String(assignedBookings) },
      { label: "Avg Rating", value: "4.8" },
    ],
    [activeNow, assignedBookings, totalGuides]
  );

  // ================= QUẢN LÝ DIALOG =================
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [guideForm, setGuideForm] = useState(emptyGuideForm);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ================= HÀM XỬ LÝ =================
  const openCreate = () => {
    setFormMode("create");
    setEditingId(null);
    setGuideForm(emptyGuideForm);
    setFormOpen(true);
  };

  const openEdit = (id) => {
    const target = guides.find((g) => g.id === id);
    if (!target) return;
    setFormMode("edit");
    setEditingId(id);
    setGuideForm({ ...target });
    setFormOpen(true);
  };

  // Hàm xử lý Upload File Ảnh cực xịn
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tạo một URL tạm thời từ file ảnh trong máy mày
      const imageUrl = URL.createObjectURL(file);
      setGuideForm((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const payload = {
      ...guideForm,
      name: guideForm.name.trim(),
      email: guideForm.email.trim(),
      phone: guideForm.phone.trim(),
      specialty: guideForm.specialty.trim(),
      bookingTitle: guideForm.bookingTitle.trim(),
      bookingCode: guideForm.bookingCode.trim(),
      // Nếu đéo upload ảnh thì tự lấy chữ cái đầu làm avatar
      avatar: guideForm.avatar.trim() || "https://ui-avatars.com/api/?name=" + guideForm.name.charAt(0),
    };

    if (!payload.name || !payload.email) return;

    if (formMode === "create") {
      setGuides((prev) => [{ ...payload, id: createId() }, ...prev]);
    } else if (formMode === "edit" && editingId) {
      setGuides((prev) => prev.map((g) => (g.id === editingId ? { ...g, ...payload } : g)));
    }
    setFormOpen(false);
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    setGuides((prev) => prev.filter((g) => g.id !== deleteId));
    setDeleteOpen(false);
    setDeleteId(null);
  };

  const deletingGuide = guides.find((g) => g.id === deleteId);

  return (
    <div className="space-y-8 text-slate-900 font-sans">
      
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 text-left">
  Guide Management
</h2>
        <Button onClick={openCreate} className="gap-2 bg-teal-600 hover:bg-teal-700 text-white shadow-md">
          <Plus className="size-4" />
          Add Guide
        </Button>
      </div>

      {/* CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
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
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Guide</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Contact Info</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Assigned Booking</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-100">
              {guides.map((g) => {
                const statusClasses =
                  g.status === "active"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-500 border border-slate-200";

                return (
                  <TableRow key={g.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 shrink-0">
                          <img alt={g.name} className="w-full h-full object-cover" src={g.avatar} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{g.name}</p>
                          <p className="text-xs text-slate-500">{g.specialty}</p>
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
                        <p className="font-semibold text-slate-900">{g.bookingTitle}</p>
                        <p className="text-slate-500 text-xs mt-1">{g.bookingCode}</p>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${statusClasses}`}>
                        {g.status}
                      </span>
                    </TableCell>

                    <TableCell className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(g.id)} className="text-slate-500 hover:text-teal-600 bg-slate-50">
                          <PencilLine className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDelete(g.id)} className="text-slate-500 hover:text-red-600 bg-slate-50">
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

      {/* ================= DIALOG: THÊM / SỬA ================= */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-slate-900">
              {formMode === "create" ? "Add New Guide" : "Edit Guide"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {formMode === "create" ? "Fill in the details to add a new guide to your roster." : "Update the guide's information below."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitForm} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600">Guide Name</label>
                <Input 
                  className="text-slate-900 bg-slate-50 border-slate-200 focus-visible:ring-teal-500"
                  value={guideForm.name} 
                  onChange={(e) => setGuideForm({ ...guideForm, name: e.target.value })} 
                  placeholder="e.g. Tran Thi Mai Chau" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600">Specialty</label>
                <Input 
                  className="text-slate-900 bg-slate-50 border-slate-200 focus-visible:ring-teal-500"
                  value={guideForm.specialty} 
                  onChange={(e) => setGuideForm({ ...guideForm, specialty: e.target.value })} 
                  placeholder="e.g. Coastal operations" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600">Email</label>
                <Input 
                  className="text-slate-900 bg-slate-50 border-slate-200 focus-visible:ring-teal-500"
                  type="email" 
                  value={guideForm.email} 
                  onChange={(e) => setGuideForm({ ...guideForm, email: e.target.value })} 
                  placeholder="e.g. guide@voyager.vn" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600">Phone</label>
                <Input 
                  className="text-slate-900 bg-slate-50 border-slate-200 focus-visible:ring-teal-500"
                  value={guideForm.phone} 
                  onChange={(e) => setGuideForm({ ...guideForm, phone: e.target.value })} 
                  placeholder="+84..." 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600">Booking Title</label>
                <Input 
                  className="text-slate-900 bg-slate-50 border-slate-200 focus-visible:ring-teal-500"
                  value={guideForm.bookingTitle} 
                  onChange={(e) => setGuideForm({ ...guideForm, bookingTitle: e.target.value })} 
                  placeholder="Current assignment" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600">Booking Code</label>
                <Input 
                  className="text-slate-900 bg-slate-50 border-slate-200 focus-visible:ring-teal-500"
                  value={guideForm.bookingCode} 
                  onChange={(e) => setGuideForm({ ...guideForm, bookingCode: e.target.value })} 
                  placeholder="VGR-..." 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600">
                  Status
                </label>
                <Select
                  value={guideForm.status}
                  onValueChange={(value) =>
                    setGuideForm({ ...guideForm, status: value })
                  }
                >
                  <SelectTrigger className="h-10 w-full border-slate-200 bg-slate-50 text-slate-900 focus-visible:ring-teal-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600">Upload Avatar</label>
                {/* ĐÂY CHÍNH LÀ NÚT CHỌN FILE UPLOAD ẢNH */}
                <Input 
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="text-slate-900 bg-slate-50 border-slate-200 focus-visible:ring-teal-500 cursor-pointer file:text-teal-600 file:font-semibold file:bg-teal-50 file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-3"
                />
              </div>
            </div>

            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button" className="text-slate-700 border-slate-300 hover:bg-slate-100">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white shadow-md">
                {formMode === "create" ? "Create Guide" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= DIALOG: XÓA ================= */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-red-700 text-xl font-extrabold">
              Delete Guide?
            </DialogTitle>
            <DialogDescription className="text-slate-600 mt-2">
              {deletingGuide
                ? `Are you sure you want to permanently delete "${deletingGuide.name}"? This action cannot be undone.`
                : "Are you sure you want to delete this guide?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button" className="text-slate-700 border-slate-300 hover:bg-slate-100">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              type="button"
              onClick={confirmDelete}
              className="bg-red-700 text-white font-extrabold hover:bg-red-800 focus-visible:ring-red-500"
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default GuideManagementProvider;