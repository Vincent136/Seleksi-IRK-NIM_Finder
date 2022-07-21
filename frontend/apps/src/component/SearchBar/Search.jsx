import { useState, useEffect, useRef } from 'react'
import "./Search.css"
import axios from 'axios'
import nimFinder from "./nimFinder.js"


export default function Search() {
  const [searchList, setSearchList] = useState([]);
  const [count, setCount] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [showLoadingInfo, setLoadingInfo] = useState(false);


  const getResult = (Query) => {
    setShowButton(false);
    setCount(0);
    setSearchList([]);
    setLoadingInfo(true);
    axios.post(`${process.env.REACT_APP_BACKEND_API}/api/result`, {
      Query: Query
    }).then ((response) => {
      setSearchList(response.data);
      setLoadingInfo(false);
    }).catch((err) => {
      console.log(err);
    })
  }

 function handleClick(e) {
    e.preventDefault();
    if (count + 20 >= searchList.length) {
      setShowButton(false);
      setCount(searchList.length);
    } else {
      setCount(count + 20);
    }
  }

  const previousValues = useRef({ searchList, count });

  useEffect(() => {
    if (
      JSON.stringify(previousValues.current.searchList) !== JSON.stringify(searchList)
    ) {
      if (searchList.length >= 20) {
        setCount(20);
        setShowButton(true);
      } else {
        setCount(searchList.length);
      }
    }
    nimFinder("16521012");
  }, [searchList]);


  return (
    <div className="Search">
      <div className="SearchWrapper">
        <div className="Title">
          <div className="leftTitle">
            <h2>Finding NIMo</h2>
            <p>Tidak ada NIM yang tersembunyi...</p>
          </div>
          <div className="rightTitle">
          </div>
        </div>
        <input placeholder="Masukan NIM, Jurusan Tahun, atau Nama" className="searchBar"
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
             getResult(e.target.value)
          }
        }}/>
        <p id="searchInfo">load {count} data of {searchList.length}</p>
        { showLoadingInfo &&<p id="LoadingInfo">loading...</p>}
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
        {
          showButton && <button id="load" onClick={handleClick}>Tampilkan lebih banyak</button>
        }
      </div>

    </div>
  )
}
