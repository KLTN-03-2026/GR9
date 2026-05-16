import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  BookOpenText,
  CalendarDays,
  Edit3,
  FileText,
  Filter,
  Gauge,
  PlusCircle,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createKnowledgeBaseDocument,
  deleteKnowledgeBaseDocument,
  getKnowledgeBaseDocuments,
  updateKnowledgeBaseDocument,
} from "@/services/api/admin";
import { cn } from "@/lib/utils";

const emptyForm = {
  title: "",
  category: "General",
  status: "published",
  sourceType: "manual",
  content: "",
};

const statusStyles = {
  published:
    "bg-teal-50 text-teal-700 ring-teal-100 dark:bg-teal-400/10 dark:text-teal-200 dark:ring-teal-300/25",
  draft:
    "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10",
  needs_review:
    "bg-red-50 text-red-700 ring-red-100 dark:bg-red-400/10 dark:text-red-200 dark:ring-red-300/25",
};

const categoryColors = [
  "bg-blue-100 text-blue-800 dark:bg-blue-400/12 dark:text-blue-200",
  "bg-orange-100 text-orange-800 dark:bg-orange-400/12 dark:text-orange-200",
  "bg-slate-100 text-slate-700 dark:bg-white/7 dark:text-slate-200",
  "bg-teal-100 text-teal-800 dark:bg-teal-400/12 dark:text-teal-200",
  "bg-violet-100 text-violet-800 dark:bg-violet-400/12 dark:text-violet-200",
];

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const statusLabel = (value) =>
  ({
    published: "Published",
    draft: "Draft",
    needs_review: "Needs Review",
  })[value] || "Published";

const buildPayload = (form) => ({
  title: form.title.trim(),
  content: form.content.trim(),
  sourceType: form.sourceType,
  metadata: {
    category: form.category.trim() || "General",
    status: form.status,
  },
});

