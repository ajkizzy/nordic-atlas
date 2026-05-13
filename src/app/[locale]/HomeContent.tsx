'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const stepImages = [
  '/images/step1-bg.jpg',           // Step 1: a2.jpg
  '/images/design-process.png',    // Step 2: was step 3
  '/images/step3-bg.jpg',           // Step 3: 1.jpg
  '/images/shipping.jpg',          // Step 4
] as const;

export function HomeContent() {
  const t = useTranslations();
  const [activeStep, setActiveStep] = useState<number>(1);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div>
      {/* ============================================================
          SECTION 1: HERO
          Uses hero-bg.png as the background product collage.
          Video plays inside a contained block below the heading.
      ============================================================ */}
      <section className="relative overflow-hidden" style={{ marginTop: '-225px' }}>
        {/* Background layers */}
        <div className="absolute inset-0">
          {/* Layer 1: Hero background image */}
          <Image
            src="/images/swiss.png"
            alt=""
            width={1943}
            height={1943}
            priority
            style={{
              position: 'absolute',
              left: '50%',
              top: '-40%',
              transform: 'translateX(-50%)',
              objectFit: 'contain'
            }}
          />
          {/* Layer 2: Transparent bags overlay — positioned at bottom */}
          <div
            className="absolute bottom-0 left-1/2 w-full h-[900px]"
            style={{
              transform: 'translateX(-50%)',
              backgroundImage: 'url(/images/transbags.png)',
              top: '39%',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center bottom'
            }}
          />
          {/* Layer 3: Subtle gradient overlay — lighter at top for navbar readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        </div>

        {/* Content */}
        <div
          className="relative z-10 max-w-[1312px] mx-auto px-4 flex flex-col items-center"
          style={{ paddingTop: '240px', paddingBottom: '80px' }}
        >
          {/* Heading panel — glass bordered */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1
              className="font-heading font-medium text-[#095d36] inline-block rounded-[20px] px-8 py-5"
              style={{
                fontSize: 'clamp(28px, 4vw, 52px)',
                lineHeight: '132%',
                letterSpacing: '-1.04px',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(25px)',
                border: '3px solid #377d9c',
                backgroundColor: 'rgba(255,255,255,0.03)',
              }}
            >
              {t('home.heroTitle')}
            </h1>
          </motion.div>

          {/* Video block — contained within composition */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mt-10 rounded-[20px] overflow-hidden"
            style={{
              maxHeight: '400px',
              maxWidth: '100%',
              marginLeft: '0',
              marginRight: '0',
              boxShadow: '-16px 12px 28px rgba(0, 0, 0, 0.4)'
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/videos/hero-home-poster.jpg"
              className="w-full object-cover rounded-[20px]"
              style={{ maxHeight: '378px' }}
            >
              <source src="/videos/hero-home.mp4" type="video/mp4" />
              <source src="/videos/hero-home.webm" type="video/webm" />
            </video>
          </motion.div>

          {/* Description — bottom right, glass treatment */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mt-2 flex justify-center w-full"
          >
            <p
              className="text-white text-base leading-relaxed max-w-[820px] text-center"
              style={{
                backgroundColor: 'rgba(0,0,0,0.32)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '20px 24px',
              }}
            >
              {t('home.heroDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: ABOUT TEASER (mobil2)
          Layout: "Om os" link + h2 in a row, then 2-col grid
          Left: video, Right: elevated description card + stat cards
      ============================================================ */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1312px] mx-auto px-4">

          {/* Top row: label + heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12 mb-14"
          >
            {/* Om Os link */}
            <motion.div variants={fadeInUp} className="flex-shrink-0 md:pt-2">
              <Link
                href="/about"
                className="inline-block font-body text-sm text-[#010101] border border-[#010101] rounded-[100px] px-4 py-2 hover:bg-[#010101] hover:text-white transition-colors duration-200"
              >
                {t('home.aboutLink')}
              </Link>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={fadeInUp}
              className="font-heading font-medium text-[#010101]"
              style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', lineHeight: '132%', letterSpacing: '-0.96px' }}
            >
              {t('home.aboutTitle')}
            </motion.h2>
          </motion.div>

          {/* Main 2-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">

            {/* Left: Product showcase video */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
              className="rounded-[20px] overflow-hidden"
              style={{ aspectRatio: '5/4' }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/0322(1)(1).mp4" type="video/mp4" />
              </video>
            </motion.div>

            {/* Right: Description + counters */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="flex flex-col gap-6"
            >
              {/* Elevated description card */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-[20px] p-6 md:p-8"
                style={{
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <p className="text-[#4a4a4a] text-base leading-[162.5%] md:pl-[70px]">
                  {t('home.aboutDescription')}
                </p>
              </motion.div>

              {/* Stat cards — 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Counter 1 */}
                <motion.div
                  variants={fadeInUp}
                  className="bg-[#f5f5f5] rounded-[20px] p-6"
                >
                  <div className="flex items-baseline gap-2 mb-3">
                    <span
                      className="font-heading font-bold text-[#010101]"
                      style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
                    >
                      150t+
                    </span>
                    <span className="font-body text-xs text-[#6a6a6a] font-medium">01</span>
                  </div>
                  <h3 className="font-heading font-semibold text-[#010101] text-base mb-2">
                    {t('home.counterBags')}
                  </h3>
                  <p className="font-body text-xs text-[#6a6a6a] leading-relaxed">
                    {t('home.counterBagsDescription')}
                  </p>
                </motion.div>

                {/* Counter 2 */}
                <motion.div
                  variants={fadeInUp}
                  className="bg-[#f5f5f5] rounded-[20px] p-6"
                >
                  <div className="flex items-baseline gap-2 mb-3">
                    <span
                      className="font-heading font-bold text-[#010101]"
                      style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
                    >
                      99%
                    </span>
                    <span className="font-body text-xs text-[#6a6a6a] font-medium">02</span>
                  </div>
                  <h3 className="font-heading font-semibold text-[#010101] text-base mb-2">
                    {t('home.counterSatisfaction')}
                  </h3>
                  <p className="font-body text-xs text-[#6a6a6a] leading-relaxed">
                    {t('home.counterSatisfactionDescription')}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: PROCESS (step-area)
          Left: sticky heading + CTA + vertical step dots
          Right: large IMAGE cards with overlaid step number + white text box
      ============================================================ */}
      <section className="py-20 md:py-28 bg-[#f5f5f5]">
        <div className="max-w-[1312px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">

            {/* Left column — sticky */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
              >
                <motion.h2
                  variants={fadeInUp}
                  className="font-heading font-medium text-[#010101] mb-4"
                  style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: '132%', letterSpacing: '-0.8px' }}
                >
                  {t('home.processTitle')}
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="font-body text-[#4a4a4a] text-base leading-relaxed mb-8"
                >
                  {t('home.processSubtitle')}
                </motion.p>
                <motion.div variants={fadeInUp}>
                  <Link
                    href="/solutions"
                    className="inline-block font-heading font-medium text-[#010101] border-[2px] border-[#010101] rounded-[100px] px-6 py-3 hover:bg-[#010101] hover:text-white transition-all duration-300"
                  >
                    {t('home.processCta')}
                  </Link>
                </motion.div>
              </motion.div>

              {/* Vertical step indicator with scroll animation */}
              <div className="hidden lg:flex flex-col items-center mt-16 gap-0">
                {([1, 2, 3, 4] as const).map((step, index) => {
                  const isActive = step <= activeStep;
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <motion.div
                        animate={{
                          backgroundColor: isActive ? '#095d36' : '#d1d5db',
                          scale: step === activeStep ? 1.15 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-heading font-semibold text-sm"
                      >
                        {String(step).padStart(2, '0')}
                      </motion.div>
                      {index < 3 && (
                        <motion.div
                          animate={{
                            backgroundColor: isActive ? '#095d36' : '#d1d5db',
                            opacity: isActive ? 1 : 0.3,
                          }}
                          transition={{ duration: 0.3 }}
                          className="w-px h-16"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right column — image cards with scroll animation */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.5 }}
              variants={staggerContainer}
              className="flex flex-col gap-6"
            >
              {([1, 2, 3, 4] as const).map((step) => {
                // Use a hook wrapper component to detect when card is in view
                const cardRef = useRef<HTMLDivElement>(null);
                const isInView = useInView(cardRef, { amount: 0.6 });

                // Update active step when this card comes into view
                if (isInView && activeStep < step) {
                  setActiveStep(step);
                }

                return (
                  <motion.div
                    key={step}
                    ref={cardRef}
                    variants={fadeInUp}
                    className="relative overflow-hidden rounded-[20px] transition-all duration-300"
                    style={{
                      minHeight: '280px',
                      opacity: isInView ? 1 : 0.6,
                      scale: isInView ? 1 : 0.98,
                    }}
                  >
                  {/* Background image */}
                  <Image
                    src={stepImages[step - 1]}
                    alt={t(`home.step${step}Title`)}
                    fill
                    className="object-cover"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

                  {/* Step number — top left */}
                  <div className="absolute top-5 left-6 font-heading font-bold text-white/90"
                    style={{ fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1 }}>
                    {String(step).padStart(2, '0')}
                  </div>

                  {/* Content box — bottom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="bg-white rounded-[12px] px-5 py-4">
                      <h3 className="font-heading font-bold text-[#010101] text-lg mb-1">
                        {t(`home.step${step}Title`)}
                      </h3>
                      <p className="font-body text-[#4a4a4a] text-sm leading-relaxed">
                        {t(`home.step${step}Description`)}
                      </p>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
