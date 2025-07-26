import { motion } from 'framer-motion';
import { FiLayers, FiEdit3, FiZap, FiEye, FiGitMerge, FiHeart } from 'react-icons/fi';
import PageWrapper from './PageWrapper';

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const servicesData = [
  {
    icon: <FiLayers size={40} />,
    title: 'Web Applications',
    description: 'Fluid, desktop-like experiences built with modern tech like React and Next.js.',
  },
  {
    icon: <FiEye size={40} />,
    title: 'UI Engineering',
    description: 'Flawless, pixel-perfect translation of your vision from Figma or Sketch into code.',
  },
  {
    icon: <FiEdit3 size={40} />,
    title: 'Interactive Motion',
    description: 'Bringing your brand to life with smooth, engaging animations that delight users.',
  },
  {
    icon: <FiGitMerge size={40} />,
    title: 'Design Systems',
    description: 'Reusable component libraries for brand consistency and development speed.',
  },
  {
    icon: <FiZap size={40} />,
    title: 'Performance',
    description: 'Obsessing over Core Web Vitals to make your site load instantly and feel fast.',
  },
  {
    icon: <FiHeart size={40} />,
    title: 'Accessibility',
    description: 'Ensuring your site is open and usable by everyone, following WCAG standards.',
  },
];

const Services = () => (
  <PageWrapper title="My Services">
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4">From Concept to Code</h1>
      <p className="lead text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
        I specialize in building clean, performant, and user-centric web applications. My approach combines technical expertise with a keen eye for design, transforming your vision into a digital reality that not only looks great but works flawlessly.
      </p>
    </motion.div>

    <motion.div
      className="mt-20"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesData.map((service, index) => (
          <motion.div
            key={index}
            className="group p-8 rounded-xl border border-gray-200/80 dark:border-gray-700/50 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm text-center space-y-4"
            whileHover={{
              y: -10,
              boxShadow: '0px 20px 30px rgba(0, 0, 0, 0.1)',
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110">
              {service.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{service.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </PageWrapper>
);

export default Services;