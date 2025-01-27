import './CSS/App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
    // ---------- PRODUCTS ----------
    const [products, setProducts] = useState([]);
    const idRef = useRef();
    const nameRef = useRef();
    const priceRef = useRef();
    const activeRef = useRef();

    // ---------- BOOKS ----------
    const [books, setBooks] = useState([]);
    const titleRef = useRef();
    const contentRef = useRef();

    // Пример для других данных (parcelMachine, nordPoolPrices):
    const [parcelMachine, setParcelMachine] = useState([]);
    const [nordPoolPrices, setNordPoolPrices] = useState({});
    const [selectedCountry, setSelectedCountry] = useState("ee");

    // ---------------------
    // 1. Загрузка Products
    // ---------------------
    useEffect(() => {
        // Предположим, что получение списка продуктов идёт по URL: GET http://localhost:8080/products
        // Если у вас в контроллере стоит @GetMapping без аргументов → это '/', нужно тогда заменить.
        fetch("http://localhost:8080/products")
            .then((res) => res.json())
            .then((json) => setProducts(json))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    // ---------------------
    // 2. Загрузка Books
    // ---------------------
    useEffect(() => {
        // Предположим, вы измените BookController: @GetMapping("books") => GET /books
        // Тогда здесь будет fetch("http://localhost:8080/books")
        fetch("http://localhost:8080/")
            .then((res) => res.json())
            .then((data) => setBooks(data))
            .catch((error) => console.error("Error fetching books:", error));
    }, []);

    // ---------------------
    // 3. Пример загрузки parcel-machine
    // ---------------------
    useEffect(() => {
        fetch("http://localhost:8080/parcel-machine")
            .then((res) => res.json())
            .then((json) => setParcelMachine(json))
            .catch((error) => console.error("Error fetching parcel machines:", error));
    }, []);

    // ---------------------
    // 4. Пример загрузки NordPool
    // ---------------------
    useEffect(() => {
        fetch("http://localhost:8080/nord-pool-price")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setNordPoolPrices(data.data);
            })
            .catch((error) => console.error("Fetch error:", error));
    }, []);

    // ----------------------
    // Форматирование timestamp (пример)
    // ----------------------
    function handleCountryChange(event) {
        setSelectedCountry(event.target.value);
    }

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    // ---------------------
    // Функции для PRODUCTS
    // ---------------------
    function removeProduct(index) {
        fetch("http://localhost:8080/remove-product/" + index, { method: "DELETE" })
            .then((res) => res.json())
            .then((json) => setProducts(json))
            .catch((error) => console.error("Error deleting product:", error));
    }

    function addProduct() {
        const newProduct = {
            id: Number(idRef.current.value),
            name: nameRef.current.value,
            price: Number(priceRef.current.value),
            active: activeRef.current.checked,
        };

        fetch("http://localhost:8080/add-product", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct),
        })
            .then((res) => res.json())
            .then((json) => setProducts(json))
            .catch((error) => console.error("Error adding product:", error));
    }

    // ---------------------
    // Функции для BOOKS
    // ---------------------
    function addBook() {
        const newBook = {
            title: titleRef.current.value,
            content: contentRef.current.value

        };


        fetch("http://localhost:8080/add-book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBook),
        })
            .then((res) => res.json())
            .then((updatedList) => {
                setBooks(updatedList);
            })
            .catch((error) => console.error("Error adding book:", error));
    }

    function deleteBook(id) {
        // По аналогии: @DeleteMapping("delete-book/{id}") => DELETE /delete-book/1
        fetch("http://localhost:8080/delete-book/" + id, {
            method: "DELETE"
        })
            .then((res) => res.json())
            .then((updatedList) => setBooks(updatedList))
            .catch((error) => console.error("Error deleting book:", error));
    }


    // ---------------------
    // (UI)
    // ---------------------
    return (

        <div className="App">


            <h1>Nord Pool Price Viewer</h1>

            <h3>Select Country:</h3>
            <select value={selectedCountry} onChange={handleCountryChange}>
                <option value="ee">Estonia (EE)</option>
                <option value="fi">Finland (FI)</option>
                <option value="lv">Latvia (LV)</option>
                <option value="lt">Lithuania (LT)</option>
            </select>

            <h3>Nord Pool Prices:</h3>
            {nordPoolPrices[selectedCountry] ? (
                <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Price (EUR)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {nordPoolPrices[selectedCountry].map((price, index) => (
                        <tr key={index}>
                            <td>{formatTimestamp(price.timestamp)}</td>
                            <td>{price.price}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available for {selectedCountry.toUpperCase()}.</p>
            )}

            {/* -------------- PRODUCTS -------------- */}
            <h3>Products:</h3>
            <label>ID</label> <br />
            <input ref={idRef} type="number" /> <br />

            <label>Name</label> <br />
            <input ref={nameRef} type="text" /> <br />

            <label>Price</label> <br />
            <input ref={priceRef} type="number" /> <br />

            <label>Active</label> <br />
            <input ref={activeRef} type="checkbox" /> <br />

            <button onClick={addProduct}>Add Product</button>

            <table
                border="1"
                cellPadding="10"
                style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}
            >
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Active</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product, index) => (
                    <tr key={product.id + "-" + index}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.active ? "YES" : "NO"}</td>
                        <td>
                            <button onClick={() => removeProduct(index)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>


            {/* -------------- BOOKS -------------- */}
            <h3>Books:</h3>
            <label>Title</label> <br />
            <input ref={titleRef} type="text" /> <br />

            <label>Content</label> <br />
            <input ref={contentRef} type="text" /> <br />

            <button onClick={addBook}>Add Book</button>

            <table
                border="1"
                cellPadding="10"
                style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}
            >
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {books.map((book) => (
                    <tr key={book.id}>
                        <td>{book.id}</td>
                        <td>{book.title}</td>
                        <td>{book.content}</td>
                        <td>
                            <button onClick={() => deleteBook(book.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>




        </div>

    );
}


export default App;
