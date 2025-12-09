import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { cartApi } from "../../api/cartApi";
import { homeAddressApi } from "../../api/homeAddressApi"; // ⭐ THÊM IMPORT
import orderApi from "../../api/orderApi";

import { paymentApi } from "../../api/paymentApi";

const CheckoutScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState(null);
  const [method, setMethod] = useState("COD");
  const [address, setAddress] = useState(null); // ⭐ ĐỊA CHỈ

  useEffect(() => {
    loadUser();

    const unsubscribe = navigation.addListener("focus", () => {
      if (userId) loadAddress(userId);
    });
    return unsubscribe;
  }, [navigation, userId]);

  const loadUser = async () => {
    const json = await AsyncStorage.getItem("user");
    if (!json) return;

    const user = JSON.parse(json);
    setUserId(user.id);

    loadCart(user.id);
    loadAddress(user.id); // ⭐ LOAD ĐỊA CHỈ
  };

  const loadCart = async (uid) => {
    const res = await cartApi.getCart(uid);
    setCart(res.items || []);
    setTotal(res.totalPrice || 0);
  };

  const loadAddress = async (uid) => {
    try {
      const res = await homeAddressApi.getAddress(uid);
      setAddress(res);
    } catch (err) {
      console.log("No address found");
      setAddress(null);
    }
  };

  // ⭐ Đặt hàng
const submitOrder = async () => {
  try {
    if (!userId) return;

    if (!address) {
      Alert.alert("Thiếu thông tin", "Vui lòng thêm địa chỉ giao hàng!");
      return;
    }

    console.log("📦 Creating order for user:", userId);

    // ⭐ Gửi API đúng kiểu backend yêu cầu
    const order = await orderApi.createOrder(userId);

    console.log("📌 ORDER RESPONSE:", order);

    if (!order?.id) {
      Alert.alert("Lỗi", "Không thể tạo đơn hàng.");
      return;
    }

    // ⭐ Tạo payment
    await paymentApi.createPayment(userId, order.id, method);

    // ⭐ Chuyển sang chọn trạng thái
    navigation.replace("OrderStatus", {
      orderId: order.id,
      method,
    });

  } catch (err) {
    console.log("❌ Create order error:", err?.response?.data || err);
    Alert.alert("Lỗi", "Tạo đơn hàng thất bại!");
  }
};




  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.productName}</Text>
      <Text style={styles.itemQty}>x{item.quantity}</Text>
      <Text style={styles.itemPrice}>{item.unitPrice}₫</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Xác nhận đơn hàng</Text>

      {/* PRODUCT LIST */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={renderItem}
      />

      {/* ⭐ ĐỊA CHỈ GIAO HÀNG */}
      <View style={styles.addressBox}>
        <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>

        {address ? (
          <View>
            <Text style={styles.addrText}>{address.fullName}</Text>
            <Text style={styles.addrText}>{address.phone}</Text>
            <Text style={styles.addrText}>
              {address.addressLine}, {address.ward}, {address.district},{" "}
              {address.province}
            </Text>

            <TouchableOpacity
              style={styles.changeBtn}
              onPress={() => navigation.navigate("Address")}
            >
              <Text style={styles.changeText}>Thay đổi địa chỉ</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate("Address")}
          >
            <Text style={styles.addText}>+ Thêm địa chỉ giao hàng</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* TOTAL */}
      <Text style={styles.total}>Tổng cộng: {total}₫</Text>

      {/* PAYMENT METHODS */}
      <Text style={styles.label}>Phương thức thanh toán:</Text>

      <View style={styles.methods}>
        <TouchableOpacity
          style={[styles.methodBtn, method === "COD" && styles.active]}
          onPress={() => setMethod("COD")}
        >
          <Text style={styles.methodText}>COD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodBtn, method === "BANK" && styles.active]}
          onPress={() => setMethod("BANK")}
        >
          <Text style={styles.methodText}>Bank Transfer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodBtn, method === "CARD" && styles.active]}
          onPress={() => setMethod("CARD")}
        >
          <Text style={styles.methodText}>Credit Card</Text>
        </TouchableOpacity>
      </View>

      {/* CHECKOUT BUTTON */}
      <TouchableOpacity style={styles.checkoutBtn} onPress={submitOrder}>
        <Text style={styles.checkoutText}>Đặt hàng</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    paddingTop: 30,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemName: { fontSize: 16 },
  itemQty: { fontSize: 16 },
  itemPrice: { fontSize: 16, fontWeight: "600" },

  // ⭐ STYLE ĐỊA CHỈ
  addressBox: {
    padding: 14,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginVertical: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  addrText: { fontSize: 15, marginBottom: 4 },
  changeBtn: { marginTop: 8 },
  changeText: { color: "#e91e1eff", fontWeight: "600" },
  addBtn: { paddingVertical: 10 },
  addText: { color: "#f30e0eff", fontSize: 16, fontWeight: "bold" },

  total: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  methods: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  methodBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
  },
  active: {
    backgroundColor: "#e91e1eff",
    borderColor: "#e91e2cff",
  },
  methodText: { color: "#000" },

  checkoutBtn: {
    marginTop: 30,
    backgroundColor: "#f41414ff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
