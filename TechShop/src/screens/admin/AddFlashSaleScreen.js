import React, { useState } from "react";
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
import { createFlashSale } from "../../api/flashSaleApi";

const AddFlashSaleScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const showToast = (msg) => {
    Platform.OS === "android"
      ? ToastAndroid.show(msg, ToastAndroid.SHORT)
      : Alert.alert(msg);
  };

  const toISO = (val) => {
    const dt = new Date(val);
    return isNaN(dt.getTime()) ? null : dt.toISOString();
  };

  const handleCreate = async () => {
    if (!name.trim()) return showToast("Tên không được trống");

    const startISO = toISO(start);
    const endISO = toISO(end);

    if (!startISO) return showToast("Start sai format");
    if (!endISO) return showToast("End sai format");

    if (new Date(startISO) >= new Date(endISO))
      return showToast("Start phải nhỏ hơn End");

    try {
      await createFlashSale({ name, startTime: startISO, endTime: endISO });
      showToast("Tạo thành công!");
      navigation.goBack();
    } catch (e) {
      console.log(e);
      showToast("Tạo thất bại!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tạo Flash Sale</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên Flash Sale"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="StartTime (yyyy-MM-dd HH:mm)"
        value={start}
        onChangeText={setStart}
      />

      <TextInput
        style={styles.input}
        placeholder="EndTime (yyyy-MM-dd HH:mm)"
        value={end}
        onChangeText={setEnd}
      />

      <TouchableOpacity style={styles.btn} onPress={handleCreate}>
        <Text style={styles.btnText}>TẠO</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { textAlign: "center", fontSize: 20, marginBottom: 15 },
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

export default AddFlashSaleScreen;
