import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { createProduct, updateProduct } from "../../api/productApi";

const AddProductScreen = ({ navigation, route }) => {
  const editData = route.params?.editData || null;

  // ===============================
  // STATE
  // ===============================
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // ===============================
  // LOAD DATA WHEN EDIT
  // ===============================
  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setBrand(editData.brand);
      setCategory(editData.category);
      setOriginalPrice(String(editData.originalPrice));
      setQuantity(String(editData.quantity));
      setDiscountPercent(String(editData.discountPercent));
      setDescription(editData.description);
      setImageUrl(editData.images?.[0] || "");
    }
  }, [editData]);

  // ===============================
  // CALC FINAL PRICE
  // ===============================
  const calcFinalPrice = () => {
    const price = Number(originalPrice);
    const percent = Number(discountPercent);

    if (!price || price <= 0) return 0;

    return price - (price * percent) / 100;
  };

  const finalPrice = calcFinalPrice();

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async () => {
    if (!name || !brand || !category || !originalPrice || !quantity) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ thông tin bắt buộc.");
      return;
    }

    const payload = {
      name,
      brand,
      category,
      description,
      originalPrice: Number(originalPrice),
      discountPercent: Number(discountPercent),
      quantity: Number(quantity),
      isActive: true,
      images: imageUrl ? [imageUrl] : [],
    };

    console.log("📌 Payload gửi lên:", payload);

    try {
      if (editData) {
        await updateProduct(editData.id, payload);
        Alert.alert("Thành công", "Cập nhật sản phẩm thành công!");
      } else {
        await createProduct(payload);
        Alert.alert("Thành công", "Thêm sản phẩm thành công!");
      }

      navigation.goBack();
    } catch (err) {
      console.log("❌ API ERROR:", err.response?.data || err.message);
      Alert.alert("Lỗi", "Không thể lưu sản phẩm.");
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#e91e1eff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {editData ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </Text>

        {/* Empty View to balance layout */}
        <View style={{ width: 26 }}></View>
      </View>


      {/* NAME */}
      <Text style={styles.label}>Tên sản phẩm *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      {/* BRAND */}
      <Text style={styles.label}>Thương hiệu *</Text>
      <TextInput style={styles.input} value={brand} onChangeText={setBrand} />

      {/* CATEGORY */}
      <Text style={styles.label}>Danh mục *</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} />

      {/* PRICE */}
      <Text style={styles.label}>Giá gốc *</Text>
      <TextInput
        style={styles.input}
        value={originalPrice}
        onChangeText={setOriginalPrice}
        keyboardType="numeric"
      />

      {/* QUANTITY */}
      <Text style={styles.label}>Số lượng *</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      {/* DISCOUNT */}
      <Text style={styles.label}>Giảm giá (%)</Text>
      <TextInput
        style={styles.input}
        value={discountPercent}
        onChangeText={setDiscountPercent}
        keyboardType="numeric"
      />

      {/* FINAL PRICE */}
      <Text style={styles.finalPrice}>
        Giá sau giảm: {finalPrice.toLocaleString()} đ
      </Text>

      {/* DESCRIPTION */}
      <Text style={styles.label}>Mô tả *</Text>
      <TextInput
        style={[styles.input, { height: 120 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* IMAGE FILE */}
      <Text style={styles.label}>Tên file ảnh *</Text>
      <TextInput
        style={styles.input}
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      {/* PREVIEW IMAGE */}
      <View style={styles.imageBox}>
        {imageUrl ? (
          <Image
            source={{
              uri: `http://10.0.2.2:5029/images/${encodeURIComponent(imageUrl)}`,
            }}
            style={styles.image}
          />

        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Chưa có ảnh</Text>
        )}
      </View>

      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {editData ? "Lưu thay đổi" : "Thêm sản phẩm"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#e91e1eff",
  },

  // INPUT FIELDS
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },

  finalPrice: {
    marginTop: 5,
    fontWeight: "bold",
    color: "deeppink",
  },

  imageBox: {
    height: 200,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },

  button: {
    backgroundColor: "#e91e2fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 25,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
