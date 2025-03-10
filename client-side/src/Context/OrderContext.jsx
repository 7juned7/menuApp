import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const useOrderContext = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [customerOrder, setCustomerOrder] = useState([]);



    return (
        <OrderContext.Provider value={{ customerOrder, setCustomerOrder }}>
            {children}
        </OrderContext.Provider>
    );
};
