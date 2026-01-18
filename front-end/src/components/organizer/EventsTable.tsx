import { useState, useEffect, useRef } from 'react';
import SearchIcon from '../../assets/Svgs/recherche.svg';
import NewestIcon from '../../assets/Svgs/newest.svg';
import AllDateIcon from '../../assets/Svgs/organiser/dashboard/Events/allDate.svg';
import OngoingIcon from '../../assets/Svgs/organiser/dashboard/Events/ongoing.svg';
import UpcomingIcon from '../../assets/Svgs/organiser/dashboard/Events/upcoming.svg';
import CompletedIcon from '../../assets/Svgs/organiser/dashboard/Events/completed.svg';
import CreateEventIcon from '../../assets/Svgs/organiser/dashboard/Events/createEvent.svg';
import Event1 from '../../assets/imges/event myticket 1.jpg';
import Event2 from '../../assets/imges/event myticket 2.jpg';
import Event3 from '../../assets/imges/event myticket 3.jpg';
import Event4 from '../../assets/imges/event myticket 4.png';
import Event5 from '../../assets/imges/event myticket 5.jpg';
import Event6 from '../../assets/imges/event myticket 6.jpg';
import Event7 from '../../assets/imges/event myticket 7.png';
import Event8 from '../../assets/imges/event myticket 8.png';
import Event9 from '../../assets/imges/event myticket 9.jpg';

interface TicketData {
  id: string;
  type: string;
  priceType: 'free' | 'paid' | '';
  price: string;
  quantity: string;
}

interface FAQData {
  id: string;
  question: string;
  answer: string;
}

interface FullEventData {
  id: string;
  name: string;
  image: string;
  images: string[];
  date: string;
  dateRange: [Date | null, Date | null];
  startTime: string;
  endTime: string;
  location: string;
  country: string;
  state: string;
  mapAddress: string;
  onlineLink: string;
  status: 'ongoing' | 'upcoming' | 'completed' | 'draft';
  sold: string;
  category: string;
  eventType: 'in-person' | 'online' | 'hybrid' | '';
  description: string;
  tickets: TicketData[];
  faqs: FAQData[];
  visibility: 'public' | 'private';
}

interface EventsTableProps {
  onCreateEvent: () => void;
  onEditEvent?: (event: FullEventData) => void;
  onDuplicateEvent?: (event: FullEventData) => void;
}

