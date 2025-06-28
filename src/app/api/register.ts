import axios from "axios";

export const registerUser = async (payload: {
  username: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SELLER}/auth/register`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Registration response:", response);

    const data = response.data;

    if (response.status === 201 && data.username && data.role) {
      console.log("Registration success:", data);
      return { success: true, user: data };
    } else {
      console.error("Registration failed:", data);
      return { success: false, message: data.message || "Unknown error" };
    }
  } catch (error: any) {
    if (error.response) {
      console.error("Registration failed:", error.response.data);
      return {
        success: false,
        message: error.response.data.message || "Registration failed",
      };
    } else if (error.request) {
      console.error("No response from server:", error.request);
      return { success: false, message: "No response from server" };
    } else {
      console.error("Error:", error.message);
      return { success: false, message: error.message };
    }
  }
};
