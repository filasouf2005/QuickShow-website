
import { dummyShowsData } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import MovieCard from '../components/MovieCard'
const Movies = () => {
    return dummyShowsData.length > 0 ? (
        <div className='relative my-40 mb-60 px-6  md:px-16 lg:px-24 xl:px-44 overflow-hidden min-h-[88vh]'>
            <BlurCircle top='150px' left='0px' />
            <BlurCircle bottom='50px' right='50px' />
            <h1 className='text-lg font-medium my-4'>Now Showing</h1>
            <div className='flex flex-wrap max-sm:justify-center gap-8 '>
                {dummyShowsData.map((show) => (
                    <MovieCard movie={show} key={show.id} />
                ))}
            </div>
        </div>
    ) : (
        <div className='flex items-center justify-center h-screen'>
            <h2 className='text-3xl font-bold text-center'>No Movies Available</h2>
        </div>
    )
}

export default Movies