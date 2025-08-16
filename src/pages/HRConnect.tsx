import React, { useState, useEffect } from 'react';
import { Search, Eye, Mail, MapPin, Calendar, User, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string;
  education: string;
  expectedSalary: string;
  availability: string;
  submittedAt: string;
}

const HRConnect = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  useEffect(() => {
    // Load candidates from localStorage
    const savedCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    setCandidates(savedCandidates);
    setFilteredCandidates(savedCandidates);
  }, []);

  useEffect(() => {
    // Filter candidates based on search and filters
    let filtered = candidates;

    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterExperience) {
      filtered = filtered.filter(candidate => candidate.experience === filterExperience);
    }

    if (filterLocation) {
      filtered = filtered.filter(candidate =>
        candidate.location.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    setFilteredCandidates(filtered);
  }, [searchTerm, filterExperience, filterLocation, candidates]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo login - in real app, this would authenticate with backend
    if (loginData.email && loginData.password) {
      setIsLoggedIn(true);
      localStorage.setItem('hrLoggedIn', 'true');
    }
  };

  const handleContactCandidate = (candidate: Candidate) => {
    const subject = `Opportunity at Uniq HR - ${candidate.firstName} ${candidate.lastName}`;
    const body = `Hi ${candidate.firstName},\n\nI hope this message finds you well. I came across your profile through Uniq HR and was impressed by your background in ${candidate.skills}.\n\nI would love to discuss some exciting opportunities that might align with your career goals.\n\nBest regards,\nHR Team`;
    
    window.location.href = `mailto:${candidate.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Check if already logged in
  useEffect(() => {
    const logged = localStorage.getItem('hrLoggedIn');
    if (logged === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full mx-4"
        >
          <div className="text-center mb-8">
            <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">HR Connect Portal</h2>
            <p className="text-gray-600">Secure access for HR professionals</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="hr@company.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm mb-4">Demo Access:</p>
            <div className="bg-gray-50 p-4 rounded-lg text-left text-sm">
              <p><strong>Email:</strong> demo@hr.com</p>
              <p><strong>Password:</strong> demo123</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">HR Connect Dashboard</h1>
              <p className="text-blue-100">Find and connect with top talent</p>
            </div>
            <button
              onClick={() => {
                setIsLoggedIn(false);
                localStorage.removeItem('hrLoggedIn');
              }}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="sm:col-span-2 md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, skills, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterExperience}
                onChange={(e) => setFilterExperience(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Experience Levels</option>
                <option value="0-1">0-1 years</option>
                <option value="2-5">2-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="11-15">11-15 years</option>
                <option value="15+">15+ years</option>
              </select>
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Filter by location..."
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Candidates List */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Candidate Profiles ({filteredCandidates.length})
            </h2>
          </div>

          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600">
                {candidates.length === 0 
                  ? "No candidates have submitted profiles yet."
                  : "Try adjusting your search criteria."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredCandidates.map((candidate) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {candidate.firstName} {candidate.lastName}
                          </h3>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center text-gray-600 mb-2">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{candidate.location}</span>
                            </div>
                            <span className="mx-2 hidden sm:block">•</span>
                            <span className="text-sm">{candidate.experience} experience</span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm mt-2 sm:mt-0">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(candidate.submittedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills & Expertise:</h4>
                        <p className="text-gray-600 text-sm line-clamp-2">{candidate.skills}</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Expected Salary:</span>
                          <span className="ml-2 text-gray-900">{candidate.expectedSalary || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Availability:</span>
                          <span className="ml-2 text-gray-900">{candidate.availability}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 sm:ml-6">
                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleContactCandidate(candidate)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCandidate.firstName} {selectedCandidate.lastName}
                  </h2>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{selectedCandidate.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Email:</span> <span className="ml-2">{selectedCandidate.email}</span></p>
                  <p><span className="text-gray-500">Phone:</span> <span className="ml-2">{selectedCandidate.phone}</span></p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 font-medium">Experience:</span>
                    <span className="ml-2">{selectedCandidate.experience}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Expected Salary:</span>
                    <span className="ml-2">{selectedCandidate.expectedSalary || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Availability:</span>
                    <span className="ml-2">{selectedCandidate.availability}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedCandidate.skills}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Education Background</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedCandidate.education}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleContactCandidate(selectedCandidate)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </button>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HRConnect;
