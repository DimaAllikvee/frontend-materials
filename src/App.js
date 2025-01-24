import './CSS/App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
    const [products, setProducts] = useState([]);
    const [parcelMachine, setParcelMachine] = useState([]);
    const [nordPoolPrices, setNordPoolPrices] = useState({});
    const [selectedCountry, setSelectedCountry] = useState("ee");
    const idRef = useRef();
    const nameRef = useRef();
    const priceRef = useRef();
    const activeRef = useRef();

    useEffect(() => {
        fetch("http://localhost:8080/parcel-machine")
            .then((res) => res.json())
            .then((json) => setParcelMachine(json))
            .catch((error) => console.error("Error fetching parcel machines:", error));
    }, []);

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

    // Обработчик изменения страны
    function handleCountryChange(event) {
        setSelectedCountry(event.target.value); // Устанавливаем выбранную страну
    }

    // Форматирование timestamp в читабельный формат
    const formatTimestamp = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

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

            <h3>Products:</h3>
            <label>ID</label> <br />
            <input ref={idRef} type="number" /> <br />

            <label>Name</label> <br />
            <input ref={nameRef} type="text" /> <br />

            <label>Price</label> <br />
            <input ref={priceRef} type="number" /> <br />

            <label>Active</label> <br />
            <input ref={activeRef} type="checkbox" /> <br />

            <button onClick={addProduct}>Add</button>

            <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product, index) => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>
                            <button onClick={() => removeProduct(index)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>Parcel Machines:</h3>
            <select>
                {parcelMachine.map((machine, index) => (
                    <option key={index}>{machine.NAME}</option>
                ))}
            </select>
        </div>
    );
}

export default App;
