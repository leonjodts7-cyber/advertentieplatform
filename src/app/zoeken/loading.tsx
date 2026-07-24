export default function ZoekenLoading() {
  return (
    <div className="search-page search-page--v2">
      <div className="search-page-top search-page-top--hero">
        <div className="container">
          <div className="page-loading-skeleton page-loading-skeleton--title" />
          <div className="page-loading-skeleton page-loading-skeleton--subtitle" />
        </div>
      </div>
      <div className="container search-page__body">
        <div className="zoek-mobile-filter-bar zoek-mobile-filter-bar--skeleton" aria-hidden>
          <span className="page-loading-skeleton page-loading-skeleton--title" />
        </div>
        <div className="page-loading-skeleton page-loading-skeleton--grid" />
      </div>
    </div>
  );
}
