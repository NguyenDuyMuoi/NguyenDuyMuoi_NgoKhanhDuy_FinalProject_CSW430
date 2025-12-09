import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { cartApi } from "../../api/cartApi";
import { getProductsByBrand } from "../../api/productApi";
import { EventBus } from "../../utils/EventBus";

const ProductByBrandScreen = ({ route, navigation }) => {
  const { brandName } = route.params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Load user ID
  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(parseInt(id));
    };
    loadUser();
  }, []);

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProductsByBrand(brandName);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("❌ ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // Convert filename → URL
  const getImageUrl = (img) => {
    if (!img) return null;

    if (!img.startsWith("http")) {
      return `http://10.0.2.2:5029/images/products/${img}`;
    }

    return img.replace("http://localhost", "http://10.0.2.2");
  };

  // Add to cart
  const handleAddToCart = async (productId) => {
    try {
      if (!userId) {
        Alert.alert("Thông báo", "Bạn cần đăng nhập trước!");
        return;
      }

      await cartApi.addToCart(userId, productId, 1);
      EventBus.emit("cartChanged");
      Alert.alert("Thành công", "Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.log("❌ Cart error:", err);
      Alert.alert("Lỗi", "Không thêm vào giỏ!");
    }
  };

  // Render item
  const renderItem = ({ item }) => {
    const img = getImageUrl(item.firstImage);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProductDetail", {
              product: { ...item, firstImage: img },
            })
          }
        >
          <Image source={{ uri: img }} style={styles.productImage} />

          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <Text style={styles.finalPrice}>
            {item.finalPrice.toLocaleString()} đ
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.originalPrice}>
              {item.originalPrice.toLocaleString()} đ
            </Text>
            <Text style={styles.discountPercent}>-{item.discountPercent}%</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => handleAddToCart(item.id)}
        >
          <Ionicons name="cart-outline" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Thêm</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="red" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Sản phẩm {brandName}</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ProductByBrandScreen;

/* ============ STYLE ============ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4eff3ff",
    padding: 12,
    paddingTop: 45,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    minHeight: 260,
    justifyContent: "space-between",
    borderColor: "#eee",
  },
  productImage: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
  },
  productName: {
    marginTop: 6,
    fontWeight: "600",
    fontSize: 14,
  },
  finalPrice: {
    color: "red",
    fontWeight: "bold",
    fontSize: 15,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  originalPrice: {
    textDecorationLine: "line-through",
    fontSize: 12,
    color: "gray",
  },
  discountPercent: {
    color: "#f49222ff",
    fontWeight: "bold",
    fontSize: 12,
  },
  addBtn: {
    marginTop: 8,
    backgroundColor: "red",
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },
});
