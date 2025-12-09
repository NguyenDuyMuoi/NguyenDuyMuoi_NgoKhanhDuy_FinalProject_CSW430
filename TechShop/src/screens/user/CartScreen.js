import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useIsFocused, useNavigation } from "@react-navigation/native";
import { cartApi } from "../../api/cartApi";

const CartScreen = () => {
  const navigation = useNavigation();   // ⭐ FIX: LẤY NAVIGATION BẰNG HOOK
  const isFocused = useIsFocused();
  const IMAGE_BASE_URL = "http://10.0.2.2:5029/images/products/";

  const [userId, setUserId] = useState(null);
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  // Lấy userId từ AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(parseInt(id));
    };
    loadUser();
  }, []);

  // Load cart khi có userId
  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  // Reload khi quay lại tab Cart
  useEffect(() => {
    if (isFocused && userId) fetchCart();
  }, [isFocused, userId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartApi.getCart(userId);

      setItems(res.items ?? []);
      setTotalPrice(res.totalPrice ?? 0);
    } catch (err) {
      console.log("❌ CART LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (productId, newQty) => {
    if (newQty <= 0) return removeItem(productId);

    await cartApi.updateItem(userId, productId, newQty);
    fetchCart();
  };

 const removeItem = async (productId) => {
  await cartApi.deleteCartItem(userId, productId);
  fetchCart();
};


  const clearCart = () => {
    Alert.alert("Xác nhận", "Bạn muốn xoá toàn bộ giỏ hàng?", [
      { text: "Huỷ" },
      {
        text: "Xoá",
        onPress: async () => {
          try {
            await cartApi.clearCart(userId);
            fetchCart();
          } catch (err) {
            console.log("❌ CLEAR CART ERROR:", err);
          }
        },
      },
    ]);
  };

  // ⭐ FIX: ĐI ĐẾN TRANG CHECKOUT
  const checkout = () => {
    navigation.navigate("Checkout");
  };

  if (loading) return <Text style={styles.loading}>Loading...</Text>;

  if (items.length === 0)
    return (
      <View style={styles.center}>
        <Text>Giỏ hàng đang trống.</Text>
      </View>
    );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: IMAGE_BASE_URL + item.imageUrl }}
        style={styles.image}
      />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.name}>{item.productName}</Text>
        <Text style={styles.price}>{item.unitPrice.toLocaleString()} đ</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.btnQty}
            onPress={() => updateQty(item.productId, item.quantity - 1)}
          >
            <Text style={styles.btnText}>-</Text>
          </TouchableOpacity>

          <Text style={{ marginHorizontal: 8 }}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.btnQty}
            onPress={() => updateQty(item.productId, item.quantity + 1)}
          >
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDelete}
            onPress={() => removeItem(item.productId)}
          >
            <Text style={{ color: "white" }}>Xoá</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingBottom: 200, // ⭐ CHỪA CHỖ CHO FOOTER
        }}
      />

      {/* ⭐ FOOTER CỐ ĐỊNH */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Xoá tất cả sản phẩm
          </Text>
        </TouchableOpacity>

        <Text style={styles.total}>
          Tổng: {totalPrice.toLocaleString()} đ
        </Text>

        <TouchableOpacity style={styles.checkoutBtn} onPress={checkout}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Thanh toán
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

// ----------------- STYLES -----------------
const styles = StyleSheet.create({
  loading: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 18,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  price: {
    color: "#e91e63",
    fontWeight: "bold",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  btnQty: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  btnDelete: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "red",
    borderRadius: 6,
    marginLeft: "auto",
  },

  // ⭐ FOOTER CỐ ĐỊNH
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    elevation: 20,
  },

  clearBtn: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },

  total: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e10e0eff",
    textAlign: "center",
    marginBottom: 12,
  },

  checkoutBtn: {
    backgroundColor: "#e91e28ff",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
});
