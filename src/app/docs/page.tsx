"use client";

import { UserButton } from "@clerk/nextjs";
import {
  Database,
  KeyRound,
  BookOpen,
  Star,
  Gamepad2,
  Rocket,
  Zap,
  Shield,
  Copy,
  Check,
  Terminal,
  Search,
  Sparkles,
  Crown,
  Activity,
  Code,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import AuthGuard from "~/components/AuthGuard";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const baseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";

export default function DocsPage() {
  const [key, setKey] = useState("");
  const [out, setOut] = useState("");
  const [charactersData, setCharactersData] = useState<any[]>([]);
  const [postResults, setPostResults] = useState<any[]>([]);
  const [postBody, setPostBody] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // GET all characters
  async function runGET() {
    const res = await fetch(`${baseUrl}/api/echo`, {
      headers: {
        "x-api-key": key,
      },
    });

    const data = await res.json();
    setOut(JSON.stringify(data, null, 2));

    if (data.data) {
      setCharactersData(data.data);
      setPostResults([]);
    } else {
      setCharactersData([]);
    }
  }

  // POST search character by name
  async function runPOST() {
    const res = await fetch(`${baseUrl}/api/echo`, {
      method: "POST",
      headers: {
        "x-api-key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postBody }),
    });

    const data = await res.json();
    setOut(JSON.stringify(data, null, 2));

    if (data.character) {
      setPostResults(
        Array.isArray(data.character) ? data.character : [data.character],
      );
      setCharactersData([]);
    } else {
      setPostResults([]);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const curlCommands = {
    ping: `curl -H 'x-api-key: YOUR_API_KEY' ${baseUrl}/api/ping`,
    characters: `curl -X POST \\\n-H 'x-api-key: YOUR_API_KEY' \\\n-H 'Content-Type: application/json' \\\n-d '{"postBody": "Mario"}' \\\n${baseUrl}/api/characters`,
  };

  async function runOPTIONS() {
    const res = await fetch(`${baseUrl}/api/echo`, {
      method: "OPTIONS",
      // headers: {
      //   Origin: "https://localhost:3000",
      //   "Access-Control-Request-Method": "POST",
      //   "Access-Control-Request-Headers": "x-api-key, Content-Type",
      // },
    });
    setOut(
      "Status: $(res.status)\n" +
        Array.from(res.headers.entries())
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n"),
    );
  }
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-8 sm:px-6 lg:px-8">
        {/* Enhanced Animated Background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-red-500/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-yellow-500/20 blur-3xl delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-blue-500/10 blur-3xl delay-500"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] bg-[size:64px_64px]"></div>
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
                <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 opacity-75 blur-lg"></div>
                <div className="relative rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 p-3 shadow-2xl">
                  <Gamepad2 className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="bg-size-200 animate-gradient bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-clip-text text-4xl font-black text-transparent">
                  MarioX
                </h1>
                <p className="mt-1 text-sm font-medium text-gray-300">
                  Developer Documentation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-yellow-500/40 bg-yellow-500/15 text-yellow-400 backdrop-blur-sm transition-all hover:scale-105 hover:bg-yellow-500/25 hover:shadow-2xl hover:shadow-yellow-500/25"
                >
                  <KeyRound className="h-4 w-4" /> Dashboard
                </Button>
              </Link>
              <div className="rounded-2xl border border-gray-600/50 bg-gray-700/60 p-2 shadow-lg backdrop-blur-xl">
                <UserButton
                  appearance={{
                    elements: { avatarBox: "h-9 w-9 rounded-xl" },
                  }}
                />
              </div>
            </div>
          </motion.header>

          {/* Enhanced Documentation Section */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            {/* Main Documentation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8 xl:col-span-2"
            >
              {/* Welcome Card */}
              <Card className="border-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 shadow-2xl backdrop-blur-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 p-3 shadow-lg">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <Badge className="border-0 bg-gradient-to-r from-red-500 to-yellow-500 text-white">
                        <Sparkles className="mr-2 h-3 w-3" />
                        Developer Guide
                      </Badge>
                      <h2 className="text-3xl font-black text-white">
                        Welcome to the{" "}
                        <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                          MarioX
                        </span>
                      </h2>
                      <p className="text-lg leading-relaxed text-gray-300">
                        This documentation provides everything you need to
                        integrate with the MarioX API. Learn how to
                        authenticate, query data, and manage access to Mario
                        characters and power-ups — all through a secure and
                        RESTful interface.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Tabs for Documentation */}
              <Card className="border-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 shadow-2xl backdrop-blur-2xl">
                <CardHeader>
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 bg-gray-700/50 backdrop-blur-sm">
                      <TabsTrigger
                        value="overview"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-yellow-500"
                      >
                        <Rocket className="mr-2 h-4 w-4" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="endpoints"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500"
                      >
                        <Terminal className="mr-2 h-4 w-4" />
                        Endpoints
                      </TabsTrigger>
                      <TabsTrigger
                        value="examples"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500"
                      >
                        <Code className="mr-2 h-4 w-4" />
                        Examples
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6 space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">
                          Base URL
                        </h3>
                        <div className="flex items-center gap-3 rounded-2xl border border-gray-600/50 bg-gray-700/30 p-4 backdrop-blur-sm">
                          <code className="flex-1 font-mono text-sm break-all text-yellow-400">
                            {baseUrl}/api
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(`${baseUrl}/api`)}
                            className="flex-shrink-0 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                          >
                            {copied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <Card className="border border-gray-600/50 bg-gray-700/30 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm text-white">
                              <Shield className="h-4 w-4 text-green-400" />
                              Authentication
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-gray-300">
                              All API requests require an{" "}
                              <code className="text-yellow-400">x-api-key</code>{" "}
                              header with your secret key. Get your keys from
                              the dashboard.
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border border-gray-600/50 bg-gray-700/30 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm text-white">
                              <Zap className="h-4 w-4 text-yellow-400" />
                              Rate Limiting
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-gray-300">
                              Starter: 5 requests / 10s
                              <br />
                              Professional: 300 requests / minute
                              <br />
                              Enterprise: Unlimited
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="endpoints" className="mt-6 space-y-6">
                      <div className="space-y-4">
                        {/* GET Endpoint */}
                        <Card className="border border-green-500/20 bg-green-500/5 backdrop-blur-sm">
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-white">
                              <Badge className="bg-green-500 text-xs text-white">
                                GET
                              </Badge>
                              /api/ping
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              Test your API connection and key validity
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-0">
                            <div className="rounded-xl border border-gray-600/50 bg-gray-800/50 p-4">
                              <code className="font-mono text-sm break-all whitespace-pre-wrap text-yellow-400">
                                {curlCommands.ping}
                              </code>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(curlCommands.ping)}
                              className="border-green-500/30 text-green-400"
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Copy cURL
                            </Button>
                          </CardContent>
                        </Card>

                        {/* POST Endpoint */}
                        <Card className="border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-white">
                              <Badge className="bg-blue-500 text-xs text-white">
                                POST
                              </Badge>
                              /api/characters
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              Search for characters by name
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-0">
                            <div className="rounded-xl border border-gray-600/50 bg-gray-800/50 p-4">
                              <code className="font-mono text-sm break-all whitespace-pre-wrap text-yellow-400">
                                {curlCommands.characters}
                              </code>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                copyToClipboard(curlCommands.characters)
                              }
                              className="border-blue-500/30 text-blue-400"
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Copy cURL
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="examples" className="mt-6 space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">
                          JavaScript Example
                        </h4>
                        <div className="rounded-xl border border-gray-600/50 bg-gray-800/50 p-4">
                          <code className="font-mono text-sm break-all whitespace-pre-wrap text-green-400">
                            {`// Fetch character data
const response = await fetch('${baseUrl}/api/characters', {
  method: 'POST',
  headers: {
    'x-api-key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    postBody: 'Mario'
  })
});

const data = await response.json();
console.log(data);`}
                          </code>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Enhanced API Tester - Fixed Layout */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="xl:col-span-1"
            >
              <Card className="h-fit border-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 shadow-2xl backdrop-blur-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="rounded-xl bg-gradient-to-r from-red-500 to-yellow-500 p-2">
                      <Terminal className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-black">API Playground</div>
                      <CardDescription className="text-gray-400">
                        Test endpoints in real-time
                      </CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* API Key Input */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <KeyRound className="h-4 w-4 text-yellow-500" />
                      Your API Key
                    </Label>
                    <Input
                      placeholder="Enter your MarioX API key (sk...)"
                      className="border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm placeholder:text-gray-400 focus:border-yellow-500"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={runGET}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-sm text-white shadow-lg transition-all hover:shadow-xl"
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      Test GET
                    </Button>
                    <Button
                      onClick={runPOST}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-sm text-white shadow-lg transition-all hover:shadow-xl"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Test POST
                    </Button>
                    <Button
                      onClick={runOPTIONS}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 text-sm text-white shadow-lg transition-all hover:shadow-xl"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Test OPTIONS
                    </Button>
                  </div>

                  {/* POST Body Input */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">
                      Search Character
                    </Label>
                    <Textarea
                      className="min-h-[80px] resize-none border-gray-600 bg-gray-700/50 font-mono text-sm text-white backdrop-blur-sm placeholder:text-gray-400"
                      placeholder='{"postBody": "Mario"}'
                      value={postBody}
                      onChange={(e) => setPostBody(e.target.value)}
                    />
                  </div>

                  {/* Response Output */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      API Response
                    </Label>
                    <Textarea
                      className="min-h-[200px] resize-none border-gray-600 bg-gray-800/50 font-mono text-sm text-gray-200 backdrop-blur-sm"
                      readOnly
                      value={out || "// Response will appear here..."}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Enhanced Search Results - Fixed positioning
          <AnimatePresence>
            {postResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8"
              >
                <Card className="border-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 shadow-2xl backdrop-blur-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <div className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-2">
                        <Search className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        Search Results
                        <CardDescription className="text-gray-400">
                          Found {postResults.length} character(s)
                        </CardDescription>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {postResults.map((character, index) => (
                        <motion.div
                          key={character.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group rounded-2xl border border-gray-600/50 bg-gray-700/30 p-4 backdrop-blur-sm transition-all hover:border-yellow-500/30 hover:shadow-lg"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h3 className="text-lg font-bold text-yellow-400 transition-colors group-hover:text-yellow-300">
                                {character.name}
                              </h3>
                              <Badge className="border-0 bg-gradient-to-r from-red-500 to-yellow-500 text-xs text-white">
                                {character.type}
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium">Power:</span>
                                <span>{character.power}</span>
                              </div>
                              <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">
                                {character.description}
                              </p>
                            </div>

                            {character.imageUrl && (
                              <div className="mt-2 overflow-hidden rounded-xl border border-gray-600/50">
                                <img
                                  src={character.imageUrl}
                                  alt={character.name}
                                  className="h-32 w-full object-cover transition-transform group-hover:scale-105"
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence> */}
        </div>
      </div>
    </AuthGuard>
  );
}
