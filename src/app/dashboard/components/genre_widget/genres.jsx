export default function Genres() {
  const [genres, setGenres] = useState(GENRES);

  useEffect(() => {
    const fetchGenres = async () => {
      const token = getAccessToken("spotify_token");
      const res = await fetch(
        "https://api.spotify.com/v1/recommendations/available-genre-seeds",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setGenres(data.genres.map((g) => ({ id: g, label: g })));
    };
    fetchGenres();
  }, []);
  return console.log(genres);
}
