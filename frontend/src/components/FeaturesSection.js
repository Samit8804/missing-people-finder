"use client";

import { motion } from "framer-motion";
import { Search, BrainCircuit, ShieldCheck, MapPinned, BellRing, Users } from "lucide-react";

const features = [
  {
    name: "AI-Powered Matching",
    description: "Our algorithm compares descriptions, age, gender, and locations to suggest high-probability matches automatically.",
    icon: BrainCircuit,
  },
  {
    name: "Instant Notifications",
    description: "Get real-time alerts via email or SMS the moment a potential match is found for your reported case.",
    icon: BellRing,
  },
  {
    name: "Location Intelligence",
    description: "Map-based search allows organizations and search parties to look for missing individuals in specific geographic radii.",
    icon: MapPinned,
  },
  {
    name: "Secure & Anonymous",
    description: "Report found individuals anonymously. We protect user privacy and hide sensitive contact details by default.",
    icon: ShieldCheck,
  },
  {
    name: "Public Search Board",
    description: "A centralized, searchable database of active cases accessible to NGOs, law enforcement, and the public.",
    icon: Search,
  },
  {
    name: "Community Verification",
    description: "Human-in-the-loop system requires the reporter to review and actively confirm any AI-suggested matches.",
    icon: Users,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-purple-600 tracking-wide uppercase">Engineered for Action</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to find them
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            FindLink combines modern technology with community effort, streamlining the search process and maximizing the chances of reunification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={feature.name}
              className="card bg-white hover:-translate-y-1 group"
            >
              <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <feature.icon className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold leading-7 text-gray-900 mb-3">
                {feature.name}
              </h3>
              <p className="text-base leading-7 text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
