import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { registerApi } from "../../api/authApi";
const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  

const handleRegister = async () => {
  if (!name || !email || !password || !confirm) {
    Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
    return;
  }

  if (password !== confirm) {
    Alert.alert("Lỗi", "Mật khẩu xác nhận không trùng");
    return;
  }

  try {
    await registerApi(name, email, password);

    Alert.alert(
      "Thành công",
      "Tạo tài khoản thành công. Hãy đăng nhập.",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );

  } catch (err) {
    console.log("Register error:", err);
    Alert.alert("Lỗi", "Email đã tồn tại hoặc không hợp lệ!");
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Đăng ký TechShop</Text>
        <TextInput
          placeholder="Tên"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Gmail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Xác nhận mật khẩu"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>ĐĂNG KÝ</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f3f5ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e50d26ff",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff7fb",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ebe4e4ff",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#dc1d27ff",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  buttonText: {
    color: "#fcf9f9ff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    textAlign: "center",
    color: "#555",
  },
});

export default RegisterScreen;
