import { useState, useEffect, useRef } from 'react'
import "./Search.css"
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import axios from 'axios'


export default function Search() {
  const [searchList, setSearchList] = useState([]);
  const [count, setCount] = useState(0);

  const getResult = (Query) => {
    setCount(0);
    document.getElementById('load').style.visibility = 'visible';
    document.getElementById('LoadingInfo').style.display = 'block';
    setSearchList([])
    axios.post(`${process.env.REACT_APP_BACKEND_API}/api/result`, {
      Query: Query
    }).then ((response) => {
      setSearchList(response.data);
      setCount(20);
      document.getElementById('LoadingInfo').style.display = 'none';
    })
  }

 function handleClick(e) {
    e.preventDefault();
    setCount(count + 20);
  }

  const previousValues = useRef({ searchList, count });

  useEffect(() => { 
    if (
      JSON.stringify(previousValues.current.searchList) !== JSON.stringify(searchList) &&
      previousValues.current.count !== count
    ) {
      if (count >= searchList.length) {
        setCount(searchList.length);
        document.getElementById('load').style.visibility = 'hidden';
      }
    }
  }, [count, searchList]);

  return (
    <div className="Search">
      <div className="SearchWrapper">
        <div className="Title">
          <div className="leftTitle">
            <h2>Finding NIMo</h2>
            <p>Tidak ada NIM yang tersembunyi...</p>
          </div>
          <div className="rightTitle">
            <HelpOutlineIcon/>
          </div>
        </div>
        <input placeholder="Masukan NIM, Jurusan Tahun, atau Nama" className="searchBar"
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
             getResult(e.target.value)
          }
        }}/>
        <p id="searchInfo">load {count} data of {searchList.length}</p>
        <p id="LoadingInfo">loading...</p>
        <div className="searchResults">
        {searchList.slice(0,count).map((val, key) => {
            return (
              <div className="individualResult">
                <div className="left">
                  <p className="big">{val.Nama}</p>
                  <p className="small">{val.Fakultas}</p>
                  <p className="small">{val.Jurusan}</p>
                </div>
                <div className="right">
                  <p className="big">{val.NIM_jurusan}</p>
                  <p className="big">{val.NIM_tpb}</p>
                </div>
              </div>
            )
          })}
        </div>
        <button id="load" onClick={handleClick}>Tampilkan lebih banyak</button>
      </div>

    </div>
  )
}
