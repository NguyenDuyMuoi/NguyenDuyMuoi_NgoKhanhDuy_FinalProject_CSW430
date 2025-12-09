import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

import { cartApi } from "../api/cartApi";
import AccountScreen from "../screens/user/AccountScreen";
import CartScreen from "../screens/user/CartScreen";
import CategoryScreen from "../screens/user/CategoryScreen";
import HomeScreen from "../screens/user/HomeScreen";

const Tab = createBottomTabNavigator();

const UserTabNavigator = ({ onLogout }) => {

  const [cartCount, setCartCount] = useState(0);
  const userId = 1;   // ⭐ Sau sửa logic login thì dùng AsyncStorage

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await cartApi.getCart(userId);

        // ⭐ FIX QUAN TRỌNG
        const items = res.items || res.cartItems || [];

        const total = items.reduce((s, item) => s + item.quantity, 0);
        setCartCount(total);
      } catch (err) {
        console.log("❌ Badge error:", err.message);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const AccountWrapper = (props) => (
    <AccountScreen {...props} onLogout={onLogout} />
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#e62b13ff",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { height: 70 },

        tabBarIcon: ({ color, size }) => {
          let iconName = "home";

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Category") iconName = "apps";
          else if (route.name === "Cart") iconName = "cart";
          else if (route.name === "Account") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Category" component={CategoryScreen} />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge: cartCount > 0 ? cartCount : null,
        }}
      />

      <Tab.Screen name="Account" component={AccountWrapper} />
    </Tab.Navigator>
  );
};

export default UserTabNavigator;