const EventsTable = ({ onCreateEvent, onEditEvent, onDuplicateEvent }: EventsTableProps) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ongoing' | 'upcoming' | 'past' | 'drafts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Newest First');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<FullEventData | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const eventsPerPage = 9;
  
  const sortRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset pagination to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Mock data - replace with actual API data
  const mockEvents: FullEventData[] = [
    {
      id: '1',
      name: 'Moonlight Melodies',
      image: Event1,
      images: [Event1, Event2, Event3],
      date: 'Jun 21, 2025',
      dateRange: [new Date(2025, 5, 21), new Date(2025, 5, 21)],
      startTime: '7:00 PM',
      endTime: '11:00 PM',
      location: 'Seaside Pavilion, Santa Monica, CA',
      country: 'United States',
      state: 'California',
      mapAddress: '1600 Ocean Front Walk, Santa Monica, CA 90401',
      onlineLink: '',
      status: 'ongoing',
      sold: '150/300',
      category: 'Music',
      eventType: 'in-person',
      description: 'Join us for an enchanting evening of live music under the moonlight at the iconic Seaside Pavilion. Featuring world-class jazz musicians, soulful vocalists, and an unforgettable atmosphere by the ocean. Experience the magic of Moonlight Melodies with gourmet food, craft cocktails, and stunning ocean views.',
      tickets: [
        { id: 't1', type: 'General Admission', priceType: 'paid', price: '45', quantity: '200' },
        { id: 't2', type: 'VIP', priceType: 'paid', price: '120', quantity: '50' },
        { id: 't3', type: 'Early Bird', priceType: 'paid', price: '35', quantity: '50' }
      ],
      faqs: [
        { id: 'f1', question: 'What should I bring?', answer: 'Bring a blanket or lawn chair for seating on the grass areas. Food and beverages will be available for purchase.' },
        { id: 'f2', question: 'Is parking available?', answer: 'Yes, free parking is available at the venue. We also encourage carpooling or using public transportation.' },
        { id: 'f3', question: 'Are children allowed?', answer: 'Yes! This is a family-friendly event. Children under 12 get free admission with a paying adult.' }
      ],
      visibility: 'public'
    },
    {
      id: '2',
      name: 'Rooftop Rhythms',
      image: Event2,
      images: [Event2, Event4, Event5],
      date: 'Aug 2, 2025',
      dateRange: [new Date(2025, 7, 2), new Date(2025, 7, 2)],
      startTime: '8:00 PM',
      endTime: '2:00 AM',
      location: 'HighNote Rooftop, Brooklyn, NY',
      country: 'United States',
      state: 'New York',
      mapAddress: '250 Ashland Pl, Brooklyn, NY 11217',
      onlineLink: '',
      status: 'upcoming',
      sold: '150/300',
      category: 'Music',
      eventType: 'in-person',
      description: 'Experience the ultimate rooftop party with stunning views of the Manhattan skyline. Rooftop Rhythms brings together the hottest DJs spinning house, techno, and deep house beats all night long. Premium bottle service, signature cocktails, and an unforgettable atmosphere await.',
      tickets: [
        { id: 't1', type: 'General Admission', priceType: 'paid', price: '55', quantity: '200' },
        { id: 't2', type: 'VIP Table', priceType: 'paid', price: '500', quantity: '20' }
      ],
      faqs: [
        { id: 'f1', question: 'What is the dress code?', answer: 'Smart casual attire is required. No athletic wear, sandals, or shorts.' },
        { id: 'f2', question: 'Is there an age restriction?', answer: 'This is a 21+ event. Valid ID is required for entry.' }
      ],
      visibility: 'public'
    },
    {
      id: '3',
      name: 'Harmony Under The Stars',
      image: Event3,
      images: [Event3, Event6, Event7],
      date: 'May 26, 2025',
      dateRange: [new Date(2025, 4, 26), new Date(2025, 4, 26)],
      startTime: '6:00 PM',
      endTime: '10:00 PM',
      location: 'Red Rock Grove, Sedona, AZ',
      country: 'United States',
      state: 'Arizona',
      mapAddress: '525 Boynton Canyon Rd, Sedona, AZ 86336',
      onlineLink: '',
      status: 'completed',
      sold: '300/300',
      category: 'Music',
      eventType: 'in-person',
      description: 'A magical evening of acoustic performances set against the breathtaking backdrop of Sedona\'s red rocks. Featuring Grammy-nominated artists performing intimate sets under the desert stars. Includes a gourmet farm-to-table dinner and local wine pairings.',
      tickets: [
        { id: 't1', type: 'Standard', priceType: 'paid', price: '85', quantity: '250' },
        { id: 't2', type: 'Premium', priceType: 'paid', price: '150', quantity: '50' }
      ],
      faqs: [
        { id: 'f1', question: 'What time should I arrive?', answer: 'Gates open at 5:00 PM. We recommend arriving early to explore the grounds and enjoy sunset.' }
      ],
      visibility: 'public'
    },
    {
      id: '4',
      name: 'Neon Vibes Festival',
      image: Event4,
      images: [Event4, Event8, Event9],
      date: 'July 13, 2025',
      dateRange: [new Date(2025, 6, 13), new Date(2025, 6, 14)],
      startTime: '4:00 PM',
      endTime: '12:00 AM',
      location: 'Lumen Park Amphitheater, Austin, TX',
      country: 'United States',
      state: 'Texas',
      mapAddress: '2100 Barton Springs Rd, Austin, TX 78704',
      onlineLink: '',
      status: 'ongoing',
      sold: '200/500',
      category: 'Music',
      eventType: 'in-person',
      description: 'Two days of non-stop electronic music featuring world-renowned DJs and stunning visual productions. Multiple stages, immersive art installations, and the best in EDM, house, and techno. Don\'t miss the largest neon-themed festival in Texas!',
      tickets: [
        { id: 't1', type: 'Single Day', priceType: 'paid', price: '75', quantity: '300' },
        { id: 't2', type: 'Weekend Pass', priceType: 'paid', price: '130', quantity: '150' },
        { id: 't3', type: 'VIP Weekend', priceType: 'paid', price: '250', quantity: '50' }
      ],
      faqs: [
        { id: 'f1', question: 'Can I re-enter?', answer: 'Yes, your wristband allows unlimited re-entry throughout the festival.' },
        { id: 'f2', question: 'Are there lockers?', answer: 'Yes, lockers are available for rent near the main entrance.' }
      ],
      visibility: 'public'
    },
    {
      id: '5',
      name: 'Echo Beats Live',
      image: Event5,
      images: [Event5, Event1, Event2],
      date: 'Aug 10, 2025',
      dateRange: [new Date(2025, 7, 10), new Date(2025, 7, 10)],
      startTime: '7:30 PM',
      endTime: '11:30 PM',
      location: 'Skyline Arena, Denver, CO',
      country: 'United States',
      state: 'Colorado',
      mapAddress: '1000 Chopper Cir, Denver, CO 80204',
      onlineLink: '',
      status: 'upcoming',
      sold: '150/300',
      category: 'Music',
      eventType: 'in-person',
      description: 'Echo Beats Live brings you an immersive concert experience with state-of-the-art sound systems and visual effects. Featuring headline performances from top indie and alternative artists.',
      tickets: [
        { id: 't1', type: 'General Admission', priceType: 'paid', price: '65', quantity: '250' },
        { id: 't2', type: 'Front Row', priceType: 'paid', price: '150', quantity: '50' }
      ],
      faqs: [],
      visibility: 'public'
    },
    {
      id: '6',
      name: 'Bass & Bloom',
      image: Event6,
      images: [Event6, Event3, Event4],
      date: 'May 24, 2025',
      dateRange: [new Date(2025, 4, 24), new Date(2025, 4, 24)],
      startTime: '2:00 PM',
      endTime: '10:00 PM',
      location: 'Riverfront Sound Garden, Nashville, TN',
      country: 'United States',
      state: 'Tennessee',
      mapAddress: '100 1st Ave N, Nashville, TN 37201',
      onlineLink: '',
      status: 'completed',
      sold: '300/300',
      category: 'Music',
      eventType: 'in-person',
      description: 'A unique fusion of live bass music and botanical garden exploration. Enjoy performances from bass and electronic artists while wandering through beautiful spring blooms.',
      tickets: [
        { id: 't1', type: 'General', priceType: 'paid', price: '40', quantity: '300' }
      ],
      faqs: [],
      visibility: 'public'
    },
    {
      id: '7',
      name: 'Tech Innovation Summit',
      image: Event7,
      images: [Event7, Event5, Event6],
      date: 'Jun 21, 2025',
      dateRange: [new Date(2025, 5, 21), new Date(2025, 5, 22)],
      startTime: '9:00 AM',
      endTime: '6:00 PM',
      location: 'Convention Center, San Jose, CA',
      country: 'United States',
      state: 'California',
      mapAddress: '150 W San Carlos St, San Jose, CA 95113',
      onlineLink: 'https://zoom.us/meeting/tech-summit-2025',
      status: 'ongoing',
      sold: '150/300',
      category: 'Tech',
      eventType: 'hybrid',
      description: 'Join industry leaders and innovators for two days of keynotes, workshops, and networking at the Tech Innovation Summit. Topics include AI, blockchain, cloud computing, and the future of work. Both in-person and virtual attendance options available.',
      tickets: [
        { id: 't1', type: 'In-Person', priceType: 'paid', price: '299', quantity: '200' },
        { id: 't2', type: 'Virtual', priceType: 'paid', price: '99', quantity: '500' },
        { id: 't3', type: 'Student', priceType: 'paid', price: '49', quantity: '100' }
      ],
      faqs: [
        { id: 'f1', question: 'Will sessions be recorded?', answer: 'Yes, all keynotes and main sessions will be recorded and available to ticket holders for 30 days.' },
        { id: 'f2', question: 'Is lunch included?', answer: 'Yes, lunch and refreshments are included for in-person attendees.' }
      ],
      visibility: 'public'
    },
    {
      id: '8',
      name: 'Startup Pitch Night',
      image: Event8,
      images: [Event8, Event7, Event9],
      date: 'Aug 2, 2025',
      dateRange: [new Date(2025, 7, 2), new Date(2025, 7, 2)],
      startTime: '6:00 PM',
      endTime: '9:00 PM',
      location: 'Innovation Hub, Brooklyn, NY',
      country: 'United States',
      state: 'New York',
      mapAddress: '120 Water St, Brooklyn, NY 11201',
      onlineLink: '',
      status: 'upcoming',
      sold: '80/150',
      category: 'Business',
      eventType: 'in-person',
      description: 'Watch 10 promising startups pitch their ideas to a panel of investors and industry experts. Network with entrepreneurs, investors, and fellow innovators. Cash prizes for the top 3 pitches!',
      tickets: [
        { id: 't1', type: 'General', priceType: 'paid', price: '25', quantity: '100' },
        { id: 't2', type: 'Investor Pass', priceType: 'paid', price: '100', quantity: '50' }
      ],
      faqs: [],
      visibility: 'public'
    },
    {
      id: '9',
      name: 'Art Gallery Opening',
      image: Event9,
      images: [Event9, Event1, Event8],
      date: 'May 26, 2025',
      dateRange: [new Date(2025, 4, 26), new Date(2025, 4, 26)],
      startTime: '7:00 PM',
      endTime: '10:00 PM',
      location: 'Contemporary Art Museum, Sedona, AZ',
      country: 'United States',
      state: 'Arizona',
      mapAddress: '250 Art St, Sedona, AZ 86336',
      onlineLink: '',
      status: 'completed',
      sold: '120/120',
      category: 'Art',
      eventType: 'in-person',
      description: 'Exclusive opening night for our new contemporary art exhibition featuring works from emerging artists around the world. Complimentary champagne and hors d\'oeuvres. Meet the artists and collectors.',
      tickets: [
        { id: 't1', type: 'General', priceType: 'free', price: '0', quantity: '100' },
        { id: 't2', type: 'Patron', priceType: 'paid', price: '250', quantity: '20' }
      ],
      faqs: [],
      visibility: 'public'
    },
    {
      id: '10',
      name: 'Summer Beats Festival',
      image: Event1,
      images: [Event1],
      date: 'Jul 15, 2025',
      dateRange: [new Date(2025, 6, 15), new Date(2025, 6, 15)],
      startTime: '3:00 PM',
      endTime: '11:00 PM',
      location: 'Central Park, New York, NY',
      country: 'United States',
      state: 'New York',
      mapAddress: 'Central Park, New York, NY 10024',
      onlineLink: '',
      status: 'upcoming',
      sold: '250/400',
      category: 'Music',
      eventType: 'in-person',
      description: 'The ultimate summer music festival in the heart of NYC. Multiple stages featuring pop, rock, and electronic artists.',
      tickets: [{ id: 't1', type: 'General Admission', priceType: 'paid', price: '75', quantity: '400' }],
      faqs: [],
      visibility: 'public'
    },
    {
      id: '11',
      name: 'Jazz & Wine Evening',
      image: Event2,
      images: [Event2],
      date: 'Aug 20, 2025',
      dateRange: [new Date(2025, 7, 20), new Date(2025, 7, 20)],
      startTime: '6:00 PM',
      endTime: '10:00 PM',
      location: 'Vineyard Terrace, Napa, CA',
      country: 'United States',
      state: 'California',
      mapAddress: '1000 Wine Country Rd, Napa, CA 94559',
      onlineLink: '',
      status: 'upcoming',
      sold: '80/150',
      category: 'Music',
      eventType: 'in-person',
      description: 'An elegant evening of live jazz and premium wine tastings at a stunning vineyard setting.',
      tickets: [{ id: 't1', type: 'Standard', priceType: 'paid', price: '95', quantity: '150' }],
      faqs: [],
      visibility: 'public'
    },
    {
      id: '12',
      name: 'Electronic Dreams',
      image: Event3,
      images: [Event3],
      date: 'Sep 5, 2025',
      dateRange: [new Date(2025, 8, 5), new Date(2025, 8, 5)],
      startTime: '9:00 PM',
      endTime: '4:00 AM',
      location: 'Metro Arena, Chicago, IL',
      country: 'United States',
      state: 'Illinois',
      mapAddress: '1901 W Madison St, Chicago, IL 60612',
      onlineLink: '',
      status: 'upcoming',
      sold: '400/600',
      category: 'Music',
      eventType: 'in-person',
      description: 'A night of electronic music featuring world-class DJs and immersive visual experiences.',
      tickets: [{ id: 't1', type: 'General', priceType: 'paid', price: '60', quantity: '600' }],
      faqs: [],
      visibility: 'public'
    }
  ];

  // Filter events based on active filter and search query
  const filteredEvents = mockEvents.filter(event => {
    const matchesFilter = 
      activeFilter === 'all' ? true :
      activeFilter === 'ongoing' ? event.status === 'ongoing' :
      activeFilter === 'upcoming' ? event.status === 'upcoming' :
      activeFilter === 'past' ? event.status === 'completed' :
      false;

    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Start new selection
      setSelectedStartDate(selected);
      setSelectedEndDate(null);
    } else {
      // Complete range selection
      if (selected < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(selected);
      } else {
        setSelectedEndDate(selected);
      }
      setIsDatePickerOpen(false);
    }
  };

  const handleMonthSelect = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    setSelectedStartDate(startOfMonth);
    setSelectedEndDate(endOfMonth);
    setIsDatePickerOpen(false);
  };

  const isDateInRange = (day: number): boolean => {
    if (!selectedStartDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (!selectedEndDate) {
      return date.getTime() === selectedStartDate.getTime();
    }
    
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isDateRangeEdge = (day: number): boolean => {
    if (!selectedStartDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (selectedEndDate) {
      return date.getTime() === selectedStartDate.getTime() || date.getTime() === selectedEndDate.getTime();
    }
    
    return date.getTime() === selectedStartDate.getTime();
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];
    const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const inRange = isDateInRange(day);
      const isEdge = isDateRangeEdge(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`h-8 flex items-center justify-center text-sm font-normal rounded-full transition-colors cursor-pointer
            ${isEdge ? 'bg-primary text-white font-medium' : ''}
            ${inRange && !isEdge ? 'bg-[#FFE8E3] text-black' : ''}
            ${!inRange ? 'text-black hover:bg-gray-100' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-light-gray p-4 z-50" style={{ width: '320px' }}>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleMonthSelect}
            className="text-xs text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer"
          >
            Select Month
          </button>
          {(selectedStartDate || selectedEndDate) && (
            <button
              onClick={() => {
                setSelectedStartDate(null);
                setSelectedEndDate(null);
              }}
              className="text-xs text-gray hover:text-black font-medium transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <h3 className="text-base font-medium text-black">{monthName}</h3>
          
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header with Create Event Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-black">Events</h1>
        
        {/* Create Event Button - Exact Figma styling */}
        <button
          onClick={onCreateEvent}
          className="relative flex items-center gap-2 pl-11 pr-5 py-2 bg-[#FF4000] hover:bg-[#E63900] text-white font-medium text-sm sm:text-base rounded-full transition-all cursor-pointer whitespace-nowrap"
          style={{ boxShadow: '0 4px 12px rgba(255, 64, 0, 0.25)' }}
        >
          <img src={CreateEventIcon} alt="Create" className="absolute left-1 top-1/2 -translate-y-1/2 w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 sm:gap-6 border-b border-light-gray mb-6 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveFilter('all')}
          className={`pb-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
            activeFilter === 'all' ? 'text-primary' : 'text-gray hover:text-black'
          }`}
        >
          All Events
          {activeFilter === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveFilter('ongoing')}
          className={`pb-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
            activeFilter === 'ongoing' ? 'text-primary' : 'text-gray hover:text-black'
          }`}
        >
          Ongoing Events
          {activeFilter === 'ongoing' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`pb-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
            activeFilter === 'upcoming' ? 'text-primary' : 'text-gray hover:text-black'
          }`}
        >
          Upcoming Events
          {activeFilter === 'upcoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveFilter('past')}
          className={`pb-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
            activeFilter === 'past' ? 'text-primary' : 'text-gray hover:text-black'
          }`}
        >
          Past Events
          {activeFilter === 'past' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveFilter('drafts')}
          className={`pb-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
            activeFilter === 'drafts' ? 'text-primary' : 'text-gray hover:text-black'
          }`}
        >
          Drafts
          {activeFilter === 'drafts' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Event Count and Search/Filter Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <h2 className="text-sm sm:text-base font-semibold text-black">
          {filteredEvents.length} Events
        </h2>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search Events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[160px] lg:w-[187px] h-[38px] pl-4 pr-10 bg-white border border-light-gray text-sm text-black placeholder:text-input-gray focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all rounded-full"
            />
            <img 
              src={SearchIcon} 
              alt="Search" 
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none" 
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsDatePickerOpen(false);
              }}
              className="flex items-center gap-2 pl-11 pr-3 border border-light-gray bg-white cursor-pointer hover:border-primary transition-colors w-[140px] sm:w-[160px] lg:w-[187px] h-[38px] rounded-full"
            >
              <img src={NewestIcon} alt="Sort" className="absolute left-1 top-1/2 -translate-y-1/2 w-[30px] h-[30px]" />
              <span className="text-sm font-medium text-gray truncate flex-1">{sortOption}</span>
              <svg className="w-4 h-4 text-gray shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-light-gray py-1 z-50">
                {['Newest First', 'Oldest First', 'A-Z'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortOption(option);
                      setIsSortOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors cursor-pointer ${
                      sortOption === option
                        ? 'bg-primary-light text-primary font-medium'
                        : 'text-gray hover:bg-secondary-light'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* All Date Filter */}
          <div className="relative" ref={datePickerRef}>
            <button
              onClick={() => {
                setIsDatePickerOpen(!isDatePickerOpen);
                setIsSortOpen(false);
              }}
              className="flex items-center gap-2 pl-11 pr-3 border border-light-gray bg-white cursor-pointer hover:border-primary transition-colors w-[140px] sm:w-[160px] lg:w-[187px] h-[38px] rounded-full"
            >
              <img src={AllDateIcon} alt="Date" className="absolute left-1 top-1/2 -translate-y-1/2 w-[30px] h-[30px]" />
              <span className="text-sm font-medium text-gray truncate flex-1">
                {selectedStartDate && selectedEndDate
                  ? `${selectedStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${selectedEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : selectedStartDate
                  ? selectedStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'All Date'}
              </span>
              <svg className="w-4 h-4 text-gray shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDatePickerOpen && renderCalendar()}
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white border border-light-gray rounded-xl overflow-hidden">
        {/* Table Header - Hidden on mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 lg:px-6 py-4 bg-secondary-light border-b border-light-gray">
          <div className="col-span-4 text-xs lg:text-sm font-semibold text-gray">Event Name</div>
          <div className="col-span-2 text-xs lg:text-sm font-semibold text-gray">Date</div>
          <div className="col-span-3 text-xs lg:text-sm font-semibold text-gray">Location</div>
          <div className="col-span-2 text-xs lg:text-sm font-semibold text-gray">Status</div>
          <div className="col-span-1 text-xs lg:text-sm font-semibold text-gray text-right">Sold</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-light-gray">
          {currentEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => {
                setSelectedEvent(event);
                setIsEventDetailsOpen(true);
              }}
              className="flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 px-4 lg:px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {/* Event Name with Image */}
              <div className="md:col-span-4 flex items-center gap-3">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                />
                <span className="text-sm font-medium text-black">{event.name}</span>
              </div>

              {/* Mobile: Date, Location, Status, Sold in a row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:hidden pl-13 text-xs">
                <span className="text-gray">{event.date}</span>
                <span className="text-gray truncate max-w-[150px]">{event.location}</span>
                <div className="inline-flex items-center gap-1">
                  {event.status === 'ongoing' && (
                    <>
                      <img src={OngoingIcon} alt="Ongoing" className="w-3 h-3" />
                      <span className="font-medium text-[#3B82F6]">Ongoing</span>
                    </>
                  )}
                  {event.status === 'upcoming' && (
                    <>
                      <img src={UpcomingIcon} alt="Upcoming" className="w-3 h-3" />
                      <span className="font-medium text-[#F59E0B]">Upcoming</span>
                    </>
                  )}
                  {event.status === 'completed' && (
                    <>
                      <img src={CompletedIcon} alt="Completed" className="w-3 h-3" />
                      <span className="font-medium text-[#10B981]">Completed</span>
                    </>
                  )}
                </div>
                <span className="font-medium text-black">{event.sold}</span>
              </div>

              {/* Desktop: Date */}
              <div className="hidden md:flex md:col-span-2 items-center">
                <span className="text-xs lg:text-sm text-gray">{event.date}</span>
              </div>

              {/* Desktop: Location */}
              <div className="hidden md:flex md:col-span-3 items-center">
                <span className="text-xs lg:text-sm text-gray truncate">{event.location}</span>
              </div>

              {/* Desktop: Status */}
              <div className="hidden md:flex md:col-span-2 items-center justify-start">
                {event.status === 'ongoing' && (
                  <div className="inline-flex items-center gap-2">
                    <img src={OngoingIcon} alt="Ongoing" className="w-4 h-4" />
                    <span className="text-xs lg:text-sm font-medium text-[#3B82F6]">Ongoing</span>
                  </div>
                )}
                {event.status === 'upcoming' && (
                  <div className="inline-flex items-center gap-2">
                    <img src={UpcomingIcon} alt="Upcoming" className="w-4 h-4" />
                    <span className="text-xs lg:text-sm font-medium text-[#F59E0B]">Upcoming</span>
                  </div>
                )}
                {event.status === 'completed' && (
                  <div className="inline-flex items-center gap-2">
                    <img src={CompletedIcon} alt="Completed" className="w-4 h-4" />
                    <span className="text-xs lg:text-sm font-medium text-[#10B981]">Completed</span>
                  </div>
                )}
              </div>

              {/* Desktop: Sold */}
              <div className="hidden md:flex md:col-span-1 items-center justify-end">
                <span className="text-xs lg:text-sm font-medium text-black">{event.sold}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {filteredEvents.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <p className="text-xs sm:text-sm text-gray order-2 sm:order-1">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} Events
          </p>
          
          <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
            {/* Previous Button */}
            <button 
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-light-gray hover:bg-secondary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Page Numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageClick(pageNumber)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-[#9CA3AF] text-white'
                      : 'border border-light-gray text-gray hover:bg-secondary-light'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-sm text-gray">...</span>
                <button
                  onClick={() => handlePageClick(totalPages)}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-light-gray text-sm font-medium text-gray hover:bg-secondary-light transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}
            
            {/* Next Button */}
            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-light-gray hover:bg-secondary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-light-gray rounded-xl">
          <div className="w-24 h-24 bg-secondary-light rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-input-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-black mb-2">No events found</h3>
          <p className="text-sm text-gray mb-4">
            {searchQuery ? 'Try adjusting your search or filters' : 'Create your first event to get started'}
          </p>
          {!searchQuery && (
            <button
              onClick={onCreateEvent}
              className="relative flex items-center gap-2 pl-9 pr-4 py-1.5 bg-[#FF4000] hover:bg-[#E63900] text-white font-medium text-sm rounded-full transition-all cursor-pointer whitespace-nowrap"
              style={{ boxShadow: '0 4px 12px rgba(255, 64, 0, 0.25)' }}
            >
              <img src={CreateEventIcon} alt="Create" className="absolute left-1 top-1/2 -translate-y-1/2 w-[22px] h-[22px]" />
              <span>Create Event</span>
            </button>
          )}
        </div>
      )}

      {/* Event Details Popup */}
      {isEventDetailsOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            ref={popupRef}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header with Image Gallery */}
            <div className="relative h-64 sm:h-80">
              <img
                src={selectedEvent.images[currentImageIndex]}
                alt={selectedEvent.name}
                className="w-full h-full object-cover rounded-t-2xl"
              />
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsEventDetailsOpen(false);
                  setCurrentImageIndex(0);
                }}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-lg z-10"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Image Navigation - Previous */}
              {selectedEvent.images.length > 1 && currentImageIndex > 0 && (
                <button
                  onClick={() => setCurrentImageIndex(prev => prev - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-lg z-10"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* Image Navigation - Next */}
              {selectedEvent.images.length > 1 && currentImageIndex < selectedEvent.images.length - 1 && (
                <button
                  onClick={() => setCurrentImageIndex(prev => prev + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-lg z-10"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              
              {/* Image Counter */}
              {selectedEvent.images.length > 1 && (
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 text-white text-xs font-medium rounded-full">
                  {currentImageIndex + 1} / {selectedEvent.images.length}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="px-8 py-6 sm:px-10 sm:py-8">
              {/* Title, Status and Category */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-primary-light text-primary text-xs font-medium rounded-full">
                    {selectedEvent.category}
                  </span>
                  <span className="px-3 py-1 bg-secondary-light text-gray text-xs font-medium rounded-full capitalize">
                    {selectedEvent.eventType}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl sm:text-3xl font-bold text-black">{selectedEvent.name}</h2>
                  <div className="shrink-0">
                    {selectedEvent.status === 'ongoing' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                        <img src={OngoingIcon} alt="Ongoing" className="w-3.5 h-3.5 brightness-0 invert" />
                        Ongoing
                      </span>
                    )}
                    {selectedEvent.status === 'upcoming' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                        <img src={UpcomingIcon} alt="Upcoming" className="w-3.5 h-3.5 brightness-0 invert" />
                        Upcoming
                      </span>
                    )}
                    {selectedEvent.status === 'completed' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                        <img src={CompletedIcon} alt="Completed" className="w-3.5 h-3.5 brightness-0 invert" />
                        Completed
                      </span>
                    )}
                    {selectedEvent.status === 'draft' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-light-gray">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray">Date</p>
                    <p className="text-sm font-medium text-black">{selectedEvent.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray">Time</p>
                    <p className="text-sm font-medium text-black">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray">Location</p>
                    <p className="text-sm font-medium text-black">{selectedEvent.location}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6 pb-6 border-b border-light-gray">
                <h3 className="text-lg font-semibold text-black mb-3">About This Event</h3>
                <p className="text-sm text-gray leading-relaxed">{selectedEvent.description}</p>
              </div>

              {/* Address */}
              <div className="mb-6 pb-6 border-b border-light-gray">
                <h3 className="text-lg font-semibold text-black mb-3">Venue</h3>
                <p className="text-sm text-gray">{selectedEvent.mapAddress}</p>
                {selectedEvent.onlineLink && (
                  <div className="mt-2">
                    <p className="text-sm text-gray">Online Link:</p>
                    <a href={selectedEvent.onlineLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      {selectedEvent.onlineLink}
                    </a>
                  </div>
                )}
              </div>

              {/* Tickets */}
              {selectedEvent.tickets.length > 0 && (
                <div className="mb-6 pb-6 border-b border-light-gray">
                  <h3 className="text-lg font-semibold text-black mb-3">Tickets</h3>
                  <div className="space-y-3">
                    {selectedEvent.tickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-4 bg-secondary-light rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-black">{ticket.type}</p>
                          <p className="text-xs text-gray">Quantity: {ticket.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-primary">
                            {ticket.priceType === 'free' ? 'Free' : `$${ticket.price}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {selectedEvent.faqs.length > 0 && (
                <div className="mb-6 pb-6 border-b border-light-gray">
                  <h3 className="text-lg font-semibold text-black mb-3">FAQ</h3>
                  <div className="space-y-4">
                    {selectedEvent.faqs.map((faq) => (
                      <div key={faq.id}>
                        <p className="text-sm font-medium text-black mb-1">{faq.question}</p>
                        <p className="text-sm text-gray">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sold Info - Modern Design */}
              <div className="mb-8">
                <div className="bg-gradient-to-br from-primary-light to-secondary-light rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-black">Tickets Sold</h3>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{selectedEvent.sold.split('/')[0]}</p>
                      <p className="text-sm text-gray">of {selectedEvent.sold.split('/')[1]}</p>
                    </div>
                  </div>
                  <div className="relative h-2 bg-white rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-[#FF6B35] rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(parseInt(selectedEvent.sold.split('/')[0]) / parseInt(selectedEvent.sold.split('/')[1])) * 100}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray mt-2">
                    {Math.round((parseInt(selectedEvent.sold.split('/')[0]) / parseInt(selectedEvent.sold.split('/')[1])) * 100)}% capacity
                  </p>
                </div>
              </div>

              {/* Action Buttons - Styled like Cancel button from Create Event */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setIsEventDetailsOpen(false);
                    if (onEditEvent) {
                      onEditEvent(selectedEvent);
                    }
                  }}
                  className="pl-5 pr-5 py-2 border border-primary text-primary rounded-full text-sm font-medium hover:bg-primary-light transition-all whitespace-nowrap"
                >
                  Edit Event
                </button>
                <button
                  onClick={() => {
                    setIsEventDetailsOpen(false);
                    if (onDuplicateEvent) {
                      onDuplicateEvent(selectedEvent);
                    }
                  }}
                  className="pl-5 pr-5 py-2 border border-primary text-primary rounded-full text-sm font-medium hover:bg-primary-light transition-all whitespace-nowrap"
                >
                  Duplicate Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTable;
