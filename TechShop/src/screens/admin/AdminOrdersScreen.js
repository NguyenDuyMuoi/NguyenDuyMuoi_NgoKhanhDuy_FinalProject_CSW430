import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { adminOrderApi } from "../../api/adminOrderApi";

const AdminOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const res = await adminOrderApi.getAll();
    setOrders(res);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("AdminOrderDetail", { id: item.id })}
    >
      <Text style={styles.orderId}>Order #{item.id}</Text>
      <Text>User: {item.userId}</Text>
      <Text>Total: {item.totalPrice}₫</Text>
      <Text>Status: {item.status}</Text>
      <Text>Created: {item.createdAt}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default AdminOrdersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  card: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  orderId: { fontSize: 18, fontWeight: "bold" },
});
