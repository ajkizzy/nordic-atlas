'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <span className="ml-4 flex-shrink-0 text-2xl text-gray-500">
          {isOpen ? '\u2212' : '+'}
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-gray-600 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function AboutContent() {
  const t = useTranslations('about');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ===== Section 1: Hero ===== */}
      <section className="relative rounded-[20px] mx-[10px] pt-[40px] pb-[90px] overflow-hidden">
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/hero-about-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
        >
          <source src="/videos/hero-about.webm" type="video/webm" />
          <source src="/videos/hero-about.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 rounded-[20px]" />

        {/* Content */}
        <div className="relative z-10 max-w-[1312px] mx-auto px-4">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-white font-bold text-lg rounded-[20px]"
          >
            {t('heroSubtitle')}
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.5fr] lg:gap-[300px] gap-10 mt-8">
            {/* Left column */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              <Link
                href="/contact"
                className="inline-block bg-white text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-gray-900 hover:text-white transition-colors mb-6"
              >
                {t('heroCta')}
              </Link>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {t('heroTitle')}
              </h2>
              <div className="hidden md:block mt-8">
                <p className="text-white text-lg leading-relaxed mb-6">
                  {t('heroDescription')}
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-white text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-gray-900 hover:text-white transition-colors"
                >
                  {t('heroCta')}
                </Link>
              </div>
            </motion.div>

            {/* Right column — counter */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="flex flex-col items-start lg:items-end justify-end"
            >
              <span className="text-white text-7xl lg:text-8xl font-bold">
                100+
              </span>
              <span className="text-white text-lg mt-2">
                {t('heroCounter')}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Section 2: Certifications ===== */}
      <section className="bg-white py-10 pb-[120px]">
        <div className="max-w-[1312px] mx-auto px-4">
          {/* Top: certs + description */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left — certification badges */}
            <div className="flex items-center gap-6 flex-wrap">
              <Image
                src="/images/cert-fsc.png"
                alt="FSC Certification"
                width={32}
                height={32}
              />
              <Image
                src="/images/cert-grs.png"
                alt="GRS Certification"
                width={71}
                height={40}
              />
              <Image
                src="/images/cert-iso.jpg"
                alt="ISO Certification"
                width={45}
                height={45}
              />
              <p className="text-sm text-gray-500 mt-2 w-full">
                {t('certBadge')}
              </p>
            </div>

            {/* Right — tag + description */}
            <div>
              <span className="inline-block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {t('certTag')}
              </span>
              <p className="text-xl lg:text-[35px] lg:leading-[140%] text-gray-900">
                {t('certDescription')}
              </p>
            </div>
          </div>

          {/* Brand image strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-16">
            {['a2.jpg', 'product-collage.png', 'banner.png', 'bags-group.png', 'bags-showcase.png'].map(
              (img) => (
                <div
                  key={img}
                  className="rounded-[10px] bg-[#f5f5f5] overflow-hidden"
                >
                  <Image
                    src={`/images/${img}`}
                    alt=""
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===== Section 3: Solutions ===== */}
      <section className="relative rounded-[20px] mx-[10px] pt-10 pb-[120px] overflow-hidden">
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/product-showcase-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
        >
          <source src="/videos/product-showcase.webm" type="video/webm" />
          <source src="/videos/product-showcase.mp4" type="video/mp4" />
        </video>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 rounded-[20px]" />

        {/* Content */}
        <div className="relative z-10 max-w-[1312px] mx-auto px-4">
          {/* Top row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-3xl lg:text-4xl font-bold text-white"
            >
              {t('solutionTitle')}
            </motion.h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="flex flex-col items-start gap-4"
            >
              <p className="text-white text-lg leading-relaxed">
                {t('solutionSubtitle')}
              </p>
              <Link
                href="/contact"
                className="inline-block bg-white text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-gray-900 hover:text-white transition-colors"
              >
                {t('solutionCta')}
              </Link>
            </motion.div>
          </div>

          {/* Solution cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 lg:pt-[300px]">
            {[1, 2, 3].map((n) => (
              <motion.div
                key={n}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={n}
                className="bg-white rounded-[16px] p-[30px]"
              >
                <Image
                  src={`/images/icons/solution-${n}.svg`}
                  alt=""
                  width={48}
                  height={48}
                />
                <h3 className="text-lg font-semibold pt-8 lg:pt-[130px] pb-5">
                  {t(`solution${n}Title`)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(`solution${n}Description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 4: Portfolio ===== */}
      <section className="bg-[#f5f5f5] pt-[120px] pb-[120px] -mt-[76px]">
        <div className="max-w-[1312px] mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl lg:text-4xl font-bold text-center mb-12"
          >
            {t('portfolioTitle')}
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Item 1 — left column, full height */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="row-span-2"
            >
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/images/portfolio-food.png"
                  alt={t('portfolio1Title')}
                  width={640}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mt-4">{t('portfolio1Title')}</h3>
              <p className="text-gray-600 mt-1">{t('portfolio1Description')}</p>
            </motion.div>

            {/* Item 2 — right column, top */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
            >
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/images/portfolio-retail.png"
                  alt={t('portfolio2Title')}
                  width={640}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mt-4">{t('portfolio2Title')}</h3>
              <p className="text-gray-600 mt-1">{t('portfolio2Description')}</p>
            </motion.div>

            {/* Item 3 — right column, bottom */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
            >
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/images/portfolio-promo.png"
                  alt={t('portfolio3Title')}
                  width={640}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mt-4">{t('portfolio3Title')}</h3>
              <p className="text-gray-600 mt-1">{t('portfolio3Description')}</p>
            </motion.div>

            {/* Item 4 — spans second column conceptually, shown below */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
              className="lg:col-start-2"
            >
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/images/portfolio-branding.jpg"
                  alt={t('portfolio4Title')}
                  width={640}
                  height={800}
                  className="w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mt-4">{t('portfolio4Title')}</h3>
              <p className="text-gray-600 mt-1">{t('portfolio4Description')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Section 5: Why Choose Us ===== */}
      <section className="py-[120px]">
        <div className="max-w-[1312px] mx-auto px-4">
          <span className="inline-block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            {t('whyChooseTag')}
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold mb-12">
            {t('whyChooseTitle')}
          </h2>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Left — image + CTA */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="relative flex-1 rounded-2xl overflow-hidden"
            >
              <Image
                src="/images/bags-showcase.png"
                alt=""
                width={640}
                height={480}
                className="w-full object-cover rounded-2xl"
              />
              <Link
                href="/contact"
                className="absolute bottom-6 left-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white font-semibold px-6 py-3 rounded-full border border-white/30 hover:bg-white/40 transition-colors"
              >
                {t('whyChooseCta')}
              </Link>
            </motion.div>

            {/* Right — counter + icon */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="flex flex-col items-start gap-4"
            >
              <span className="text-6xl lg:text-7xl font-bold text-gray-900">
                4k+
              </span>
              <p className="text-gray-600 text-lg">
                {t('whyChooseCounter')}
              </p>
              <Image
                src="/images/nap-icon.png"
                alt=""
                width={48}
                height={48}
                className="mt-4"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Section 6: Production Process ===== */}
      <section className="bg-[#010101] rounded-[20px] mx-[10px] py-[120px]">
        <div className="max-w-[1312px] mx-auto px-4">
          {/* Sticky headers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              {t('processLeftTitle')}
            </h2>
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              {t('processRightTitle')}
            </h2>
          </div>

          {/* Process items */}
          <div className="space-y-16">
            {[
              { img: 'design-process.png', n: 1 },
              { img: 'portfolio-branding.jpg', n: 2 },
              { img: 'shipping.jpg', n: 3 },
            ].map(({ img, n }) => (
              <motion.div
                key={n}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={n}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div className="rounded-2xl overflow-hidden">
                  <Image
                    src={`/images/${img}`}
                    alt={t(`process${n}Title`)}
                    width={640}
                    height={400}
                    className="w-full object-cover rounded-2xl"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {t(`process${n}Title`)}
                  </h2>
                  <p className="text-gray-400 leading-relaxed">
                    {t(`process${n}Description`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 7: FAQ ===== */}
      <section className="py-[120px]">
        <div className="max-w-[1312px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">
            {/* Left — title */}
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-2xl lg:text-3xl font-bold text-gray-900"
            >
              {t('faqTitle')}
            </motion.h2>

            {/* Right — accordion */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <AccordionItem
                  key={n}
                  question={t(`faq${n}Question`)}
                  answer={t(`faq${n}Answer`)}
                  isOpen={openFaq === n}
                  onToggle={() => setOpenFaq(openFaq === n ? null : n)}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
