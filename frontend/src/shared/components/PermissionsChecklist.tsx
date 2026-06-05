import { useState, useEffect } from 'react';
import { Check, ShieldCheck, Loader2, User, Building2, Shield, Briefcase, Smartphone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import api from '../api/api';

interface PermissionDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  isDefault: boolean;
}

interface PermissionsChecklistProps {
  role: string;
  directorType?: string;
  selectedPermissions: string[];
  onChange: (permissionIds: string[]) => void;
  readOnly?: boolean;
}

const PermissionsChecklist = ({ role, directorType, selectedPermissions, onChange, readOnly = false }: PermissionsChecklistProps) => {
  // --- UI CONSTANTS ---
  const CATEGORY_CONFIG: Record<string, { label: string; icon: LucideIcon; color: string }> = {
    students: { label: 'Élèves & Scolarité', icon: User, color: 'text-blue-500' },
    finance: { label: 'Finance & Caisse', icon: Building2, color: 'text-emerald-500' },
    discipline: { label: 'Vie Scolaire & Discipline', icon: Shield, color: 'text-red-500' },
    academics: { label: 'Académique & Notes', icon: Briefcase, color: 'text-indigo-500' },
    pedagogy: { label: 'Pédagogie & Inspection', icon: ShieldCheck, color: 'text-purple-500' },
    staff: { label: 'RH & Personnel', icon: User, color: 'text-slate-500' },
    schedule: { label: 'Emploi du Temps', icon: Briefcase, color: 'text-orange-500' },
    services: { label: 'Services (Cantine/Internat)', icon: Briefcase, color: 'text-pink-500' },
    reports: { label: 'Rapports & Stats', icon: Smartphone, color: 'text-cyan-500' },
    communication: { label: 'Communication', icon: Smartphone, color: 'text-teal-500' },
    configuration: { label: 'Configuration Établissement', icon: ShieldCheck, color: 'text-violet-500' },
    subscriptions: { label: 'Gestion Abonnement', icon: Building2, color: 'text-amber-500' },
  };

  const [permissionsByCategory, setPermissionsByCategory] = useState<Record<string, PermissionDefinition[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (role) {
      fetchPermissions();
    } else {
      setPermissionsByCategory({});
    }
  }, [role, directorType]);

  const fetchPermissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/permissions/role/${role}`, {
        params: { directorType }
      });

      const data = response.data;
      // Merge default and additional for unified display, but keep track of isDefault for badges
      const allPerms: PermissionDefinition[] = [...(data.default || []), ...(data.additional || [])];

      // Group by category
      const grouped = allPerms.reduce((acc, perm) => {
        const cat = perm.category || 'other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(perm);
        return acc;
      }, {} as Record<string, PermissionDefinition[]>);

      setPermissionsByCategory(grouped);

      // Auto-select defaults if empty (only in creation mode)
      if (!readOnly && selectedPermissions.length === 0 && data.default?.length > 0) {
        const defaultIds = data.default.map((p: PermissionDefinition) => p.id);
        onChange(defaultIds);
      }

    } catch (err) {
      console.error('Error fetching permissions:', err);
      setError('Impossible de charger les permissions contextuelles.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    if (readOnly) return;
    const newSelected = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter(id => id !== permissionId)
      : [...selectedPermissions, permissionId];
    onChange(newSelected);
  };

  const toggleCategory = (categoryKey: string) => {
    if (readOnly) return;
    const perms = permissionsByCategory[categoryKey] || [];
    const allIds = perms.map(p => p.id);
    const allSelected = allIds.every(id => selectedPermissions.includes(id));

    if (allSelected) {
      // Remove all IDs of this category from selection
      onChange(selectedPermissions.filter(id => !allIds.includes(id)));
    } else {
      // Add all IDs of this category to selection (deduplicate)
      const newSelected = [...selectedPermissions];
      allIds.forEach(id => {
        if (!newSelected.includes(id)) newSelected.push(id);
      });
      onChange(newSelected);
    }
  };

  const renderPermissionItem = (permission: PermissionDefinition) => {
    const isSelected = selectedPermissions.includes(permission.id);
    return (
      <div
        key={permission.id}
        onClick={() => togglePermission(permission.id)}
        className={`flex items-start gap-3 p-2 rounded-lg border text-sm transition-all cursor-pointer ${isSelected
          ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
          : 'bg-white border-slate-100 hover:bg-slate-50'
          } ${readOnly ? 'cursor-default' : ''}`}
      >
        <div className={`mt-0.5 rounded flex-shrink-0 w-4 h-4 flex items-center justify-center border transition-colors ${isSelected
          ? 'bg-indigo-600 border-indigo-600'
          : 'border-slate-300 bg-white'
          }`}>
          {isSelected && <Check size={10} className="text-white" strokeWidth={4} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className={`font-medium truncate ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
            {permission.name}
          </div>
          <div className="text-xs text-slate-500 line-clamp-1" title={permission.description}>
            {permission.description}
          </div>
        </div>

        {permission.isDefault && (
          <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
            Std
          </span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <span className="ml-3 text-slate-400 font-medium">Chargement du profil de compétences...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
        {error}
      </div>
    );
  }

  const categories = Object.keys(permissionsByCategory);
  if (categories.length === 0) {
    return <div className="text-white/50 text-center italic">Aucune permission configurée.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map(catKey => {
        const config = CATEGORY_CONFIG[catKey] || { label: catKey, icon: Shield, color: 'text-slate-400' };
        const perms = permissionsByCategory[catKey];
        const Icon = config.icon;

        // Check if all permissions in this category are selected
        const allIds = perms.map(p => p.id);
        const isAllSelected = allIds.length > 0 && allIds.every(id => selectedPermissions.includes(id));

        return (
          <div key={catKey} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center gap-2">
              <Icon className={`w-5 h-5 ${config.color}`} />
              <span className="font-semibold text-white/90 text-sm">{config.label}</span>

              {!readOnly && (
                <button
                  type="button" // Prevent form submission
                  onClick={(e) => { e.stopPropagation(); toggleCategory(catKey); }}
                  className={`ml-auto text-[10px] px-2 py-1 rounded border transition-colors ${isAllSelected
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/30'
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {isAllSelected ? 'Tout décocher' : 'Tout cocher'}
                </button>
              )}

              {readOnly && (
                <span className="ml-auto text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                  {perms.length}
                </span>
              )}
            </div>

            <div className="p-3 space-y-2 flex-1">
              {perms.map(renderPermissionItem)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PermissionsChecklist;
