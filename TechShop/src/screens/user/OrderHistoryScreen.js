import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import orderApi from "../../api/orderApi";

const OrderHistoryScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Lấy userId từ AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("userId")
      .then((id) => setUserId(id ? parseInt(id) : null))
      .catch((err) => console.log(err));
  }, []);

  // 🔹 Load đơn hàng sau khi userId có dữ liệu
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadOrders();
  }, [userId]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getUserOrders(userId);
      setOrders(res);
    } catch (err) {
      console.log("ORDER HISTORY ERROR:", err);
    }
    setLoading(false);
  };

  // ===================== UI ======================

  // ⏳ Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff2d55" />
      </View>
    );
  }

  // ❌ Không có đơn hàng
  if (orders.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.center}>
          <Text style={{ color: "#666" }}>Bạn chưa có đơn hàng nào.</Text>
        </View>
      </View>
    );
  }

  // Render từng đơn
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("OrderDetail", { orderId: item.id })
      }
    >
      <Text style={styles.title}>Đơn hàng #{item.id}</Text>
      <Text>User ID: {item.userId}</Text>
      <Text>Tổng tiền: {item.totalPrice.toLocaleString()}đ</Text>
      <Text>Trạng thái: {item.status}</Text>
      <Text>Ngày tạo: {item.createdAt.replace("T", " ").substring(0, 19)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Danh sách đơn hàng */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

export default OrderHistoryScreen;

// ===================== STYLES ======================
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fe1d24ff",
    paddingTop: 40,
    elevation: 4,
  },
  back: {
    fontSize: 26,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 26,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
});
