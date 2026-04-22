"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Submit a Report",
    description: "Fill out a detailed form providing the person's photo, physical description, and the location they were last seen or found.",
    badge: "01",
  },
  {
    title: "System Analyzes",
    description: "FindLink's engine compares new data against thousands of active records, checking age, gender, and regional overlaps.",
    badge: "02",
  },
  {
    title: "Review Matches",
    description: "If a potential match scores higher than 50%, the system alerts both parties to securely verify photos and details.",
    badge: "03",
  },
  {
    title: "Reunite",
    description: "Upon mutual confirmation, contact information is exchanged securely, allowing families to finally reunite.",
    badge: "04",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
              How FindLink Works
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Our streamlined four-step verification process ensures that false positives are minimized, privacy is maintained, and successful reunifications are expedited.
            </p>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  key={index} 
                  className="flex gap-4 relative"
                >
                  {/* Vertical Line Connector */}
                  {index !== steps.length - 1 && (
                    <div className="absolute top-12 left-6 bottom-0 w-px bg-gray-200 -z-10" />
                  )}
                  
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border border-purple-200 bg-purple-50 flex items-center justify-center text-purple-600 font-bold shadow-sm">
                    {step.badge}
                  </div>
                  <div className="pt-2 pb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-3xl bg-gray-900 p-8 shadow-2xl overflow-hidden aspect-square lg:aspect-auto lg:h-[600px] flex items-center justify-center">
               <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1573164713619-24c711fe7878?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center mix-blend-overlay"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
               
               {/* Mock UI overlay */}
               <div className="relative z-10 w-full max-w-sm mx-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
                 <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                    <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center border border-green-400/50">
                      <div className="w-6 h-6 text-green-400">✓</div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Match Confirmed</h4>
                      <p className="text-green-300/80 text-sm">Score: 92% • High Confidence</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="h-4 w-3/4 bg-white/20 rounded"></div>
                    <div className="h-4 w-1/2 bg-white/20 rounded"></div>
                    <div className="h-10 w-full bg-purple-600 rounded-lg mt-6 flex items-center justify-center text-white/90 font-medium tracking-wide">
                      View Contact Info
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
