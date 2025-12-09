import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { adminOrderApi } from "../../api/adminOrderApi"; // ⭐ SỬA IMPORT

const AdminOrderDetailScreen = ({ route }) => {
  const { id } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const res = await adminOrderApi.getDetail(id);   // ⭐ SỬA API
      setOrder(res);
    } catch (err) {
      console.log("ERROR ADMIN DETAIL:", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!order)
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy đơn hàng.</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>Đơn hàng #{order.id}</Text>
      <Text>User: {order.userId}</Text>
      <Text>Total: {order.totalPrice}₫</Text>
      <Text>Status: {order.status}</Text>
      <Text>Created: {order.createdAt}</Text>

      <Text style={styles.subTitle}>Sản phẩm:</Text>

      <FlatList
        data={order.items}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>{item.productName}</Text>
            <Text>x{item.quantity}</Text>
            <Text>{item.unitPrice}₫</Text>
          </View>
        )}
      />
    </View>
  );
};

export default AdminOrderDetailScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  itemName: {
    fontWeight: "600",
    width: "50%",
  },
});
