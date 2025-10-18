"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import {
  BookOpen,
  Plus,
  XCircle,
  Key,
  Calendar,
  Zap,
  Star,
  Crown,
  Sparkles,
  Gamepad2,
  Trophy,
  Shield,
  Coins,
  Rocket,
  User,
  Users,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import CopyButton from "../../components/copy-button";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import AuthGuard from "../../components/AuthGuard";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { CreateKeySchema } from "~/server/validation";

type KeyItem = {
  id: string;
  name: string;
  masked: string;
  createdAt: number | string;
  revoked: boolean;
};

export default function DashboardPage() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [justCreated, setjustCreated] = useState<{
    key: string;
    id: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<KeyItem[]>([]);

  async function createKey() {
    setLoading(true);
    try {
      const parsed = CreateKeySchema.safeParse({ name });
      if (!parsed.success) {
        const firstError = parsed.error.errors[0]?.message ?? "Invalid input";
        toast.error(firstError);
        return;
      }

      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (res.ok) {
        setjustCreated({ key: data.key, id: data.id });
        toast.success("🎉 New Power-Up created successfully!");
        setName("");
        setOpen(false);
        await load();
      } else toast.error(data.error ?? "Level failed! Try again!");
    } finally {
      setLoading(false);
    }
  }

  async function load() {
    const res = await fetch("/api/keys", { cache: "no-store" });
    const data = await res.json();
    setItems(data.items ?? []);
  }

  async function revokeKey(id: string) {
    const res = await fetch(`/api/keys?keyId=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) alert(data.error ?? "Something went wrong");
    toast.success("🔴 Power-Up revoked");
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-8 sm:px-6 lg:px-8">
        {/* Animated Background Elements */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-red-500/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500/5 blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl backdrop-blur-2xl lg:flex-row lg:items-center"
          >
            {/* Left Section: Logo */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 opacity-75 blur-lg"></div>
                <div className="relative rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 p-3 shadow-2xl">
                  <Gamepad2 className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="bg-size-200 animate-gradient bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-clip-text text-3xl font-black text-transparent">
                  MarioX
                </h1>
                <p className="mt-1 text-sm font-medium text-gray-300">
                  API Power-Up Dashboard
                </p>
              </div>
            </div>

            {/* Right Section: Navigation + User */}
            <div className="flex w-full items-center justify-end gap-2 lg:w-auto">
              {/* Characters */}
              <Link href="/characters">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-red-500/30 bg-red-500/10 text-red-400 backdrop-blur-sm transition-all hover:scale-105 hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/20"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Characters</span>
                </Button>
              </Link>

              {/* Power-Ups */}
              <Link href="/powerups">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-yellow-500/30 bg-yellow-500/10 text-yellow-400 backdrop-blur-sm transition-all hover:scale-105 hover:bg-yellow-500/20 hover:shadow-lg hover:shadow-yellow-500/20"
                >
                  <Rocket className="h-4 w-4" />
                  <span className="hidden sm:inline">Power-Ups</span>
                </Button>
              </Link>

              {/* Adventure Guide */}
              <Link href="/docs">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-blue-500/30 bg-blue-500/10 text-blue-400 backdrop-blur-sm transition-all hover:scale-105 hover:bg-blue-500/20 hover:shadow-lg hover:shadow-blue-500/20"
                  aria-label="View Documentation"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Adventure Guide</span>
                </Button>
              </Link>

              {/* User Button */}
              <div className="rounded-2xl border border-gray-600/50 bg-gray-700/60 p-2 shadow-lg backdrop-blur-xl">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8 rounded-xl",
                    },
                  }}
                />
              </div>
            </div>
          </motion.header>

          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 shadow-2xl backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="flex flex-col items-start gap-8 p-8 md:flex-row md:items-center">
                  <div className="flex-1 space-y-6">
                    <div>
                      <Badge className="mb-3 border-0 bg-gradient-to-r from-red-500 to-yellow-500 text-white">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Welcome Back, Hero!
                      </Badge>
                      <h2 className="text-3xl font-black text-white">
                        Ready for your next{" "}
                        <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                          Adventure, {user?.firstName || "Mario"}!
                        </span>
                      </h2>
                      <p className="mt-3 text-lg text-gray-300">
                        Manage your Power-Up keys and conquer the API world with
                        MarioX magic!
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex items-center gap-3 rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-3 backdrop-blur-sm">
                        <div className="rounded-lg bg-red-500/20 p-2">
                          <Key className="h-4 w-4 text-red-400" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {items.length}
                          </div>
                          <div className="text-sm text-gray-400">Power-Ups</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-3 backdrop-blur-sm">
                        <div className="rounded-lg bg-yellow-500/20 p-2">
                          <Zap className="h-4 w-4 text-yellow-400" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {items.filter((i) => !i.revoked).length}
                          </div>
                          <div className="text-sm text-gray-400">Active</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center">
                    {/* Gradient Glow */}
                    <div className="absolute -inset-8 z-0 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 opacity-30 blur-2xl"></div>

                    {/* Mario GIF Container */}
                    <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl ring-2 ring-yellow-500/30">
                      <img
                        src="https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyOHE4NHFraGFxOXNrbDl1ejAydWYxOG5obzg5MjV6bmRoOHk1OG01NyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/OZ1VAPExqf1G40bBAt/giphy.gif"
                        alt="Mario Adventure"
                        className="h-48 w-48 object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 bg-gray-800/60 p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-yellow-500" />
                    <p className="text-sm text-gray-300">
                      <strong className="text-yellow-400">Pro Tip:</strong>{" "}
                      Guard your Power-Ups like stars! Rotate them regularly and
                      revoke when not in use.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Generate API Key */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 shadow-2xl backdrop-blur-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gradient-to-r from-red-500 to-yellow-500 p-2">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-white">
                          Create Power-Up Key
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Forge a new key to unlock the Mario universe API
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-lg transition-all hover:scale-105 hover:from-red-600 hover:to-yellow-600 hover:shadow-xl"
                        aria-label="Create API Key"
                      >
                        <Plus className="h-4 w-4" /> New Power-Up
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-0 bg-gray-800/95 text-white shadow-2xl backdrop-blur-xl">
                      <DialogHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-gradient-to-r from-red-500 to-yellow-500 p-2">
                            <Crown className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <DialogTitle className="text-xl text-white">
                              Create New Power-Up
                            </DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Give your new API key a memorable name
                            </DialogDescription>
                          </div>
                        </div>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Input
                          placeholder="e.g., Mushroom Kingdom Server"
                          aria-label="API Key Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm placeholder:text-gray-400 focus:border-yellow-500"
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={createKey}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-red-500 to-yellow-500 text-white transition-all hover:from-red-600 hover:to-yellow-600 hover:shadow-lg"
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              Creating Power-Up...
                            </div>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" /> Create Power-Up
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent>
                <AnimatePresence>
                  {justCreated && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6 shadow-inner backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-yellow-500/20 p-2">
                          <Coins className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-yellow-500">
                            Your New Power-Up Key!
                          </p>
                          <p className="text-sm text-yellow-400/80">
                            Guard this like a precious star ⭐
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-600 bg-gray-800/50 p-4 backdrop-blur-sm">
                        <code className="flex-1 font-mono text-sm break-all text-gray-200">
                          {justCreated.key}
                        </code>
                        <CopyButton value={justCreated.key} />
                      </div>
                      <p className="mt-3 text-xs text-yellow-400/70">
                        🎮 This key will only be shown once! Save it somewhere
                        safe.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Your Keys Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 shadow-2xl backdrop-blur-xl">
              <CardHeader className="border-b border-gray-700 pb-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-2">
                        <Gamepad2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-white">
                          Your Power-Up Collection
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Manage and monitor all your active API keys
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-green-500/50 bg-green-500/10 text-green-400 backdrop-blur-sm"
                  >
                    <Zap className="mr-1 h-3 w-3" />
                    {items.filter((i) => !i.revoked).length} Active
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  {items.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                      {items.map((row) => (
                        <motion.div
                          key={row.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ y: -8, transition: { duration: 0.2 } }}
                          className="group flex flex-col justify-between rounded-2xl border border-gray-700 bg-gray-800/60 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-2xl hover:shadow-yellow-500/10"
                        >
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <h3 className="text-lg font-bold text-white">
                                {row.name}
                              </h3>
                              <Badge
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  row.revoked
                                    ? "border-red-500/30 bg-red-500/20 text-red-400"
                                    : "border-green-500/30 bg-green-500/20 text-green-400"
                                } border backdrop-blur-sm`}
                              >
                                {row.revoked ? "Revoked" : "Active"}
                              </Badge>
                            </div>

                            <div className="rounded-xl border border-gray-600 bg-gray-700/50 p-4 backdrop-blur-sm">
                              <code className="font-mono text-sm break-all text-gray-200">
                                {row.masked}
                              </code>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Created:{" "}
                                {new Date(row.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="mt-6 flex justify-end">
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={row.revoked}
                              onClick={() => revokeKey(row.id)}
                              className="gap-2 bg-gradient-to-r from-red-500 to-red-600 transition-all hover:from-red-600 hover:to-red-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4" />
                              Revoke Power
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="rounded-2xl border border-gray-700 bg-gray-800/60 p-6 backdrop-blur-sm">
                        <Rocket className="h-12 w-12 text-gray-500" />
                      </div>
                      <h3 className="mt-6 text-xl font-bold text-white">
                        No Power-Ups Yet!
                      </h3>
                      <p className="mt-3 max-w-sm text-gray-400">
                        Start your adventure by creating your first Power-Up key
                        to unlock the Mario universe API.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl border border-gray-700 bg-gray-800/80 p-6 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/20 p-3">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300">
                  <strong className="text-blue-400">Adventure Tip:</strong> Use
                  your Power-Ups with the{" "}
                  <code className="rounded-lg border border-gray-600 bg-gray-700/50 px-2 py-1 font-mono text-yellow-400">
                    x-api-key
                  </code>{" "}
                  header.{" "}
                  <Link
                    className="text-yellow-400 underline transition-colors hover:text-yellow-300"
                    href="/docs"
                  >
                    Check the Adventure Guide
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}
