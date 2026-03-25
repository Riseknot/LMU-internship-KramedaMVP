import React, { useRef, useState } from 'react';
import { Certification } from '../types';
import { Shield, CheckCircle, Upload, FileText, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CertificationManagerProps {
  certifications: Certification[];
  onUpload?: (cert: Omit<Certification, 'id' | 'uploadedAt' | 'verified'>) => void | Promise<void>;
  isOwnProfile?: boolean;
}

export function CertificationManager({ 
  certifications = [], 
  onUpload,
  isOwnProfile = false 
}: CertificationManagerProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newCertName, setNewCertName] = useState('');
  const [newCertType, setNewCertType] = useState<Certification['type']>('other');
  const [newCertFileUrl, setNewCertFileUrl] = useState('');
  const [newCertFileName, setNewCertFileName] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const certTypeLabels: Record<Certification['type'], string> = {
    'fuehrungszeugnis': 'Führungszeugnis',
    'erste-hilfe': 'Erste-Hilfe-Kurs',
    'pflegekurs': 'Pflegekurs',
    'other': 'Sonstiges'
  };

  const certTypeIcons: Record<Certification['type'], string> = {
    'fuehrungszeugnis': '🛡️',
    'erste-hilfe': '🏥',
    'pflegekurs': '💚',
    'other': '📄'
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSizeInBytes = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Bitte nur PDF, JPG oder PNG hochladen.');
      return;
    }

    if (file.size > maxSizeInBytes) {
      setUploadError('Datei zu gross. Maximal 5 MB erlaubt.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setNewCertFileUrl(String(reader.result || ''));
      setNewCertFileName(file.name);
      setUploadError('');
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!newCertName.trim() || !newCertFileUrl || !onUpload) {
      setUploadError('Bitte Name und Datei angeben.');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload({
        name: newCertName,
        type: newCertType,
        fileUrl: newCertFileUrl,
      });

      setNewCertName('');
      setNewCertType('other');
      setNewCertFileUrl('');
      setNewCertFileName('');
      setUploadError('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowUploadModal(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload fehlgeschlagen. Bitte erneut versuchen.';
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const verifiedCount = certifications.filter(c => c.verified).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-neutral-900">Zertifizierungen</h3>
          {verifiedCount > 0 && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              {verifiedCount} verifiziert
            </span>
          )}
        </div>
        {isOwnProfile && onUpload && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            Hochladen
          </button>
        )}
      </div>

      {/* Certifications List */}
      <div className="space-y-4">
        {certifications.length === 0 ? (
          <div className="bg-neutral-50 rounded-lg p-6 text-center border border-neutral-200">
            <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-sm text-neutral-600">
              {isOwnProfile
                ? 'Noch keine Zertifizierungen hochgeladen'
                : 'Keine Zertifizierungen verfügbar'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {certifications.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  bg-white rounded-lg p-4 border-2 transition-all
                  ${cert.verified
                    ? 'border-green-200 bg-green-50/50'
                    : 'border-neutral-200'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl shrink-0">
                    {certTypeIcons[cert.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-neutral-900">{cert.name}</h4>
                      {cert.verified && (
                        <div className="flex items-center gap-1 text-green-600 shrink-0">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Verifiziert</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600">
                      {certTypeLabels[cert.type]}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Hochgeladen am {new Date(cert.uploadedAt).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                    {cert.fileUrl && (
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-xs font-medium text-primary-700 hover:text-primary-800 hover:underline"
                      >
                        Dokument ansehen
                      </a>
                    )}
                    {!cert.verified && (
                      <div className="flex items-center gap-1 text-amber-600 mt-2">
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-xs">Wird geprüft</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="rounded-lg border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Hochgeladene Dokumente</p>
          </div>
          <div className="divide-y divide-neutral-200">
            {certifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-neutral-500">Noch keine Dokumente hochgeladen.</div>
            ) : (
              certifications.map((cert) => (
                <div key={`list-${cert.id}`} className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_130px] items-center gap-3 px-4 py-2">
                  <p className="truncate text-sm text-neutral-900" title={cert.name}>{cert.name}</p>
                  <p className="text-sm text-neutral-600">{certTypeLabels[cert.type]}</p>
                  <p className="text-xs text-neutral-500">{cert.verified ? 'Verifiziert' : 'In Pruefung'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-neutral-900">Zertifikat hochladen</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Typ
                  </label>
                  <select
                    value={newCertType}
                    onChange={(e) => setNewCertType(e.target.value as Certification['type'])}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {Object.entries(certTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newCertName}
                    onChange={(e) => setNewCertName(e.target.value)}
                    placeholder="z.B. Polizeiliches Führungszeugnis"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Datei
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-600">
                      Klicken zum Hochladen
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      PDF, JPG oder PNG (max. 5MB)
                    </p>
                    {newCertFileName && (
                      <p className="mt-2 text-xs font-medium text-primary-700">Ausgewaehlt: {newCertFileName}</p>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/png,image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {uploadError && (
                  <p className="text-xs font-medium text-red-600">{uploadError}</p>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Hinweis:</strong> Ihre Zertifizierung wird von unserem Team geprüft. 
                    Dies kann 1-2 Werktage dauern.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!newCertName.trim() || !newCertFileUrl || isUploading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploading ? 'Laedt hoch...' : 'Hochladen'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
