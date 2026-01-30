import { useState, useRef, useEffect } from 'react';
import CreateEventIcon from '../../assets/Svgs/organiser/dashboard/Events/createEvent.svg';
import UpIcon from '../../assets/Svgs/organiser/dashboard/Orders/up.svg';
import DownIcon from '../../assets/Svgs/organiser/dashboard/Orders/down.svg';
import ArrowUpIcon from '../../assets/Svgs/organiser/dashboard/Orders/arrowUp.svg';
import ArrowDownIcon from '../../assets/Svgs/organiser/dashboard/Orders/arrowDown.svg';
import UpTrendIcon from '../../assets/Svgs/organiser/dashboard/dashboard/up.svg';
import DownTrendIcon from '../../assets/Svgs/organiser/dashboard/dashboard/down.svg';
import NoChangeIcon from '../../assets/Svgs/organiser/dashboard/dashboard/noChange.svg';
import SeeAllIcon from '../../assets/Svgs/organiser/dashboard/dashboard/seeAll.svg';
import ProfilePhoto1 from '../../assets/imges/photoPorifle/Mask group.png';
import ProfilePhoto2 from '../../assets/imges/photoPorifle/Mask group (1).png';
import ProfilePhoto3 from '../../assets/imges/photoPorifle/Mask group (2).png';
import ProfilePhoto4 from '../../assets/imges/photoPorifle/Mask group (3).png';
import ProfilePhoto5 from '../../assets/imges/photoPorifle/Mask group (4).png';

interface DashboardProps {
  onCreateEvent: () => void;
}

interface Activity {
  id: string;
  organizerName: string;
  organizerPhoto: string;
  action: string;
  eventName: string;
  time: string;
}

