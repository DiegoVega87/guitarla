import { useState, useEffect } from 'react'
import Guitar from "./components/Guitar"
import Header from "./components/Header"
import {db} from "./data/db"

function App() {

    const initialCart =  () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }
    
    // State
    const [data, setData] = useState([])
    const [cart, setCart] = useState([])
    // Effect
    useEffect(()=>{
        setData(db)
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const MAX_ITEMS = 5

    function addToCart(item){
        const itemExist = cart.findIndex(guitar => guitar.id === item.id)
        if(itemExist < 0){
            item.quantity = 1
            setCart([...cart, item])
        }else{
            const updatedCart = [...cart]
            updatedCart[itemExist].quantity < MAX_ITEMS ? updatedCart[itemExist].quantity++ : 
            setCart(updatedCart)
        }
    }

    function removeFromCart(id){
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function clearCart(){
        setCart([]);
    }

    function increaseQuantity(id){
        // addToCart(item) mi version --
        const updatedCart = cart.map( item => {
            if(item.id === id && item.quantity < MAX_ITEMS){
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    function decreaseQuantity(id){
        const itemIndex = cart.findIndex((guitar) => guitar.id === id)
        const updatedCart = [...cart]

        if(cart.length < 2){

            if(updatedCart[itemIndex].quantity < 2){
                clearCart();
            }else{
                updatedCart[itemIndex].quantity--
                setCart(updatedCart)
            }

        }else{
            if(updatedCart[itemIndex].quantity < 2){
                removeFromCart(id)
            }else{
                updatedCart[itemIndex].quantity--
                setCart(updatedCart)
            }
        }

    }

  return (
    <>

    <Header 
        cart={cart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
    />

    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>
        <div className="row mt-5">

            { data.map((guitar) => (
                <Guitar
                    key={guitar.id}
                    guitar = {guitar} // This is the prop
                    addToCart={addToCart}
                />

                )
            )}

        </div>
    </main>


    <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
            <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
    </footer>
    </>
  )
}

export default App
