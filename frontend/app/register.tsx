import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import api from "../constants/api";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleRegister = async () => {
    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        fullName,
      });
      Alert.alert("Thành công", "Tài khoản đã được tạo! Vui lòng kiểm tra email để kích hoạt tài khoản.", [
        {
          text: "OK",
          onPress: () => router.push(`/verify-otp?email=${encodeURIComponent(email)}&type=register`)
        }
      ]);
    } catch (error: any) {
      console.log("Register error:", error);
      let errorMessage = "Không thể kết nối server";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = "Đăng ký thất bại";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Lỗi", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formCard}>
        <Text style={styles.title}>Tham gia MAPIC</Text>

        <TextInput
          placeholder="Họ và tên"
          onChangeText={setFullName}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Email"
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Mật khẩu"
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Xác nhận mật khẩu"
          secureTextEntry
          onChangeText={setConfirmPassword}
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập ngay</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5", // Màu nền xám nhẹ hiện đại
    justifyContent: "center",
    padding: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    // Hiệu ứng đổ bóng cho Android & iOS
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a73e8", // Màu xanh chủ đạo
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#1a73e8",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#1a73e8",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});

export default RegisterScreen;
