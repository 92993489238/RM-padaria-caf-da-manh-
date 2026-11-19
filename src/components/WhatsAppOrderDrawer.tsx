import React, { useMemo, useState } from 'react';
import { Check, Copy, MessageCircle, Minus, Plus, Trash2, X } from 'lucide-react';
import { BakeryConfig, CartEntry } from '../types/bakery';

interface WhatsAppOrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: BakeryConfig;
  cart: CartEntry[];
  initialNote: string;
  onUpdateQty: (itemId: string, delta: number) => void;
  onClearCart: () => void;
  onSaveWhatsappNumber: (number: string) => void;
}

export const WhatsAppOrderDrawer: React.FC<WhatsAppOrderDrawerProps> = ({
  isOpen,
  onClose,
  config,
  cart,
  initialNote,
  onUpdateQty,
  onClearCart,
  onSaveWhatsappNumber,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [fulfillment, setFulfillment] = useState<'entrega' | 'retirada'>('entrega');
  const [deliveryArea, setDeliveryArea] = useState('');
  const [extraNote, setExtraNote] = useState(initialNote);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (initialNote) {
      setExtraNote(initialNote);
    }
  }, [initialNote]);

  const rawDigits = config.whatsappNumber.replace(/\D/g, '');
  const cleanWhatsappDigits =
    rawDigits.length === 10 || rawDigits.length === 11
      ? `55${rawDigits}`
      : rawDigits;

  const formattedMessage = useMemo(() => {
    const lines: string[] = [
      `Olá, *${config.businessName}*!`,
      '',
    ];

    if (cart.length > 0) {
      lines.push('*Itens do pedido:*');
      cart.forEach((entry) => {
        const priceNote = entry.item.price ? ` (${entry.item.price})` : '';
        lines.push(`- ${entry.quantity}x ${entry.item.name}${priceNote}`);
      });
      lines.push('');
    }

    if (customerName.trim()) {
      lines.push(`*Nome:* ${customerName.trim()}`);
    }

    lines.push(
      `*Modalidade:* ${
        fulfillment === 'entrega' ? 'Entrega em Manaus' : 'Retirada no balcão'
      }`,
    );

    if (fulfillment === 'entrega' && deliveryArea.trim()) {
      lines.push(`*Bairro / Endereço:* ${deliveryArea.trim()}`);
    }

    if (extraNote.trim()) {
      lines.push(`*Observação:* ${extraNote.trim()}`);
    }

    if (cart.length === 0 && !extraNote.trim()) {
      lines.push('Gostaria de consultar os itens disponíveis e valores de hoje.');
    }

    return lines.join('\n');
  }, [cart, config.businessName, customerName, deliveryArea, extraNote, fulfillment]);

  const whatsappHref = cleanWhatsappDigits
    ? `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
        formattedMessage,
      )}`
    : `https://wa.me/?text=${encodeURIComponent(formattedMessage)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pedido pelo WhatsApp"
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg h-full bg-[#F8F6F1] dark:bg-[#141210] text-stone-900 dark:text-[#F5F2EB] border-l border-stone-200 dark:border-white/10 flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 dark:border-white/10 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Pedido via WhatsApp
            </h2>
            <p className="text-xs text-stone-500 dark:text-[#A8A29E]">
              {config.businessName} · {config.cityLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar painel de pedido"
            className="w-10 h-10 rounded-md border border-stone-300 dark:border-white/15 flex items-center justify-center hover:bg-stone-200/60 dark:hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Selected Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Itens Selecionados</h3>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Limpar
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <p className="text-xs sm:text-sm text-stone-500 dark:text-[#A8A29E] p-4 rounded-lg border border-stone-200 dark:border-white/10 bg-white dark:bg-[#181614]">
                Nenhum item adicionado ainda. Você pode enviar uma mensagem direta
                abaixo ou escolher produtos no cardápio.
              </p>
            ) : (
              <ul className="divide-y divide-stone-200 dark:divide-white/10 rounded-lg border border-stone-200 dark:border-white/10 bg-white dark:bg-[#181614]">
                {cart.map(({ item, quantity }) => (
                  <li
                    key={item.id}
                    className="p-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="font-mono-tabular text-xs text-stone-500 dark:text-[#A8A29E]">
                        {item.price || 'Consultar valor'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        aria-label={`Diminuir quantidade de ${item.name}`}
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="w-8 h-8 rounded border border-stone-300 dark:border-white/15 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-white/5 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono-tabular w-6 text-center text-sm font-medium">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Aumentar quantidade de ${item.name}`}
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="w-8 h-8 rounded border border-stone-300 dark:border-white/15 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-white/5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="wa-customer-name"
                className="block text-xs font-medium text-stone-600 dark:text-[#D6D3CD] mb-1.5"
              >
                Seu nome
              </label>
              <input
                id="wa-customer-name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex.: Carlos Souza"
                className="w-full px-3.5 py-2.5 min-h-[44px] rounded-md text-sm bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/15 focus:outline-none focus:border-[#D99B38]"
              />
            </div>

            <div>
              <span className="block text-xs font-medium text-stone-600 dark:text-[#D6D3CD] mb-1.5">
                Como prefere receber?
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFulfillment('entrega')}
                  style={
                    fulfillment === 'entrega'
                      ? { backgroundColor: config.accentColor, color: '#11100F' }
                      : undefined
                  }
                  className={`py-2.5 px-3 rounded-md text-xs font-semibold border cursor-pointer ${
                    fulfillment === 'entrega'
                      ? 'border-transparent'
                      : 'border-stone-300 dark:border-white/15 text-stone-700 dark:text-[#A8A29E]'
                  }`}
                >
                  Entrega em Manaus
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillment('retirada')}
                  style={
                    fulfillment === 'retirada'
                      ? { backgroundColor: config.accentColor, color: '#11100F' }
                      : undefined
                  }
                  className={`py-2.5 px-3 rounded-md text-xs font-semibold border cursor-pointer ${
                    fulfillment === 'retirada'
                      ? 'border-transparent'
                      : 'border-stone-300 dark:border-white/15 text-stone-700 dark:text-[#A8A29E]'
                  }`}
                >
                  Retirar no Balcão
                </button>
              </div>
            </div>

            {fulfillment === 'entrega' && (
              <div>
                <label
                  htmlFor="wa-delivery-area"
                  className="block text-xs font-medium text-stone-600 dark:text-[#D6D3CD] mb-1.5"
                >
                  Bairro / Endereço em Manaus
                </label>
                <input
                  id="wa-delivery-area"
                  type="text"
                  value={deliveryArea}
                  onChange={(e) => setDeliveryArea(e.target.value)}
                  placeholder="Ex.: Parque 10, Rua..."
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-md text-sm bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/15 focus:outline-none focus:border-[#D99B38]"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="wa-extra-note"
                className="block text-xs font-medium text-stone-600 dark:text-[#D6D3CD] mb-1.5"
              >
                Observações ou horário desejado
              </label>
              <textarea
                id="wa-extra-note"
                rows={2}
                value={extraNote}
                onChange={(e) => setExtraNote(e.target.value)}
                placeholder="Ex.: Gostaria para o café da manhã ou encomenda especial..."
                className="w-full px-3.5 py-2.5 rounded-md text-sm bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/15 focus:outline-none focus:border-[#D99B38]"
              />
            </div>

            {/* Optional Owner WhatsApp Config */}
            <div className="p-4 rounded-lg border border-stone-200 dark:border-white/10 bg-white dark:bg-[#181614]">
              <label
                htmlFor="wa-store-number"
                className="block text-xs font-medium text-stone-700 dark:text-[#D6D3CD] mb-1"
              >
                Número WhatsApp da Padaria (com DDI e DDD)
              </label>
              <p className="text-[11px] text-stone-500 dark:text-[#A8A29E] mb-2">
                {cleanWhatsappDigits
                  ? 'Número configurado para envio direto.'
                  : 'Nenhum número cadastrado ainda. Você pode enviar escolhendo o contato no WhatsApp ou digitar o número da padaria abaixo (ex.: 5592...).'}
              </p>
              <input
                id="wa-store-number"
                type="tel"
                value={config.whatsappNumber}
                onChange={(e) => onSaveWhatsappNumber(e.target.value)}
                placeholder="Ex.: 5592999999999"
                className="w-full px-3 py-2 rounded-md text-xs font-mono-tabular bg-stone-50 dark:bg-[#11100F] border border-stone-300 dark:border-white/15 focus:outline-none focus:border-[#D99B38]"
              />
            </div>
          </div>

          {/* Message Preview */}
          <div>
            <p className="text-xs font-medium text-stone-500 dark:text-[#A8A29E] mb-1.5">
              Prévia da mensagem
            </p>
            <pre className="whitespace-pre-wrap text-xs font-sans p-3.5 rounded-lg bg-stone-200/60 dark:bg-[#181614] border border-stone-200 dark:border-white/10 text-stone-800 dark:text-[#E7E5E4]">
              {formattedMessage}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-stone-200 dark:border-white/10 space-y-2.5">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: config.accentColor }}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 min-h-[48px] rounded-md text-sm font-semibold text-[#11100F] hover:brightness-110 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Abrir Pedido no WhatsApp
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 min-h-[42px] rounded-md text-xs font-medium border border-stone-300 dark:border-white/15 hover:bg-stone-200/60 dark:hover:bg-white/5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Mensagem copiada
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar texto do pedido
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
