import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";



import { cartApi } from "../../api/cartApi";
import { EventBus } from "../../utils/EventBus";

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;

  const [userId, setUserId] = useState(null);
  const [addedQuantity, setAddedQuantity] = useState(0);

  // Load user ID
  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(parseInt(id));
    };
    loadUser();
  }, []);

  const loadQuantity = async () => {
    if (!userId) return;

    try {
      const res = await cartApi.getCart(userId);
      const list = res.items ?? [];

      const item = list.find(x => x.productId === product.id);
      setAddedQuantity(item ? item.quantity : 0);
    } catch (err) {
      console.log("Load quantity error:", err.message);
    }
  };

  useEffect(() => {
    if (userId) loadQuantity();
  }, [userId]);

  //thêm giỏ hàng

  const handleAddToCart = async () => {
    if (!userId) return;

    try {
      await cartApi.addToCart(userId, product.id, 1);

      EventBus.emit("cartChanged"); // 🔥 Update realtime
      await loadQuantity();

      alert("Đã thêm vào giỏ!");

    } catch (err) {
      console.log("Add cart error:", err.message);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="red" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{product.name}</Text>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        <Image source={{ uri: product.firstImage }} style={styles.image} />

        <Text style={styles.name}>{product.name}</Text>

        <Text style={styles.finalPrice}>
          {product.finalPrice.toLocaleString()} đ
        </Text>

        {addedQuantity > 0 && (
          <Text style={styles.inCart}>Đã có {addedQuantity} trong giỏ</Text>
        )}

        <View style={styles.priceRow}>
          <Text style={styles.originalPrice}>
            {product.originalPrice.toLocaleString()} đ
          </Text>
          <Text style={styles.discount}>-{product.discountPercent}%</Text>
        </View>

        <Text style={styles.sectionTitle}>Thông tin sản phẩm</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Thương hiệu</Text>
          <Text style={styles.infoValue}>{product.brand}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Danh mục</Text>
          <Text style={styles.infoValue}>{product.category}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Số lượng còn lại</Text>
          <Text style={styles.infoValue}>{product.quantity}</Text>
        </View>

        <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
        <Text style={styles.description}>{product.description}</Text>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
          <Text style={styles.addText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "space-between",
    paddingTop:45,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "red" },
  image: { width: "100%", height: 260, resizeMode: "contain" },
  name: { fontSize: 20, fontWeight: "700", margin: 12 },
  finalPrice: { marginHorizontal: 12, fontSize: 22, color: "red" },
  inCart: { marginHorizontal: 12, marginTop: 4, color: "green" },
  priceRow: { flexDirection: "row", marginHorizontal: 12, gap: 10 },
  originalPrice: { textDecorationLine: "line-through", color: "gray" },
  discount: { color: "red", fontWeight: "bold" },
  sectionTitle: { marginTop: 20, marginHorizontal: 12, fontSize: 18, fontWeight: "bold" },
  description: { marginHorizontal: 12, marginTop: 8, lineHeight: 22 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 12, marginTop: 6 },
  infoLabel: { color: "#666" },
  infoValue: { fontWeight: "600" },
  bottomBar: {
    position: "absolute", bottom: 0, width: "100%",
    padding: 12, backgroundColor: "#fff",
    borderTopWidth: 1, borderColor: "#eee",
  },
  addBtn: {
    backgroundColor: "red",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  addText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
