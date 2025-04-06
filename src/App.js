import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { toast, ToastContainer, Zoom } from 'react-toastify';

function App() {
  const API_URL = 'https://api.unsplash.com/search/photos';
  const IMAGES_PER_PAGE = 30;

  let [search,setSearch] = useState('')
  let [imageData,setImageData] = useState([])
  let [page,setPage] = useState(1)
  let [totalPages,setTotalPages] = useState(0)

  const fetchData = useCallback(()=>{
    fetch( `${API_URL}?query=${search}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${process.env.REACT_APP_API_KEY}`)
    .then((res)=>res.json())
    .then((finalRes)=>{
      setImageData(finalRes.results)
      setTotalPages(finalRes.total_pages)
    })
  }, [API_URL, IMAGES_PER_PAGE, page, search]
)

  function functionToFetch(event){
    setImageData([])
    setTotalPages(0)
    setPage(1)
    event.preventDefault();
    if (search !== "") {
      fetchData();
    }
    else{
      toast.error('Enter something to search')
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && (page > 1 || search !== '')) {
      setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
    if (search !== "" && page > 0) {
      fetchData();
    }
  }, [page, search, fetchData]);

  return (
    <div className="container">
      <header className="header">
        <h1>Image Search</h1>
        <form onSubmit={functionToFetch} className="search-box">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search images..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </header>

      {imageData.length > 0 ? (
        <>
          <div className="image-grid">
            {imageData.map((v, i) => (
              <div className="image-item" key={i}>
                <img 
                  src={v.urls.regular} 
                  alt={v.alt_description || 'Unsplash image'}
                />
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>
            <button
              className="pagination-button"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="no-results">
          {search ? 'No images found' : 'Enter a search term to begin'}
        </div>
      )}
      <ToastContainer
        position="top-left"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
    </div>
  );
  
}

export default App;
