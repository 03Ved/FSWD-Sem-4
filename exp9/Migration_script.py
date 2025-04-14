def transform_data(mongo_record):
    """Transform MongoDB document to PostgreSQL record format"""
    # Handle the array of authors by converting to a comma-separated string
    authors = ", ".join(mongo_record.get("bookAuthors", []))

    return {
        "book_id": mongo_record.get("bookId", ""),
        "book_name": mongo_record.get("bookName", ""),
        "book_category": mongo_record.get("bookCategory", ""),
        "book_authors": authors,
        "isbn_number": mongo_record.get("isbnNumber", ""),
        "edition_number": mongo_record.get("editionNumber", 1),
        "year_of_publication": mongo_record.get("yearOfPublication", 0)
    }


def migrate_books():
    books_collection = mongo_db["books"]
    books = books_collection.find()

    # First, ensure we have the right PostgreSQL table structure
    create_table_query = """
    CREATE TABLE IF NOT EXISTS books (
        book_id VARCHAR(255) PRIMARY KEY,
        book_name VARCHAR(255) NOT NULL,
        book_category VARCHAR(255) NOT NULL,
        book_authors TEXT NOT NULL,
        isbn_number VARCHAR(255) UNIQUE NOT NULL,
        edition_number INTEGER NOT NULL,
        year_of_publication INTEGER NOT NULL
    );
    """

    try:
        pg_cursor.execute(create_table_query)
        pg_conn.commit()
    except Exception as e:
        print(f"Error creating table: {e}")
        return

    # Migrate data
    for book in books:
        transformed_data = transform_data(book)

        query = """
        INSERT INTO books (
            book_id, book_name, book_category, book_authors, isbn_number,
            edition_number, year_of_publication
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (book_id) DO UPDATE SET
            book_name = EXCLUDED.book_name,
            book_category = EXCLUDED.book_category,
            book_authors = EXCLUDED.book_authors,
            isbn_number = EXCLUDED.isbn_number,
            edition_number = EXCLUDED.edition_number,
            year_of_publication = EXCLUDED.year_of_publication;
        """

        try:
            pg_cursor.execute(query, (
                transformed_data["book_id"],
                transformed_data["book_name"],
                transformed_data["book_category"],
                transformed_data["book_authors"],
                transformed_data["isbn_number"],
                transformed_data["edition_number"],
                transformed_data["year_of_publication"]
            ))
        except Exception as e:
            print(f"Error inserting record for book {transformed_data['book_id']}: {e}")

    # Commit after all records are processed
    pg_conn.commit()
    print("Book migration completed successfully.")


# Run the Migration
if __name__ == "__main__":
    migrate_books()
    pg_cursor.close()
    pg_conn.close()
    client.close()
