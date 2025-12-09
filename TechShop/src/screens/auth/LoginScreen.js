import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { loginApi } from "../../api/authApi";
const LoginScreen = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleLoginPress = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      const res = await loginApi(email, password);

      console.log("SERVER RES:", res);

      // Backend trả res.user
      const user = res.user;

      if (!user) {
        Alert.alert("Lỗi", "Server không trả dữ liệu hợp lệ!");
        return;
      }

      // Lưu storage
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("role", user.role);
      await AsyncStorage.setItem("userId", user.id.toString());
      console.log(">> SAVED USER ID:", user.id)
      // Chuyển vào app
      onLogin(user.role);

    } catch (err) {
      console.log("Login error:", err);
      Alert.alert("Sai thông tin", "Email hoặc mật khẩu không đúng!");
    }
  };





  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>TechShop </Text>
        <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>

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

        <TouchableOpacity
          style={styles.button}
          onPress={handleLoginPress}
        >
          <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.linkText}>
            Chưa có tài khoản? <Text style={{ fontWeight: "bold" }}>Đăng ký</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f1f3ff", // pastel hồng
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ca141aff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f8f8f8ff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#f4ecf0ff",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#ea0606ff",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    textAlign: "center",
    color: "#555",
    marginBottom: 8,
  },
  footerNote: {
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});

export default LoginScreen;
