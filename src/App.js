import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import "./App.css";

function App() {
  const [authorFirstName, setAuthorFirstName] = useState("");
  const [authorLastName, setAuthorLastName] = useState("");

  const GET_AUTHORS_WITH_BOOKS_QUERY = gql`
    query {
      authors {
        id
        firstName
        lastName
        books {
          id
          title
        }
      }
    }
  `;

  const ADD_AUTHOR_MUTATION = gql`
    mutation CreateAuthor($firstName: String!, $lastName: String!) {
      createAuthor(
        firstName: $firstName
        lastName: $lastName
      ) {
        id
      }
    }
  `;

  const { data, loading, error, refetch } = useQuery(GET_AUTHORS_WITH_BOOKS_QUERY);

  const [addAuthor] = useMutation(ADD_AUTHOR_MUTATION);

  const handleSubmitForm = (e) => {
    e.preventDefault();

    addAuthor({
      variables: {
        firstName: authorFirstName,
        lastName: authorLastName,
      },
    });

    refetch();
  };

  return (
    <div className="App">
      <div className="authors-container">
        {loading ? (
          <p>Loading Authors...</p>
        ) : error ? (
          <p>There was an issue loading the data...</p>
        ) : (
          data?.authors.map((author) => (
            <div className="user-record" key={author.id}>
              <p>Author: {author.firstName + " " + author.lastName}</p>
              <div className="author-books-container">
                {author?.books?.length && <h3>Books Written:</h3>}
                {author?.books?.map((book) => (
                  <div className="author-book-record">
                    <p>Book Title: {book.title}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="add-author-container">
        <form onSubmit={(e) => handleSubmitForm(e)}>
          <input
            type="text"
            value={authorFirstName}
            onChange={(e) => setAuthorFirstName(e.target.value)}
          />
          <input
            type="text"
            value={authorLastName}
            onChange={(e) => setAuthorLastName(e.target.value)}
          />
          <button type="submit">Add Author</button>
        </form>
      </div>
    </div>
  );
}

export default App;
