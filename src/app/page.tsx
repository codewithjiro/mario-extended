"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Star,
  Users,
  Zap,
  Shield,
  Mail,
  MessageCircle,
  Globe,
  CheckCircle2,
  ArrowRight,
  Crown,
  Sparkles,
  Database,
  Rocket,
  Server,
  Heart,
  Code,
  GitBranch,
  DatabaseIcon,
  ShieldCheck,
  HelpCircle,
  Settings,
  FileText,
  Gamepad2,
} from "lucide-react";
import Image from "next/image";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) return null;

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-900 to-black font-sans text-white">
      {/* 🎯 MODERN NAVBAR */}
      <nav
        className={`fixed z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-gray-900/95 py-3 shadow-2xl backdrop-blur-lg"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-yellow-500 shadow-lg">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-xl font-bold text-transparent">
              MarioX
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden items-center space-x-8 md:flex">
            {["About", "Pricing", "Team", "Help", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="transform font-medium text-gray-300 transition-colors duration-200 hover:scale-105 hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <SignInButton mode="modal">
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                LogIn/SignUp
              </Button>
            </SignInButton>
          </div>
        </div>
      </nav>

      {/* 🌟 ENHANCED HERO SECTION WITH MARIO */}
      <section className="relative flex min-h-screen items-center justify-center px-6 pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-red-500/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-500/5 blur-3xl"></div>
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <div className="text-left">
            <Badge className="mb-6 border-green-500/30 bg-green-500/20 text-green-400 hover:bg-green-500/30">
              <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
              Live and Ready to Use
            </Badge>

            <h1 className="mb-6 text-6xl leading-tight font-black md:text-8xl">
              <span className="bg-size-200 animate-gradient bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
                Mario -- Extended
              </span>
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-gray-300 md:text-2xl">
              The ultimate{" "}
              <span className="font-semibold text-yellow-400">
                modern data hub
              </span>{" "}
              for everything in the Mario universe. Powered by Next.js and
              PostgreSQL with real-time capabilities.
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700"
              >
                <a href="#pricing" className="flex items-center space-x-2">
                  <span>Explore Pricing</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700"
              >
                <a href="/sign-in" className="flex items-center space-x-2">
                  <span>Admin Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid max-w-2xl grid-cols-3 gap-8 border-t border-gray-800 pt-8">
              {[
                { number: "50+", label: "Characters", icon: Users },
                { number: "25+", label: "Power-ups", icon: Star },
                { number: "99.9%", label: "Uptime", icon: Shield },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2 flex justify-center">
                    <stat.icon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-white md:text-3xl">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mario Image */}
          <div className="relative">
            <div className="relative h-[600px] w-full">
              <Image
                src="/images/hero1.png"
                alt="Mario jumping with excitement"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-yellow-500/20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-red-500/20 blur-xl"></div>
          </div>
        </div>
      </section>

      {/* 🎨 ENHANCED ABOUT SECTION WITH MARIO */}
      <section id="about" className="relative px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Mario Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative h-[500px] w-full">
                <Image
                  src="/images/about1.png"
                  alt="Mario showing power-ups"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>
              <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl"></div>
              <div className="absolute -right-6 -bottom-6 h-40 w-40 rounded-full bg-green-500/20 blur-2xl"></div>
            </div>

            {/* Text Content */}
            <div className="order-1 lg:order-2">
              <div className="text-left">
                <Badge
                  variant="outline"
                  className="mb-4 border-yellow-500/50 text-yellow-400"
                >
                  <Sparkles className="mr-2 h-3 w-3" />
                  About Platform
                </Badge>
                <h2 className="mb-6 text-5xl font-black">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Why Choose MarioX?
                  </span>
                </h2>
                <p className="mb-8 text-xl leading-relaxed text-gray-300">
                  Built for developers, by developers. Experience the most
                  comprehensive Mario universe API with enterprise-grade
                  reliability and real-time data.
                </p>
              </div>

              <div className="grid gap-6">
                {[
                  {
                    icon: Users,
                    title: "Character Database",
                    description:
                      "Detailed profiles of heroes and villains across the entire Mario franchise with rich metadata and relationships.",
                    color: "from-red-500 to-pink-500",
                  },
                  {
                    icon: Star,
                    title: "Power-Up Library",
                    description:
                      "Complete information about iconic items, their effects, historical usage, and game appearances.",
                    color: "from-yellow-500 to-orange-500",
                  },
                  {
                    icon: Zap,
                    title: "Real-time API",
                    description:
                      "Live data synchronization with webhook support for instant updates and real-time applications.",
                    color: "from-green-500 to-teal-500",
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className="group border-gray-700 bg-gray-800/30 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/50"
                  >
                    <CardHeader className="flex flex-row items-start space-y-0 pb-4">
                      <div
                        className={`h-12 w-12 bg-gradient-to-r ${feature.color} mr-4 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110`}
                      >
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-gray-400">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 💎 PREMIUM PRICING SECTION */}
      <section
        id="pricing"
        className="bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <Badge
              variant="outline"
              className="mb-4 border-yellow-500/50 text-yellow-400"
            >
              <Crown className="mr-2 h-3 w-3" />
              Pricing Plans
            </Badge>
            <h2 className="mb-6 text-5xl font-black">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "₱0",
                description: "Perfect for learning and personal projects",
                requests: "60 requests / minute",
                features: [
                  "Basic API Access",
                  "Community Support",
                  "Standard Rate Limits",
                  "Public Data Only",
                ],
                cta: "Get Started",
                popular: false,
                icon: Star,
              },
              {
                name: "Professional",
                price: "₱199",
                description: "Ideal for serious projects and applications",
                requests: "300 requests / minute",
                features: [
                  "All Starter Features",
                  "Priority Support",
                  "Webhook Support",
                  "Advanced Analytics",
                  "Early Access Features",
                ],
                cta: "Start Free Trial",
                popular: true,
                icon: Zap,
              },
              {
                name: "Enterprise",
                price: "₱999",
                description: "For mission-critical applications",
                requests: "Unlimited requests",
                features: [
                  "All Pro Features",
                  "Dedicated Support",
                  "Custom Integrations",
                  "SLA Guarantee",
                  "Custom Data Models",
                ],
                cta: "Contact Sales",
                popular: false,
                icon: Crown,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 backdrop-blur-sm ${
                  plan.popular
                    ? "scale-105 transform border-yellow-500 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 shadow-2xl shadow-yellow-500/20"
                    : "border-gray-700 bg-gray-800/30"
                } transition-all duration-300 hover:scale-105 hover:transform`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-1 text-black">
                      <Crown className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                        plan.popular
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                          : "bg-gradient-to-r from-gray-600 to-gray-700"
                      }`}
                    >
                      <plan.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="mb-2 text-2xl text-white">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-400">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-6 text-center">
                  <div className="mb-4">
                    <span className="text-4xl font-black text-white">
                      {plan.price}
                    </span>
                    {plan.price !== "₱0" && (
                      <span className="ml-2 text-gray-400">/month</span>
                    )}
                  </div>

                  <div className="mb-6 flex items-center justify-center font-semibold text-yellow-400">
                    <Database className="mr-2 h-4 w-4" />
                    {plan.requests}
                  </div>

                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3 text-gray-300"
                      >
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-400" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    asChild
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-600 hover:to-orange-600"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                    size="lg"
                  >
                    <a href="/sign-in">{plan.cta}</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 👥 TEAM SECTION */}
      <section
        id="team"
        className="bg-gradient-to-br from-gray-800 to-gray-900 px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <Badge
              variant="outline"
              className="mb-4 border-blue-500/50 text-blue-400"
            >
              <Users className="mr-2 h-3 w-3" />
              Our Team
            </Badge>
            <h2 className="mb-6 text-5xl font-black">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Meet The Developers
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Passionate developers building the ultimate Mario universe API
              platform with cutting-edge technology.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Full Stack Developer - Jiro Gonzales */}
            <Card className="group border-gray-700 bg-gray-800/30 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50">
              <CardHeader className="pb-4 text-center">
                <div className="relative mx-auto mb-4 h-32 w-32">
                  <Image
                    src="/team/jiro.jpg"
                    alt="Jiro Gonzales - Full Stack Developer"
                    fill
                    className="rounded-full border-4 border-blue-500/50 object-cover transition-colors group-hover:border-blue-500"
                  />
                  <div className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-white">
                  Jiro Gonzales
                </CardTitle>
                <Badge className="mx-auto mt-2 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  Full Stack Developer
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm leading-relaxed text-gray-400">
                  Lead developer building the entire MarioX platform with
                  Next.js, PostgreSQL, and modern web technologies.
                </p>
                <div className="mt-4 flex justify-center space-x-3">
                  <div className="flex items-center text-xs text-gray-400">
                    <GitBranch className="mr-1 h-3 w-3" />
                    Frontend
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <DatabaseIcon className="mr-1 h-3 w-3" />
                    Backend
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    DevOps
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Helper - Venice Bumagat */}
            <Card className="group border-gray-700 bg-gray-800/30 backdrop-blur-sm transition-all duration-300 hover:border-green-500/50">
              <CardHeader className="pb-4 text-center">
                <div className="relative mx-auto mb-4 h-32 w-32">
                  <Image
                    src="/team/venice.jpg"
                    alt="Venice Bumagat - Project Helper"
                    fill
                    className="rounded-full border-4 border-green-500/50 object-cover transition-colors group-hover:border-green-500"
                  />
                  <div className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-white">
                  Venice Bumagat
                </CardTitle>
                <Badge className="mx-auto mt-2 flex items-center justify-center bg-gradient-to-r from-green-500 to-teal-500 text-white">
                  Project Helper
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm leading-relaxed text-gray-400">
                  Provides essential support in project coordination, data
                  organization, and user experience testing.
                </p>
                <div className="mt-4 flex justify-center space-x-3">
                  <div className="flex items-center text-xs text-gray-400">
                    <Users className="mr-1 h-3 w-3" />
                    Coordination
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Testing
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Helper - Hera Dungca */}
            <Card className="group border-gray-700 bg-gray-800/30 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/50">
              <CardHeader className="pb-4 text-center">
                <div className="relative mx-auto mb-4 h-32 w-32">
                  <Image
                    src="/team/hera.jpg"
                    alt="Hera Dungca - Project Helper"
                    fill
                    className="rounded-full border-4 border-yellow-500/50 object-cover transition-colors group-hover:border-yellow-500"
                  />
                  <div className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-white">
                  Hera Dungca
                </CardTitle>
                <Badge className="mx-auto mt-2 flex items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  Project Helper
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm leading-relaxed text-gray-400">
                  Assists in content management, API documentation, and ensuring
                  data accuracy across the platform.
                </p>
                <div className="mt-4 flex justify-center space-x-3">
                  <div className="flex items-center text-xs text-gray-400">
                    <FileText className="mr-1 h-3 w-3" />
                    Documentation
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <Database className="mr-1 h-3 w-3" />
                    Data Quality
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Helper - Nicole Ashley */}
            <Card className="group border-gray-700 bg-gray-800/30 backdrop-blur-sm transition-all duration-300 hover:border-pink-500/50">
              <CardHeader className="pb-4 text-center">
                <div className="relative mx-auto mb-4 h-32 w-32">
                  <Image
                    src="/team/ashley.jpg"
                    alt="Nicole Ashley - Project Helper"
                    fill
                    className="rounded-full border-4 border-pink-500/50 object-cover transition-colors group-hover:border-pink-500"
                  />
                  <div className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-white">
                  Nicole Ashley
                </CardTitle>
                <Badge className="mx-auto mt-2 flex items-center justify-center bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                  Project Helper
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm leading-relaxed text-gray-400">
                  Supports community engagement, user feedback collection, and
                  helps maintain project communication channels.
                </p>
                <div className="mt-4 flex justify-center space-x-3">
                  <div className="flex items-center text-xs text-gray-400">
                    <MessageCircle className="mr-1 h-3 w-3" />
                    Community
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <Mail className="mr-1 h-3 w-3" />
                    Communication
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ❓ MODERN FAQ SECTION */}
      <section id="help" className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <Badge
              variant="outline"
              className="mb-4 border-red-500/50 text-red-400"
            >
              <Shield className="mr-2 h-3 w-3" />
              Help & Support
            </Badge>
            <h2 className="mb-6 text-5xl font-black">
              <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
          </div>

          <div className="grid gap-6">
            {[
              {
                question: "What is MarioX?",
                answer:
                  "MarioX is a modern RESTful API that provides comprehensive data from the Mario universe, including characters, power-ups, games, and more. Built with Next.js and PostgreSQL for maximum performance and reliability.",
              },
              {
                question: "Can anyone use the API?",
                answer:
                  "Public API access is available for reading character and item data. Only registered and verified admins can modify data through our secure admin dashboard with Clerk authentication.",
              },
              {
                question: "What is rate limiting?",
                answer:
                  "Rate limiting ensures fair usage and system stability by setting maximum request limits per minute. This protects our infrastructure and guarantees consistent performance for all users.",
              },
              {
                question: "Why can't I access the admin page?",
                answer:
                  "Admin pages are protected with enterprise-grade authentication. Only verified team members with proper permissions can access administrative functions to maintain data integrity.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="group border border-gray-700 bg-gray-800/30 backdrop-blur-sm transition-all duration-300 hover:border-red-500/50"
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-white">
                    <div className="mr-3 h-2 w-2 rounded-full bg-red-500 transition-transform group-hover:scale-150"></div>
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-gray-400">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 📞 CONTACT SECTION */}
      <section
        id="contact"
        className="bg-gradient-to-br from-gray-900 to-black px-6 py-24"
      >
        <div className="mx-auto max-w-4xl text-center">
          <Badge
            variant="outline"
            className="mb-4 border-yellow-500/50 text-yellow-400"
          >
            <Mail className="mr-2 h-3 w-3" />
            Contact Us
          </Badge>
          <h2 className="mb-6 text-5xl font-black">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-300">
            Ready to start your next project? Have questions about our API?
            We're here to help you succeed.
          </p>

          <div className="mx-auto grid max-w-2xl gap-8 md:grid-cols-3">
            {[
              { icon: Mail, label: "Email", value: "admin@mariox.dev" },
              {
                icon: MessageCircle,
                label: "Discord",
                value: "MarioX Community",
              },
              { icon: Globe, label: "Website", value: "mariox.vercel.app" },
            ].map((contact, index) => (
              <Card
                key={index}
                className="border-gray-700 bg-gray-800/30 text-center"
              >
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-2xl">
                    <contact.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="mb-2 text-lg text-white">
                    {contact.label}
                  </CardTitle>
                  <CardDescription className="text-base text-yellow-400">
                    {contact.value}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 🎉 MODERN FOOTER */}
      <footer className="border-t border-gray-800 bg-gray-900 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 flex items-center space-x-3 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-yellow-500">
                <Rocket className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">MarioX</span>
            </div>

            <div className="mb-6 flex space-x-8 md:mb-0">
              {["About", "Pricing", "Team", "Help", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-400 transition-colors duration-200 hover:text-white"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center text-sm text-gray-400">
              <Heart className="mr-2 h-4 w-4 text-red-500" />© 2025 MarioX —
              Built by Jiro Gonzales
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
