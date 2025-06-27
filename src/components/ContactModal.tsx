import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImUpload } from "react-icons/im";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputVariants = {
  hidden: { opacity: 0, x: '100vw' },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.12 * i, type: "spring" as const, stiffness: 80, damping: 18 },
  }),
};

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(true);
  const [fileError, setFileError] = useState<string>('');

  // Animation variants (simple fade for now)
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      
      if (file.size > maxSize) {
        setFileError('File size must be less than 5MB');
        e.target.value = ''; // Reset the input
        return;
      }
      
      setUploadedFiles([file]);
    }
  };

  // Remove file
  const handleRemoveFile = () => {
    setUploadedFiles([]);
    setFileError('');
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Handle contact form submission
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('message', formData.message);
      uploadedFiles.forEach((file) => data.append('file', file));
      const contactRes = await fetch('/api/contact', {
        method: 'POST',
        body: data,
      });

      // Handle newsletter subscription if checked
      if (subscribeToNewsletter) {
        try {
          await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              tags: ['source:ml-contact']
            }),
          });
        } catch (err) {
          console.error('Newsletter subscription failed:', err);
          // Don't throw here, as the contact form submission was successful
        }
      }

      if (contactRes.ok) {
        alert('Message sent successfully!' + (subscribeToNewsletter ? ' You have been subscribed to the newsletter.' : ''));
        setFormData({ name: '', email: '', message: '' });
        setUploadedFiles([]);
        onClose();
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch {
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
        >
          <div
            className="flex w-full max-w-3xl mx-4 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              minHeight: 480,
              background: "rgba(120, 60, 200, 0.35)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(180,120,255,0.18)",
            }}
          >
            {/* Left Sidebar */}
            <div className="w-20 flex flex-col items-center py-6 relative border-r border-purple-200/40 bg-purple-100/30 backdrop-blur-md">
              {/* Terminal-style close (three dots) */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-4 h-4 rounded-full bg-red-400/80" onClick={onClose} style={{ cursor: 'pointer' }} />
              </div>
              {/* Contact Details */}
              <div className="flex flex-col items-center gap-5 mt-24">
                <a href="mailto:hello@heyshinde.com" className="text-white hover:text-purple-300 transition" title="Email">
                  <MdEmail size={22} />
                </a>
                <a href="https://github.com/heyshinde" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-300 transition" title="GitHub">
                  <FaGithub size={22} />
                </a>
                <a href="https://linkedin.com/in/heyshinde" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-300 transition" title="LinkedIn">
                  <FaLinkedin size={22} />
                </a>
                <a href="https://x.com/heyshinde" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-300 transition" title="X (Twitter)">
                  <FaXTwitter size={22} />
                </a>
              </div>
            </div>
            {/* Center Content */}
            <div className="flex-1 flex flex-col px-0 py-0">
              {/* Terminal-style heading */}
              <div className="w-full bg-[#2d0a4a] px-6 py-3 flex items-center rounded-tr-2xl" style={{ fontFamily: 'var(--font-silkscreen, monospace)' }}>
                <span className="text-purple-200 text-base font-mono tracking-wide">hello@heyshinde</span>
              </div>
              <div className="flex-1 flex flex-col px-10 py-8">
                <form className="flex flex-col gap-4 mb-6 items-center" onSubmit={handleSubmit}>
                  <motion.input
                    type="text"
                    name="name"
                    placeholder="Name*"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border-0 border-b-2 border-purple-300 focus:border-purple-500 focus:ring-0 rounded-none px-0 py-3 bg-transparent text-white placeholder:text-zinc-200 transition-colors duration-200 shadow-none outline-none w-full"
                    required
                    custom={0}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                  />
                  <motion.input
                    type="email"
                    name="email"
                    placeholder="Email*"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-0 border-b-2 border-purple-300 focus:border-purple-500 focus:ring-0 rounded-none px-0 py-3 bg-transparent text-white placeholder:text-zinc-200 transition-colors duration-200 shadow-none outline-none w-full"
                    required
                    custom={1}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                  />
                  <motion.textarea
                    name="message"
                    placeholder="Message*"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="border-0 border-b-2 border-purple-300 focus:border-purple-500 focus:ring-0 rounded-none px-0 py-3 bg-transparent text-white placeholder:text-zinc-200 resize-none transition-colors duration-200 shadow-none outline-none min-h-[100px] w-full"
                    required
                    custom={2}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                  />
                  {/* Dropbox for file upload */}
                  <motion.div
                    className="relative flex flex-row items-center mt-2 mb-2 w-full"
                    custom={3}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <ImUpload className="text-purple-400 mr-2" size={40} />
                    <input 
                      type="file" 
                      className="opacity-0 absolute left-0 top-0 w-10 h-10 cursor-pointer" 
                      onChange={handleFileChange}
                      accept="*/*"
                    />
                    <span className="text-sm text-white/80">Upload a file (max 5MB)</span>
                  </motion.div>
                  {fileError && (
                    <motion.p
                      className="text-red-400 text-sm mt-1"
                      custom={4}
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {fileError}
                    </motion.p>
                  )}
                  {/* Uploaded files list */}
                  {uploadedFiles.length > 0 && (
                    <motion.div
                      className="mt-2 text-sm text-white/80 space-y-1 w-full"
                      custom={4}
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="truncate flex items-center gap-2 group">
                        <span className="inline-block w-2 h-2 rounded-full bg-purple-400" />
                        {uploadedFiles[0].name}
                        <button
                          type="button"
                          className="ml-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                          onClick={handleRemoveFile}
                          aria-label={`Remove ${uploadedFiles[0].name}`}
                        >
                          ×
                        </button>
                      </div>
                    </motion.div>
                  )}
                  {/* Newsletter Subscription Checkbox */}
                  <motion.div
                    className="w-full flex items-center gap-2 mt-2"
                    custom={5}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <input
                      type="checkbox"
                      id="newsletter"
                      checked={subscribeToNewsletter}
                      onChange={(e) => setSubscribeToNewsletter(e.target.checked)}
                      className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500 focus:ring-offset-purple-800 bg-transparent"
                    />
                    <label htmlFor="newsletter" className="text-sm text-white/80">
                      Subscribe to newsletter for updates
                    </label>
                  </motion.div>
                  {/* Send Button */}
                  <motion.button
                    type="submit"
                    className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold text-lg shadow-md hover:from-purple-600 hover:to-purple-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    custom={6}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={submitting}
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 