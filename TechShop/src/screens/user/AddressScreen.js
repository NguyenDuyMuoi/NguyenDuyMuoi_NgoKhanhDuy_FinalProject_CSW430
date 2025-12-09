import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { homeAddressApi } from "../../api/homeAddressApi";

const AddressScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [addressLine, setAddressLine] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) {
        setUserId(parseInt(id));
        loadAddress(parseInt(id));
      }
    };
    loadUser();
  }, []);

  const loadAddress = async (uid) => {
    const res = await homeAddressApi.getAddress(uid);
    if (res) {
      setFullName(res.fullName || "");
      setPhone(res.phone || "");
      setProvince(res.province || "");
      setDistrict(res.district || "");
      setWard(res.ward || "");
      setAddressLine(res.addressLine || "");
    }
  };

  const save = async () => {
    await homeAddressApi.saveAddress(userId, {
      fullName,
      phone,
      province,
      district,
      ward,
      addressLine,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Họ và tên</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} />

      <Text style={styles.label}>Tỉnh / Thành phố</Text>
      <TextInput style={styles.input} value={province} onChangeText={setProvince} />

      <Text style={styles.label}>Quận / Huyện</Text>
      <TextInput style={styles.input} value={district} onChangeText={setDistrict} />

      <Text style={styles.label}>Phường / Xã</Text>
      <TextInput style={styles.input} value={ward} onChangeText={setWard} />

      <Text style={styles.label}>Địa chỉ chi tiết</Text>
      <TextInput style={styles.input} value={addressLine} onChangeText={setAddressLine} />

      <TouchableOpacity style={styles.btn} onPress={save}>
        <Text style={styles.btnText}>Lưu địa chỉ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "white" },
  label: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
  },
  btn: {
    marginTop: 20,
    backgroundColor: "#e91e1eff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
