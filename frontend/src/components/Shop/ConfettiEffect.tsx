import { motion, AnimatePresence } from "motion/react";

export function ConfettiEffect({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none z-50"
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: "50%", y: "50%", scale: 0, rotate: 0 }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1, delay: i * 0.05 }}
              className={`absolute w-3 h-3 rounded-full ${
                i % 3 === 0
                  ? "bg-[#4455f0]"
                  : i % 3 === 1
                  ? "bg-[#f7a1c0]"
                  : "bg-[#b4bbf8]"
              }`}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
