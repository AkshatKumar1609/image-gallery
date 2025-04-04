import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const API_URL = 'https://api.unsplash.com/search/photos';
  const IMAGES_PER_PAGE = 30;

  let [search,setSearch] = useState('')
  let [imageData,setImageData] = useState([])
  let [page,setPage] = useState(1)
  let [totalPages,setTotalPages] = useState(0)

  function fetchData(){
    fetch( `${API_URL}?query=${search}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${process.env.REACT_APP_API_KEY}`)
    .then((res)=>res.json())
    .then((finalRes)=>{
      setImageData(finalRes.results)
      setTotalPages(finalRes.total_pages)
    })
  }

  function functionToFetch(event){
    setImageData([])
    setTotalPages(0)
    setPage(1)
    event.preventDefault();
    fetchData()
  }

  useEffect(()=>{
    if (search) {
      fetchData();
    }
  },[page])

  return (
    <>
      <h1>Image Gallery</h1>
      <form onSubmit={(event)=>functionToFetch(event)}>
        <input type='text' value={search} onChange={(event)=>setSearch(event.target.value)}/>
        <button type='submit'>Search</button>
      </form>
      {
        (imageData)?
        <div>
        {
          imageData.map((v,i)=>{
            return(
              <img src={v.urls.full} style={{height:`100px`}} alt={v.alt_description} key={i}/>
            )
          })
        }
      </div>
      :
      "No"
      }
      <div>
        {page > 1 && <button onClick={() => setPage(page-1)}>p</button>}
        {page < totalPages && <button onClick={() => setPage(page+1)}>n</button>}
      </div>
    </>
  );
}

export default App;
