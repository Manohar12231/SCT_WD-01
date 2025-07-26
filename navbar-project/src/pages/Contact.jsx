import { motion } from 'framer-motion';
import PageWrapper from './PageWrapper';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const Contact = () => (
  <PageWrapper title="Get In Touch">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-xl mx-auto"
    >
      <motion.p variants={itemVariants} className="text-center text-lg text-gray-600 dark:text-gray-400">
        Have a project in mind or want to learn more about our process? We'd love to hear from you.
      </motion.p>

      <motion.form
        variants={containerVariants}
        className="mt-10 space-y-8"
      >
        <motion.div variants={itemVariants}>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md shadow-sm transition-all duration-300 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md shadow-sm transition-all duration-300 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Message
          </label>
          <textarea
            id="message"
            rows="5"
            className="mt-1 block w-full rounded-md shadow-sm transition-all duration-300 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <motion.button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  </PageWrapper>
);

export default Contact;