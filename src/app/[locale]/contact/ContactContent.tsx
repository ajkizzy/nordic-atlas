'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

const subjectOptionKeys = [
  'quote',
  'custom',
  'materials',
  'moq',
  'production',
  'samples',
  'other',
] as const;

const socialLinks = [
  { name: 'Twitter', icon: '/images/icons/twitter.svg', href: '#' },
  { name: 'LinkedIn', icon: '/images/icons/linkedin.svg', href: '#' },
  { name: 'Instagram', icon: '/images/icons/instagram.svg', href: '#' },
  { name: 'Facebook', icon: '/images/icons/facebook.svg', href: '#' },
];

export function ContactContent() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');

    try {
      console.log('[Contact Form]', form);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-[10px] border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition-all';

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

      {/* Contact Form Area */}
      <section className="py-[120px]">
        <div className="max-w-[1312px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-h4 font-heading">{t('formTitle')}</h2>
              <p className="text-body pt-4 text-gray-600">{t('formDescription')}</p>

              {/* Social Media */}
              <div className="mt-10">
                <p className="text-sm font-medium text-gray-500 mb-4">{t('socialTitle')}</p>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      aria-label={social.name}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <Image
                        src={social.icon}
                        alt={social.name}
                        width={18}
                        height={18}
                      />
                    </a>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="mt-8">
                <p className="text-sm font-medium text-gray-500 mb-2">{t('emailTitle')}</p>
                <a
                  href={`mailto:${t('emailAddress')}`}
                  className="text-brand-700 hover:text-brand-800 transition-colors font-medium"
                >
                  {t('emailAddress')}
                </a>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {status === 'success' ? (
                <div className="text-center py-12 px-6 rounded-[12px] bg-green-50 border border-green-200">
                  <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    {t('form.successTitle')}
                  </p>
                  <p className="text-sm text-gray-600">{t('form.successMessage')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('form.name')}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder={t('form.namePlaceholder')}
                      className={inputClass}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('form.email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder={t('form.emailPlaceholder')}
                      className={inputClass}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('form.phone')}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder={t('form.phonePlaceholder')}
                      className={inputClass}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('form.subject')}
                    </label>
                    <div className="relative">
                      <select
                        value={form.subject}
                        onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                        className={`${inputClass} appearance-none pr-10`}
                      >
                        <option value="" disabled>
                          {t('form.subject')}
                        </option>
                        {subjectOptionKeys.map((optionKey) => (
                          <option key={optionKey} value={optionKey}>
                            {t(`form.subjectOptions.${optionKey}`)}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="text-gray-400"
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('form.message')}
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      placeholder={t('form.messagePlaceholder')}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full px-6 py-3 bg-brand-700 text-white font-medium rounded-[10px] hover:bg-brand-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? t('form.sending') : t('form.submit')}
                  </button>

                  {status === 'error' && (
                    <p className="text-sm text-red-500 mt-2">{t('form.error')}</p>
                  )}
                </form>
              )}
            </motion.div>
          </div>

          {/* Google Maps Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <a
              href="https://maps.app.goo.gl/6DgNQ1JQi6bo1H9q7"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Image
                src="/images/map.avif"
                alt="Our location on Google Maps"
                width={1312}
                height={400}
                className="w-full rounded-[12px] object-cover"
              />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
