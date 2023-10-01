import React, { useState } from "react";
import "../Styles/CartItem.css";

/**
 * @typedef {Object} cartItem - Data on product available to buy
 * @property {number} qty - Quantity of product in cart
 * @property {string} name - The name or title of the product
 * @property {number} id - Id of the product
 * @property {number} cost - The price of the product
 * @property {string} image - Contains URL for the product image
 * @property {string} currency - Currency of the price
 */

export default function CartItem(props) {
  const availableProducts = [
    ...JSON.parse(localStorage.getItem("allProducts")),
  ];
  const availableCartItems = [...JSON.parse(localStorage.getItem("cartItems"))];
  const [showErrorMessage, setShowErrorMessage] = useState("");

  /**
   * @param {number} currentQuantity
   * @param {number} idOfSelectedProduct
   * Function which is called to increment the quantity of an item inside cart
   * If user tries to increase the quantity of a particular item greater than the quantity in stock
   *      An alert message is shown to inform stock limit reached and message will be hidden after timer goes off
   * Otherwise quantity will be incremented
   * We update the array of cartItems in Local Storage
   * ATLAST WE CALL handleChange() function so as to tell the Cart.js that cartItems array has been updated in Local Storage
   * This is where we use handleChange prop which calls updatingQuantityOfCartItems() function of Cart.js to tell the Cart that there is a change in cartItems
   */
  const incrementQuantityByOne = (idOfSelectedProduct, currentQuantity) => {
    const selectedProduct = availableProducts.find(
      (product) => product.id === idOfSelectedProduct
    );
    const availableQuantityOFTheProduct = selectedProduct.quantity;

    if (currentQuantity === availableQuantityOFTheProduct) {
      const timer = 3000;
      setShowErrorMessage(
        "Cannot add more products. Available stock limit reached."
      );
      setTimeout(() => {
        setShowErrorMessage("");
      }, timer);
    } else {
      const indexOfRequiredCartItem = availableCartItems.findIndex(
        (item) => item.id === idOfSelectedProduct
      );
      availableCartItems[indexOfRequiredCartItem] = {
        ...availableCartItems[indexOfRequiredCartItem],
        qty: currentQuantity + 1,
      };
      localStorage.setItem("cartItems", JSON.stringify(availableCartItems));
    }
    props.handleChange();
  };

  /**
   * Function which is called to decrement the quantity of an item inside cart
   * @param {number} currentQuantity
   * @param {number} idOfSelectedProduct
   * If user decrements the quantity of an item to zero
   *      That item will be removed from the cart
   * In other cases quantity will be decremented and we update the array of cartItems in Local Storage
   * ATLAST WE CALL handleChange() function so as to tell the cart.js that cartItems array has been updated in Local Storage
   * This is where we use handleChange prop which calls updatingQuantityOfCartItems() function of Cart.js to tell the Cart that there is a change in cartItems
   */
  const decrementQuantityByOne = (idOfSelectedProduct, currentQuantity) => {
    const indexOfRequiredCartItem = availableCartItems.findIndex(
      (item) => item.id === idOfSelectedProduct
    );

    if (currentQuantity === 1) {
      availableCartItems.splice(indexOfRequiredCartItem, 1);
    } else {
      availableCartItems[indexOfRequiredCartItem] = {
        ...availableCartItems[indexOfRequiredCartItem],
        qty: currentQuantity - 1,
      };
    }
    localStorage.setItem("cartItems", JSON.stringify(availableCartItems));
    props.handleChange();
  };

  /**
   * @param {number} idOfSelectedProduct
   * Function which is called on clicking the delete button on cartItem
   * Deletes that particular cart item from the cart
   * Updates the CartItems array in local storage as well
   * ATLAST WE CALL handleChange() function so as to tell the Cart.js page that cartItems array has been updated in Local Storage
   * This is where we use handleChange prop which calls updatingQuantityOfCartItems() function of Cart to tell the Cart that there is a change in cartItems
   */
  const handleDelete = (idOfSelectedProduct) => {
    const indexOfRequiredCartItem = availableCartItems.findIndex(
      (item) => item.id === idOfSelectedProduct
    );
    availableCartItems.splice(indexOfRequiredCartItem, 1);
    localStorage.setItem("cartItems", JSON.stringify(availableCartItems));
    props.handleChange();
  };

  // CartItem component returns a component with details of each cart item
  return (
    <div className="cart-card">
      <div className="cart-details">
        <img alt={props.name} className="cart-image" src={props.image} />

        <div className="item-details">
          <span>{props.name}</span>
          <span>Cost: INR {props.cost}</span>
          <div className="item-qty">
            <button
              onClick={() => {
                decrementQuantityByOne(props.id, props.qty);
              }}
            >
              -
            </button>
            <span className="quantity"> Qty: {props.qty} </span>
            <button
              onClick={() => {
                incrementQuantityByOne(props.id, props.qty);
              }}
            >
              +
            </button>
          </div>
          <button
            onClick={() => {
              handleDelete(props.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
      {showErrorMessage && (
        <div className="error-message">
          <span>{showErrorMessage}</span>
        </div>
      )}
    </div>
  );
}
