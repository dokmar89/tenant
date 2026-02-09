import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Building2, Car, Trash2, Edit, Plus, LogOut, CheckCircle, AlertCircle, PieChart, TrendingUp, MapPin, Download, FileText } from 'lucide-react';
import { Page, Tenant } from './types';
import { ROOMS, PARKING, DEFAULT_TENANTS } from './constants';
import TenantModal from './components/TenantModal';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('dash');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hps_db');
      if (saved) {
        setTenants(JSON.parse(saved));
      } else {
        setTenants(DEFAULT_TENANTS);
      }
    } catch (e) {
      console.error("Failed to load data", e);
      setTenants(DEFAULT_TENANTS);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      if (tenants.length >= 0) { // Allow saving empty array
        localStorage.setItem('hps_db', JSON.stringify(tenants));
      }
    } catch (e) {
      console.error("Failed to save data", e);
    }
  }, [tenants]);

  const handleSaveTenant = (newTenant: Tenant) => {
    setTenants(prev => {
      const exists = prev.find(t => t.id === newTenant.id);
      if (exists) {
        return prev.map(t => t.id === newTenant.id ? newTenant : t);
      }
      return [...prev, newTenant];
    });
    setIsModalOpen(false);
    setEditingTenant(null);
  };

  const handleDeleteTenant = (id: number) => {
    if (window.confirm('Opravdu chcete smazat tohoto nájemce? Tato akce uvolní všechny přiřazené místnosti a parkovací místa.')) {
      setTenants(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleReset = () => {
    if (window.confirm('VAROVÁNÍ: Tato akce vymaže všechna data a obnoví výchozí ukázková data. Pokračovat?')) {
      localStorage.removeItem('hps_db');
      setTenants(DEFAULT_TENANTS);
      window.location.reload();
    }
  };

  // Calculations
  const calculateTenantStats = (t: Tenant) => {
    // Determine area based on assigned rooms
    const assignedRooms = ROOMS.filter(r => t.rooms.includes(r.id));
    const area = assignedRooms.reduce((sum, r) => sum + r.a, 0);
    
    // Calculate total price
    // Formula: (Area * Price/m2) + (Parking Count * Parking Price) + Cleaning (Variable) + Furniture + Internet (0)
    let baseRent = area * t.price;
    if (t.disc > 0) {
        baseRent = baseRent * (1 - (t.disc / 100));
    }
    
    const parkingPrice = t.park.length * (t.parkingPrice || 1500);
    const services = t.cln + t.furn; // Internet is now free (0)
    
    const total = baseRent + parkingPrice + services;
    
    return { area, total, parkingPrice, services };
  };

  const totalRevenue = tenants.reduce((acc, t) => acc + calculateTenantStats(t).total, 0);
  const totalOccupiedArea = tenants.reduce((acc, t) => acc + calculateTenantStats(t).area, 0);
  const totalArea = ROOMS.reduce((acc, r) => acc + r.a, 0);
  const occupiedRate = totalArea > 0 ? (totalOccupiedArea / totalArea) * 100 : 0;
  
  // Calculate free rooms properly
  const occupiedRoomIds = new Set(tenants.flatMap(t => t.rooms));
  const freeRoomsCount = ROOMS.length - occupiedRoomIds.size;

  // Export functions
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const exportTenants = () => {
    const headers = ['ID', 'Název', 'IČO', 'Email', 'Plocha (m2)', 'Parkování (ks)', 'Úklid', 'Nábytek', 'K Platbě Celkem'];
    const rows = tenants.map(t => {
      const stats = calculateTenantStats(t);
      return [
        t.id, 
        `"${t.name}"`, 
        t.ico, 
        t.mail, 
        stats.area.toFixed(2).replace('.', ','), 
        t.park.length, 
        t.cln, 
        t.furn, 
        Math.round(stats.total)
      ].join(';');
    });
    downloadCSV([headers.join(';'), ...rows].join('\n'), 'najemci_export.csv');
  };

  const exportFreeRooms = () => {
    const headers = ['ID Místnosti', 'Název', 'Plocha (m2)', 'Patro'];
    const freeRooms = ROOMS.filter(r => !occupiedRoomIds.has(r.id));
    const rows = freeRooms.map(r => [r.id, `"${r.n}"`, r.a.toString().replace('.', ','), r.f].join(';'));
    downloadCSV([headers.join(';'), ...rows].join('\n'), 'volne_mistnosti.csv');
  };

  const exportOccupied = () => {
    const headers = ['ID Místnosti', 'Název', 'Plocha (m2)', 'Nájemce'];
    const occupiedRows = ROOMS.filter(r => occupiedRoomIds.has(r.id)).map(r => {
        const tenant = tenants.find(t => t.rooms.includes(r.id));
        return [r.id, `"${r.n}"`, r.a.toString().replace('.', ','), `"${tenant?.name || ''}"`].join(';');
    });
    downloadCSV([headers.join(';'), ...occupiedRows].join('\n'), 'obsazene_prostory.csv');
  };


  // Render Functions
  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Přehled</h2>
           <p className="text-slate-500 mt-1">Souhrnné statistiky a finanční přehled nemovitosti</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <TrendingUp className="w-24 h-24 text-emerald-600" />
          </div>
          <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Měsíční výnos</p>
              <div className="text-4xl font-bold text-slate-800 tracking-tight">{Math.round(totalRevenue).toLocaleString()} <span className="text-lg text-gray-400 font-medium">Kč</span></div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-emerald-600 font-medium">
             <CheckCircle className="w-4 h-4" /> Aktualizováno
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <PieChart className="w-24 h-24 text-blue-600" />
          </div>
          <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Obsazenost plochy</p>
              <div className="text-4xl font-bold text-slate-800 tracking-tight">{Math.round(occupiedRate)} <span className="text-lg text-gray-400 font-medium">%</span></div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-blue-600 font-medium">
             <Building2 className="w-4 h-4" /> {Math.round(totalOccupiedArea)} z {Math.round(totalArea)} m²
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <MapPin className="w-24 h-24 text-orange-600" />
          </div>
          <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Volné jednotky</p>
              <div className="text-4xl font-bold text-slate-800 tracking-tight">{freeRoomsCount}</div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-orange-600 font-medium">
             <AlertCircle className="w-4 h-4" /> K dispozici k pronájmu
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
           <h3 className="text-lg font-bold text-slate-800">Rozpis nájemného</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase text-gray-500 bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-4 font-semibold tracking-wider">Firma</th>
                <th className="px-8 py-4 font-semibold tracking-wider">Plocha</th>
                <th className="px-8 py-4 font-semibold tracking-wider">Parkování</th>
                <th className="px-8 py-4 font-semibold tracking-wider">Služby</th>
                <th className="px-8 py-4 font-semibold tracking-wider text-right">Celkem k úhradě</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tenants.map(t => {
                const stats = calculateTenantStats(t);
                return (
                  <tr key={t.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-8 py-5 font-semibold text-slate-700">{t.name}</td>
                    <td className="px-8 py-5 text-gray-600">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-mono font-medium">{stats.area.toFixed(1)} m²</span>
                    </td>
                    <td className="px-8 py-5 text-gray-600">
                        {t.park.length > 0 ? (
                            <div className="flex flex-col">
                                <span className="flex items-center gap-1 text-sm"><Car className="w-3 h-3 text-orange-500" /> {t.park.length} ks</span>
                                <span className="text-[10px] text-gray-400">{t.parkingPrice} Kč/ks</span>
                            </div>
                        ) : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-8 py-5 text-gray-600 flex gap-2">
                       {t.net && <span title="Internet Zdarma" className="px-2 py-1 bg-green-50 text-green-700 border border-green-100 rounded text-xs font-medium">NET</span>}
                       {t.cln > 0 && <span title={`Úklid: ${t.cln} Kč`} className="px-2 py-1 bg-teal-50 text-teal-700 border border-teal-100 rounded text-xs font-medium">ÚKLID</span>}
                       {(!t.net && t.cln === 0) && <span className="text-gray-400 text-sm">-</span>}
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-slate-800 text-lg">{Math.round(stats.total).toLocaleString()} Kč</td>
                  </tr>
                );
              })}
              {tenants.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-8 py-16 text-center text-gray-400">
                        <div className="flex flex-col items-center">
                            <Users className="w-10 h-10 mb-3 opacity-20" />
                            <p>Zatím zde nejsou žádní nájemci.</p>
                            <button onClick={() => { setActivePage('tenants'); setIsModalOpen(true); }} className="mt-4 text-blue-600 hover:underline text-sm font-medium">Přidat prvního nájemce</button>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTenants = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Nájemci</h2>
            <p className="text-slate-500 mt-1">Správa smluv a kontaktních údajů</p>
        </div>
        <button 
          onClick={() => { setEditingTenant(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-slate-900/20 font-medium hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Přidat nájemce
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase text-gray-500 bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold tracking-wider">Název / IČO</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Smlouva</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Cena/m²</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Sleva</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Kauce</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tenants.map(t => (
                <tr key={t.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{t.name}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">{t.ico || "Bez IČO"}</div>
                    <a href={`mailto:${t.mail}`} className="text-xs text-blue-600 hover:underline">{t.mail}</a>
                  </td>
                  <td className="px-6 py-4">
                    {t.contractFile ? (
                        <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded max-w-[150px]">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate" title={t.contractFile}>{t.contractFile}</span>
                        </div>
                    ) : <span className="text-xs text-gray-400 italic">Nenahráno</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{t.price} Kč</td>
                  <td className="px-6 py-4">
                    {t.disc > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-red-50 text-red-600">-{t.disc}%</span>
                    ) : <span className="text-gray-300 text-sm">0%</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-sm">{t.dep.toLocaleString()} Kč</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingTenant(t); setIsModalOpen(true); }}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                        title="Upravit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTenant(t.id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        title="Smazat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                        <Users className="w-12 h-12 mb-3 mx-auto opacity-20" />
                        <p>Seznam nájemců je prázdný.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Místnosti</h2>
        <p className="text-slate-500 mt-1">Obsazenost kanceláří a skladů</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase text-gray-500 bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 font-semibold tracking-wider">ID</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Název</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Plocha</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Patro</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Stav</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ROOMS.map(r => {
              const tenant = tenants.find(t => t.rooms.includes(r.id));
              return (
                <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-3 font-mono text-sm font-semibold text-slate-600">{r.id}</td>
                  <td className="px-6 py-3 font-medium text-slate-800">{r.n}</td>
                  <td className="px-6 py-3 text-gray-600 text-sm">{r.a} m²</td>
                  <td className="px-6 py-3 text-gray-600 text-sm">{r.f}. patro</td>
                  <td className="px-6 py-3">
                    {tenant ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        <Users className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{tenant.name}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle className="w-3 h-3" />
                        Volné
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderParking = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Parkování</h2>
        <p className="text-slate-500 mt-1">Správa parkovacích stání ve dvoře</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {PARKING.map(pid => {
             const tenant = tenants.find(t => t.park.includes(pid));
             return (
               <div key={pid} className={`p-5 rounded-xl border-2 transition-all duration-200 ${tenant ? 'bg-white border-blue-100 shadow-sm' : 'bg-white border-dashed border-gray-200 hover:border-emerald-200'}`}>
                 <div className="flex justify-between items-start mb-3">
                    <div className={`p-2.5 rounded-lg ${tenant ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                        <Car className="w-6 h-6" />
                    </div>
                    {tenant ? (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase">Obsazeno</span>
                    ) : (
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded uppercase">Volné</span>
                    )}
                 </div>
                 
                 <div>
                    <h4 className="text-lg font-bold text-slate-800">Místo {pid}</h4>
                    <p className="text-xs text-gray-500 mb-3">Parkování ve dvoře</p>
                    
                    {tenant ? (
                        <div className="pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-400 mb-1">Nájemce</p>
                            <p className="text-sm font-semibold text-blue-700 truncate" title={tenant.name}>{tenant.name}</p>
                            <p className="text-xs text-gray-400 mt-1">Cena: {tenant.parkingPrice} Kč</p>
                        </div>
                    ) : (
                        <div className="pt-3 border-t border-gray-50">
                            <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                                K dispozici
                            </p>
                        </div>
                    )}
                 </div>
               </div>
             )
          })}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col fixed h-full shadow-2xl z-30">
        <div className="p-8 border-b border-slate-800/50 bg-slate-950/30">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/40 text-white">H</div>
             <div>
                 <h1 className="text-xl font-bold tracking-tight text-white leading-none">HPS Real</h1>
                 <p className="text-xs text-slate-400 mt-1.5 font-medium">Správa nemovitostí v1.0</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto mt-4">
          <button 
            onClick={() => setActivePage('dash')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activePage === 'dash' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activePage === 'dash' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} /> 
            Dashboard
          </button>
          <button 
            onClick={() => setActivePage('tenants')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activePage === 'tenants' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users className={`w-5 h-5 ${activePage === 'tenants' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} /> 
            Nájemci
          </button>
          <button 
            onClick={() => setActivePage('rooms')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activePage === 'rooms' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Building2 className={`w-5 h-5 ${activePage === 'rooms' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} /> 
            Místnosti
          </button>
          <button 
            onClick={() => setActivePage('parking')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activePage === 'parking' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Car className={`w-5 h-5 ${activePage === 'parking' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} /> 
            Parkování
          </button>

          <div className="pt-6 mt-6 border-t border-slate-800/50">
             <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Export Dat</p>
             <button 
                onClick={exportTenants}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors text-sm"
             >
                <Download className="w-4 h-4" /> Export Nájemců
             </button>
             <button 
                onClick={exportOccupied}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors text-sm"
             >
                <Download className="w-4 h-4" /> Obsazené Prostory
             </button>
             <button 
                onClick={exportFreeRooms}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors text-sm"
             >
                <Download className="w-4 h-4" /> Volné Místnosti
             </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800/50 bg-slate-950/20">
           <button 
             onClick={handleReset}
             className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-700 text-slate-400 hover:bg-red-950/30 hover:text-red-400 hover:border-red-900/50 transition-all text-sm font-medium"
           >
             <LogOut className="w-4 h-4" /> Resetovat Data
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8 overflow-y-auto h-screen w-full bg-slate-50">
         <div className="max-w-7xl mx-auto pb-12">
            {activePage === 'dash' && renderDashboard()}
            {activePage === 'tenants' && renderTenants()}
            {activePage === 'rooms' && renderRooms()}
            {activePage === 'parking' && renderParking()}
         </div>
      </main>

      {/* Modal */}
      <TenantModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTenant} 
        tenantToEdit={editingTenant}
        existingTenants={tenants}
      />
    </div>
  );
};

export default App;