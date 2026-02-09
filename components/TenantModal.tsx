import React, { useState, useEffect } from 'react';
import { Tenant } from '../types';
import { ROOMS, PARKING } from '../constants';
import { X, Save, Building, Car, AlertCircle, Upload, FileText } from 'lucide-react';

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tenant: Tenant) => void;
  tenantToEdit: Tenant | null;
  existingTenants: Tenant[];
}

const TenantModal: React.FC<TenantModalProps> = ({ isOpen, onClose, onSave, tenantToEdit, existingTenants }) => {
  const [formData, setFormData] = useState<Tenant>({
    id: 0,
    name: '',
    ico: '',
    mail: '',
    price: 349,
    disc: 0,
    dep: 0,
    net: true,
    cln: 0,
    furn: 0,
    parkingPrice: 1500,
    contractFile: '',
    rooms: [],
    park: []
  });

  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (tenantToEdit) {
        setFormData({ ...tenantToEdit });
      } else {
        setFormData({
          id: Date.now(),
          name: '',
          ico: '',
          mail: '',
          price: 349,
          disc: 0,
          dep: 0,
          net: true,
          cln: 0,
          furn: 0,
          parkingPrice: 1500,
          contractFile: '',
          rooms: [],
          park: []
        });
      }
    }
  }, [tenantToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
    // Clear error when user types
    if (name === 'name' && errors.name) setErrors(prev => ({ ...prev, name: undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        contractFile: e.target.files![0].name
      }));
    }
  };

  const toggleRoom = (roomId: string) => {
    setFormData(prev => {
      const rooms = prev.rooms.includes(roomId)
        ? prev.rooms.filter(r => r !== roomId)
        : [...prev.rooms, roomId];
      return { ...prev, rooms };
    });
  };

  const toggleParking = (spotId: string) => {
    setFormData(prev => {
      const park = prev.park.includes(spotId)
        ? prev.park.filter(p => p !== spotId)
        : [...prev.park, spotId];
      return { ...prev, park };
    });
  };

  const validate = () => {
    const newErrors: { name?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Název firmy je povinný';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  const isRoomTaken = (roomId: string) => {
    return existingTenants.some(t => t.id !== formData.id && t.rooms.includes(roomId));
  };

  const isParkingTaken = (spotId: string) => {
    return existingTenants.some(t => t.id !== formData.id && t.park.includes(spotId));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {tenantToEdit ? 'Upravit nájemce' : 'Nový nájemce'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {tenantToEdit ? 'Úprava stávajících údajů' : 'Vytvoření nového záznamu'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Details */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                   Základní údaje
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Firma / Název <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    placeholder="Např. Moje Firma s.r.o." 
                    autoFocus
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IČO</label>
                    <input type="text" name="ico" value={formData.ico} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="12345678" />
                   </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="mail" value={formData.mail} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="info@firma.cz" />
                   </div>
                </div>
                
                {/* Contract Upload */}
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Smlouva</label>
                   <div className="flex items-center gap-3">
                     <label className="flex-1 cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 border-dashed rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600">
                        <Upload className="w-4 h-4" />
                        <span className="truncate">{formData.contractFile || 'Nahrát soubor PDF...'}</span>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                     </label>
                     {formData.contractFile && (
                        <button 
                            onClick={() => setFormData(prev => ({...prev, contractFile: ''}))}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                            title="Odebrat soubor"
                        >
                            <X className="w-4 h-4" />
                        </button>
                     )}
                   </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                 <h3 className="font-semibold text-slate-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                    Finanční nastavení
                 </h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cena za m² (Kč)</label>
                      <input type="number" min="0" name="price" value={formData.price} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sleva (%)</label>
                      <input type="number" min="0" max="100" name="disc" value={formData.disc} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kauce (Kč)</label>
                        <input type="number" min="0" name="dep" value={formData.dep} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cena parkování (ks)</label>
                        <input type="number" min="0" name="parkingPrice" value={formData.parkingPrice} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Úklid (Kč/měs)</label>
                        <input type="number" min="0" name="cln" value={formData.cln} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Např. 2400" />
                        <span className="text-[10px] text-gray-400">Upster: ~2400 Kč</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nábytek (Kč/měs)</label>
                        <input type="number" min="0" name="furn" value={formData.furn} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                 </div>
                 
                 <div className="pt-2">
                     <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full">
                          <input type="checkbox" name="net" checked={formData.net} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                          <div>
                              <span className="block text-sm font-medium text-slate-800">Internet</span>
                              <span className="block text-xs text-green-600 font-bold">ZDARMA v ceně</span>
                          </div>
                     </label>
                 </div>
              </div>
            </div>

            {/* Right Column: Assignments */}
            <div className="space-y-6">
               {/* Rooms Selector */}
               <div className="flex flex-col h-[500px]">
                 <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
                     <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                           <Building className="w-4 h-4 text-blue-600" /> Přiřadit místnosti
                        </h3>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            {formData.rooms.length} vybráno
                        </span>
                     </div>
                     <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {ROOMS.map(room => {
                          const taken = isRoomTaken(room.id);
                          const selected = formData.rooms.includes(room.id);
                          return (
                            <label key={room.id} className={`flex items-center p-3 rounded-lg cursor-pointer transition-all border ${taken ? 'opacity-50 cursor-not-allowed bg-gray-100 border-transparent' : (selected ? 'bg-blue-50 border-blue-200 shadow-sm' : 'hover:bg-gray-50 border-transparent')}`}>
                              <input 
                                type="checkbox" 
                                disabled={taken}
                                checked={selected}
                                onChange={() => toggleRoom(room.id)}
                                className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <div className="flex justify-between w-full items-center">
                                <div>
                                    <span className="font-semibold text-gray-800 text-sm">{room.id}</span>
                                    <div className="text-xs text-gray-500">{room.n}</div>
                                </div>
                                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">{room.a} m²</span>
                              </div>
                            </label>
                          );
                        })}
                     </div>
                 </div>
               </div>

               {/* Parking Selector */}
               <div className="flex flex-col">
                 <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                     <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                           <Car className="w-4 h-4 text-orange-600" /> Přiřadit parkování
                        </h3>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                            {formData.park.length} vybráno
                        </span>
                     </div>
                     <div className="p-2 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                        {PARKING.map(spot => {
                          const taken = isParkingTaken(spot);
                          const selected = formData.park.includes(spot);
                          return (
                            <label key={spot} className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-all border text-center ${taken ? 'opacity-40 cursor-not-allowed bg-gray-100 border-transparent' : (selected ? 'bg-orange-50 border-orange-200 shadow-sm' : 'hover:bg-gray-50 border-gray-100')}`}>
                              <input 
                                type="checkbox" 
                                disabled={taken}
                                checked={selected}
                                onChange={() => toggleParking(spot)}
                                className="sr-only" // Hide default checkbox, style the container
                              />
                              <span className={`text-sm font-bold ${selected ? 'text-orange-700' : 'text-gray-700'}`}>{spot}</span>
                              <span className="text-[10px] text-gray-400">Dvůr</span>
                              {selected && <div className="mt-1 w-2 h-2 rounded-full bg-orange-500"></div>}
                            </label>
                          );
                        })}
                     </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-100 flex justify-between items-center bg-white">
          <div className="text-sm text-gray-500 hidden sm:block">
            <span className="text-red-500">*</span> Povinné údaje
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={onClose} className="flex-1 sm:flex-none px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                Zrušit
              </button>
              <button onClick={handleSave} className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-800 text-white font-medium hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20">
                <Save className="w-4 h-4" />
                Uložit záznam
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantModal;