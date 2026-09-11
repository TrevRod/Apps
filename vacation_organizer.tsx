import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, CheckCircle, Circle, Trash2, Edit2, ChevronDown, ChevronUp, Sun, Moon } from 'lucide-react';

// Mock initial data for demonstration purposes
const INITIAL_TRIPS = [
  {
    id: '1',
    destination: 'Kyoto, Japan',
    startDate: '2026-10-15',
    endDate: '2026-10-24',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    checklist: [
      { id: 'c1', task: 'Passport & Visa', completed: true },
      { id: 'c2', task: 'Book JR Pass', completed: true },
      { id: 'c3', task: 'Pack comfortable walking shoes', completed: false },
      { id: 'c4', task: 'Exchange Currency', completed: false },
    ],
    itinerary: [
      { id: 'i1', date: '2026-10-15', time: '14:00', activity: 'Arrive at KIX, train to Kyoto', location: 'Kansai Airport' },
      { id: 'i2', date: '2026-10-16', time: '09:00', activity: 'Visit Fushimi Inari Shrine', location: 'Fushimi Ward' },
      { id: 'i3', date: '2026-10-16', time: '13:00', activity: 'Lunch at Nishiki Market', location: 'Nakagyo Ward' },
    ]
  },
  {
    id: '2',
    destination: 'Santorini, Greece',
    startDate: '2027-06-10',
    endDate: '2027-06-17',
    coverImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=800&q=80',
    checklist: [
      { id: 'c5', task: 'Sunscreen', completed: false },
      { id: 'c6', task: 'Swimwear', completed: false },
    ],
    itinerary: []
  }
];

export default function VacationOrganizer() {
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [activeTripId, setActiveTripId] = useState(INITIAL_TRIPS[0].id);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  
  // State for new trip form
  const [newTripDestination, setNewTripDestination] = useState('');
  const [newTripStart, setNewTripStart] = useState('');
  const [newTripEnd, setNewTripEnd] = useState('');

  const activeTrip = trips.find(t => t.id === activeTripId) || trips[0];

  // Toggle theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleAddTrip = (e) => {
    e.preventDefault();
    if (!newTripDestination || !newTripStart || !newTripEnd) return;

    const newTrip = {
      id: Date.now().toString(),
      destination: newTripDestination,
      startDate: newTripStart,
      endDate: newTripEnd,
      coverImage: `https://source.unsplash.com/800x400/?${encodeURIComponent(newTripDestination)}`, // Dynamic fallback
      checklist: [],
      itinerary: []
    };

    setTrips([...trips, newTrip]);
    setActiveTripId(newTrip.id);
    setShowNewTripModal(false);
    setNewTripDestination('');
    setNewTripStart('');
    setNewTripEnd('');
  };

  const handleDeleteTrip = (id) => {
    const updatedTrips = trips.filter(t => t.id !== id);
    setTrips(updatedTrips);
    if (activeTripId === id && updatedTrips.length > 0) {
      setActiveTripId(updatedTrips[0].id);
    }
  };

  const toggleChecklistItem = (tripId, itemId) => {
    setTrips(trips.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          checklist: trip.checklist.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return trip;
    }));
  };

  const addChecklistItem = (tripId, task) => {
    if (!task.trim()) return;
    setTrips(trips.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          checklist: [...trip.checklist, { id: Date.now().toString(), task, completed: false }]
        };
      }
      return trip;
    }));
  };

  const addItineraryItem = (tripId, item) => {
    setTrips(trips.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          itinerary: [...trip.itinerary, { ...item, id: Date.now().toString() }].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
            const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
            return dateA - dateB;
          })
        };
      }
      return trip;
    }));
  };

  const deleteItineraryItem = (tripId, itemId) => {
      setTrips(trips.map(trip => {
          if(trip.id === tripId) {
              return {
                  ...trip,
                  itinerary: trip.itinerary.filter(i => i.id !== itemId)
              }
          }
          return trip;
      }))
  }

  const deleteChecklistItem = (tripId, itemId) => {
      setTrips(trips.map(trip => {
          if(trip.id === tripId) {
              return {
                  ...trip,
                  checklist: trip.checklist.filter(c => c.id !== itemId)
              }
          }
          return trip;
      }))
  }


  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-200 flex flex-col md:flex-row`}>
      
      {/* Sidebar - Trip List */}
      <aside className={`w-full md:w-80 border-r ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} flex-shrink-0 flex flex-col h-screen overflow-hidden`}>
        <div className="p-6 flex justify-between items-center border-b border-inherit">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <MapPin className="text-blue-500" />
            Wanderlust
          </h1>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Your Trips</h2>
            <button 
              onClick={() => setShowNewTripModal(true)}
              className="p-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 transition-colors"
              title="Add New Trip"
            >
              <Plus size={16} />
            </button>
          </div>

          {trips.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center py-8">No trips planned yet. Time to explore!</p>
          ) : (
            trips.map(trip => (
              <div 
                key={trip.id}
                onClick={() => setActiveTripId(trip.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  activeTripId === trip.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' 
                    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <h3 className="font-semibold text-lg mb-1 truncate">{trip.destination}</h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1">
                  <Calendar size={14} />
                  <span>{new Date(trip.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} - {new Date(trip.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative">
        {activeTrip ? (
          <div>
            {/* Hero Section */}
            <div className="h-64 md:h-80 relative">
              <img 
                src={activeTrip.coverImage} 
                alt={activeTrip.destination}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80' }} // Default fallback
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{activeTrip.destination}</h1>
                    <p className="text-gray-200 flex items-center gap-2 text-lg">
                      <Calendar size={20} />
                      {new Date(activeTrip.startDate).toLocaleDateString(undefined, {weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'})} 
                      {' — '}
                      {new Date(activeTrip.endDate).toLocaleDateString(undefined, {weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'})}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDeleteTrip(activeTrip.id)}
                    className="p-3 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-colors"
                    title="Delete Trip"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Checklist Section */}
              <div className="lg:col-span-1 space-y-6">
                <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm border border-gray-100'}`}>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="text-green-500" />
                    Packing List
                  </h2>
                  
                  <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {activeTrip.checklist.length === 0 ? (
                      <p className="text-gray-500 text-sm italic">Nothing added yet.</p>
                    ) : (
                      activeTrip.checklist.map(item => (
                        <div key={item.id} className="flex items-start gap-3 group">
                          <button 
                            onClick={() => toggleChecklistItem(activeTrip.id, item.id)}
                            className="mt-1 flex-shrink-0 focus:outline-none"
                          >
                            {item.completed ? (
                              <CheckCircle className="text-green-500" size={20} />
                            ) : (
                              <Circle className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" size={20} />
                            )}
                          </button>
                          <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400' : ''}`}>
                            {item.task}
                          </span>
                          <button 
                            onClick={() => deleteChecklistItem(activeTrip.id, item.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = e.target.elements.task;
                      addChecklistItem(activeTrip.id, input.value);
                      input.value = '';
                    }}
                    className="flex gap-2"
                  >
                    <input 
                      type="text" 
                      name="task"
                      placeholder="Add an item..." 
                      className={`flex-1 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 border border-gray-200'}`}
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Add
                    </button>
                  </form>
                </div>
              </div>

              {/* Itinerary Section */}
              <div className="lg:col-span-2 space-y-6">
                 <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm border border-gray-100'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Calendar className="text-purple-500" />
                      Itinerary
                    </h2>
                  </div>

                  {/* Add Itinerary Item Form */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      addItineraryItem(activeTrip.id, {
                        date: formData.get('date'),
                        time: formData.get('time'),
                        activity: formData.get('activity'),
                        location: formData.get('location')
                      });
                      e.target.reset();
                    }}
                    className={`mb-8 p-4 rounded-xl border ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-100 bg-gray-50'}`}
                  >
                    <h4 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-300">Add Activity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <input 
                        required
                        type="date" 
                        name="date"
                        min={activeTrip.startDate}
                        max={activeTrip.endDate}
                        className={`px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none ${isDarkMode ? 'bg-gray-700 text-white color-scheme-dark' : 'bg-white border border-gray-200'}`}
                      />
                      <input 
                        type="time" 
                        name="time"
                        className={`px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none ${isDarkMode ? 'bg-gray-700 text-white color-scheme-dark' : 'bg-white border border-gray-200'}`}
                      />
                      <input 
                        required
                        type="text" 
                        name="activity"
                        placeholder="Activity (e.g., Dinner at Mario's)" 
                        className={`px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none md:col-span-2 ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white border border-gray-200'}`}
                      />
                      <input 
                        type="text" 
                        name="location"
                        placeholder="Location (Optional)" 
                        className={`px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none md:col-span-2 ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white border border-gray-200'}`}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Plus size={16} /> Add to Itinerary
                      </button>
                    </div>
                  </form>

                  {/* Display Itinerary */}
                  <div className="space-y-8">
                    {(() => {
                      if (activeTrip.itinerary.length === 0) {
                        return <p className="text-gray-500 italic text-center py-4">No activities planned yet.</p>;
                      }

                      // Group by date
                      const groupedItinerary = activeTrip.itinerary.reduce((acc, item) => {
                        if (!acc[item.date]) acc[item.date] = [];
                        acc[item.date].push(item);
                        return acc;
                      }, {});

                      return Object.keys(groupedItinerary).sort().map(date => (
                        <div key={date} className="relative">
                          {/* Date Header */}
                          <div className="sticky top-0 z-10 py-2 backdrop-blur-md flex items-center gap-4 mb-4">
                            <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400">
                              {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                            </h3>
                            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                          </div>
                          
                          {/* Timeline Items */}
                          <div className="space-y-4 pl-4 border-l-2 border-gray-100 dark:border-gray-700 ml-2">
                            {groupedItinerary[date].map(item => (
                              <div key={item.id} className="relative pl-6 group">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-purple-500 ring-4 ring-white dark:ring-gray-800"></div>
                                
                                <div className={`p-4 rounded-xl flex justify-between items-start gap-4 transition-colors ${isDarkMode ? 'bg-gray-750 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                  <div>
                                    <div className="flex items-baseline gap-2 mb-1">
                                      <span className="font-semibold">{item.time || 'All Day'}</span>
                                      <span className="text-lg text-gray-900 dark:text-gray-100">{item.activity}</span>
                                    </div>
                                    {item.location && (
                                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                        <MapPin size={14} />
                                        {item.location}
                                      </div>
                                    )}
                                  </div>
                                  <button 
                                      onClick={() => deleteItineraryItem(activeTrip.id, item.id)}
                                      className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-opacity rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                      title="Remove Activity"
                                  >
                                      <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 h-full flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-400">Select or create a trip to get started</h2>
            </div>
          </div>
        )}
      </main>

      {/* New Trip Modal */}
      {showNewTripModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Plan a New Adventure</h2>
              <form onSubmit={handleAddTrip} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Destination</label>
                  <input 
                    required
                    type="text" 
                    value={newTripDestination}
                    onChange={(e) => setNewTripDestination(e.target.value)}
                    placeholder="e.g., Paris, France" 
                    className={`w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 border border-gray-200'}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Start Date</label>
                    <input 
                      required
                      type="date" 
                      value={newTripStart}
                      onChange={(e) => setNewTripStart(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white color-scheme-dark' : 'bg-gray-50 border border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">End Date</label>
                    <input 
                      required
                      type="date" 
                      min={newTripStart} // Ensure end date is after start date
                      value={newTripEnd}
                      onChange={(e) => setNewTripEnd(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white color-scheme-dark' : 'bg-gray-50 border border-gray-200'}`}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowNewTripModal(false)}
                    className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors"
                  >
                    Create Trip
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for custom scrollbar to keep it clean */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .color-scheme-dark {
          color-scheme: dark;
        }
      `}} />
    </div>
  );
}