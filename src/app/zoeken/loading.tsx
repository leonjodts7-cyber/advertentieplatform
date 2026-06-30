export default function ZoekenLoading() {
  return (
    <div className="search-page search-page--compact">
      <div className="search-page-top search-page-top--compact">
        <div className="container">
          <div className="page-loading-skeleton page-loading-skeleton--title" />
          <div className="page-loading-skeleton page-loading-skeleton--subtitle" />
        </div>
      </div>
      <div className="container search-page__body">
        <div className="zoek-filter-bar zoek-filter-bar--skeleton" aria-hidden />
        <div className="page-loading-skeleton page-loading-skeleton--grid" />
      </div>
    </div>
  );
}
