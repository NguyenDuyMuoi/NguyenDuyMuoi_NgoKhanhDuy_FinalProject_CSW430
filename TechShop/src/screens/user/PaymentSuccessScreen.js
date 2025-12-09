import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PaymentSuccessScreen = ({ navigation, route }) => {
  // ⭐ Lấy phương thức thanh toán từ CheckoutScreen
  const method = route?.params?.method ?? "COD";

  // ⭐ Chuyển mã thành chữ dễ hiểu
  const methodLabel =
    method === "COD"
      ? "Thanh toán khi nhận hàng (COD)"
      : method === "BANK"
      ? "Chuyển khoản ngân hàng"
      : "Credit Card";

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✓</Text>
      <Text style={styles.title}>Đặt hàng thành công!</Text>

      {/* ⭐ HIỂN THỊ PHƯƠNG THỨC THANH TOÁN */}
      <Text style={styles.statusText}>Phương thức: {methodLabel}</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("UserTabs", {
            screen: "Home",
          })
        }
      >
        <Text style={styles.btnText}>Về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  icon: {
    fontSize: 80,
    color: "green",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: "#444",
    marginBottom: 40,
  },
  btn: {
    padding: 14,
    backgroundColor: "#e91e25ff",
    borderRadius: 8,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
