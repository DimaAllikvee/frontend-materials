import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';

function App() {
  const [products, setProducts] = useState([]);

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

  return (
      <div className="App">
        {products.map((product, index) => (
            <div key={product.id}>
              <div>{product.id}</div>
              <div>{product.name}</div>
              <div>{product.price}</div>
                <button onClick={() => removeProduct(index)}>Delete</button>
            </div>
        ))}
      </div>
  );
}

  export default App;
