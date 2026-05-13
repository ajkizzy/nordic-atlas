'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

const services = [
  { key: 'dagligvarer', image: '/images/portfolio-food.png' },
  { key: 'mad', image: '/images/bags-showcase.png' },
  { key: 'detail', image: '/images/portfolio-retail.png' },
  { key: 'events', image: '/images/portfolio-promo.png' },
  { key: 'corporate', image: '/images/portfolio-branding.jpg' },
] as const;

export function SolutionsContent() {
  const t = useTranslations('solutions');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* Banner */}
      <section className="relative overflow-hidden rounded-[20px] mx-[10px] pt-[40px] pb-[90px]">
        <div className="absolute inset-0">
          <Image
            src="/images/banner.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 max-w-[1312px] mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-h2 font-heading text-white"
          >
            {t('bannerTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-body text-white mt-4 md:pl-[70px]"
          >
            {t('bannerSubtitle')}
          </motion.p>
        </div>
      </section>

      {/* Service Accordion List */}
      <section className="py-[120px]">
        <div className="max-w-[1312px] mx-auto px-4">
          <div className="space-y-0">
            {services.map((service, index) => {
              const isOpen = openIndex === index;
              const tags = t(`services.${service.key}.tags`).split(', ');

              return (
                <motion.div
                  key={service.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="border-b border-gray-200"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between py-6 group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-medium text-gray-400 min-w-[40px]">
                        {t(`services.${service.key}.number`)}
                      </span>
                      <h3 className="text-xl md:text-2xl font-heading text-gray-900 group-hover:text-brand-700 transition-colors">
                        {t(`services.${service.key}.title`)}
                      </h3>
                    </div>
                    <div
                      className={`w-8 h-8 flex items-center justify-center transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 4V16M4 10H16"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-8 pt-2">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="flex-1">
                            <p className="text-body text-gray-600 mb-6">
                              {t(`services.${service.key}.summary`)}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-[#f5f5f5] px-3 py-1 text-xs font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Image
                              src={service.image}
                              alt={t(`services.${service.key}.title`)}
                              width={400}
                              height={300}
                              className="rounded-[12px] max-w-[400px] w-full h-auto object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
