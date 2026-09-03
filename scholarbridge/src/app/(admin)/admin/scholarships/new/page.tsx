"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Settings,
  Plus,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const defaultCategories = [
  "STEM",
  "Arts",
  "Need-Based",
  "Merit-Based",
  "First-Gen",
];

export default function AddScholarshipAdminPage() {
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [description, setDescription] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [fundingAmount, setFundingAmount] = useState("5000");
  const [deadlineDate, setDeadlineDate] = useState("");

  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "STEM",
    "Need-Based",
    "First-Gen",
  ]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");

  function toggleCategory(cat: string) {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  }

  function handleAddCustomTag(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newTagInput.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setSelectedCategories([...selectedCategories, trimmed]);
      setNewTagInput("");
      setIsAddingTag(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased">
      {/* Admin Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-border bg-card p-6">
        <div className="space-y-8">
          <div>
            <Link
              href="/admin"
              className="font-serif text-xl font-bold tracking-tight text-primary"
            >
              ScholarBridge Admin
            </Link>
            <p className="mt-1 text-xs text-secondary">Portal Management</p>
          </div>

          <nav className="space-y-1.5">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-secondary transition hover:bg-secondary/10 hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/scholarships/new"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2.5 text-xs font-semibold text-background shadow-xs transition hover:opacity-90"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Scholarship</span>
            </Link>

            <Link
              href="/admin/scholarships"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-secondary transition hover:bg-secondary/10 hover:text-foreground"
            >
              <FolderKanban className="h-4 w-4" />
              <span>Manage Directory</span>
            </Link>
          </nav>
        </div>

        <div>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-secondary transition hover:bg-secondary/10 hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-10 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-primary">
              Add New Scholarship
            </h1>
            <p className="mt-2 text-sm text-secondary">
              Enter details for a new academic opportunity to be listed in the
              directory.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Admin submission handler logic goes here
            }}
            className="space-y-10 rounded-xl border border-border bg-card p-8 shadow-xs"
          >
            {/* Section 1: Basic Information */}
            <div className="space-y-5">
              <div className="border-b border-border pb-3">
                <h2 className="text-base font-semibold text-foreground">
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Scholarship Title *
                  </label>
                  <Input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. National Merit Engineering Scholarship"
                    className="mt-2 h-11 border-border bg-background text-sm text-foreground placeholder:text-secondary focus-visible:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Provider / Institution *
                  </label>
                  <Input
                    type="text"
                    required
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    placeholder="e.g. Foundation for Future Engineers"
                    className="mt-2 h-11 border-border bg-background text-sm text-foreground placeholder:text-secondary focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Opportunity Details */}
            <div className="space-y-5">
              <div className="border-b border-border pb-3">
                <h2 className="text-base font-semibold text-foreground">
                  Opportunity Details
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed overview of the scholarship..."
                    className="mt-2 w-full rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder:text-secondary outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Eligibility Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    placeholder="e.g. High school senior, 3.5+ GPA, US Citizen..."
                    className="mt-2 w-full rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder:text-secondary outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Funding & Deadlines */}
            <div className="space-y-5">
              <div className="border-b border-border pb-3">
                <h2 className="text-base font-semibold text-foreground">
                  Funding & Deadlines
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Funding Amount
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-secondary">
                      $
                    </span>
                    <Input
                      type="number"
                      value={fundingAmount}
                      onChange={(e) => setFundingAmount(e.target.value)}
                      className="h-11 border-border bg-background pl-8 text-sm text-foreground placeholder:text-secondary focus-visible:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Deadline Date *
                  </label>
                  <div className="relative mt-2">
                    <Input
                      type="date"
                      required
                      value={deadlineDate}
                      onChange={(e) => setDeadlineDate(e.target.value)}
                      className="h-11 border-border bg-background pr-10 text-sm text-foreground placeholder:text-secondary focus-visible:ring-primary"
                    />
                    <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Classification */}
            <div className="space-y-5">
              <div className="border-b border-border pb-3">
                <h2 className="text-base font-semibold text-foreground">
                  Classification
                </h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Categories / Tags
                </label>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {categories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                          isSelected
                            ? "bg-secondary/20 text-foreground border border-border"
                            : "bg-background text-secondary border border-border hover:text-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}

                  {isAddingTag ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="text"
                        autoFocus
                        placeholder="Tag name"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddCustomTag(e);
                          } else if (e.key === "Escape") {
                            setIsAddingTag(false);
                          }
                        }}
                        className="h-7 w-28 rounded-full border-border bg-background px-3 text-xs"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddCustomTag}
                        className="h-7 rounded-full bg-primary px-2 text-[10px] text-background"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingTag(true)}
                      className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3.5 py-1.5 text-xs font-medium text-secondary transition hover:border-primary hover:text-primary"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Custom</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Submission Action */}
            <div className="flex justify-end border-t border-border pt-6">
              <Button
                type="submit"
                className="bg-primary px-8 text-sm font-semibold text-background hover:opacity-90"
              >
                Publish Scholarship
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}