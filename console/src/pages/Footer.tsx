import React from "react";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <motion.footer
      className="text-center py-1 text-sm text-gray-500 mt-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      © 2025 Free Chat. All rights reserved.     
      {/* <a href="#" className="hover:underline">Privacy</a> •{" "}
      <a href="#" className="hover:underline">Terms</a> •{" "}
      <a href="#" className="hover:underline">Support</a> */}
    </motion.footer>
  );
};

export default Footer;
