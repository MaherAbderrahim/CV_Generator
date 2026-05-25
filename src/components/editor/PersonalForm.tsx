import React, { useRef } from "react";
import { useCVStore } from "../../store/useCVStore";
import { Mail, Phone, MapPin, Globe, User, Image as ImageIcon, Plus, Trash2, Link as LinkIcon } from "lucide-react";

export const PersonalForm: React.FC = () => {
  const { data, updatePersonalInfo, addSocialLink, updateSocialLink, removeSocialLink } = useCVStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updatePersonalInfo({ [name]: value });
  };

  const resizePhoto = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Impossible de lire cette image."));
      reader.onload = () => {
        const image = document.createElement("img");
        image.onerror = () => reject(new Error("Le fichier choisi n'est pas une image valide."));
        image.onload = () => {
          const maxSize = 900;
          const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * ratio));
          canvas.height = Math.max(1, Math.round(image.height * ratio));
          const context = canvas.getContext("2d");

          if (!context) {
            reject(new Error("Impossible de préparer cette image."));
            return;
          }

          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.88));
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Offline image uploads are resized before storage to avoid localStorage quota errors.
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Merci de choisir une image valide.");
      e.target.value = "";
      return;
    }

    resizePhoto(file)
      .then((photoUrl) => updatePersonalInfo({ photoUrl, photoPositionX: 50, photoPositionY: 50, photoZoom: 100 }))
      .catch((error) => {
        console.error("Photo upload failed", error);
        alert(error instanceof Error ? error.message : "Impossible d'ajouter cette photo.");
      })
      .finally(() => {
        e.target.value = "";
      });
  };

  const handleAddSocial = () => {
    addSocialLink({ platform: "LinkedIn", username: "username", url: "https://linkedin.com/in/" });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return (
          <svg className="w-3.5 h-3.5 fill-current text-cyan-400 shrink-0" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        );
      case "linkedin":
        return (
          <svg className="w-3.5 h-3.5 fill-current text-cyan-400 shrink-0" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        );
      case "twitter":
        return (
          <svg className="w-3.5 h-3.5 fill-current text-cyan-400 shrink-0" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646 1.014-.727 1.89-1.63 2.586-2.662z" />
          </svg>
        );
      default:
        return <LinkIcon size={14} className="shrink-0 text-slate-400" />;
    }
  };

  const socialLinks = data?.socialLinks ?? [];
  const personalInfo = data?.personalInfo ?? {
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
    address: "",
      website: "",
      photoUrl: "",
      photoPositionX: 50,
      photoPositionY: 50,
      photoZoom: 100,
      summary: "",
  };

  const photoPositionX = personalInfo.photoPositionX ?? 50;
  const photoPositionY = personalInfo.photoPositionY ?? 50;
  const photoZoom = personalInfo.photoZoom ?? 100;
  const photoPreviewStyle = {
    position: "absolute" as const,
    width: `${photoZoom}%`,
    height: `${photoZoom}%`,
    left: `${((100 - photoZoom) * photoPositionX) / 100}%`,
    top: `${((100 - photoZoom) * photoPositionY) / 100}%`,
    objectFit: "cover" as const,
    objectPosition: `${photoPositionX}% ${photoPositionY}%`,
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Photo Profile Uploader */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
        <div className="relative group shrink-0">
          {personalInfo.photoUrl ? (
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500 shadow-md group-hover:opacity-75 transition-opacity relative">
              <img
                src={personalInfo.photoUrl}
                alt="Profil"
                style={photoPreviewStyle}
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 group-hover:border-cyan-500 group-hover:text-slate-400 transition-colors">
              <User size={24} />
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="absolute inset-0 w-full h-full rounded-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <h4 className="text-sm font-semibold text-slate-300">Photo de Profil</h4>
          <p className="text-xs text-slate-500">Formats acceptés : JPG, PNG. Optimisation automatique.</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <ImageIcon size={13} />
              Choisir une photo
            </button>
            {personalInfo.photoUrl && (
              <button
                onClick={() => updatePersonalInfo({ photoUrl: "", photoPositionX: 50, photoPositionY: 50, photoZoom: 100 })}
                type="button"
                className="text-xs px-3 py-1.5 bg-red-950/40 hover:bg-red-900/40 text-red-400 rounded-lg transition-colors border border-red-900/30"
              >
                Supprimer
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
      </div>

      {personalInfo.photoUrl && (
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cadrage de la photo</h4>
            <button
              type="button"
              onClick={() => updatePersonalInfo({ photoPositionX: 50, photoPositionY: 50, photoZoom: 100 })}
              className="text-[11px] px-2 py-1 rounded border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              Réinitialiser
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="space-y-1 text-xs text-slate-400">
              Horizontal
              <input
                type="range"
                min="0"
                max="100"
                value={photoPositionX}
                onChange={(e) => updatePersonalInfo({ photoPositionX: Number(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </label>
            <label className="space-y-1 text-xs text-slate-400">
              Vertical
              <input
                type="range"
                min="0"
                max="100"
                value={photoPositionY}
                onChange={(e) => updatePersonalInfo({ photoPositionY: Number(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </label>
            <label className="space-y-1 text-xs text-slate-400">
              Zoom
              <input
                type="range"
                min="100"
                max="180"
                value={photoZoom}
                onChange={(e) => updatePersonalInfo({ photoZoom: Number(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </label>
          </div>
        </div>
      )}

      {/* Grid forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Prénom</label>
          <div className="relative">
            <input
              type="text"
              name="firstName"
              value={personalInfo.firstName}
              onChange={handleTextChange}
              placeholder="Ex: Jean"
              className="w-full text-sm px-3 py-2 bg-slate-950/80 rounded-lg border border-slate-800 focus:border-cyan-500 focus:outline-none text-slate-100 placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Nom</label>
          <input
            type="text"
            name="lastName"
            value={personalInfo.lastName}
            onChange={handleTextChange}
            placeholder="Ex: Dupont"
            className="w-full text-sm px-3 py-2 bg-slate-950/80 rounded-lg border border-slate-800 focus:border-cyan-500 focus:outline-none text-slate-100 placeholder:text-slate-600"
          />
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-400">Titre professionnel</label>
          <input
            type="text"
            name="title"
            value={personalInfo.title}
            onChange={handleTextChange}
            placeholder="Ex: Développeur Full-Stack Senior"
            className="w-full text-sm px-3 py-2 bg-slate-950/80 rounded-lg border border-slate-800 focus:border-cyan-500 focus:outline-none text-slate-100 placeholder:text-slate-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Mail size={12} className="text-slate-500" /> Adresse email
          </label>
          <input
            type="email"
            name="email"
            value={personalInfo.email}
            onChange={handleTextChange}
            placeholder="Ex: jean.dupont@email.com"
            className="w-full text-sm px-3 py-2 bg-slate-950/80 rounded-lg border border-slate-800 focus:border-cyan-500 focus:outline-none text-slate-100 placeholder:text-slate-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Phone size={12} className="text-slate-500" /> Téléphone
          </label>
          <input
            type="tel"
            name="phone"
            value={personalInfo.phone}
            onChange={handleTextChange}
            placeholder="Ex: +33 6 12 34 56 78"
            className="w-full text-sm px-3 py-2 bg-slate-950/80 rounded-lg border border-slate-800 focus:border-cyan-500 focus:outline-none text-slate-100 placeholder:text-slate-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <MapPin size={12} className="text-slate-500" /> Adresse postale
          </label>
          <input
            type="text"
            name="address"
            value={personalInfo.address}
            onChange={handleTextChange}
            placeholder="Ex: Paris, France"
            className="w-full text-sm px-3 py-2 bg-slate-950/80 rounded-lg border border-slate-800 focus:border-cyan-500 focus:outline-none text-slate-100 placeholder:text-slate-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Globe size={12} className="text-slate-500" /> Site web / Portfolio
          </label>
          <input
            type="url"
            name="website"
            value={personalInfo.website}
            onChange={handleTextChange}
            placeholder="Ex: https://jeandupont.dev"
            className="w-full text-sm px-3 py-2 bg-slate-950/80 rounded-lg border border-slate-800 focus:border-cyan-500 focus:outline-none text-slate-100 placeholder:text-slate-600"
          />
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-400">Accroche / À propos de vous</label>
          <textarea
            name="summary"
            value={personalInfo.summary}
            onChange={handleTextChange}
            rows={4}
            placeholder="Écrivez un résumé professionnel percutant pour capter l'attention des recruteurs..."
            className="w-full text-sm px-3 py-2 bg-slate-950/80 rounded-lg border border-slate-800 focus:border-cyan-500 focus:outline-none text-slate-100 placeholder:text-slate-600 resize-y font-light leading-relaxed"
          />
        </div>
      </div>

      {/* Social networks section */}
      <div className="space-y-3 pt-3 border-t border-slate-800/80">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <LinkIcon size={14} className="text-cyan-500" />
            Réseaux sociaux & liens
          </h4>
          <button
            onClick={handleAddSocial}
            type="button"
            className="text-[11px] px-2 py-1 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-400 rounded border border-cyan-850 flex items-center gap-1 transition-colors"
          >
            <Plus size={12} />
            Ajouter un lien
          </button>
        </div>

        {socialLinks.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-1">Aucun lien social configuré pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {socialLinks.map((link) => (
              <div key={link.id} className="flex gap-2 items-center bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/50">
                <select
                  value={link.platform}
                  onChange={(e) => updateSocialLink(link.id, { platform: e.target.value })}
                  className="text-xs bg-slate-900 text-slate-200 border border-slate-800 rounded px-1.5 py-1 focus:outline-none focus:border-cyan-500"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="GitHub">GitHub</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Dribbble">Dribbble</option>
                  <option value="Behance">Behance</option>
                </select>

                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={link.username}
                    onChange={(e) => updateSocialLink(link.id, { username: e.target.value })}
                    placeholder="Nom d'utilisateur"
                    className="flex-1 text-xs px-2 py-1 bg-slate-900 rounded border border-slate-800 focus:outline-none focus:border-cyan-500 text-slate-200"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                    placeholder="URL complète"
                    className="flex-[2] text-xs px-2 py-1 bg-slate-900 rounded border border-slate-800 focus:outline-none focus:border-cyan-500 text-slate-200"
                  />
                </div>

                <button
                  onClick={() => removeSocialLink(link.id)}
                  type="button"
                  className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default PersonalForm;
