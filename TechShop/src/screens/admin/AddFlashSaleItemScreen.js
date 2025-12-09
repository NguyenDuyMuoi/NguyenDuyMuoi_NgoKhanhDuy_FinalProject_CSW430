import { useState } from "react";
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { addFlashSaleItem } from "../../api/flashSaleApi";

const AddFlashSaleItemScreen = ({ route, navigation }) => {
  const { flashSaleId } = route.params;

  const [productId, setProductId] = useState("");
  const [flashPrice, setFlashPrice] = useState("");
  const [limitQuantity, setLimitQuantity] = useState("");

  const showToast = (msg) => {
    Platform.OS === "android"
      ? ToastAndroid.show(msg, ToastAndroid.SHORT)
      : Alert.alert(msg);
  };

  const handleAdd = async () => {
    if (!productId || !flashPrice || !limitQuantity)
      return showToast("Nhập đủ dữ liệu");

    try {
      await addFlashSaleItem(flashSaleId, {
        productId: Number(productId),
        flashPrice: Number(flashPrice),
        limitQuantity: Number(limitQuantity),
      });

      showToast("Thêm sản phẩm thành công");
      navigation.goBack();
    } catch (e) {
      console.log(e);
      showToast("Thêm thất bại");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thêm sản phẩm</Text>

      <TextInput
        style={styles.input}
        placeholder="Product ID"
        keyboardType="numeric"
        value={productId}
        onChangeText={setProductId}
      />

      <TextInput
        style={styles.input}
        placeholder="Flash Price"
        keyboardType="numeric"
        value={flashPrice}
        onChangeText={setFlashPrice}
      />

      <TextInput
        style={styles.input}
        placeholder="Limit Quantity"
        keyboardType="numeric"
        value={limitQuantity}
        onChangeText={setLimitQuantity}
      />

      <TouchableOpacity style={styles.btn} onPress={handleAdd}>
        <Text style={styles.btnText}>THÊM</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "hotpink",
    padding: 12,
    borderRadius: 10,
  },
  btnText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
});

export default AddFlashSaleItemScreen;