const Dashboard = ({ onCreateEvent }: DashboardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [isActivitiesModalOpen, setIsActivitiesModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);

  const recentActivities: Activity[] = [
    {
      id: '1',
      organizerName: 'Abdeslam Azzoun',
      organizerPhoto: ProfilePhoto1,
      action: 'a mis à jour les informations de l\'événement',
      eventName: 'Emploitic Connect',
      time: 'Il y a 15 min'
    },
    {
      id: '2',
      organizerName: 'Sarah Martinez',
      organizerPhoto: ProfilePhoto2,
      action: 'a créé et configuré un nouvel événement',
      eventName: 'Tech Summit 2025',
      time: 'Il y a 2 heures'
    },
    {
      id: '3',
      organizerName: 'John Anderson',
      organizerPhoto: ProfilePhoto3,
      action: 'a publié et rendu visible l\'événement',
      eventName: 'Music Festival',
      time: 'Hier'
    },
    {
      id: '4',
      organizerName: 'Emma Wilson',
      organizerPhoto: ProfilePhoto4,
      action: 'a supprimé définitivement l\'événement',
      eventName: 'Art Exhibition',
      time: 'Il y a 3 jours'
    },
    {
      id: '5',
      organizerName: 'Michael Chen',
      organizerPhoto: ProfilePhoto5,
      action: 'a modifié les paramètres de l\'événement',
      eventName: 'Business Conference',
      time: 'La semaine dernière'
    }
  ];

  const displayedActivities = recentActivities.slice(0, 3);

  const periods = ['Weekly', 'Monthly', 'Yearly'];

  // Dynamic ticket data based on selected period
  const getTicketData = () => {
    switch (selectedPeriod) {
      case 'Monthly':
        return [
          { type: 'VIP Access', sold: 1420, conversion: '19.2%', totalSales: '34%', trend: 'up', change: '15%' },
          { type: 'Early Bird', sold: 1180, conversion: '25.8%', totalSales: '28%', trend: 'up', change: '13%' },
          { type: 'General Admission', sold: 890, conversion: '12.5%', totalSales: '22%', trend: 'nochange', change: '0%' },
          { type: 'Backstage Pass', sold: 560, conversion: '17.3%', totalSales: '16%', trend: 'down', change: '3%' }
        ];
      case 'Yearly':
        return [
          { type: 'VIP Access', sold: 18500, conversion: '20.1%', totalSales: '35%', trend: 'up', change: '18%' },
          { type: 'Early Bird', sold: 15200, conversion: '26.5%', totalSales: '29%', trend: 'up', change: '16%' },
          { type: 'General Admission', sold: 11400, conversion: '13.2%', totalSales: '23%', trend: 'nochange', change: '0%' },
          { type: 'Backstage Pass', sold: 7100, conversion: '18.1%', totalSales: '13%', trend: 'down', change: '2%' }
        ];
      default: // Weekly
        return [
          { type: 'VIP Access', sold: 325, conversion: '18.5%', totalSales: '32%', trend: 'up', change: '12%' },
          { type: 'Early Bird', sold: 275, conversion: '24.2%', totalSales: '27%', trend: 'up', change: '10%' },
          { type: 'General Admission', sold: 212, conversion: '11.1%', totalSales: '21%', trend: 'nochange', change: '0%' },
          { type: 'Backstage Pass', sold: 134, conversion: '16.9%', totalSales: '13%', trend: 'down', change: '5%' }
        ];
    }
  };

  const ticketData = getTicketData();

  const getFromLastLabel = () => {
    switch (selectedPeriod) {
      case 'Monthly':
        return 'From Last Month';
      case 'Yearly':
        return 'From Last Year';
      default:
        return 'From Last Week';
    }
  };

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    setIsPeriodDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(event.target as Node)) {
        setIsPeriodDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isActivitiesModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isActivitiesModalOpen]);

  return (
    <div className="w-full">
      {/* Header with Create Event Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-black">Dashboard</h1>
        
        {/* Create Event Button - Exact same as Events tab */}
        <button
          onClick={onCreateEvent}
          className="relative flex items-center gap-2 pl-11 pr-5 py-2 bg-[#FF4000] hover:bg-[#E63900] text-white font-medium text-sm sm:text-base rounded-full transition-all cursor-pointer whitespace-nowrap"
          style={{ boxShadow: '0 4px 12px rgba(255, 64, 0, 0.25)' }}
        >
          <img src={CreateEventIcon} alt="Create" className="absolute left-1 top-1/2 -translate-y-1/2 w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]" />
          <span>Create Event</span>
        </button>
      </div>

      {/* KPI Cards - Exact same design as Orders tab */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Orders KPI */}
        <div className="bg-white border border-light-gray rounded-xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs lg:text-sm text-gray mb-1">Total Orders</p>
              <h3 className="text-2xl lg:text-3xl font-bold text-black">1,245</h3>
            </div>
            <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center">
              <img src={UpIcon} alt="Up trend" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <img src={ArrowUpIcon} alt="Up" className="w-3 h-3" />
            <span className="text-xs lg:text-sm font-medium text-[#10B981]">28.5%</span>
            <span className="text-xs lg:text-sm text-gray ml-1">From last month</span>
          </div>
        </div>

        {/* Total Returns KPI */}
        <div className="bg-white border border-light-gray rounded-xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs lg:text-sm text-gray mb-1">Total Returns</p>
              <h3 className="text-2xl lg:text-3xl font-bold text-black">287</h3>
            </div>
            <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center">
              <img src={DownIcon} alt="Down trend" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <img src={ArrowDownIcon} alt="Down" className="w-3 h-3" />
            <span className="text-xs lg:text-sm font-medium text-[#EF4444]">47.3%</span>
            <span className="text-xs lg:text-sm text-gray ml-1">From last month</span>
          </div>
        </div>

        {/* Total Revenue KPI */}
        <div className="bg-white border border-light-gray rounded-xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs lg:text-sm text-gray mb-1">Total Revenue</p>
              <h3 className="text-2xl lg:text-3xl font-bold text-black">$12,964</h3>
            </div>
            <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center">
              <img src={UpIcon} alt="Up trend" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <img src={ArrowUpIcon} alt="Up" className="w-3 h-3" />
            <span className="text-xs lg:text-sm font-medium text-[#10B981]">39.8%</span>
            <span className="text-xs lg:text-sm text-gray ml-1">From last month</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
        {/* Top Selling Ticket Categories - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white border border-light-gray rounded-xl p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-black">Top Selling Ticket Categories</h2>
            <div className="flex items-center gap-3">
              {/* Period Dropdown */}
              <div className="relative" ref={periodRef}>
                <button
                  type="button"
                  onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                  className="px-3 py-1 text-sm text-black border border-light-gray rounded-xl focus:outline-none focus:border-primary transition-all flex items-center justify-between min-w-[100px] cursor-pointer"
                >
                  {selectedPeriod}
                  <svg className="w-4 h-4 text-gray ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isPeriodDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-light-gray rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {periods.map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => handlePeriodSelect(period)}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors cursor-pointer ${
                          selectedPeriod === period
                            ? 'bg-primary-light text-primary font-medium'
                            : 'text-gray hover:bg-secondary-light'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-light-gray">
                  <th className="text-left text-xs font-medium text-gray pb-3" style={{ width: '25%' }}>Ticket Type</th>
                  <th className="text-left text-xs font-medium text-gray pb-3" style={{ width: '15%' }}>Sold</th>
                  <th className="text-left text-xs font-medium text-gray pb-3" style={{ width: '18%' }}>Conversion</th>
                  <th className="text-left text-xs font-medium text-gray pb-3" style={{ width: '17%' }}>Total Sales %</th>
                  <th className="text-left text-xs font-medium text-gray pb-3" style={{ width: '25%' }}>{getFromLastLabel()}</th>
                </tr>
              </thead>
              <tbody>
                {ticketData.map((ticket, index) => (
                  <tr key={ticket.type} className={index < ticketData.length - 1 ? 'border-b border-light-gray' : ''}>
                    <td className="py-4 text-sm font-medium text-black">{ticket.type}</td>
                    <td className="py-4 text-sm text-black">{ticket.sold}</td>
                    <td className="py-4 text-sm text-black">{ticket.conversion}</td>
                    <td className="py-4 text-sm text-black">{ticket.totalSales}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        {ticket.trend === 'up' && (
                          <>
                            <img src={UpTrendIcon} alt="Up" className="w-3 h-3" />
                            <span className="text-sm font-medium text-[#10B981]">{ticket.change}</span>
                            <span className="text-sm text-gray">Up</span>
                          </>
                        )}
                        {ticket.trend === 'down' && (
                          <>
                            <img src={DownTrendIcon} alt="Down" className="w-3 h-3" />
                            <span className="text-sm font-medium text-[#EF4444]">{ticket.change}</span>
                            <span className="text-sm text-gray">Down</span>
                          </>
                        )}
                        {ticket.trend === 'nochange' && (
                          <>
                            <img src={NoChangeIcon} alt="No change" className="w-3 h-3" />
                            <span className="text-sm font-medium text-[#003a97]">{ticket.change}</span>
                            <span className="text-sm text-gray">No Change</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Activities Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-black">Recent Activities</h2>
              <button 
                onClick={() => setIsActivitiesModalOpen(true)}
                className="text-[#FF4000] text-xs font-medium hover:text-[#E63900] transition-colors cursor-pointer"
              >
                See All
              </button>
            </div>

            {/* Activities List */}
            <div className="space-y-3">
              {displayedActivities.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-start gap-3">
                    {/* Organizer Photo */}
                    <img 
                      src={activity.organizerPhoto} 
                      alt={activity.organizerName}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    
                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-black">
                        <span className="font-bold">{activity.organizerName}</span>
                        {' '}{activity.action}{' '}
                        {activity.eventName}.
                      </p>
                      <p className="text-xs text-gray mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                  {index < displayedActivities.length - 1 && (
                    <div className="border-b border-light-gray mt-3"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Alert Panels */}
        <div className="flex flex-col justify-between gap-6">
          {/* Important Alerts Panel */}
          <div className="bg-white border border-light-gray rounded-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF4000] rounded-full"></div>
                <h3 className="text-sm font-bold text-black">Important Alerts</h3>
                <span className="px-2 py-0.5 bg-black text-white text-xs font-medium rounded-full">5 New</span>
              </div>
              <button 
                onClick={() => setIsAlertsModalOpen(true)}
                className="text-[#FF4000] text-xs font-medium hover:text-[#E63900] transition-colors cursor-pointer"
              >
                See All
              </button>
            </div>

            {/* Alert Items */}
            <div className="space-y-4">
              {/* Vendor Coordination Meeting */}
              <div className="pb-4 border-b border-light-gray last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-black">Vendor Coordination Meeting</h4>
                  <span className="text-xs text-gray whitespace-nowrap ml-2">in 30 min</span>
                </div>
                <p className="text-xs text-gray mb-2">You have a meeting at 11:00 AM – Vendor Coordination Call</p>
                <button className="px-3 py-1 border border-[#FF4000] text-[#FF4000] text-xs font-medium rounded-lg hover:bg-[#FF4000] hover:text-white transition-colors cursor-pointer">
                  Join Now
                </button>
              </div>

              {/* Reminder: Ticket Launch */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-black">Reminder: Ticket Launch</h4>
                  <span className="text-xs text-gray whitespace-nowrap ml-2">in 1 hr</span>
                </div>
                <p className="text-xs text-gray mb-2">Early Bird Phase begins at 12:00 PM*</p>
                <button className="px-3 py-1 border border-[#FF4000] text-[#FF4000] text-xs font-medium rounded-lg hover:bg-[#FF4000] hover:text-white transition-colors cursor-pointer">
                  Retry Now
                </button>
              </div>
            </div>
          </div>

          {/* Action Required Panel */}
          <div className="bg-white border border-light-gray rounded-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FBBC04] rounded-full"></div>
                <h3 className="text-sm font-bold text-black">Action Required</h3>
                <span className="px-2 py-0.5 bg-black text-white text-xs font-medium rounded-full">3 New</span>
              </div>
              <button 
                onClick={() => setIsActionsModalOpen(true)}
                className="text-[#FF4000] text-xs font-medium hover:text-[#E63900] transition-colors cursor-pointer"
              >
                See All
              </button>
            </div>

            {/* Action Items */}
            <div className="space-y-4">
              {/* Access Request */}
              <div className="pb-4 border-b border-light-gray last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-black">Access Request</h4>
                  <span className="text-xs text-gray whitespace-nowrap ml-2">10:12 AM</span>
                </div>
                <p className="text-xs text-gray mb-2">Jane Smith requested access to Event: Tech Expo</p>
                <button className="px-3 py-1 border border-[#FF4000] text-[#FF4000] text-xs font-medium rounded-lg hover:bg-[#FF4000] hover:text-white transition-colors cursor-pointer">
                  Review Request
                </button>
              </div>

              {/* New Task Assigned */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-black">New Task Assigned</h4>
                  <span className="text-xs text-gray whitespace-nowrap ml-2">10:12 AM</span>
                </div>
                <p className="text-xs text-gray mb-2">Jessica Lee assigned a task to you: Update VIP Seating Chart</p>
                <button className="px-3 py-1 border border-[#FF4000] text-[#FF4000] text-xs font-medium rounded-lg hover:bg-[#FF4000] hover:text-white transition-colors cursor-pointer">
                  View Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Modal */}
      {isActivitiesModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsActivitiesModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-light-gray">
              <h2 className="text-xl font-bold text-black">All Activities</h2>
              <button 
                onClick={() => setIsActivitiesModalOpen(false)}
                className="text-gray hover:text-black transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-light-gray last:border-0 last:pb-0">
                    {/* Organizer Photo */}
                    <img 
                      src={activity.organizerPhoto} 
                      alt={activity.organizerName}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    
                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-black">
                        <span className="font-bold">{activity.organizerName}</span>
                        {' '}{activity.action}{' '}
                        <span className="font-bold">{activity.eventName}</span>
                      </p>
                      <p className="text-xs text-gray mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Important Alerts Modal */}
      {isAlertsModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsAlertsModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-light-gray">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF4000] rounded-full"></div>
                <h2 className="text-xl font-bold text-black">Important Alerts</h2>
                <span className="px-2 py-0.5 bg-black text-white text-xs font-medium rounded-full">5 New</span>
              </div>
              <button 
                onClick={() => setIsAlertsModalOpen(false)}
                className="text-gray hover:text-black transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
              <div className="space-y-4">
                {/* Vendor Coordination Meeting */}
                <div className="pb-4 border-b border-light-gray">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-black">Vendor Coordination Meeting</h4>
                    <span className="text-xs text-gray whitespace-nowrap ml-2">in 30 min</span>
                  </div>
                  <p className="text-xs text-gray mb-2">You have a meeting at 11:00 AM – Vendor Coordination Call</p>
                  <button className="px-3 py-1 border border-[#FF4000] text-[#FF4000] text-xs font-medium rounded-lg hover:bg-[#FF4000] hover:text-white transition-colors cursor-pointer">
                    Join Now
                  </button>
                </div>

                {/* Reminder: Ticket Launch */}
                <div className="pb-4 border-b border-light-gray">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-black">Reminder: Ticket Launch</h4>
                    <span className="text-xs text-gray whitespace-nowrap ml-2">in 1 hr</span>
                  </div>
                  <p className="text-xs text-gray mb-2">Early Bird Phase begins at 12:00 PM*</p>
                  <button className="px-3 py-1 border border-[#FF4000] text-[#FF4000] text-xs font-medium rounded-lg hover:bg-[#FF4000] hover:text-white transition-colors cursor-pointer">
                    Retry Now
                  </button>
                </div>

                {/* Payment Issue */}
                <div className="pb-4 border-b border-light-gray">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-black">Payment Issue</h4>
                    <span className="text-xs text-gray whitespace-nowrap ml-2">2 hrs ago</span>
                  </div>
                  <p className="text-xs text-gray mb-2">Payment gateway error detected for Event: Music Festival</p>
                  <button className="px-3 py-1 border border-[#FF4000] text-[#FF4000] text-xs font-medium rounded-lg hover:bg-[#FF4000] hover:text-white transition-colors cursor-pointer">
                    Resolve Issue
                  </button>
                </div>

                {/* Capacity Warning */}
                <div className="pb-4 border-b border-light-gray">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-black">Capacity Warning</h4>
                    <span className="text-xs text-gray whitespace-nowrap ml-2">3 hrs ago</span>
                  </div>
                  <p className="text-xs text-gray mb-2">Tech Summit 2025 is at 95% capacity</p>
                  <button className="px-3 py-1 border border-[#FF4000] text-[#FF4000] text-xs font-medium rounded-lg hover:bg-[#FF4000] hover:text-white transition-colors cursor-pointer">
                    View Details
                  </button>
                </div>

                {/* System Maintenance */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-black">System Maintenance</h4>
                    <span className="text-xs text-gray whitespace-nowrap ml-2">Yesterday</span>
                  </div>
                  <p className="text-xs text-gray mb-2">Scheduled maintenance on Jan 20, 2026 from 2:00 AM to 4:00 AM</p>
                  <button className="px-3 py-1 border border-[#FF4000] text-[#FF4000] text-xs font-medium rounded-lg hover:bg-[#FF4000] hover:text-white transition-colors cursor-pointer">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Required Modal */}
      {isActionsModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsActionsModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-light-gray">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FBBC04] rounded-full"></div>
                <h2 className="text-xl font-bold text-black">Action Required</h2>
                <span className="px-2 py-0.5 bg-black text-white text-xs font-medium rounded-full">3 New</span>
              </div>
              <button 
                onClick={() => setIsActionsModalOpen(false)}
                className="text-gray hover:text-black transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
              <div className="space-y-4">
                {/* Access Request */}
                <div className="pb-4 border-b border-light-gray">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-black">Access Request</h4>
                    <span className="text-xs text-gray whitespace-nowrap ml-2">10:12 AM</span>
                  </div>
                  <p className="text-xs text-gray mb-2">Jane Smith requested access to Event: Tech Expo</p>
                  <button className="px-3 py-1 border border-[#FF4000] text-[#FF4000] text-xs font-medium rounded-lg hover:bg-[#FF4000] hover:text-white transition-colors cursor-pointer">
                    Review Request
                  </button>
                </div>

                {/* New Task Assigned */}
                <div className="pb-4 border-b border-light-gray">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-black">New Task Assigned</h4>
                    <span className="text-xs text-gray whitespace-nowrap ml-2">10:12 AM</span>
                  </div>
                  <p className="text-xs text-gray mb-2">Jessica Lee assigned a task to you: Update VIP Seating Chart</p>
                  <button className="px-3 py-1 border border-[#FF4000] text-[#FF4000] text-xs font-medium rounded-lg hover:bg-[#FF4000] hover:text-white transition-colors cursor-pointer">
                    View Task
                  </button>
                </div>

                {/* Approval Needed */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-black">Approval Needed</h4>
                    <span className="text-xs text-gray whitespace-nowrap ml-2">Yesterday</span>
                  </div>
                  <p className="text-xs text-gray mb-2">Marketing materials for Art Exhibition require your approval</p>
                  <button className="px-3 py-1 border border-[#FF4000] text-[#FF4000] text-xs font-medium rounded-lg hover:bg-[#FF4000] hover:text-white transition-colors cursor-pointer">
                    Review & Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
