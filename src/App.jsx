import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
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

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

  return (
    <div className='app-container'>
      {/* Editorial Exhibition Header */}
      <header className='gallery-header'>
        <div className='header-inner'>
          <div className='brand-section'>
            <div className='brand-tagline'>CURATED VISUAL ARCHIVE</div>
            <h1 className='brand-title'>ATELIER</h1>
          </div>
          <div className='header-meta'>
            <div className='meta-pill'>
              <span>COLLECTION 0{page}</span>
            </div>
            <span className='meta-count'>{data.length} WORKS</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className='main-content'>
        {loading ? (
          <div className='loading-box'>
            <div className='minimal-loader'></div>
            <p className='loading-text'>CURATING COLLECTION...</p>
          </div>
        ) : (
          <div className='gallery-grid'>
            {data.map((item, index) => {
              const photoIndex = String((page - 1) * 12 + index + 1).padStart(3, '0')
              return (
                <article 
                  key={item.id} 
                  className='photo-card'
                  onClick={() => setSelectedImage(item)}
                >
                  <div className='image-frame'>
                    <img 
                      src={`https://picsum.photos/id/${item.id}/700/500`} 
                      alt={`Photograph by ${item.author}`} 
                      loading='lazy'
                    />
                    <div className='frame-overlay'>
                      <span className='preview-prompt'>EXPAND VIEW</span>
                    </div>
                    <span className='index-stamp'>{photoIndex}</span>
                  </div>

                  <div className='card-caption'>
                    <div className='author-details'>
                      <span className='author-label'>ARTIST</span>
                      <h3 className='author-name'>{item.author}</h3>
                    </div>
                    <div className='photo-specs'>
                      <span className='spec-badge'>{item.width} × {item.height}</span>
                      <a 
                        href={item.url} 
                        target='_blank' 
                        rel='noopener noreferrer'
                        onClick={(e) => e.stopPropagation()}
                        className='origin-link'
                        title='View on Unsplash'
                      >
                        Source ↗
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Minimalist Pagination */}
        {!loading && (
          <nav className='pagination-bar' aria-label='Gallery pagination'>
            <button 
              onClick={previousPage} 
              disabled={page <= 1 || loading}
              className='nav-btn prev-btn'
            >
              ← PREVIOUS
            </button>
            <div className='page-indicator'>
              <span className='page-current'>{String(page).padStart(2, '0')}</span>
              <span className='page-divider'>/</span>
              <span className='page-total'>ARCHIVE</span>
            </div>
            <button 
              onClick={nextPage} 
              disabled={loading}
              className='nav-btn next-btn'
            >
              NEXT →
            </button>
          </nav>
        )}
      </main>

      {/* Footer */}
      <footer className='gallery-footer'>
        <p>© ATELIER VISUAL ARCHIVE • POWERED BY LOREM PICSUM</p>
      </footer>

      {/* Lightbox Cinema Modal */}
      {selectedImage && (
        <div 
          className='modal-backdrop' 
          onClick={() => setSelectedImage(null)}
          role='dialog'
          aria-modal='true'
        >
          <div className='modal-stage' onClick={(e) => e.stopPropagation()}>
            <button 
              className='close-btn' 
              onClick={() => setSelectedImage(null)}
              aria-label='Close modal'
            >
              ✕
            </button>
            <div className='modal-photo-wrapper'>
              <img 
                src={`https://picsum.photos/id/${selectedImage.id}/1400/950`} 
                alt={`By ${selectedImage.author}`} 
              />
            </div>
            <div className='modal-info-strip'>
              <div className='modal-artist-info'>
                <span className='modal-tag'>PHOTOGRAPHER</span>
                <h2>{selectedImage.author}</h2>
                <span className='modal-resolution'>{selectedImage.width} × {selectedImage.height} PX • ORIGINAL SPEC</span>
              </div>
              <div className='modal-actions'>
                <a 
                  href={selectedImage.download_url} 
                  target='_blank' 
                  rel='noopener noreferrer'
                  className='download-action-btn'
                >
                  DOWNLOAD ORIGINAL
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
