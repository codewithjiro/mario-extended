"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  ArrowLeft,
  Gamepad2,
  Pencil,
  Trash2,
  UserPlus,
  X,
  Eye,
  Zap,
  Shield,
  Crown,
  Sparkles,
  Search,
  Filter,
  Users,
  Star,
  ExternalLink,
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

type Character = {
  id: number;
  name: string;
  type: string;
  power: string;
  description: string;
  imageUrl: string;
};

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(
    null,
  );
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    power: "",
    description: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCharacters();
  }, []);

  async function loadCharacters() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/characters", {
      });

      if (!res.ok) {
        throw new Error(`Failed to load: ${res.status}`);
      }

      const data = await res.json();
      setCharacters(data.characters || []);
    } catch (error: any) {
      console.error("Failed to load characters:", error);
      setError(error.message);
      toast.error("Failed to load characters");
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
      const method = editingCharacter ? "PUT" : "POST";
      const url = editingCharacter
        ? `/api/characters/${editingCharacter.id}`
        : "/api/characters";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save character!");
      }

      toast.success(
        editingCharacter
          ? "🎉 Character updated successfully!"
          : "✨ Character added successfully!",
      );
      setOpen(false);
      setFormData({
        name: "",
        type: "",
        power: "",
        description: "",
        imageUrl: "",
      });
      setEditingCharacter(null);
      loadCharacters();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleDelete(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this character?",
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/characters/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete character");
      }

      toast.success("🗑️ Character deleted!");
      setDetailOpen(false);
      loadCharacters();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function handleEdit(ch: Character) {
    setEditingCharacter(ch);
    setFormData({
      name: ch.name,
      type: ch.type,
      power: ch.power,
      description: ch.description,
      imageUrl: ch.imageUrl,
    });
    setOpen(true);
    setDetailOpen(false);
  }

  function handleCardClick(ch: Character) {
    setSelectedCharacter(ch);
    setDetailOpen(true);
  }

  const filteredCharacters = characters.filter(
    (character) =>
      character.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.power?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const heroCount = characters.filter((ch) => ch.type === "Hero").length;
  const enemyCount = characters.filter((ch) => ch.type === "Enemy").length;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-8 sm:px-6 lg:px-8">
        {/* Enhanced Background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-red-500/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500/5 blur-3xl"></div>
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
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 opacity-75 blur-lg"></div>
                <div className="relative rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 p-3 shadow-2xl">
                  <Users className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="bg-size-200 animate-gradient bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-clip-text text-4xl font-black text-transparent">
                  MarioX Characters
                </h1>
                <p className="mt-1 text-sm font-medium text-gray-300">
                  Manage the legendary characters of the Mario universe
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => {
                  setEditingCharacter(null);
                  setFormData({
                    name: "",
                    type: "",
                    power: "",
                    description: "",
                    imageUrl: "",
                  });
                  setOpen(true);
                }}
                className="hover:shadow-3xl flex items-center gap-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-2xl transition-all hover:scale-105 hover:from-red-600 hover:to-yellow-600"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Character</span>
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
                      Total Characters
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {characters.length}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-gray-800/60 to-gray-900/60 shadow-2xl backdrop-blur-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Heroes</p>
                    <p className="text-3xl font-bold text-white">{heroCount}</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-3">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-gray-800/60 to-gray-900/60 shadow-2xl backdrop-blur-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Enemies</p>
                    <p className="text-3xl font-bold text-white">
                      {enemyCount}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 p-3">
                    <Zap className="h-6 w-6 text-white" />
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
                placeholder="Search characters by name, type, or power..."
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
                {filteredCharacters.length} characters
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

          {/* Character Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="wait">
              {filteredCharacters.map((ch, index) => (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.2 },
                  }}
                  className="group cursor-pointer"
                  onClick={() => handleCardClick(ch)}
                >
                  <Card className="group-hover:shadow-3xl h-full overflow-hidden border border-gray-700/50 bg-gray-800/40 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:border-yellow-500/30">
                    <div className="relative overflow-hidden">
                      <img
                        src={ch.imageUrl || "/api/placeholder/400/300"}
                        alt={ch.name}
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
                          {ch.name}
                        </h3>
                        <Badge
                          className={`${
                            ch.type === "Hero"
                              ? "border-green-500/30 bg-green-500/20 text-green-400"
                              : "border-red-500/30 bg-red-500/20 text-red-400"
                          } border backdrop-blur-sm`}
                        >
                          {ch.type}
                        </Badge>
                      </div>

                      <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-400">
                        {ch.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                        >
                          <Zap className="mr-1 h-3 w-3" />
                          {ch.power}
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
          {!loading && filteredCharacters.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="mb-6 rounded-3xl border border-gray-700/50 bg-gray-800/40 p-8 backdrop-blur-sm">
                <Users className="h-16 w-16 text-gray-500" />
              </div>
              <h3 className="mb-3 text-2xl font-black text-white">
                {searchTerm ? "No characters found" : "No characters yet"}
              </h3>
              <p className="mb-6 max-w-md text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "Start building your Mario universe by adding the first character!"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setOpen(true)}
                  className="hover:shadow-3xl bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-2xl"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add First Character
                </Button>
              )}
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-500"></div>
                <p className="mt-4 text-gray-400">Loading characters...</p>
              </div>
            </div>
          )}

          {/* Character Detail Dialog */}
          <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
            <DialogContent className="max-w-4xl border-0 bg-gray-800/95 text-white shadow-2xl backdrop-blur-2xl">
              {selectedCharacter && (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 p-3">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <DialogTitle className="text-3xl font-black text-white">
                          {selectedCharacter.name}
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Character Details & Information
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="grid grid-cols-1 gap-8 py-6 lg:grid-cols-2">
                    {/* Character Image */}
                    <div className="space-y-4">
                      <div className="overflow-hidden rounded-2xl border border-gray-600/50">
                        <img
                          src={
                            selectedCharacter.imageUrl ||
                            "/api/placeholder/500/400"
                          }
                          alt={selectedCharacter.name}
                          className="h-64 w-full object-cover lg:h-80"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge
                          className={`text-sm ${
                            selectedCharacter.type === "Hero"
                              ? "border-green-500/30 bg-green-500/20 text-green-400"
                              : "border-red-500/30 bg-red-500/20 text-red-400"
                          } border backdrop-blur-sm`}
                        >
                          {selectedCharacter.type}
                        </Badge>
                        <Badge className="border border-yellow-500/30 bg-yellow-500/20 text-yellow-400 backdrop-blur-sm">
                          <Zap className="mr-1 h-3 w-3" />
                          {selectedCharacter.power}
                        </Badge>
                      </div>
                    </div>

                    {/* Character Info */}
                    <div className="space-y-6">
                      <div>
                        <Label className="mb-2 text-sm font-medium text-gray-400">
                          Description
                        </Label>
                        <p className="leading-relaxed text-gray-300">
                          {selectedCharacter.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-400">
                            Character Type
                          </Label>
                          <div className="font-semibold text-white">
                            {selectedCharacter.type}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-400">
                            Power Level
                          </Label>
                          <div className="font-semibold text-yellow-400">
                            {selectedCharacter.power}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => handleEdit(selectedCharacter)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(selectedCharacter.id)}
                          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
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
                  <div className="rounded-xl bg-gradient-to-r from-red-500 to-yellow-500 p-2">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-black text-white">
                      {editingCharacter
                        ? "Edit Character"
                        : "Create New Character"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {editingCharacter
                        ? "Update character details"
                        : "Add a new character to the Mario universe"}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">
                    Character Name
                  </Label>
                  <Input
                    placeholder="e.g., Mario, Luigi, Bowser"
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
                      Type
                    </Label>
                    <Input
                      placeholder="Hero or Enemy"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">
                      Power
                    </Label>
                    <Input
                      placeholder="e.g., Fire, Jump, Flight"
                      value={formData.power}
                      onChange={(e) =>
                        setFormData({ ...formData, power: e.target.value })
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
                    placeholder="Describe the character's role, abilities, and personality..."
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
                    placeholder="https://example.com/character-image.jpg"
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
                  className="bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-lg hover:from-red-600 hover:to-yellow-600 hover:shadow-xl"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {editingCharacter ? "Save Changes" : "Create Character"}
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
