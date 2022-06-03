import "./Search.css"

export default function Search() {
  return (
    <div className="Search">
      <div className="SearchWrapper">
        <div className="Title">
          <div className="leftTitle">
            <h2>Finding NIMo</h2>
            <p>Tidak ada NIM yang tersembunyi...</p>
          </div>
          <div className="rightTitle">
            <button>asda</button>
          </div>
        </div>
        <input placeholder="Search for friend, or anything..." className="searchBar"/>
      </div>
    </div>
  )
}
