import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supportApi } from "../services/api"
import { Shield, FileText, Search, Filter, Calendar, ExternalLink } from "lucide-react"
import { cn } from "../lib/utils"

export default function AuditLogPage() {
    const [logs, setLogs] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        try {
            const response = await (supportApi as any).getAuditLogs()
            setLogs(response || [])
        } catch (err) {
            console.error("Failed to fetch logs", err)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredLogs = logs.filter(log =>
        log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.agent?.firstName + " " + log.agent?.lastName).toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading) return (
        <div className="flex-1 flex items-center justify-center bg-slate-950">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Chargement des registres...</p>
            </div>
        </div>
    )

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-950 p-10 overflow-y-auto custom-scrollbar">
            <header className="mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600/10 rounded-xl">
                                <Shield className="text-blue-500" size={24} />
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter text-white">Registre d'Audit</h1>
                        </div>
                        <p className="text-slate-500 text-sm font-medium pl-1">Traçabilité immuable des actions de support sur la plateforme.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-2">
                            <Calendar size={14} className="text-slate-500" />
                            <span className="text-xs font-bold text-slate-300">Derniers 30 jours</span>
                        </div>
                        <button className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform">
                            <ExternalLink size={18} />
                        </button>
                    </div>
                </motion.div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Filtrer les journaux par agent, entité ou action..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                        <Filter size={16} />
                        Filtres
                    </button>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/20 border border-slate-800/50 rounded-[32px] overflow-hidden backdrop-blur-sm shadow-2xl"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Horodatage</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Agent Support</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Action</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Entité</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Contexte École</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            <AnimatePresence mode="popLayout">
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-30 grayscale">
                                                <FileText size={48} className="text-slate-600" />
                                                <p className="text-xs font-black uppercase tracking-widest">Aucune donnée correspondante</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredLogs.map((log, idx) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        key={log.id}
                                        className="hover:bg-blue-600/[0.02] transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-200">{new Date(log.createdAt).toLocaleDateString()}</span>
                                                <span className="text-[10px] font-mono text-slate-500 uppercase">{new Date(log.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    {log.agent ? log.agent.firstName[0] + log.agent.lastName[0] : '??'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-white uppercase tracking-tight">
                                                        {log.agent ? `${log.agent.firstName} ${log.agent.lastName}` : 'Système'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 font-mono italic">{log.agent?.email || '-'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-inner",
                                                log.action === 'DELETE' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                    log.action === 'UPDATE' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                                        log.action === 'CREATE' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                            "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                            )}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{log.entity}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-slate-800/50 rounded-lg group-hover:bg-slate-800 transition-colors">
                                                    <FileText size={14} className="text-slate-500" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-300">{log.school?.name || 'Globale'}</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}
