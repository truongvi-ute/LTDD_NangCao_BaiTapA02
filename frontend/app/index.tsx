import { useEffect } from "react";
import { router } from "expo-router";
import { TokenManager } from "../utils/tokenManager";

export default function Index() {
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await TokenManager.getToken();
      
      if (token && !TokenManager.isTokenExpired(token)) {
        // Token hợp lệ, chuyển đến home
        router.replace("/home");
      } else {
        // Không có token hoặc token hết hạn, chuyển đến login
        await TokenManager.removeToken();
        router.replace("/login");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      router.replace("/login");
    }
  };

  return null;
}