import React, { useState, useEffect, useMemo } from 'react';
import { getAllHearings, getCaseFromHearing } from '../../../../api'; 
import { Calendar, Loader2 } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { format, isToday, parseISO, isAfter, startOfToday } from 'date-fns';
import './dashboard.css';

// Custom SVG Icon Component (Unchanged)
const TSGoToIcon = ({ uniqueId, 'aria-label': ariaLabel }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="40" 
    height="40" 
    viewBox="0 0 40 40" 
    fill="none" 
    className="ts-go-to-icon"
    aria-label={ariaLabel}
  >
    <g clipPath={`url(#clip0_ts_icon_${uniqueId})`}>
      <path d="M19.9092 39.9371C30.5962 39.9371 39.2598 31.2146 39.2598 20.4549C39.2598 9.69515 30.5962 0.972656 19.9092 0.972656C9.22215 0.972656 0.558594 9.69515 0.558594 20.4549C0.558594 31.2146 9.22215 39.9371 19.9092 39.9371Z" />
      <mask id={`mask0_ts_icon_${uniqueId}`} style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="13" y="14" width="14" height="13">
        <path d="M26.2219 26.8105H13.5947V14.0974H26.2219V26.8105Z" fill="white"/>
      </mask>
      <g mask={`url(#mask0_ts_icon_${uniqueId})`}>
        <path d="M14.4717 25.9299C14.8232 26.2839 15.3932 26.2839 15.7447 25.9299L25.9468 15.6585C26.2984 15.3045 26.2984 14.7307 25.9468 14.3768C25.5953 14.0228 25.0253 14.0228 24.6737 14.3768L14.4717 24.6482C14.1201 25.0021 14.1201 25.576 14.4717 25.9299Z" fill="white"/>
        <path d="M25.3098 26.7987C25.8069 26.7987 26.2099 26.3929 26.2099 25.8924V15.0167C26.2099 14.5161 25.8069 14.1104 25.3098 14.1104H14.5075C14.0104 14.5161 13.6074 14.0104 13.6074 15.0167C13.6074 15.5173 14.0104 15.923 14.5075 15.923H24.4096V25.8924C24.4096 26.3929 24.8125 26.7987 25.3098 26.7987Z" fill="white"/>
      </g>
    </g>
    <defs>
      <clipPath id={`clip0_ts_icon_${uniqueId}`}>
        <rect width="40" height="40" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navigatingId, setNavigatingId] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const hearingsData = await getAllHearings();

        if (!hearingsData || hearingsData.length === 0) {
          setHearings([]);
          return;
        }

        const validationPromises = hearingsData.map(async (hearing) => {
          try {
            const caseDataRaw = await getCaseFromHearing(hearing.case_id);
            const caseDetails = Array.isArray(caseDataRaw) ? caseDataRaw[0] : caseDataRaw;

            if (caseDetails && caseDetails.case_number) {
              return { ...hearing, case_number: caseDetails.case_number };
            }
            return null;
          } catch {
            return null;
          }
        });

        const results = await Promise.all(validationPromises);
        const validHearings = results.filter(h => h !== null);
        
        setHearings(validHearings);

      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const upcomingHearings = useMemo(() => {
    if (!hearings) return [];
    const today = startOfToday();
    return hearings.filter(h => {
      const hDate = parseISO(h.hearing_date);
      return isAfter(hDate, today) || isToday(hDate);
    });
  }, [hearings]);

  const handleNavigate = async (e, hearing) => {
    e.stopPropagation();
    
    if (hearing.case_number) {
      navigate(`/case-management/case/${hearing.case_number}`);
      return;
    }

    try {
      setNavigatingId(hearing.id);
      const caseDataRaw = await getCaseFromHearing(hearing.case_id);
      let caseData = Array.isArray(caseDataRaw) ? caseDataRaw[0] : caseDataRaw;

      if (caseData && caseData.case_number) {
        navigate(`/case-management/case/${caseData.case_number}`);
      } else {
        alert("Could not retrieve Case Number from server.");
      }
    } catch (error) {
      console.error("Navigation failed:", error);
      alert("Error fetching case details.");
    } finally {
      setNavigatingId(null);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return 'status-pending';
    
    switch (status.toLowerCase()) {
      case 'scheduled':
      case 'open':
        return 'status-scheduled';
      case 'ongoing':
        return 'status-ongoing';
      case 'judgment':
        return 'status-judgment';
      case 'completed':
        return 'status-completed';
      case 'closed':
        return 'status-closed';
      case 'cancelled':
      case 'adjourned':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  if (loading) return <div className="p-8">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="welcome-title">Welcome back, Counsel.</h1>
          <p className="welcome-subtitle">Here is your schedule overview.</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Calendar size={18} />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="stat-text-label">Upcoming Hearings:</p>
            <p className="stat-text-value">{upcomingHearings.length}</p>
          </div>
        </div>
      </div>
      <div className="schedule-container">
        <div className="table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Case No.</th> 
                <th className="py-4 px-6 w-1/3">Description</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {upcomingHearings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No upcoming hearings found.
                  </td>
                </tr>
              ) : (
                upcomingHearings.map((hearing) => {
                  const hearingDate = parseISO(hearing.hearing_date);
                  const isTodayHearing = isToday(hearingDate);

                  return (
                    <tr 
                      key={hearing.id} 
                      className={isTodayHearing ? 'today-highlight' : ''}
                    >
                      {/* Added data-label attributes for Mobile CSS */}
                      <td className="py-4 px-6 whitespace-nowrap" data-label="Date">
                        <div className="date-cell">
                          <span className={`date-text ${isTodayHearing ? 'is-today' : ''}`}>
                            {format(hearingDate, 'MMM dd, yyyy')}
                          </span>
                          {isTodayHearing && (
                            <span className="today-badge">Today</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 case-number-cell" data-label="Case No.">
                        {hearing.case_number || <span className="unknown-case">Unknown Case</span>}
                      </td>
                      <td className="py-4 px-6 description-cell" data-label="Description">
                        {hearing.description}
                      </td>
                      <td className="py-4 px-6" data-label="Status">
                        <span className={`status-badge ${getStatusClass(hearing.status)}`}>
                       {hearing.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center" data-label="Action">
                        <button 
                          onClick={(e) => handleNavigate(e, hearing)}
                          disabled={navigatingId === hearing.id}
                          className="action-btn-custom" 
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto' // Centered by default
                          }}
                          title="Go to Case"
                        >
                          {navigatingId === hearing.id ? (
                            <Loader2 size={18} className="loading-spinner"/>
                          ) : (
                            <TSGoToIcon uniqueId={hearing.id} aria-label="Go to Case" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;