import { motion } from "framer-motion"

const accentColors = {
    emerald: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-500 dark:text-emerald-400",
        icon: "text-emerald-500 dark:text-emerald-400",
    },
    red: {
        bg: "bg-red-500/10",
        text: "text-red-500 dark:text-red-400",
        icon: "text-red-500 dark:text-red-400",
    },
    indigo: {
        bg: "bg-indigo-500/10",
        text: "text-indigo-500 dark:text-indigo-400",
        icon: "text-indigo-500 dark:text-indigo-400",
    },
    amber: {
        bg: "bg-amber-500/10",
        text: "text-amber-500 dark:text-amber-400",
        icon: "text-amber-500 dark:text-amber-400",
    },
}

export default function StatCard({ icon: Icon, label, value, subtitle, accent = "emerald", index = 0 }) {
    const colors = accentColors[accent] || accentColors.emerald

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-none dark:hover:bg-slate-800/50 hover:-translate-y-0.5 transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <Icon size={20} className={colors.icon} />
                </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>

            {subtitle && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
            )}
        </motion.div>
    )
}
