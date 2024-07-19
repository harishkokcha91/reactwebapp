import request from "@/utils/request";
import ApiUrl from "@/config/api-url";

export async function userLogin(params) {
  return request(`${ApiUrl.ManApiUrl}/api/auth/login `, {
    origin: "",
    method: "POST",
    data: params,
  });
}

/**
 * Get graphic verification code
 * @param {*} params
 * @returns
 */
export async function fetchCaptcha(params) {
  return request(`${ApiUrl.ManApiUrl}/captcha`, {
    method: "GET",
    data: params,
  });
}

