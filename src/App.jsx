import { useState, useEffect } from 'react'
import Search from './components/Search'
import Loading from './components/Loading'
import Card from './components/Card'
import { useDebounce } from 'react-use'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (page) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`,
        API_OPTIONS
      )
      if (response.ok) {
        const data = await response.json()
        setMovies((prevMovies) => [...prevMovies, ...data.results])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const searchMovies = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${API_BASE_URL}/search/movie?query=${encodeURIComponent(searchTerm)}`,
        API_OPTIONS
      )
      if (response.ok) {
        const data = await response.json()
        setMovies(data.results)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchMovies()
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    fetchMovies(page)
  }, [page])

  const loadMoreMovies = () => {
    setPage((prevPage) => prevPage + 1)
  }

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero' />
          <h1>
            Find <span className='text-gradient'>Movies</span> You Will Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className='all-movies'>
          <h2 className='mt-5'>All Movies</h2>

          {isLoading ? (
            <Loading />
          ) : (
            <ul>
              {movies?.map((movie) => (
                <Card movie={movie} key={movie.id} />
              ))}
            </ul>
          )}
          <div className='movie-card flex justify-center'>
            <button onClick={loadMoreMovies} disabled={isLoading}>
              <p className='text-white'>Load More</p>
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
