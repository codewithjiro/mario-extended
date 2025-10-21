"use client";

import { motion } from "framer-motion";
import { Crown, Star, Zap, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export default function PricingSection() {
  const plans = [
    {
      name: "Mushroom Tier",
      price: "₱0",
      description: "Perfect for learning and personal projects",
      requests: "60 requests / minute",
      features: [
        "Basic API Access",
        "Community Support",
        "Standard Rate Limits",
        "Public Data Only",
        "Basic Documentation",
      ],
      cta: "Start Adventure",
      popular: false,
      icon: Star,
      gradient: "from-green-500 to-emerald-500",
      badge: "Starter",
    },
    {
      name: "Fire Flower",
      price: "₱199",
      description: "Ideal for serious projects and applications",
      requests: "300 requests / minute",
      features: [
        "All Mushroom Features",
        "Priority Support",
        "Webhook Support",
        "Advanced Analytics",
        "Early Access Features",
        "Extended Rate Limits",
      ],
      cta: "Get Power-Up",
      popular: true,
      icon: Zap,
      gradient: "from-red-500 to-orange-500",
      badge: "Most Popular",
    },
    {
      name: "Starman",
      price: "₱999",
      description: "For mission-critical applications",
      requests: "Unlimited requests",
      features: [
        "All Fire Flower Features",
        "Dedicated Support",
        "Custom Integrations",
        "SLA Guarantee",
        "Custom Data Models",
        "White-label Options",
        "API Customization",
      ],
      cta: "Go Invincible",
      popular: false,
      icon: Crown,
      gradient: "from-yellow-500 to-yellow-300",
      badge: "Enterprise",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl backdrop-blur-xl"
    >
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-red-500/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-yellow-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10 px-8 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Badge className="mb-4 border-yellow-500/50 bg-yellow-500/10 px-4 py-2 text-yellow-400 backdrop-blur-lg">
                <Crown className="mr-2 h-4 w-4" />
                Power-Up Your Adventure
              </Badge>
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mb-6 text-5xl font-black"
            >
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent">
                Choose Your Power Level
              </span>
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mx-auto max-w-2xl text-xl text-gray-300"
            >
              Start your quest for free and level up as you grow. No hidden
              blocks, just pure power!
            </motion.p>
          </div>

          {/* Pricing Cards */}
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card
                  className={`relative h-full overflow-hidden border-0 bg-gradient-to-br from-gray-800/60 to-gray-900/80 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
                    plan.popular ? "ring-2 ring-yellow-500/50" : ""
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 transform">
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-2 font-bold text-white shadow-lg">
                        <Sparkles className="mr-2 h-3 w-3" />
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  {/* Background Glow */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5`}
                  ></div>

                  <CardHeader className="relative z-10 pb-6 text-center">
                    {/* Icon */}
                    <div className="mb-4 flex justify-center">
                      <div className="relative">
                        <div
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${plan.gradient} opacity-75 blur-lg`}
                        ></div>
                        <div
                          className={`relative rounded-2xl bg-gradient-to-r ${plan.gradient} p-4 shadow-2xl`}
                        >
                          <plan.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <CardTitle className="mb-2 text-2xl font-bold text-white">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-400">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10 pb-6 text-center">
                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-4xl font-black text-white">
                        {plan.price}
                      </span>
                      {plan.price !== "₱0" && (
                        <span className="ml-2 text-gray-400">/month</span>
                      )}
                    </div>

                    {/* Requests */}
                    <div className="mb-6 flex items-center justify-center font-semibold text-yellow-400">
                      <Zap className="mr-2 h-4 w-4" />
                      {plan.requests}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 text-left">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 1.1 + featureIndex * 0.05,
                          }}
                          className="flex items-center space-x-3 text-gray-300"
                        >
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                            <div className="h-2 w-2 rounded-full bg-green-400"></div>
                          </div>
                          <span className="text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="relative z-10">
                    <Button
                      asChild
                      className={`w-full gap-2 rounded-xl py-6 text-base font-bold transition-all duration-300 ${
                        plan.popular
                          ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30`
                          : "bg-gray-700/50 text-white backdrop-blur-sm hover:bg-gray-600/50"
                      }`}
                      size="lg"
                    >
                      <a href="/sign-in">
                        {plan.popular && <Sparkles className="h-4 w-4" />}
                        {plan.cta}
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-400">
              All plans include secure access, regular updates, and our
              legendary support.{" "}
              <span className="text-yellow-400">
                No credit card required to start!
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
