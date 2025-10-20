"use client";

import { useEffect, useState, useRef } from "react";
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

export default function GameItemsPage() {
  const [gameItems, setGameItems] = useState<GameItem[]>([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GameItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
      toast("Uploading image...", { id: "upload" });
    },
    onUploadError: (error) => {
      toast.error(`Upload failed: ${error.message}`, { id: "upload" });
    },
  });

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/characters");
      if (!res.ok) throw new Error("Failed to load items");
      const data = await res.json();
      setGameItems(data.items || []);
    } catch (err) {
      toast.error("Failed to load game items");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!formData.name.trim()) {
      toast.error("Item name is required!");
      return;
    }

    if (editingItem) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  }

  async function handleCreate() {
    if (!createInputRef.current?.files?.length && !formData.imageUrl) {
      toast.error("Please select an image to upload.");
      return;
    }

    try {
      toast.loading("Creating item...", { id: "save" });

      let finalImageUrl = formData.imageUrl;

      // If there's a file to upload, upload it first and wait for completion
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

      // Create the item with the final image URL
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

      if (!res.ok) throw new Error("Failed to create item");

      toast.success("Item created successfully!", { id: "save" });
      setOpen(false);
      resetForm();
      await loadItems(); // Wait for items to reload
    } catch (error: any) {
      toast.error(error.message, { id: "save" });
    }
  }

  async function handleUpdate() {
    if (!editingItem) return;

    try {
      toast.loading("Updating item...", { id: "update" });

      let finalImageUrl = formData.imageUrl || editingItem.imageUrl; // Use existing image if no new one

      // If there's a new image in edit dialog, upload it first and wait for completion
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

        // Get the URL directly from the upload result
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

      if (!res.ok) throw new Error("Failed to update item");

      toast.success("Item updated successfully!", { id: "update" });
      setOpen(false);
      setViewOpen(false);
      resetForm();
      await loadItems(); // Wait for items to reload
    } catch (error: any) {
      toast.error(error.message, { id: "update" });
    }
  }

  async function handleDelete(item: GameItem) {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    try {
      toast.loading("Deleting item...", { id: "delete" });

      const res = await fetch(`/api/characters/${item.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete item");

      toast.success("Item deleted successfully!", { id: "delete" });
      setViewOpen(false);
      setSelectedItem(null);
      loadItems();
    } catch (error: any) {
      toast.error(error.message, { id: "delete" });
    }
  }

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

    // Clear file inputs
    if (createInputRef.current) createInputRef.current.value = "";
    if (editInputRef.current) editInputRef.current.value = "";
  }

  function handleImageSelect(file: File, type: "create" | "edit") {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
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
  }

  const filteredItems = gameItems.filter((item) =>
    [item.name, item.category, item.type, item.rarity]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

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

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between gap-4"
          >
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search power-ups, weapons, items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-red-500/30 bg-gray-800/60 pl-10 text-white placeholder-gray-400 backdrop-blur-sm focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
              />
            </div>
            <Badge
              variant="outline"
              className="border-yellow-500/50 bg-yellow-500/10 px-3 py-1 font-bold text-yellow-400 backdrop-blur-sm"
            >
              {filteredItems.length} ITEMS READY
            </Badge>
          </motion.div>

          {/* Items Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {filteredItems.map((item, i) => (
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
                        <Badge
                          variant="outline"
                          className="border-blue-500/30 bg-blue-500/10 font-medium text-blue-300"
                        >
                          {item.category}
                        </Badge>
                        <ExternalLink className="h-4 w-4 text-gray-400 transition-colors group-hover:text-yellow-400" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* View Item Dialog - Power Up Selection */}
          <Dialog
            open={viewOpen}
            onOpenChange={(open) => {
              setViewOpen(open);
              if (!open) {
                setIsEditing(false);
                setEditImageUrl(null);
                setEditImageName(null);
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
                              {CATEGORIES.map((category) => (
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
                              {TYPES.map((type) => (
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
                              {RARITIES.map((rarity) => (
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
                          {CATEGORIES.map((category) => (
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
                          {TYPES.map((type) => (
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
                          {RARITIES.map((rarity) => (
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
                            toast.error("Image size must be less than 5MB");
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
