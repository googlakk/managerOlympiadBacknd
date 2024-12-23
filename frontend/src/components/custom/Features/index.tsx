"use client";

import SectionTitle from "@/components/common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./FeaturesData";
import { motion } from "framer-motion";

const Features = () => {
  return (
    <>
      <section id="features" className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="
            Миссия WISF:"
            paragraph=""
            center
          />
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                x: -20,
              },

              visible: {
                opacity: 1,
                x: 0,
              },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_top "
          >
            <div className="grid grid-cols-1 gapr-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {featuresData.map((feature) => (
                <SingleFeature key={feature.id} feature={feature} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Features;
