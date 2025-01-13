import logo from './logo.svg';
import './App.css';
import {useEffect, useRef, useState} from 'react';

function App() {
  const [products, setProducts] = useState([]);
    const idRef = useRef();
    const nameRef = useRef();
    const priceRef = useRef();
    const activeRef = useRef();

    useEffect(() => {
      fetch("http://localhost:8080/products")
          .then(res => res.json())
          .then (json => setProducts(json))
    }, [])

    function removeProduct(index) {
        fetch("http://localhost:8080/remove-product/" + index)
            .then(res => res.json())
            .then (json => setProducts(json))

    }

    function addProduct() {
        fetch(
            `http://localhost:8080/add-product/${Number(idRef.current.value)}/${nameRef.current.value}/${Number(priceRef.current.value)}/${activeRef.current.checked}`
        )

        return (
            <div className="App">
                <label>ID</label> <br />
                <input ref={idRef} type="number" /> <br />
                <label>Name</label> <br />
                <input ref={nameRef} type="text" /> <br />
                <label>Price</label> <br />
                <input ref={priceRef} type="number" /> <br />
                <label>Active</label> <br />
                <input ref={activeRef} type="checkbox" /> <br />
                <button onClick={addProduct}>Add</button>
                {products.map((product, index) => (
                    <div>
                        <div>{product.id}</div>
                        <div>{product.id}</div>
                        <div>{product.name}</div>
                        <div>{product.price}</div>
                        <button onClick={() => removeProduct(index)}>Delete</button>

                    </div>)}
            </div>
        );
    }

        export default App;
