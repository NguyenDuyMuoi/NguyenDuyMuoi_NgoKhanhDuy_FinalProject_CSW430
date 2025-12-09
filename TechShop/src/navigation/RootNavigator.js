import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";

// AUTH
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

// USER

import AddressScreen from "../screens/user/AddressScreen";
import CheckoutScreen from "../screens/user/CheckoutScreen";
import EditProfileScreen from "../screens/user/EditProfileScreen";
import OrderHistoryScreen from "../screens/user/OrderHistoryScreen";
import OrderStatusScreen from "../screens/user/OrderStatusScreen";
import PaymentSuccessScreen from "../screens/user/PaymentSuccessScreen";
import ProductByBrandScreen from "../screens/user/ProductByBrandScreen";
import ProductByCategoryScreen from "../screens/user/ProductByCategoryScreen";
import ProductDetailScreen from "../screens/user/ProductDetailScreen";
import SearchResultScreen from "../screens/user/SearchResultScreen";
import UserOrderDetailScreen from "../screens/user/UserOrderDetailScreen";
import UserTabNavigator from "./UserTabNavigator";





// ADMIN SCREENS
import AddFlashSaleItemScreen from "../screens/admin/AddFlashSaleItemScreen";
import AddFlashSaleScreen from "../screens/admin/AddFlashSaleScreen";
import AddProductScreen from "../screens/admin/AddProductScreen";
import AdminOrderDetailScreen from "../screens/admin/AdminOrderDetailScreen";
import AdminOrdersScreen from "../screens/admin/AdminOrdersScreen";
import DashboardScreen from "../screens/admin/DashboardScreen";
import FlashSaleDetailScreen from "../screens/admin/FlashSaleDetailScreen";
import FlashSaleManagementScreen from "../screens/admin/FlashSaleManagementScreen";
import ManageProductsScreen from "../screens/admin/ManageProductsScreen";
import ManageUsersScreen from "../screens/admin/ManageUsersScreen";


const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [role, setRole] = useState(null); // null | "User" | "Admin"

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  const handleLogout = () => {
    setRole(null); // ⭐ RESET ROLE → TỰ ĐỘNG QUAY VỀ LOGIN
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* AUTH SCREENS */}
      {role === null && (
        <>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onLogin={handleLogin}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}

      {/* USER */}

      {role === "User" && (
        <>
          <Stack.Screen name="UserTabs">
            {(props) => (
              <UserTabNavigator
                {...props}
                onLogout={handleLogout}
              />
            )}
          </Stack.Screen>

          {/* ⭐ THÊM ROUTE CHO USER */}

          <Stack.Screen
            name="ProductByBrand"
            component={ProductByBrandScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SearchResult"
            component={SearchResultScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Address"
            component={AddressScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrderStatus"
            component={OrderStatusScreen}
            options={{ headerShown: false }}
          />


          <Stack.Screen
            name="PaymentSuccess"
            component={PaymentSuccessScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: "Lịch sử đặt hàng" }} />
          <Stack.Screen name="UserOrderDetail" component={UserOrderDetailScreen} options={{ title: "Chi tiết đơn hàng" }} />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductByCategory"
            component={ProductByCategoryScreen}
            options={{ headerShown: false }}
          />





        </>
      )}


      {/* ADMIN */}
      {role === "Admin" && (
        <>
          {/* ⭐ DASHBOARD — TRUYỀN onLogout ĐÚNG CÁCH */}
          <Stack.Screen name="AdminDashboard">
            {(props) => (
              <DashboardScreen
                {...props}
                onLogout={handleLogout}   // ⭐ ĐÃ FIX
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="ManageProducts"
            component={ManageProductsScreen}
          />

          <Stack.Screen
            name="AddProduct"
            component={AddProductScreen}
          />

          <Stack.Screen
            name="AdminOrders"
            component={AdminOrdersScreen}
            options={{
              headerShown: true,
              title: "Quản lý đơn hàng",
              headerStyle: { backgroundColor: "#f01a1aff" },
              headerTintColor: "#fff",
            }}
          />
          <Stack.Screen
            name="AdminOrderDetail"
            component={AdminOrderDetailScreen}
            options={{ headerShown: true, title: "Chi tiết đơn hàng" }}
          />
          <Stack.Screen name="FlashSaleManagement" component={FlashSaleManagementScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AddFlashSale" component={AddFlashSaleScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FlashSaleDetail" component={FlashSaleDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AddFlashSaleItem" component={AddFlashSaleItemScreen} options={{ headerShown: false }} />


          <Stack.Screen
            name="ManageUsers"
            component={ManageUsersScreen}
            options={{
              headerShown: true,
              title: "Quản lý người dùng",
              headerStyle: { backgroundColor: "#f02933ff" },
              headerTintColor: "#fff",
            }}
          />
        </>
      )}

    </Stack.Navigator>
  );
};

export default RootNavigator;
