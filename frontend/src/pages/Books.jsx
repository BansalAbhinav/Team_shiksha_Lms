import { useFetchGet } from "../apis/useFetchGet";

function Books() {
    const books = [
      { title: "Introduction to React", author: "Dan Abramov" },
      { title: "JavaScript: The Good Parts", author: "Douglas Crockford" },
      { title: "You Don't Know JS", author: "Kyle Simpson" },
    ];

    const {data, loading, error, fetchData} = useFetchGet(`http://localhost:5000/api/books`);
    console.log("data:", data);
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-indigo-700">Available Books</h2>
        <ul className="space-y-3">
          {books?.map((book, index) => (
            <li
              key={index}
              className="p-4 bg-white shadow-sm rounded-lg hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-gray-600">by {book.author}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default Books;
  