import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
    const [products, setProducts] = useState([]);
    const [parcelMachine, setParcelMachine] = useState([]);
    const idRef = useRef();
    const nameRef = useRef();
    const priceRef = useRef();
    const activeRef = useRef();

    /*
    useEffect(() => {
        fetch("http://localhost:8080/products")
            .then((res) => res.json())
            .then((json) => setProducts(json));
    },[]);

     */

    useEffect(() => {
        fetch("http://localhost:8080/parcel-machine")
            .then((res) => res.json())
            .then((json) => setParcelMachine(json));

    }, []);

    function removeProduct(index) {
        fetch("http://localhost:8080/remove-product" + index, {method: "DELETE"})
            .then((res) => res.json())
            .then((json) => setProducts(json));
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
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newProduct),
        })
            .then((res) => res.json())
            .then((json) => setProducts(json));
    }

    return (
        <div className="App">
            <label>ID</label> <br/>
            <input ref={idRef} type="number"/> <br/>

            <label>Name</label> <br/>
            <input ref={nameRef} type="text"/> <br/>

            <label>Price</label> <br/>
            <input ref={priceRef} type="number"/> <br/>

            <label>Active</label> <br/>
            <input ref={activeRef} type="checkbox"/> <br/>

            <button onClick={addProduct}>Add</button>

            <h3>Products:</h3>
            {products.map((product, index) => (
                <div key={product.id}>
                    <div>{product.id}</div>
                    <div>{product.name}</div>
                    <div>{product.price}</div>
                    <button onClick={() => removeProduct(index)}>Delete</button>
                </div>
            ))}

            <h3>Parcel Machines:</h3>
            <select>
                {parcelMachine.map((machine) => (
                    <option>{machine.NAME}</option>
                ))}
            </select>
        </div>
    );
}

export default App;