function StatCard({ icon: Icon, label, value, accent, helper }) {
  return (
    <Card className="overflow-hidden rounded-[24px] border-slate-200/70 bg-white shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-surface-container-low dark:shadow-black/10">
      <CardContent className="relative flex min-h-[150px] flex-col justify-between p-6">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[60px] bg-teal-500/5 dark:bg-teal-300/5" />
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ring-black/5 dark:ring-white/10",
              accent,
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          {helper ? (
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-extrabold text-teal-700 dark:bg-teal-300/10 dark:text-teal-200">
              {helper}
            </span>
          ) : null}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-on-surface-variant">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-on-surface">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function KnowledgeFormDialog({
  open,
  form,
  editing,
  saving,
  onOpenChange,
  onFormChange,
  onSubmit,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-hidden rounded-[28px] border border-slate-200 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-[#121819]">
        <DialogHeader className="relative overflow-hidden border-b border-slate-100 bg-slate-50 px-6 py-5 dark:border-white/10 dark:bg-[#0f1516]">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[80px] bg-teal-500/10 dark:bg-teal-300/10" />
          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-900/15">
              <BookOpenText className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-slate-950 dark:text-white">
                {editing ? "Edit Knowledge" : "Add New Knowledge"}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Gemini will refresh the embedding so this content can be used by SmartTravel AI.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid max-h-[calc(92vh-170px)] gap-5 overflow-y-auto px-6 py-5">
          <div className="grid gap-2">
            <Label className="text-slate-700 dark:text-slate-200">Article title</Label>
            <Input
              value={form.title}
              onChange={(event) => onFormChange("title", event.target.value)}
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
              placeholder="Tone of Voice: Premium Luxury Tier"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label className="text-slate-700 dark:text-slate-200">Category</Label>
              <Input
                value={form.category}
                onChange={(event) => onFormChange("category", event.target.value)}
                className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                placeholder="AI Response Rules"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-700 dark:text-slate-200">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => onFormChange("status", value)}
              >
                <SelectTrigger className="h-12 w-full rounded-2xl border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/[0.04]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="needs_review">Needs Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-700 dark:text-slate-200">Source type</Label>
              <Select
                value={form.sourceType}
                onValueChange={(value) => onFormChange("sourceType", value)}
              >
                <SelectTrigger className="h-12 w-full rounded-2xl border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/[0.04]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="ai_rule">AI Rule</SelectItem>
                  <SelectItem value="tour">Tour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-700 dark:text-slate-200">Content</Label>
            <Textarea
              value={form.content}
              onChange={(event) => onFormChange("content", event.target.value)}
              className="min-h-[240px] resize-y rounded-2xl border-slate-200 bg-white px-4 py-3 leading-6 text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
              placeholder="Write the knowledge content used by SmartTravel AI..."
            />
          </div>
        </div>

        <DialogFooter className="rounded-b-[28px] border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-white/10 dark:bg-[#0f1516]">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="h-11 rounded-2xl bg-teal-600 px-6 text-white shadow-lg shadow-teal-950/20 hover:bg-teal-500"
          >
            {saving ? "Saving..." : editing ? "Save changes" : "Create knowledge"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    statusCounts: {},
    topCategories: [],
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sourceType: "all",
    page: 1,
    limit: 8,
  });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getKnowledgeBaseDocuments(filters);
      const data = response.data?.data || {};
      setDocuments(data.documents || []);
      setStats(data.stats || { total: 0, statusCounts: {}, topCategories: [] });
      setPagination(
        data.pagination || {
          page: 1,
          limit: filters.limit,
          total: 0,
          totalPages: 1,
        },
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cannot load knowledge base");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const categoryLookup = useMemo(
    () =>
      new Map(
        stats.topCategories?.map((item, index) => [
          item.name,
          categoryColors[index % categoryColors.length],
        ]) || [],
      ),
    [stats.topCategories],
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (document) => {
    setEditing(document);
    setForm({
      title: document.title || "",
      category: document.category || "General",
      status: document.status || "published",
      sourceType: document.sourceType || "manual",
      content: document.content || "",
    });
    setDialogOpen(true);
  };

  const handleFormChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload(form);
      if (editing) {
        await updateKnowledgeBaseDocument(editing.id, payload);
        toast.success("Knowledge updated");
      } else {
        await createKnowledgeBaseDocument(payload);
        toast.success("Knowledge created");
      }
      setDialogOpen(false);
      await loadDocuments();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cannot save knowledge");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (document) => {
    if (!window.confirm(`Delete "${document.title}" from knowledge base?`)) {
      return;
    }

    try {
      await deleteKnowledgeBaseDocument(document.id);
      toast.success("Knowledge deleted");
      await loadDocuments();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cannot delete knowledge");
    }
  };

  const updateFilter = (patch) => {
    setFilters((current) => ({ ...current, ...patch, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((current) => ({ ...current, page }));
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-7 pb-12 pt-4 md:pt-8">
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-surface-container-low/70 dark:shadow-black/10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">
            Voyager Admin
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Knowledge Base
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-on-surface-variant">
            Manage chatbot grounding content, policies, guides, and AI response rules in one place.
          </p>
        </div>
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
          <Input
            value={filters.search}
            onChange={(event) => updateFilter({ search: event.target.value })}
            placeholder="Search knowledge..."
            className="h-13 rounded-full border-slate-200 bg-slate-50 pl-12 pr-5 text-base shadow-none focus-visible:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-400 dark:focus-visible:bg-white/[0.06]"
          />
        </div>
      </div>
      </div>

      <section className="grid gap-5 lg:grid-cols-[270px_270px_minmax(0,1fr)]">
        <StatCard
          icon={BookOpenText}
          label="Total Articles"
          value={stats.total || 0}
          helper="+ Live"
          accent="bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-200"
        />
        <StatCard
          icon={CalendarDays}
          label="Pending Reviews"
          value={stats.statusCounts?.needs_review || 0}
          helper={`${stats.statusCounts?.draft || 0} Draft`}
          accent="bg-orange-50 text-orange-700 dark:bg-orange-400/10 dark:text-orange-200"
        />
        <Card className="rounded-[24px] border-slate-200/70 bg-white shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-surface-container-low dark:shadow-black/10">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Top Categories</h2>
              <Gauge className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div className="flex flex-wrap gap-3">
              {(stats.topCategories || []).length ? (
                stats.topCategories.map((category, index) => (
                  <span
                    key={category.name}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-bold ring-1 ring-black/5 dark:ring-white/10",
                      categoryColors[index % categoryColors.length],
                    )}
                  >
                    {category.name}
                    <span className="ml-3 rounded-full bg-white/70 px-2 py-0.5 text-xs text-slate-700 dark:bg-black/20 dark:text-slate-200">
                      {category.total}
                    </span>
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No categories yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col justify-between gap-4 rounded-[24px] border border-slate-200/70 bg-white/70 p-4 shadow-sm shadow-slate-900/5 backdrop-blur lg:flex-row lg:items-center dark:border-white/10 dark:bg-surface-container-low/60 dark:shadow-black/10">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative min-w-[320px]">
            <Filter className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 dark:text-slate-400" />
            <Input
              value={filters.search}
              onChange={(event) => updateFilter({ search: event.target.value })}
              placeholder="Filter by title, tag, or author..."
              className="h-12 rounded-2xl border-slate-200 bg-white pl-12 shadow-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-400"
            />
          </div>
          <Select
            value={filters.status}
            onValueChange={(value) => updateFilter({ status: value })}
          >
            <SelectTrigger className="h-12 w-full rounded-2xl border-slate-200 bg-white px-4 shadow-none md:w-44 dark:border-white/10 dark:bg-white/[0.04]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="needs_review">Needs Review</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.sourceType}
            onValueChange={(value) => updateFilter({ sourceType: value })}
          >
            <SelectTrigger className="h-12 w-full rounded-2xl border-slate-200 bg-white px-4 shadow-none md:w-44 dark:border-white/10 dark:bg-white/[0.04]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="policy">Policy</SelectItem>
              <SelectItem value="guide">Guide</SelectItem>
              <SelectItem value="ai_rule">AI Rule</SelectItem>
              <SelectItem value="tour">Tour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          onClick={openCreate}
          className="h-12 rounded-full bg-teal-600 px-7 text-sm font-black text-white shadow-lg shadow-teal-950/20 hover:bg-teal-500"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Knowledge
        </Button>
      </section>

      <Card className="overflow-hidden rounded-[28px] border-slate-200/70 bg-white shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-surface-container-low dark:shadow-black/10">
        <div className="overflow-x-auto">
          <div className="min-w-[1080px]">
            <div className="grid grid-cols-[minmax(260px,1.4fr)_180px_140px_145px_155px_110px] bg-slate-50 px-7 py-5 text-xs font-black uppercase tracking-widest text-slate-700 dark:bg-white/[0.035] dark:text-slate-300">
              <span>Article Title</span>
              <span>Category</span>
              <span>Last Updated</span>
              <span>Status</span>
              <span>Author</span>
              <span className="text-right">Actions</span>
            </div>

        <div className="divide-y divide-slate-100 dark:divide-white/10">
          {loading ? (
            <div className="px-7 py-16 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
              Loading knowledge base...
            </div>
          ) : documents.length ? (
            documents.map((document) => (
              <div
                key={document.id}
                className="grid grid-cols-[minmax(260px,1.4fr)_180px_140px_145px_155px_110px] items-center px-7 py-5 transition hover:bg-slate-50/80 dark:hover:bg-white/[0.035]"
              >
                <div>
                  <h3 className="line-clamp-2 text-base font-black leading-6 text-slate-950 dark:text-white">
                    {document.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    ID: {String(document.id).slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <span
                    className={cn(
                      "inline-flex max-w-[150px] rounded-full px-3 py-1 text-xs font-bold ring-1 ring-black/5 dark:ring-white/10",
                      categoryLookup.get(document.category) ||
                        "bg-slate-100 text-slate-700 dark:bg-white/7 dark:text-slate-200",
                    )}
                  >
                    {document.category}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {formatDate(document.updatedAt)}
                </p>
                <div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1",
                      statusStyles[document.status] || statusStyles.published,
                    )}
                  >
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
                    {statusLabel(document.status)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-black text-teal-800 dark:bg-teal-300/15 dark:text-teal-100">
                    {String(document.authorName || "SA")
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <span className="line-clamp-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {document.authorName || "System Admin"}
                  </span>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => openEdit(document)}
                    className="h-9 w-9 rounded-xl text-slate-500 hover:bg-teal-50 hover:text-teal-700 dark:text-slate-400 dark:hover:bg-teal-300/10 dark:hover:text-teal-200"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(document)}
                    className="h-9 w-9 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-300/10 dark:hover:text-red-200"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-7 py-16 text-center">
              <FileText className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                No knowledge documents found
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add your first KB article to make SmartTravel AI more grounded.
              </p>
            </div>
          )}
        </div>

            </div>
          </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-100 px-7 py-5 sm:flex-row sm:items-center dark:border-white/10">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Showing {documents.length ? (pagination.page - 1) * pagination.limit + 1 : 0} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} articles
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="rounded-xl text-slate-600 dark:text-slate-300"
            >
              Prev
            </Button>
            <span className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-black text-white">
              {pagination.page}
            </span>
            <Button
              variant="ghost"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="rounded-xl text-slate-600 dark:text-slate-300"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
        <Card className="overflow-hidden rounded-[28px] border-none bg-gradient-to-br from-teal-900 via-teal-800 to-teal-600 text-white shadow-xl shadow-teal-950/10 dark:from-teal-950 dark:via-teal-900 dark:to-teal-700">
          <CardContent className="relative p-8">
            <Sparkles className="absolute right-8 top-8 h-12 w-12 text-white/20" />
            <h2 className="text-2xl font-black">Automated Quality Assurance</h2>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-teal-50/85">
              Every new or updated article is embedded again with Gemini before
              it becomes searchable by the chatbot. Keep policy, tour guidance,
              and AI response rules fresh from one control surface.
            </p>
            <div className="mt-8 flex gap-8">
              <div>
                <p className="text-3xl font-black">Live</p>
                <p className="text-xs font-bold uppercase text-teal-100/80">
                  Vector Index
                </p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <p className="text-3xl font-black">{stats.total || 0}</p>
                <p className="text-xs font-bold uppercase text-teal-100/80">
                  KB Entries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-slate-200/70 bg-white shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-surface-container-low dark:shadow-black/10">
          <CardContent className="p-7">
            <h2 className="text-lg font-black text-slate-950 dark:text-white">
              Content Distribution
            </h2>
            <div className="mt-6 space-y-5">
              {(stats.topCategories || []).slice(0, 3).map((item) => {
                const percent = stats.total
                  ? Math.round((item.total / stats.total) * 100)
                  : 0;
                return (
                  <div key={item.name}>
                    <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <span>{item.name}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-teal-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {!stats.topCategories?.length ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No distribution data.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>

      <KnowledgeFormDialog
        open={dialogOpen}
        form={form}
        editing={editing}
        saving={saving}
        onOpenChange={setDialogOpen}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
