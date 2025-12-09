import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const OrderStatusScreen = ({ route, navigation }) => {
  const { orderId, method } = route.params;

  const chooseStatus = (status) => {
    if (status === "Paid") {
      navigation.replace("PaymentSuccess", { method });
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn trạng thái đơn hàng</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => chooseStatus("Pending")}
      >
        <Text style={styles.txt}>Pending</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => chooseStatus("Paid")}
      >
        <Text style={styles.txt}>Paid</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => chooseStatus("Cancelled")}
      >
        <Text style={styles.txt}>Cancelled</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderStatusScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  btn: {
    width: "70%",
    padding: 15,
    backgroundColor: "#e91e1eff",
    marginVertical: 10,
    borderRadius: 8,
  },
  txt: { color: "#fff", fontSize: 18, textAlign: "center" },
});
