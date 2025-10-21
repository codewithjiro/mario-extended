// character/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  ArrowLeft,
  Sparkles,
  PlusCircle,
  ExternalLink,
  X,
  Image as ImageIcon,
  Upload,
  Check,
  Edit,
  Trash2,
  Save,
  Search,
  Gamepad2,
  KeyRound,
  Filter,
  RefreshCw,
  AlertCircle,
  Shield,
  Zap,
  Crown,
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
import { useUploadThing } from "~/utils/uploadthing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

// ✅ Updated type for your new schema
type GameItem = {
  id: number;
  name: string;
  category: string;
  type: string;
  power: string;
  effect: string;
  rarity: string;
  description: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
};

// ✅ Options for dropdowns
const CATEGORIES = [
  "All Categories",
  "Character",
  "Power Up",
  "Weapon",
  "Armor",
  "Consumable",
  "Collectible",
  "Special",
  "Magic",
  "Vehicle",
  "Tool",
  "Accessory",
];

const TYPES = [
  "All Types",
  "Hero",
  "Enemy",
  "Speed",
  "Fire",
  "Water",
  "Earth",
  "Air",
  "Ice",
  "Lightning",
  "Poison",
  "Holy",
  "Dark",
  "Neutral",
];

const RARITIES = [
  "All Rarities",
  "None",
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
  "Mythic",
  "Divine",
  "Exclusive",
  "Secret",
  "Ultimate",
];

const POWER_LEVELS = [
  "None",
  "Level 1",
  "Level 2",
  "Level 3",
  "Level 4",
  "Level 5",
  "Level MAX",
  "Super",
  "Ultra",
  "Mega",
  "Hyper",
];

const EFFECTS = [
  "None",
  "Damage Boost",
  "Speed Boost",
  "Health Regeneration",
  "Invincibility",
  "Size Change",
  "Elemental Attack",
  "Defense Up",
  "Special Ability",
  "Transformation",
  "Combo Enhancer",
];

// Rarity color mapping
const RARITY_COLORS = {
  None: "from-gray-300 to-gray-500",
  Common: "from-gray-400 to-gray-600",
  Uncommon: "from-green-400 to-green-600",
  Rare: "from-blue-400 to-blue-600",
  Epic: "from-purple-400 to-purple-600",
  Legendary: "from-yellow-400 to-yellow-600",
  Mythic: "from-pink-400 to-pink-600",
  Divine: "from-cyan-400 to-cyan-600",
  Exclusive: "from-orange-400 to-orange-600",
  Secret: "from-red-400 to-red-600",
  Ultimate: "from-red-500 to-yellow-500",
};

// Filter type
type FilterType = {
  category: string;
  type: string;
  rarity: string;
  search: string;
};

