import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Building, Award, TrendingUp } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import Hero from "../assets/hero.mp4";
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

// Optimized AnimatedCounter for mobile
const AnimatedCounter = ({ end, duration = 2000, label }: { end: number; duration?: number; label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        // For the 98% success rate, we don't want a decimal
        const newCount = (end < 100) ? Math.ceil(end * percentage) : Math.floor(end * percentage);
        setCount(newCount);
        
        if (percentage < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  // Added a check for the '%' sign in the label to handle it specially
  const displayValue = label.includes('%') ? `${count}%` : `${count.toLocaleString()}+`;

  return (
    <div className="text-center" ref={ref}>
      {/* Mobile-first font size: smaller on mobile, larger on desktop */}
      <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{displayValue}</div>
      {/* Mobile-first label size */}
      <div className="text-sm sm:text-base text-gray-600">{label.replace(' %', '')}</div>
    </div>
  );
};

// Optimized ScrollingText for mobile
const ScrollingText = () => {
  const [newsItems, setNewsItems] = useState<string[]>([]);
  const scrollingRef = useRef<HTMLDivElement>(null);
  const [scrollingWidth, setScrollingWidth] = useState(0);

  useEffect(() => {
    const flashNewsRef = ref(database, 'flashnews');
    onValue(flashNewsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newsList = Object.values(data) as string[];
        setNewsItems(newsList);
      }
    });
  }, []);

  useEffect(() => {
    if (scrollingRef.current) {
      setScrollingWidth(scrollingRef.current.scrollWidth / 2);
    }
  }, [newsItems]);

  return (
    // Reduced horizontal padding on mobile (px-4) and more on larger screens (sm:px-6)
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 to-indigo-600/10 backdrop-blur-sm rounded-full py-3 px-4 sm:px-6 border border-blue-200/30">
      <motion.div
        ref={scrollingRef}
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -scrollingWidth]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: scrollingWidth / 50,
            ease: "linear",
          },
        }}
      >
        {newsItems.length > 0 && [...newsItems, ...newsItems].map((item, index) => (
          <span
            key={index}
            // Reduced margin between items for better density
            className="inline-block text-blue-700 text-sm font-medium mx-6 flex-shrink-0"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

interface Service {
  title: string;
  description: string;
  image: string;
}

const Home = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const servicesRef = ref(database, 'services');
    onValue(servicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setServices(data);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="overflow-x-hidden"> {/* Changed to overflow-x-hidden to prevent horizontal scroll */}
    <br></br>
      {/* Hero Section with White Background */}
      <section className="relative bg-white overflow-hidden pt-20 sm:pt-24 pb-16 sm:pb-20">
        
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-50/50 to-indigo-50/30 z-10"></div>
        
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-gray-900 lg:w-1/2 text-center lg:text-left"
            >
              {/* Adjusted font sizes for better scaling on mobile devices */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                CONNECTING TALENT WITH{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  OPPORTUNITY
                </span>
              </h1>
              
              <p className="text-base sm:text-lg mb-6 sm:mb-8 text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0 uppercase">
                Professional HR consultancy services that bridge the gap between exceptional talent and remarkable opportunities.
              </p>
              
              {/* MODIFICATION: Added `items-center` to center buttons horizontally on mobile view (`flex-col`) */}
<div className="flex flex-row gap-4 mb-8 justify-center sm:justify-center md:justify-center lg:justify-start items-center flex-wrap">

  <Link
    to="/job-seeker"
    className="w-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center group shadow-lg text-xs sm:text-sm sm:w-auto sm:px-6 sm:py-4 sm:text-base"
  >
    Submit Your Profile
    <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
  </Link>
  <Link
    to="/blog"
    className="w-40 bg-white/80 backdrop-blur-sm hover:bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 border-blue-200 hover:border-blue-300 shadow-lg flex items-center justify-center text-xs sm:text-sm sm:w-auto sm:px-6 sm:py-4 sm:text-base"
  >
    HR Professionals
  </Link>
</div>
<div className="w-full max-w-[100vw] px-4 sm:px-6 lg:px-0 overflow-x-hidden">
  <div className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
    <ScrollingText />
  </div>
</div>
            </motion.div>

            {/* Right Image/Video */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:w-1/2 mt-8 lg:mt-0 w-full"
            >
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  {/* Adjusted video height for better mobile aspect ratio */}
                  <video
                    src={Hero}
                    autoPlay
                    loop
                    muted
                    playsInline /* Important for autoplay on iOS */
                    className="w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-[550px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                </div>

                {/* Floating Elements - Adjusted positioning and sizing for mobile */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-white/20"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      {/* Responsive font size */}
                      <div className="text-lg sm:text-xl font-bold text-gray-900">98%</div>
                      <div className="text-xs sm:text-sm text-gray-600">Success Rate</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-white/20"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      {/* Responsive font size */}
                      <div className="text-lg sm:text-xl font-bold text-gray-900">2.5K+</div>
                      <div className="text-xs sm:text-sm text-gray-600">Placements</div>
                    </div>
                  </div>
                </motion.div>
                
                <div className="absolute -z-10 top-5 right-5 w-24 h-24 bg-blue-400/10 rounded-full blur-xl"></div>
                <div className="absolute -z-10 bottom-5 left-5 w-20 h-20 bg-indigo-400/10 rounded-full blur-xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* Reduced vertical padding on mobile (py-16) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">OUR IMPACT IN NUMBERS</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">TRUSTED BY PROFESSIONALS AND COMPANIES WORLDWIDE</p>
          </motion.div>

          {/* This grid is well-optimized: 2 columns on mobile, 4 on medium screens and up */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Users, end: 2500, label: 'SUCCESSFUL PLACEMENTS' },
              { icon: Building, end: 150, label: 'PARTNER COMPANIES' },
              { icon: Award, end: 98, label: 'SUCCESS RATE %' },
              { icon: TrendingUp, end: 5, label: 'YEARS EXPERIENCE' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                // Reduced padding on mobile (p-4)
                className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="bg-blue-600 text-white p-3 rounded-lg inline-block mb-3">
                  <stat.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <AnimatedCounter end={stat.end} label={stat.label} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        WHAT WE OFFER
      </h2>
      <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
        COMPREHENSIVE HR SOLUTIONS FOR JOB SEEKERS AND EMPLOYERS
      </p>
    </motion.div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {loading ? (
        <div className="col-span-3 flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div
              className="h-40 sm:h-48 bg-cover bg-center"
              style={{ backgroundImage: `url('${service.image}')` }}
            ></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.title.toUpperCase()}
              </h3>
              <p className="text-gray-600 text-base">
                {service.description.toUpperCase()}
              </p>
            </div>
          </motion.div>
        ))
      )}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">READY TO TAKE THE NEXT STEP?</h2>
            <p className="text-lg mb-8 text-blue-100 max-w-3xl mx-auto">
              JOIN THOUSANDS OF PROFESSIONALS WHO HAVE FOUND THEIR PERFECT CAREER MATCH WITH US.
            </p>
            {/* flex-col on mobile is great for stacking buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/job-seeker"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Get Started Today
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
