import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  async function fetchData(pageNum) {
    setLoading(true)
    try {
      const response = await axios.get(`https://picsum.photos/v2/list?page=${pageNum}&limit=12`)
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(page)
  }, [page])

  function previousPage() {
    if (page > 1) {
      setPage(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function nextPage() {
    setPage(prev => prev + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Filter photos by author search
  const filteredData = data.filter(item =>
    item.author.toLowerCase().includes(search.toLowerCase())
  )

  // Dashboard calculations
  const uniqueAuthors = new Set(data.map(item => item.author)).size

  return (
    <div className='app-container'>
      {/* Dashboard Top Header */}
      <header className='dashboard-header'>
        <div className='header-top'>
          <div className='brand'>
            <h1>Gallery Dashboard</h1>
            <p>Curated photography collection</p>
          </div>

          <div className='search-box'>
            <input
              type='text'
              placeholder='Search photographer...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='search-input'
            />
            {search && (
              <button className='clear-btn' onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>

        {/* Dashboard Metric Cards */}
        <div className='dashboard-stats'>
          <div className='stat-card'>
            <span className='stat-title'>Current Page</span>
            <span className='stat-num'>#{page}</span>
          </div>
          <div className='stat-card'>
            <span className='stat-title'>Photos Displayed</span>
            <span className='stat-num'>{filteredData.length}</span>
          </div>
          <div className='stat-card'>
            <span className='stat-title'>Photographers</span>
            <span className='stat-num'>{uniqueAuthors}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className='main-content'>
        {loading ? (
          <div className='loading-box'>
            <div className='spinner'></div>
            <p>Loading photos...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className='gallery-container'>
            {filteredData.map((item) => (
              <div 
                key={item.id} 
                className='image-card'
                onClick={() => setSelectedImage(item)}
              >
                <div className='img-wrapper'>
                  <img 
                    src={`https://picsum.photos/id/${item.id}/600/400`} 
                    alt={`By ${item.author}`} 
                    loading='lazy'
                  />
                  <div className='img-overlay'>
                    <span>Click to preview</span>
                  </div>
                </div>
                <div className='card-info'>
                  <h3>{item.author}</h3>
                  <div className='card-meta'>
                    <span className='dim-tag'>{item.width} × {item.height}</span>
                    <a 
                      href={item.url} 
                      target='_blank' 
                      rel='noopener noreferrer'
                      onClick={(e) => e.stopPropagation()}
                      className='source-link'
                    >
                      Source ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='no-data'>
            <p>No photos found matching &ldquo;{search}&rdquo;</p>
            <button className='reset-btn' onClick={() => setSearch('')}>Clear Search</button>
          </div>
        )}

        {/* Clean Pagination (Outside the Grid) */}
        <div className='pagination'>
          <button 
            onClick={previousPage} 
            disabled={page <= 1 || loading}
            className='page-btn'
          >
            ← Previous
          </button>
          <span className='page-num'>Page {page}</span>
          <button 
            onClick={nextPage} 
            disabled={loading}
            className='page-btn'
          >
            Next →
          </button>
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className='modal-backdrop' onClick={() => setSelectedImage(null)}>
          <div className='modal-box' onClick={(e) => e.stopPropagation()}>
            <button className='modal-close' onClick={() => setSelectedImage(null)}>✕</button>
            <div className='modal-img-container'>
              <img 
                src={`https://picsum.photos/id/${selectedImage.id}/1200/800`} 
                alt={selectedImage.author} 
              />
            </div>
            <div className='modal-details'>
              <div>
                <h2>{selectedImage.author}</h2>
                <p>Original Resolution: {selectedImage.width} × {selectedImage.height} px</p>
              </div>
              <div className='modal-actions'>
                <a 
                  href={selectedImage.download_url} 
                  target='_blank' 
                  rel='noopener noreferrer'
                  className='btn-download'
                >
                  Download Photo
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
