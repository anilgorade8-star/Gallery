import React from 'react'
import './App.css'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'


function App() {

  const [userData, setUserData] = useState(`...Loading`)
  const [index, setIndex] = useState(1)

  async function fetchData() {
    try {
      const response = await axios.get(`https://picsum.photos/v2/list?page=${index}&limit=10`)
      setData(response.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }


  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [index])


  // previous page function
  function previousPage() {
    if (index > 1) {
      setIndex(index - 1)
      setUserData([])
    }
  }

  // next page function
  function nextPage() {
    setIndex(index + 1)
    setUserData([])
  }


  // API data add
  return (
    <div className='app-container'>
      <div className='gallery-container'>

        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className='image-card'>

              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <img src={item.download_url} alt='Photo' />
                <h2>Author: {item.author}</h2>
              </a>
            </div>
          ))
        ) : (
          <p className='no-data'>{userData}</p>
        )}


        {/* Button */}
        <div id='page'>
          <button onClick={previousPage}>previous</button>
          <p>Page:{index}</p>
          <button onClick={nextPage}>next</button>
        </div>

      </div>
    </div >
  )
}

export default App
