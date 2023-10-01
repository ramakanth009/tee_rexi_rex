import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import CartItem from "./CartItem";
import "../Styles/Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} cartItem - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {number} qty - Quantity of product in cart
 * @property {number} cost - The price of the product
 * @property {number} id - Id of the product
 * @property {string} currency - Currency of the price
 * @property {string} image - Contains URL for the product image
 */

export default function Cart() {
  const [cartItems, setCartItems] = useState(
    [...JSON.parse(localStorage.getItem("cartItems"))] || []
  );
  const [totalItemsCost, setTotalItemsCost] = useState(0);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const keysOfLocalStorage = Object.keys(localStorage);
  const [showErrorMessage, setShowErrorMessage] = useState("");
  
  useEffect(() => {
    totalCartValue(cartItems);
  }, [cartItems]);

  /**
   * @param {Array.<cartItem>} cartItems
   */
  const totalCartValue = (cartItems) => {
    const newTotalSum = cartItems.reduce((totalCost, currentValue) => {
      const product = currentValue.qty * currentValue.cost;
      return totalCost + product;
    }, 0);
    setTotalItemsCost(newTotalSum);
  };
  
  const updatingQuantityOfCartItems = () => {
    const updatedCartItems = [...JSON.parse(localStorage.getItem("cartItems"))];
    setCartItems(updatedCartItems);
  };

  /**
   * @param {string} errorMessage
   */
  const showAndHideErrorMessage = (errorMessage) => {
    const timer = 3000;
    setShowErrorMessage(errorMessage);
    setTimeout(() => {
      setShowErrorMessage("");
    }, timer);
  };

  /**
   * @param {Array.<string>} arrayOfKeys
  */
  const setEmptyArraysInLocalStorage = (arrayOfKeys) => {
    arrayOfKeys.forEach((key) => {
      localStorage.setItem(key, JSON.stringify([]));
    });
  };


  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showAndHideErrorMessage("Add atleast one product to cart to checkout");
    } else if (address === "") {
      showAndHideErrorMessage("Enter a valid address");
    } else if (address.length < 20) {
      showAndHideErrorMessage("Address should be atleast 20 characters");
    } else {
      navigate("/thanks");
      setEmptyArraysInLocalStorage(keysOfLocalStorage);
    }
  };

  return (
    <>
      <Header />
      <div className="parent-div">
        <div className="cart-components">
          {cartItems.length === 0 ? (
            <>
              <p>Cart is empty!</p>
            </>
          ) : (
            <>
              {cartItems.map((cartItem) => (
                <CartItem
                  key={cartItem.id}
                  name={cartItem.name}
                  image={cartItem.image}
                  cost={cartItem.cost}
                  qty={cartItem.qty}
                  id={cartItem.id}
                  handleChange={updatingQuantityOfCartItems}
                />
              ))}
            </>
          )}
        </div>

        <div className="order-summary">
          <div className="order-details">
            <span>Order Summary</span>
            <span>Total Cart Value: {totalItemsCost} INR</span>
            <TextField
              label="Enter delivery address..."
              multiline
              rows={3}
              fullWidth
              name="address-field"
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button onClick={handleCheckout}>CHECKOUT</button>
          </div>

          {showErrorMessage && (
            <div className="error-message">
              <span>{showErrorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
