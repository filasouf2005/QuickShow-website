import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import { dateFormat } from "../lib/dateFormat";
import { useAppContext } from "../context/appContext";
import { Link } from "react-router-dom";

interface Booking {
  _id: string;
  user: { name: string };
  show: {
    _id: string;
    movie: {
      _id: string;
      id: number;
      title: string;
      overview: string;
      poster_path: string;
      backdrop_path: string;
      genres: { id: number; name: string }[];
      casts: { name: string; profile_path: string }[];
      release_date: string;
      original_language: string;
      tagline: string;
      vote_average: number;
      vote_count: number;
      runtime: number;
    };
    showDateTime: string;
    showPrice: number;
  };
  amount: number;
  bookedSeats: string[];
  isPaid: boolean;
  paymentLink: string;
}

const MyBooking = () => {
  const { user, axios, getToken, image_base_url } = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/user/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log("Error : ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) getMyBookings();
  }, [user]);

  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0" left="600px" />
      </div>
      <h1 className="text-lg font-semibold mb-4">My Bookings</h1>

      {bookings.map((item, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20  rounded-lg mt-4 p-2 max-w-3xl "
        >
          <div className="flex flex-col md:flex-row ">
            <img
              src={image_base_url + item.show.movie.poster_path}
              alt={item.show.movie.title}
              className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
            />
            <div className="flex flex-col p-4">
              <p className="font-semibold text-lg">{item.show.movie.title}</p>
              <p className="text-gray-400 text-sm">
                {timeFormat(item.show.movie.runtime)}
              </p>
              <p className="text-gray-400 text-sm mt-auto">
                {dateFormat(item.show.showDateTime)}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:items-end md:text-right justify-between p-4">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold mb-3">
                {currency}
                {item.amount}
              </p>
              {!item.isPaid && (
                <Link
                  to={item.paymentLink}
                  className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer"
                >
                  Pay Now
                </Link>
              )}
            </div>
            <div className="text-sm">
              <p>
                <span className="text-gray-400">Total Tickets : </span>
                {item.bookedSeats.length}
              </p>
              <p>
                <span className="text-gray-400">Seats Number : </span>
                {item.bookedSeats.join(", ")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <Loading />
  );
};

export default MyBooking;
