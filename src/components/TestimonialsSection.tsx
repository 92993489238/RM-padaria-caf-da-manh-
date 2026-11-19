import React, { useState } from 'react';
import { Check, MessageSquarePlus, Trash2 } from 'lucide-react';
import { BakeryConfig, TestimonialItem } from '../types/bakery';

interface TestimonialsSectionProps {
  config: BakeryConfig;
  testimonials: TestimonialItem[];
  onAddTestimonial: (item: Omit<TestimonialItem, 'id' | 'createdAt'>) => void;
  onRemoveTestimonial: (id: string) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  config,
  testimonials,
  onAddTestimonial,
  onRemoveTestimonial,
}) => {
  const [author, setAuthor] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAuthor = author.trim();
    const cleanText = text.trim();

    if (cleanAuthor.length < 2) {
      setError('Informe seu nome completo ou como prefere ser identificado.');
      return;
    }
    if (cleanText.length < 10) {
      setError('Escreva um breve relato da sua experiência (mínimo 10 caracteres).');
      return;
    }

    onAddTestimonial({
      author: cleanAuthor,
      neighborhood: neighborhood.trim(),
      text: cleanText,
    });

    setAuthor('');
    setNeighborhood('');
    setText('');
    setError('');
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <section
      id="avaliacoes"
      className="py-16 sm:py-24 border-b border-stone-200 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Authentic Client Testimonials List */}
          <div className="lg:col-span-7">
            <p
              className="text-xs font-semibold tracking-wide mb-2"
              style={{ color: config.accentColor }}
            >
              Depoimentos Reais
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-[#F5F2EB] text-balance mb-4">
              A voz de quem começa o dia conosco em Manaus.
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-[#A8A29E] mb-8 max-w-[54ch]">
              Publicamos exclusivamente relatos reais enviados por clientes da{' '}
              {config.businessName}, sem avaliações fictícias.
            </p>

            {testimonials.length === 0 ? (
              <div className="rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#181614] p-8">
                <p className="font-display text-2xl text-stone-900 dark:text-[#F5F2EB] mb-2">
                  Seja o primeiro a compartilhar sua experiência
                </p>
                <p className="text-sm text-stone-600 dark:text-[#A8A29E] leading-relaxed">
                  Ainda não há depoimentos cadastrados nesta vitrine. Clientes
                  podem enviar uma avaliação ao lado ou o proprietário pode
                  registrar avaliações reais recebidas no balcão e no WhatsApp.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {testimonials.map((item) => (
                  <blockquote
                    key={item.id}
                    className="rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#181614] p-6 flex flex-col justify-between gap-4"
                  >
                    <p className="text-sm sm:text-base text-stone-800 dark:text-[#F5F2EB] leading-relaxed">
                      “{item.text}”
                    </p>
                    <footer className="pt-4 border-t border-stone-200 dark:border-white/10 flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-[#A8A29E]">
                      <div>
                        <span className="font-semibold text-stone-900 dark:text-[#F5F2EB]">
                          {item.author}
                        </span>
                        {item.neighborhood && (
                          <>
                            <span aria-hidden="true" className="mx-1.5">
                              ·
                            </span>
                            <span>{item.neighborhood}, Manaus</span>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveTestimonial(item.id)}
                        aria-label={`Remover avaliação de ${item.author}`}
                        className="p-1.5 rounded text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </footer>
                  </blockquote>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Authentic Client Review Form */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#181614] p-6 sm:p-8"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <MessageSquarePlus
                  className="w-5 h-5"
                  style={{ color: config.accentColor }}
                />
                <h3 className="font-display text-2xl font-semibold text-stone-900 dark:text-[#F5F2EB]">
                  Deixar Avaliação Real
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-[#A8A29E] mb-6">
                Já pediu ou visitou a {config.businessName}? Conte como foi o
                atendimento e o sabor dos produtos.
              </p>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="review-author"
                    className="block text-xs font-medium text-stone-700 dark:text-[#D6D3CD] mb-1.5"
                  >
                    Seu nome
                  </label>
                  <input
                    id="review-author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ex.: Maria Oliveira"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-md text-sm bg-stone-50 dark:bg-[#11100F] border border-stone-300 dark:border-white/15 text-stone-900 dark:text-[#F5F2EB] focus:outline-none focus:border-[#D99B38]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="review-neighborhood"
                    className="block text-xs font-medium text-stone-700 dark:text-[#D6D3CD] mb-1.5"
                  >
                    Bairro em Manaus (opcional)
                  </label>
                  <input
                    id="review-neighborhood"
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Ex.: Adrianópolis, Parque 10, Centro..."
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-md text-sm bg-stone-50 dark:bg-[#11100F] border border-stone-300 dark:border-white/15 text-stone-900 dark:text-[#F5F2EB] focus:outline-none focus:border-[#D99B38]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="review-text"
                    className="block text-xs font-medium text-stone-700 dark:text-[#D6D3CD] mb-1.5"
                  >
                    Seu depoimento
                  </label>
                  <textarea
                    id="review-text"
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Compartilhe o que você mais gostou no pão, no bolo ou no atendimento..."
                    className="w-full px-3.5 py-2.5 rounded-md text-sm bg-stone-50 dark:bg-[#11100F] border border-stone-300 dark:border-white/15 text-stone-900 dark:text-[#F5F2EB] focus:outline-none focus:border-[#D99B38]"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs text-red-500 font-medium">
                    {error}
                  </p>
                )}

                {submitted && (
                  <p
                    role="status"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500"
                  >
                    <Check className="w-4 h-4" />
                    Depoimento publicado com sucesso.
                  </p>
                )}

                <button
                  type="submit"
                  style={{ backgroundColor: config.accentColor }}
                  className="w-full py-3 min-h-[44px] rounded-md text-sm font-semibold text-[#11100F] hover:brightness-110 transition-all cursor-pointer"
                >
                  Publicar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
