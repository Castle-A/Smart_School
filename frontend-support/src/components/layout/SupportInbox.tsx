import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"
import { supportApi } from "../../services/api"
import type { Ticket, TicketMessage, TicketStatus } from "../../types/support"
import {
    Loader2,
    ShieldCheck,
    Send,
    Lock,
    Search,
    Inbox,
    MoreHorizontal,
    MessageSquare,
    AlertCircle,
    User as UserIcon,
    Building,
    CheckCircle2
} from "lucide-react"

export default function SupportInboxPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [messages, setMessages] = useState<TicketMessage[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isGrantingAccess, setIsGrantingAccess] = useState(false)
    const [userContext, setUserContext] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchTickets()
    }, [])

    useEffect(() => {
        if (selectedTicket) {
            fetchMessages(selectedTicket.id)
            fetchUserContext(selectedTicket.creatorId)
        }
    }, [selectedTicket])

    const fetchTickets = async () => {
        try {
            const data = await supportApi.getTickets()
            setTickets(data || [])
            if (data && data.length > 0 && !selectedTicket) setSelectedTicket(data[0])
        } catch (err) {
            console.error("Failed to fetch tickets", err)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchMessages = async (id: string) => {
        try {
            const data = await supportApi.getTicketMessages(id)
            setMessages(data)
        } catch (err) {
            console.error("Failed to fetch messages", err)
        }
    }

    const fetchUserContext = async (userId: string) => {
        try {
            const data = await supportApi.getUserContext(userId)
            setUserContext(data)
        } catch (err) {
            console.error("Failed to fetch user context", err)
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedTicket) return

        try {
            await supportApi.addMessage(selectedTicket.id, newMessage)
            setNewMessage("")
            fetchMessages(selectedTicket.id)
        } catch (err) {
            console.error("Failed to send message", err)
        }
    }

    const handleRequestAccess = async () => {
        if (!selectedTicket) return
        setIsGrantingAccess(true)
        try {
            await supportApi.requestAccess(selectedTicket.id)
            fetchUserContext(selectedTicket.creatorId)
        } catch (err) {
            console.error("Failed to request access", err)
        } finally {
            setIsGrantingAccess(false)
        }
    }

    const handleUpdateStatus = async (status: TicketStatus) => {
        if (!selectedTicket) return
        try {
            await supportApi.updateStatus(selectedTicket.id, status)
            fetchTickets()
        } catch (err) {
            console.error("Failed to update status", err)
        }
    }

    const filteredTickets = tickets.filter(t =>
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.creator?.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading) return (
        <div className="flex-1 flex items-center justify-center bg-slate-950">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
            >
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 blur-lg bg-blue-500/20 rounded-full animate-pulse" />
                </div>
                <p className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">Initialisation du Cockpit...</p>
            </motion.div>
        </div>
    )

    return (
        <div className="flex flex-1 h-full overflow-hidden">
            {/* 1. Ticket List - Left Column */}
            <aside className="w-[380px] border-r border-slate-800/50 flex flex-col bg-slate-950/50 backdrop-blur-3xl relative z-20">
                <div className="p-6 border-b border-slate-800/50 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black tracking-tight text-white">Tickets</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black px-2 py-0.5 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-full uppercase tracking-tighter">
                                {tickets.length} ACTIFS
                            </span>
                        </div>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher un incident..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    <AnimatePresence mode="popLayout">
                        {filteredTickets.map((ticket, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={cn(
                                    "p-4 rounded-2xl border transition-all cursor-pointer group relative",
                                    selectedTicket?.id === ticket.id
                                        ? "bg-gradient-to-br from-blue-600 to-blue-700 border-blue-400/30 shadow-xl shadow-blue-900/20"
                                        : "bg-slate-900/40 border-slate-800/50 hover:border-slate-600/50 hover:bg-slate-900/60"
                                )}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            ticket.status === 'OPEN' ? "bg-blue-400 animate-pulse" :
                                                ticket.status === 'IN_PROGRESS' ? "bg-orange-400" :
                                                    "bg-emerald-400"
                                        )} shadow-sm />
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest",
                                            selectedTicket?.id === ticket.id ? "text-blue-100" : "text-slate-500"
                                        )}>
                                            #{ticket.id.slice(0, 8)}
                                        </span>
                                    </div>
                                    <span className={cn(
                                        "text-[8px] px-1.5 py-0.5 rounded font-black",
                                        ticket.priority === 'CRITICAL' ? "bg-red-500 text-white" :
                                            selectedTicket?.id === ticket.id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                                    )}>
                                        {ticket.priority}
                                    </span>
                                </div>

                                <p className={cn(
                                    "text-sm font-bold truncate leading-tight mb-2",
                                    selectedTicket?.id === ticket.id ? "text-white" : "text-slate-200"
                                )}>
                                    {ticket.subject}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-[10px] font-bold">
                                            {(ticket.creator?.firstName?.[0] || '?')}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-medium",
                                            selectedTicket?.id === ticket.id ? "text-blue-100" : "text-slate-400"
                                        )}>
                                            {ticket.creator?.firstName} {ticket.creator?.lastName}
                                        </span>
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-mono",
                                        selectedTicket?.id === ticket.id ? "text-blue-200" : "text-slate-600"
                                    )}>
                                        {new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredTickets.length === 0 && (
                        <div className="py-20 text-center opacity-40 grayscale">
                            <Inbox className="mx-auto mb-4 text-slate-600" size={40} />
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Aucun ticket trouvé</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* 2. Chat / Content - Center Column */}
            <main className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {selectedTicket ? (
                        <motion.div
                            key={selectedTicket.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col h-full bg-slate-950"
                        >
                            {/* Header */}
                            <header className="px-8 py-6 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between z-10 sticky top-0">
                                <div className="flex flex-col min-w-0">
                                    <h1 className="text-lg font-black text-white flex items-center gap-3">
                                        <span className="text-blue-500 font-mono text-sm opacity-50">[{selectedTicket.type}]</span>
                                        {selectedTicket.subject}
                                    </h1>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            En ligne • Activité il y a 2m
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleUpdateStatus('IN_PROGRESS')}
                                        className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition"
                                    >
                                        Prendre
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus('RESOLVED')}
                                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 transition-all font-sans"
                                    >
                                        RÉSOUDRE
                                    </button>
                                    <button className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </header>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                                {/* First Message Context */}
                                <div className="flex justify-start">
                                    <div className="max-w-2xl bg-slate-900/50 border border-slate-800 rounded-[32px] rounded-tl-none p-6 shadow-2xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white scale-90">
                                                <AlertCircle size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Description Initiale</p>
                                                <p className="text-xs text-slate-500">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                            {selectedTicket.description}
                                        </p>
                                    </div>
                                </div>

                                {messages.map((msg, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={msg.id}
                                        className={cn("flex", msg.senderId === selectedTicket.creatorId ? "justify-start" : "justify-end")}
                                    >
                                        <div className={cn(
                                            "max-w-[70%] p-5 rounded-[24px] shadow-sm",
                                            msg.senderId === selectedTicket.creatorId
                                                ? "bg-slate-900 border border-slate-800 rounded-tl-none text-slate-200"
                                                : "bg-gradient-to-br from-blue-600 to-indigo-600 rounded-tr-none text-white shadow-xl shadow-blue-950/20"
                                        )}>
                                            <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                            <div className={cn(
                                                "text-[9px] mt-3 font-black uppercase tracking-widest flex items-center gap-2",
                                                msg.senderId === selectedTicket.creatorId ? "text-slate-600" : "text-white/50"
                                            )}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •
                                                <span>{msg.senderId === selectedTicket.creatorId ? "CLIENT" : "AGENT SUPPORT"}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Chat Input */}
                            <footer className="p-6 border-t border-slate-800/50 bg-slate-950">
                                <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto group">
                                    <div className="absolute inset-0 bg-blue-500/5 blur-2xl group-focus-within:bg-blue-500/10 transition-all pointer-events-none rounded-3xl" />
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Écrivez votre réponse..."
                                        className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl px-6 py-5 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all backdrop-blur-xl"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 active:scale-95"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </footer>
                        </motion.div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="relative mb-8"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[32px] flex items-center justify-center shadow-2xl relative z-10 border border-slate-700/50">
                                    <MessageSquare size={40} className="text-blue-500/50" />
                                </div>
                                <div className="absolute -inset-4 bg-blue-500/10 blur-[40px] rounded-full animate-pulse" />
                            </motion.div>
                            <h3 className="text-xl font-black text-white mb-2">Sélectionnez un ticket pour démarrer</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                                Les incidents sont synchronisés en temps réel. Choisissez un élément dans la liste de gauche.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            {/* 3. Contextual Information - Right Column */}
            <aside className="w-[340px] border-l border-slate-800/50 bg-slate-950/30 backdrop-blur-3xl flex flex-col p-8 overflow-y-auto custom-scrollbar z-20">
                <header className="mb-10">
                    <h3 className="text-[10px] font-black uppercase text-blue-500 tracking-[0.25em] mb-8">Contexte Utilisateur</h3>

                    <AnimatePresence mode="wait">
                        {userContext ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl text-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-blue-500/[0.03] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[28px] mx-auto mb-4 flex items-center justify-center text-2xl font-black border border-white/20 shadow-2xl shadow-blue-900/40 transform group-hover:scale-105 transition-transform duration-300">
                                        {userContext.name ? userContext.name.split(' ').map((n: string) => n[0]).join('') : '??'}
                                    </div>
                                    <h4 className="font-black text-lg text-white group-hover:text-blue-400 transition-colors uppercase tracking-tighter leading-none mb-1">
                                        {userContext.name || 'Utilisateur'}
                                    </h4>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{userContext.role}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500"><Building size={14} /></div>
                                            <div className="min-w-0">
                                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Établissement</p>
                                                <p className="text-xs font-bold text-slate-200 truncate">{userContext.school}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500"><UserIcon size={14} /></div>
                                            <div className="min-w-0">
                                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Coordonnées Sécurisées</p>
                                                <p className="text-xs font-mono text-slate-400 truncate">{userContext.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-800/50" />

                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest italic mb-3 block opacity-50">Accès Platforme Interne</label>
                                            <button
                                                onClick={handleRequestAccess}
                                                disabled={isGrantingAccess || !selectedTicket}
                                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 border border-slate-700/50 rounded-[20px] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-50 group hover:border-blue-500/50"
                                            >
                                                {isGrantingAccess ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} className="group-hover:text-blue-400 transition-colors" />}
                                                DEMANDER L'ACCÈS
                                            </button>
                                            <div className="flex items-center gap-2 justify-center mt-4">
                                                <ShieldCheck size={12} className="text-emerald-500/50" />
                                                <p className="text-[8px] text-slate-600 leading-tight">Session protégée et auditée.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="py-20 flex flex-col items-center gap-4 text-slate-500">
                                <Loader2 className="animate-spin opacity-20" size={24} />
                                <p className="text-[9px] font-black uppercase tracking-[0.2em]">Chargement des données...</p>
                            </div>
                        )}
                    </AnimatePresence>
                </header>

                <div className="mt-auto space-y-4 pt-10 border-t border-slate-800/50">
                    <div className="p-4 bg-blue-600/5 rounded-2xl border border-blue-500/10 flex items-center gap-4 transition-all hover:bg-blue-600/10">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-500 shadow-inner">
                            <CheckCircle2 size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-blue-200">Mode Sécurisé</p>
                            <p className="text-[9px] text-blue-500/70 truncate uppercase tracking-tighter">Anonymisation des données</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}
