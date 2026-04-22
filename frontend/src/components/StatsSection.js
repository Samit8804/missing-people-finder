"use client";

import { motion } from "framer-motion";

const stats = [
  { id: 1, name: "Active Cases", value: "2,400+" },
  { id: 2, name: "Matches Suggested", value: "850+" },
  { id: 3, name: "Families Reunited", value: "312" },
  { id: 4, name: "Success Rate", value: "94%" },
];

export default function StatsSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700">
              Trusted by communities everywhere
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Every number represents a family, a community, and hope turning into reality.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4 bg-gray-200">
            {stats.map((stat, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={stat.id}
                className="flex flex-col bg-white p-8 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <dt className="text-sm font-semibold leading-6 text-gray-600 relative z-10">{stat.name}</dt>
                <dd className="order-first text-4xl font-bold tracking-tight text-gray-900 mb-2 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  {stat.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
