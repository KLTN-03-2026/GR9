import React from 'react';
import TourHeroCard from './TourHeroCard';
import CurrentLocationMap from './CurrentLocationMap';
import LatestUpdateBanner from './LatestUpdateBanner';
import ActivityTimeline from './ActivityTimeline';
import EmergencySupport from './EmergencySupport';

const PublicTourTracking = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-12">
      <main className="pt-24 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 flex flex-col gap-8">
          <TourHeroCard />
          <CurrentLocationMap />
          <LatestUpdateBanner />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <ActivityTimeline />
          <EmergencySupport />
        </div>
        
      </main>
    </div>
  );
};

export default PublicTourTracking;