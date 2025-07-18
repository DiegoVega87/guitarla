import { useState, useEffect, useMemo } from 'react'
import { db } from '../data/db'
export const useCart = () => {

    const initialCart =  () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }
    
    // State
    const [data, setData] = useState([])
    const [cart, setCart] = useState(initialCart)
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
            if(updatedCart[itemExist].quantity < MAX_ITEMS){
                updatedCart[itemExist].quantity++
                setCart(updatedCart)
            }
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

    // Derivade state
    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])


    return {
        cart,
        data,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }

}