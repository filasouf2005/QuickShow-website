import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import type { Show, Movie } from "../../lib/Interfaces/DashbordIntrfaces";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/appContext";
const ListShows = () => {
  const { user, axios, getToken } = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY || "$ ";
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
    const getAllShows = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/admin/all-shows`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShows(data.shows);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) getAllShows();
  }, [user]);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead className="bg-primary/20 text-left">
            <tr>
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium ">Show Time</th>
              <th className="p-2 font-medium ">Total Bookings</th>
              <th className="p-2 font-medium ">Earnings</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {shows.map((show, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 "
              >
                <td className="p-2 min-w-45 pl-5 ">{show.movie.title}</td>
                <td className="p-2 ">{dateFormat(show.showDateTime)}</td>
                <td className="p-2 ">
                  {Object.keys(show.occupiedSeats).length}
                </td>
                <td className="p-2 ">
                  {currency}
                  {Object.keys(show.occupiedSeats).length * show.showPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListShows;
