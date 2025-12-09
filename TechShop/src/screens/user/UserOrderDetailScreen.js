import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import orderApi from "../../api/orderApi";

const UserOrderDetailScreen = ({ route }) => {
  const { id } = route.params;
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    loadDetail();
  }, []);

  const loadDetail = async () => {
    try {
      const res = await orderApi.getOrderDetail(id);
      setDetail(res);
    } catch (err) {
      console.log("Detail error:", err);
    }
  };

  if (!detail)
    return <Text style={{ textAlign: "center", marginTop: 50 }}>Đang tải...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đơn hàng #{detail.id}</Text>
      <Text style={styles.text}>Tổng tiền: {detail.totalPrice.toLocaleString()}đ</Text>
      <Text style={styles.text}>Trạng thái: {detail.status}</Text>
      <Text style={styles.text}>Ngày tạo: {detail.createdAt.replace("T", " ").slice(0, 19)}</Text>

      <Text style={styles.section}>Sản phẩm:</Text>

      <FlatList
        data={detail.items}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={{ fontWeight: "bold" }}>{item.productName}</Text>
            <Text>Số lượng: {item.quantity}</Text>
            <Text>Giá: {item.finalPrice.toLocaleString()}đ</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default UserOrderDetailScreen;

const styles = StyleSheet.create({
  container: { padding: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 4 },
  section: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  item: {
    padding: 12,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
});
