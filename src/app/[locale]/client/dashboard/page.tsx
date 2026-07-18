import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import { db } from "@/db";
import {
  clients,
  projects,
  projectAssets,
  invoices,
  tickets,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { Link } from "@/i18n/routing";
import {
  CheckCircle2,
  Clock,
  Wrench,
  Rocket,
  LogOut,
  FileText,
  Download,
  Receipt,
  LifeBuoy,
} from "lucide-react";
import TicketForm from "./TicketForm";
import PayButton from "./PayButton";

const PHASE_LABELS: Record<string, string> = {
  desain: "Fase Desain",
  development: "Fase Development",
  testing: "Fase Testing & Q.A",
  launch: "Peluncuran",
};

const STATUS_STYLES: Record<
  string,
  { color: string; bg: string; label: string; icon: typeof Clock }
> = {
  pending: {
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30",
    label: "Menunggu Dimulai",
    icon: Clock,
  },
  in_progress: {
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30",
    label: "Sedang Dikerjakan",
    icon: Wrench,
  },
  review: {
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/30",
    label: "Dalam Review",
    icon: CheckCircle2,
  },
  done: {
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30",
    label: "Selesai & Terkirim",
    icon: Rocket,
  },
};

const PHASES = ["desain", "development", "testing", "launch"];

export default async function ClientDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const clientToken = cookieStore.get("client_token");

  if (!clientToken?.value) redirect(`/${locale}/client/login`);

  const clientResult = await db
    .select()
    .from(clients)
    .where(eq(clients.id, clientToken.value))
    .limit(1);
  if (!clientResult.length) redirect(`/${locale}/client/login`);

  const client = clientResult[0];
  const clientProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.clientId, client.id));

  // Just fetch all assets for now (small app optimization), or we can use inArray if needed.
  const allProjectAssets = await db.select().from(projectAssets);

  const allInvoices = await db.select().from(invoices);
  const myInvoices = allInvoices.filter((inv) =>
    clientProjects.some((p) => p.id === inv.projectId),
  );

  const myTickets = await db
    .select()
    .from(tickets)
    .where(eq(tickets.clientId, client.id));

  async function logoutAction() {
    "use server";
    const { cookies: getCookies } = await import("next/headers");
    const cs = await getCookies();
    cs.delete("client_token");
    const { redirect: r } = await import("next/navigation");
    r(`/${locale}/client/login`);
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <div className="w-full px-4 md:px-8 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-white">Client Portal</h1>
            <p className="text-zinc-400 text-sm">
              Selamat datang,{" "}
              <span className="text-blue-400 font-medium">{client.name}</span>
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-2 text-xs text-zinc-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </form>
        </div>
      </header>

      <main className="w-full px-4 md:px-8 py-10 space-y-8">
        {clientProjects.length === 0 ? (
          <div className="text-center py-24 text-zinc-500">
            <Wrench className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
            <p className="text-lg font-medium text-zinc-400">
              Belum ada proyek aktif
            </p>
            <p className="text-sm">
              Tim kami akan segera mempersiapkan proyek Anda.
            </p>
          </div>
        ) : (
          clientProjects.map((project) => {
            const s = STATUS_STYLES[project.status] || STATUS_STYLES.pending;
            const StatusIcon = s.icon;
            const currentPhaseIdx = PHASES.indexOf(project.phase);

            return (
              <div
                key={project.id}
                className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl"
              >
                {/* Project Header */}
                <div className="p-6 border-b border-zinc-800">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        {project.title}
                      </h2>
                      <p className="text-zinc-400 text-sm">
                        {project.description}
                      </p>
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold whitespace-nowrap ${s.bg} ${s.color}`}
                    >
                      <StatusIcon className="w-4 h-4" /> {s.label}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="p-6 border-b border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-300">
                      Progres Keseluruhan
                    </span>
                    <span className="text-sm font-bold text-white">
                      {project.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${project.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Phase Timeline */}
                <div className="p-6 border-b border-zinc-800">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                    Fase Pengerjaan
                  </p>
                  <div className="flex items-center justify-between">
                    {PHASES.map((phase, idx) => {
                      const isDone = idx < currentPhaseIdx;
                      const isActive = idx === currentPhaseIdx;
                      return (
                        <div
                          key={phase}
                          className="flex-1 flex flex-col items-center relative"
                        >
                          {idx < PHASES.length - 1 && (
                            <div
                              className={`absolute top-4 left-1/2 w-full h-0.5 ${isDone ? "bg-emerald-500" : "bg-zinc-700"}`}
                            />
                          )}
                          <div
                            className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center mb-2 ${isDone ? "bg-emerald-500" : isActive ? "bg-blue-600 ring-4 ring-blue-600/30" : "bg-zinc-700"}`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : (
                              <span className="text-xs font-bold text-white">
                                {idx + 1}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs text-center hidden sm:block ${isActive ? "text-blue-400 font-semibold" : isDone ? "text-emerald-400" : "text-zinc-500"}`}
                          >
                            {PHASE_LABELS[phase]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notes & Assets */}
                <div className="p-6">
                  {project.notes ? (
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 mb-6">
                      <h3 className="text-sm font-semibold text-zinc-300 mb-2">
                        Catatan Proyek
                      </h3>
                      <p className="text-sm text-zinc-400 whitespace-pre-wrap">
                        {project.notes}
                      </p>
                    </div>
                  ) : null}

                  {/* Assets */}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      File Master & Aset
                    </h3>
                    <div className="space-y-2">
                      {allProjectAssets.filter(
                        (a) => a.projectId === project.id,
                      ).length === 0 ? (
                        <p className="text-xs text-zinc-500 italic bg-zinc-900/30 p-3 rounded-lg border border-dashed border-zinc-800">
                          Belum ada file yang diunggah.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {allProjectAssets
                            .filter((a) => a.projectId === project.id)
                            .map((asset) => (
                              <a
                                key={asset.id}
                                href={asset.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors group"
                              >
                                <div className="flex flex-col overflow-hidden">
                                  <span className="text-sm font-medium text-white truncate">
                                    {asset.fileName}
                                  </span>
                                  <span className="text-xs text-zinc-500 truncate">
                                    {new Date(
                                      asset.uploadedAt,
                                    ).toLocaleDateString("id-ID")}
                                  </span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors shrink-0">
                                  <Download className="w-4 h-4 text-indigo-400" />
                                </div>
                              </a>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="px-6 pb-6 flex gap-6 text-xs text-zinc-500">
                  {project.startedAt && (
                    <span>
                      Mulai:{" "}
                      <span className="text-zinc-300">
                        {project.startedAt.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                  )}
                  {project.deliveredAt && (
                    <span>
                      Estimasi Selesai:{" "}
                      <span className="text-emerald-400 font-medium">
                        {project.deliveredAt.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Tagihan / Invoices Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-400" />
            Tagihan Pembayaran
          </h2>

          {myInvoices.length === 0 ? (
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 text-center">
              <p className="text-zinc-500">Tidak ada tagihan untuk saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors relative overflow-hidden"
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {inv.status === "paid" && (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                        Lunas
                      </span>
                    )}
                    {inv.status === "unpaid" && (
                      <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                        Belum Lunas
                      </span>
                    )}
                    {inv.status === "overdue" && (
                      <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                        Jatuh Tempo
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500 mb-1">
                      {
                        clientProjects.find((p) => p.id === inv.projectId)
                          ?.title
                      }
                    </p>
                    <h3 className="text-base font-bold text-white mb-4 pr-16">
                      {inv.description}
                    </h3>
                  </div>

                  <div>
                    <p className="text-2xl font-bold text-white mb-1">
                      Rp {inv.amount.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Jatuh Tempo:{" "}
                      <span className="text-zinc-300">
                        {new Date(inv.dueDate).toLocaleDateString("id-ID")}
                      </span>
                    </p>

                    {inv.status === "unpaid" && (
                      <PayButton invoiceId={inv.id} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tickets Section */}
        <div className="mt-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <TicketForm />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-indigo-400" />
                Riwayat Tiket Anda
              </h2>
              {myTickets.length === 0 ? (
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 text-center h-[280px] flex items-center justify-center">
                  <p className="text-zinc-500">
                    Belum ada tiket bantuan yang diajukan.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">
                          {ticket.subject}
                        </h4>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${ticket.status === "open" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"}`}
                        >
                          {ticket.status === "open"
                            ? "Menunggu Balasan"
                            : "Selesai (Resolved)"}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400 whitespace-pre-wrap">
                        {ticket.message}
                      </p>
                      <p className="text-xs text-zinc-600 mt-3">
                        {new Date(ticket.createdAt).toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/20 rounded-2xl border border-blue-800/30 p-6 text-center">
          <p className="text-white font-semibold mb-1">
            Ada pertanyaan tentang proyek Anda?
          </p>
          <p className="text-zinc-400 text-sm mb-4">
            Tim ZilyaDigital siap membantu Anda.
          </p>
          <Link
            href="/#booking"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            Hubungi Tim Kami
          </Link>
        </div>
      </main>
    </div>
  );
}
