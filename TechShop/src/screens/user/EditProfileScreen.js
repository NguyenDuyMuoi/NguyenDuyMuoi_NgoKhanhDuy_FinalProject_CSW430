import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { updateUserProfile } from "../../api/userApi"; // ⭐ API bạn cần
const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [user, setUser] = useState(null);
 const isFocused = useIsFocused();
  // Load user từ AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem("user");
      if (data) {
        const u = JSON.parse(data);
        setUser(u);
        setName(u.name);
      }
    };
    loadUser();
  }, [isFocused]);

  const handleSave = async () => {
    if (!user) return;

    if (newPassword && newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải tối thiểu 6 ký tự!");
      return;
    }

    try {
      const body = {
        name,
        oldPassword,
        newPassword,
      };

      await updateUserProfile(user.id, body);

      // Update local AsyncStorage
      const updated = { ...user, name };
      await AsyncStorage.setItem("user", JSON.stringify(updated));

      Alert.alert("Thành công", "Cập nhật hồ sơ thành công!");
      navigation.goBack();
    } catch (error) {
      console.log("Update profile error:", error);
      Alert.alert("Lỗi", "Không thể cập nhật hồ sơ!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>

      <Text style={styles.label}>Tên hiển thị</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nhập tên mới"
      />

      <Text style={styles.label}>Mật khẩu hiện tại</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
        placeholder="Nhập mật khẩu cũ"
      />

      <Text style={styles.label}>Mật khẩu mới</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Nhập mật khẩu mới"
      />

      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>LƯU THAY ĐỔI</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7fb",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    color: "#fc2626ff",
    marginBottom: 20,
  },
  label: {
    color: "#444",
    fontWeight: "600",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  btn: {
    marginTop: 25,
    backgroundColor: "#d81919ff",
    padding: 15,
    borderRadius: 12,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
