import React, { useState } from 'react';
import { Download, Plus, RotateCcw, Trash2, Upload, X } from 'lucide-react';
import { BakeryConfig, MenuItem, TestimonialItem } from '../types/bakery';
import { generateStandaloneHtml } from '../utils/exportStandaloneSite';

interface SiteCustomizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: BakeryConfig;
  menuItems: MenuItem[];
  testimonials: TestimonialItem[];
  onChangeConfig: (next: BakeryConfig) => void;
  onChangeMenuItems: (next: MenuItem[]) => void;
  onResetDefaults: () => void;
}

type CustomizerTab = 'identidade' | 'textos' | 'cardapio';

const ACCENT_PRESETS = [
  { label: 'Dourado Forno', hex: '#D99B38' },
  { label: 'Cobre Artesanal', hex: '#C87D4B' },
  { label: 'Verde Amazônia', hex: '#4B8F6A' },
  { label: 'Café Torrado', hex: '#B48A64' },
];

export const SiteCustomizerDrawer: React.FC<SiteCustomizerDrawerProps> = ({
  isOpen,
  onClose,
  config,
  menuItems,
  testimonials,
  onChangeConfig,
  onChangeMenuItems,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<CustomizerTab>('identidade');
  const [exportReadyUrl, setExportReadyUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const updateField = <K extends keyof BakeryConfig>(
    key: K,
    value: BakeryConfig[K],
  ) => {
    onChangeConfig({ ...config, [key]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('logoUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleItemImageUpload = (
    itemId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChangeMenuItems(
          menuItems.map((item) =>
            item.id === itemId ? { ...item, image: reader.result as string } : item,
          ),
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddMenuItem = () => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: 'Novo Produto da Padaria',
      category: 'Pães',
      subtitle: 'Produção própria',
      description: 'Descreva os ingredientes e diferenciais deste produto.',
      price: '',
      unitLabel: 'Unidade',
      image: config.heroImage,
    };
    onChangeMenuItems([newItem, ...menuItems]);
  };

  const handleExportHtml = () => {
    const html = generateStandaloneHtml(config, menuItems, testimonials);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    if (exportReadyUrl) {
      URL.revokeObjectURL(exportReadyUrl);
    }
    const url = URL.createObjectURL(blob);
    setExportReadyUrl(url);
    const link = document.createElement('a');
    link.href = url;
    const slug = config.businessName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    link.download = `${slug || 'mini-site-padaria'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Personalizar Site da Padaria"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full bg-[#F8F6F1] dark:bg-[#141210] text-stone-900 dark:text-[#F5F2EB] border-l border-stone-200 dark:border-white/10 flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 dark:border-white/10 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Personalizar Site do Negócio
            </h2>
            <p className="text-xs text-stone-500 dark:text-[#A8A29E]">
              Edite textos, preços, imagens, logo, cores e exporte o mini site
              independente.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar personalização"
            className="w-10 h-10 rounded-md border border-stone-300 dark:border-white/15 flex items-center justify-center hover:bg-stone-200/60 dark:hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="px-6 pt-4 pb-3 border-b border-stone-200 dark:border-white/10 flex items-center gap-2 overflow-x-auto">
          {(
            [
              { id: 'identidade', label: 'Identidade & Cores' },
              { id: 'textos', label: 'Textos & Mídia' },
              { id: 'cardapio', label: 'Cardápio & Preços' },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={
                  active
                    ? { backgroundColor: config.accentColor, color: '#11100F' }
                    : undefined
                }
                className={`px-3.5 py-2 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  active
                    ? ''
                    : 'bg-stone-200/70 dark:bg-[#1A1816] text-stone-700 dark:text-[#A8A29E]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {activeTab === 'identidade' && (
            <>
              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Nome do Negócio
                </label>
                <input
                  type="text"
                  value={config.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md text-sm bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/15"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Cidade / Estado
                  </label>
                  <input
                    type="text"
                    value={config.cityLabel}
                    onChange={(e) => updateField('cityLabel', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md text-sm bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/15"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={config.neighborhood}
                    onChange={(e) => updateField('neighborhood', e.target.value)}
                    placeholder="Ex.: Adrianópolis"
                    className="w-full px-3.5 py-2.5 rounded-md text-sm bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Endereço Completo (para Google Maps)
                </label>
                <input
                  type="text"
                  value={config.streetAddress}
                  onChange={(e) => updateField('streetAddress', e.target.value)}
                  placeholder="Rua, número e ponto de referência"
                  className="w-full px-3.5 py-2.5 rounded-md text-sm bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/15"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    WhatsApp (DDI + DDD + Número)
                  </label>
                  <input
                    type="tel"
                    value={config.whatsappNumber}
                    onChange={(e) => updateField('whatsappNumber', e.target.value)}
                    placeholder="5592999999999"
                    className="w-full px-3.5 py-2.5 rounded-md text-sm font-mono-tabular bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/15"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Horário de Funcionamento
                  </label>
                  <input
                    type="text"
                    value={config.openingHours}
                    onChange={(e) => updateField('openingHours', e.target.value)}
                    placeholder="Ex.: Seg a Sáb, 06h às 20h"
                    className="w-full px-3.5 py-2.5 rounded-md text-sm bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Logo da Padaria (arquivo ou URL)
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium border border-stone-300 dark:border-white/15 cursor-pointer hover:bg-stone-200/60 dark:hover:bg-white/5">
                    <Upload className="w-3.5 h-3.5" />
                    Enviar Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="sr-only"
                    />
                  </label>
                  {config.logoUrl && (
                    <button
                      type="button"
                      onClick={() => updateField('logoUrl', '')}
                      className="text-xs text-red-500 underline cursor-pointer"
                    >
                      Remover logo
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-medium mb-1.5">
                    Tema Visual
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('themeMode', 'dark')}
                      className={`py-2 px-3 rounded-md text-xs font-medium border cursor-pointer ${
                        config.themeMode === 'dark'
                          ? 'bg-stone-900 text-white border-[#D99B38]'
                          : 'border-stone-300 dark:border-white/15'
                      }`}
                    >
                      Escuro Forno
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('themeMode', 'light')}
                      className={`py-2 px-3 rounded-md text-xs font-medium border cursor-pointer ${
                        config.themeMode === 'light'
                          ? 'bg-white text-stone-900 border-[#D99B38]'
                          : 'border-stone-300 dark:border-white/15'
                      }`}
                    >
                      Claro Manhã
                    </button>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-medium mb-1.5">
                    Cor de Destaque
                  </span>
                  <div className="flex items-center gap-2">
                    {ACCENT_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        title={preset.label}
                        onClick={() => updateField('accentColor', preset.hex)}
                        style={{ backgroundColor: preset.hex }}
                        className={`w-8 h-8 rounded-md cursor-pointer border-2 ${
                          config.accentColor.toLowerCase() ===
                          preset.hex.toLowerCase()
                            ? 'border-white ring-2 ring-stone-900 dark:ring-white'
                            : 'border-transparent'
                        }`}
                      />
                    ))}
                    <input
                      type="color"
                      aria-label="Escolher cor personalizada"
                      value={config.accentColor}
                      onChange={(e) => updateField('accentColor', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'textos' && (
            <>
              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Título Principal (Hero)
                </label>
                <input
                  type="text"
                  value={config.heroHeadline}
                  onChange={(e) => updateField('heroHeadline', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md text-sm bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/15"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Subtítulo Principal
                </label>
                <textarea
                  rows={3}
                  value={config.heroSubheadline}
                  onChange={(e) => updateField('heroSubheadline', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md text-sm bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/15"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Título da Seção de Ofertas / Encomendas
                </label>
                <input
                  type="text"
                  value={config.promoTitle}
                  onChange={(e) => updateField('promoTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md text-sm bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/15"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Descrição da Oferta
                </label>
                <textarea
                  rows={3}
                  value={config.promoDescription}
                  onChange={(e) => updateField('promoDescription', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md text-sm bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/15"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  URL de Vídeo da Padaria (YouTube ou MP4 — opcional)
                </label>
                <input
                  type="url"
                  value={config.videoReelUrl}
                  onChange={(e) => updateField('videoReelUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 rounded-md text-sm bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/15"
                />
              </div>
            </>
          )}

          {activeTab === 'cardapio' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-500 dark:text-[#A8A29E]">
                  Defina preços reais (ex.: R$ 1,00 ou R$ 28,00) ou deixe em
                  branco para exibir “Consultar valor”.
                </p>
                <button
                  type="button"
                  onClick={handleAddMenuItem}
                  style={{ backgroundColor: config.accentColor }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-[#11100F] shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Novo Item
                </button>
              </div>

              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-stone-200 dark:border-white/10 bg-white dark:bg-[#181614] space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        onChangeMenuItems(
                          menuItems.map((m) =>
                            m.id === item.id ? { ...m, name: e.target.value } : m,
                          ),
                        )
                      }
                      className="flex-1 px-3 py-1.5 rounded text-sm font-semibold bg-stone-50 dark:bg-[#11100F] border border-stone-300 dark:border-white/15"
                    />
                    <button
                      type="button"
                      aria-label={`Excluir ${item.name}`}
                      onClick={() =>
                        onChangeMenuItems(
                          menuItems.filter((m) => m.id !== item.id),
                        )
                      }
                      className="p-2 text-stone-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">
                        Preço real (opcional)
                      </label>
                      <input
                        type="text"
                        value={item.price}
                        placeholder="Ex.: R$ 18,00"
                        onChange={(e) =>
                          onChangeMenuItems(
                            menuItems.map((m) =>
                              m.id === item.id
                                ? { ...m, price: e.target.value }
                                : m,
                            ),
                          )
                        }
                        className="w-full px-3 py-1.5 rounded text-xs font-mono-tabular bg-stone-50 dark:bg-[#11100F] border border-stone-300 dark:border-white/15"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">
                        Unidade / Medida
                      </label>
                      <input
                        type="text"
                        value={item.unitLabel}
                        onChange={(e) =>
                          onChangeMenuItems(
                            menuItems.map((m) =>
                              m.id === item.id
                                ? { ...m, unitLabel: e.target.value }
                                : m,
                            ),
                          )
                        }
                        className="w-full px-3 py-1.5 rounded text-xs bg-stone-50 dark:bg-[#11100F] border border-stone-300 dark:border-white/15"
                      />
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) =>
                      onChangeMenuItems(
                        menuItems.map((m) =>
                          m.id === item.id
                            ? { ...m, description: e.target.value }
                            : m,
                        ),
                      )
                    }
                    className="w-full px-3 py-1.5 rounded text-xs bg-stone-50 dark:bg-[#11100F] border border-stone-300 dark:border-white/15"
                  />

                  <label className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    Trocar foto do produto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleItemImageUpload(item.id, e)}
                      className="sr-only"
                    />
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions: Export Independent HTML Site & Reset */}
        <div className="p-6 border-t border-stone-200 dark:border-white/10 space-y-2.5">
          <button
            type="button"
            onClick={handleExportHtml}
            style={{ backgroundColor: config.accentColor }}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 min-h-[44px] rounded-md text-sm font-semibold text-[#11100F] hover:brightness-110 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Exportar Mini Site Independente (.html)
          </button>

          <button
            type="button"
            onClick={onResetDefaults}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-xs font-medium border border-stone-300 dark:border-white/15 text-stone-600 dark:text-[#A8A29E] hover:text-stone-900 dark:hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar configurações iniciais
          </button>
        </div>
      </div>
    </div>
  );
};