export default function GameItemsPage() {
  const [gameItems, setGameItems] = useState<GameItem[]>([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GameItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterType>({
    category: "All Categories",
    type: "All Types",
    rarity: "All Rarities",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Separate image upload states for create and edit dialogs
  const createInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [createImageUrl, setCreateImageUrl] = useState<string | null>(null);
  const [createImageName, setCreateImageName] = useState<string | null>(null);
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
  const [editImageName, setEditImageName] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    type: "",
    power: "",
    effect: "",
    rarity: "",
    description: "",
    imageUrl: "",
  });

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadBegin: () => {
      toast.info("🔄 Uploading image...", { id: "upload" });
    },
    onUploadError: (error) => {
      toast.error(`❌ Upload failed: ${error.message}`, { id: "upload" });
      setError(`Image upload failed: ${error.message}`);
    },
    onClientUploadComplete: () => {
      toast.success("✅ Image uploaded successfully!", { id: "upload" });
    },
  });

  // Enhanced error handler
  const handleError = useCallback((error: any, context: string) => {
    console.error(`Error in ${context}:`, error);
    const errorMessage = error.message || `An error occurred during ${context}`;
    setError(errorMessage);
    toast.error(`❌ ${errorMessage}`);
  }, []);

  // Clear error
  const clearError = () => setError(null);

  // Load items with proper error handling
  const loadItems = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const res = await fetch("/api/characters");
      if (!res.ok) {
        throw new Error(`Failed to load items: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setGameItems(data.items || []);
      toast.success(`🎮 Loaded ${data.items?.length || 0} items`);
    } catch (err) {
      handleError(err, "loading items");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Form validation
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("❌ Item name is required!");
      return false;
    }
    if (!formData.category) {
      toast.error("❌ Category is required!");
      return false;
    }
    if (!formData.rarity) {
      toast.error("❌ Rarity is required!");
      return false;
    }
    return true;
  };

  // Handle save with proper error handling
  const handleSave = async () => {
    if (!validateForm()) return;

    if (editingItem) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  };

  // Handle create with enhanced error handling
  const handleCreate = async () => {
    if (!createInputRef.current?.files?.length && !formData.imageUrl) {
      toast.error("❌ Please select an image to upload.");
      return;
    }

    try {
      toast.loading("🛠️ Creating item...", { id: "save" });
      clearError();

      let finalImageUrl = formData.imageUrl;

      // Upload image if exists
      if (createInputRef.current?.files?.length) {
        const uploadResult = await startUpload(
          Array.from(createInputRef.current.files),
          {
            name: formData.name,
            category: formData.category,
            type: formData.type,
            power: formData.power,
            effect: formData.effect,
            rarity: formData.rarity,
            description: formData.description,
          },
        );

        if (uploadResult && uploadResult[0]?.ufsUrl) {
          finalImageUrl = uploadResult[0].ufsUrl;
        } else {
          throw new Error("Upload completed but no URL returned");
        }
      }

      // Create the item
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      toast.success("🎉 Item created successfully!", { id: "save" });
      setOpen(false);
      resetForm();
      await loadItems();
    } catch (error: any) {
      handleError(error, "creating item");
    }
  };

  // Handle update with enhanced error handling
  const handleUpdate = async () => {
    if (!editingItem) return;

    try {
      toast.loading("🔄 Updating item...", { id: "update" });
      clearError();

      let finalImageUrl = formData.imageUrl || editingItem.imageUrl;

      // Upload new image if exists
      if (editInputRef.current?.files?.length) {
        const uploadResult = await startUpload(
          Array.from(editInputRef.current.files),
          {
            name: formData.name,
            category: formData.category,
            type: formData.type,
            power: formData.power,
            effect: formData.effect,
            rarity: formData.rarity,
            description: formData.description,
          },
        );

        if (uploadResult && uploadResult[0]?.ufsUrl) {
          finalImageUrl = uploadResult[0].ufsUrl;
        } else {
          throw new Error("Upload completed but no URL returned");
        }
      }

      // Update the item
      const res = await fetch(`/api/characters/${editingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      toast.success("✅ Item updated successfully!", { id: "update" });
      setOpen(false);
      setViewOpen(false);
      resetForm();
      await loadItems();
    } catch (error: any) {
      handleError(error, "updating item");
    }
  };

  // Handle delete with enhanced error handling
  const handleDelete = async (item: GameItem) => {
    if (!confirm(`🗑️ Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) return;

    try {
      toast.loading("🗑️ Deleting item...", { id: "delete" });
      clearError();

      const res = await fetch(`/api/characters/${item.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      toast.success("✅ Item deleted successfully!", { id: "delete" });
      setViewOpen(false);
      setSelectedItem(null);
      await loadItems();
    } catch (error: any) {
      handleError(error, "deleting item");
    }
  };

  // Reset form
  function resetForm() {
    setFormData({
      name: "",
      category: "",
      type: "",
      power: "",
      effect: "",
      rarity: "",
      description: "",
      imageUrl: "",
    });
    setCreateImageUrl(null);
    setCreateImageName(null);
    setEditImageUrl(null);
    setEditImageName(null);
    setEditingItem(null);
    setIsEditing(false);
    clearError();

    // Clear file inputs
    if (createInputRef.current) createInputRef.current.value = "";
    if (editInputRef.current) editInputRef.current.value = "";
  }

  // Handle image selection with validation
  function handleImageSelect(file: File, type: "create" | "edit") {
    if (!file.type.startsWith("image/")) {
      toast.error("❌ Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("❌ Image size must be less than 5MB.");
      return;
    }

    const url = URL.createObjectURL(file);

    if (type === "edit") {
      setEditImageUrl(url);
      setEditImageName(file.name);
    } else {
      setCreateImageUrl(url);
      setCreateImageName(file.name);
    }
  }

  function handleCardClick(item: GameItem) {
    setSelectedItem(item);
    setViewOpen(true);
    setIsEditing(false);
    // Reset edit image state when opening view dialog
    setEditImageUrl(null);
    setEditImageName(null);
    clearError();
  }

  function handleEditClick() {
    if (!selectedItem) return;

    setEditingItem(selectedItem);
    setFormData({
      name: selectedItem.name,
      category: selectedItem.category,
      type: selectedItem.type,
      power: selectedItem.power,
      effect: selectedItem.effect,
      rarity: selectedItem.rarity,
      description: selectedItem.description,
      imageUrl: selectedItem.imageUrl,
    });
    // Set edit image to current item's image
    setEditImageUrl(selectedItem.imageUrl);

    setIsEditing(true);
    clearError();
  }

  function handleSaveEdit() {
    if (!selectedItem) return;
    handleUpdate();
  }

  function handleCancelEdit() {
    setIsEditing(false);
    if (selectedItem) {
      setFormData({
        name: selectedItem.name,
        category: selectedItem.category,
        type: selectedItem.type,
        power: selectedItem.power,
        effect: selectedItem.effect,
        rarity: selectedItem.rarity,
        description: selectedItem.description,
        imageUrl: selectedItem.imageUrl,
      });
    }
    // Reset edit image state
    setEditImageUrl(selectedItem?.imageUrl || null);
    setEditImageName(null);
    clearError();
  }

  // Enhanced filtering with multiple criteria
  const filteredItems = gameItems.filter((item) => {
    const matchesSearch = filters.search === "" || 
      [item.name, item.category, item.type, item.rarity, item.description]
        .join(" ")
        .toLowerCase()
        .includes(filters.search.toLowerCase());

    const matchesCategory = filters.category === "All Categories" || item.category === filters.category;
    const matchesType = filters.type === "All Types" || item.type === filters.type;
    const matchesRarity = filters.rarity === "All Rarities" || item.rarity === filters.rarity;

    return matchesSearch && matchesCategory && matchesType && matchesRarity;
  });

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: "All Categories",
      type: "All Types",
      rarity: "All Rarities",
      search: "",
    });
  };

  // Get filter counts for badges
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category !== "All Categories") count++;
    if (filters.type !== "All Types") count++;
    if (filters.rarity !== "All Rarities") count++;
    if (filters.search !== "") count++;
    return count;
  };

  return (
    <AuthGuard>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-8 sm:px-6 lg:px-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-red-500/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500/5 blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl space-y-8">
          {/* Header - Adventure Hub */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center justify-between overflow-hidden rounded-3xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl backdrop-blur-2xl"
          >
            {/* Header Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700/50 via-gray-800/40 to-transparent"></div>

            <div className="relative">
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-r from-red-500 to-yellow-500 p-2">
                  <Gamepad2 className="h-6 w-6 text-white" />
                </div>
                <h1 className="bg-gradient-to-r from-red-400 via-yellow-400 to-red-500 bg-clip-text text-4xl font-black text-transparent">
                  Item Vault
                </h1>
              </div>
              <p className="ml-1 text-sm font-medium text-gray-300">
                Power up your adventure with legendary items
              </p>
            </div>
            <div className="relative flex gap-3">
              <Button
                onClick={() => {
                  resetForm();
                  setOpen(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-yellow-500 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <PlusCircle className="h-4 w-4" />
                New Item
              </Button>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-blue-500/50 bg-blue-500/10 font-medium text-blue-200 backdrop-blur-sm hover:bg-blue-500/10 hover:text-blue-500"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </motion.header>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div>
                    <h4 className="font-semibold text-red-400">Error</h4>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearError}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Search and Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <div className="relative max-w-md flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search power-ups, weapons, items..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="border-red-500/30 bg-gray-800/60 pl-10 text-white placeholder-gray-400 backdrop-blur-sm focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                />
              </div>
              
              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-yellow-500/30 bg-yellow-500/10 text-yellow-400 backdrop-blur-sm hover:bg-yellow-500/20"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <Badge className="ml-2 bg-yellow-500 text-yellow-900">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>

              {/* Refresh Button */}
              <Button
                variant="outline"
                onClick={loadItems}
                disabled={loading}
                className="border-blue-500/30 bg-blue-500/10 text-blue-400 backdrop-blur-sm hover:bg-blue-500/20"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>

              <Badge
                variant="outline"
                className="border-yellow-500/50 bg-yellow-500/10 px-3 py-1 font-bold text-yellow-400 backdrop-blur-sm"
              >
                {filteredItems.length} ITEMS READY
              </Badge>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-700/50 bg-gray-800/40 p-4 backdrop-blur-xl md:grid-cols-3"
                >
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-blue-300">Category</Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => setFilters({ ...filters, category: value })}
                    >
                      <SelectTrigger className="border-blue-500/30 bg-gray-800/60 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-blue-500/30 bg-gray-800 text-white">
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-yellow-300">Type</Label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) => setFilters({ ...filters, type: value })}
                    >
                      <SelectTrigger className="border-yellow-500/30 bg-gray-800/60 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-yellow-500/30 bg-gray-800 text-white">
                        {TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rarity Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-purple-300">Rarity</Label>
                    <Select
                      value={filters.rarity}
                      onValueChange={(value) => setFilters({ ...filters, rarity: value })}
                    >
                      <SelectTrigger className="border-purple-500/30 bg-gray-800/60 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-purple-500/30 bg-gray-800 text-white">
                        {RARITIES.map((rarity) => (
                          <SelectItem key={rarity} value={rarity}>
                            {rarity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reset Filters */}
                  <div className="md:col-span-3">
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="w-full border-gray-600 bg-gray-800/60 text-gray-300 hover:bg-gray-700/60"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset All Filters
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              <p className="mt-4 text-gray-400">Loading your legendary items...</p>
            </motion.div>
          )}

          {/* Items Grid */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleCardClick(item)}
                      className="transform cursor-pointer transition-all duration-300 hover:scale-105"
                    >
                      <Card className="group relative overflow-hidden border border-gray-700/50 bg-gradient-to-b from-gray-800/80 to-gray-900/80 shadow-2xl backdrop-blur-xl">
                        {/* Card Glow Effect */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS] || "from-gray-500 to-gray-700"} opacity-5 transition-opacity group-hover:opacity-10`}
                        ></div>

                        {/* Image with Overlay */}
                        <div className="relative overflow-hidden">
                          <img
                            src={item.imageUrl || "/api/placeholder/400/300"}
                            alt={item.name}
                            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.src = "/api/placeholder/400/300";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                          <div className="absolute top-3 left-3">
                            <Badge
                              className={`bg-gradient-to-r ${RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS] || "from-gray-500 to-gray-700"} border-0 font-bold text-white shadow-lg`}
                            >
                              {item.rarity}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="relative p-4">
                          <h3 className="mb-2 text-xl font-black text-white transition-colors group-hover:text-yellow-200">
                            {item.name}
                          </h3>
                          <p className="mb-3 line-clamp-2 text-sm text-gray-300">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                              <Badge
                                variant="outline"
                                className="border-blue-500/30 bg-blue-500/10 font-medium text-blue-300"
                              >
                                {item.category}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="border-green-500/30 bg-green-500/10 text-xs font-medium text-green-300"
                              >
                                {item.type}
                              </Badge>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-400 transition-colors group-hover:text-yellow-400" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-16 text-center"
                  >
                    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-8 backdrop-blur-xl">
                      <Shield className="mx-auto h-16 w-16 text-gray-500" />
                      <h3 className="mt-4 text-xl font-bold text-white">No Items Found</h3>
                      <p className="mt-2 text-gray-400">
                        {getActiveFilterCount() > 0
                          ? "Try adjusting your filters to see more results."
                          : "Start by creating your first legendary item!"}
                      </p>
                      {getActiveFilterCount() > 0 && (
                        <Button
                          onClick={resetFilters}
                          className="mt-4 bg-gradient-to-r from-red-500 to-yellow-500"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reset Filters
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* View Item Dialog - Power Up Selection */}
          <Dialog
            open={viewOpen}
            onOpenChange={(open) => {
              setViewOpen(open);
              if (!open) {
                setIsEditing(false);
                setEditImageUrl(null);
                setEditImageName(null);
                clearError();
              }
            }}
          >
            <DialogContent className="max-w-4xl rounded-3xl border border-red-500/30 bg-gray-900/95 text-white shadow-2xl backdrop-blur-2xl">
              <DialogHeader className="relative pb-4">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform">
                  <div className="rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 p-3 shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
                <DialogTitle className="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text pt-4 text-center text-3xl font-black text-transparent">
                  {selectedItem?.name}
                </DialogTitle>
                <DialogDescription className="text-center text-gray-300">
                  {isEditing
                    ? "Modify your power-up stats"
                    : "Inspect your legendary item"}
                </DialogDescription>
              </DialogHeader>

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-8 py-6 md:grid-cols-2">
                {/* Image Section */}
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-2xl border-2 border-red-500/20 bg-gray-800/50 p-2">
                    <img
                      src={
                        editImageUrl ||
                        selectedItem?.imageUrl ||
                        "/api/placeholder/400/300"
                      }
                      alt={selectedItem?.name}
                      className="h-72 w-full rounded-xl object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/400/300";
                      }}
                    />
                  </div>

                  {isEditing && (
                    <div>
                      <Label className="mb-2 block text-sm font-medium text-gray-300">
                        Update Image
                      </Label>
                      <div
                        onClick={() => editInputRef.current?.click()}
                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-red-500/30 bg-gray-800/40 p-6 transition-all hover:border-red-500/50 hover:bg-gray-800/60"
                      >
                        <ImageIcon className="mb-3 h-8 w-8 text-red-400" />
                        <p className="text-sm font-medium text-gray-300">
                          Upload New Image
                        </p>
                        {editImageName && (
                          <p className="mt-1 text-xs text-green-400">
                            New image selected: {editImageName}
                          </p>
                        )}
                      </div>
                      <input
                        ref={editInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageSelect(file, "edit");
                        }}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                  {isEditing ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-red-300">
                          Power-Up Name
                        </Label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="border-red-500/30 bg-gray-800/60 text-white focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-blue-300">
                            Category
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) =>
                              setFormData({ ...formData, category: value })
                            }
                          >
                            <SelectTrigger className="border-blue-500/30 bg-gray-800/60 text-white focus:ring-1 focus:ring-blue-500/30">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="border-blue-500/30 bg-gray-800 text-white">
                              {CATEGORIES.filter(cat => cat !== "All Categories").map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-yellow-300">
                            Type
                          </Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) =>
                              setFormData({ ...formData, type: value })
                            }
                          >
                            <SelectTrigger className="border-yellow-500/30 bg-gray-800/60 text-white focus:ring-1 focus:ring-yellow-500/30">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="border-yellow-500/30 bg-gray-800 text-white">
                              {TYPES.filter(type => type !== "All Types").map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-purple-300">
                            Rarity
                          </Label>
                          <Select
                            value={formData.rarity}
                            onValueChange={(value) =>
                              setFormData({ ...formData, rarity: value })
                            }
                          >
                            <SelectTrigger className="border-purple-500/30 bg-gray-800/60 text-white focus:ring-1 focus:ring-purple-500/30">
                              <SelectValue placeholder="Select rarity" />
                            </SelectTrigger>
                            <SelectContent className="border-purple-500/30 bg-gray-800 text-white">
                              {RARITIES.filter(rarity => rarity !== "All Rarities").map((rarity) => (
                                <SelectItem key={rarity} value={rarity}>
                                  {rarity}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-green-300">
                            Power
                          </Label>
                          <Select
                            value={formData.power}
                            onValueChange={(value) =>
                              setFormData({ ...formData, power: value })
                            }
                          >
                            <SelectTrigger className="border-green-500/30 bg-gray-800/60 text-white focus:ring-1 focus:ring-green-500/30">
                              <SelectValue placeholder="Select power" />
                            </SelectTrigger>
                            <SelectContent className="border-green-500/30 bg-gray-800 text-white">
                              {POWER_LEVELS.map((power) => (
                                <SelectItem key={power} value={power}>
                                  {power}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-cyan-300">
                          Effect
                        </Label>
                        <Select
                          value={formData.effect}
                          onValueChange={(value) =>
                            setFormData({ ...formData, effect: value })
                          }
                        >
                          <SelectTrigger className="border-cyan-500/30 bg-gray-800/60 text-white focus:ring-1 focus:ring-cyan-500/30">
                            <SelectValue placeholder="Select effect" />
                          </SelectTrigger>
                          <SelectContent className="border-cyan-500/30 bg-gray-800 text-white">
                            {EFFECTS.map((effect) => (
                              <SelectItem key={effect} value={effect}>
                                {effect}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-300">
                          Description
                        </Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="min-h-[100px] border-gray-600 bg-gray-800/60 text-white focus:border-red-500/30 focus:ring-1 focus:ring-red-500/30"
                        />
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-blue-400">
                            Category
                          </Label>
                          <p className="mt-1 font-semibold text-white">
                            {selectedItem?.category}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-yellow-400">
                            Type
                          </Label>
                          <p className="mt-1 font-semibold text-white">
                            {selectedItem?.type}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-purple-400">
                            Rarity
                          </Label>
                          <Badge
                            className={`mt-1 font-bold ${RARITY_COLORS[selectedItem?.rarity as keyof typeof RARITY_COLORS] || "from-gray-500 to-gray-700"} border-0 bg-gradient-to-r text-white`}
                          >
                            {selectedItem?.rarity}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-green-400">
                            Power
                          </Label>
                          <p className="mt-1 font-semibold text-white">
                            {selectedItem?.power}
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-cyan-400">
                          Effect
                        </Label>
                        <p className="mt-1 font-semibold text-white">
                          {selectedItem?.effect}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-400">
                          Description
                        </Label>
                        <p className="mt-2 leading-relaxed text-white">
                          {selectedItem?.description}
                        </p>
                      </div>

                      <div className="flex gap-4 border-t border-gray-700/50 pt-4 text-sm text-gray-400">
                        <div className="flex flex-col">
                          <span className="text-xs tracking-wider text-gray-500 uppercase">
                            Created
                          </span>
                          <span className="font-medium text-white">
                            {selectedItem?.createdAt
                              ? new Date(
                                  selectedItem.createdAt,
                                ).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="border-t border-gray-700/50 pt-6">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSaveEdit}
                      disabled={isUploading}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 font-bold text-white transition-transform hover:scale-105 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="border-gray-600 bg-gray-800/60 text-gray-300"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleEditClick}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 font-bold text-white transition-transform hover:scale-105"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Modify Power-Up
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => selectedItem && handleDelete(selectedItem)}
                      className="border-red-500/50 font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Item
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create/Edit Item Dialog */}
          <Dialog
            open={open}
            onOpenChange={(open) => {
              setOpen(open);
              if (!open) {
                resetForm();
              }
            }}
          >
            <DialogContent className="max-w-4xl rounded-3xl border border-red-500/30 bg-gray-900/95 text-white shadow-2xl backdrop-blur-2xl">
              <DialogHeader className="pb-4">
                <DialogTitle className="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-2xl font-black text-transparent">
                  {editingItem ? "Enhance Power-Up" : "Forge New Item"}
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  Craft your ultimate game item with legendary properties
                </DialogDescription>
              </DialogHeader>

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 py-4 lg:grid-cols-3">
                {/* Left Column - Form Fields */}
                <div className="space-y-4 lg:col-span-2">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Item Name */}
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-sm font-medium text-red-300">
                        Power-Up Name
                      </Label>
                      <Input
                        placeholder="Enter legendary name..."
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="border-red-500/30 bg-gray-800/60 text-white focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-blue-300">
                        Category
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger className="border-blue-500/30 bg-gray-800/60 text-white focus:ring-1 focus:ring-blue-500/30">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="border-blue-500/30 bg-gray-800 text-white">
                          {CATEGORIES.filter(cat => cat !== "All Categories").map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-yellow-300">
                        Type
                      </Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger className="border-yellow-500/30 bg-gray-800/60 text-white focus:ring-1 focus:ring-yellow-500/30">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="border-yellow-500/30 bg-gray-800 text-white">
                          {TYPES.filter(type => type !== "All Types").map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rarity */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-purple-300">
                        Rarity
                      </Label>
                      <Select
                        value={formData.rarity}
                        onValueChange={(value) =>
                          setFormData({ ...formData, rarity: value })
                        }
                      >
                        <SelectTrigger className="border-purple-500/30 bg-gray-800/60 text-white focus:ring-1 focus:ring-purple-500/30">
                          <SelectValue placeholder="Select rarity" />
                        </SelectTrigger>
                        <SelectContent className="border-purple-500/30 bg-gray-800 text-white">
                          {RARITIES.filter(rarity => rarity !== "All Rarities").map((rarity) => (
                            <SelectItem key={rarity} value={rarity}>
                              {rarity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Power Level */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-green-300">
                        Power Level
                      </Label>
                      <Select
                        value={formData.power}
                        onValueChange={(value) =>
                          setFormData({ ...formData, power: value })
                        }
                      >
                        <SelectTrigger className="border-green-500/30 bg-gray-800/60 text-white focus:ring-1 focus:ring-green-500/30">
                          <SelectValue placeholder="Select power" />
                        </SelectTrigger>
                        <SelectContent className="border-green-500/30 bg-gray-800 text-white">
                          {POWER_LEVELS.map((power) => (
                            <SelectItem key={power} value={power}>
                              {power}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Effect */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-cyan-300">
                        Effect
                      </Label>
                      <Select
                        value={formData.effect}
                        onValueChange={(value) =>
                          setFormData({ ...formData, effect: value })
                        }
                      >
                        <SelectTrigger className="border-cyan-500/30 bg-gray-800/60 text-white focus:ring-1 focus:ring-cyan-500/30">
                          <SelectValue placeholder="Select effect" />
                        </SelectTrigger>
                        <SelectContent className="border-cyan-500/30 bg-gray-800 text-white">
                          {EFFECTS.map((effect) => (
                            <SelectItem key={effect} value={effect}>
                              {effect}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">
                      Legendary Description
                    </Label>
                    <Textarea
                      placeholder="Describe your powerful creation..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="min-h-[100px] border-gray-600 bg-gray-800/60 text-white focus:border-red-500/30 focus:ring-1 focus:ring-red-500/30"
                    />
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="space-y-4 lg:col-span-1">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-red-300">
                      Power-Up Image
                    </Label>

                    {createImageUrl ? (
                      <div className="group relative w-full overflow-hidden rounded-2xl border-2 border-red-500/30 bg-gray-800/50">
                        <div className="aspect-square w-full overflow-hidden">
                          <img
                            src={createImageUrl}
                            alt="Preview"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute top-3 right-3 border-none bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
                          onClick={() => {
                            setCreateImageUrl(null);
                            setCreateImageName(null);
                            if (createInputRef.current)
                              createInputRef.current.value = "";
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {createImageName && (
                          <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <p className="truncate text-xs text-gray-200">
                              {createImageName}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        onClick={() => createInputRef.current?.click()}
                        className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-500/30 bg-gray-800/40 p-6 transition-all hover:border-red-500/50 hover:bg-gray-800/60"
                      >
                        <ImageIcon className="mb-3 h-12 w-12 text-red-400" />
                        <p className="text-center text-sm font-medium text-gray-300">
                          Upload Power-Up Image
                        </p>
                        <p className="mt-1 text-center text-xs text-gray-400">
                          PNG, JPG, WEBP up to 5MB
                        </p>
                      </div>
                    )}

                    <input
                      ref={createInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error("❌ Image size must be less than 5MB");
                            return;
                          }
                          handleImageSelect(file, "create");
                        }
                      }}
                      className="hidden"
                    />
                  </div>

                  {/* Image Upload Status */}
                  {isUploading && (
                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-ping rounded-full bg-blue-500"></div>
                        <p className="text-xs font-medium text-blue-400">
                          Uploading image...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <DialogFooter className="flex flex-col gap-2 border-t border-gray-700/50 pt-4 sm:flex-row sm:justify-between sm:gap-0">
                <div className="text-xs text-gray-400">
                  {editingItem
                    ? "Enhancing existing power-up"
                    : "Forging new legendary item"}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="border-gray-600 bg-gray-800/60 text-gray-300"
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isUploading || !formData.name.trim()}
                    className="bg-gradient-to-r from-red-500 to-yellow-500 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isUploading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Forging...
                      </>
                    ) : editingItem ? (
                      "Enhance Power-Up"
                    ) : (
                      "Forge Item"
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AuthGuard>
  );
}