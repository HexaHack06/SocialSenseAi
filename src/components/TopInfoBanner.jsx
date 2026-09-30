import { Info } from 'lucide-react';

/**
 * TopInfoBanner
 * Global information tagline displayed at the very top of all pages.
 * Informs judges & evaluators about historical dataset testing mode vs paid real-time APIs.
 */
export default function TopInfoBanner() {
  return (
    <aside className="top-info-banner" aria-label="System Notice" role="status">
      <div className="top-info-banner-content">
        <span className="top-info-banner-pulse" aria-hidden="true" />
        <Info size={13} className="top-info-banner-icon" aria-hidden="true" />
        <span className="top-info-banner-text">
          Currently using historical data for testing. Real-time data tracking requires paid API access.
        </span>
      </div>
    </aside>
  );
}
