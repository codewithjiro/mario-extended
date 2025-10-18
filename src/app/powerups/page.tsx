"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  ArrowLeft,
  Star,
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  Zap,
  Search,
  Filter,
  Sparkles,
  Crown,
  ExternalLink,
  Shield,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import AuthGuard from "~/components/AuthGuard";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { Label } from "~/components/ui/label";

type Powerup = {
  id: number;
  name: string;
  effect: string;
  rarity: string;
  imageUrl: string;
  description: string;
  type: string;
};

export default function PowerupsPage() {
  const [powerups, setPowerups] = useState<Powerup[]>([]);
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingPowerup, setEditingPowerup] = useState<Powerup | null>(null);
  const [selectedPowerup, setSelectedPowerup] = useState<Powerup | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    effect: "",
    rarity: "",
    description: "",
    imageUrl: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPowerups();
  }, []);

  async function loadPowerups() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/powerups", {});

      if (!res.ok) {
        throw new Error(`Failed to load: ${res.status}`);
      }

      const data = await res.json();
      setPowerups(data.powerups || []);
    } catch (error: any) {
      console.error("Failed to load powerups:", error);
      setError(error.message);
      toast.error("Failed to load powerups");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!formData.name.trim()) {
      toast.error("Name is required!");
      return;
    }

    try {
      const method = editingPowerup ? "PUT" : "POST";
      const url = editingPowerup
        ? `/api/powerups/${editingPowerup.id}`
        : "/api/powerups";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save powerup!");
      }

      toast.success(
        editingPowerup
          ? "🎉 Power-up updated successfully!"
          : "✨ Power-up added successfully!",
      );
      setOpen(false);
      setFormData({
        name: "",
        effect: "",
        rarity: "",
        description: "",
        imageUrl: "",
        type: "",
      });
      setEditingPowerup(null);
      loadPowerups();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleDelete(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this power-up?",
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/powerups/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete powerup");
      }

      toast.success("🗑️ Power-up deleted!");
      setDetailOpen(false);
      loadPowerups();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function handleEdit(powerup: Powerup) {
    setEditingPowerup(powerup);
    setFormData({
      name: powerup.name,
      effect: powerup.effect,
      rarity: powerup.rarity,
      description: powerup.description,
      imageUrl: powerup.imageUrl,
      type: powerup.type,
    });
    setOpen(true);
    setDetailOpen(false);
  }

  function handleCardClick(powerup: Powerup) {
    setSelectedPowerup(powerup);
    setDetailOpen(true);
  }

  const filteredPowerups = powerups.filter(
    (powerup) =>
      powerup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      powerup.rarity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      powerup.effect?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const legendaryCount = powerups.filter(
    (p) => p.rarity === "Legendary",
  ).length;
  const rareCount = powerups.filter((p) => p.rarity === "Rare").length;
  const commonCount = powerups.filter((p) => p.rarity === "Common").length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "from-yellow-500 to-orange-500";
      case "Rare":
        return "from-purple-500 to-pink-500";
      case "Common":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-gray-500 to-gray-400";
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Rare":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Common":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-8 sm:px-6 lg:px-8">
        {/* Enhanced Background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-red-500/10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-500/5 blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl space-y-8">
          {/* Enhanced Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between rounded-3xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500 to-red-500 opacity-75 blur-lg"></div>
                <div className="relative rounded-2xl bg-gradient-to-r from-yellow-500 to-red-500 p-3 shadow-2xl">
                  <Rocket className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="bg-size-200 animate-gradient bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-500 bg-clip-text text-4xl font-black text-transparent">
                  MarioX Power-ups
                </h1>
                <p className="mt-1 text-sm font-medium text-gray-300">
                  Manage the magical items that power up the Mario universe
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => {
                  setEditingPowerup(null);
                  setFormData({
                    name: "",
                    effect: "",
                    rarity: "",
                    description: "",
                    imageUrl: "",
                    type: "",
                  });
                  setOpen(true);
                }}
                className="hover:shadow-3xl flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-2xl transition-all hover:scale-105 hover:from-yellow-600 hover:to-red-600"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Power-up</span>
              </Button>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-gray-600 bg-gray-700/50 text-gray-300 backdrop-blur-sm transition-all hover:bg-gray-600 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
            </div>
          </motion.header>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            <Card className="border-0 bg-gradient-to-br from-gray-800/60 to-gray-900/60 shadow-2xl backdrop-blur-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Total Power-ups
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {powerups.length}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 p-3">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-gray-800/60 to-gray-900/60 shadow-2xl backdrop-blur-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Legendary
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {legendaryCount}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 p-3">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-gray-800/60 to-gray-900/60 shadow-2xl backdrop-blur-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Rare Items
                    </p>
                    <p className="text-3xl font-bold text-white">{rareCount}</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-3">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center justify-between gap-4 lg:flex-row"
          >
            <div className="relative w-full flex-1 lg:max-w-md">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search power-ups by name, effect, or rarity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-gray-600 bg-gray-700/50 pl-10 text-white backdrop-blur-sm placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
              >
                {filteredPowerups.length} power-ups
              </Badge>
              <Button
                variant="outline"
                className="border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-600"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </motion.div>

          {/* Power-up Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="wait">
              {filteredPowerups.map((powerup, index) => (
                <motion.div
                  key={powerup.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.2 },
                  }}
                  className="group cursor-pointer"
                  onClick={() => handleCardClick(powerup)}
                >
                  <Card className="group-hover:shadow-3xl h-full overflow-hidden border border-gray-700/50 bg-gray-800/40 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:border-yellow-500/30">
                    <div className="relative overflow-hidden">
                      <img
                        src={powerup.imageUrl || "/api/placeholder/400/300"}
                        alt={powerup.name}
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute top-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Badge className="border-0 bg-black/50 text-white backdrop-blur-sm">
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <div className="mb-3 flex items-start justify-between">
                        <h3 className="line-clamp-1 text-xl font-bold text-white transition-colors group-hover:text-yellow-400">
                          {powerup.name}
                        </h3>
                        <Badge
                          className={`${getRarityBadge(powerup.rarity)} border backdrop-blur-sm`}
                        >
                          {powerup.rarity}
                        </Badge>
                      </div>

                      <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-400">
                        {powerup.description || powerup.effect}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="border-green-500/30 bg-green-500/10 text-green-400"
                        >
                          <Zap className="mr-1 h-3 w-3" />
                          {powerup.effect}
                        </Badge>
                        <ExternalLink className="h-4 w-4 text-gray-500 transition-colors group-hover:text-yellow-400" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {!loading && filteredPowerups.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="mb-6 rounded-3xl border border-gray-700/50 bg-gray-800/40 p-8 backdrop-blur-sm">
                <Rocket className="h-16 w-16 text-gray-500" />
              </div>
              <h3 className="mb-3 text-2xl font-black text-white">
                {searchTerm ? "No power-ups found" : "No power-ups yet"}
              </h3>
              <p className="mb-6 max-w-md text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "Start building your Mario universe by adding the first power-up!"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setOpen(true)}
                  className="hover:shadow-3xl bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-2xl"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Power-up
                </Button>
              )}
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-500"></div>
                <p className="mt-4 text-gray-400">Loading power-ups...</p>
              </div>
            </div>
          )}

          {/* Power-up Detail Dialog */}
          <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-0 bg-gray-800/95 text-white shadow-2xl backdrop-blur-2xl">
              {selectedPowerup && (
                <>
                  <DialogHeader className="sticky top-0 z-10 border-b border-gray-700/50 bg-gray-800/95 pb-4 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-2xl bg-gradient-to-r ${getRarityColor(selectedPowerup.rarity)} p-3`}
                      >
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <DialogTitle className="truncate text-2xl font-black text-white lg:text-3xl">
                          {selectedPowerup.name}
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Power-up Details & Information
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="grid grid-cols-1 gap-6 py-4 lg:grid-cols-2">
                    {/* Power-up Image */}
                    <div className="space-y-4">
                      <div className="overflow-hidden rounded-2xl border border-gray-600/50 bg-gray-700/30">
                        <img
                          src={
                            selectedPowerup.imageUrl ||
                            "/api/placeholder/500/400"
                          }
                          alt={selectedPowerup.name}
                          className="h-48 w-full object-cover lg:h-64"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge
                          className={`text-sm ${getRarityBadge(selectedPowerup.rarity)}`}
                        >
                          {selectedPowerup.rarity}
                        </Badge>
                        <Badge className="border border-green-500/30 bg-green-500/20 text-green-400 backdrop-blur-sm">
                          <Zap className="mr-1 h-3 w-3" />
                          {selectedPowerup.effect}
                        </Badge>
                      </div>
                    </div>

                    {/* Power-up Info */}
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 text-sm font-medium text-gray-400">
                          Description
                        </Label>
                        <p className="text-sm leading-relaxed text-gray-300 lg:text-base">
                          {selectedPowerup.description ||
                            selectedPowerup.effect}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-gray-400">
                            Rarity
                          </Label>
                          <div
                            className={`text-sm font-semibold ${
                              selectedPowerup.rarity === "Legendary"
                                ? "text-yellow-400"
                                : selectedPowerup.rarity === "Rare"
                                  ? "text-purple-400"
                                  : "text-blue-400"
                            }`}
                          >
                            {selectedPowerup.rarity}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-gray-400">
                            Effect
                          </Label>
                          <div className="text-sm font-semibold text-green-400">
                            {selectedPowerup.effect}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                        <Button
                          onClick={() => handleEdit(selectedPowerup)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-sm text-white hover:from-blue-600 hover:to-cyan-600"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(selectedPowerup.id)}
                          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-sm hover:from-red-600 hover:to-pink-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Create/Edit Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl border-0 bg-gray-800/95 text-white shadow-2xl backdrop-blur-2xl">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-gradient-to-r from-yellow-500 to-red-500 p-2">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-black text-white">
                      {editingPowerup ? "Edit Power-up" : "Create New Power-up"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {editingPowerup
                        ? "Update power-up details"
                        : "Add a new power-up to the Mario universe"}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">
                    Power-up Name
                  </Label>
                  <Input
                    placeholder="e.g., Super Mushroom, Fire Flower, Starman"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">
                      Rarity
                    </Label>
                    <Input
                      placeholder="Rare, Legendary"
                      value={formData.rarity}
                      onChange={(e) =>
                        setFormData({ ...formData, rarity: e.target.value })
                      }
                      className="border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">
                      Effect
                    </Label>
                    <Input
                      placeholder="e.g., Grow, Fire Power, Invincibility"
                      value={formData.effect}
                      onChange={(e) =>
                        setFormData({ ...formData, effect: e.target.value })
                      }
                      className="border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    placeholder="Describe the power-up's abilities and effects..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="min-h-[100px] border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">
                    Image URL
                  </Label>
                  <Input
                    placeholder="https://example.com/powerup-image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm placeholder:text-gray-400"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-lg hover:from-yellow-600 hover:to-red-600 hover:shadow-xl"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {editingPowerup ? "Save Changes" : "Create Power-up"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-600 hover:text-white"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AuthGuard>
  );
}
