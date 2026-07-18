import { db } from '@/db';
import { projects, clients, projectAssets } from '@/db/schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FolderOpen } from 'lucide-react';
import ProjectFormDialog from './ProjectFormDialog';
import { ProjectDeleteButton } from './ProjectDeleteButton';
import ProjectAssetsDialog from './ProjectAssetsDialog';

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
  review: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400',
  done: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400',
};
const STATUS_LABEL: Record<string, string> = { pending: 'Menunggu', in_progress: 'Dikerjakan', review: 'Review', done: 'Selesai' };

export default async function ProjectsAdminPage() {
  const [allProjects, allClients, allAssets] = await Promise.all([
    db.select().from(projects),
    db.select().from(clients),
    db.select().from(projectAssets),
  ]);

  const clientMap = Object.fromEntries(allClients.map(c => [c.id, c.name]));
  const clientOptions = allClients.map(c => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Kelola Proyek Klien</h1>
          <p className="text-sm text-zinc-500 mt-1">Update progres dan fase pengerjaan proyek untuk setiap klien.</p>
        </div>
        <ProjectFormDialog clients={clientOptions} />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Judul Proyek</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Klien</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Status</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Progres</TableHead>
                <TableHead className="text-right font-semibold text-zinc-600 dark:text-zinc-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allProjects.map((project) => (
                <TableRow key={project.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                  <TableCell>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{project.title}</div>
                    <div className="text-xs text-zinc-500 capitalize">{project.phase}</div>
                  </TableCell>
                  <TableCell className="text-zinc-600 dark:text-zinc-400">{clientMap[project.clientId] || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_STYLE[project.status] || ''}>{STATUS_LABEL[project.status] || project.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${project.progressPercent}%` }} />
                      </div>
                      <span className="text-xs text-zinc-500">{project.progressPercent}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ProjectAssetsDialog 
                        projectId={project.id} 
                        projectTitle={project.title} 
                        existingAssets={allAssets.filter(a => a.projectId === project.id)} 
                      />
                      <ProjectFormDialog editItem={project} clients={clientOptions} />
                      <ProjectDeleteButton id={project.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {allProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-500">
                      <FolderOpen className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
                      <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada proyek</p>
                      <p className="text-sm">Tambahkan proyek untuk klien Anda.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
