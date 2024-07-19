import request from "@/utils/request";
import ApiUrl from "@/config/api-url";

/**
 * Update password
 * @param {*} params
 * @returns
 */
export async function userUpdatePassword(params) {
  return request(`${ApiUrl.ManApiUrl}/user/update/password`, {
    method: "POST",
    data: params,
  });
}

/**
 * Get current user information
 * @param {*} params
 * @returns
 */
export async function queryCurrentUserInfo(params) {
  return request(`${ApiUrl.ManApiUrl}/user/info`, {
    method: "GET",
    data: params,
  });
}


/**
 * Update password
 * @param {*} params
 * @returns
 */
 export async function queryUpdateUserInfo(params) {
  return request(`${ApiUrl.ManApiUrl}/user/update/info`, {
    method: "POST",
    data: params,
  });
}
